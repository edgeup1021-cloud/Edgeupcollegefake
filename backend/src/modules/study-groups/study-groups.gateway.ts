import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import {
  StudyGroupMember,
  StudyGroupMemberStatus,
} from '../../database/entities/study-groups/study-group-member.entity';
import { StudyGroupTeacherModerator } from '../../database/entities/study-groups/study-group-teacher-moderator.entity';

@WebSocketGateway({
  namespace: '/study-groups',
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class StudyGroupsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(StudyGroupsGateway.name);

  // Track connected users: Map<userId, Set<socketId>>
  private connectedUsers = new Map<string, Set<string>>();

  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(StudyGroupMember)
    private readonly memberRepo: Repository<StudyGroupMember>,
    @InjectRepository(StudyGroupTeacherModerator)
    private readonly teacherModRepo: Repository<StudyGroupTeacherModerator>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Manually validate JWT token (guards don't run on lifecycle hooks)
      const token = this.extractToken(client);

      if (!token) {
        this.logger.warn(`Connection rejected: Missing authentication token - Socket: ${client.id}`);
        client.disconnect();
        return;
      }

      // Decode first to get portalType
      const decoded = this.jwtService.decode(token) as JwtPayload;

      if (!decoded || !decoded.portalType) {
        this.logger.warn(`Connection rejected: Invalid token format - Socket: ${client.id}`);
        client.disconnect();
        return;
      }

      // Get the correct secret based on portal type
      const portalSecretSuffix = `_${decoded.portalType.toUpperCase()}`;
      const secret = this.configService.get<string>('jwt.secret') + portalSecretSuffix;

      // Verify token with correct secret
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      if (!payload.sub || !payload.email || !payload.portalType) {
        this.logger.warn(`Connection rejected: Invalid token payload - Socket: ${client.id}`);
        client.disconnect();
        return;
      }

      // Attach user data to socket for later use
      client.data.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        userType: payload.userType,
        portalType: payload.portalType,
      };

      const user = client.data.user;

      // Track connection
      const userId = `${user.portalType}:${user.id}`;
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId)!.add(client.id);

      this.logger.log(
        `✅ User connected: ${user.email} (${user.portalType}:${user.id}) - Socket: ${client.id}`,
      );
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`, error.stack);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const user = client.data.user;

      if (user) {
        const userId = `${user.portalType}:${user.id}`;
        const sockets = this.connectedUsers.get(userId);

        if (sockets) {
          sockets.delete(client.id);
          if (sockets.size === 0) {
            this.connectedUsers.delete(userId);
          }
        }

        this.logger.log(
          `User disconnected: ${user.email} (${user.portalType}:${user.id}) - Socket: ${client.id}`,
        );
      } else {
        this.logger.log(`Socket disconnected: ${client.id} (no user data)`);
      }
    } catch (error) {
      this.logger.error(`Disconnect error: ${error.message}`, error.stack);
    }
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(
    @MessageBody() data: { groupId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!data?.groupId) {
        throw new WsException('Group ID is required');
      }

      const user = client.data.user;
      if (!user) {
        throw new WsException('Authentication required');
      }

      // Validate user has permission to join this group's room
      const hasPermission = await this.checkGroupPermission(
        data.groupId,
        user.id,
        user.portalType,
      );

      if (!hasPermission) {
        this.logger.warn(
          `Unauthorized join attempt: User ${user.id} (${user.portalType}) to Group ${data.groupId}`,
        );
        throw new WsException('You do not have permission to join this group');
      }

      const roomName = this.roomName(data.groupId);
      client.join(roomName);

      this.logger.log(
        `User ${user.email} joined room ${roomName} - Socket: ${client.id}`,
      );
    } catch (error) {
      this.logger.error(`Join group error: ${error.message}`, error.stack);
      throw error instanceof WsException ? error : new WsException('Failed to join group');
    }
  }

  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(
    @MessageBody() data: { groupId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!data?.groupId) return;

      const roomName = this.roomName(data.groupId);
      client.leave(roomName);

      const user = client.data.user;
      if (user) {
        this.logger.log(
          `User ${user.email} left room ${roomName} - Socket: ${client.id}`,
        );
      }
    } catch (error) {
      this.logger.error(`Leave group error: ${error.message}`, error.stack);
    }
  }

  async broadcastMessage(groupId: number, payload: any) {
    try {
      const room = this.roomName(groupId);
      const sockets = await this.server.in(room).fetchSockets();

      this.logger.log(
        `📢 Broadcasting message ${payload.id} to group ${groupId} room "${room}" with ${sockets.length} connected client(s)`,
      );

      this.server.to(room).emit('newMessage', payload);

      this.logger.debug(`✅ Broadcast successful for message ${payload.id}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to broadcast message to group ${groupId}: ${error.message}`,
        error.stack,
      );
      // Re-throw to let service handle it
      throw error;
    }
  }

  private async checkGroupPermission(
    groupId: number,
    userId: number,
    portalType: string,
  ): Promise<boolean> {
    try {
      // Check if student member
      if (portalType === 'student') {
        const membership = await this.memberRepo.findOne({
          where: {
            groupId,
            studentId: userId,
            status: StudyGroupMemberStatus.JOINED,
          },
        });
        return !!membership;
      }

      // Check if teacher moderator
      if (portalType === 'teacher') {
        const moderator = await this.teacherModRepo.findOne({
          where: {
            groupId,
            teacherId: userId,
          },
        });
        return !!moderator;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `Permission check failed for user ${userId} in group ${groupId}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  private roomName(groupId: number) {
    return `group_${groupId}`;
  }

  private extractToken(client: Socket): string | null {
    // Try multiple token sources (same as WsJwtGuard)
    // 1. Authorization header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // 2. Auth object (sent via socket.io client config)
    if (client.handshake.auth?.token) {
      const token = client.handshake.auth.token;
      return token.startsWith('Bearer ') ? token.substring(7) : token;
    }

    // 3. Query parameter (fallback)
    if (client.handshake.query?.token) {
      const token = client.handshake.query.token as string;
      return token.startsWith('Bearer ') ? token.substring(7) : token;
    }

    return null;
  }
}

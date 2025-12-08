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
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';
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
  ) {}

  async handleConnection(client: Socket) {
    try {
      const user = client.data.user;

      if (!user) {
        this.logger.warn(`Connection rejected: No user data attached`);
        client.disconnect();
        return;
      }

      // Track connection
      const userId = `${user.portalType}:${user.id}`;
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId)!.add(client.id);

      this.logger.log(
        `User connected: ${user.email} (${user.portalType}:${user.id}) - Socket: ${client.id}`,
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
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    // Extract token from multiple sources
    const token = this.extractToken(client);

    if (!token) {
      throw new WsException('Missing authentication token');
    }

    try {
      // Decode first to get portalType
      const decoded = this.jwtService.decode(token) as JwtPayload;

      if (!decoded || !decoded.portalType) {
        throw new WsException('Invalid token format');
      }

      // Get the correct secret based on portal type
      const portalSecretSuffix = `_${decoded.portalType.toUpperCase()}`;
      const secret = this.configService.get<string>('jwt.secret') + portalSecretSuffix;

      // Verify token with correct secret
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      if (!payload.sub || !payload.email || !payload.portalType) {
        throw new WsException('Invalid token payload');
      }

      // Attach user data to socket for later use
      client.data.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        userType: payload.userType,
        portalType: payload.portalType,
      };

      return true;
    } catch (error) {
      if (error instanceof WsException) {
        throw error;
      }
      throw new WsException('Authentication failed');
    }
  }

  private extractToken(client: Socket): string | null {
    // Try multiple token sources
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

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, PortalType } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request: Request, rawJwtToken: string, done: (err: any, secretOrKey?: string | Buffer) => void) => {
        // Decode token without verification to get portalType
        try {
          const decoded = this.jwtService.decode(rawJwtToken) as JwtPayload;
          if (decoded && decoded.portalType) {
            const portalSecretSuffix = `_${decoded.portalType.toUpperCase()}`;
            const secret = this.configService.get<string>('jwt.secret') + portalSecretSuffix;
            done(null, secret);
          } else {
            // Fallback to default secret for backwards compatibility
            done(null, this.configService.get<string>('jwt.secret'));
          }
        } catch (error) {
          done(error);
        }
      },
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email || !payload.portalType) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      userType: payload.userType,
      portalType: payload.portalType,
    };
  }
}

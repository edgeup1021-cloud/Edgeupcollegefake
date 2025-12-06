import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RefreshTokenPayload, PortalType } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKeyProvider: (request: Request, rawJwtToken: string, done: (err: any, secretOrKey?: string | Buffer) => void) => {
        // Decode token without verification to get portalType
        try {
          const decoded = this.jwtService.decode(rawJwtToken) as RefreshTokenPayload;
          if (decoded && decoded.portalType) {
            const portalSecretSuffix = `_${decoded.portalType.toUpperCase()}`;
            const secret = this.configService.get<string>('jwt.refreshSecret') + portalSecretSuffix;
            done(null, secret);
          } else {
            // Fallback to default secret for backwards compatibility
            done(null, this.configService.get<string>('jwt.refreshSecret'));
          }
        } catch (error) {
          done(error);
        }
      },
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: RefreshTokenPayload) {
    const refreshToken = req.body.refreshToken;

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      userType: payload.userType,
      portalType: payload.portalType,
      refreshToken,
    };
  }
}

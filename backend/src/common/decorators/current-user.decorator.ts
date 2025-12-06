import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PortalType } from '../../auth/interfaces/jwt-payload.interface';

export interface CurrentUserData {
  id: number;
  email: string;
  role: string;
  userType: string;
  portalType: PortalType;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserData;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('[JwtAuthGuard] canActivate - isPublic:', isPublic);
    console.log('[JwtAuthGuard] Handler:', context.getHandler().name);
    console.log('[JwtAuthGuard] Class:', context.getClass().name);

    if (isPublic) {
      console.log('[JwtAuthGuard] Route is public, allowing access');
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Check if route is public before throwing error
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('[JwtAuthGuard] handleRequest - isPublic:', isPublic, 'user:', !!user, 'err:', !!err);

    if (isPublic) {
      console.log('[JwtAuthGuard] handleRequest: Route is public, allowing without auth');
      return null; // Return null user for public routes
    }

    if (err || !user) {
      console.log('[JwtAuthGuard] handleRequest: Throwing Unauthorized');
      throw err || new UnauthorizedException();
    }

    return user;
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CurriculumAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;

    // For curriculum management endpoints, attach a dummy user to bypass authentication
    if (path.startsWith('/api/superadmin/courses') || path.startsWith('/api/superadmin/subjects')) {
      console.log(`[CurriculumAuthMiddleware] Attaching dummy user for path: ${path}`);
      (req as any).user = {
        id: 0,
        email: 'public@system.local',
        role: 'public',
        userType: 'public',
        portalType: 'public',
      };
    }

    next();
  }
}

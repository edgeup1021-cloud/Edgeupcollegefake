export enum PortalType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  MANAGEMENT = 'management',
  SUPERADMIN = 'superadmin',
}

export interface JwtPayload {
  sub: number | string; // Can be string when using bigint in database
  email: string;
  role: string;
  userType: string;
  portalType: PortalType;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload extends JwtPayload {
  tokenId?: string;
}

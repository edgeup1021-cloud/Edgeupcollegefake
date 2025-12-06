export enum PortalType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  MANAGEMENT = 'management',
}

export interface JwtPayload {
  sub: number;
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

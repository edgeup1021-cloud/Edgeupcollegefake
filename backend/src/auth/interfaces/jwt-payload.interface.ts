export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  userType: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload extends JwtPayload {
  tokenId?: string;
}

import jwt from 'jsonwebtoken';

/**
 * JWT utility functions for token management
 */

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export interface JWTPayload {
  userId: string;
  email: string;
  username?: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'auth-system',
      audience: 'web-app'
    }
  );
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_SECRET,
    { 
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'auth-system',
      audience: 'web-app'
    }
  );
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: Omit<JWTPayload, 'type'>): TokenPair {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  // Calculate expiration time in seconds
  const decoded = jwt.decode(accessToken) as any;
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
  
  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'auth-system',
      audience: 'web-app'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Decode token without verification (for expired tokens)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    return decoded.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

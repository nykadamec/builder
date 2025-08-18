import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyToken,
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
} from '@/lib/auth/jwt';

describe('JWT utilities', () => {
  const mockPayload = {
    userId: 'user123',
    email: 'test@example.com',
    username: 'testuser',
  };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = generateAccessToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include correct payload data', () => {
      const token = generateAccessToken(mockPayload);
      const decoded = decodeToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded!.userId).toBe(mockPayload.userId);
      expect(decoded!.email).toBe(mockPayload.email);
      expect(decoded!.username).toBe(mockPayload.username);
      expect(decoded!.type).toBe('access');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = generateRefreshToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include correct payload data', () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = decodeToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded!.userId).toBe(mockPayload.userId);
      expect(decoded!.email).toBe(mockPayload.email);
      expect(decoded!.username).toBe(mockPayload.username);
      expect(decoded!.type).toBe('refresh');
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const tokenPair = generateTokenPair(mockPayload);
      
      expect(tokenPair).toBeDefined();
      expect(tokenPair.accessToken).toBeDefined();
      expect(tokenPair.refreshToken).toBeDefined();
      expect(tokenPair.expiresIn).toBeGreaterThan(0);
    });

    it('should generate different tokens', () => {
      const tokenPair = generateTokenPair(mockPayload);
      
      expect(tokenPair.accessToken).not.toBe(tokenPair.refreshToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = generateAccessToken(mockPayload);
      const verified = verifyToken(token);
      
      expect(verified).toBeDefined();
      expect(verified.userId).toBe(mockPayload.userId);
      expect(verified.email).toBe(mockPayload.email);
      expect(verified.type).toBe('access');
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyToken(invalidToken)).toThrow('Invalid token');
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';
      
      expect(() => verifyToken(malformedToken)).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode valid token without verification', () => {
      const token = generateAccessToken(mockPayload);
      const decoded = decodeToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded!.userId).toBe(mockPayload.userId);
      expect(decoded!.email).toBe(mockPayload.email);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = decodeToken(invalidToken);
      
      expect(decoded).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const token = generateAccessToken(mockPayload);
      const expired = isTokenExpired(token);
      
      expect(expired).toBe(false);
    });

    it('should return true for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const expired = isTokenExpired(invalidToken);
      
      expect(expired).toBe(true);
    });
  });

  describe('getTokenExpiration', () => {
    it('should return expiration date for valid token', () => {
      const token = generateAccessToken(mockPayload);
      const expiration = getTokenExpiration(token);
      
      expect(expiration).toBeDefined();
      expect(expiration).toBeInstanceOf(Date);
      expect(expiration!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const expiration = getTokenExpiration(invalidToken);
      
      expect(expiration).toBeNull();
    });
  });
});

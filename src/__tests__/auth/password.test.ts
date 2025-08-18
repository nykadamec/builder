import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength, 
  generateSecurePassword 
} from '@/lib/auth/password';

describe('Password utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should throw error for short password', async () => {
      const shortPassword = '123';
      
      await expect(hashPassword(shortPassword)).rejects.toThrow(
        'Password must be at least 8 characters long'
      );
    });

    it('should throw error for empty password', async () => {
      await expect(hashPassword('')).rejects.toThrow();
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should return false for empty inputs', async () => {
      expect(await verifyPassword('', 'hash')).toBe(false);
      expect(await verifyPassword('password', '')).toBe(false);
      expect(await verifyPassword('', '')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const strongPassword = 'StrongPass123!';
      const result = validatePasswordStrength(strongPassword);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password without uppercase', () => {
      const password = 'weakpass123!';
      const result = validatePasswordStrength(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      const password = 'WEAKPASS123!';
      const result = validatePasswordStrength(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without numbers', () => {
      const password = 'WeakPassword!';
      const result = validatePasswordStrength(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special characters', () => {
      const password = 'WeakPassword123';
      const result = validatePasswordStrength(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should reject short password', () => {
      const password = 'Weak1!';
      const result = validatePasswordStrength(password);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject empty password', () => {
      const result = validatePasswordStrength('');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });
  });

  describe('generateSecurePassword', () => {
    it('should generate password with default length', () => {
      const password = generateSecurePassword();
      
      expect(password).toBeDefined();
      expect(password.length).toBe(16);
    });

    it('should generate password with custom length', () => {
      const length = 20;
      const password = generateSecurePassword(length);
      
      expect(password.length).toBe(length);
    });

    it('should generate password that meets requirements', () => {
      const password = generateSecurePassword();
      const validation = validatePasswordStrength(password);
      
      expect(validation.isValid).toBe(true);
    });

    it('should generate different passwords each time', () => {
      const password1 = generateSecurePassword();
      const password2 = generateSecurePassword();
      
      expect(password1).not.toBe(password2);
    });
  });
});

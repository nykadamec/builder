import {
  emailSchema,
  usernameSchema,
  passwordSchema,
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
  sanitizeInput,
  isValidEmail,
  isValidUsername,
  isEmailOrUsername,
} from '@/lib/auth/validation';

describe('Validation utilities', () => {
  describe('emailSchema', () => {
    it('should validate correct email', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];

      validEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('should reject invalid email', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        '',
      ];

      invalidEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });
  });

  describe('usernameSchema', () => {
    it('should validate correct username', () => {
      const validUsernames = [
        'user123',
        'test_user',
        'user-name',
        'TestUser',
      ];

      validUsernames.forEach(username => {
        expect(() => usernameSchema.parse(username)).not.toThrow();
      });
    });

    it('should reject invalid username', () => {
      const invalidUsernames = [
        'ab', // too short
        'a'.repeat(31), // too long
        'user@name', // invalid character
        'user name', // space
        'user.name', // dot
      ];

      invalidUsernames.forEach(username => {
        expect(() => usernameSchema.parse(username)).toThrow();
      });
    });
  });

  describe('passwordSchema', () => {
    it('should validate strong password', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MySecure@Password1',
        'Complex#Pass99',
      ];

      strongPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });

    it('should reject weak password', () => {
      const weakPasswords = [
        'weak', // too short
        'weakpassword', // no uppercase, number, special
        'WEAKPASSWORD', // no lowercase, number, special
        'WeakPassword', // no number, special
        'WeakPassword123', // no special
        'WeakPassword!', // no number
      ];

      weakPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).toThrow();
      });
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
      };

      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'StrongPass123!',
        confirmPassword: 'DifferentPass123!',
      };

      expect(() => registerSchema.parse(invalidData)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        emailOrUsername: 'test@example.com',
        password: 'password123',
      };

      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty fields', () => {
      const invalidData = {
        emailOrUsername: '',
        password: '',
      };

      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('changePasswordSchema', () => {
    it('should validate correct password change data', () => {
      const validData = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        confirmNewPassword: 'NewPass123!',
      };

      expect(() => changePasswordSchema.parse(validData)).not.toThrow();
    });

    it('should reject mismatched new passwords', () => {
      const invalidData = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        confirmNewPassword: 'DifferentPass123!',
      };

      expect(() => changePasswordSchema.parse(invalidData)).toThrow();
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should trim whitespace', () => {
      const input = '  test input  ';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('test input');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should return true for valid username', () => {
      expect(isValidUsername('testuser')).toBe(true);
    });

    it('should return false for invalid username', () => {
      expect(isValidUsername('ab')).toBe(false); // too short
    });
  });

  describe('isEmailOrUsername', () => {
    it('should identify email', () => {
      expect(isEmailOrUsername('test@example.com')).toBe('email');
    });

    it('should identify username', () => {
      expect(isEmailOrUsername('testuser')).toBe('username');
    });

    it('should identify invalid input', () => {
      expect(isEmailOrUsername('ab')).toBe('invalid');
    });
  });
});

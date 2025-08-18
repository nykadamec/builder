import { z } from 'zod';
import { PASSWORD_REQUIREMENTS } from './password';

/**
 * Validation schemas for authentication
 */

// Email validation
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(255, 'Email is too long');

// Username validation
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(30, 'Username must be at most 30 characters long')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
  .optional();

// Password validation
export const passwordSchema = z
  .string()
  .min(PASSWORD_REQUIREMENTS.minLength, `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`)
  .max(128, 'Password is too long')
  .refine((password) => {
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      return false;
    }
    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      return false;
    }
    if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
      return false;
    }
    if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return false;
    }
    return true;
  }, 'Password must contain uppercase, lowercase, number, and special character');

// Registration schema
export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Modern registration schema (without username)
export const modernRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Password change schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

// Profile update schema
export const updateProfileSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema,
  name: z.string().max(100, 'Name is too long').optional(),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Sanitize input string
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  try {
    usernameSchema.parse(username);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is email or username
 */
export function isEmailOrUsername(input: string): 'email' | 'username' | 'invalid' {
  if (isValidEmail(input)) {
    return 'email';
  }
  if (isValidUsername(input)) {
    return 'username';
  }
  return 'invalid';
}

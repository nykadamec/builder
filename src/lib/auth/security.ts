import crypto from 'crypto';
import { NextRequest } from 'next/server';

/**
 * Security utilities for authentication system
 */

/**
 * Generate cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(16);
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false;
  }
  
  // Simple CSRF verification - in production, use more sophisticated method
  return token === sessionToken;
}

/**
 * Hash sensitive data for comparison
 */
export function hashSensitiveData(data: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, 'sha512');
  return `${actualSalt}:${hash.toString('hex')}`;
}

/**
 * Verify hashed sensitive data
 */
export function verifySensitiveData(data: string, hashedData: string): boolean {
  try {
    const [salt, hash] = hashedData.split(':');
    const verifyHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512');
    return hash === verifyHash.toString('hex');
  } catch {
    return false;
  }
}

/**
 * Input sanitization functions
 */
export const sanitize = {
  /**
   * Remove HTML tags and dangerous characters
   */
  html: (input: string): string => {
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"&]/g, '') // Remove dangerous characters
      .trim();
  },
  
  /**
   * Sanitize for SQL (though we use Prisma ORM)
   */
  sql: (input: string): string => {
    return input
      .replace(/['";\\]/g, '') // Remove SQL injection characters
      .trim();
  },
  
  /**
   * Sanitize email
   */
  email: (input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9@._-]/g, '') // Only allow valid email characters
      .trim();
  },
  
  /**
   * Sanitize username
   */
  username: (input: string): string => {
    return input
      .replace(/[^a-zA-Z0-9_-]/g, '') // Only allow alphanumeric, underscore, hyphen
      .trim();
  },
  
  /**
   * General text sanitization
   */
  text: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  },
};

/**
 * Validate request origin
 */
export function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  if (!origin && !referer) {
    return false; // Require origin or referer
  }
  
  const requestOrigin = origin || (referer ? new URL(referer).origin : '');
  
  return allowedOrigins.includes(requestOrigin) || 
         allowedOrigins.includes('*');
}

/**
 * Check for suspicious patterns in input
 */
export function detectSuspiciousInput(input: string): {
  isSuspicious: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    /exec\s*\(/i,
    /script\s*>/i,
  ];
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      reasons.push('Potential SQL injection attempt');
      break;
    }
  }
  
  // Check for XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  
  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      reasons.push('Potential XSS attempt');
      break;
    }
  }
  
  // Check for path traversal
  if (input.includes('../') || input.includes('..\\')) {
    reasons.push('Potential path traversal attempt');
  }
  
  // Check for command injection
  const cmdPatterns = [
    /;\s*rm\s/i,
    /;\s*cat\s/i,
    /;\s*ls\s/i,
    /;\s*wget\s/i,
    /;\s*curl\s/i,
    /\|\s*nc\s/i,
  ];
  
  for (const pattern of cmdPatterns) {
    if (pattern.test(input)) {
      reasons.push('Potential command injection attempt');
      break;
    }
  }
  
  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}

/**
 * Rate limiting key generators
 */
export const rateLimitKeys = {
  /**
   * Generate key by IP address
   */
  byIP: (request: NextRequest): string => {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return `ip:${forwarded.split(',')[0].trim()}`;
    }
    
    if (realIP) {
      return `ip:${realIP}`;
    }
    
    return `ip:${request.ip || 'unknown'}`;
  },
  
  /**
   * Generate key by user ID
   */
  byUser: (userId: string): string => {
    return `user:${userId}`;
  },
  
  /**
   * Generate key by email
   */
  byEmail: (email: string): string => {
    return `email:${email.toLowerCase()}`;
  },
  
  /**
   * Generate key by IP and endpoint
   */
  byIPAndEndpoint: (request: NextRequest): string => {
    const ip = rateLimitKeys.byIP(request);
    const endpoint = request.nextUrl.pathname;
    return `${ip}:${endpoint}`;
  },
};

/**
 * Security headers configuration
 */
export const securityHeaders = {
  /**
   * Content Security Policy
   */
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
  },
  
  /**
   * Generate CSP header string
   */
  generateCSP: (): string => {
    return Object.entries(securityHeaders.csp)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  },
  
  /**
   * Standard security headers
   */
  standard: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },
};

/**
 * Timing attack prevention
 */
export async function constantTimeDelay(minMs: number = 100, maxMs: number = 300): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

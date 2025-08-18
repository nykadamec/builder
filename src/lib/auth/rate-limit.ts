import { PrismaClient } from '@prisma/client';

/**
 * Rate limiting utilities for authentication
 */

const prisma = new PrismaClient();

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
const LOGIN_RATE_LIMIT_MAX = parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5');

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

/**
 * Check login rate limit for email
 */
export async function checkLoginRateLimit(email: string, ipAddress: string): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  
  // Count failed login attempts in the time window
  const failedAttempts = await prisma.loginAttempt.count({
    where: {
      email,
      success: false,
      timestamp: {
        gte: windowStart,
      },
    },
  });
  
  const remaining = Math.max(0, LOGIN_RATE_LIMIT_MAX - failedAttempts);
  const resetTime = new Date(Date.now() + RATE_LIMIT_WINDOW_MS);
  
  if (failedAttempts >= LOGIN_RATE_LIMIT_MAX) {
    return {
      success: false,
      limit: LOGIN_RATE_LIMIT_MAX,
      remaining: 0,
      resetTime,
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    };
  }
  
  return {
    success: true,
    limit: LOGIN_RATE_LIMIT_MAX,
    remaining,
    resetTime,
  };
}

/**
 * Record login attempt
 */
export async function recordLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean,
  userAgent?: string
): Promise<void> {
  await prisma.loginAttempt.create({
    data: {
      email,
      ipAddress,
      success,
      userAgent,
    },
  });
}

/**
 * Check IP-based rate limit
 */
export async function checkIpRateLimit(ipAddress: string): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  
  // Count requests from this IP in the time window
  const requestCount = await prisma.loginAttempt.count({
    where: {
      ipAddress,
      timestamp: {
        gte: windowStart,
      },
    },
  });
  
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestCount);
  const resetTime = new Date(Date.now() + RATE_LIMIT_WINDOW_MS);
  
  if (requestCount >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      success: false,
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: 0,
      resetTime,
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    };
  }
  
  return {
    success: true,
    limit: RATE_LIMIT_MAX_REQUESTS,
    remaining,
    resetTime,
  };
}

/**
 * Clean up old login attempts (should be run periodically)
 */
export async function cleanupOldLoginAttempts(): Promise<number> {
  const cutoffDate = new Date(Date.now() - RATE_LIMIT_WINDOW_MS * 2); // Keep data for 2x the window
  
  const result = await prisma.loginAttempt.deleteMany({
    where: {
      timestamp: {
        lt: cutoffDate,
      },
    },
  });
  
  return result.count;
}

/**
 * Get rate limit headers for HTTP responses
 */
export function getRateLimitHeaders(rateLimitResult: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': rateLimitResult.limit.toString(),
    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime.getTime() / 1000).toString(),
  };
  
  if (rateLimitResult.retryAfter) {
    headers['Retry-After'] = rateLimitResult.retryAfter.toString();
  }
  
  return headers;
}

/**
 * Memory-based rate limiter for simple cases
 */
class MemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private windowMs: number = RATE_LIMIT_WINDOW_MS,
    private maxRequests: number = RATE_LIMIT_MAX_REQUESTS
  ) {}
  
  check(key: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get existing requests for this key
    const requests = this.requests.get(key) || [];
    
    // Filter out old requests
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Update the map
    this.requests.set(key, validRequests);
    
    const remaining = Math.max(0, this.maxRequests - validRequests.length);
    const resetTime = new Date(now + this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        resetTime,
        retryAfter: Math.ceil(this.windowMs / 1000),
      };
    }
    
    // Record this request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return {
      success: true,
      limit: this.maxRequests,
      remaining: remaining - 1,
      resetTime,
    };
  }
  
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

export const memoryRateLimiter = new MemoryRateLimiter();

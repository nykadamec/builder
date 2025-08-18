import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';
import { getUserById, AuthUser } from './service';
import { getRateLimitHeaders, memoryRateLimiter } from './rate-limit';

/**
 * Authentication middleware for Next.js API routes
 */

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser;
  token?: JWTPayload;
}

/**
 * Extract token from request headers
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check for token in cookies
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

/**
 * Authentication middleware
 */
export async function authMiddleware(
  request: NextRequest,
  options: {
    required?: boolean;
    roles?: string[];
  } = {}
): Promise<{ success: boolean; response?: NextResponse; user?: AuthUser; token?: JWTPayload }> {
  try {
    const token = extractToken(request);
    
    if (!token) {
      if (options.required) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          ),
        };
      }
      return { success: true };
    }
    
    // Verify token
    let payload: JWTPayload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      if (options.required) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
          ),
        };
      }
      return { success: true };
    }
    
    // Get user data
    const user = await getUserById(payload.userId);
    if (!user) {
      if (options.required) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'User not found' },
            { status: 401 }
          ),
        };
      }
      return { success: true };
    }
    
    return {
      success: true,
      user,
      token: payload,
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (options.required) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Authentication failed' },
          { status: 500 }
        ),
      };
    }
    
    return { success: true };
  }
}

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(
  request: NextRequest,
  options: {
    windowMs?: number;
    maxRequests?: number;
    keyGenerator?: (req: NextRequest) => string;
  } = {}
): { success: boolean; response?: NextResponse } {
  const clientIP = getClientIP(request);
  const key = options.keyGenerator ? options.keyGenerator(request) : clientIP;
  
  const rateLimiter = options.windowMs || options.maxRequests 
    ? new (memoryRateLimiter.constructor as any)(options.windowMs, options.maxRequests)
    : memoryRateLimiter;
  
  const result = rateLimiter.check(key);
  
  if (!result.success) {
    const headers = getRateLimitHeaders(result);
    
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: result.retryAfter 
        },
        { 
          status: 429,
          headers,
        }
      ),
    };
  }
  
  return { success: true };
}

/**
 * CORS middleware
 */
export function corsMiddleware(
  request: NextRequest,
  options: {
    origin?: string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    credentials?: boolean;
  } = {}
): NextResponse | null {
  const origin = request.headers.get('origin');
  const method = request.method;
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    // Set CORS headers
    if (options.origin) {
      if (Array.isArray(options.origin)) {
        if (origin && options.origin.includes(origin)) {
          response.headers.set('Access-Control-Allow-Origin', origin);
        }
      } else if (options.origin === '*' || options.origin === origin) {
        response.headers.set('Access-Control-Allow-Origin', options.origin);
      }
    }
    
    if (options.methods) {
      response.headers.set('Access-Control-Allow-Methods', options.methods.join(', '));
    }
    
    if (options.allowedHeaders) {
      response.headers.set('Access-Control-Allow-Headers', options.allowedHeaders.join(', '));
    }
    
    if (options.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
    
    return response;
  }
  
  return null;
}

/**
 * Security headers middleware
 */
export function securityHeadersMiddleware(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Combined middleware wrapper for API routes
 */
export function withAuth(
  handler: (req: NextRequest, context: { user?: AuthUser; token?: JWTPayload }) => Promise<NextResponse>,
  options: {
    auth?: { required?: boolean; roles?: string[] };
    rateLimit?: { windowMs?: number; maxRequests?: number };
    cors?: { origin?: string | string[]; methods?: string[]; allowedHeaders?: string[]; credentials?: boolean };
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // CORS handling
      if (options.cors) {
        const corsResponse = corsMiddleware(request, options.cors);
        if (corsResponse) {
          return corsResponse;
        }
      }
      
      // Rate limiting
      if (options.rateLimit) {
        const rateLimitResult = rateLimitMiddleware(request, options.rateLimit);
        if (!rateLimitResult.success) {
          return rateLimitResult.response!;
        }
      }
      
      // Authentication
      const authResult = await authMiddleware(request, options.auth);
      if (!authResult.success) {
        return authResult.response!;
      }
      
      // Call the actual handler
      const response = await handler(request, {
        user: authResult.user,
        token: authResult.token,
      });
      
      // Add security headers
      const securityHeaders = securityHeadersMiddleware();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

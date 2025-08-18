import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/auth/validation';
import { loginUser } from '@/lib/auth/service';
import { withAuth } from '@/lib/auth/middleware';

/**
 * User login API endpoint
 */

async function loginHandler(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    
    const { emailOrUsername, password } = validation.data;
    
    // Get client info
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'unknown';
    
    const userAgent = request.headers.get('user-agent') || undefined;
    
    // Attempt login
    const result = await loginUser(
      { emailOrUsername, password },
      clientIP,
      userAgent
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }
    
    // Set auth cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: result.user,
        tokens: result.tokens,
      },
      { status: 200 }
    );
    
    // Set HTTP-only cookie for the access token
    response.cookies.set('auth-token', result.tokens!.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply middleware with rate limiting
export const POST = withAuth(loginHandler, {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 login attempts per 15 minutes
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL!] 
      : ['http://localhost:3000'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

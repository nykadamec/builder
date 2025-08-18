import { NextRequest, NextResponse } from 'next/server';
import { registerSchema, modernRegisterSchema } from '@/lib/auth/validation';
import { registerUser } from '@/lib/auth/service';
import { withAuth } from '@/lib/auth/middleware';

/**
 * User registration API endpoint
 */

async function registerHandler(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json();
    
    // Try modern schema first (without username), then fallback to full schema
    let validation = modernRegisterSchema.safeParse(body);
    let isModernForm = true;

    if (!validation.success) {
      validation = registerSchema.safeParse(body);
      isModernForm = false;
    }

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const username = isModernForm ? undefined : (validation.data as any).username;
    const name = isModernForm ? (validation.data as any).name : (validation.data as any).name;
    
    // Get client IP
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    
    // Register user
    const result = await registerUser(
      { email, username, password, name },
      clientIP
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    // Set auth cookie
    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: result.user,
        tokens: result.tokens,
      },
      { status: 201 }
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply middleware with rate limiting
export const POST = withAuth(registerHandler, {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 registration attempts per 15 minutes
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

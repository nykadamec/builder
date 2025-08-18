import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';

/**
 * User logout API endpoint
 */

async function logoutHandler(request: NextRequest): Promise<NextResponse> {
  try {
    // Create response
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
    
    // Clear auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply middleware
export const POST = withAuth(logoutHandler, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL!] 
      : ['http://localhost:3000'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

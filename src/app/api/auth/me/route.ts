import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { AuthUser } from '@/lib/auth/service';

/**
 * Get current user profile API endpoint
 */

async function meHandler(
  request: NextRequest,
  context: { user?: AuthUser }
): Promise<NextResponse> {
  try {
    if (!context.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      {
        user: context.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply middleware with authentication required
export const GET = withAuth(meHandler, {
  auth: { required: true },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL!] 
      : ['http://localhost:3000'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

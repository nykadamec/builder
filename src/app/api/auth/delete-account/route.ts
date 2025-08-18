import { NextRequest, NextResponse } from 'next/server';
import { deleteUserAccount, AuthUser } from '@/lib/auth/service';
import { withAuth } from '@/lib/auth/middleware';

/**
 * Delete user account API endpoint
 */

async function deleteAccountHandler(
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
    
    // Parse request body for confirmation
    const body = await request.json();
    const { confirmation } = body;
    
    // Require explicit confirmation
    if (confirmation !== 'DELETE_MY_ACCOUNT') {
      return NextResponse.json(
        { 
          error: 'Account deletion requires confirmation',
          required: 'Send { "confirmation": "DELETE_MY_ACCOUNT" } to confirm deletion'
        },
        { status: 400 }
      );
    }
    
    // Delete account
    const result = await deleteUserAccount(context.user.id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    // Create response and clear auth cookie
    const response = NextResponse.json(
      { message: 'Account deleted successfully' },
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
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply middleware with authentication required
export const DELETE = withAuth(deleteAccountHandler, {
  auth: { required: true },
  rateLimit: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 deletion attempts per hour
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL!] 
      : ['http://localhost:3000'],
    methods: ['DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

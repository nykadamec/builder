import { NextRequest, NextResponse } from 'next/server';
import { changePasswordSchema } from '@/lib/auth/validation';
import { changeUserPassword, AuthUser } from '@/lib/auth/service';
import { withAuth } from '@/lib/auth/middleware';

/**
 * Change password API endpoint
 */

async function changePasswordHandler(
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
    
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = changePasswordSchema.safeParse(body);
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
    
    const { currentPassword, newPassword } = validation.data;
    
    // Change password
    const result = await changeUserPassword(
      context.user.id,
      currentPassword,
      newPassword
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply middleware with authentication required
export const POST = withAuth(changePasswordHandler, {
  auth: { required: true },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 password changes per 15 minutes
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL!] 
      : ['http://localhost:3000'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

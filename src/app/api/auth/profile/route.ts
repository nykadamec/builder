import { NextRequest, NextResponse } from 'next/server';
import { updateProfileSchema } from '@/lib/auth/validation';
import { updateUserProfile, AuthUser } from '@/lib/auth/service';
import { withAuth } from '@/lib/auth/middleware';

/**
 * Update user profile API endpoint
 */

async function updateProfileHandler(
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
    const validation = updateProfileSchema.safeParse(body);
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
    
    const { email, username, name } = validation.data;
    
    // Update profile
    const result = await updateUserProfile(context.user.id, {
      email,
      username,
      name,
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: result.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply middleware with authentication required
export const PUT = withAuth(updateProfileHandler, {
  auth: { required: true },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 profile updates per 15 minutes
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXTAUTH_URL!] 
      : ['http://localhost:3000'],
    methods: ['PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

import { PrismaClient, User } from '@prisma/client';
import { hashPassword, verifyPassword } from './password';
import { generateTokenPair, TokenPair } from './jwt';
import { sanitizeInput, isEmailOrUsername } from './validation';
import { checkLoginRateLimit, recordLoginAttempt } from './rate-limit';

/**
 * Authentication service for user management
 */

const prisma = new PrismaClient();

export interface AuthUser {
  id: string;
  username?: string | null;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterData {
  email: string;
  username?: string;
  password: string;
  name?: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  tokens?: TokenPair;
  error?: string;
}

/**
 * Register a new user
 */
export async function registerUser(
  data: RegisterData,
  ipAddress: string
): Promise<AuthResult> {
  try {
    const { email, username, password, name } = data;
    
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedUsername = username ? sanitizeInput(username) : undefined;
    const sanitizedName = name ? sanitizeInput(name) : undefined;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: sanitizedEmail },
          ...(sanitizedUsername ? [{ username: sanitizedUsername }] : []),
        ],
      },
    });
    
    if (existingUser) {
      if (existingUser.email === sanitizedEmail) {
        return { success: false, error: 'Email already registered' };
      }
      if (existingUser.username === sanitizedUsername) {
        return { success: false, error: 'Username already taken' };
      }
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        username: sanitizedUsername,
        name: sanitizedName,
        password_hash: passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      username: user.username || undefined,
    });
    
    // Record successful login attempt
    await recordLoginAttempt(sanitizedEmail, ipAddress, true);
    
    return {
      success: true,
      user,
      tokens,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

/**
 * Login user
 */
export async function loginUser(
  data: LoginData,
  ipAddress: string,
  userAgent?: string
): Promise<AuthResult> {
  try {
    const { emailOrUsername, password } = data;
    
    // Sanitize input
    const sanitizedInput = sanitizeInput(emailOrUsername.toLowerCase());
    
    // Determine if input is email or username
    const inputType = isEmailOrUsername(sanitizedInput);
    if (inputType === 'invalid') {
      return { success: false, error: 'Invalid email or username format' };
    }
    
    // Check rate limit
    const rateLimitResult = await checkLoginRateLimit(sanitizedInput, ipAddress);
    if (!rateLimitResult.success) {
      return { 
        success: false, 
        error: `Too many failed attempts. Try again in ${Math.ceil(rateLimitResult.retryAfter! / 60)} minutes` 
      };
    }
    
    // Find user
    const user = await prisma.user.findFirst({
      where: inputType === 'email' 
        ? { email: sanitizedInput }
        : { username: sanitizedInput },
    });
    
    if (!user || !user.password_hash) {
      await recordLoginAttempt(sanitizedInput, ipAddress, false, userAgent);
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      await recordLoginAttempt(sanitizedInput, ipAddress, false, userAgent);
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Record successful login
    await recordLoginAttempt(sanitizedInput, ipAddress, true, userAgent);
    
    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      username: user.username || undefined,
    });
    
    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    
    return {
      success: true,
      user: authUser,
      tokens,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<User, 'email' | 'username' | 'name'>>
): Promise<AuthResult> {
  try {
    // Sanitize inputs
    const updateData: any = {};
    if (data.email) {
      updateData.email = sanitizeInput(data.email.toLowerCase());
    }
    if (data.username) {
      updateData.username = sanitizeInput(data.username);
    }
    if (data.name !== undefined) {
      updateData.name = data.name ? sanitizeInput(data.name) : null;
    }
    
    // Check for conflicts
    if (updateData.email || updateData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                ...(updateData.email ? [{ email: updateData.email }] : []),
                ...(updateData.username ? [{ username: updateData.username }] : []),
              ],
            },
          ],
        },
      });
      
      if (existingUser) {
        if (existingUser.email === updateData.email) {
          return { success: false, error: 'Email already in use' };
        }
        if (existingUser.username === updateData.username) {
          return { success: false, error: 'Username already taken' };
        }
      }
    }
    
    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return { success: true, user };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Profile update failed' };
  }
}

/**
 * Change user password
 */
export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user || !user.password_hash) {
      return { success: false, error: 'User not found' };
    }
    
    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);
    
    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: newPasswordHash },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Password change failed' };
  }
}

/**
 * Delete user account
 */
export async function deleteUserAccount(userId: string): Promise<AuthResult> {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Delete account error:', error);
    return { success: false, error: 'Account deletion failed' };
  }
}

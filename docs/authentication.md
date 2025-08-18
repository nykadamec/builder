# Authentication System Documentation

## Overview

This application includes a comprehensive authentication and user account management system built with Next.js, Prisma, SQLite, and JWT tokens. The system provides secure user registration, login, profile management, and account deletion functionality.

## Features

### Core Authentication
- **User Registration**: Email/username and password-based registration
- **User Login**: Support for both email and username login
- **JWT Tokens**: Secure token-based authentication with access and refresh tokens
- **Password Security**: bcrypt hashing with configurable rounds
- **Session Management**: HTTP-only cookies for secure token storage

### Route Protection
- **Next.js Middleware**: Automatic route protection at the server level
- **Protected Routes**: Builder, dashboard, profile, and admin pages require authentication
- **Public Routes**: Login and register pages redirect authenticated users
- **Return URLs**: Automatic redirect to intended page after login
- **React Context**: Client-side authentication state management

### Security Features
- **Rate Limiting**: Configurable rate limits for login attempts and API endpoints
- **Input Validation**: Comprehensive validation using Zod schemas
- **Input Sanitization**: Protection against XSS and injection attacks
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Security Headers**: Standard security headers (CSP, HSTS, etc.)
- **Password Requirements**: Configurable password complexity requirements

### Account Management
- **Profile Updates**: Change email, username, and display name
- **Password Changes**: Secure password change with current password verification
- **Account Deletion**: Secure account deletion with confirmation
- **User Profile**: View account information and creation date

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  username      String?   @unique
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password_hash String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // ... other fields
}
```

### Security Models
```prisma
model LoginAttempt {
  id        String   @id @default(cuid())
  email     String
  ipAddress String
  success   Boolean
  timestamp DateTime @default(now())
  userAgent String?
}

model PasswordReset {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expires   DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username", // optional
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "name": "Full Name" // optional
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "name": "Full Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": 604800
  }
}
```

#### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { /* user object */ },
  "tokens": { /* token object */ }
}
```

#### POST /api/auth/logout
Logout user and clear session.

**Response:**
```json
{
  "message": "Logout successful"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication).

**Response:**
```json
{
  "user": { /* user object */ }
}
```

### Account Management Endpoints

#### PUT /api/auth/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "email": "newemail@example.com", // optional
  "username": "newusername", // optional
  "name": "New Name" // optional
}
```

#### POST /api/auth/change-password
Change user password (requires authentication).

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmNewPassword": "NewPass123!"
}
```

#### DELETE /api/auth/delete-account
Delete user account (requires authentication).

**Request Body:**
```json
{
  "confirmation": "DELETE_MY_ACCOUNT"
}
```

## Frontend Components

### Authentication Forms

#### LoginForm
React component for user login with validation and error handling.

```tsx
import LoginForm from '@/components/auth/LoginForm';

<LoginForm
  onSuccess={() => router.push('/dashboard')}
  redirectTo="/dashboard"
/>
```

#### RegisterForm
React component for user registration with password requirements display.

```tsx
import RegisterForm from '@/components/auth/RegisterForm';

<RegisterForm
  onSuccess={() => router.push('/welcome')}
  redirectTo="/welcome"
/>
```

#### ProfileForm
React component for profile management.

```tsx
import ProfileForm from '@/components/auth/ProfileForm';

<ProfileForm
  user={currentUser}
  onUpdate={(updatedUser) => setUser(updatedUser)}
/>
```

#### ChangePasswordForm
React component for password changes.

```tsx
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';

<ChangePasswordForm />
```

### Route Protection Components

#### ProtectedRoute
Component that requires authentication to render children.

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

<ProtectedRoute>
  <SensitiveContent />
</ProtectedRoute>
```

#### AuthenticatedOnly / UnauthenticatedOnly
Conditional rendering based on authentication status.

```tsx
import { AuthenticatedOnly, UnauthenticatedOnly } from '@/components/auth/ProtectedRoute';

<AuthenticatedOnly>
  <UserMenu />
</AuthenticatedOnly>

<UnauthenticatedOnly>
  <LoginButton />
</UnauthenticatedOnly>
```

#### withAuth HOC
Higher-order component for protecting entire pages.

```tsx
import { withAuth } from '@/components/auth/ProtectedRoute';

const ProtectedPage = withAuth(MyComponent);
```

### Authentication Context

#### AuthProvider
Wrap your app with the authentication provider.

```tsx
import { AuthProvider } from '@/contexts/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>
```

#### useAuth Hook
Access authentication state and functions.

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## Route Protection

### Next.js Middleware

The application uses Next.js middleware to automatically protect routes at the server level.

#### Protected Routes
These routes require authentication and will redirect to login if not authenticated:
- `/builder` - AI Builder interface
- `/dashboard` - User dashboard
- `/profile` - User profile management
- `/settings` - Application settings
- `/admin` - Admin panel
- `/api/protected/*` - Protected API endpoints

#### Public Routes
These routes redirect authenticated users to dashboard:
- `/login` - Login page
- `/register` - Registration page

#### Configuration
The middleware is configured in `src/middleware.ts` and automatically runs on all routes except:
- Static files (`/_next/static/*`)
- Image optimization (`/_next/image/*`)
- Favicon and public assets
- Public API routes (`/api/auth/*`)

### Client-Side Protection

#### React Context
The `AuthProvider` manages authentication state across the application:

```tsx
// Wrap your app
<AuthProvider>
  <YourApp />
</AuthProvider>
```

#### Protected Components
Use protection components for conditional rendering:

```tsx
// Require authentication
<ProtectedRoute>
  <SensitiveContent />
</ProtectedRoute>

// Show only to authenticated users
<AuthenticatedOnly>
  <UserMenu />
</AuthenticatedOnly>

// Show only to unauthenticated users
<UnauthenticatedOnly>
  <LoginPrompt />
</UnauthenticatedOnly>
```

#### Custom Hooks
Use authentication hooks for advanced scenarios:

```tsx
// Require auth with custom redirect
const { user, loading } = useRequireAuth('/custom-login');

// Handle login with return URL
const { handleLogin, isLoading, error } = useLogin();

// Check permissions
const { hasPermission, isAdmin } = usePermissions();
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# JWT
JWT_SECRET="your-jwt-secret-key-here-change-in-production"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5

# Security
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=8
```

### Password Requirements

Default password requirements (configurable):
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Security Considerations

### Rate Limiting
- Login attempts: 5 per 15 minutes per email
- Registration: 5 per 15 minutes per IP
- Profile updates: 10 per 15 minutes per user
- Password changes: 5 per 15 minutes per user

### Token Security
- Access tokens expire in 7 days (configurable)
- Refresh tokens expire in 30 days (configurable)
- Tokens stored in HTTP-only cookies
- CSRF protection for state-changing operations

### Input Validation
- All inputs validated using Zod schemas
- SQL injection protection via Prisma ORM
- XSS protection via input sanitization
- Suspicious input pattern detection

## Testing

Run the test suite:

```bash
# Run all tests
pnpm test

# Run authentication tests only
pnpm test auth

# Run tests with coverage
pnpm test --coverage
```

Test files are located in `src/__tests__/auth/`:
- `password.test.ts` - Password utilities tests
- `jwt.test.ts` - JWT token tests
- `validation.test.ts` - Input validation tests

## Usage Examples

### Protecting Routes with Middleware

```tsx
import { withAuth } from '@/lib/auth/middleware';

export const GET = withAuth(async (request, { user }) => {
  // Protected route handler
  return NextResponse.json({ user });
}, {
  auth: { required: true },
  rateLimit: { maxRequests: 100 }
});
```

### Using Authentication in Components

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => router.push('/login'));
  }, []);

  if (!user) return <div>Loading...</div>;

  return <div>Welcome, {user.name || user.email}!</div>;
}
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure SQLite database file is writable
2. **JWT Errors**: Verify JWT_SECRET is set and consistent
3. **Rate Limiting**: Check if rate limits are being hit
4. **CORS Issues**: Configure CORS origins for your domain

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=auth:*
```

## Migration from Other Systems

If migrating from another authentication system:

1. Export user data in compatible format
2. Hash existing passwords with bcrypt
3. Update database schema as needed
4. Test authentication flows thoroughly

## Performance Considerations

- Use connection pooling for database
- Implement token blacklisting for logout
- Consider Redis for rate limiting in production
- Monitor authentication endpoint performance

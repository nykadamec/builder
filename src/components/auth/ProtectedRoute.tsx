'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Protected route component that requires authentication
 */

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/login',
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      // Get current path for return URL
      const currentPath = window.location.pathname;
      const loginUrl = `${redirectTo}?returnTo=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if not authenticated and fallback is provided
  if (requireAuth && !user && fallback) {
    return <>{fallback}</>;
  }

  // Don't render anything if not authenticated and no fallback
  if (requireAuth && !user) {
    return null;
  }

  // Render children if authenticated or auth not required
  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    redirectTo?: string;
    fallback?: ReactNode;
  } = {}
) {
  const ProtectedComponent = (props: P) => {
    return (
      <ProtectedRoute 
        redirectTo={options.redirectTo}
        fallback={options.fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  ProtectedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return ProtectedComponent;
}

/**
 * Component that only renders for authenticated users
 */
export function AuthenticatedOnly({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

/**
 * Component that only renders for unauthenticated users
 */
export function UnauthenticatedOnly({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

/**
 * Loading component for authentication states
 */
export function AuthLoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">Authenticating...</p>
      </div>
    </div>
  );
}

/**
 * Unauthorized access component
 */
export function UnauthorizedAccess({ 
  message = "You need to be logged in to access this page.",
  showLoginButton = true 
}: { 
  message?: string;
  showLoginButton?: boolean;
}) {
  const router = useRouter();

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    const loginUrl = `/login?returnTo=${encodeURIComponent(currentPath)}`;
    router.push(loginUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl text-center max-w-md">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V9m0 0V7m0 2h2m-2 0H10" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        
        {showLoginButton && (
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

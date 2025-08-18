'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Custom hooks for authentication
 */

/**
 * Main authentication hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook that requires authentication and redirects if not authenticated
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname;
      const loginUrl = `${redirectTo}?returnTo=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [user, loading, redirectTo, router]);

  return { user, loading, isAuthenticated: !!user };
}

/**
 * Hook for checking if user has specific permissions
 */
export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Add your permission logic here
    // For now, all authenticated users have all permissions
    return true;
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    
    // Add your role logic here
    // For now, return true for basic roles
    return ['user', 'admin'].includes(role);
  };

  const isAdmin = (): boolean => {
    if (!user) return false;
    
    // Add your admin check logic here
    // For now, check if user email contains 'admin'
    return user.email.includes('admin');
  };

  return {
    hasPermission,
    hasRole,
    isAdmin,
  };
}

/**
 * Hook for handling authentication redirects
 */
export function useAuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const redirectIfAuthenticated = (to: string = '/dashboard') => {
    useEffect(() => {
      if (!loading && user) {
        router.push(to);
      }
    }, [user, loading, to, router]);
  };

  const redirectIfNotAuthenticated = (to: string = '/login') => {
    useEffect(() => {
      if (!loading && !user) {
        const currentPath = window.location.pathname;
        const loginUrl = `${to}?returnTo=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
      }
    }, [user, loading, to, router]);
  };

  return {
    redirectIfAuthenticated,
    redirectIfNotAuthenticated,
  };
}

/**
 * Hook for managing login state
 */
export function useLogin() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (emailOrUsername: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(emailOrUsername, password);
      
      if (result.success) {
        // Check for return URL
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('returnTo');
        
        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Hook for managing registration state
 */
export function useRegister() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (data: {
    email: string;
    username?: string;
    password: string;
    confirmPassword: string;
    name?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await register(data);
      
      if (result.success) {
        // Check for return URL
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('returnTo');
        
        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleRegister,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogout,
    isLoading,
  };
}

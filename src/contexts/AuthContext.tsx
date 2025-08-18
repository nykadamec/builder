'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Authentication context for managing user state across the application
 */

export interface User {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  username?: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetch current user from API
   */
  const fetchUser = async (): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  };

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    const initAuth = async () => {
      const userData = await fetchUser();
      setUser(userData);
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = async (emailOrUsername: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Register function
   */
  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setUser(responseData.user);
        return { success: true };
      } else {
        return { success: false, error: responseData.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  /**
   * Update user data in context
   */
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  /**
   * Refresh user data from server
   */
  const refreshUser = async () => {
    const userData = await fetchUser();
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to require authentication
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}

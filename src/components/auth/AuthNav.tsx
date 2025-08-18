'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthenticatedOnly, UnauthenticatedOnly } from './ProtectedRoute';

/**
 * Authentication navigation component
 */

export default function AuthNav() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              AI Builder
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <AuthenticatedOnly>
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/builder" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Builder
              </Link>
              <Link 
                href="/profile" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Profile
              </Link>
            </AuthenticatedOnly>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <UnauthenticatedOnly>
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </UnauthenticatedOnly>

              <AuthenticatedOnly>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300">
                    {user?.name || user?.email}
                  </span>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </AuthenticatedOnly>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Simple auth status indicator
 */
export function AuthStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-sm">
      {user ? (
        <div className="text-green-400">
          ✓ Signed in as {user.email}
        </div>
      ) : (
        <div className="text-gray-400">
          Not signed in
        </div>
      )}
    </div>
  );
}

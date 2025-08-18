'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthNav, { AuthStatus } from '@/components/auth/AuthNav';
import { AuthenticatedOnly, UnauthenticatedOnly } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

/**
 * Test page for authentication features
 */

export default function TestAuthPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AuthNav />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-6">Authentication Test Page</h1>
          
          {/* Auth Status */}
          <div className="mb-8 p-4 bg-gray-900/50 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-3">Current Status</h2>
            <AuthStatus />
          </div>

          {/* For Unauthenticated Users */}
          <UnauthenticatedOnly>
            <div className="mb-8 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h2 className="text-xl font-semibold text-red-300 mb-4">🔒 Not Authenticated</h2>
              <p className="text-gray-300 mb-4">
                You are not currently signed in. Some features are restricted.
              </p>
              <div className="space-x-4">
                <Link 
                  href="/login" 
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </UnauthenticatedOnly>

          {/* For Authenticated Users */}
          <AuthenticatedOnly>
            <div className="mb-8 p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h2 className="text-xl font-semibold text-green-300 mb-4">✅ Authenticated</h2>
              <p className="text-gray-300 mb-4">
                Welcome! You have access to all protected features.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{user?.email}</span>
                </div>
                {user?.username && (
                  <div>
                    <span className="text-gray-400">Username:</span>
                    <span className="text-white ml-2">{user.username}</span>
                  </div>
                )}
                {user?.name && (
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2">{user.name}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Member since:</span>
                  <span className="text-white ml-2">
                    {new Date(user?.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </AuthenticatedOnly>

          {/* Protected Links Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Protected Routes Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link 
                href="/builder" 
                className="block p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors"
              >
                <div className="text-blue-300 font-medium">🔨 Builder</div>
                <div className="text-blue-400 text-sm">Requires authentication</div>
              </Link>
              
              <Link 
                href="/dashboard" 
                className="block p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-colors"
              >
                <div className="text-purple-300 font-medium">📊 Dashboard</div>
                <div className="text-purple-400 text-sm">Requires authentication</div>
              </Link>
              
              <Link 
                href="/profile" 
                className="block p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg transition-colors"
              >
                <div className="text-green-300 font-medium">👤 Profile</div>
                <div className="text-green-400 text-sm">Requires authentication</div>
              </Link>
            </div>
          </div>

          {/* Public Links */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Public Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link 
                href="/" 
                className="block p-4 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg transition-colors"
              >
                <div className="text-gray-300 font-medium">🏠 Home</div>
                <div className="text-gray-400 text-sm">Public access</div>
              </Link>
              
              <Link 
                href="/login" 
                className="block p-4 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg transition-colors"
              >
                <div className="text-gray-300 font-medium">🔑 Login</div>
                <div className="text-gray-400 text-sm">Public access</div>
              </Link>
              
              <Link 
                href="/register" 
                className="block p-4 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg transition-colors"
              >
                <div className="text-gray-300 font-medium">📝 Register</div>
                <div className="text-gray-400 text-sm">Public access</div>
              </Link>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 bg-gray-900/50 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">How to Test</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Try accessing protected routes (/builder, /dashboard, /profile) without being logged in</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Register a new account or login with existing credentials</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">3.</span>
                <span>Access protected routes after authentication</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Try accessing /login or /register while authenticated (should redirect)</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">5.</span>
                <span>Logout and verify that protected routes are no longer accessible</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

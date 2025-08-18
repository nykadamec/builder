'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { loginSchema } from '@/lib/auth/validation';
import { useLogin } from '@/hooks/useAuth';

/**
 * Login form component
 */

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function LoginForm({ onSuccess, redirectTo = '/' }: LoginFormProps) {
  const { handleLogin, isLoading, error, clearError } = useLogin();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach(error => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Use the hook's login function
    await handleLogin(formData.emailOrUsername, formData.password);

    // If successful and onSuccess callback provided, call it
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-1">
            Email or Username
          </label>
          <input
            type="text"
            id="emailOrUsername"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            onPaste={(e) => {
              e.stopPropagation();
            }}
            onCopy={(e) => {
              e.stopPropagation();
            }}
            onCut={(e) => {
              e.stopPropagation();
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
            }}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.emailOrUsername ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email or username"
            disabled={isLoading}
          />
          {errors.emailOrUsername && (
            <p className="mt-1 text-sm text-red-600">{errors.emailOrUsername}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onPaste={(e) => {
              e.stopPropagation();
            }}
            onCopy={(e) => {
              e.stopPropagation();
            }}
            onCut={(e) => {
              e.stopPropagation();
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
            }}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

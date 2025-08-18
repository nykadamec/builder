'use client';

import { useState, useEffect } from 'react';
import { updateProfileSchema } from '@/lib/auth/validation';

/**
 * Profile management form component
 */

interface User {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProfileFormProps {
  user: User;
  onUpdate?: (user: User) => void;
}

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    email: user.email || '',
    username: user.username || '',
    name: user.name || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear messages when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (successMessage) setSuccessMessage('');
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError('');
    setSuccessMessage('');
    setErrors({});

    try {
      // Validate form data
      const validation = updateProfileSchema.safeParse(formData);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach(error => {
          const field = error.path[0] as string;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // Submit update request
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(validation.data),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Field-specific errors
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(data.error || 'Profile update failed');
        }
        return;
      }

      // Success
      setSuccessMessage('Profile updated successfully!');
      if (onUpdate && data.user) {
        onUpdate(data.user);
      }
    } catch (error) {
      setGeneralError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Profile Settings</h2>
        </div>

        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {generalError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.username ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Choose a username"
            disabled={isLoading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Account Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Account ID:</span> {user.id}</p>
            <p><span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><span className="font-medium">Last Updated:</span> {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

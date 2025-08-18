'use client';

import { useState } from 'react';
import { changePasswordSchema } from '@/lib/auth/validation';
import { PASSWORD_REQUIREMENTS } from '@/lib/auth/password';

/**
 * Change password form component
 */

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

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
      const validation = changePasswordSchema.safeParse(formData);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach(error => {
          const field = error.path[0] as string;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // Submit password change request
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
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
          setGeneralError(data.error || 'Password change failed');
        }
        return;
      }

      // Success
      setSuccessMessage('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
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
          <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
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
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.currentPassword ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your current password"
            disabled={isLoading}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            onFocus={() => setShowPasswordRequirements(true)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.newPassword ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your new password"
            disabled={isLoading}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
          
          {showPasswordRequirements && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• At least {PASSWORD_REQUIREMENTS.minLength} characters long</li>
                <li>• Contains uppercase letter (A-Z)</li>
                <li>• Contains lowercase letter (a-z)</li>
                <li>• Contains number (0-9)</li>
                <li>• Contains special character (!@#$%^&*)</li>
              </ul>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.confirmNewPassword ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Confirm your new password"
            disabled={isLoading}
          />
          {errors.confirmNewPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Changing password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

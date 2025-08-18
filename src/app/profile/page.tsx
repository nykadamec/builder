'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/components/auth/ProfileForm';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';

/**
 * Profile management page
 */

interface User {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const confirmation = prompt('Type "DELETE_MY_ACCOUNT" to confirm:');
    if (confirmation !== 'DELETE_MY_ACCOUNT') {
      alert('Account deletion cancelled.');
      return;
    }

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ confirmation: 'DELETE_MY_ACCOUNT' }),
      });

      if (response.ok) {
        alert('Account deleted successfully.');
        router.push('/');
      } else {
        const data = await response.json();
        alert(`Failed to delete account: ${data.error}`);
      }
    } catch (error) {
      console.error('Delete account failed:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6 shadow-2xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <div className="space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'password'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                Password
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileForm user={user} onUpdate={setUser} />
            )}
            {activeTab === 'password' && (
              <ChangePasswordForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

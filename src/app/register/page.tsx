import RegisterForm from '@/components/auth/RegisterForm';

/**
 * Registration page
 */

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/auth/validation";
import type { ZodIssue } from "zod";

export const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError('');
    setErrors({});

    try {
      // Validate form data
      const validation = loginSchema.safeParse(formData);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue: ZodIssue) => {
          const field = String(issue.path?.[0] ?? 'general');
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // Submit login request
      const response = await fetch('/api/auth/login', {
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
          setGeneralError(data.error || 'Přihlášení se nezdařilo');
        }
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      setGeneralError('Došlo k chybě při přihlašování. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <Header
          eyebrow="Vítej zpět"
          title={<>
            <GradientText>Přihlásit se</GradientText>
          </>}
          subtitle="Pokračuj do AI App Builderu"
          icon={<LogIn className="h-5 w-5" />}
        />

        {generalError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            name="emailOrUsername"
            type="text"
            placeholder="name@example.com nebo username"
            icon={<Mail className="h-4 w-4" />}
            label="E-mail nebo uživatelské jméno"
            value={formData.emailOrUsername}
            onChange={handleChange}
            error={errors.emailOrUsername}
            disabled={isLoading}
          />
          <PasswordInput
            name="password"
            placeholder="••••••••"
            label="Heslo"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between pt-1 text-sm">
            <label className="inline-flex items-center gap-2 text-white/75">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-fuchsia-400 focus:ring-fuchsia-400"
                disabled={isLoading}
              />
              Zapamatovat
            </label>
            <a href="/forgot-password" className="text-white/80 underline-offset-4 hover:text-white hover:underline">
              Zapomenuté heslo?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3 font-semibold shadow-lg shadow-fuchsia-500/20 transition hover:shadow-fuchsia-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                Přihlašování...
              </>
            ) : (
              'Přihlásit se'
            )}
          </button>
        </form>

        <Divider>nebo</Divider>

        <SocialButtons />

        <p className="mt-6 text-center text-sm text-white/70">
          Nemáš účet?{' '}
          <a className="font-semibold text-white underline-offset-4 hover:underline" href="/register">
            Zaregistruj se
          </a>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};

// Helper components with error handling
function Header({ eyebrow, title, subtitle, icon }: { eyebrow?: string; title: React.ReactNode; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center">
      {eyebrow && (
        <div className="mb-2 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-white/60">
          {icon}
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
    </div>
  );
}

function Input({ label, icon, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: React.ReactNode; error?: string }) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1.5 block text-white/80">{label}</span>}
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50">{icon}</span>
        <input
          {...props}
          className={`w-full rounded-xl border px-10 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500/50 bg-red-500/10 focus:border-red-400 focus:ring-red-400/30'
              : 'border-white/10 bg-white/5 focus:border-fuchsia-400 focus:ring-fuchsia-400/30'
          }`}
        />
      </span>
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3 w-3" />
          {error}
        </span>
      )}
    </label>
  );
}

function PasswordInput({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  const [show, setShow] = React.useState(false);
  return (
    <label className="block text-sm">
      {label && <span className="mb-1.5 block text-white/80">{label}</span>}
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><Lock className="h-4 w-4" /></span>
        <input
          {...props}
          type={show ? "text" : "password"}
          className={`w-full rounded-xl border px-10 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500/50 bg-red-500/10 focus:border-red-400 focus:ring-red-400/30'
              : 'border-white/10 bg-white/5 focus:border-fuchsia-400 focus:ring-fuchsia-400/30'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label={show ? "Skrýt heslo" : "Zobrazit heslo"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3 w-3" />
          {error}
        </span>
      )}
    </label>
  );
}

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
    >
      {children}
    </motion.div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="relative flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10"></div>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white/[0.06] px-2 text-white/60">{children}</span>
      </div>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="space-y-3">
      <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017 0z"/>
        </svg>
        Pokračovat přes GitHub
      </button>
      <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Pokračovat přes e-mail
      </button>
    </div>
  );
}
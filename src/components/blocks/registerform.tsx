"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, Sparkles, Github, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { modernRegisterSchema } from "@/lib/auth/validation";
import type { ZodIssue } from "zod";


export const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setGeneralError('Musíte souhlasit s obchodními podmínkami');
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    setErrors({});

    try {
      // Validate form data
      const validation = modernRegisterSchema.safeParse(formData);
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

      // Submit registration request
      const response = await fetch('/api/auth/register', {
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
          setGeneralError(data.error || 'Registrace se nezdařila');
        }
        return;
      }

      // Success - redirect to login or dashboard
      router.push('/login?message=Registrace úspěšná! Nyní se můžete přihlásit.');

    } catch (error) {
      console.error('Registration error:', error);
      setGeneralError('Došlo k chybě při registraci. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <Header
          eyebrow="Začni zdarma"
          title={<>
            <GradientText>Vytvořit účet</GradientText>
          </>}
          subtitle="Během chvilky budeš generovat aplikace pomocí AI"
          icon={<UserPlus className="h-5 w-5" />}
        />

        {generalError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            name="name"
            type="text"
            placeholder="Jan Novák"
            icon={<Sparkles className="h-4 w-4" />}
            label="Jméno"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            disabled={isLoading}
          />
          <Input
            name="email"
            type="email"
            placeholder="name@example.com"
            icon={<Mail className="h-4 w-4" />}
            label="E-mail"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isLoading}
          />
          <PasswordInput
            name="password"
            placeholder="Min. 8 znaků"
            label="Heslo"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
          />
          <PasswordInput
            name="confirmPassword"
            placeholder="Potvrdit heslo"
            label="Potvrdit heslo"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isLoading}
          />

          <label className="mt-1 inline-flex items-start gap-3 text-sm text-white/75">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-fuchsia-400 focus:ring-fuchsia-400"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              disabled={isLoading}
            />
            <span>
              Souhlasím s <a href="#" className="underline underline-offset-4 hover:text-white">obchodními podmínkami</a> a <a href="#" className="underline underline-offset-4 hover:text-white">ochranou soukromí</a>.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3 font-semibold shadow-lg shadow-fuchsia-500/20 transition hover:shadow-fuchsia-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registruji...' : 'Vytvořit účet'}
          </button>
        </form>

        <Divider>nebo</Divider>

        <SocialButtons />

        <p className="mt-6 text-center text-sm text-white/70">
          Už máš účet? <a className="font-semibold text-white underline-offset-4 hover:underline" href="/login">Přihlásit se</a>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};


function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-tr from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_6px_40px_rgba(168,85,247,0.25)]">
      {children}
    </span>
  );
}


function Header({ eyebrow, title, subtitle, icon }: { eyebrow?: string; title: React.ReactNode; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
        <span className="inline-flex items-center gap-2">{icon}<span>{eyebrow}</span></span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
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
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-tr from-indigo-500/0 to-fuchsia-500/0 blur-2xl" />
      {children}
    </motion.div>
  );
}


function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <span className="text-xs uppercase tracking-wide text-white/60">{children}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0b12] px-4 py-10 text-white">
      <AuroraBackdrop />
      {children}
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-semibold text-white/90 backdrop-blur transition hover:bg-white/10">
        <Github className="h-4 w-4" /> Pokračovat přes GitHub
      </button>
      <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-semibold text-white/90 backdrop-blur transition hover:bg-white/10">
        <Mail className="h-4 w-4" /> Pokračovat přes e-mail
      </button>
    </div>
  );
}

function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(124,58,237,0.25),transparent_60%)]" />
      <div className="absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.12),transparent_60%)] blur-2xl" />
      <div className="absolute left-[15%] top-[10%] h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.18),transparent_60%)] blur-3xl" />
      <div className="absolute right-[5%] top-[20%] h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.14),transparent_60%)] blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.12]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b0b12] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0b12] to-transparent" />
    </div>
  );
}
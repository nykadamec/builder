"use client";

import React from "react";
import { Mail, LogIn } from "lucide-react";
import { AuthLayout, AuthCard, Input, PasswordInput, SocialButtons, GradientText, Header, Divider } from "../auth";


export const LoginPage = () => {
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

        <form className="mt-6 space-y-4">
          <Input name="email" type="email" placeholder="name@example.com" icon={<Mail className="h-4 w-4" />} label="E-mail" />
          <PasswordInput name="password" placeholder="••••••••" label="Heslo" />

          <div className="flex items-center justify-between pt-1 text-sm">
            <label className="inline-flex items-center gap-2 text-white/75">
              <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 text-fuchsia-400 focus:ring-fuchsia-400" />
              Zapamatovat
            </label>
            <a href="#" className="text-white/80 underline-offset-4 hover:text-white hover:underline">Zapomenuté heslo?</a>
          </div>

          <button type="submit" className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-3 font-semibold shadow-lg shadow-fuchsia-500/20 transition hover:shadow-fuchsia-500/30">
            Sign in
          </button>
        </form>

        <Divider>nebo</Divider>

        <SocialButtons />

        <p className="mt-6 text-center text-sm text-white/70">
          Nemáš účet? <a className="font-semibold text-white underline-offset-4 hover:underline" href="/register">Sign Up</a>
        </p>
      </AuthCard>
    </AuthLayout>
  );
};
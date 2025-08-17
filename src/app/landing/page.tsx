"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FooterNote } from "@/components/blocks/footer";
import { ArrowRight, Sparkles, Rocket, Star, Feather } from "lucide-react";
import { builder_area as TextBuild } from "@/components/builder/builder_area";
import { useI18n } from "@/components/providers/locale-provider";
import Header from '@/components/layout/Header'

export default function LandingPage() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-screen flex-col  text-white antialiased selection:bg-white/10 selection:text-white">
  <AuroraBackdrop />
  <Header variant="landing" />

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <TextBuild />

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-white/80">{t('landing.badge')}</span>
            
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
        >
          <GradientText>
            {t('landing.headline').split('\n')[0]}
            <br className="hidden sm:block" /> {t('landing.headline').split('\n')[1]}
          </GradientText>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="mt-6 max-w-3xl text-lg text-white/70"
        >
          {t('landing.subheadline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-base font-semibold shadow-lg shadow-fuchsia-500/20 transition hover:shadow-fuchsia-500/30 focus:outline-none"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              <Rocket className="h-4 w-4" /> {t('landing.cta_primary')}
            </span>
            <GlowBorder />
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 backdrop-blur transition hover:bg-white/[0.07]"
          >
            {t('landing.cta_secondary')} <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/70"
        >
          <li className="inline-flex items-center gap-2"><Star className="h-4 w-4" /> {t('landing.stack.next')}</li>
          <li className="inline-flex items-center gap-2"><Feather className="h-4 w-4" /> {t('landing.stack.ts')}</li>
          <li className="inline-flex items-center gap-2">{t('landing.stack.tw')}</li>
        </motion.ul>
      </main>

      <FooterNote />
    </div>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-tr from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_6px_40px_rgba(168,85,247,0.25)]">
      {children}
    </span>
  );
}

function GlowBorder() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-indigo-500/0 via-fuchsia-500/20 to-fuchsia-500/0 blur-xl"
    />
  );
}

function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(124,58,237,0.25),transparent_60%)]" />
      <div className="absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.12),transparent_60%)] blur-2xl" />
      <div className="absolute left-[15%] top-[10%] h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.18),transparent_60%)] blur-3xl" />
      <div className="absolute right-[5%] top-[20%] h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.14),transparent_60%)] blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.15]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0b0b12] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0b12] to-transparent" />
    </div>
  );
}

// USE footer block
// FooterNote is used above in the component



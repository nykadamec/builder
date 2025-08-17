import React from "react";
import { motion } from "motion/react";

export function AuthCard({ children }: { children: React.ReactNode }) {
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
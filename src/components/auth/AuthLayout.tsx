import React from "react";

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

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0b12] px-4 py-10 text-white">
      <AuroraBackdrop />
      {children}
    </div>
  );
}
import React from "react";

export function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <span className="text-xs uppercase tracking-wide text-white/60">{children}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
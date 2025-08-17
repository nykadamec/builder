import React from "react";

export function Header({ eyebrow, title, subtitle, icon }: { eyebrow?: string; title: React.ReactNode; subtitle?: string; icon?: React.ReactNode }) {
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
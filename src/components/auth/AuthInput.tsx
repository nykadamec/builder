import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export function Input({ label, icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: React.ReactNode }) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1.5 block text-white/80">{label}</span>}
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50">{icon}</span>
        <input
          {...props}
          onPaste={(e) => {
            // allow paste and prevent parent handlers from blocking it
            e.stopPropagation();
            if (typeof props.onPaste === 'function') props.onPaste(e as any);
          }}
          onCopy={(e) => {
            e.stopPropagation();
            if (typeof props.onCopy === 'function') props.onCopy(e as any);
          }}
          onCut={(e) => {
            e.stopPropagation();
            if (typeof props.onCut === 'function') props.onCut(e as any);
          }}
          onContextMenu={(e) => {
            // ensure context menu opens for clipboard actions
            e.stopPropagation();
            if (typeof props.onContextMenu === 'function') props.onContextMenu(e as any);
          }}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30"
        />
      </span>
    </label>
  );
}

export function PasswordInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const [show, setShow] = React.useState(false);
  return (
    <label className="block text-sm">
      {label && <span className="mb-1.5 block text-white/80">{label}</span>}
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><Lock className="h-4 w-4" /></span>
        <input
          {...props}
          type={show ? "text" : "password"}
          onPaste={(e) => {
            e.stopPropagation();
            if (typeof props.onPaste === 'function') props.onPaste(e as any);
          }}
          onCopy={(e) => {
            e.stopPropagation();
            if (typeof props.onCopy === 'function') props.onCopy(e as any);
          }}
          onCut={(e) => {
            e.stopPropagation();
            if (typeof props.onCut === 'function') props.onCut(e as any);
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            if (typeof props.onContextMenu === 'function') props.onContextMenu(e as any);
          }}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/30"
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
    </label>
  );
}
import React from "react";
import { Github, Mail } from "lucide-react";

export function SocialButtons() {
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
import React from "react";

export function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-tr from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_6px_40px_rgba(168,85,247,0.25)]">
      {children}
    </span>
  );
}
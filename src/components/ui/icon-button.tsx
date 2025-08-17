"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string; // accessible label
}

export function IconButton({ icon, label, className, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={props['aria-label'] || label}
      title={props.title || label}
      className={cn(
        "p-1 rounded transition-all hover:scale-105 backdrop-blur-sm text-white/60 bg-transparent",
        "hover:bg-white/6 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
        className
      )}
    >
      {icon}
    </button>
  );
}

export default IconButton;

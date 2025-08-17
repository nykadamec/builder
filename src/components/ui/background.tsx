
import React from "react";

export function appBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-slate-950 -z-50" />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black -z-40" />
      <div className="fixed inset-0 overflow-hidden -z-30">
        <div className="absolute -inset-1 blur-3xl opacity-60" style={{ 
          background: "conic-gradient(from 180deg at 50% 50%, #4f4f5f44, #2626264d, #4f4f5f44)" 
        }} />
        <div className="absolute -inset-1 blur-2xl opacity-50" style={{ 
          background: "radial-gradient(60% 40% at 30% 20%, #2626264d, transparent), radial-gradient(50% 35% at 70% 30%, #4f4f5f4d, transparent), radial-gradient(50% 40% at 50% 70%, #26262640, transparent)" 
        }} />
      </div>
    </>
  );
}
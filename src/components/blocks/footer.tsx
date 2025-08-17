
import React from "react";
import { useI18n } from "@/components/providers/locale-provider";

export const FooterNote = () => {
  const { t } = useI18n()
  return (
    <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-xs text-white/60">
        {t('landing.footer_note')}
      </div>
    
    </footer>

    );
};

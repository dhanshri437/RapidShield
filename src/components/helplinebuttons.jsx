import React, { useState } from 'react';
import { Phone, ExternalLink, AlertTriangle } from 'lucide-react';
import { HELPLINES, CYBERCRIME_PORTAL } from '@/lib/store';
import { cn } from '@/lib/utils';

export function HelplineButton({ type, className }) {
  const h = HELPLINES[type];
  const [showFallback, setShowFallback] = useState(false);
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <a
        href={`tel:${h.number}`}
        onClick={() => {
          // desktop browsers often can't place calls — show a gentle fallback hint
          const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
          if (!isMobile) {
            setShowFallback(true);
          }
        }}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Phone className="h-4 w-4" />
        {h.label}
      </a>
      <p className="text-xs text-muted-foreground">{h.desc}</p>
      {showFallback && (
        <p className="text-xs text-muted-foreground italic">Use your phone to call this number.</p>
      )}
    </div>
  );
}

export function CybercrimePortalButton({ className }) {
  return (
    <a
      href={CYBERCRIME_PORTAL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted',
        className
      )}
    >
      <ExternalLink className="h-4 w-4" />
      Open Official Cybercrime Portal
    </a>
  );
}

export function EmergencyBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-300/60 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
      <div>
        <p className="text-sm font-semibold text-red-700 dark:text-red-300">
          If you are in immediate physical danger, contact emergency services rather than waiting for RapidShield.
        </p>
      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Fingerprint } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold">
                Rapid<span className="gradient-text">Shield</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              A privacy-first guided response platform for non-consensual intimate image abuse,
              deepfake sextortion, and threats involving intimate content.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Platform
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/flow" className="hover:text-primary">Start Response</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
                <li><Link to="/support" className="hover:text-primary">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Privacy
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> No media uploads</li>
                <li className="flex items-center gap-1.5"><Fingerprint className="h-3.5 w-3.5" /> Local SHA-256</li>
                <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> On-device only</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            RapidShield is a guidance and preparation tool. It does not replace police, emergency
            services, counsellors, or legal professionals. If you are in immediate danger, contact
            your local emergency services.
          </p>
        </div>
      </div>
    </footer>
  );
}
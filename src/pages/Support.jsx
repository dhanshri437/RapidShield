import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LifeBuoy, ShieldCheck, Ban, HandHeart, AlertTriangle, Phone, ArrowRight, CheckCircle2,
  Siren, Globe, Scale, Baby, ExternalLink,
} from 'lucide-react';
import { HelplineButton, CybercrimePortalButton, EmergencyBanner } from '@/components/HelplineButtons';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 'danger',
    icon: Siren,
    title: 'I am in immediate danger',
    desc: 'If you are in immediate physical danger right now.',
    helplines: ['emergency'],
    accent: 'red',
  },
  {
    id: 'threat',
    icon: Globe,
    title: 'Someone is threatening me online',
    desc: 'Online threats, sextortion, or non-consensual sharing.',
    helplines: ['cyber'],
    extra: <CybercrimePortalButton className="mt-2" />,
  },
  {
    id: 'support',
    icon: HandHeart,
    title: 'I need emotional / legal / women / child support',
    desc: 'Choose the kind of support you are looking for.',
    helplines: ['women', 'child', 'legal'],
    selectable: true,
  },
];

export default function Support() {
  const navigate = useNavigate();
  const [active, setActive] = useState('danger');

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-muted text-primary"><LifeBuoy className="h-7 w-7" /></div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">I Need Support</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-balance">
          Choose the situation that fits you best. RapidShield will show the relevant official helplines and resources.
        </p>
      </div>

      <div className="mt-8"><EmergencyBanner /></div>

      {/* Category selector */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={cn(
            'flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all',
            active === c.id ? 'border-primary bg-primary-muted ring-1 ring-primary' : 'border-border bg-card hover:bg-muted'
          )}>
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', c.accent === 'red' ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300' : 'bg-primary-muted text-primary')}>
              <c.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold">{c.title}</span>
            <span className="text-xs text-muted-foreground">{c.desc}</span>
          </button>
        ))}
      </div>

      {/* Active category content */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        {active === 'danger' && (
          <div>
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">Immediate emergency</h2>
            <p className="mt-2 text-sm text-muted-foreground">If you are in immediate physical danger, contact emergency services rather than waiting for RapidShield.</p>
            <div className="mt-5 max-w-xs"><HelplineButton type="emergency" /></div>
          </div>
        )}
        {active === 'threat' && (
          <div>
            <h2 className="text-lg font-semibold">Online threats & cybercrime</h2>
            <p className="mt-2 text-sm text-muted-foreground">Report online threats, sextortion, and non-consensual sharing. RapidShield prepares your information — you submit it through official channels.</p>
            <div className="mt-5 grid max-w-xl gap-4 sm:grid-cols-2">
              <HelplineButton type="cyber" />
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">Report cybercrime online</span>
                <CybercrimePortalButton />
              </div>
            </div>
          </div>
        )}
        {active === 'support' && (
          <div>
            <h2 className="text-lg font-semibold">Support resources</h2>
            <p className="mt-2 text-sm text-muted-foreground">Official helplines you can reach right now. On desktop, use your phone to call these numbers.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <HelplineButton type="women" />
              <HelplineButton type="child" />
              <HelplineButton type="legal" />
            </div>
          </div>
        )}
      </div>

      {/* All helplines reference */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">All official helplines</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <HelplineButton type="emergency" />
          <HelplineButton type="cyber" />
          <HelplineButton type="women" />
          <HelplineButton type="child" />
          <HelplineButton type="legal" />
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Report cybercrime online</span>
            <CybercrimePortalButton />
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'Preserve evidence', desc: 'Screenshot messages, posts, URLs, and profiles with timestamps.' },
          { icon: Ban, title: 'Avoid re-sharing', desc: 'Do not forward the content to others — it makes takedown harder.' },
          { icon: HandHeart, title: 'Seek support', desc: 'Talk to someone you trust. You do not have to handle this alone.' },
        ].map((g) => (
          <div key={g.title} className="rounded-2xl border border-border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-muted text-primary"><g.icon className="h-5 w-5" /></span>
            <h3 className="mt-4 text-base font-semibold">{g.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-6">
        <h2 className="text-base font-semibold">About RapidShield</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          RapidShield is a guidance and preparation tool. It does <strong>not</strong> replace police, emergency services, counsellors, or legal professionals. It does not automatically file complaints or guarantee takedown. You remain in control of every submission.
        </p>
        <button onClick={() => navigate('/flow')} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Start a secure response <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
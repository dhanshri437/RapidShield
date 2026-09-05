import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Fingerprint,
  ShieldCheck,
  ArrowRight,
  LifeBuoy,
  FileCheck2,
  ClipboardList,
  FolderLock,
  ScanFace,
  Megaphone,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';
import ShieldIllustration from '@/components/ShieldIllustration';

const privacyIndicators = [
  { icon: Lock, title: 'No unnecessary media uploads', desc: 'Your original sensitive media never leaves your device.' },
  { icon: Fingerprint, title: 'Local SHA-256', desc: 'Evidence fingerprints are generated in your browser.' },
  { icon: ShieldCheck, title: 'Guided reporting', desc: 'Clear, structured next steps — no guesswork.' },
];

const steps = [
  { icon: ClipboardList, title: 'Guided Intake', desc: 'Tell us what happened using simple, calm options.' },
  { icon: FolderLock, title: 'Evidence Protection', desc: 'Generate a local SHA-256 fingerprint without uploading anything.' },
  { icon: ScanFace, title: 'Guided Reporting', desc: 'Review a structured summary and recommended next steps.' },
  { icon: LayoutDashboard, title: 'Case Dashboard', desc: 'Track your case with a unique ID and clear status indicators.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 surface-glow" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Privacy-first · On-device processing
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
                Your evidence stays{' '}
                <span className="gradient-text">on your device.</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg text-muted-foreground text-balance">
                RapidShield helps you take guided action after non-consensual intimate image abuse —
                protect your evidence, understand your reporting options, prepare your report, and
                track what happens next.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate('/flow')}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Start Secure Response
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => navigate('/support')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LifeBuoy className="h-4 w-4" />
                  I Need Support
                </button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {privacyIndicators.map((p) => (
                  <div key={p.title} className="rounded-xl border border-border bg-card p-4">
                    <p.icon className="h-5 w-5 text-primary" />
                    <p className="mt-2 text-sm font-semibold">{p.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <ShieldIllustration className="h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card/90 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                  Processed locally
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">A calm, guided path forward</h2>
            <p className="mt-3 text-muted-foreground">
              Four clear stages take you from overwhelm to an organized, ready-to-submit case —
              without exposing your private content.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="absolute right-5 top-5 text-sm font-bold text-muted-foreground/40">
                  0{i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-muted text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy promise */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Privacy is the default, not a setting</h2>
              <p className="mt-4 text-muted-foreground">
                RapidShield is built around a simple principle: you should never have to re-share
                intimate content to get help. Evidence is fingerprinted on your device using the
                Web Crypto API, and original files are never transmitted to any server.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'SHA-256 hashing happens entirely in your browser',
                  'No original media is uploaded or stored remotely',
                  'Case data is kept locally on this device for the demo',
                  'You decide what to submit, where, and when',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/flow')}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Begin a secure response
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted text-accent">
                  <FileCheck2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Evidence integrity, explained</p>
                  <p className="text-xs text-muted-foreground">A digital fingerprint for your records</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                A SHA-256 hash is a one-way digital fingerprint of a file. It lets you prove a
                piece of evidence existed in a specific state at a specific time — without ever
                revealing the content itself.
              </p>
              <div className="mt-5 rounded-lg bg-muted px-4 py-3 font-mono text-xs text-muted-foreground break-all">
                9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
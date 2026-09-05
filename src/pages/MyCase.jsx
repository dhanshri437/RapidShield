import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Fingerprint, Copy, Download, Plus, ArrowRight, Clock, Tag, Globe,
  FileCheck2, CheckCircle2, ChevronRight, MessageSquare, ExternalLink, Send, AlertCircle,
} from 'lucide-react';
import {
  getUserCases, getVisibleHistory, getEvidenceByCase, buildReport,
  INCIDENT_TYPES, recommendedSteps, userAddInfo, STATUSES, progressPercent,
} from '@/lib/store';
import { useAuth } from '@/lib/rsAuth';
import StatusBadge, { PriorityBadge } from '@/components/StatusBadge';
import { UserTimeline } from '@/components/CaseTimeline';
import { CybercrimePortalButton, EmergencyBanner } from '@/components/HelplineButtons';
import { cn } from '@/lib/utils';

export default function MyCase() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCases(getUserCases(user.id));
  }, [user.id]);

  useEffect(() => {
    if (cases.length && !cases.find((c) => c.id === selectedId)) setSelectedId(cases[0].id);
  }, [cases, selectedId]);

  const selected = useMemo(() => cases.find((c) => c.id === selectedId), [cases, selectedId]);
  const history = selected ? getVisibleHistory(selected.id) : [];
  const evidence = selected ? getEvidenceByCase(selected.id) : [];

  const refresh = () => setCases(getUserCases(user.id));

  const copyReport = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(buildReport(selected));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const downloadReport = () => {
    if (!selected) return;
    const blob = new Blob([buildReport(selected)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `RapidShield-Report-${selected.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!cases.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-muted text-primary"><ShieldCheck className="h-8 w-8" /></div>
        <h1 className="mt-5 text-2xl font-bold">My Case</h1>
        <p className="mt-2 text-sm text-muted-foreground">You don't have any cases yet. Start a secure response to create one.</p>
        <button onClick={() => navigate('/flow')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Start Secure Response
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Case</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your case status, evidence, and next steps.</p>
        </div>
        <button onClick={() => navigate('/flow')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New case
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Case list */}
        <div className="space-y-2">
          {cases.map((c) => (
            <button key={c.id} onClick={() => setSelectedId(c.id)} className={cn('w-full rounded-xl border p-4 text-left transition-colors', selectedId === c.id ? 'border-primary bg-primary-muted' : 'border-border bg-card hover:bg-muted')}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold">{c.id}</span>
                <ChevronRight className={cn('h-4 w-4', selectedId === c.id ? 'text-primary' : 'text-muted-foreground')} />
              </div>
              <p className="mt-1.5 line-clamp-1 text-sm font-medium">{INCIDENT_TYPES.find((t) => t.id === c.incidentType)?.label || c.incidentType}</p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={c.status} />
                <PriorityBadge priority={c.priority} />
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        {selected && (
          <div className="space-y-6">
            {selected.immediateDanger && <EmergencyBanner />}

            {/* Admin message */}
            {selected.adminMessage && (
              <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary-muted p-5">
                <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Message from RapidShield review team</p>
                  <p className="mt-1 text-sm text-foreground">{selected.adminMessage}</p>
                </div>
              </div>
            )}

            {/* Status + progress */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Case ID</p>
                  <p className="font-mono text-lg font-semibold">{selected.id}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span><span>{progressPercent(selected.status)}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progressPercent(selected.status)}%` }} />
                </div>
              </div>
            </div>

            {/* Status cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard icon={Clock} label="Submitted" value={new Date(selected.createdAt).toLocaleString()} />
              <InfoCard icon={Tag} label="Incident Type" value={INCIDENT_TYPES.find((t) => t.id === selected.incidentType)?.label || selected.incidentType} />
              <InfoCard icon={Globe} label="Platform" value={selected.platform} />
              <InfoCard icon={Fingerprint} label="Evidence Status" value={evidence.length ? 'Hash generated' : 'No evidence hashed'} tone={evidence.length ? 'success' : 'muted'} />
              <InfoCard icon={FileCheck2} label="Report Status" value={selected.status === STATUSES.REPORT_PREPARED || selected.status === STATUSES.USER_ACTION_REQUIRED ? 'Ready for submission' : 'In preparation'} tone="info" />
              <InfoCard icon={ArrowRight} label="Next Action" value={nextAction(selected)} small />
            </div>

            {/* Evidence hash */}
            {evidence.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2"><Fingerprint className="h-4 w-4 text-accent" /><h3 className="text-sm font-semibold">Evidence fingerprint (SHA-256)</h3></div>
                <div className="mt-3 break-all rounded-lg bg-muted px-4 py-3 font-mono text-xs text-muted-foreground">{evidence[0].sha256Hash}</div>
                <p className="mt-2 text-xs text-muted-foreground">File: {evidence[0].filename} · {(evidence[0].fileSize / 1024).toFixed(1)} KB</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Processed locally · Original media uploaded: NO</p>
              </div>
            )}

            {/* Needs info form */}
            {selected.status === STATUSES.NEEDS_INFO && <AddInfoForm caseId={selected.id} onSubmitted={refresh} />}

            {/* Report actions */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">Prepared report</h3>
                <div className="flex flex-wrap gap-2">
                  <button onClick={copyReport} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={downloadReport} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              </div>
              <pre className="mt-4 max-h-72 overflow-auto rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground whitespace-pre-wrap">{buildReport(selected)}</pre>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CybercrimePortalButton />
                <p className="text-xs text-muted-foreground">RapidShield does not submit the complaint for you. Review and submit through the official portal.</p>
              </div>
            </div>

            {/* Recommended steps */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">Recommended next steps</h3>
              <ol className="mt-3 space-y-2.5">
                {recommendedSteps(selected.incidentType).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-muted text-xs font-semibold text-primary">{i + 1}</span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Case history */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">Case history</h3>
              <p className="mt-1 text-xs text-muted-foreground">A complete, chronological record of your case activity.</p>
              <div className="mt-5"><UserTimeline entries={history} /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function nextAction(c) {
  switch (c.status) {
    case STATUSES.SUBMITTED: return 'Your case is awaiting review by the RapidShield team.';
    case STATUSES.UNDER_REVIEW: return 'Your case is being reviewed. No action needed yet.';
    case STATUSES.NEEDS_INFO: return 'Please provide the additional information requested.';
    case STATUSES.APPROVED: return 'Your case is approved. A report is being prepared.';
    case STATUSES.REPORT_PREPARED:
    case STATUSES.USER_ACTION_REQUIRED: return 'Review your report and submit it through the official cybercrime portal.';
    case STATUSES.PLATFORM_SUBMITTED: return 'Awaiting platform review.';
    case STATUSES.UNDER_PLATFORM_REVIEW: return 'Platform is reviewing your report.';
    case STATUSES.RESOLVED: return 'Your case is resolved.';
    case STATUSES.REJECTED: return 'Your case was not accepted. See the message from the review team.';
    default: return 'No action required right now.';
  }
}

function InfoCard({ icon: Icon, label, value, tone, small }) {
  const toneClass = tone === 'success' ? 'bg-success/10 text-success' : tone === 'info' ? 'bg-primary-muted text-primary' : 'bg-muted text-muted-foreground';
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg', toneClass)}><Icon className="h-3.5 w-3.5" /></span>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={cn('mt-2 font-medium', small ? 'text-xs leading-relaxed' : 'text-sm')}>{value}</p>
    </div>
  );
}

function AddInfoForm({ caseId, onSubmitted }) {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [addendum, setAddendum] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    userAddInfo(caseId, user, { url, accountInfo, descriptionAddendum: addendum });
    setDone(true);
    onSubmitted();
  };

  if (done) return (
    <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
      <CheckCircle2 className="h-5 w-5 text-success" />
      <p className="text-sm">Additional information submitted. Your case is back under review.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="rounded-xl border border-orange-300/50 bg-orange-50/50 p-5 dark:border-orange-500/30 dark:bg-orange-500/5">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Additional information requested</h3>
          <p className="mt-1 text-xs text-muted-foreground">The review team has requested more details. Provide what you can below.</p>
          <div className="mt-4 space-y-3">
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Relevant URL (if asked)" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <input value={accountInfo} onChange={(e) => setAccountInfo(e.target.value)} placeholder="Account / profile / phone (if asked)" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <textarea value={addendum} onChange={(e) => setAddendum(e.target.value)} rows={3} placeholder="Additional details (no sensitive content)" className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Send className="h-4 w-4" /> Submit additional info
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, User as UserIcon, Fingerprint, FileText, CheckCircle2, XCircle,
  Send, MessageSquare, StickyNote, ClipboardList, Globe, Clock, Tag, AlertTriangle,
} from 'lucide-react';
import {
  getCase, getEvidenceByCase, getCaseHistory, getCaseNotes, getCaseAudit, buildReport,
  INCIDENT_TYPES, STATUSES, ALL_STATUSES,
  adminApprove, adminRequestInfo, adminReject, adminMarkReportPrepared,
  adminMarkPlatformSubmitted, adminMarkResolved, adminAddNote, adminChangeStatus,
} from '@/lib/store';
import { useAuth } from '@/lib/rsAuth';
import StatusBadge, { PriorityBadge } from '@/components/StatusBadge';
import { AuditTimeline } from '@/components/CaseTimeline';
import { cn } from '@/lib/utils';

export default function AdminCaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);

  const c = useMemo(() => getCase(id), [id, version]);
  const evidence = useMemo(() => getEvidenceByCase(id), [id, version]);
  const history = useMemo(() => getCaseHistory(id), [id, version]);
  const notes = useMemo(() => getCaseNotes(id), [id, version]);
  const audit = useMemo(() => getCaseAudit(id), [id, version]);

  const [note, setNote] = useState('');
  const [noteVisible, setNoteVisible] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!c) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-muted-foreground">Case not found.</p>
        <button onClick={() => navigate('/admin')} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Back to dashboard</button>
      </div>
    );
  }

  const act = (fn, ...args) => { fn(c.id, user, ...args); refresh(); };
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    adminAddNote(c.id, user, note.trim(), noteVisible);
    setNote(''); setNoteVisible(false); refresh();
  };
  const handleStatusChange = (newStatus) => {
    adminChangeStatus(c.id, user, newStatus, statusMsg.trim() || `Status changed to ${newStatus}.`, true);
    setStatusMsg(''); refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <button onClick={() => navigate('/admin')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-mono">{c.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{INCIDENT_TYPES.find((t) => t.id === c.incidentType)?.label}</p>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={c.priority} />
          <StatusBadge status={c.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: details */}
        <div className="space-y-6">
          {/* User info */}
          <Section icon={UserIcon} title="User information">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <Field label="Name" value={c.userName} />
              <Field label="Email" value={c.userEmail} />
              <Field label="Submitted" value={new Date(c.createdAt).toLocaleString()} />
              <Field label="Priority" value={c.priority} />
            </dl>
          </Section>

          {/* Incident info */}
          <Section icon={ClipboardList} title="Incident information">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <Field label="Incident type" value={INCIDENT_TYPES.find((t) => t.id === c.incidentType)?.label} />
              <Field label="Platform" value={c.platform} />
              <Field label="Date/time" value={c.incidentDate ? new Date(c.incidentDate).toLocaleString() : 'Not specified'} />
              <Field label="Money demanded" value={c.moneyDemanded ? 'Yes' : 'No'} />
              <Field label="Content posted" value={c.contentPosted ? 'Yes' : 'No'} />
              <Field label="Immediate danger" value={c.immediateDanger ? 'Yes' : 'No'} danger={c.immediateDanger} />
              <Field label="Minor" value={c.isMinor ? 'Yes' : 'No'} danger={c.isMinor} />
              <Field label="Account" value={c.accountInfo || 'Not provided'} />
            </dl>
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground">Relevant URL</p>
              <p className="mt-0.5 break-all text-sm">{c.url || 'Not provided'}</p>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground">Description</p>
              <p className="mt-1 whitespace-pre-wrap rounded-lg bg-muted px-4 py-3 text-sm">{c.description || 'Not provided'}</p>
            </div>
            {c.originalSubmission && (c.originalSubmission.url !== c.url || c.originalSubmission.description !== c.description) && (
              <div className="mt-3 rounded-lg border border-dashed border-border p-3">
                <p className="text-xs font-semibold text-muted-foreground">Original submission (preserved)</p>
                <p className="mt-1 text-xs text-muted-foreground">URL: {c.originalSubmission.url || 'Not provided'}</p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{c.originalSubmission.description}</p>
              </div>
            )}
          </Section>

          {/* Evidence */}
          <Section icon={Fingerprint} title="Evidence metadata">
            {evidence.length ? (
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-success"><CheckCircle2 className="h-4 w-4" /> Hash generated locally</div>
                <div className="mt-2 break-all rounded-lg bg-muted px-4 py-3 font-mono text-xs text-muted-foreground">{evidence[0].sha256Hash}</div>
                <p className="mt-2 text-xs text-muted-foreground">File: {evidence[0].filename} · {(evidence[0].fileSize / 1024).toFixed(1)} KB · Generated {new Date(evidence[0].createdAt).toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">Original media uploaded: NO</p>
              </div>
            ) : <p className="text-sm text-muted-foreground">No evidence hashed for this case.</p>}
          </Section>

          {/* Report */}
          <Section icon={FileText} title="Prepared report">
            <pre className="max-h-72 overflow-auto rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground whitespace-pre-wrap">{buildReport(c)}</pre>
          </Section>

          {/* Audit timeline */}
          <Section icon={Clock} title="Case history / audit timeline">
            <p className="mb-4 text-xs text-muted-foreground">Complete chronological record — includes internal admin actions not visible to the user.</p>
            <AuditTimeline entries={[...history, ...audit].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))} />
          </Section>
        </div>

        {/* Right: controls */}
        <div className="space-y-6">
          {/* Status controls */}
          <Section icon={Tag} title="Status controls">
            <div className="grid grid-cols-2 gap-2">
              <ActionBtn label="Approve" icon={CheckCircle2} tone="success" onClick={() => act(adminApprove)} disabled={c.status === STATUSES.APPROVED} />
              <ActionBtn label="Request info" icon={AlertTriangle} tone="warning" onClick={() => { const m = prompt('What information do you need from the user?', 'Please provide the platform URL.'); if (m) act(adminRequestInfo, m); }} />
              <ActionBtn label="Reject" icon={XCircle} tone="danger" onClick={() => { const m = prompt('Reason for rejection (visible to user):', 'Unable to proceed with this case.'); if (m) act(adminReject, m); }} />
              <ActionBtn label="Report prepared" icon={FileText} tone="info" onClick={() => act(adminMarkReportPrepared)} />
              <ActionBtn label="Platform submitted" icon={Globe} tone="info" onClick={() => act(adminMarkPlatformSubmitted)} />
              <ActionBtn label="Resolved" icon={CheckCircle2} tone="success" onClick={() => act(adminMarkResolved)} />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Custom status change</label>
              <select onChange={(e) => { if (e.target.value) handleStatusChange(e.target.value); e.target.value = ''; }} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="">Change status to…</option>
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </Section>

          {/* Add note / message */}
          <Section icon={MessageSquare} title="Notes & messages">
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Write a note…" className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={noteVisible} onChange={(e) => setNoteVisible(e.target.checked)} className="rounded" />
                Visible to the victim (becomes a victim-visible message)
              </label>
              <button type="submit" disabled={!note.trim()} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                <Send className="h-4 w-4" /> {noteVisible ? 'Send to victim' : 'Add internal note'}
              </button>
            </form>
          </Section>

          {/* Notes list */}
          <Section icon={StickyNote} title={`Notes (${notes.length})`}>
            {notes.length === 0 ? <p className="text-sm text-muted-foreground">No notes yet.</p> : (
              <div className="space-y-3">
                {notes.slice().reverse().map((n) => (
                  <div key={n.id} className={cn('rounded-lg border p-3', n.visibleToUser ? 'border-primary/30 bg-primary-muted' : 'border-border bg-muted/40')}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{n.adminName}</span>
                      <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', n.visibleToUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                        {n.visibleToUser ? 'visible to victim' : 'internal'}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm">{n.note}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(n.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
function Field({ label, value, danger }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className={cn('mt-0.5 text-sm font-medium', danger && 'text-red-600 dark:text-red-400')}>{value || '—'}</dd>
    </div>
  );
}
function ActionBtn({ label, icon: Icon, tone, onClick, disabled }) {
  const tones = {
    success: 'border-emerald-300/60 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10',
    danger: 'border-red-300/60 text-red-700 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10',
    warning: 'border-amber-300/60 text-amber-700 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10',
    info: 'border-blue-300/60 text-blue-700 hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-300 dark:hover:bg-blue-500/10',
  };
  return (
    <button onClick={onClick} disabled={disabled} className={cn('inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-40', tones[tone])}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
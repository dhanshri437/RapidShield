import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Eye, CheckCircle2, AlertCircle, CheckCheck, ChevronRight } from 'lucide-react';
import { getAdminCases, INCIDENT_TYPES, STATUSES } from '@/lib/store';
import StatusBadge, { PriorityBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);

  useEffect(() => { setCases(getAdminCases()); }, []);

  const counts = {
    new: cases.filter((c) => c.status === STATUSES.SUBMITTED).length,
    review: cases.filter((c) => c.status === STATUSES.UNDER_REVIEW || c.status === STATUSES.NEEDS_INFO).length,
    approved: cases.filter((c) => c.status === STATUSES.APPROVED || c.status === STATUSES.REPORT_PREPARED).length,
    action: cases.filter((c) => c.status === STATUSES.USER_ACTION_REQUIRED).length,
    resolved: cases.filter((c) => c.status === STATUSES.RESOLVED).length,
  };

  const cards = [
    { label: 'New Cases', value: counts.new, icon: Inbox, tone: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' },
    { label: 'Under Review', value: counts.review, icon: Eye, tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
    { label: 'Approved', value: counts.approved, icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
    { label: 'Action Required', value: counts.action, icon: AlertCircle, tone: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300' },
    { label: 'Resolved', value: counts.resolved, icon: CheckCheck, tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review and manage submitted cases.</p>
        </div>
      </div>

      {/* Overview cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', c.tone)}><c.icon className="h-4 w-4" /></span>
              <span className="text-2xl font-bold">{c.value}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Case table */}
      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">All cases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Case ID</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Incident Type</th>
                <th className="px-5 py-3 font-medium">Platform</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Last Updated</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No cases submitted yet.</td></tr>
              )}
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono text-xs font-semibold">{c.id}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 max-w-[200px] truncate">{INCIDENT_TYPES.find((t) => t.id === c.incidentType)?.label || c.incidentType}</td>
                  <td className="px-5 py-3">{c.platform}</td>
                  <td className="px-5 py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(c.updatedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => navigate(`/admin/case/${c.id}`)} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                      Review <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
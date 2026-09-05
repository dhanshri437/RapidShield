import React from 'react';
import { CheckCircle2, Circle, Clock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Victim-visible timeline
export function UserTimeline({ entries }) {
  if (!entries.length) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }
  return (
    <ol className="relative space-y-5 border-l border-border pl-6">
      {entries.map((h, i) => (
        <li key={h.id} className="relative">
          <span
            className={cn(
              'absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-background',
              i === entries.length - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {i === entries.length - 1 ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5 fill-current" />}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{h.status}</span>
            <span className="text-xs text-muted-foreground">by {h.changedBy}</span>
          </div>
          {h.message && <p className="mt-0.5 text-sm text-muted-foreground">{h.message}</p>}
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(h.timestamp).toLocaleString()}
          </p>
        </li>
      ))}
    </ol>
  );
}

// Admin audit timeline (shows everything incl. internal + actor role)
export function AuditTimeline({ entries }) {
  if (!entries.length) {
    return <p className="text-sm text-muted-foreground">No audit entries.</p>;
  }
  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {entries.map((h) => (
        <li key={h.id} className="relative">
          <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-card text-muted-foreground ring-4 ring-background">
            <Clock className="h-3 w-3" />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{h.status || h.action}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
              {h.changedByRole || 'admin'}
            </span>
            {!h.visibleToUser && h.visibleToUser !== undefined && (
              <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                <EyeOff className="h-3 w-3" /> internal
              </span>
            )}
            {h.visibleToUser && (
              <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Eye className="h-3 w-3" /> visible
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">by {h.changedBy || h.adminName}</p>
          {(h.message || h.details) && <p className="mt-0.5 text-sm text-muted-foreground">{h.message || h.details}</p>}
          <p className="mt-0.5 text-xs text-muted-foreground">{new Date(h.timestamp).toLocaleString()}</p>
        </li>
      ))}
    </ol>
  );
}
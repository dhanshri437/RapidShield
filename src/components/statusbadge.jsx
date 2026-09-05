import React from 'react';
import { STATUSES } from '@/lib/store';
import { cn } from '@/lib/utils';

const STYLES = {
  [STATUSES.DRAFT]: 'bg-muted text-muted-foreground',
  [STATUSES.SUBMITTED]: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  [STATUSES.UNDER_REVIEW]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  [STATUSES.APPROVED]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  [STATUSES.REPORT_PREPARED]: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
  [STATUSES.USER_ACTION_REQUIRED]: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  [STATUSES.PLATFORM_SUBMITTED]: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  [STATUSES.UNDER_PLATFORM_REVIEW]: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  [STATUSES.RESOLVED]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  [STATUSES.NEEDS_INFO]: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  [STATUSES.REJECTED]: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
};

export default function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        STYLES[status] || 'bg-muted text-muted-foreground',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority, className }) {
  const map = {
    High: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    Low: 'bg-muted text-muted-foreground',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', map[priority] || map.Low, className)}>
      {priority || 'Medium'}
    </span>
  );
}
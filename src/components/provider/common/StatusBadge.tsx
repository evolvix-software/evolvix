"use client";

import { cn } from '@/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  // Campaign statuses
  draft: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  open: { bg: 'bg-success/20', text: 'text-success' },
  closed: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  completed: { bg: 'bg-primary/20', text: 'text-primary' },
  cancelled: { bg: 'bg-destructive/20', text: 'text-destructive' },
  
  // Application statuses
  submitted: { bg: 'bg-info/20', text: 'text-info' },
  under_verification: { bg: 'bg-warning/20', text: 'text-warning' },
  review_pending: { bg: 'bg-info/20', text: 'text-info' },
  shortlisted: { bg: 'bg-primary/20', text: 'text-primary' },
  awarded: { bg: 'bg-success/20', text: 'text-success' },
  rejected: { bg: 'bg-destructive/20', text: 'text-destructive' },
  withdrawn: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  
  // Scholar statuses
  active: { bg: 'bg-success/20', text: 'text-success' },
  paused: { bg: 'bg-warning/20', text: 'text-warning' },
  revoked: { bg: 'bg-destructive/20', text: 'text-destructive' },
  
  // Transfer statuses
  initiated: { bg: 'bg-info/20', text: 'text-info' },
  'in-transit': { bg: 'bg-warning/20', text: 'text-warning' },
  confirmed: { bg: 'bg-success/20', text: 'text-success' },
  failed: { bg: 'bg-destructive/20', text: 'text-destructive' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusKey = status.toLowerCase().replace(/\s+/g, '_');
  const colors = statusColors[statusKey] || statusColors.draft;
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colors.bg,
        colors.text,
        className
      )}
    >
      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}


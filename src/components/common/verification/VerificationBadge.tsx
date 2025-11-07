"use client";

import { VerificationLevel, VerificationStatus } from '@/lib/api/verification';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  level: VerificationLevel;
  status: VerificationStatus;
  role?: string;
  className?: string;
}

const levelConfig = {
  0: {
    label: 'L0 - Basic',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    icon: AlertCircle,
  },
  1: {
    label: 'L1 - ID Verified',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: CheckCircle2,
  },
  2: {
    label: 'L2 - Role Verified',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: CheckCircle2,
  },
  3: {
    label: 'L3 - Trusted',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    icon: CheckCircle2,
  },
};

const statusConfig = {
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    icon: XCircle,
  },
  incomplete: {
    label: 'Incomplete',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    icon: AlertCircle,
  },
};

export function VerificationBadge({ level, status, role, className = '' }: VerificationBadgeProps) {
  const levelInfo = levelConfig[level];
  const statusInfo = statusConfig[status];
  const LevelIcon = levelInfo.icon;
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Level Badge */}
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${levelInfo.color}`}
      >
        <LevelIcon className="w-3.5 h-3.5" />
        {levelInfo.label}
      </span>

      {/* Status Badge */}
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        <StatusIcon className="w-3.5 h-3.5" />
        {statusInfo.label}
      </span>

      {role && (
        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
          {role}
        </span>
      )}
    </div>
  );
}


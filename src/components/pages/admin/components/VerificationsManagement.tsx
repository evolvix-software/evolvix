"use client";

import { VerificationFilters } from './VerificationFilters';
import { VerificationsTable } from './VerificationsTable';
import { VerificationData } from '@/lib/api';

interface VerificationsManagementProps {
  verifications: VerificationData[];
  verificationsLoading: boolean;
  verificationsPage: number;
  verificationsTotalPages: number;
  verificationStatusFilter: 'pending' | 'approved' | 'rejected' | 'incomplete' | '';
  verificationRoleFilter: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur' | '';
  onStatusFilterChange: (status: 'pending' | 'approved' | 'rejected' | 'incomplete' | '') => void;
  onRoleFilterChange: (role: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur' | '') => void;
  onPageChange: (page: number) => void;
  onLoadVerifications: () => void;
  onVerificationSelect: (verification: VerificationData) => void;
}

export function VerificationsManagement({
  verifications,
  verificationsLoading,
  verificationsPage,
  verificationsTotalPages,
  verificationStatusFilter,
  verificationRoleFilter,
  onStatusFilterChange,
  onRoleFilterChange,
  onPageChange,
  onLoadVerifications,
  onVerificationSelect,
}: VerificationsManagementProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verification Management</h1>
      </div>

      <VerificationFilters
        statusFilter={verificationStatusFilter}
        roleFilter={verificationRoleFilter}
        onStatusFilterChange={onStatusFilterChange}
        onRoleFilterChange={onRoleFilterChange}
        onApplyFilters={onLoadVerifications}
      />

      <VerificationsTable
        verifications={verifications}
        verificationsLoading={verificationsLoading}
        page={verificationsPage}
        totalPages={verificationsTotalPages}
        onPageChange={onPageChange}
        onVerificationSelect={onVerificationSelect}
      />
    </div>
  );
}


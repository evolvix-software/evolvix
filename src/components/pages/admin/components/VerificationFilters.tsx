"use client";

import { Button } from '@/components/common/forms/Button';

interface VerificationFiltersProps {
  statusFilter: 'pending' | 'approved' | 'rejected' | 'incomplete' | '';
  roleFilter: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur' | '';
  onStatusFilterChange: (status: 'pending' | 'approved' | 'rejected' | 'incomplete' | '') => void;
  onRoleFilterChange: (role: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur' | '') => void;
  onApplyFilters: () => void;
}

export function VerificationFilters({
  statusFilter,
  roleFilter,
  onStatusFilterChange,
  onRoleFilterChange,
  onApplyFilters,
}: VerificationFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as 'pending' | 'approved' | 'rejected' | 'incomplete' | '')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value as 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur' | '')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="employer">Employer</option>
          <option value="investor">Investor</option>
          <option value="sponsor">Sponsor</option>
          <option value="entrepreneur">Entrepreneur</option>
        </select>
      </div>
      <Button onClick={onApplyFilters} className="mt-4">Apply Filters</Button>
    </div>
  );
}


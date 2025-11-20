"use client";

import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Search } from 'lucide-react';

interface UserFiltersProps {
  searchQuery: string;
  statusFilter: string;
  roleFilter: string;
  onSearchQueryChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onRoleFilterChange: (role: string) => void;
  onSearch: () => void;
}

export function UserFilters({
  searchQuery,
  statusFilter,
  roleFilter,
  onSearchQueryChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onSearch,
}: UserFiltersProps) {
  return (
    <div className="bg-card dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search by email or name..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card dark:bg-gray-700 text-gray-900 dark:text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card dark:bg-gray-700 text-gray-900 dark:text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <Button onClick={onSearch} className="mt-4">Apply Filters</Button>
    </div>
  );
}


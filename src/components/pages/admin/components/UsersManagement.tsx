"use client";

import { useState } from 'react';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Search, UserPlus, MoreVertical } from 'lucide-react';
import { AdminUser } from '@/lib/api';
import { UsersTable } from './UsersTable';
import { UserFilters } from './UserFilters';

interface UsersManagementProps {
  users: AdminUser[];
  usersLoading: boolean;
  page: number;
  totalPages: number;
  searchQuery: string;
  statusFilter: string;
  roleFilter: string;
  onSearch: () => void;
  onSearchQueryChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onRoleFilterChange: (role: string) => void;
  onPageChange: (page: number) => void;
  onCreateUser: () => void;
  onUserSelect: (user: AdminUser) => void;
  getStatusBadge: (user: AdminUser) => JSX.Element;
}

export function UsersManagement({
  users,
  usersLoading,
  page,
  totalPages,
  searchQuery,
  statusFilter,
  roleFilter,
  onSearch,
  onSearchQueryChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onPageChange,
  onCreateUser,
  onUserSelect,
  getStatusBadge,
}: UsersManagementProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <Button onClick={onCreateUser}>
          <UserPlus className="w-4 h-4 mr-2" /> Create User
        </Button>
      </div>

      <UserFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        onSearchQueryChange={onSearchQueryChange}
        onStatusFilterChange={onStatusFilterChange}
        onRoleFilterChange={onRoleFilterChange}
        onSearch={onSearch}
      />

      <UsersTable
        users={users}
        usersLoading={usersLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onUserSelect={onUserSelect}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}


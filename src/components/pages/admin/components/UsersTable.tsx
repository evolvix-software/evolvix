"use client";

import { Button } from '@/components/common/forms/Button';
import { MoreVertical } from 'lucide-react';
import { AdminUser } from '@/lib/api';

interface UsersTableProps {
  users: AdminUser[];
  usersLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUserSelect: (user: AdminUser) => void;
  getStatusBadge: (user: AdminUser) => React.ReactElement;
}

export function UsersTable({
  users,
  usersLoading,
  page,
  totalPages,
  onPageChange,
  onUserSelect,
  getStatusBadge,
}: UsersTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {usersLoading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="p-6 text-center text-gray-600 dark:text-gray-400">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id || user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.roles.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUserSelect(user)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1 || usersLoading}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || usersLoading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}


"use client";

import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { CreateUserRequest } from '@/lib/api';

interface CreateUserModalProps {
  show: boolean;
  createForm: CreateUserRequest;
  error: string;
  loading: boolean;
  onClose: () => void;
  onCreate: () => void;
  onFormChange: (form: CreateUserRequest) => void;
}

export function CreateUserModal({
  show,
  createForm,
  error,
  loading,
  onClose,
  onCreate,
  onFormChange,
}: CreateUserModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Create New User</h3>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <Input
              value={createForm.fullName}
              onChange={(e) => onFormChange({ ...createForm, fullName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <Input
              type="email"
              value={createForm.email}
              onChange={(e) => onFormChange({ ...createForm, email: e.target.value })}
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password (optional)</label>
            <Input
              type="password"
              value={createForm.password}
              onChange={(e) => onFormChange({ ...createForm, password: e.target.value })}
              placeholder="Leave empty for no password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
            <select
              value={createForm.primaryRole || ''}
              onChange={(e) => onFormChange({
                ...createForm,
                primaryRole: e.target.value as any,
                roles: e.target.value ? [e.target.value] : [],
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="employer">Employer</option>
              <option value="investor">Investor</option>
              <option value="sponsor">Sponsor</option>
              <option value="entrepreneur">Entrepreneur</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={createForm.isEmailVerified}
                onChange={(e) => onFormChange({ ...createForm, isEmailVerified: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Email Verified</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={createForm.isActive}
                onChange={(e) => onFormChange({ ...createForm, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          <Button
            onClick={onCreate}
            loading={loading}
            disabled={!createForm.fullName || !createForm.email}
            className="flex-1"
          >
            Create User
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}


"use client";

import { Button } from '@/components/common/forms/Button';
import { Ban, CheckCircle, Clock, UserCheck, UserX, Trash2 } from 'lucide-react';
import { AdminUser } from '@/lib/api';

interface UserActionsModalProps {
  show: boolean;
  user: AdminUser | null;
  error: string;
  actionLoading: string | null;
  getStatusBadge: (user: AdminUser) => JSX.Element;
  onClose: () => void;
  onAction: (userId: string, action: string, reason?: string) => void;
}

export function UserActionsModal({
  show,
  user,
  error,
  actionLoading,
  getStatusBadge,
  onClose,
  onAction,
}: UserActionsModalProps) {
  if (!show || !user) return null;

  const userId = user.id || user._id;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Manage User: {user.fullName}</h3>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="space-y-4 mb-6">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
          <p><strong>Status:</strong> {getStatusBadge(user)}</p>
          {user.isBanned && <p><strong>Ban Reason:</strong> {user.banReason || 'N/A'}</p>}
          {user.isSuspended && <p><strong>Suspend Reason:</strong> {user.suspendReason || 'N/A'}</p>}
          <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
        </div>

        <div className="space-y-3">
          {!user.isBanned ? (
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => onAction(userId, 'ban', prompt('Reason for banning?') || undefined)}
              loading={actionLoading === `ban-${userId}`}
            >
              <Ban className="w-4 h-4 mr-2" /> Ban User
            </Button>
          ) : (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onAction(userId, 'unban')}
              loading={actionLoading === `unban-${userId}`}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Unban User
            </Button>
          )}

          {!user.isSuspended ? (
            <Button
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => onAction(userId, 'suspend', prompt('Reason for suspension?') || undefined)}
              loading={actionLoading === `suspend-${userId}`}
            >
              <Clock className="w-4 h-4 mr-2" /> Suspend User
            </Button>
          ) : (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onAction(userId, 'unsuspend')}
              loading={actionLoading === `unsuspend-${userId}`}
            >
              <UserCheck className="w-4 h-4 mr-2" /> Unsuspend User
            </Button>
          )}

          {user.isActive ? (
            <Button
              className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => onAction(userId, 'deactivate')}
              loading={actionLoading === `deactivate-${userId}`}
            >
              <UserX className="w-4 h-4 mr-2" /> Deactivate User
            </Button>
          ) : (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onAction(userId, 'activate')}
              loading={actionLoading === `activate-${userId}`}
            >
              <UserCheck className="w-4 h-4 mr-2" /> Activate User
            </Button>
          )}

          <Button
            className="w-full bg-red-800 hover:bg-red-900 text-white"
            onClick={() => onAction(userId, 'delete')}
            loading={actionLoading === `delete-${userId}`}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete User
          </Button>

          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}


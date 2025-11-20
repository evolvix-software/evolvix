"use client";

import { Users, UserCheck, Ban, CheckCircle } from 'lucide-react';
import { AdminStats } from '@/lib/api';

interface DashboardViewProps {
  stats: AdminStats | null;
}

export function DashboardView({ stats }: DashboardViewProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-8">Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground mt-1">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-card dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-card dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Banned Users</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.bannedUsers}</p>
              </div>
              <Ban className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-card dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Users</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.verifiedUsers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


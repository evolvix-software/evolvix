"use client";

import { LayoutDashboard, Users, Shield } from 'lucide-react';

type View = 'dashboard' | 'users' | 'verifications';

interface ViewToggleProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onVerificationsClick: () => void;
}

export function ViewToggle({ currentView, onViewChange, onVerificationsClick }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4 lg:hidden">
      <button
        onClick={() => onViewChange('dashboard')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          currentView === 'dashboard'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <LayoutDashboard className="w-4 h-4 inline mr-2" />
        Dashboard
      </button>
      <button
        onClick={() => onViewChange('users')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          currentView === 'users'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Users className="w-4 h-4 inline mr-2" />
        User Management
      </button>
      <button
        onClick={onVerificationsClick}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          currentView === 'verifications'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Shield className="w-4 h-4 inline mr-2" />
        Verifications
      </button>
    </div>
  );
}


"use client";

import { Shield } from 'lucide-react';

interface WelcomeHeaderProps {
  userName: string;
  isVerified: boolean;
}

export function WelcomeHeader({ userName, isVerified }: WelcomeHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's your learning activity overview
          </p>
        </div>
        {isVerified && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-[#635bff]/10 dark:bg-[#635bff]/20 border border-[#635bff]/20 dark:border-[#635bff]/40 rounded-lg">
            <Shield className="w-5 h-5 text-[#635bff] dark:text-[#735fff]" />
            <span className="text-sm font-semibold text-[#635bff] dark:text-[#735fff]">Verified Student</span>
          </div>
        )}
      </div>
    </div>
  );
}


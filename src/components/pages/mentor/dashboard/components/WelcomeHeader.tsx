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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Here's your mentoring activity overview
          </p>
        </div>
        {isVerified && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">Verified Mentor</span>
          </div>
        )}
      </div>
    </div>
  );
}


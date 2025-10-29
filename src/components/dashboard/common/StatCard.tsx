"use client";

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/forms/Card';

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ icon, value, label, trend, className = '' }: StatCardProps) {
  return (
    <Card className={`border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                {icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
            {trend && (
              <div className={`flex items-center mt-2 text-xs font-medium ${
                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
                <span className="ml-1 text-slate-500 dark:text-slate-400">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


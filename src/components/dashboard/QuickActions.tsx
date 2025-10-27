"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { BookOpen, Users, Award, Calendar } from 'lucide-react';
import { QuickAction } from '@/store/features/student/studentSlice';

interface QuickActionsProps {
  actions: QuickAction[];
}

const iconMap = {
  BookOpen,
  Users,
  Award,
  Calendar
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Common tasks and features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No actions available</p>
          </div>
        ) : (
          actions.map((action) => {
          const Icon = iconMap[action.icon as keyof typeof iconMap] || BookOpen;
          
          return (
            <button 
              key={action.id}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Icon className="w-4 h-4" />
              <span>{action.label}</span>
            </button>
          );
        }))}
      </CardContent>
    </Card>
  );
}


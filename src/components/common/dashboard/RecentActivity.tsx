"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { CheckCircle, Users, BookOpen } from 'lucide-react';
import { Activity } from '@/store/features/student/studentSlice';

interface RecentActivityProps {
  activities: Activity[];
}

const iconMap = {
  CheckCircle,
  Users,
  BookOpen
};

const colorMap = {
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400'
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400'
  }
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="border-0 shadow-sm bg-card dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-foreground">Recent Activity</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Your latest learning progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
          const Icon = iconMap[activity.icon as keyof typeof iconMap] || CheckCircle;
          const colors = colorMap[activity.color as keyof typeof colorMap] || colorMap.green;
          
          return (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${colors.text}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        }))}
      </CardContent>
    </Card>
  );
}


"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

interface Notification {
  id: string;
  type: 'course' | 'achievement' | 'progress';
  title: string;
  description: string;
  time: string;
}

interface NotificationsFeedProps {
  notifications: Notification[];
}

export function NotificationsFeed({ notifications }: NotificationsFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'progress':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      default:
        return null;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20';
      case 'achievement':
        return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/20';
      case 'progress':
        return 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20';
      default:
        return 'bg-slate-50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-900/20';
    }
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Notification Feed</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">Recent updates and alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getBgColor(notification.type)} transition-all hover:scale-[1.02]`}
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{notification.description}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{notification.time}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}


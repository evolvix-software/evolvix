"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Users, TrendingUp, DollarSign, UserPlus, FileText, CheckCircle2, MessageSquare, Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'assignment' | 'milestone' | 'payment' | 'enrollment' | 'assignment_submission' | 'test_completion' | 'message' | 'announcement';
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
      case 'assignment':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'assignment_submission':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'milestone':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'enrollment':
        return <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'test_completion':
        return <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'announcement':
        return <Bell className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'assignment':
      case 'assignment_submission':
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20';
      case 'milestone':
        return 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20';
      case 'payment':
        return 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20';
      case 'enrollment':
        return 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20';
      case 'test_completion':
        return 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20';
      case 'message':
        return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20';
      case 'announcement':
        return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/20';
      default:
        return 'bg-slate-50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-900/20';
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Notification Feed</CardTitle>
        <CardDescription className="text-muted-foreground">Recent updates and alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getBgColor(notification.type)} transition-all hover:scale-[1.02]`}
            >
              <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{notification.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}


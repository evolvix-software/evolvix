"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { RecentActivity as RecentActivityType } from '@/store/features/employer/employerSlice';
import { 
  FileText, 
  Briefcase, 
  XCircle, 
  MessageSquare, 
  Award,
  Clock,
  ArrowRight,
  User
} from 'lucide-react';
import { cn } from '@/utils';

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

interface RecentActivityProps {
  activities: RecentActivityType[];
}

const activityIcons = {
  application: FileText,
  job_posted: Briefcase,
  job_closed: XCircle,
  message: MessageSquare,
  hired: Award,
  status_change: Clock,
  team_activity: User,
};

const activityColors = {
  application: 'text-blue-500 bg-blue-500/10',
  job_posted: 'text-green-500 bg-green-500/10',
  job_closed: 'text-gray-500 bg-gray-500/10',
  message: 'text-purple-500 bg-purple-500/10',
  hired: 'text-emerald-500 bg-emerald-500/10',
  status_change: 'text-yellow-500 bg-yellow-500/10',
  team_activity: 'text-indigo-500 bg-indigo-500/10',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  const router = useRouter();

  if (activities.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityLink = (activity: RecentActivityType) => {
    if (activity.type === 'application') {
      return `/portal/employer/applicants`;
    }
    if (activity.type === 'job_posted' || activity.type === 'job_closed') {
      return `/portal/employer/jobs/manage`;
    }
    if (activity.type === 'message') {
      return `/portal/employer/messaging`;
    }
    return undefined;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/portal/employer/applicants')}
        >
          View All
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity, index) => {
            const Icon = activityIcons[activity.type as keyof typeof activityIcons] || Clock;
            const colorClass = activityColors[activity.type as keyof typeof activityColors] || 'text-gray-500 bg-gray-500/10';
            const link = getActivityLink(activity);

            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg transition-all",
                  link && "hover:bg-accent/50 cursor-pointer"
                )}
                onClick={() => link && router.push(link)}
              >
                <div className="relative">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="absolute left-1/2 top-full w-0.5 h-4 bg-border transform -translate-x-1/2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

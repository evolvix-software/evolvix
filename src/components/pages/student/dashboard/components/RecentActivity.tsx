"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { BookOpen, ClipboardCheck, FileText, Award, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ActivityItem {
  id: string;
  type: 'lesson' | 'test' | 'assignment' | 'achievement';
  title: string;
  description: string;
  time: string;
  score?: number;
  course?: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'lesson',
    title: 'Completed Lesson',
    description: 'React Hooks Fundamentals',
    time: '2 hours ago',
    course: 'React Development'
  },
  {
    id: '2',
    type: 'test',
    title: 'Test Completed',
    description: 'JavaScript Fundamentals',
    time: '1 day ago',
    score: 85,
    course: 'JavaScript Basics'
  },
  {
    id: '3',
    type: 'assignment',
    title: 'Assignment Submitted',
    description: 'Personal Portfolio Page',
    time: '2 days ago',
    course: 'Web Development'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'First Certificate Earned',
    time: '3 days ago',
    course: 'Full Stack Development'
  },
];

export function RecentActivity({ activities = defaultActivities }: RecentActivityProps) {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-primary" />;
      case 'test':
        return <ClipboardCheck className="w-4 h-4 text-primary" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-success" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-primary/10 border-primary/20';
      case 'test':
        return 'bg-primary/10 border-primary/20';
      case 'assignment':
        return 'bg-success/10 border-success/20';
      case 'achievement':
        return 'bg-warning/10 border-warning/20';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
        <CardDescription className="text-muted-foreground">Your latest learning milestones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getBgColor(activity.type)} transition-all hover:scale-[1.02] cursor-pointer`}
              onClick={() => {
                if (activity.type === 'test') {
                  router.push('/portal/student/tests');
                } else if (activity.type === 'assignment') {
                  router.push('/portal/student/assignments');
                } else if (activity.type === 'lesson') {
                  router.push('/portal/student/courses');
                }
              }}
            >
              <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center flex-shrink-0">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  {activity.score && (
                    <span className="text-xs font-semibold text-primary">
                      {activity.score}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                {activity.course && (
                  <p className="text-xs text-muted-foreground mt-1">{activity.course}</p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle className="w-3 h-3 text-success" />
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}


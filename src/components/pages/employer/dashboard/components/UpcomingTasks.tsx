"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { Button } from '@/components/common/forms/Button';
import { Clock, Calendar, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@/utils';

interface Task {
  id: string;
  type: 'job_expiring' | 'application_review' | 'interview' | 'message';
  title: string;
  description: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

interface UpcomingTasksProps {
  tasks?: Task[];
}

const mockTasks: Task[] = [
  {
    id: '1',
    type: 'job_expiring',
    title: 'Job expiring soon',
    description: 'Senior Software Engineer expires in 3 days',
    dueDate: '2024-03-18',
    priority: 'high',
    link: '/portal/employer/jobs/1',
  },
  {
    id: '2',
    type: 'application_review',
    title: 'Applications pending review',
    description: '5 new applications need your attention',
    priority: 'medium',
    link: '/portal/employer/applicants',
  },
  {
    id: '3',
    type: 'interview',
    title: 'Interview scheduled',
    description: 'Interview with John Doe tomorrow at 2:00 PM',
    dueDate: '2024-03-16',
    priority: 'high',
  },
  {
    id: '4',
    type: 'message',
    title: 'Unread messages',
    description: '3 unread messages from candidates',
    priority: 'low',
    link: '/portal/employer/messaging',
  },
];

const taskIcons = {
  job_expiring: Calendar,
  application_review: FileText,
  interview: Clock,
  message: MessageSquare,
};

const priorityColors = {
  high: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20',
  medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  low: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export function UpcomingTasks({ tasks = mockTasks }: UpcomingTasksProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const handleToggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const activeTasks = tasks.filter((task) => !completedTasks.has(task.id));

  if (activeTasks.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Checkbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>All tasks completed! 🎉</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeTasks.map((task) => {
            const Icon = taskIcons[task.type];
            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border transition-all",
                  priorityColors[task.priority]
                )}
              >
                <Checkbox
                  checked={completedTasks.has(task.id)}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <h4 className="font-semibold text-sm text-foreground">{task.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {task.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = task.link!}
                  >
                    View
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


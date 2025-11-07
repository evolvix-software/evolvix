"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { BookOpen, Video, User, MessageSquare } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">Common learning tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => router.push('/portal/student/courses')}
          variant="outline"
          className="w-full justify-start border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Browse Courses
        </Button>
        <Button
          onClick={() => router.push('/portal/student/live-classes')}
          variant="outline"
          className="w-full justify-start border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Video className="w-4 h-4 mr-2" />
          Join Live Classes
        </Button>
        <Button
          onClick={() => router.push('/portal/student/mentors')}
          variant="outline"
          className="w-full justify-start border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <User className="w-4 h-4 mr-2" />
          Find Mentors
        </Button>
        <Button
          onClick={() => router.push('/portal/student/chat')}
          variant="outline"
          className="w-full justify-start border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Messages
        </Button>
      </CardContent>
    </Card>
  );
}


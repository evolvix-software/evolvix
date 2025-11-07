"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Calendar, FileText, MessageSquare } from 'lucide-react';

interface QuickActionsProps {
  isVerified: boolean;
}

export function QuickActions({ isVerified }: QuickActionsProps) {
  const router = useRouter();

  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">Common mentoring tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => {
            // TODO: Re-enable verification check after UI is complete
            // if (!isVerified) {
            //   alert('Please complete your verification first to create courses.');
            //   router.push('/portal/mentor/settings?section=profile');
            //   return;
            // }
            router.push('/portal/mentor/classes');
          }}
          variant="outline"
          className="w-full justify-start border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          // disabled={!isVerified} // Commented out for UI development
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Class {/* {isVerified ? 'Schedule Class' : 'Schedule Class (Verify First)'} */}
        </Button>
        <Button
          onClick={() => router.push('/portal/mentor/assignments')}
          variant="outline"
          className="w-full justify-start border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <FileText className="w-4 h-4 mr-2" />
          Review Assignments
        </Button>
        <Button
          onClick={() => router.push('/portal/mentor/students')}
          variant="outline"
          className="w-full justify-start border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          View Feedback
        </Button>
      </CardContent>
    </Card>
  );
}


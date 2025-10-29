"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Clock } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  student: string;
  date: string;
  time: string;
}

interface UpcomingSessionsProps {
  sessions: Session[];
}

export function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-slate-900 dark:text-white">
          <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span>Upcoming Sessions</span>
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">Your scheduled classes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No upcoming sessions</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{session.title}</h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">{session.date}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{session.student} • {session.time}</p>
              <Button size="sm" variant="outline" className="w-full border-slate-200 dark:border-slate-700">
                {session.date === 'Today' ? 'Join Session' : 'Prepare'}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}


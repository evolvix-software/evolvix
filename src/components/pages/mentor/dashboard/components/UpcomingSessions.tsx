"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
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
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
          <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span>Upcoming Sessions</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">Your scheduled classes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No upcoming sessions</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-foreground">{session.title}</h4>
                <span className="text-xs text-muted-foreground">{session.date}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{session.student} • {session.time}</p>
              <Button size="sm" variant="outline" className="w-full border-border">
                {session.date === 'Today' ? 'Join Session' : 'Prepare'}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}


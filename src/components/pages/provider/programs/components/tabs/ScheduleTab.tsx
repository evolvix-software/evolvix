"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Calendar, Clock, Video, Users, Download } from 'lucide-react';
import { Course } from '@/data/mock/providerData';

interface ScheduleTabProps {
  course: Course;
}

interface LiveSession {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  topic: string;
  recordingUrl?: string;
  attendance?: number;
}

export function ScheduleTab({ course }: ScheduleTabProps) {
  // Mock schedule data
  const upcomingSessions: LiveSession[] = [
    {
      id: 'session_1',
      title: 'Introduction to React',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      duration: 120,
      topic: 'React Fundamentals',
      attendance: 45,
    },
    {
      id: 'session_2',
      title: 'State Management',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      duration: 120,
      topic: 'React Hooks and Context',
    },
    {
      id: 'session_3',
      title: 'API Integration',
      date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      duration: 120,
      topic: 'Fetching Data',
    },
  ];

  const pastSessions: LiveSession[] = [
    {
      id: 'session_past_1',
      title: 'Course Introduction',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      duration: 90,
      topic: 'Course Overview',
      recordingUrl: '#',
      attendance: 52,
    },
    {
      id: 'session_past_2',
      title: 'HTML & CSS Basics',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      duration: 120,
      topic: 'Web Fundamentals',
      recordingUrl: '#',
      attendance: 48,
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Calendar View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Course Schedule</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Sessions</h3>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No upcoming sessions scheduled</p>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{session.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{session.topic}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.time} ({session.duration} min)</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Join Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Past Sessions</h3>
        </CardHeader>
        <CardContent>
          {pastSessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No past sessions</p>
          ) : (
            <div className="space-y-4">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{session.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{session.topic}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.time} ({session.duration} min)</span>
                        </div>
                        {session.attendance && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{session.attendance} attended</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {session.recordingUrl && (
                      <Button variant="outline" size="sm" onClick={() => window.open(session.recordingUrl, '_blank')}>
                        <Video className="w-4 h-4 mr-2" />
                        Watch Recording
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


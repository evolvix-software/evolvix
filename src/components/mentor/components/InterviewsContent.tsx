"use client";

import { Card, CardContent } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { ClipboardCheck, Bot, Video, User, Star } from 'lucide-react';

export function InterviewsContent() {
  const interviews = [
    { id: 1, student: 'Alex Johnson', type: 'Technical Interview', scheduled: '2024-01-15 3:00 PM', mode: 'live' },
    { id: 2, student: 'Sarah Chen', type: 'HR Interview', scheduled: '2024-01-16 2:00 PM', mode: 'ai-assisted' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Interview Evaluation</h2>
        <p className="text-slate-600 dark:text-slate-400">AI-assisted or live interview evaluator</p>
      </div>

      <div className="grid gap-4">
        {interviews.map((interview) => (
          <Card key={interview.id} className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <ClipboardCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">{interview.type}</h3>
                    {interview.mode === 'live' ? (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs flex items-center">
                        <Video className="w-3 h-3 mr-1" />
                        Live
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs flex items-center">
                        <Bot className="w-3 h-3 mr-1" />
                        AI-Assisted
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Student: {interview.student} • Scheduled: {interview.scheduled}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700">
                    <User className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Star className="w-4 h-4 mr-1" />
                    Evaluate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}




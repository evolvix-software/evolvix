"use client";

import { Card, CardContent } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { FileText, CheckCircle, Clock, Download, MessageSquare } from 'lucide-react';

export function AssignmentsContent() {
  const assignments = [
    { id: 1, student: 'Alex Johnson', title: 'React Project Submission', submitted: '2024-01-10', status: 'pending', score: null },
    { id: 2, student: 'Sarah Chen', title: 'Node.js API Assignment', submitted: '2024-01-08', status: 'reviewed', score: 92 },
    { id: 3, student: 'Michael Brown', title: 'Full Stack Application', submitted: '2024-01-12', status: 'pending', score: null }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review Assignments</h2>
        <p className="text-slate-600 dark:text-slate-400">Grade submissions and leave feedback</p>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{assignment.title}</h3>
                    {assignment.status === 'pending' ? (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Reviewed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Student: {assignment.student} • Submitted: {assignment.submitted}
                  </p>
                  {assignment.score && (
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Score: {assignment.score}/100
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Review
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


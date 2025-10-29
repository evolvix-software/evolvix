"use client";

import { Card, CardContent } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Users, MessageSquare, Star, TrendingUp, Search } from 'lucide-react';

export function StudentsContent() {
  const students = [
    { id: 1, name: 'Alex Johnson', progress: 85, rating: 5, assignments: 12, lastActive: '2 hours ago' },
    { id: 2, name: 'Sarah Chen', progress: 72, rating: 5, assignments: 8, lastActive: '1 day ago' },
    { id: 3, name: 'Michael Brown', progress: 90, rating: 4, assignments: 15, lastActive: '5 hours ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Student Management</h2>
          <p className="text-slate-600 dark:text-slate-400">View enrolled students, progress, and feedback</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="grid md:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    {student.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{student.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Last active: {student.lastActive}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{student.rating}</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{student.assignments} assignments</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-200 dark:border-slate-700">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Feedback
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-200 dark:border-slate-700">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Progress
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


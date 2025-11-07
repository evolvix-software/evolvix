"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
}

interface UpcomingCoursesProps {
  courses: Course[];
}

export function UpcomingCourses({ courses }: UpcomingCoursesProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-slate-900 dark:text-white">
          <BookOpen className="w-5 h-5 text-[#635bff] dark:text-[#735fff]" />
          <span>Upcoming Courses</span>
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">Your enrolled classes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {courses.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No upcoming courses</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{course.title}</h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">{course.date}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{course.instructor} • {course.time}</p>
              <Button size="sm" variant="outline" className="w-full border-slate-200 dark:border-slate-700">
                {course.date === 'Today' ? 'Join Now' : 'View Details'}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}


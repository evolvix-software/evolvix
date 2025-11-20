"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { BookOpen, Play, Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  progress?: number;
  nextLesson?: string;
}

interface UpcomingCoursesProps {
  courses: Course[];
}

export function UpcomingCourses({ courses }: UpcomingCoursesProps) {
  const router = useRouter();

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>Upcoming Courses</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">Your enrolled courses with progress</CardDescription>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No enrolled courses</p>
            <Button
              onClick={() => router.push('/portal/student/courses')}
              size="sm"
              variant="primary"
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 content-scroll">
            {courses.map((course) => (
            <div
              key={course.id}
              className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground mb-1">{course.title}</h4>
                  <p className="text-xs text-muted-foreground">{course.instructor}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{course.date}</span>
              </div>
              
              {/* Progress Bar */}
              {course.progress !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-semibold text-foreground">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Next Lesson Info */}
              {course.nextLesson && (
                <div className="flex items-center space-x-2 mb-3 text-xs text-muted-foreground">
                  <Play className="w-3 h-3" />
                  <span>Next: {course.nextLesson}</span>
                </div>
              )}

              {/* Time Info */}
              {course.time && (
                <div className="flex items-center space-x-2 mb-3 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{course.time}</span>
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                className="w-full border-border hover:bg-muted"
                onClick={() => router.push(`/portal/student/courses/${course.id}`)}
              >
                {course.date === 'Today' ? 'Join Now' : 'Continue Learning'}
              </Button>
            </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


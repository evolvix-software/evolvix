"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { TrendingUp, AlertTriangle, Calendar, BookOpen, Users, DollarSign, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LineChart } from '@/components/common/dashboard/common/LineChart';
import { useAppSelector } from '@/hooks';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/forms/Button';

interface PerformanceInsightsProps {
  revenueData?: Array<{ label: string; value: number }>;
}

export function PerformanceInsights({ revenueData }: PerformanceInsightsProps) {
  const router = useRouter();
  const { courses } = useAppSelector((state) => state.courses);

  // Top performing courses (by enrollment/completion)
  const topCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => {
        const aScore = (a.enrolledCount || 0) + (a.rating || 0) * 10;
        const bScore = (b.enrolledCount || 0) + (b.rating || 0) * 10;
        return bScore - aScore;
      })
      .slice(0, 5);
  }, [courses]);

  // Courses needing attention (low enrollment, high drop-off, low ratings)
  const coursesNeedingAttention = useMemo(() => {
    return [...courses]
      .filter(c => {
        const lowEnrollment = (c.enrolledCount || 0) < 5;
        const lowRating = c.rating < 3.5;
        const lowEngagement = (c.enrolledCount || 0) > 0 && (c.ratingCount || 0) < (c.enrolledCount || 0) * 0.1;
        return lowEnrollment || lowRating || lowEngagement;
      })
      .slice(0, 3);
  }, [courses]);

  // Students needing attention (mock data - would come from API)
  const studentsNeedingAttention = [
    { id: '1', name: 'John Doe', course: 'React Fundamentals', issue: 'Low engagement', lastActive: '5 days ago' },
    { id: '2', name: 'Jane Smith', course: 'Python Basics', issue: 'Missing assignments', lastActive: '3 days ago' },
    { id: '3', name: 'Bob Johnson', course: 'Web Development', issue: 'Low test scores', lastActive: '2 days ago' },
  ];

  // Upcoming deadlines (mock data - would come from calendar/assignments)
  const upcomingDeadlines = [
    { id: '1', type: 'assignment', title: 'Personal Portfolio Page', dueDate: '2024-12-20', course: 'Web Development' },
    { id: '2', type: 'test', title: 'JavaScript Fundamentals Test', dueDate: '2024-12-22', course: 'Web Development' },
    { id: '3', type: 'class', title: 'React Hooks Workshop', dueDate: '2024-12-21', course: 'React Fundamentals' },
  ];

  // Calculate course revenue (mock - would come from payment data)
  const courseRevenue = useMemo(() => {
    return courses.map(c => ({
      id: c.id,
      title: c.title,
      revenue: (c.enrolledCount || 0) * (c.price || 0) * 0.7, // Assuming 70% mentor commission
      enrollments: c.enrolledCount || 0,
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [courses]);

  // Default revenue trend data
  const defaultRevenueData = revenueData || [
    { label: 'Jan', value: 8500 },
    { label: 'Feb', value: 9200 },
    { label: 'Mar', value: 10800 },
    { label: 'Apr', value: 12500 },
    { label: 'May', value: 14200 },
    { label: 'Jun', value: 15800 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Performing Courses */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Top Performing Courses</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">By enrollment and completion rate</CardDescription>
            </div>
            {topCourses.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/portal/mentor/courses')}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No courses available</p>
            ) : (
              topCourses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => router.push(`/portal/mentor/courses/${course.id}`)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                      index === 1 ? 'bg-muted text-muted-foreground' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{course.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {course.enrolledCount || 0} students
                        </span>
                        <span className="flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {Math.round((course.enrolledCount || 0) * 0.75)}% complete
                        </span>
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                          {course.rating.toFixed(1)}
                        </span>
                        {course.price > 0 && (
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ${((course.enrolledCount || 0) * course.price * 0.7).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Courses Needing Attention */}
      {coursesNeedingAttention.length > 0 && (
        <Card className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span>Courses Needing Attention</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">Courses with low enrollment, ratings, or high drop-off rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coursesNeedingAttention.map((course) => {
                const issues = [];
                if ((course.enrolledCount || 0) < 5) issues.push('Low enrollment');
                if (course.rating < 3.5) issues.push('Low rating');
                if ((course.enrolledCount || 0) > 0 && (course.ratingCount || 0) < (course.enrolledCount || 0) * 0.1) issues.push('Low engagement');
                
                return (
                  <div 
                    key={course.id} 
                    className="flex items-center justify-between p-3 bg-background rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => router.push(`/portal/mentor/courses/${course.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{course.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>{course.enrolledCount || 0} students</span>
                        <span>Rating: {course.rating.toFixed(1)}</span>
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Issues: {issues.join(', ')}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Revenue */}
      {courseRevenue.length > 0 && (
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Course Revenue</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">Top courses by revenue generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courseRevenue.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{course.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>{course.enrollments} enrollments</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      ${course.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Needing Attention */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span>Students Needing Attention</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">Low engagement alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentsNeedingAttention.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">All students are doing well!</p>
            ) : (
              studentsNeedingAttention.map((student) => (
                <div
                  key={student.id}
                  className="flex items-start justify-between p-3 border border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {student.course} • {student.issue}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Last active: {student.lastActive}</p>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 ml-2" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trends */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Revenue Trends</CardTitle>
          <CardDescription className="text-muted-foreground">Weekly/Monthly revenue overview</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            title=""
            description=""
            data={defaultRevenueData}
            height={200}
            color="green"
          />
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Upcoming Deadlines</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">Assignments, classes, and tests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines</p>
            ) : (
              upcomingDeadlines.map((deadline) => {
                const dueDate = new Date(deadline.dueDate);
                const now = new Date();
                const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysUntilDue <= 2;

                return (
                  <div
                    key={deadline.id}
                    className={`flex items-start justify-between p-3 border rounded-lg ${
                      isUrgent
                        ? 'border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10'
                        : 'border-border bg-muted'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          deadline.type === 'assignment' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                          deadline.type === 'test' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                          'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                          {deadline.type}
                        </span>
                        {isUrgent && (
                          <span className="text-xs font-medium text-red-600 dark:text-red-400">Urgent</span>
                        )}
                      </div>
                      <p className="font-medium text-foreground mt-1">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{deadline.course}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {dueDate.toLocaleDateString()} ({daysUntilDue > 0 ? `${daysUntilDue} days` : 'Today'})
                      </p>
                    </div>
                    <Calendar className={`w-4 h-4 flex-shrink-0 ml-2 ${
                      isUrgent ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                    }`} />
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { BookOpen, TrendingUp, Eye, Search, Star, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/hooks';
import { LineChart } from '@/components/common/dashboard/common/LineChart';

export function CourseAnalytics() {
  const { courses } = useAppSelector(state => state.courses);

  // Mock data
  const enrollmentTrends = [
    { label: 'Jan', value: 5 },
    { label: 'Feb', value: 12 },
    { label: 'Mar', value: 18 },
    { label: 'Apr', value: 25 },
    { label: 'May', value: 32 },
    { label: 'Jun', value: 45 },
  ];

  const courseViews = [
    { course: 'React Mastery', views: 1250, enrollments: 25, conversion: 2.0 },
    { course: 'Node.js Advanced', views: 980, enrollments: 18, conversion: 1.8 },
    { course: 'Python Data Science', views: 750, enrollments: 15, conversion: 2.0 },
  ];

  const mostViewedLessons = [
    { lesson: 'Introduction to React Hooks', views: 450, course: 'React Mastery' },
    { lesson: 'Advanced State Management', views: 380, course: 'React Mastery' },
    { lesson: 'Building REST APIs', views: 320, course: 'Node.js Advanced' },
  ];

  const leastViewedLessons = [
    { lesson: 'Legacy Code Patterns', views: 45, course: 'React Mastery' },
    { lesson: 'Advanced Debugging', views: 38, course: 'Node.js Advanced' },
    { lesson: 'Performance Optimization', views: 52, course: 'Python Data Science' },
  ];

  const moduleCompletionRates = [
    { module: 'Module 1: Basics', completion: 95 },
    { module: 'Module 2: Intermediate', completion: 78 },
    { module: 'Module 3: Advanced', completion: 65 },
    { module: 'Module 4: Projects', completion: 45 },
  ];

  const averageRating = 4.5;
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
  const totalViews = courseViews.reduce((sum, c) => sum + c.views, 0);
  const averageConversionRate = courseViews.reduce((sum, c) => sum + c.conversion, 0) / courseViews.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Enrollments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalEnrollments}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Across all courses
                </p>
              </div>
              <Users className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalViews.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Course page views
                </p>
              </div>
              <Eye className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {averageConversionRate.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  View to enroll
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Out of 5.0
                </p>
              </div>
              <Star className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Trends */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Enrollment Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            title="Enrollment Trends"
            data={enrollmentTrends}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Course Views & Conversion */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Course Views & Conversion</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseViews.map((course, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{course.course}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {course.views.toLocaleString()} views • {course.enrollments} enrollments
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {course.conversion}%
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">conversion</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most & Least Viewed Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Most Viewed Lessons</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostViewedLessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                >
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {lesson.lesson}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {lesson.course} • {lesson.views} views
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Least Viewed Lessons</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leastViewedLessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                >
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {lesson.lesson}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {lesson.course} • {lesson.views} views
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Completion Rates */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Module Completion Rates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleCompletionRates.map((module, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{module.module}</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {module.completion}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-slate-600 dark:bg-slate-500 h-2 rounded-full"
                    style={{ width: `${module.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


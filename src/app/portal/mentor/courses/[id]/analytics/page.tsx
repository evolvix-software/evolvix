"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { useAppSelector } from '@/hooks';
import { Course } from '@/data/mock/coursesData';
import { LineChart } from '@/components/common/dashboard/common/LineChart';
import { ArrowLeft, TrendingUp, Users, Clock, Star, DollarSign, BookOpen, AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function CourseAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { courses } = useAppSelector(state => state.courses);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === params.id);
    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [courses, params.id]);

  if (!course) {
    return (
      <Layout title="Course Analytics" role="mentor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading analytics...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  // Mock analytics data - would come from API
  const enrollmentTrends = [
    { label: 'Jan', value: 5 },
    { label: 'Feb', value: 12 },
    { label: 'Mar', value: 18 },
    { label: 'Apr', value: 25 },
    { label: 'May', value: 32 },
    { label: 'Jun', value: 45 },
  ];

  const moduleCompletionRates = course.modules.map((module, index) => ({
    module: `Module ${index + 1}: ${module.title}`,
    completionRate: Math.floor(Math.random() * 40) + 60, // Mock: 60-100%
    enrolled: course.enrolledCount || 0,
    completed: Math.floor((course.enrolledCount || 0) * (0.6 + Math.random() * 0.4)),
  }));

  const dropOffPoints = course.modules.map((module, index) => ({
    module: `Module ${index + 1}`,
    dropOffRate: Math.floor(Math.random() * 20) + 5, // Mock: 5-25%
    students: Math.floor((course.enrolledCount || 0) * (0.05 + Math.random() * 0.2)),
  }));

  const averageTimeToComplete = course.modules.map((module, index) => ({
    module: `Module ${index + 1}`,
    averageHours: Math.floor(Math.random() * 10) + 5, // Mock: 5-15 hours
  }));

  const satisfactionScores = course.modules.map((module, index) => ({
    module: `Module ${index + 1}`,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Mock: 3.5-5.0
    reviews: Math.floor(Math.random() * 20) + 5,
  }));

  const popularContent = course.modules.flatMap((module, moduleIdx) =>
    module.lessons.map((lesson, lessonIdx) => ({
      id: lesson.id,
      title: lesson.title,
      module: module.title,
      views: Math.floor(Math.random() * 100) + 50,
      completionRate: Math.floor(Math.random() * 30) + 70,
    }))
  ).sort((a, b) => b.views - a.views).slice(0, 10);

  const commonFeedback = [
    { issue: 'Video quality could be better', count: 15, percentage: 35 },
    { issue: 'Need more examples', count: 12, percentage: 28 },
    { issue: 'Pace is too fast', count: 8, percentage: 19 },
    { issue: 'Assignments are challenging', count: 5, percentage: 12 },
    { issue: 'Need more practice problems', count: 3, percentage: 7 },
  ];

  const courseRevenue = course.price * (course.enrolledCount || 0);

  return (
    <Layout title={`${course.title} - Analytics`} role="mentor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push(`/portal/mentor/courses/${course.id}`)}
              variant="outline"
              className="border-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
              <p className="text-muted-foreground">Course Analytics Dashboard</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Enrollments</p>
                  <p className="text-3xl font-bold text-foreground">{course.enrolledCount || 0}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% this month</p>
                </div>
                <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-foreground">
                    {moduleCompletionRates.length > 0
                      ? Math.round(moduleCompletionRates.reduce((sum, m) => sum + m.completionRate, 0) / moduleCompletionRates.length)
                      : 0}%
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">+5% vs last month</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Satisfaction</p>
                  <p className="text-3xl font-bold text-foreground">
                    {satisfactionScores.length > 0
                      ? (satisfactionScores.reduce((sum, s) => sum + parseFloat(s.rating), 0) / satisfactionScores.length).toFixed(1)
                      : '0.0'}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">4.2/5.0 average</p>
                </div>
                <Star className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Course Revenue</p>
                  <p className="text-3xl font-bold text-foreground">${courseRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{course.enrolledCount || 0} students</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollment Trends */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Enrollment Trends</span>
            </CardTitle>
            <CardDescription>Student enrollment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              title=""
              description=""
              data={enrollmentTrends}
              height={250}
              color="green"
            />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Completion Rates by Module */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Completion Rates by Module</span>
              </CardTitle>
              <CardDescription>Percentage of students completing each module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleCompletionRates.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground truncate">{item.module}</span>
                      <span className="text-muted-foreground">{item.completed}/{item.enrolled}</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${item.completionRate}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.completionRate}% completion</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Drop-off Points */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span>Student Drop-off Points</span>
              </CardTitle>
              <CardDescription>Where students stop progressing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dropOffPoints.map((item, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{item.module}</span>
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        {item.dropOffRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.students} students dropped off</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Average Time to Complete */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Average Time to Complete</span>
              </CardTitle>
              <CardDescription>Time spent per module (hours)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {averageTimeToComplete.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <span className="font-medium text-foreground">{item.module}</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{item.averageHours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Satisfaction Scores */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span>Student Satisfaction Scores</span>
              </CardTitle>
              <CardDescription>Ratings per module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {satisfactionScores.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-foreground block">{item.module}</span>
                      <span className="text-xs text-muted-foreground">{item.reviews} reviews</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-foreground">{item.rating}/5.0</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Content */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Popular Content</span>
            </CardTitle>
            <CardDescription>Most viewed lessons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularContent.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.module}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{item.views}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{item.completionRate}%</p>
                      <p className="text-xs text-muted-foreground">complete</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Feedback Summary */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Student Feedback Summary</span>
            </CardTitle>
            <CardDescription>Common issues and feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonFeedback.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.issue}</span>
                    <span className="text-muted-foreground">{item.count} mentions ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


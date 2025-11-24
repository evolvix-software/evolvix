"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { TrendingUp, Users, CheckCircle, Clock, Award, BarChart3 } from 'lucide-react';
import { Course } from '@/data/mock/providerData';

interface ProgressTabProps {
  course: Course;
  courseId: string;
}

export function ProgressTab({ course, courseId }: ProgressTabProps) {
  // Mock progress data
  const averageProgress = 68;
  const completionRate = 45;
  const dropoutRate = 12;
  const averageGrade = 87;
  const engagementScore = 82;

  const progressDistribution = [
    { range: '0-25%', label: 'Just Started', count: 8, percentage: 20 },
    { range: '25-50%', label: 'In Progress', count: 12, percentage: 30 },
    { range: '50-75%', label: 'Almost Done', count: 10, percentage: 25 },
    { range: '75-100%', label: 'Near Completion', count: 6, percentage: 15 },
    { range: '100%', label: 'Completed', count: 4, percentage: 10 },
  ];

  const moduleProgress = [
    { module: 'Introduction', completion: 95 },
    { module: 'Frontend Basics', completion: 85 },
    { module: 'React Fundamentals', completion: 75 },
    { module: 'State Management', completion: 65 },
    { module: 'Backend Development', completion: 55 },
    { module: 'Full Stack Integration', completion: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Progress</p>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{averageProgress}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Dropout Rate</p>
              <Users className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{dropoutRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Grade</p>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{averageGrade}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Engagement</p>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{engagementScore}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Distribution */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Progress Distribution</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressDistribution.map((item) => (
              <div key={item.range}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-20">{item.range}</span>
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{item.count} students</span>
                    <span className="text-sm text-muted-foreground w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module Completion */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Module Completion Rates</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleProgress.map((module, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{module.module}</span>
                  <span className="text-sm font-semibold text-foreground">{module.completion}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      module.completion >= 80
                        ? 'bg-green-600'
                        : module.completion >= 60
                        ? 'bg-yellow-600'
                        : 'bg-orange-600'
                    }`}
                    style={{ width: `${module.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Completion Funnel</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-foreground">Enrolled</span>
                </div>
                <span className="text-xl font-bold text-foreground">{course.enrolledCount || 40}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-foreground">In Progress</span>
                </div>
                <span className="text-xl font-bold text-foreground">
                  {Math.round((course.enrolledCount || 40) * 0.7)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-foreground">Completed</span>
                </div>
                <span className="text-xl font-bold text-foreground">
                  {Math.round((course.enrolledCount || 40) * 0.45)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Engagement Trends</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Engagement chart visualization</p>
                <p className="text-sm text-muted-foreground mt-2">
                  (Chart implementation would go here)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { TrendingUp, Users, Award, BarChart3, LineChart, PieChart } from 'lucide-react';
import { Course } from '@/data/mock/providerData';

interface AnalyticsTabProps {
  course: Course;
  courseId: string;
}

export function AnalyticsTab({ course, courseId }: AnalyticsTabProps) {
  // Mock analytics data
  const enrollmentTrends = [
    { month: 'Jan', enrolled: 10 },
    { month: 'Feb', enrolled: 15 },
    { month: 'Mar', enrolled: 20 },
    { month: 'Apr', enrolled: 25 },
    { month: 'May', enrolled: 30 },
    { month: 'Jun', enrolled: course.enrolledCount || 35 },
  ];

  const completionTrends = [
    { week: 'Week 1', completion: 95 },
    { week: 'Week 2', completion: 90 },
    { week: 'Week 3', completion: 85 },
    { week: 'Week 4', completion: 80 },
    { week: 'Week 5', completion: 75 },
    { week: 'Week 6', completion: 70 },
  ];

  const scholarshipImpact = {
    scholarshipStudents: 20,
    nonScholarshipStudents: 15,
    scholarshipCompletionRate: 85,
    nonScholarshipCompletionRate: 60,
    scholarshipAvgGrade: 92,
    nonScholarshipAvgGrade: 78,
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Enrolled</p>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{course.enrolledCount || 35}</p>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">68%</p>
            <p className="text-xs text-green-600 mt-1">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Scholarship Students</p>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{scholarshipImpact.scholarshipStudents}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {((scholarshipImpact.scholarshipStudents / (course.enrolledCount || 35)) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Grade</p>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">87%</p>
            <p className="text-xs text-green-600 mt-1">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Trends */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Enrollment Trends</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Monthly Enrollment</span>
              </div>
            </div>
            <div className="space-y-2">
              {enrollmentTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-12">{trend.month}</span>
                  <div className="flex-1 bg-muted rounded-full h-4 relative">
                    <div
                      className="bg-primary h-4 rounded-full"
                      style={{ width: `${(trend.enrolled / Math.max(...enrollmentTrends.map(t => t.enrolled))) * 100}%` }}
                    />
                    <span className="absolute right-2 top-0 text-xs font-semibold text-foreground">
                      {trend.enrolled}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Trends */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Completion Trends</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium text-foreground">Weekly Completion Rate</span>
              </div>
            </div>
            <div className="space-y-2">
              {completionTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-16">{trend.week}</span>
                  <div className="flex-1 bg-muted rounded-full h-4 relative">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{ width: `${trend.completion}%` }}
                    />
                    <span className="absolute right-2 top-0 text-xs font-semibold text-foreground">
                      {trend.completion}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scholarship Impact */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Scholarship Impact Analysis</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Completion Rate Comparison</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Scholarship Students</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {scholarshipImpact.scholarshipCompletionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${scholarshipImpact.scholarshipCompletionRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Non-Scholarship Students</span>
                    <span className="text-sm font-semibold text-gray-600">
                      {scholarshipImpact.nonScholarshipCompletionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gray-600 h-3 rounded-full"
                      style={{ width: `${scholarshipImpact.nonScholarshipCompletionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Average Grade Comparison</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Scholarship Students</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {scholarshipImpact.scholarshipAvgGrade}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${scholarshipImpact.scholarshipAvgGrade}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Non-Scholarship Students</span>
                    <span className="text-sm font-semibold text-gray-600">
                      {scholarshipImpact.nonScholarshipAvgGrade}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gray-600 h-3 rounded-full"
                      style={{ width: `${scholarshipImpact.nonScholarshipAvgGrade}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Performance Distribution</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Performance distribution chart</p>
            <p className="text-sm text-muted-foreground mt-2">
              (Chart implementation would go here - showing grade distribution)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


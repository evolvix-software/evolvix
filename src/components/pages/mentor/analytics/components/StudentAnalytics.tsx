"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Users, Clock, TrendingUp, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StudentPerformanceMetrics } from '@/interfaces/analytics';
import { AnimatedBarChart } from '@/components/common/dashboard/common/AnimatedBarChart';

interface StudentAnalyticsProps {
  performance: StudentPerformanceMetrics[];
}

export function StudentAnalytics({ performance }: StudentAnalyticsProps) {
  // Mock engagement data
  const activeStudents = Math.floor(performance.length * 0.75);
  const inactiveStudents = performance.length - activeStudents;

  const engagementData = [
    { label: 'Active', value: activeStudents },
    { label: 'Inactive', value: inactiveStudents },
  ];

  const loginFrequency = [
    { range: 'Daily', count: 15 },
    { range: '3-4x/week', count: 20 },
    { range: '1-2x/week', count: 10 },
    { range: 'Rarely', count: 5 },
  ];

  const averageTimeSpent = 4.5; // hours per week
  const averageCompletionRate = performance.length > 0
    ? performance.reduce((sum, p) => sum + p.progress, 0) / performance.length
    : 0;

  const dropOffPoints = [
    { module: 'Module 1', enrolled: 50, completed: 45, dropOff: 10 },
    { module: 'Module 2', enrolled: 45, completed: 38, dropOff: 15.6 },
    { module: 'Module 3', enrolled: 38, completed: 30, dropOff: 21.1 },
    { module: 'Module 4', enrolled: 30, completed: 25, dropOff: 16.7 },
  ];

  const averageGrade = performance.length > 0
    ? performance.reduce((sum, p) => sum + p.currentScore, 0) / performance.length
    : 0;

  const testScoreDistribution = [
    { range: '90-100', count: 12 },
    { range: '80-89', count: 18 },
    { range: '70-79', count: 15 },
    { range: '60-69', count: 8 },
    { range: 'Below 60', count: 2 },
  ];

  const assignmentCompletionRate = performance.length > 0
    ? performance.reduce((sum, p) => sum + (p.assignmentsCompleted / p.assignmentsTotal), 0) / performance.length * 100
    : 0;

  const learningPace = [
    { pace: 'Fast', count: 15 },
    { pace: 'Average', count: 25 },
    { pace: 'Slow', count: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Active Students</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeStudents}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {((activeStudents / performance.length) * 100).toFixed(0)}% of total
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Time Spent</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {averageTimeSpent}h
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Per week
                </p>
              </div>
              <Clock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {averageCompletionRate.toFixed(0)}%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Average across courses
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
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Inactive Students</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {inactiveStudents}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Need attention
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active vs Inactive */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Student Engagement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedBarChart
            data={engagementData}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Login Frequency */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Login Frequency</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginFrequency.map((item, idx) => {
              const percentage = (item.count / performance.length) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">{item.range}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.count} students ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-slate-600 dark:bg-slate-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Average Grades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {averageGrade.toFixed(1)}%
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Across all students and courses
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Assignment Completion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {assignmentCompletionRate.toFixed(0)}%
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Average completion rate
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Scores Distribution */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Test Scores Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedBarChart
            data={testScoreDistribution.map(d => ({ label: d.range, value: d.count }))}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Drop-off Analysis */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Drop-off Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dropOffPoints.map((point, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{point.module}</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {point.dropOff.toFixed(1)}% drop-off
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-slate-600 dark:bg-slate-500 h-2 rounded-full"
                      style={{ width: `${((point.completed / point.enrolled) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 w-20 text-right">
                    {point.completed}/{point.enrolled}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Pace */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Learning Pace Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {learningPace.map((pace, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-center"
              >
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {pace.count}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{pace.pace}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


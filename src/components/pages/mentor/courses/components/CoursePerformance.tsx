"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Course } from '@/data/mock/coursesData';
import { Users, Clock, BarChart, TrendingUp, AlertCircle, CheckCircle2, Target } from 'lucide-react';
import { LineChart } from '@/components/common/dashboard/common/LineChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CoursePerformanceProps {
  course: Course;
}

export function CoursePerformance({ course }: CoursePerformanceProps) {
  // Mock student progress data
  const studentProgress = [
    { id: '1', name: 'John Doe', progress: 85, lastActivity: '2 days ago', status: 'on-track' },
    { id: '2', name: 'Jane Smith', progress: 45, lastActivity: '1 week ago', status: 'at-risk' },
    { id: '3', name: 'Bob Johnson', progress: 100, lastActivity: '1 day ago', status: 'completed' },
    { id: '4', name: 'Alice Williams', progress: 30, lastActivity: '3 days ago', status: 'at-risk' },
    { id: '5', name: 'Charlie Brown', progress: 70, lastActivity: '1 day ago', status: 'on-track' },
  ];

  // Mock engagement metrics
  const engagementData = [
    { label: 'Week 1', videoWatchTime: 120, quizAttempts: 45 },
    { label: 'Week 2', videoWatchTime: 180, quizAttempts: 52 },
    { label: 'Week 3', videoWatchTime: 150, quizAttempts: 48 },
    { label: 'Week 4', videoWatchTime: 200, quizAttempts: 60 },
    { label: 'Week 5', videoWatchTime: 175, quizAttempts: 55 },
  ];

  // Mock assessment analytics
  const assessmentAnalytics = [
    { assessment: 'Module 1 Quiz', averageScore: 85, attempts: 45, passRate: 88 },
    { assessment: 'Module 2 Quiz', averageScore: 78, attempts: 42, passRate: 81 },
    { assessment: 'Module 3 Assignment', averageScore: 82, attempts: 40, passRate: 85 },
    { assessment: 'Final Project', averageScore: 88, attempts: 38, passRate: 92 },
  ];

  // Mock success predictors
  const successPredictors = [
    { factor: 'Early Engagement', impact: 'High', description: 'Students who complete Week 1 within 3 days have 85% completion rate' },
    { factor: 'Quiz Performance', impact: 'High', description: 'Students scoring above 80% on first quiz have 90% success rate' },
    { factor: 'Assignment Submission', impact: 'Medium', description: 'Submitting assignments on time correlates with 75% completion' },
    { factor: 'Forum Participation', impact: 'Medium', description: 'Active forum users show 20% higher completion rates' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'on-track':
        return 'text-blue-600 dark:text-blue-400';
      case 'at-risk':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'on-track':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'at-risk':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'text-red-600 dark:text-red-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Tabs defaultValue="progress" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="progress">
          <Users className="w-4 h-4 mr-2" />
          Progress
        </TabsTrigger>
        <TabsTrigger value="engagement">
          <Clock className="w-4 h-4 mr-2" />
          Engagement
        </TabsTrigger>
        <TabsTrigger value="assessments">
          <BarChart className="w-4 h-4 mr-2" />
          Assessments
        </TabsTrigger>
        <TabsTrigger value="predictors">
          <Target className="w-4 h-4 mr-2" />
          Predictors
        </TabsTrigger>
      </TabsList>

      {/* Student Progress Tracking */}
      <TabsContent value="progress" className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">{studentProgress.length}</p>
                </div>
                <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Progress</p>
                  <p className="text-3xl font-bold text-foreground">
                    {Math.round(studentProgress.reduce((sum, s) => sum + s.progress, 0) / studentProgress.length)}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">At Risk</p>
                  <p className="text-3xl font-bold text-foreground">
                    {studentProgress.filter(s => s.status === 'at-risk').length}
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Individual Student Progress</span>
            </CardTitle>
            <CardDescription>Track progress for each enrolled student</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentProgress.map((student) => (
                <div key={student.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">Last activity: {student.lastActivity}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusBadge(student.status)}`}>
                      {student.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{student.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          student.status === 'completed' ? 'bg-green-500' :
                          student.status === 'on-track' ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Engagement Metrics */}
      <TabsContent value="engagement" className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Video Watch Time</span>
            </CardTitle>
            <CardDescription>Average minutes watched per week</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              title=""
              description=""
              data={engagementData.map(d => ({ label: d.label, value: d.videoWatchTime }))}
              height={250}
              color="purple"
            />
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Quiz Attempts</span>
            </CardTitle>
            <CardDescription>Number of quiz attempts per week</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              title=""
              description=""
              data={engagementData.map(d => ({ label: d.label, value: d.quizAttempts }))}
              height={250}
              color="blue"
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Watch Time</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(engagementData.reduce((sum, d) => sum + d.videoWatchTime, 0) / engagementData.length)} min/week
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Quiz Attempts</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(engagementData.reduce((sum, d) => sum + d.quizAttempts, 0) / engagementData.length)}/week
                  </p>
                </div>
                <BarChart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Assessment Analytics */}
      <TabsContent value="assessments" className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Assessment Performance</span>
            </CardTitle>
            <CardDescription>Performance metrics for quizzes and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessmentAnalytics.map((assessment, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{assessment.assessment}</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-muted-foreground">{assessment.attempts} attempts</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {assessment.passRate}% pass rate
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className="font-semibold text-foreground">{assessment.averageScore}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-600 dark:bg-slate-500 rounded-full"
                        style={{ width: `${assessment.averageScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Success Predictors */}
      <TabsContent value="predictors" className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span>Student Success Predictors</span>
            </CardTitle>
            <CardDescription>AI-powered insights on student success factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {successPredictors.map((predictor, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground flex items-center space-x-2">
                        <span>{predictor.factor}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getImpactColor(predictor.impact)}`}>
                          {predictor.impact} Impact
                        </span>
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">{predictor.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}


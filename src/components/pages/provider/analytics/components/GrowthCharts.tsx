"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { TrendingUp, BarChart3, Award, BookOpen, Users, Activity } from 'lucide-react';
import { scholarService } from '@/data/mock/providerData';
import { Scholar } from '@/data/mock/providerData';

interface GrowthChartsProps {
  providerId?: string;
  campaignId?: string;
  detailed?: boolean;
}

export function GrowthCharts({ providerId, campaignId, detailed = false }: GrowthChartsProps) {
  const [cgpaData, setCgpaData] = useState({
    averageBaseline: 0,
    averageCurrent: 0,
    averageGraduation: 0,
    averageImprovement: 0,
    improvementPercentage: 0,
    topImprovers: [] as Scholar[],
  });

  const [courseProgress, setCourseProgress] = useState({
    averageCompletionRate: 0,
    averageVideoWatch: 0,
    averageAssignmentSubmission: 0,
    averageSessionAttendance: 0,
    completionByCourse: {} as Record<string, number>,
  });

  const [engagement, setEngagement] = useState({
    averageScore: 0,
    averageLogins: 0,
    averageTimeSpent: 0,
    averageMentorSessions: 0,
    averageForumActivity: 0,
  });

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const filteredScholars = campaignId
      ? scholars.filter(s => s.campaignId === campaignId)
      : scholars;

    // CGPA Growth Analysis
    const scholarsWithCGPA = filteredScholars.filter(s => s.baselineCGPA > 0);
    const scholarsWithCurrentCGPA = scholarsWithCGPA.filter(s => s.currentCGPA);
    const graduatedScholars = scholarsWithCGPA.filter(s => s.graduationCGPA);

    const averageBaseline = scholarsWithCGPA.length > 0
      ? scholarsWithCGPA.reduce((sum, s) => sum + s.baselineCGPA, 0) / scholarsWithCGPA.length
      : 0;

    const averageCurrent = scholarsWithCurrentCGPA.length > 0
      ? scholarsWithCurrentCGPA.reduce((sum, s) => sum + (s.currentCGPA || s.baselineCGPA), 0) / scholarsWithCurrentCGPA.length
      : 0;

    const averageGraduation = graduatedScholars.length > 0
      ? graduatedScholars.reduce((sum, s) => sum + (s.graduationCGPA || s.baselineCGPA), 0) / graduatedScholars.length
      : 0;

    const improvements = scholarsWithCurrentCGPA.map(s => {
      const improvement = (s.currentCGPA || s.baselineCGPA) - s.baselineCGPA;
      return { scholar: s, improvement };
    });

    const averageImprovement = improvements.length > 0
      ? improvements.reduce((sum, item) => sum + item.improvement, 0) / improvements.length
      : 0;

    const topImprovers = [...improvements]
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, 5)
      .map(item => item.scholar);

    const improvementPercentage = averageBaseline > 0
      ? (averageImprovement / averageBaseline) * 100
      : 0;

    setCgpaData({
      averageBaseline: Math.round(averageBaseline * 10) / 10,
      averageCurrent: Math.round(averageCurrent * 10) / 10,
      averageGraduation: Math.round(averageGraduation * 10) / 10,
      averageImprovement: Math.round(averageImprovement * 10) / 10,
      improvementPercentage: Math.round(improvementPercentage * 10) / 10,
      topImprovers,
    });

    // Course Progress Analysis
    const enrollments = filteredScholars.flatMap(s => s.enrollments || []);
    const averageCompletionRate = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / enrollments.length
      : 0;

    const averageVideoWatch = filteredScholars.length > 0
      ? filteredScholars.reduce((sum, s) => sum + (s.engagement?.videoWatchPercentage || 0), 0) / filteredScholars.length
      : 0;

    const averageAssignmentSubmission = filteredScholars.length > 0
      ? filteredScholars.reduce((sum, s) => sum + (s.engagement?.assignmentSubmissionRate || 0), 0) / filteredScholars.length
      : 0;

    // Mock session attendance (not in data structure)
    const averageSessionAttendance = 85; // Mock value

    // Completion by course
    const completionByCourse: Record<string, number[]> = {};
    enrollments.forEach(e => {
      if (!completionByCourse[e.courseId]) {
        completionByCourse[e.courseId] = [];
      }
      completionByCourse[e.courseId].push(e.completionPercentage);
    });

    const completionByCourseAvg: Record<string, number> = {};
    Object.keys(completionByCourse).forEach(courseId => {
      const rates = completionByCourse[courseId];
      completionByCourseAvg[courseId] = rates.reduce((sum, r) => sum + r, 0) / rates.length;
    });

    setCourseProgress({
      averageCompletionRate: Math.round(averageCompletionRate * 10) / 10,
      averageVideoWatch: Math.round(averageVideoWatch * 10) / 10,
      averageAssignmentSubmission: Math.round(averageAssignmentSubmission * 10) / 10,
      averageSessionAttendance,
      completionByCourse: completionByCourseAvg,
    });

    // Engagement Analysis
    const averageLogins = filteredScholars.length > 0
      ? filteredScholars.reduce((sum, s) => sum + (s.engagement?.totalLogins || 0), 0) / filteredScholars.length
      : 0;

    const averageMentorSessions = filteredScholars.length > 0
      ? filteredScholars.reduce((sum, s) => sum + (s.engagement?.mentorSessionCount || 0), 0) / filteredScholars.length
      : 0;

    // Mock values for time spent and forum activity
    const averageTimeSpent = 120; // minutes per week (mock)
    const averageForumActivity = 8; // posts per month (mock)

    // Engagement score (weighted average)
    const engagementScore = (
      (averageVideoWatch * 0.3) +
      (averageAssignmentSubmission * 0.3) +
      (averageCompletionRate * 0.2) +
      (Math.min(averageLogins / 10, 1) * 100 * 0.1) +
      (Math.min(averageMentorSessions / 5, 1) * 100 * 0.1)
    );

    setEngagement({
      averageScore: Math.round(engagementScore * 10) / 10,
      averageLogins: Math.round(averageLogins),
      averageTimeSpent,
      averageMentorSessions: Math.round(averageMentorSessions * 10) / 10,
      averageForumActivity,
    });
  }, [providerId, campaignId]);

  return (
    <div className="space-y-6">
      {/* CGPA Growth Analysis */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            CGPA Growth Analysis
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Baseline CGPA</p>
              <p className="text-2xl font-bold text-foreground">{cgpaData.averageBaseline}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Current CGPA</p>
              <p className="text-2xl font-bold text-foreground">{cgpaData.averageCurrent}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Graduation CGPA</p>
              <p className="text-2xl font-bold text-foreground">{cgpaData.averageGraduation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Improvement</p>
              <p className="text-2xl font-bold text-green-600">+{cgpaData.averageImprovement}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Improvement %</p>
              <p className="text-2xl font-bold text-green-600">+{cgpaData.improvementPercentage}%</p>
            </div>
          </div>

          {detailed && (
            <>
              <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>CGPA Trend Chart</p>
                  <p className="text-sm">Chart visualization will be implemented</p>
                </div>
              </div>

              {cgpaData.topImprovers.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Top Improvers</h4>
                  <div className="space-y-2">
                    {cgpaData.topImprovers.map((scholar, index) => {
                      const improvement = (scholar.currentCGPA || scholar.baselineCGPA) - scholar.baselineCGPA;
                      return (
                        <div key={scholar.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{scholar.profile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {scholar.baselineCGPA} → {scholar.currentCGPA || scholar.baselineCGPA}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">+{improvement.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">CGPA</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Course Progress Analysis */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Progress Analysis
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-foreground">{courseProgress.averageCompletionRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Video Watch</p>
              <p className="text-2xl font-bold text-foreground">{courseProgress.averageVideoWatch}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Assignment Submission</p>
              <p className="text-2xl font-bold text-foreground">{courseProgress.averageAssignmentSubmission}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Session Attendance</p>
              <p className="text-2xl font-bold text-foreground">{courseProgress.averageSessionAttendance}%</p>
            </div>
          </div>

          {detailed && (
            <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Progress Chart</p>
                <p className="text-sm">Chart visualization will be implemented</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Analysis */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Engagement Analysis
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Engagement Score</p>
              <p className="text-2xl font-bold text-foreground">{engagement.averageScore}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Logins</p>
              <p className="text-2xl font-bold text-foreground">{engagement.averageLogins}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Time Spent</p>
              <p className="text-2xl font-bold text-foreground">{engagement.averageTimeSpent} min</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Mentor Sessions</p>
              <p className="text-2xl font-bold text-foreground">{engagement.averageMentorSessions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Forum Activity</p>
              <p className="text-2xl font-bold text-foreground">{engagement.averageForumActivity}</p>
            </div>
          </div>

          {detailed && (
            <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Engagement Trends Chart</p>
                <p className="text-sm">Chart visualization will be implemented</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

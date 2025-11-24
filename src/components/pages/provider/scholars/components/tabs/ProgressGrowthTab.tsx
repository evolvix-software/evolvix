"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Scholar } from '@/data/mock/providerData';
import { TrendingUp, BookOpen, Activity, Calendar, Award, BarChart3 } from 'lucide-react';

interface ProgressGrowthTabProps {
  scholar: Scholar;
}

export function ProgressGrowthTab({ scholar }: ProgressGrowthTabProps) {
  const progressPercentage = scholar.enrollments.length > 0
    ? scholar.enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / scholar.enrollments.length
    : 0;

  const videoWatch = scholar.engagement?.videoWatchPercentage || 0;
  const assignmentRate = scholar.engagement?.assignmentSubmissionRate || 0;
  const loginCount = scholar.engagement?.totalLogins || 0;
  const mentorSessions = scholar.engagement?.mentorSessionCount || 0;

  // Generate growth timeline events
  const timelineEvents = [
    {
      date: scholar.awardDate,
      title: 'Scholarship Awarded',
      description: `Awarded ₹${scholar.awardAmount.toLocaleString()} scholarship`,
      icon: <Award className="w-4 h-4" />,
    },
    ...scholar.enrollments.map((e, idx) => ({
      date: e.enrollmentDate,
      title: `Enrolled in Course ${idx + 1}`,
      description: `Enrollment started`,
      icon: <BookOpen className="w-4 h-4" />,
    })),
    ...(scholar.jobPlacement ? [{
      date: scholar.jobPlacement.startDate,
      title: 'Job Placement',
      description: `Placed at ${scholar.jobPlacement.companyName}`,
      icon: <TrendingUp className="w-4 h-4" />,
    }] : []),
    ...(scholar.graduationDate ? [{
      date: scholar.graduationDate,
      title: 'Graduated',
      description: `Graduated with CGPA ${scholar.graduationCGPA?.toFixed(2)}`,
      icon: <Award className="w-4 h-4" />,
    }] : []),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* CGPA Progress */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            CGPA Progress
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Baseline CGPA</p>
              <p className="text-3xl font-bold text-foreground">{scholar.baselineCGPA.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current CGPA</p>
              <p className="text-3xl font-bold text-primary">
                {scholar.currentCGPA?.toFixed(2) || scholar.baselineCGPA.toFixed(2)}
              </p>
            </div>
            {scholar.graduationCGPA && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Graduation CGPA</p>
                <p className="text-3xl font-bold text-green-600">{scholar.graduationCGPA.toFixed(2)}</p>
              </div>
            )}
          </div>

          {scholar.currentCGPA && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">CGPA Improvement</span>
                <span className="text-sm font-semibold text-green-600">
                  +{((scholar.currentCGPA || scholar.baselineCGPA) - scholar.baselineCGPA).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${Math.min(((scholar.currentCGPA - scholar.baselineCGPA) / 3) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="h-64 flex items-center justify-center text-muted-foreground border border-border rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>CGPA Trend Chart</p>
              <p className="text-sm">Chart visualization will be implemented</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Progress */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Progress
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {scholar.enrollments.length > 0 ? (
            scholar.enrollments.map((enrollment, idx) => (
              <div key={enrollment.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">Course {idx + 1}</span>
                  <span className="text-sm font-semibold text-primary">{enrollment.completionPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${enrollment.completionPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()} | Status: {enrollment.status}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No course enrollments</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Completion</p>
              <p className="text-xl font-bold text-foreground">{Math.round(progressPercentage)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Video Watch</p>
              <p className="text-xl font-bold text-foreground">{videoWatch}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Assignments</p>
              <p className="text-xl font-bold text-foreground">{assignmentRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Session Attendance</p>
              <p className="text-xl font-bold text-foreground">85%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Engagement Metrics
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Logins</p>
              <p className="text-2xl font-bold text-foreground">{loginCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Video Watch</p>
              <p className="text-2xl font-bold text-foreground">{videoWatch}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Assignments</p>
              <p className="text-2xl font-bold text-foreground">{assignmentRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mentor Sessions</p>
              <p className="text-2xl font-bold text-foreground">{mentorSessions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Engagement Score</p>
              <p className="text-2xl font-bold text-primary">
                {Math.round((videoWatch * 0.3 + assignmentRate * 0.3 + progressPercentage * 0.2 + Math.min(loginCount / 10, 1) * 100 * 0.1 + Math.min(mentorSessions / 5, 1) * 100 * 0.1))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Timeline */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Growth Timeline
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="text-primary">{event.icon}</div>
                </div>
                <div className="flex-1 pb-4 border-b border-border last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


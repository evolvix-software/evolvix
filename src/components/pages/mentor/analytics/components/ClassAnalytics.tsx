"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Users, TrendingUp, Star, Calendar, CheckCircle2 } from 'lucide-react';
import { ClassAnalytics } from '@/interfaces/analytics';

interface ClassAnalyticsProps {
  analytics: ClassAnalytics[];
}

export function ClassAnalyticsComponent({ analytics }: ClassAnalyticsProps) {
  const overallAttendance = analytics.length > 0
    ? analytics.reduce((sum, a) => sum + a.attendanceRate, 0) / analytics.length
    : 0;

  const overallSatisfaction = analytics.length > 0
    ? analytics.reduce((sum, a) => sum + a.averageSatisfactionScore, 0) / analytics.length
    : 0;

  const totalSessions = analytics.reduce((sum, a) => sum + a.totalSessions, 0);
  const totalStudents = analytics.reduce((sum, a) => sum + a.totalStudents, 0);

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 dark:text-green-400';
    if (rate >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 dark:text-green-400';
    if (score >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Overall Attendance</p>
                <p className={`text-2xl font-bold ${getAttendanceColor(overallAttendance)}`}>
                  {overallAttendance.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Satisfaction</p>
                <p className={`text-2xl font-bold ${getSatisfactionColor(overallSatisfaction)}`}>
                  {overallSatisfaction.toFixed(1)}/5.0
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Sessions</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  {totalSessions}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  {totalStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course-wise Analytics */}
      <div className="space-y-4">
        {analytics.map((course) => (
          <Card key={course.courseId} className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{course.courseTitle}</span>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`font-semibold ${getAttendanceColor(course.attendanceRate)}`}>
                    {course.attendanceRate.toFixed(1)}% Attendance
                  </span>
                  <span className={`font-semibold ${getSatisfactionColor(course.averageSatisfactionScore)}`}>
                    {course.averageSatisfactionScore.toFixed(1)}/5.0 Satisfaction
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Attendance Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Attendance Rate
                    </span>
                    <span className={`text-sm font-bold ${getAttendanceColor(course.attendanceRate)}`}>
                      {course.attendanceRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        course.attendanceRate >= 90 ? 'bg-green-500' :
                        course.attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${course.attendanceRate}%` }}
                    />
                  </div>
                </div>

                {/* Satisfaction Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Average Satisfaction Score
                    </span>
                    <span className={`text-sm font-bold ${getSatisfactionColor(course.averageSatisfactionScore)}`}>
                      {course.averageSatisfactionScore.toFixed(1)}/5.0
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        course.averageSatisfactionScore >= 4.5 ? 'bg-green-500' :
                        course.averageSatisfactionScore >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(course.averageSatisfactionScore / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Recent Sessions */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-foreground mb-3">
                    Recent Sessions ({course.sessions.length})
                  </h4>
                  <div className="space-y-2">
                    {course.sessions.slice(0, 5).map((session) => {
                      const sessionAttendance = (session.attendance / session.totalEnrolled) * 100;
                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                              {session.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {new Date(session.date).toLocaleDateString()} • {session.attendance}/{session.totalEnrolled} attended
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 ml-4">
                            <div className="text-right">
                              <p className="text-xs text-slate-600 dark:text-slate-400">Attendance</p>
                              <p className={`text-sm font-bold ${getAttendanceColor(sessionAttendance)}`}>
                                {sessionAttendance.toFixed(0)}%
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-600 dark:text-slate-400">Satisfaction</p>
                              <p className={`text-sm font-bold ${getSatisfactionColor(session.satisfactionScore)}`}>
                                {session.satisfactionScore.toFixed(1)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


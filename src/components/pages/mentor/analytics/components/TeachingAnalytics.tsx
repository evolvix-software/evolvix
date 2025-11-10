"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { MessageSquare, Clock, Users, CheckCircle2, Calendar } from 'lucide-react';

export function TeachingAnalytics() {
  // Mock data
  const averageResponseTime = 2.5; // hours
  const averageGradingTime = 1.2; // days
  const averageTestReviewTime = 0.8; // days

  const responseTimeDistribution = [
    { range: '< 1 hour', count: 45 },
    { range: '1-3 hours', count: 30 },
    { range: '3-6 hours', count: 15 },
    { range: '> 6 hours', count: 10 },
  ];

  const classAttendanceRate = 85;
  const totalClasses = 24;
  const averageAttendance = 20;

  const studentParticipation = [
    { type: 'Active Participants', count: 18, percentage: 75 },
    { type: 'Occasional Participants', count: 4, percentage: 17 },
    { type: 'Rare Participants', count: 2, percentage: 8 },
  ];

  const messageResponseRate = 92;
  const totalMessages = 156;
  const respondedMessages = 144;

  const officeHoursUtilization = 65;
  const totalOfficeHours = 20;
  const utilizedHours = 13;

  return (
    <div className="space-y-6">
      {/* Response Times Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Response Time</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {averageResponseTime}h
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  To messages
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Grading Time</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {averageGradingTime}d
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  For assignments
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
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Test Review</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {averageTestReviewTime}d
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  For test results
                </p>
              </div>
              <Clock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Distribution */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Message Response Time Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {responseTimeDistribution.map((item, idx) => {
              const total = responseTimeDistribution.reduce((sum, i) => sum + i.count, 0);
              const percentage = (item.count / total) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">{item.range}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.count} messages ({percentage.toFixed(0)}%)
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

      {/* Engagement Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Class Attendance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {classAttendanceRate}%
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Average attendance rate
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Total Classes</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{totalClasses}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Avg Attendance</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{averageAttendance} students</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Message Response Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {messageResponseRate}%
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Messages responded to
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Total Messages</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{totalMessages}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Responded</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{respondedMessages}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Participation */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Student Participation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentParticipation.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{item.type}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {item.count} students ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-slate-600 dark:bg-slate-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Office Hours Utilization */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Office Hours Utilization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {officeHoursUtilization}%
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Utilization rate
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Total Office Hours</span>
                <span className="font-semibold text-slate-900 dark:text-white">{totalOfficeHours} hours</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Utilized Hours</span>
                <span className="font-semibold text-slate-900 dark:text-white">{utilizedHours} hours</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-slate-600 dark:bg-slate-500 h-3 rounded-full"
                style={{ width: `${officeHoursUtilization}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


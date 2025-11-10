"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { TrendingUp, TrendingDown, Award, Target, BarChart3 } from 'lucide-react';
import { StudentPerformanceMetrics } from '@/interfaces/analytics';

interface StudentPerformanceProps {
  performance: StudentPerformanceMetrics[];
}

export function StudentPerformance({ performance }: StudentPerformanceProps) {
  const averageImprovement = performance.length > 0
    ? performance.reduce((sum, p) => sum + p.improvement, 0) / performance.length
    : 0;

  const averageCurrentScore = performance.length > 0
    ? performance.reduce((sum, p) => sum + p.currentScore, 0) / performance.length
    : 0;

  const averageAssignmentScore = performance.length > 0
    ? performance.reduce((sum, p) => sum + p.averageAssignmentScore, 0) / performance.length
    : 0;

  const getImprovementColor = () => 'text-slate-900 dark:text-white';
  const getScoreColor = () => 'text-slate-900 dark:text-white';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Improvement</p>
                <p className={`text-2xl font-bold ${getImprovementColor()}`}>
                  +{averageImprovement.toFixed(1)}%
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
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Current Score</p>
                <p className={`text-2xl font-bold ${getScoreColor()}`}>
                  {averageCurrentScore.toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Assignment Score</p>
                <p className={`text-2xl font-bold ${getScoreColor()}`}>
                  {averageAssignmentScore.toFixed(1)}%
                </p>
              </div>
              <Award className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {performance.length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance Table */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Student Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Course
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Initial Score
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Current Score
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Improvement
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Assignments
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Avg Score
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {performance.map((student) => (
                  <tr
                    key={student.studentId}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600">
                          <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
                            {student.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {student.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {student.courseTitle}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-semibold ${getScoreColor()}`}>
                        {student.initialScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-semibold ${getScoreColor()}`}>
                        {student.currentScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <TrendingUp className={`w-4 h-4 ${getImprovementColor()}`} />
                        <span className={`text-sm font-bold ${getImprovementColor()}`}>
                          +{student.improvement.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {student.assignmentsCompleted}/{student.assignmentsTotal}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-semibold ${getScoreColor()}`}>
                        {student.averageAssignmentScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500 bg-slate-600 dark:bg-slate-500"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 w-10 text-left">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Average Improvement</p>
              <p className={`text-xl font-bold ${getImprovementColor()}`}>
                +{averageImprovement.toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Average Current Score</p>
              <p className={`text-xl font-bold ${getScoreColor()}`}>
                {averageCurrentScore.toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Average Assignment Score</p>
              <p className={`text-xl font-bold ${getScoreColor()}`}>
                {averageAssignmentScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


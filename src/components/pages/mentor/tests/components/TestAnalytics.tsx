"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { BarChart3, TrendingUp, Clock, Users, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { ModuleTest } from '../TestsPage';
import { LineChart } from '@/components/common/dashboard/common/LineChart';
import { AnimatedBarChart } from '@/components/common/dashboard/common/AnimatedBarChart';

interface TestAnalyticsProps {
  test: ModuleTest;
  // Mock data - in real app, this would come from API
  mockResults?: {
    studentId: string;
    studentName: string;
    score: number;
    timeSpent: number; // minutes
    attempts: number;
    completedAt: string;
    answers: {
      questionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }[];
  }[];
}

export function TestAnalytics({ test, mockResults = [] }: TestAnalyticsProps) {
  // Mock results data
  const results = useMemo(() => {
    if (mockResults.length > 0) return mockResults;
    
    // Generate mock results
    return [
      {
        studentId: 'student_1',
        studentName: 'John Doe',
        score: 85,
        timeSpent: 12,
        attempts: 1,
        completedAt: new Date().toISOString(),
        answers: test.questions.map(q => ({
          questionId: q.id,
          selectedAnswer: q.correctAnswer,
          isCorrect: true,
        })),
      },
      {
        studentId: 'student_2',
        studentName: 'Jane Smith',
        score: 70,
        timeSpent: 14,
        attempts: 1,
        completedAt: new Date().toISOString(),
        answers: test.questions.map((q, idx) => ({
          questionId: q.id,
          selectedAnswer: idx < 7 ? q.correctAnswer : q.options[0],
          isCorrect: idx < 7,
        })),
      },
      {
        studentId: 'student_3',
        studentName: 'Bob Johnson',
        score: 60,
        timeSpent: 15,
        attempts: 2,
        completedAt: new Date().toISOString(),
        answers: test.questions.map((q, idx) => ({
          questionId: q.id,
          selectedAnswer: idx < 6 ? q.correctAnswer : q.options[1],
          isCorrect: idx < 6,
        })),
      },
    ];
  }, [mockResults, test.questions]);

  // Overall Performance Metrics
  const overallMetrics = useMemo(() => {
    if (results.length === 0) {
      return {
        averageScore: 0,
        passRate: 0,
        averageTime: 0,
        totalAttempts: 0,
        completionRate: 0,
      };
    }

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = totalScore / results.length;
    const passed = results.filter(r => r.score >= test.passingScore).length;
    const passRate = (passed / results.length) * 100;
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    const averageTime = totalTime / results.length;
    const totalAttempts = results.reduce((sum, r) => sum + r.attempts, 0);
    const completionRate = (results.length / test.assignedTo.length) * 100;

    return {
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      averageTime: Math.round(averageTime),
      totalAttempts,
      completionRate: Math.round(completionRate),
    };
  }, [results, test.passingScore, test.assignedTo.length]);

  // Question Analysis
  const questionAnalysis = useMemo(() => {
    return test.questions.map(question => {
      const questionResults = results.flatMap(r => 
        r.answers.filter(a => a.questionId === question.id)
      );
      
      const correctCount = questionResults.filter(a => a.isCorrect).length;
      const totalAttempts = questionResults.length;
      const accuracy = totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;
      
      // Find common wrong answers
      const wrongAnswers = questionResults
        .filter(a => !a.isCorrect)
        .map(a => a.selectedAnswer);
      const wrongAnswerCounts: Record<string, number> = {};
      wrongAnswers.forEach(answer => {
        wrongAnswerCounts[answer] = (wrongAnswerCounts[answer] || 0) + 1;
      });
      const mostCommonWrong = Object.entries(wrongAnswerCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      return {
        questionId: question.id,
        question: question.question,
        accuracy: Math.round(accuracy),
        correctCount,
        totalAttempts,
        mostCommonWrong,
        difficulty: accuracy >= 80 ? 'Easy' : accuracy >= 50 ? 'Medium' : 'Hard',
      };
    });
  }, [test.questions, results]);

  // Student Performance Distribution
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { label: '0-50', min: 0, max: 50 },
      { label: '51-60', min: 51, max: 60 },
      { label: '61-70', min: 61, max: 70 },
      { label: '71-80', min: 71, max: 80 },
      { label: '81-90', min: 81, max: 90 },
      { label: '91-100', min: 91, max: 100 },
    ];

    return ranges.map(range => ({
      label: range.label,
      count: results.filter(r => r.score >= range.min && r.score <= range.max).length,
    }));
  }, [results]);

  // Time Analysis
  const timeAnalysis = useMemo(() => {
    if (results.length === 0) return { average: 0, min: 0, max: 0 };
    
    const times = results.map(r => r.timeSpent);
    return {
      average: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      min: Math.min(...times),
      max: Math.max(...times),
    };
  }, [results]);

  // Attempt Patterns
  const attemptPatterns = useMemo(() => {
    const attemptCounts: Record<number, number> = {};
    results.forEach(r => {
      attemptCounts[r.attempts] = (attemptCounts[r.attempts] || 0) + 1;
    });
    return attemptCounts;
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Overall Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Average Score</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  {overallMetrics.averageScore}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pass Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  {overallMetrics.passRate}%
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Avg Time</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  {overallMetrics.averageTime}m
                </p>
              </div>
              <Clock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Attempts</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  {overallMetrics.totalAttempts}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  {overallMetrics.completionRate}%
                </p>
              </div>
              <Users className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Student Performance Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedBarChart
            title="Score Distribution"
            data={scoreDistribution.map(d => ({ 
              label: d.label, 
              value: d.count,
              maxValue: Math.max(...scoreDistribution.map(s => s.count))
            }))}
            height={300}
          />
        </CardContent>
      </Card>

      {/* Question Analysis */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Question Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questionAnalysis.map((qa, idx) => (
              <div
                key={qa.questionId}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-foreground">
                      Q{idx + 1}. {qa.question}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      qa.difficulty === 'Easy'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : qa.difficulty === 'Medium'
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}>
                      {qa.difficulty}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {qa.accuracy}% accuracy
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    {qa.correctCount} / {qa.totalAttempts} correct answers
                  </p>
                  {qa.mostCommonWrong !== 'N/A' && (
                    <p className="mt-1">
                      Most common wrong answer: <span className="font-semibold">{qa.mostCommonWrong}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Average Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
              {timeAnalysis.average} minutes
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Time limit: {test.timeLimit} minutes
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Fastest Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
              {timeAnalysis.min} minutes
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Slowest Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
              {timeAnalysis.max} minutes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attempt Patterns */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Attempt Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(attemptPatterns).map(([attempts, count]) => (
              <div key={attempts} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300">
                  {attempts} {attempts === '1' ? 'attempt' : 'attempts'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-foreground">{count} students</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


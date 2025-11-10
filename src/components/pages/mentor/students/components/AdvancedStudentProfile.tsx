"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentTestCompletion } from '@/interfaces/students';
import {
  User,
  Mail,
  Calendar,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Award,
  Clock,
  ArrowLeft,
  MessageSquare,
  Star,
  FileText,
  ClipboardCheck,
  Eye,
  XCircle,
  Download,
  BarChart3,
  Activity,
  Target,
  Users as UsersIcon,
  Phone,
  MapPin,
  Globe,
  Tag,
  AlertTriangle,
  TrendingDown,
} from 'lucide-react';
import { Student, StudentCourseProgress } from '@/interfaces/students';
import { useAppSelector } from '@/hooks';
import { useState, useMemo } from 'react';
import { StudentTestResults } from './StudentTestResults';
import { mockTestAttempts, mockModuleTests } from '@/data/mock/testAttempts';
import { ModuleTest, TestAttempt } from '@/components/pages/student/tests/StudentTestsPage';
import { LineChart } from '@/components/common/dashboard/common/LineChart';

interface AdvancedStudentProfileProps {
  student: Student;
  courseProgress: StudentCourseProgress[];
  onBack: () => void;
  onMessage: () => void;
  onGiveFeedback: () => void;
}

export function AdvancedStudentProfile({
  student,
  courseProgress,
  onBack,
  onMessage,
  onGiveFeedback
}: AdvancedStudentProfileProps) {
  const router = useRouter();
  const { courses } = useAppSelector(state => state.courses);
  const [selectedTestResult, setSelectedTestResult] = useState<{
    test: ModuleTest;
    attempt: TestAttempt;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'engagement' | 'performance' | 'communication'>('overview');

  const completionRate = student.assignmentsTotal > 0
    ? Math.round((student.assignmentsCompleted / student.assignmentsTotal) * 100)
    : 0;

  const handleViewAssignments = (projectNumber?: number) => {
    const params = new URLSearchParams();
    params.set('studentId', student.id);
    if (projectNumber) {
      params.set('projectNumber', projectNumber.toString());
    }
    router.push(`/portal/mentor/assignments?${params.toString()}`);
  };

  const handleViewTestResult = (testCompletion: StudentTestCompletion) => {
    const test = mockModuleTests.find(t => t.id === testCompletion.testId);
    const attempt = mockTestAttempts.find(a => 
      a.testId === testCompletion.testId && a.studentId === student.id
    );
    
    if (test && attempt) {
      setSelectedTestResult({ test, attempt });
    }
  };

  // Calculate engagement metrics
  const engagementMetrics = useMemo(() => {
    return {
      loginFrequency: student.loginFrequency || 0,
      timeSpentLearning: student.timeSpentLearning || 0,
      assignmentSubmissionRate: student.assignmentSubmissionRate || completionRate,
      discussionParticipation: student.discussionParticipation || 0,
      classAttendanceRate: student.classAttendanceRate || 0,
    };
  }, [student, completionRate]);

  // Calculate performance analytics
  const performanceAnalytics = useMemo(() => {
    const allScores = courseProgress.flatMap(p => 
      p.testCompletions?.map(t => t.percentage) || []
    );
    const avgScore = allScores.length > 0 
      ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length 
      : 0;
    
    return {
      averageScore: avgScore,
      strengths: student.strengths || [],
      weaknesses: student.weaknesses || [],
      learningPace: student.learningPace || 'average',
      recommendedCourses: student.recommendedCourses || [],
    };
  }, [courseProgress, student]);

  // Progress trend data (mock - would come from API)
  const progressTrendData = useMemo(() => {
    return [
      { label: 'Week 1', value: 20 },
      { label: 'Week 2', value: 35 },
      { label: 'Week 3', value: 50 },
      { label: 'Week 4', value: 65 },
      { label: 'Week 5', value: 75 },
      { label: 'Week 6', value: student.overallProgress },
    ];
  }, [student.overallProgress]);

  // If viewing test result, show that instead
  if (selectedTestResult) {
    return (
      <StudentTestResults
        studentId={student.id}
        studentName={student.name}
        test={selectedTestResult.test}
        attempt={selectedTestResult.attempt}
        onBack={() => setSelectedTestResult(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-slate-200 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleViewAssignments()}
            className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Assignments
          </Button>
          <Button
            onClick={onMessage}
            className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button
            onClick={onGiveFeedback}
            className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
          >
            <Star className="w-4 h-4 mr-2" />
            Give Feedback
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const data = {
                name: student.name,
                email: student.email,
                progress: student.overallProgress,
                courses: courseProgress.map(cp => cp.courseTitle).join(', '),
                assignments: `${student.assignmentsCompleted}/${student.assignmentsTotal}`,
                rating: student.rating || 0,
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${student.name}_report.json`;
              a.click();
            }}
            className="border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-6">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 dark:border-slate-600"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-300 dark:border-slate-600">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-3xl">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {student.name}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                  {student.location && (
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{student.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Joined: {new Date(student.joinedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Last active: {student.lastActive}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-3">
              {student.rating && (
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Star className="w-5 h-5 text-slate-600 dark:text-slate-400 fill-slate-600 dark:fill-slate-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Overall Rating</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {student.rating.toFixed(1)} / 5.0
                    </p>
                  </div>
                </div>
              )}
              {student.status && (
                <div className={`px-3 py-1.5 rounded text-sm font-medium ${
                  student.status === 'at-risk' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
                  student.status === 'completed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' :
                  'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}>
                  {student.status.replace('-', ' ').toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <TrendingUp className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Overall Progress</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {student.overallProgress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Assignments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {student.assignmentsCompleted}/{student.assignmentsTotal}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{completionRate}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <BookOpen className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Enrolled Courses</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {student.enrolledCourses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <Activity className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Engagement</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {engagementMetrics.loginFrequency}/week
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{engagementMetrics.timeSpentLearning}h learning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic History</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Progress Trend */}
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Progress Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                title=""
                description=""
                data={progressTrendData}
                height={200}
                color="slate"
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">GPA</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.gpa?.toFixed(2) || 'N/A'}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Certificates</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.certificates?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Badges</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.badges?.length || 0}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Support Tickets</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.supportTickets || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Course Progress Summary */}
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Course Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {courseProgress.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">No course progress data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courseProgress.map((progress) => (
                    <div
                      key={progress.courseId}
                      className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {progress.courseTitle}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Enrolled: {new Date(progress.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {progress.progress}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500 bg-slate-600 dark:bg-slate-500"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Lessons: </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {progress.completedLessons}/{progress.totalLessons}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Assignments: </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {progress.assignmentsCompleted}/{progress.assignmentsTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic History Tab */}
        <TabsContent value="academic" className="space-y-6 mt-6">
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>All Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseProgress.map((progress) => {
                  const course = courses.find(c => c.id === progress.courseId);
                  return (
                    <div
                      key={progress.courseId}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {progress.courseTitle}
                          </h4>
                          <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400 mt-2">
                            <span>Enrolled: {new Date(progress.enrolledAt).toLocaleDateString()}</span>
                            <span>Progress: {progress.progress}%</span>
                            {progress.progress === 100 && (
                              <span className="flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Completed</span>
                              </span>
                            )}
                          </div>
                        </div>
                        {student.gpa && (
                          <div className="text-right">
                            <p className="text-xs text-slate-600 dark:text-slate-400">GPA</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {student.gpa.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Test Completions */}
                      {progress.testCompletions && progress.testCompletions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                            Module Tests:
                          </p>
                          <div className="space-y-2">
                            {progress.testCompletions.map((testCompletion) => (
                              <div
                                key={testCompletion.testId}
                                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <ClipboardCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                      {testCompletion.testTitle}
                                    </span>
                                    {testCompletion.passed ? (
                                      <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-slate-500 dark:text-slate-500" />
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400">
                                    <span>Score: {testCompletion.score}/{testCompletion.maxScore} ({testCompletion.percentage}%)</span>
                                    <span>Time: {testCompletion.timeSpent} min</span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewTestResult(testCompletion)}
                                  className="ml-3 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certificates & Badges */}
                      {(student.certificates && student.certificates.length > 0) || 
                       (student.badges && student.badges.length > 0) && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          {student.certificates && student.certificates.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                Certificates:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {student.certificates.map((cert, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700"
                                  >
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {student.badges && student.badges.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                Badges:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {student.badges.map((badge, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700"
                                  >
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Engagement Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Login Frequency</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {engagementMetrics.loginFrequency} times/week
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Time Spent Learning</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {engagementMetrics.timeSpentLearning} hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Assignment Submission Rate</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {engagementMetrics.assignmentSubmissionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Discussion Participation</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {engagementMetrics.discussionParticipation} posts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Class Attendance Rate</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {engagementMetrics.classAttendanceRate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Engagement Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Overall Engagement</span>
                      <span className={`text-sm font-semibold ${
                        student.engagementLevel === 'high' ? 'text-slate-900 dark:text-white' :
                        student.engagementLevel === 'medium' ? 'text-slate-700 dark:text-slate-300' :
                        'text-slate-500 dark:text-slate-500'
                      }`}>
                        {student.engagementLevel?.toUpperCase() || 'MEDIUM'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          student.engagementLevel === 'high' ? 'bg-slate-700 dark:bg-slate-500' :
                          student.engagementLevel === 'medium' ? 'bg-slate-600 dark:bg-slate-600' :
                          'bg-slate-500 dark:bg-slate-700'
                        }`}
                        style={{ width: `${student.engagementLevel === 'high' ? 80 : student.engagementLevel === 'medium' ? 50 : 30}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Performance Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Average Score</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {performanceAnalytics.averageScore.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Learning Pace</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {performanceAnalytics.learningPace.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Performance Level</span>
                  <span className={`text-sm font-semibold ${
                    student.performanceLevel === 'high' ? 'text-slate-900 dark:text-white' :
                    student.performanceLevel === 'medium' ? 'text-slate-700 dark:text-slate-300' :
                    'text-slate-500 dark:text-slate-500'
                  }`}>
                    {student.performanceLevel?.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Strengths & Weaknesses</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceAnalytics.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Strengths</p>
                    <div className="flex flex-wrap gap-2">
                      {performanceAnalytics.strengths.map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {performanceAnalytics.weaknesses.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Areas for Improvement</p>
                    <div className="flex flex-wrap gap-2">
                      {performanceAnalytics.weaknesses.map((weakness, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700"
                        >
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {performanceAnalytics.recommendedCourses.length > 0 && (
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Recommended Next Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {performanceAnalytics.recommendedCourses.map((courseId, idx) => {
                    const course = courses.find(c => c.id === courseId);
                    return course ? (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-white">{course.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{course.shortDescription}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {student.careerGoals && student.careerGoals.length > 0 && (
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Career Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.careerGoals.map((goal, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded border border-slate-200 dark:border-slate-700"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6 mt-6">
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Communication History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Communication history will be displayed here
                  </p>
                  <Button
                    onClick={onMessage}
                    className="mt-4 bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Conversation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {student.supportTickets && student.supportTickets > 0 && (
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Support Tickets</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total support tickets: <span className="font-semibold text-slate-900 dark:text-white">{student.supportTickets}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


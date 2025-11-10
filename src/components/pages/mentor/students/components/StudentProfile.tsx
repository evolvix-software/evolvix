"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
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
} from 'lucide-react';
import { Student, StudentCourseProgress } from '@/interfaces/students';
import { useAppSelector } from '@/hooks';
import { useState } from 'react';
import { StudentTestResults } from './StudentTestResults';
import { mockTestAttempts, mockModuleTests } from '@/data/mock/testAttempts';
import { ModuleTest, TestAttempt } from '@/components/pages/student/tests/StudentTestsPage';

interface StudentProfileProps {
  student: Student;
  courseProgress: StudentCourseProgress[];
  onBack: () => void;
  onMessage: () => void;
  onGiveFeedback: () => void;
}

export function StudentProfile({
  student,
  courseProgress,
  onBack,
  onMessage,
  onGiveFeedback
}: StudentProfileProps) {
  const router = useRouter();
  const { courses } = useAppSelector(state => state.courses);
  const [selectedTestResult, setSelectedTestResult] = useState<{
    test: ModuleTest;
    attempt: TestAttempt;
  } | null>(null);

  const getProgressColor = (progress: number) => {
    return 'text-slate-900 dark:text-white';
  };

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

  const handleViewTestResult = (testCompletion: StudentCourseProgress['testCompletions'][0]) => {
    const test = mockModuleTests.find(t => t.id === testCompletion.testId);
    const attempt = mockTestAttempts.find(a => 
      a.testId === testCompletion.testId && a.studentId === student.id
    );
    
    if (test && attempt) {
      setSelectedTestResult({ test, attempt });
    }
  };

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
      <div className="flex items-center justify-between">
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
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
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
                <p className={`text-2xl font-bold ${getProgressColor(student.overallProgress)}`}>
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
                <Award className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
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
                    <span className={`text-lg font-bold ${getProgressColor(progress.progress)}`}>
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
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
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

                  {/* Test Completions */}
                  {progress.testCompletions && progress.testCompletions.length > 0 && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Module Tests:
                      </p>
                      <div className="space-y-2">
                        {progress.testCompletions.map((testCompletion) => (
                          <div
                            key={testCompletion.testId}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {testCompletion.moduleTitle}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-600 dark:text-slate-400">
                                <span>
                                  Score: {testCompletion.score}/{testCompletion.maxScore} ({testCompletion.percentage}%)
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{testCompletion.timeSpent} min</span>
                                </span>
                                {testCompletion.wrongAnswers > 0 && (
                                  <span className="text-red-600 dark:text-red-400">
                                    {testCompletion.wrongAnswers} wrong
                                  </span>
                                )}
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

                  {/* Projects and Assignment Links */}
                  {(() => {
                    const course = courses.find(c => c.id === progress.courseId);
                    const projects = course?.projects || [];
                    
                    if (projects.length > 0) {
                      return (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                            Projects:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {projects.map((project) => (
                              <Button
                                key={project.id}
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewAssignments(project.projectNumber)}
                                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                Project {project.projectNumber}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


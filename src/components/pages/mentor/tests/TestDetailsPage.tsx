"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest } from './TestsPage';
import { Course } from '@/data/mock/coursesData';
import {
  ArrowLeft,
  Clock,
  Users,
  FileText,
  Calendar,
  CheckCircle2,
  Trash2,
  BarChart3,
} from 'lucide-react';
import { mockStudents } from '@/data/mock/students';

export function TestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { courses } = useAppSelector(state => state.courses);
  const [test, setTest] = useState<ModuleTest | null>(null);
  const [mentorId, setMentorId] = useState<string>('');

  const testId = params.testId as string;

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || '');
    }
  }, []);

  useEffect(() => {
    const storedTests = localStorage.getItem('evolvix_module_tests');
    if (storedTests) {
      try {
        const parsedTests: ModuleTest[] = JSON.parse(storedTests);
        const foundTest = parsedTests.find(t => t.id === testId);
        if (foundTest) {
          setTest(foundTest);
        }
      } catch (e) {
        console.error('Error parsing stored tests:', e);
      }
    }
  }, [testId]);

  const mentorCourses = useMemo(() => {
    if (!mentorId) return [];
    return courses.filter(c => c.instructor.id === mentorId);
  }, [courses, mentorId]);

  const course = mentorCourses.find(c => c.id === test?.courseId);
  const assignedStudents = test ? mockStudents.filter(s => test.assignedTo.includes(s.id)) : [];

  const handleDeleteTest = () => {
    if (!test) return;
    if (confirm('Are you sure you want to delete this test?')) {
      const storedTests = localStorage.getItem('evolvix_module_tests');
      if (storedTests) {
        try {
          const parsedTests: ModuleTest[] = JSON.parse(storedTests);
          const updatedTests = parsedTests.filter(t => t.id !== test.id);
          localStorage.setItem('evolvix_module_tests', JSON.stringify(updatedTests));
          router.push('/portal/mentor/tests');
        } catch (e) {
          console.error('Error deleting test:', e);
        }
      }
    }
  };

  if (!test) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-4">
            Test not found
          </h2>
          <Button onClick={() => router.push('/portal/mentor/tests')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push('/portal/mentor/tests')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/portal/mentor/tests/${testId}/analytics`)}
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteTest}
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Test
          </Button>
        </div>
      </div>

      {/* Test Info */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl">{test.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Course</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">{test.courseTitle}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Module</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">{test.moduleTitle}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Questions</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">{test.questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Time Limit</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">{test.timeLimit} minutes</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Passing Score</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">{test.passingScore}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Attempts Allowed</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">{test.attemptsAllowed}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Opens:</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                {new Date(test.openedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Closes:</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                {new Date(test.closesAt).toLocaleString()}
              </p>
            </div>
          </div>

          {test.documentName && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Document:</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                  {test.documentName}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Questions ({test.questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {test.questions.map((q, idx) => (
              <div
                key={q.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-slate-900 dark:text-foreground">
                    {idx + 1}. {q.question}
                  </p>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {q.points} pts
                  </span>
                </div>
                <div className="space-y-1 mt-3">
                  {q.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-2 rounded ${
                        option === q.correctAnswer
                          ? 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600'
                          : 'bg-slate-50 dark:bg-slate-900/50'
                      }`}
                    >
                      <span className="text-sm text-slate-900 dark:text-foreground">
                        {String.fromCharCode(97 + optIdx)}. {option}
                        {option === q.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 inline ml-2 text-slate-600 dark:text-slate-400" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assigned Students */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Assigned Students ({assignedStudents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedStudents.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No students assigned</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {assignedStudents.map(student => (
                <div
                  key={student.id}
                  className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-foreground">{student.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{student.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


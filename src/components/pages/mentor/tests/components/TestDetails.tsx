"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest } from '../TestsPage';
import { Course } from '@/data/mock/coursesData';
import {
  ArrowLeft,
  Clock,
  Users,
  FileText,
  Calendar,
  CheckCircle2,
  Trash2,
  Download,
} from 'lucide-react';
import { mockStudents } from '@/data/mock/students';

interface TestDetailsProps {
  test: ModuleTest;
  courses: Course[];
  onBack: () => void;
  onUpdate: (testId: string, updates: Partial<ModuleTest>) => void;
  onDelete: (testId: string) => void;
}

export function TestDetails({ test, courses, onBack, onUpdate, onDelete }: TestDetailsProps) {
  const course = courses.find(c => c.id === test.courseId);
  const assignedStudents = mockStudents.filter(s => test.assignedTo.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete(test.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Test
        </Button>
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
              <p className="font-semibold text-slate-900 dark:text-white">{test.courseTitle}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Module</p>
              <p className="font-semibold text-slate-900 dark:text-white">{test.moduleTitle}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Questions</p>
              <p className="font-semibold text-slate-900 dark:text-white">{test.questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Time Limit</p>
              <p className="font-semibold text-slate-900 dark:text-white">{test.timeLimit} minutes</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Passing Score</p>
              <p className="font-semibold text-slate-900 dark:text-white">{test.passingScore}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Attempts Allowed</p>
              <p className="font-semibold text-slate-900 dark:text-white">{test.attemptsAllowed}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Opens:</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {new Date(test.openedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Closes:</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {new Date(test.closesAt).toLocaleString()}
              </p>
            </div>
          </div>

          {test.documentName && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Document:</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
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
                  <p className="font-semibold text-slate-900 dark:text-white">
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
                          ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                          : 'bg-slate-50 dark:bg-slate-900/50'
                      }`}
                    >
                      <span className="text-sm text-slate-900 dark:text-white">
                        {String.fromCharCode(97 + optIdx)}. {option}
                        {option === q.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 inline ml-2 text-green-600 dark:text-green-400" />
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
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
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


"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  ArrowLeft,
  FileText,
  Calendar,
} from 'lucide-react';
import { TestAttempt, ModuleTest } from '@/components/pages/student/tests/StudentTestsPage';

interface StudentTestResultsProps {
  studentId: string;
  studentName: string;
  test: ModuleTest;
  attempt: TestAttempt;
  onBack: () => void;
}

export function StudentTestResults({
  studentId,
  studentName,
  test,
  attempt,
  onBack,
}: StudentTestResultsProps) {
  const getQuestionResult = (questionId: string) => {
    const question = test.questions.find(q => q.id === questionId);
    if (!question) return null;

    const studentAnswer = attempt.answers[questionId];
    const isCorrect = studentAnswer === question.correctAnswer;

    return {
      question,
      studentAnswer,
      isCorrect,
      correctAnswer: question.correctAnswer,
    };
  };

  const wrongAnswers = test.questions.filter(q => {
    const result = getQuestionResult(q.id);
    return result && !result.isCorrect;
  });

  const correctAnswers = test.questions.filter(q => {
    const result = getQuestionResult(q.id);
    return result && result.isCorrect;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Student Profile
        </Button>
      </div>

      {/* Test Summary Card */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl">{test.title}</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {test.courseTitle} • {test.moduleTitle}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Student</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">{studentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Score</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">
                {attempt.score} / {attempt.maxScore} ({attempt.percentage.toFixed(1)}%)
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Time Taken</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">{attempt.timeSpent} minutes</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Status</p>
              <div className="flex items-center space-x-1">
                {attempt.passed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-600 dark:text-green-400">Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="font-semibold text-red-600 dark:text-red-400">Failed</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div
            className={`p-4 rounded-lg border-2 ${
              attempt.passed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
            }`}
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Correct</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {correctAnswers.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Wrong</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {wrongAnswers.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">
                  {test.questions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Test Details */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Started:</span>
              <span className="font-semibold text-slate-900 dark:text-foreground">
                {new Date(attempt.startedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Submitted:</span>
              <span className="font-semibold text-slate-900 dark:text-foreground">
                {new Date(attempt.submittedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Time Limit:</span>
              <span className="font-semibold text-slate-900 dark:text-foreground">
                {test.timeLimit} minutes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Passing Score:</span>
              <span className="font-semibold text-slate-900 dark:text-foreground">
                {test.passingScore}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wrong Answers Section */}
      {wrongAnswers.length > 0 && (
        <Card className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2 text-red-900 dark:text-red-100">
              <XCircle className="w-5 h-5" />
              <span>Incorrect Answers ({wrongAnswers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wrongAnswers.map((question, idx) => {
                const result = getQuestionResult(question.id);
                if (!result) return null;

                return (
                  <div
                    key={question.id}
                    className="border-2 border-red-300 dark:border-red-700 rounded-lg p-4 bg-card dark:bg-slate-800"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="font-semibold text-slate-900 dark:text-foreground">
                          Question {test.questions.findIndex(q => q.id === question.id) + 1}: {question.question}
                        </p>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        0 / {question.points} pts
                      </span>
                    </div>
                    <div className="space-y-2 ml-7">
                      {question.options.map((option, optIdx) => {
                        const isStudentAnswer = option === result.studentAnswer;
                        const isCorrectAnswer = option === result.correctAnswer;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded ${
                              isCorrectAnswer
                                ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                                : isStudentAnswer
                                ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
                                : 'bg-slate-50 dark:bg-slate-900/50'
                            }`}
                          >
                            <span className="text-sm text-slate-900 dark:text-foreground">
                              {String.fromCharCode(97 + optIdx)}. {option}
                              {isStudentAnswer && (
                                <span className="ml-2 text-xs font-semibold text-red-600 dark:text-red-400">
                                  (Student's Answer - Incorrect)
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                  (Correct Answer)
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Questions Review */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Complete Question Review</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {test.questions.map((question, idx) => {
              const result = getQuestionResult(question.id);
              if (!result) return null;

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg p-4 ${
                    result.isCorrect
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {result.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                      <p className="font-semibold text-slate-900 dark:text-foreground">
                        {idx + 1}. {question.question}
                      </p>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {result.isCorrect ? question.points : 0} / {question.points} pts
                    </span>
                  </div>
                  <div className="space-y-2 ml-7">
                    {question.options.map((option, optIdx) => {
                      const isStudentAnswer = option === result.studentAnswer;
                      const isCorrectAnswer = option === result.correctAnswer;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2 rounded ${
                            isCorrectAnswer
                              ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                              : isStudentAnswer && !isCorrectAnswer
                              ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
                              : 'bg-slate-50 dark:bg-slate-900/50'
                          }`}
                        >
                          <span className="text-sm text-slate-900 dark:text-foreground">
                            {String.fromCharCode(97 + optIdx)}. {option}
                            {isStudentAnswer && (
                              <span className="ml-2 text-xs font-semibold">
                                (Your Answer)
                              </span>
                            )}
                            {isCorrectAnswer && (
                              <span className="ml-2 text-xs font-semibold text-green-600 dark:text-green-400">
                                (Correct)
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


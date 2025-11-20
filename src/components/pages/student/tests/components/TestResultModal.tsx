"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest, TestAttempt, TestQuestion } from '../StudentTestsPage';
import { CheckCircle2, XCircle, Clock, Award, X } from 'lucide-react';

interface TestResultModalProps {
  test: ModuleTest;
  attempt: TestAttempt;
  onClose: () => void;
}

export function TestResultModal({ test, attempt, onClose }: TestResultModalProps) {
  const getQuestionResult = (question: TestQuestion) => {
    const studentAnswer = attempt.answers[question.id];
    const isCorrect = studentAnswer === question.correctAnswer;
    return {
      studentAnswer,
      isCorrect,
      correctAnswer: question.correctAnswer,
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
        <CardHeader className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{test.title}</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {test.courseTitle} • {test.moduleTitle}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6">
          {/* Score Summary */}
          <div
            className={`mb-6 p-6 rounded-lg border-2 ${
              attempt.passed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {attempt.passed ? (
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-foreground">
                    {attempt.passed ? 'Passed!' : 'Failed'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Passing Score: {test.passingScore}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900 dark:text-foreground">
                  {attempt.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {attempt.score} / {attempt.maxScore} points
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Time Spent: {attempt.timeSpent} minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>
                  {test.questions.filter(q => attempt.answers[q.id] === q.correctAnswer).length} / {test.questions.length} correct
                </span>
              </div>
            </div>
          </div>

          {/* Questions Review */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-foreground">
              Question Review
            </h4>
            {test.questions.map((question, idx) => {
              const result = getQuestionResult(question);
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
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
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
        <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-4 flex items-center justify-end">
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}


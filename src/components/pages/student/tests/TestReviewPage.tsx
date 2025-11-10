"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest, TestAttempt } from './StudentTestsPage';
import { CheckCircle2, XCircle, ArrowLeft, Clock, Award } from 'lucide-react';

export function TestReviewPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;
  const [test, setTest] = useState<ModuleTest | null>(null);
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [studentId, setStudentId] = useState<string>('');

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const email = parsedData.email || '';
      setStudentId(email);
    }
  }, []);

  useEffect(() => {
    const storedTests = localStorage.getItem('evolvix_module_tests');
    const storedAttempts = localStorage.getItem('evolvix_test_attempts');
    
    if (storedTests) {
      try {
        const allTests: ModuleTest[] = JSON.parse(storedTests);
        const foundTest = allTests.find(t => t.id === testId);
        if (foundTest) {
          setTest(foundTest);
        }
      } catch (e) {
        console.error('Error parsing stored tests:', e);
      }
    }

    if (storedAttempts) {
      try {
        const allAttempts: TestAttempt[] = JSON.parse(storedAttempts);
        // Find the most recent attempt for this test by this student
        const studentAttempts = allAttempts
          .filter(a => a.testId === testId && (a.studentId === studentId || a.studentId.includes(studentId)))
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        
        if (studentAttempts.length > 0) {
          setAttempt(studentAttempts[0]);
        }
      } catch (e) {
        console.error('Error parsing stored attempts:', e);
      }
    }
  }, [testId, studentId]);

  if (!test || !attempt) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Test or attempt not found
          </h2>
          <Button onClick={() => router.push('/portal/student/tests')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  const getQuestionResult = (questionId: string) => {
    const studentAnswer = attempt.answers[questionId];
    const question = test.questions.find(q => q.id === questionId);
    if (!question) return { isCorrect: false, studentAnswer: '', correctAnswer: '' };
    
    const isCorrect = studentAnswer === question.correctAnswer;
    return {
      isCorrect,
      studentAnswer: studentAnswer || 'Not answered',
      correctAnswer: question.correctAnswer,
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Text Navigation - Simple UI */}
      <div className="text-xs text-navbar-text lowercase">
        <button onClick={() => router.push('/portal/student/tests')} className="hover:text-navbar-text-hover">
          dashboard
        </button>
        <span> - </span>
        <button onClick={() => router.push('/portal/student/tests')} className="hover:text-navbar-text-hover">
          my tests
        </button>
        <span> - </span>
        <span>{test.courseTitle}</span>
        <span> - </span>
        <span>{test.moduleTitle}</span>
        <span> - </span>
        <span>{test.title}</span>
      </div>

      {/* Final Grade */}
      <div className="p-4 bg-card rounded-lg mb-6">
        <p className="text-foreground mb-2">
          Your final grade for this quiz is {attempt.percentage.toFixed(2)}/100.00.
        </p>
        <p className="text-muted-foreground text-sm">
          {test.attemptsAllowed === 1 ? 'No more attempts are allowed' : 'You can attempt this quiz again'}
        </p>
      </div>

      {/* Questions Review */}
      <div id="questions-review" className="space-y-6 mt-8">
        {test.questions.map((question, idx) => {
          const result = getQuestionResult(question.id);
          return (
            <div key={question.id} className="space-y-4">
              {/* Status Banner */}
              <div className={`p-3 rounded-lg ${
                result.isCorrect
                  ? 'bg-green-100 dark:bg-green-900/30 border border-green-500 dark:border-green-600'
                  : 'bg-red-100 dark:bg-red-900/30 border border-red-500 dark:border-red-600'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${
                    result.isCorrect
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                  <span className={`text-sm ${
                    result.isCorrect
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    Mark {result.isCorrect ? question.points.toFixed(2) : '0.00'} out of {question.points.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Question */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {question.question}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Select one:</p>
                
                <div className="space-y-2">
                  {question.options.map((option, optIdx) => {
                    const isCorrect = option === question.correctAnswer;
                    const isSelected = option === result.studentAnswer;
                    const isWrongSelected = isSelected && !isCorrect;
                    
                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border-2 flex items-center space-x-3 ${
                          isCorrect
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600'
                            : isWrongSelected
                            ? 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600'
                            : 'bg-card border-border'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={isSelected}
                          readOnly
                          className="w-4 h-4"
                        />
                        <span className={`flex-1 ${
                          isCorrect || isWrongSelected
                            ? 'font-medium'
                            : ''
                        }`}>
                          {String.fromCharCode(97 + optIdx)}. {option}
                        </span>
                        {isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                        {isWrongSelected && (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flag Question Button */}
              <div className="flex justify-end">
                <Button variant="outline" className="bg-secondary hover:bg-accent text-foreground border-border">
                  Flag question
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Finished Review Button */}
      <div className="flex items-center justify-center mt-8 pt-6 border-t border-border">
        <Button
          onClick={() => router.push(`/portal/student/tests/${testId}/summary`)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
        >
          Finished Review
        </Button>
      </div>
    </div>
  );
}


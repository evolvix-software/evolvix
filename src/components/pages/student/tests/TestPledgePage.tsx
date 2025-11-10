"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest } from './StudentTestsPage';
import { Clock, AlertTriangle, ArrowRight, ArrowLeft, X, CheckCircle2, XCircle } from 'lucide-react';

interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  timeSpent: number;
}

export function TestPledgePage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;
  const [test, setTest] = useState<ModuleTest | null>(null);
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
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

    // Load attempt if exists
    if (storedAttempts && studentId) {
      try {
        const allAttempts: TestAttempt[] = JSON.parse(storedAttempts);
        const testAttempts = allAttempts.filter(a => 
          a.testId === testId && 
          (a.studentId === studentId || a.studentId.includes(studentId))
        );
        // Get the most recent attempt
        if (testAttempts.length > 0) {
          const sortedAttempts = testAttempts.sort((a, b) => 
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
          setAttempt(sortedAttempts[0]);
        }
      } catch (e) {
        console.error('Error parsing stored attempts:', e);
      }
    }
  }, [testId, studentId]);

  const [showStartModal, setShowStartModal] = useState(false);

  const handleAttemptQuiz = () => {
    if (pledgeAccepted && test) {
      setShowStartModal(true);
    }
  };

  const handleStartTest = () => {
    if (pledgeAccepted && test) {
      router.push(`/portal/student/tests/${test.id}/take`);
    }
  };

  if (!test) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Test not found
          </h2>
          <Button onClick={() => router.push('/portal/student/tests')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  const openedAt = new Date(test.openedAt);
  const closesAt = new Date(test.closesAt);
  const hasAttempt = attempt !== null;
  const canRetake = !hasAttempt || (test.attemptsAllowed > 1 && attempt && 
    (attempt.passed === false || test.attemptsAllowed > 1));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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

      {/* Test Title */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
          <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{test.title}</h1>
        </div>
      </div>

      {/* Test Availability */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Opened:</strong> {openedAt.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
            <p className="mt-1"><strong>Closes:</strong> {closesAt.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
          </div>
        </CardContent>
      </Card>

      {/* Academic Pledge */}
      <Card className="border-2 border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-4">
                For this assessment, I pledge and make the following truthful statements:
              </h2>
              <ul className="space-y-3 text-foreground mb-6">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>I have not received, I have not given, nor will I give or receive, any assistance to another student taking this exam, including discussing the exam with any student.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>I will not use any electronic device, dictionary or any other medium to assist me on an exam.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>I will not upload exam/test content online on any website, blog, or social media platform. I understand that acts of academic dishonesty may be penalized to the full extent allowed by the University including receiving a failing grade for the course or expulsion from the University.</span>
                </li>
              </ul>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pledgeAccepted}
                  onChange={(e) => setPledgeAccepted(e.target.checked)}
                  className="w-5 h-5 rounded border-border"
                />
                <span className="text-foreground font-semibold">
                  I accept and agree to the above pledge
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary of Previous Attempts - Show if attempt exists */}
      {hasAttempt && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Summary of your previous attempts</h2>
          <Card className="border border-border">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">State</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Marks / {attempt.maxScore.toFixed(2)}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Grade / 100.00</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Review</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">Finished</div>
                      <div className="text-xs text-muted-foreground">
                        Submitted {new Date(attempt.submittedAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{attempt.score.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{attempt.percentage.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/portal/student/tests/${testId}/review`)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Final Grade */}
          <div className="p-4 bg-card rounded-lg mt-4">
            <p className="text-foreground mb-2">
              Your final grade for this quiz is {attempt.percentage.toFixed(2)}/100.00.
            </p>
            <p className="text-muted-foreground text-sm">
              {test.attemptsAllowed === 1 ? 'No more attempts are allowed' : 'You can attempt this quiz again'}
            </p>
          </div>
        </div>
      )}

      {/* Test Parameters */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <p><strong>Attempts allowed:</strong> {test.attemptsAllowed}</p>
        <p><strong>Time limit:</strong> {test.timeLimit} mins</p>
        <p><strong>Questions:</strong> {test.questions.length}</p>
        <p><strong>Passing score:</strong> {test.passingScore}%</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/portal/student/tests')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {!hasAttempt || canRetake ? (
          <Button
            onClick={handleAttemptQuiz}
            disabled={!pledgeAccepted}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground"
          >
            Attempt quiz
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : null}
      </div>

      {/* Start Attempt Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md border border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Start attempt</h3>
                  <h4 className="text-lg font-medium text-muted-foreground mt-1">Time limit</h4>
                </div>
                <button
                  onClick={() => setShowStartModal(false)}
                  className="w-8 h-8 flex items-center justify-center bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-muted-foreground mb-6">
                Your attempt will have a time limit of {test.timeLimit} mins. When you start, the timer will begin to count down and cannot be paused. You must finish your attempt before it expires. Are you sure you wish to start now?
              </p>
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowStartModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStartTest} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start attempt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest } from './StudentTestsPage';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';

export function TestSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;
  const [test, setTest] = useState<ModuleTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Load test data
  useEffect(() => {
    const storedTests = localStorage.getItem('evolvix_module_tests');
    
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
  }, [testId]);

  // Load answers and calculate initial time remaining
  useEffect(() => {
    const storedAnswers = sessionStorage.getItem(`test_answers_${testId}`);
    
    if (storedAnswers) {
      try {
        const data = JSON.parse(storedAnswers);
        setAnswers(data.answers || {});
        setStartTime(data.startTime || null);
      } catch (e) {
        console.error('Error parsing stored answers:', e);
      }
    }
  }, [testId]);

  // Calculate initial time remaining when both test and startTime are available
  useEffect(() => {
    if (test && startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remainingSeconds = ((test.timeLimit || 10) * 60) - elapsed;
      setTimeRemaining(Math.max(0, remainingSeconds / 60));
    }
  }, [test, startTime]);

  useEffect(() => {
    if (!test || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remainingSeconds = ((test.timeLimit || 10) * 60) - elapsed;
      setTimeRemaining(Math.max(0, remainingSeconds / 60));
    }, 1000);

    return () => clearInterval(interval);
  }, [test, startTime]);

  const formatTime = (minutes: number) => {
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReturnToAttempt = () => {
    router.push(`/portal/student/tests/${testId}/take`);
  };

  const handleSubmitAll = () => {
    if (!test) return;

    // Calculate score
    let score = 0;
    let maxScore = 0;
    
    test.questions.forEach(q => {
      maxScore += q.points;
      if (answers[q.id] === q.correctAnswer) {
        score += q.points;
      }
    });

    const percentage = (score / maxScore) * 100;
    const passed = percentage >= test.passingScore;

    const storedData = localStorage.getItem('evolvix_registration');
    const studentEmail = storedData ? JSON.parse(storedData).email : '';
    const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 60000) : 0;

    const attempt = {
      id: `attempt_${Date.now()}`,
      testId: test.id,
      studentId: studentEmail,
      answers,
      score,
      maxScore,
      percentage,
      passed,
      startedAt: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      timeSpent,
    };

    // Save attempt
    const storedAttempts = localStorage.getItem('evolvix_test_attempts');
    const allAttempts = storedAttempts ? JSON.parse(storedAttempts) : [];
    allAttempts.push(attempt);
    localStorage.setItem('evolvix_test_attempts', JSON.stringify(allAttempts));

    // Clear sessionStorage
    sessionStorage.removeItem(`test_answers_${testId}`);

    // Redirect to review page
    router.push(`/portal/student/tests/${test.id}/review`);
  };

  // Load attempts to show summary
  const [attempts, setAttempts] = useState<any[]>([]);
  
  useEffect(() => {
    const storedAttempts = localStorage.getItem('evolvix_test_attempts');
    if (storedAttempts && test) {
      try {
        const allAttempts = JSON.parse(storedAttempts);
        const testAttempts = allAttempts.filter((a: any) => a.testId === test.id);
        setAttempts(testAttempts);
      } catch (e) {
        console.error('Error parsing attempts:', e);
      }
    }
  }, [test]);

  if (!test) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
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

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = test.questions.length;
  const deadline = startTime ? new Date(startTime + (test.timeLimit || 10) * 60 * 1000) : null;

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
        <span> - </span>
        <span>summary of attempt</span>
      </div>

      {/* Test Title */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
          <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{test.title}</h1>
          <p className="text-lg font-semibold text-muted-foreground mt-1">Summary of attempt</p>
        </div>
      </div>

      {/* Back Button */}
      <div>
        <Button variant="outline" onClick={handleReturnToAttempt}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Questions Summary */}
      <Card className="border border-border">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Question Status</h2>
          <div className="space-y-3">
            {test.questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              return (
                <div key={q.id} className="flex items-center space-x-4 p-3 bg-card rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${
                    isAnswered
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">Question {idx + 1}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAnswered ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-400 font-medium">Answer saved</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Not answered</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timer and Deadline */}
      {deadline && (
        <div className="flex items-center justify-between p-4 bg-card rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatTime(timeRemaining)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            This attempt must be submitted by {deadline.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-center">
        <Button
          onClick={handleSubmitAll}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
        >
          Submit all and finish
        </Button>
      </div>

      {/* Summary of Previous Attempts - Only show if there are previous attempts */}
      {attempts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Summary of your previous attempts</h2>
          <Card className="border border-border">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">State</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Marks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Grade / 100.00</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attemptItem) => (
                    <tr key={attemptItem.id} className="border-b border-border">
                      <td className="px-4 py-3">
                        <div className="text-sm text-foreground">Finished</div>
                        <div className="text-xs text-muted-foreground">
                          Submitted {new Date(attemptItem.submittedAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{attemptItem.score.toFixed(2)} / {attemptItem.maxScore.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{attemptItem.percentage.toFixed(2)}</td>
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
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


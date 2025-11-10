"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest } from './StudentTestsPage';
import { Clock, X, Flag, CheckCircle2, Menu, XCircle, AlertCircle } from 'lucide-react';

export function TestTakingPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;
  const [test, setTest] = useState<ModuleTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0); // in minutes
  const [timeSpent, setTimeSpent] = useState(0); // in minutes
  const [showNavSidebar, setShowNavSidebar] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [studentId, setStudentId] = useState<string>('');
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const email = parsedData.email || '';
      setStudentId(email);
    }
  }, []);

  // Security: Prevent right-click, screenshots, and screen recording
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSecurityWarning('Right-click is disabled during the test.');
      setTimeout(() => setSecurityWarning(null), 3000);
      return false;
    };

    // Disable common screenshot and screen recording shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Print Screen
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        setSecurityWarning('Screenshots are not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Windows + Shift + S (Snipping Tool) - Note: This may not fully prevent system shortcuts
      if ((e.key === 's' || e.key === 'S') && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSecurityWarning('Screenshots are not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Windows + G (Game Bar / Screen Recording)
      if ((e.key === 'g' || e.key === 'G') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSecurityWarning('Screen recording is not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Alt + Print Screen
      if ((e.key === 'PrintScreen' || e.code === 'PrintScreen') && e.altKey) {
        e.preventDefault();
        setSecurityWarning('Screenshots are not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        setSecurityWarning('Developer tools are not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Ctrl + Shift + I (Developer Tools)
      if ((e.key === 'I' || e.key === 'i') && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setSecurityWarning('Developer tools are not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Ctrl + Shift + J (Console)
      if ((e.key === 'J' || e.key === 'j') && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setSecurityWarning('Developer tools are not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Ctrl + Shift + C (Inspect Element)
      if ((e.key === 'C' || e.key === 'c') && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setSecurityWarning('Developer tools are not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Ctrl + U (View Source)
      if ((e.key === 'U' || e.key === 'u') && e.ctrlKey) {
        e.preventDefault();
        setSecurityWarning('Viewing page source is not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Ctrl + S (Save Page)
      if ((e.key === 'S' || e.key === 's') && e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        setSecurityWarning('Saving the page is not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }

      // Disable Ctrl + P (Print)
      if ((e.key === 'P' || e.key === 'p') && e.ctrlKey) {
        e.preventDefault();
        setSecurityWarning('Printing is not allowed during the test.');
        setTimeout(() => setSecurityWarning(null), 3000);
        return false;
      }
    };

    // Disable text selection (optional - can be removed if needed)
    const handleSelectStart = (e: Event) => {
      // Allow selection within input fields and textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      // Allow copying from input fields
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true;
      }
      e.preventDefault();
      setSecurityWarning('Copying content is not allowed during the test.');
      setTimeout(() => setSecurityWarning(null), 3000);
      return false;
    };

    // Disable cut
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Warn on page unload/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your progress may be lost.';
      return e.returnValue;
    };

    // Disable developer tools detection (basic)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // Developer tools might be open
        setSecurityWarning('Please close developer tools to continue with the test.');
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Check for dev tools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Disable common screenshot methods
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(devToolsInterval);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, []);

  useEffect(() => {
    const storedTests = localStorage.getItem('evolvix_module_tests');
    const storedAnswers = sessionStorage.getItem(`test_answers_${testId}`);
    
    if (storedTests) {
      try {
        const allTests: ModuleTest[] = JSON.parse(storedTests);
        const foundTest = allTests.find(t => t.id === testId);
        if (foundTest) {
          setTest(foundTest);
          setTimeRemaining(foundTest.timeLimit || 10);
          
          // Restore answers and start time from sessionStorage if they exist
          if (storedAnswers) {
            try {
              const data = JSON.parse(storedAnswers);
              if (data.answers) {
                setAnswers(data.answers);
              }
              if (data.flaggedQuestions) {
                setFlaggedQuestions(new Set(data.flaggedQuestions));
              }
              if (data.startTime) {
                // Restore the original start time
                setStartTime(data.startTime);
                const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
                const remainingSeconds = ((foundTest.timeLimit || 10) * 60) - elapsed;
                setTimeRemaining(Math.max(0, remainingSeconds / 60));
              }
            } catch (e) {
              console.error('Error parsing stored answers:', e);
            }
          } else {
            // First time starting - save start time
            const newStartTime = Date.now();
            setStartTime(newStartTime);
            sessionStorage.setItem(`test_answers_${testId}`, JSON.stringify({
              answers: {},
              startTime: newStartTime,
              flaggedQuestions: [],
            }));
          }
        }
      } catch (e) {
        console.error('Error parsing stored tests:', e);
      }
    }
  }, [testId]);

  useEffect(() => {
    if (!test) return;

    // Save answers and start time to sessionStorage periodically
    const saveInterval = setInterval(() => {
      sessionStorage.setItem(`test_answers_${testId}`, JSON.stringify({
        answers,
        startTime,
        flaggedQuestions: Array.from(flaggedQuestions),
      }));
    }, 5000); // Save every 5 seconds

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000); // in seconds
      const elapsedMinutes = Math.floor(elapsed / 60);
      setTimeSpent(elapsedMinutes);
      
      if (test.timeLimit) {
        const remainingSeconds = (test.timeLimit * 60) - elapsed;
        const remainingMinutes = remainingSeconds / 60;
        setTimeRemaining(Math.max(0, remainingMinutes));
        
        if (remainingSeconds <= 0) {
          // When time runs out, save and redirect to summary
          sessionStorage.setItem(`test_answers_${testId}`, JSON.stringify({
            answers,
            startTime,
            flaggedQuestions: Array.from(flaggedQuestions),
          }));
          router.push(`/portal/student/tests/${testId}/summary`);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(saveInterval);
    };
  }, [test, startTime, answers, testId, router, flaggedQuestions]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleClearAnswer = (questionId: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const scrollToQuestion = (index: number) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowNavSidebar(false);
    }
  };

  const formatTime = (minutes: number) => {
    const totalSeconds = Math.floor(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishAttempt = () => {
    // Save current state and redirect to summary
    sessionStorage.setItem(`test_answers_${testId}`, JSON.stringify({
      answers,
      startTime,
      flaggedQuestions: Array.from(flaggedQuestions),
    }));
    router.push(`/portal/student/tests/${testId}/summary`);
  };

  if (!test) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Test not found
          </h2>
          <Button onClick={() => router.push('/portal/student/tests')}>
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = test.questions.length;

  return (
    <div 
      className="relative"
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Security Warning Overlay */}
      {securityWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">{securityWarning}</span>
        </div>
      )}
      {/* Floating Navigation Icon */}
      <button
        onClick={() => setShowNavSidebar(true)}
        className="fixed right-4 top-24 z-30 w-12 h-12 bg-secondary hover:bg-accent rounded-lg flex items-center justify-center shadow-lg transition-all"
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      {/* Slide-out Navigation Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-40 transform transition-transform duration-300 ease-in-out ${
        showNavSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Quiz navigation</h3>
          <button
            onClick={() => setShowNavSidebar(false)}
            className="p-2 hover:bg-secondary rounded"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-200px)]">
          <div className="grid grid-cols-5 gap-2">
            {test.questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isFlagged = flaggedQuestions.has(q.id);
              
              return (
                <button
                  key={q.id}
                  onClick={() => scrollToQuestion(idx)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    isAnswered
                      ? 'bg-primary text-primary-foreground'
                      : isFlagged
                      ? 'bg-yellow-600 text-white'
                      : 'bg-secondary text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <Button
            onClick={handleFinishAttempt}
            className="w-full bg-secondary text-foreground hover:bg-accent font-semibold"
          >
            Finish attempt...
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{test.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {test.courseTitle} • {test.moduleTitle}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              timeRemaining <= 5
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {answeredCount}/{totalQuestions} answered
            </div>
          </div>
        </div>

        {/* All Questions - Vertical Layout */}
        <div className="space-y-8">
          {test.questions.map((question, idx) => {
            const isAnswered = !!answers[question.id];
            const selectedAnswer = answers[question.id];
            const isFlagged = flaggedQuestions.has(question.id);

            return (
              <Card
                key={question.id}
                id={`question-${idx}`}
                className="border border-border"
              >
                <CardContent className="p-6">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-secondary text-muted-foreground rounded text-sm">
                          {isAnswered ? 'Answered' : 'Not yet answered'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Marked out of {question.points.toFixed(2)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Question {idx + 1}
                      </h2>
                    </div>
                    <button
                      onClick={() => toggleFlag(question.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isFlagged
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-secondary text-muted-foreground hover:bg-accent'
                      }`}
                      title={isFlagged ? 'Unflag question' : 'Flag question'}
                    >
                      <Flag className={`w-5 h-5 ${isFlagged ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Question Text */}
                  <p className="text-lg text-foreground mb-4">
                    {question.question}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">Select one:</p>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option, optIdx) => {
                      const isSelected = selectedAnswer === option;
                      return (
                        <div key={optIdx} className="relative">
                          <label
                            className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                              isSelected
                                ? 'bg-primary/20 border-primary'
                                : 'bg-card border-border hover:bg-secondary'
                            }`}
                            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={isSelected}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="mt-1 w-5 h-5 cursor-pointer"
                            />
                            <span className="text-foreground flex-1 text-base pointer-events-none">
                              {String.fromCharCode(97 + optIdx)}. {option}
                            </span>
                          </label>
                          {isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClearAnswer(question.id);
                              }}
                              className="absolute right-2 top-2 p-1.5 bg-card/80 hover:bg-card rounded text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Clear selection"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submit Button at End */}
        <div className="flex items-center justify-center py-8 border-t border-border">
          <Button
            onClick={() => setShowSubmitConfirm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
          >
            Submit Test
          </Button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md border border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Confirm Submission
              </h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to submit your test? Once submitted, you cannot change your answers.
              </p>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p>Answered: {answeredCount}/{totalQuestions}</p>
                <p>Time spent: {formatTime(timeSpent)}</p>
                {flaggedQuestions.size > 0 && (
                  <p>Flagged questions: {flaggedQuestions.size}</p>
                )}
              </div>
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFinishAttempt}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Submit all and finish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest, TestQuestion } from '../StudentTestsPage';
import { Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface TestAttemptModalProps {
  test: ModuleTest;
  onClose: () => void;
  onSubmit: (answers: Record<string, string>, timeSpent: number) => void;
}

export function TestAttemptModal({ test, onClose, onSubmit }: TestAttemptModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(test.timeLimit || 10); // in minutes
  const [timeSpent, setTimeSpent] = useState(0); // in minutes
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 60000);
      setTimeSpent(elapsed);
      
      if (test.timeLimit) {
        const remaining = test.timeLimit - elapsed;
        setTimeRemaining(Math.max(0, remaining));
        
        if (remaining <= 0) {
          handleAutoSubmit();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [test.timeLimit, startTime]);

  const handleAutoSubmit = () => {
    onSubmit(answers, timeSpent);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const unanswered = test.questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      if (!confirm(`You have ${unanswered.length} unanswered questions. Submit anyway?`)) {
        return;
      }
    }
    onSubmit(answers, timeSpent);
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = test.questions.length;

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
            <div className="flex items-center space-x-4">
              {test.timeLimit && (
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    timeRemaining <= 5
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">{formatTime(timeRemaining)}</span>
                </div>
              )}
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {answeredCount}/{totalQuestions} answered
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {test.questions.map((question, idx) => (
              <div
                key={question.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="font-semibold text-slate-900 dark:text-foreground flex-1">
                    {idx + 1}. {question.question}
                  </p>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-4">
                    {question.points} pts
                  </span>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, optIdx) => {
                    const optionId = `${question.id}_${optIdx}`;
                    const isSelected = answers[question.id] === option;
                    return (
                      <label
                        key={optIdx}
                        className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                          isSelected
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600'
                            : 'bg-slate-50 dark:bg-slate-900/50 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={isSelected}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="mt-1 w-4 h-4"
                        />
                        <span className="text-slate-900 dark:text-foreground flex-1">
                          {String.fromCharCode(97 + optIdx)}. {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <AlertCircle className="w-4 h-4" />
            <span>
              {totalQuestions - answeredCount} question{totalQuestions - answeredCount !== 1 ? 's' : ''} remaining
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => setShowConfirmSubmit(true)}
              className="bg-green-600 hover:bg-green-700"
              disabled={timeRemaining <= 0}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirm Submit Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Confirm Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Are you sure you want to submit your test? You have {totalQuestions - answeredCount} unanswered
                questions.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


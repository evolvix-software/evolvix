"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { X, Send, Star, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { AssignmentSubmission } from '@/interfaces/assignments';

interface GradeAssignmentProps {
  submission: AssignmentSubmission;
  onClose: () => void;
  onGrade: (submissionId: string, score: number, feedback: string) => void;
}

export function GradeAssignment({ submission, onClose, onGrade }: GradeAssignmentProps) {
  const [score, setScore] = useState(submission.score || 0);
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxScore = submission.maxScore;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const getGradeColor = (percentage: number) => {
    return 'text-slate-900 dark:text-foreground';
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 50) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (score < 0 || score > maxScore) {
      alert(`Score must be between 0 and ${maxScore}`);
      return;
    }

    if (!feedback.trim()) {
      if (!confirm('No feedback provided. Continue anyway?')) {
        return;
      }
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onGrade(submission.id, score, feedback.trim());
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-slate-300 dark:border-slate-600">
        <CardHeader className="bg-slate-700 dark:bg-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-card/20 rounded-full flex items-center justify-center border-2 border-card/50">
                <span className="text-white font-bold">
                  {submission.studentName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <CardTitle className="text-white">Grade Assignment</CardTitle>
                <p className="text-sm text-white/90">{submission.studentName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-card/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submission Info */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-900 dark:text-foreground mb-3">
                Submission Details
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Submitted: </span>
                  <span className="font-medium text-slate-900 dark:text-foreground">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Due Date: </span>
                  <span className={`font-medium ${
                    submission.isLate ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-foreground'
                  }`}>
                    {new Date(submission.dueDate).toLocaleDateString()}
                    {submission.isLate && ' (Late)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Files: </span>
                  <span className="font-medium text-slate-900 dark:text-foreground">
                    {submission.files.length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Max Score: </span>
                  <span className="font-medium text-slate-900 dark:text-foreground">
                    {maxScore} points
                  </span>
                </div>
              </div>

              {/* Files List */}
              {submission.files.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Submitted Files:
                  </p>
                  <div className="space-y-2">
                    {submission.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 bg-card dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-900 dark:text-foreground">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(submission.githubUrl || submission.liveLink) && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex flex-wrap gap-2">
                    {submission.githubUrl && (
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        <span>View GitHub</span>
                      </a>
                    )}
                    {submission.liveLink && (
                      <a
                        href={submission.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors"
                      >
                        <span>View Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Student Notes */}
              {submission.notes && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Student Notes:
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-card dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                    {submission.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Score Input */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-foreground mb-2 block">
                  Score (0 - {maxScore}) *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setScore(Math.max(0, Math.min(maxScore, value)));
                    }}
                    min="0"
                    max={maxScore}
                    className="w-32 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Percentage
                      </span>
                      <span className={`text-lg font-bold ${getGradeColor(percentage)}`}>
                        {percentage}% - {getGradeLabel(percentage)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          percentage >= 90 ? 'bg-green-500' :
                          percentage >= 70 ? 'bg-yellow-500' :
                          percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Score Buttons */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 self-center">Quick set:</span>
                {[maxScore, Math.round(maxScore * 0.9), Math.round(maxScore * 0.7), Math.round(maxScore * 0.5), 0].map((quickScore) => (
                  <Button
                    key={quickScore}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setScore(quickScore)}
                    className={`border-slate-300 dark:border-slate-700 ${
                      score === quickScore ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : ''
                    }`}
                  >
                    {quickScore}
                  </Button>
                ))}
              </div>
            </div>

            {/* Feedback Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-foreground">
                Feedback *
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback about the submission. Include strengths, areas for improvement, and specific suggestions..."
                rows={8}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                required
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {feedback.length} characters
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>Feedback will be sent to student automatically</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-slate-300 dark:border-slate-700"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-card mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {submission.score !== undefined ? 'Update Grade' : 'Submit Grade'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Target,
  RotateCcw
} from 'lucide-react';
import { Assignment, AssignmentSubmission } from '@/interfaces/assignments';

interface MentorFeedbackProps {
  submission: AssignmentSubmission;
  assignment: Assignment;
}

export function MentorFeedback({ submission, assignment }: MentorFeedbackProps) {
  const scorePercentage = submission.score 
    ? Math.round((submission.score / assignment.maxScore) * 100)
    : 0;

  const getScoreColor = () => {
    if (scorePercentage >= 90) return 'text-green-600 dark:text-green-400';
    if (scorePercentage >= 70) return 'text-blue-600 dark:text-blue-400';
    if (scorePercentage >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadgeColor = () => {
    if (scorePercentage >= 90) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (scorePercentage >= 70) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (scorePercentage >= 50) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  // Parse feedback for strengths and improvements (simple parsing - in real app, structured data)
  const parseFeedback = (feedback: string) => {
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    // Simple parsing - look for common patterns
    const lines = feedback.split('\n');
    let currentSection: 'strengths' | 'improvements' | null = null;
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('strength') || lowerLine.includes('good') || lowerLine.includes('excellent') || lowerLine.includes('well done')) {
        currentSection = 'strengths';
      } else if (lowerLine.includes('improve') || lowerLine.includes('suggestion') || lowerLine.includes('consider') || lowerLine.includes('better')) {
        currentSection = 'improvements';
      }
      
      if (line.trim() && line.trim().startsWith('-')) {
        const content = line.trim().substring(1).trim();
        if (currentSection === 'strengths' && content) {
          strengths.push(content);
        } else if (currentSection === 'improvements' && content) {
          improvements.push(content);
        }
      }
    });

    // If no structured parsing, try to extract from general feedback
    if (strengths.length === 0 && improvements.length === 0) {
      // Try to find positive and negative sentences
      const sentences = feedback.split(/[.!?]+/).filter(s => s.trim());
      sentences.forEach(sentence => {
        const lower = sentence.toLowerCase();
        if (lower.includes('good') || lower.includes('excellent') || lower.includes('well') || lower.includes('great')) {
          strengths.push(sentence.trim());
        } else if (lower.includes('improve') || lower.includes('better') || lower.includes('consider') || lower.includes('suggestion')) {
          improvements.push(sentence.trim());
        }
      });
    }

    return { strengths, improvements };
  };

  const { strengths, improvements } = submission.feedback 
    ? parseFeedback(submission.feedback)
    : { strengths: [], improvements: [] };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-2 border-slate-200 dark:border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-foreground flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary dark:text-primary" />
            <span>Mentor Feedback</span>
          </h2>
          {submission.gradedAt && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Graded on {formatDate(submission.gradedAt)}
            </p>
          )}
        </div>

        {/* Score Display */}
        <div className="mb-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#2B2B32] dark:to-border rounded-xl border-2 border-slate-200 dark:border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Your Score</p>
              <div className="flex items-baseline space-x-2">
                <span className={`text-4xl font-bold ${getScoreColor()}`}>
                  {submission.score}
                </span>
                <span className="text-xl text-slate-600 dark:text-slate-400">
                  / {assignment.maxScore}
                </span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg ${getScoreBadgeColor()}`}>
              <p className="text-2xl font-bold">{scorePercentage}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                scorePercentage >= 90
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : scorePercentage >= 70
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : scorePercentage >= 50
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-foreground mb-3 flex items-center space-x-2">
              <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Strengths</span>
            </h3>
            <div className="space-y-2">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg"
                >
                  <p className="text-sm text-green-900 dark:text-green-300">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas for Improvement */}
        {improvements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-foreground mb-3 flex items-center space-x-2">
              <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Areas for Improvement</span>
            </h3>
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg"
                >
                  <p className="text-sm text-amber-900 dark:text-amber-300">{improvement}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Feedback */}
        {submission.feedback && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-foreground mb-3 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-primary dark:text-primary" />
              <span>Detailed Feedback</span>
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-card rounded-lg border-2 border-slate-200 dark:border-border">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {submission.feedback}
              </p>
            </div>
          </div>
        )}

        {/* Resubmission Option */}
        {submission.status === 'returned' && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <RotateCcw className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">
                  Resubmission Requested
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
                  Your mentor has requested a resubmission. Please review the feedback above and make the necessary improvements.
                </p>
                <Button
                  onClick={() => {
                    // Scroll to submission form
                    const submissionForm = document.getElementById('submission-form');
                    if (submissionForm) {
                      submissionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Resubmit Assignment
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Graded Successfully */}
        {submission.status === 'graded' && scorePercentage >= 70 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">
                  Assignment Completed Successfully
                </p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Great work! You've successfully completed this assignment. Keep up the excellent progress!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}




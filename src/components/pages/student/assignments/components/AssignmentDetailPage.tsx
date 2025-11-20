"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Download,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  ExternalLink,
  Github,
  Link as LinkIcon,
  X
} from 'lucide-react';
import { Assignment, AssignmentSubmission } from '@/interfaces/assignments';
import { mockAssignments, mockSubmissions } from '@/data/mock/assignments';
import { SubmissionInterface } from './SubmissionInterface';
import { MentorFeedback } from './MentorFeedback';
import { ProjectMilestoneTracker } from './ProjectMilestoneTracker';

interface AssignmentDetailPageProps {
  assignmentId: string;
  studentId?: string;
}

export function AssignmentDetailPage({ assignmentId, studentId = 'student_1' }: AssignmentDetailPageProps) {
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load assignment
    const storedAssignments = localStorage.getItem('evolvix_assignments');
    const allAssignments = storedAssignments
      ? [...mockAssignments, ...JSON.parse(storedAssignments)]
      : mockAssignments;
    
    const foundAssignment = allAssignments.find(a => a.id === assignmentId);
    setAssignment(foundAssignment || null);

    // Load submission
    const storedSubmissions = localStorage.getItem('evolvix_submissions');
    const allSubmissions = storedSubmissions
      ? [...mockSubmissions, ...JSON.parse(storedSubmissions)]
      : mockSubmissions;
    
    const foundSubmission = allSubmissions.find(s => 
      s.assignmentId === assignmentId && s.studentId === studentId
    );
    setSubmission(foundSubmission || null);
  }, [assignmentId, studentId]);

  const daysUntilDue = useMemo(() => {
    if (!assignment) return 0;
    return Math.ceil(
      (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [assignment]);

  const isOverdue = daysUntilDue < 0 && !submission;
  const canSubmit = !submission || submission.status === 'returned';

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

  const formatTimeRemaining = () => {
    if (daysUntilDue < 0) return 'Overdue';
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue <= 7) return `${daysUntilDue} days remaining`;
    const weeks = Math.floor(daysUntilDue / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} remaining`;
  };

  const handleSubmissionSuccess = (newSubmission: AssignmentSubmission) => {
    setSubmission(newSubmission);
    setShowSubmissionForm(false);
    
    // Update localStorage
    const storedSubmissions = localStorage.getItem('evolvix_submissions');
    const allSubmissions = storedSubmissions ? JSON.parse(storedSubmissions) : [];
    allSubmissions.push(newSubmission);
    localStorage.setItem('evolvix_submissions', JSON.stringify(allSubmissions));
  };

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] dark:border-[#735fff] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading assignment...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-slate-300 dark:border-border"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-foreground mb-2">
            {assignment.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{assignment.courseTitle}</span>
            </div>
            {assignment.type === 'project' && assignment.projectNumber && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">
                Project {assignment.projectNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Due Date Countdown */}
      <Card className={`border-2 ${
        isOverdue 
          ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
          : daysUntilDue <= 3 
          ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10'
          : 'border-slate-200 dark:border-border'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                isOverdue
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : daysUntilDue <= 3
                  ? 'bg-amber-100 dark:bg-amber-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <Clock className={`w-8 h-8 ${
                  isOverdue
                    ? 'text-red-600 dark:text-red-400'
                    : daysUntilDue <= 3
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`} />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Due Date</p>
                <p className="text-xl font-bold text-slate-900 dark:text-foreground">
                  {formatDate(assignment.dueDate)}
                </p>
                <p className={`text-sm font-semibold mt-1 ${
                  isOverdue
                    ? 'text-red-600 dark:text-red-400'
                    : daysUntilDue <= 3
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {formatTimeRemaining()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Max Score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-foreground flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-primary dark:text-primary" />
                <span>{assignment.maxScore} points</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Status */}
      {submission && (
        <Card className="border-2 border-slate-200 dark:border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {submission.status === 'graded' ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                ) : submission.status === 'returned' ? (
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                ) : (
                  <FileCheck className="w-8 h-8 text-blue-500" />
                )}
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Submission Status</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-foreground">
                    {submission.status === 'graded' ? 'Graded' : 
                     submission.status === 'returned' ? 'Returned for Resubmission' :
                     submission.status === 'late' ? 'Submitted (Late)' : 'Submitted'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Submitted on {formatDate(submission.submittedAt)}
                  </p>
                </div>
              </div>
              {submission.score !== undefined && (
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Score</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {submission.score}/{assignment.maxScore}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {Math.round((submission.score / assignment.maxScore) * 100)}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-2 border-slate-200 dark:border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary dark:text-primary" />
                <span>Description</span>
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {assignment.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-2 border-slate-200 dark:border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary dark:text-primary" />
                <span>Instructions & Requirements</span>
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {assignment.instructions}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <Card className="border-2 border-slate-200 dark:border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center space-x-2">
                  <Download className="w-5 h-5 text-primary dark:text-primary" />
                  <span>Resources & Attachments</span>
                </h2>
                <div className="space-y-2">
                  {assignment.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 border-2 border-slate-200 dark:border-border rounded-lg hover:border-[#635bff] dark:hover:border-[#735fff] hover:bg-slate-50 dark:hover:bg-card transition-all"
                    >
                      <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      <span className="flex-1 text-slate-900 dark:text-foreground font-medium">
                        {attachment.name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Milestone Tracker */}
          {assignment.type === 'project' && (
            <ProjectMilestoneTracker assignment={assignment} />
          )}

          {/* Submission Interface */}
          {showSubmissionForm ? (
            <Card className="border-2 border-[#635bff] dark:border-[#735fff]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-foreground">
                    {submission ? 'Resubmit Assignment' : 'Submit Assignment'}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSubmissionForm(false)}
                    className="border-slate-300 dark:border-border"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <SubmissionInterface
                  assignment={assignment}
                  existingSubmission={submission}
                  onSuccess={handleSubmissionSuccess}
                  onCancel={() => setShowSubmissionForm(false)}
                />
              </CardContent>
            </Card>
          ) : canSubmit && (
            <Card className="border-2 border-slate-200 dark:border-border">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                    {submission 
                      ? 'Your submission was returned. Please review the feedback and resubmit.'
                      : 'Ready to submit your assignment?'}
                  </p>
                  <Button
                    onClick={() => setShowSubmissionForm(true)}
                    className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {submission ? 'Resubmit Assignment' : 'Submit Assignment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Submission */}
          {submission && !showSubmissionForm && (
            <Card className="border-2 border-slate-200 dark:border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4">
                  Your Submission
                </h2>
                <div className="space-y-4">
                  {submission.files && submission.files.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Submitted Files:
                      </p>
                      <div className="space-y-2">
                        {submission.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 border-2 border-slate-200 dark:border-border rounded-lg hover:border-[#635bff] dark:hover:border-[#735fff] transition-all"
                          >
                            <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <span className="flex-1 text-slate-900 dark:text-foreground">
                              {file.name}
                            </span>
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {submission.githubUrl && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        GitHub Repository:
                      </p>
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary dark:text-primary hover:underline"
                      >
                        <Github className="w-5 h-5" />
                        <span>{submission.githubUrl}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  {submission.liveLink && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Live Demo:
                      </p>
                      <a
                        href={submission.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary dark:text-primary hover:underline"
                      >
                        <LinkIcon className="w-5 h-5" />
                        <span>{submission.liveLink}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  {submission.notes && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Your Notes:
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap p-3 bg-slate-50 dark:bg-card rounded-lg">
                        {submission.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mentor Feedback */}
          {submission && (submission.status === 'graded' || submission.status === 'returned') && (
            <MentorFeedback submission={submission} assignment={assignment} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Info */}
          <Card className="border-2 border-slate-200 dark:border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-foreground mb-4">
                Assignment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Type</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                    {assignment.type === 'project' ? 'Project' : 'Class Assignment'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Created</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                    {formatDate(assignment.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Due Date</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                    {formatDate(assignment.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Max Score</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                    {assignment.maxScore} points
                  </p>
                </div>
                {submission && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Submission Count</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-foreground">
                      1 {submission.status === 'returned' ? '(Returned)' : ''}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}




"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  FileText,
  Download,
  ExternalLink,
  Github,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  User,
  Calendar
} from 'lucide-react';
import { AssignmentSubmission, SubmissionStatus } from '@/interfaces/assignments';

interface StudentSubmissionsProps {
  submissions: AssignmentSubmission[];
  onGrade: (submission: AssignmentSubmission) => void;
  onViewDetails: (submission: AssignmentSubmission) => void;
}

export function StudentSubmissions({
  submissions,
  onGrade,
  onViewDetails
}: StudentSubmissionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = 
        sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.assignmentId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const getStatusColor = (status: SubmissionStatus, isLate: boolean) => {
    if (isLate) return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    if (status === 'graded') return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    if (status === 'returned') return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    if (status === 'submitted') return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  const getStatusIcon = (status: SubmissionStatus, isLate: boolean) => {
    if (isLate) return <XCircle className="w-4 h-4" />;
    if (status === 'graded') return <CheckCircle2 className="w-4 h-4" />;
    if (status === 'returned') return <AlertCircle className="w-4 h-4" />;
    if (status === 'submitted') return <CheckCircle2 className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isSubmissionLate = (submission: AssignmentSubmission) => {
    const submittedDate = new Date(submission.submittedAt);
    const dueDate = new Date(submission.dueDate);
    return submittedDate > dueDate;
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground">
            Student Submissions ({filteredSubmissions.length})
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | 'all')}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="late">Late</option>
            <option value="graded">Graded</option>
            <option value="returned">Returned</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-2">
              No submissions found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery ? 'Try adjusting your search query' : 'No submissions yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => {
            const late = isSubmissionLate(submission);
            return (
              <Card
                key={submission.id}
                className={`border-2 transition-all duration-200 hover:shadow-lg ${
                  selectedSubmission?.id === submission.id
                    ? 'border-blue-500 dark:border-blue-400'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Student Info */}
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600">
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">
                            {submission.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-foreground">
                            {submission.studentName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {submission.studentEmail}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(submission.status, late)}`}
                        >
                          {getStatusIcon(submission.status, late)}
                          <span>
                            {late ? 'Late' : submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </span>
                        {submission.score !== undefined && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
                            {submission.score}/{submission.maxScore}
                          </span>
                        )}
                      </div>

                      {/* Submission Info */}
                      <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>
                            Due: {new Date(submission.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Files */}
                      {submission.files.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                            Submitted Files ({submission.files.length})
                          </p>
                          <div className="space-y-2">
                            {submission.files.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700"
                              >
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                  <span className="text-sm text-slate-900 dark:text-foreground truncate">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    ({formatFileSize(file.size)})
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(file.url, '_blank')}
                                  className="flex-shrink-0"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {submission.githubUrl && (
                          <a
                            href={submission.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {submission.liveLink && (
                          <a
                            href={submission.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>

                      {/* Notes */}
                      {submission.notes && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Student Notes:
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {submission.notes}
                          </p>
                        </div>
                      )}

                      {/* Feedback Preview */}
                      {submission.feedback && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">
                            Feedback:
                          </p>
                          <p className="text-sm text-green-800 dark:text-green-200 line-clamp-2">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          onViewDetails(submission);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {submission.status !== 'graded' && (
                        <Button
                          size="sm"
                          onClick={() => onGrade(submission)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Grade
                        </Button>
                      )}
                      {submission.status === 'graded' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onGrade(submission)}
                          className="border-slate-300 dark:border-slate-700"
                        >
                          Update Grade
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}


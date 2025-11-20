"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  BookOpen,
  Upload,
  TrendingUp,
  FileCheck,
  FolderOpen,
  ChevronRight
} from 'lucide-react';
import { StatsCard, STAT_CARD_COLORS } from '@/components/common/ui/StatsCard';
import { Assignment, AssignmentSubmission } from '@/interfaces/assignments';
import { mockAssignments, mockSubmissions } from '@/data/mock/assignments';
import { useAppSelector } from '@/hooks';

type AssignmentStatus = 'not-started' | 'in-progress' | 'submitted' | 'graded';
type FilterType = 'all' | 'not-started' | 'in-progress' | 'submitted' | 'graded' | 'project' | 'class';

export function StudentAssignmentsPage() {
  const router = useRouter();
  const { courses } = useAppSelector((state) => state.courses);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [studentId] = useState('student_1'); // In real app, get from auth context

  // Load assignments and submissions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load assignments
    const storedAssignments = localStorage.getItem('evolvix_assignments');
    const allAssignments = storedAssignments
      ? [...mockAssignments, ...JSON.parse(storedAssignments)]
      : mockAssignments;
    
    // Filter assignments for enrolled courses
    const enrollments = localStorage.getItem('evolvix_enrollments');
    if (enrollments) {
      const enrollmentList = JSON.parse(enrollments);
      const enrolledCourseIds = enrollmentList.map((e: any) => e.courseId);
      const filteredAssignments = allAssignments.filter(a => 
        enrolledCourseIds.includes(a.courseId)
      );
      setAssignments(filteredAssignments);
    } else {
      setAssignments(allAssignments);
    }

    // Load submissions
    const storedSubmissions = localStorage.getItem('evolvix_submissions');
    const allSubmissions = storedSubmissions
      ? [...mockSubmissions, ...JSON.parse(storedSubmissions)]
      : mockSubmissions;
    
    const studentSubmissions = allSubmissions.filter(s => s.studentId === studentId);
    setSubmissions(studentSubmissions);
  }, [studentId]);

  // Get assignment status
  const getAssignmentStatus = (assignment: Assignment): AssignmentStatus => {
    const submission = submissions.find(s => s.assignmentId === assignment.id);
    
    if (!submission) {
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      return now > dueDate ? 'not-started' : 'in-progress';
    }

    if (submission.status === 'graded' || submission.status === 'returned') {
      return 'graded';
    }
    
    if (submission.status === 'submitted' || submission.status === 'late' || submission.status === 'pending') {
      return 'submitted';
    }

    return 'in-progress';
  };

  // Get assignment with status
  const assignmentsWithStatus = useMemo(() => {
    return assignments.map(assignment => ({
      ...assignment,
      status: getAssignmentStatus(assignment),
      submission: submissions.find(s => s.assignmentId === assignment.id),
      daysUntilDue: Math.ceil(
        (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    }));
  }, [assignments, submissions]);

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    let filtered = assignmentsWithStatus;

    // Course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(a => a.courseId === courseFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'project') {
        filtered = filtered.filter(a => a.type === 'project');
      } else if (statusFilter === 'class') {
        filtered = filtered.filter(a => a.type === 'class');
      } else {
        filtered = filtered.filter(a => a.status === statusFilter);
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.courseTitle.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [assignmentsWithStatus, statusFilter, courseFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = assignmentsWithStatus.length;
    const notStarted = assignmentsWithStatus.filter(a => a.status === 'not-started').length;
    const inProgress = assignmentsWithStatus.filter(a => a.status === 'in-progress').length;
    const submitted = assignmentsWithStatus.filter(a => a.status === 'submitted').length;
    const graded = assignmentsWithStatus.filter(a => a.status === 'graded').length;
    const overdue = assignmentsWithStatus.filter(a => 
      a.status !== 'graded' && a.status !== 'submitted' && a.daysUntilDue < 0
    ).length;

    return { total, notStarted, inProgress, submitted, graded, overdue };
  }, [assignmentsWithStatus]);

  // Get enrolled courses for filter
  const enrolledCourses = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const enrollments = localStorage.getItem('evolvix_enrollments');
    if (enrollments) {
      const enrollmentList = JSON.parse(enrollments);
      return courses.filter(c => enrollmentList.some((e: any) => e.courseId === c.id));
    }
    return [];
  }, [courses]);

  const getStatusBadge = (status: AssignmentStatus, daysUntilDue: number) => {
    if (status === 'graded') {
      return (
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Graded</span>
        </span>
      );
    }
    if (status === 'submitted') {
      return (
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold flex items-center space-x-1">
          <FileCheck className="w-3 h-3" />
          <span>Submitted</span>
        </span>
      );
    }
    if (status === 'in-progress') {
      if (daysUntilDue < 0) {
        return (
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Overdue</span>
          </span>
        );
      }
      if (daysUntilDue <= 3) {
        return (
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Due Soon</span>
          </span>
        );
      }
      return (
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>In Progress</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold flex items-center space-x-1">
        <XCircle className="w-3 h-3" />
        <span>Not Started</span>
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-foreground mb-2">
            My Assignments
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            View, submit, and track your assignments and projects
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          icon={FileText}
          label="Total"
          value={stats.total}
          {...STAT_CARD_COLORS.blue}
        />
        <StatsCard
          icon={XCircle}
          label="Not Started"
          value={stats.notStarted}
          {...STAT_CARD_COLORS.gray}
        />
        <StatsCard
          icon={Clock}
          label="In Progress"
          value={stats.inProgress}
          {...STAT_CARD_COLORS.indigo}
        />
        <StatsCard
          icon={FileCheck}
          label="Submitted"
          value={stats.submitted}
          {...STAT_CARD_COLORS.blue}
        />
        <StatsCard
          icon={CheckCircle2}
          label="Graded"
          value={stats.graded}
          {...STAT_CARD_COLORS.green}
        />
        <StatsCard
          icon={AlertCircle}
          label="Overdue"
          value={stats.overdue}
          {...STAT_CARD_COLORS.red}
        />
      </div>

      {/* Filters and Search */}
      <Card className="border-2 border-slate-200 dark:border-border">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search assignments, courses, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
              />
            </div>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-4 py-2.5 border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
            >
              <option value="all">All Courses</option>
              {enrolledCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterType)}
              className="px-4 py-2.5 border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="project">Projects</option>
              <option value="class">Class Assignments</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const submission = assignment.submission;
            const isOverdue = assignment.daysUntilDue < 0 && assignment.status !== 'graded' && assignment.status !== 'submitted';

            return (
              <Card
                key={assignment.id}
                className="border-2 border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/portal/student/assignments/${assignment.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Main Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {assignment.type === 'project' ? (
                              <FolderOpen className="w-5 h-5 text-purple-500" />
                            ) : (
                              <FileText className="w-5 h-5 text-blue-500" />
                            )}
                            <h3 className="text-xl font-bold text-slate-900 dark:text-foreground">
                              {assignment.title}
                            </h3>
                            {assignment.type === 'project' && assignment.projectNumber && (
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">
                                Project {assignment.projectNumber}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{assignment.courseTitle}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {formatDate(assignment.dueDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{assignment.maxScore} points</span>
                            </div>
                            {submission && (
                              <div className="flex items-center space-x-1">
                                <Upload className="w-4 h-4" />
                                <span>Submitted: {formatDate(submission.submittedAt)}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {assignment.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getStatusBadge(assignment.status, assignment.daysUntilDue)}
                          {submission?.score !== undefined && (
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {submission.score}/{assignment.maxScore}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {Math.round((submission.score / assignment.maxScore) * 100)}%
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/portal/student/assignments/${assignment.id}`);
                        }}
                        className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white"
                      >
                        {assignment.status === 'graded' ? 'View Feedback' : assignment.status === 'submitted' ? 'View Submission' : 'View Details'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-2 border-slate-200 dark:border-border">
          <CardContent className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2B2B32] dark:to-border rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-3">
              No assignments found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' || courseFilter !== 'all'
                ? 'No assignments match your filters. Try adjusting your search criteria.'
                : 'You don\'t have any assignments yet. Assignments will appear here once your mentors create them.'}
            </p>
            {(searchQuery || statusFilter !== 'all' || courseFilter !== 'all') && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCourseFilter('all');
                }}
                className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}




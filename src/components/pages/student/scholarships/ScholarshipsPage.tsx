/**
 * Student Scholarships Page
 * Apply for and track scholarship applications
 * Available only for Full Career Bootcamp students
 * 3-stage workflow: Mentor Review → Admin Review → Scholarship Portal Review
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { ProgressBar } from '@/components/common/ui/ProgressBar';
import { Modal } from '@/components/common/ui/Modal';
import { AccessControl } from '@/components/common/features/AccessControl';
import { useAppSelector } from '@/hooks';
import { ScholarshipApplication, ScholarshipApplicationStatus } from '@/types/student';
import { Course } from '@/interfaces/course';
import { Course as CourseData } from '@/data/mock/coursesData';

export function StudentScholarshipsPage() {
  const { enrolledCourses, courses } = useAppSelector(state => state.courses);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // Convert Enrollment[] to Course[] by mapping enrolled course IDs to full Course objects
  // Convert coursesData Course to interfaces/course Course format
  const enrolledCoursesAsCourses: Course[] = enrolledCourses
    .map(enrollment => courses.find(c => c.id === enrollment.courseId))
    .filter((course): course is CourseData => course !== undefined)
    .map(course => ({
      ...course,
      courseType: course.courseCategory === 'bootcamp' ? 'bootcamp' : (course.courseCategory === 'crash' ? 'crash' : 'skill-focused') as 'crash' | 'skill-focused' | 'bootcamp',
      courseCategory: course.courseCategory === 'bootcamp' ? 'bootcamp' : (course.courseCategory === 'crash' ? 'crash' : 'skill-focused') as 'crash' | 'skill-focused' | 'bootcamp',
      deliveryMethod: course.courseType === 'live' ? 'live' : 'recorded' as 'live' | 'recorded' | 'mixed',
      isFree: course.price === 0,
      hasHackathons: course.courseCategory === 'bootcamp' || false,
      hasScholarships: course.scholarshipAvailable || false,
      hasAIInterview: course.courseCategory === 'bootcamp' || false,
      hasManualInterview: course.courseCategory === 'bootcamp' || false,
    } as unknown as Course));

  // Mock data - replace with API call
  useEffect(() => {
    const mockApplications: ScholarshipApplication[] = [
      {
        id: '1',
        studentId: 'student-1',
        scholarshipId: 'scholarship-1',
        courseId: 'course-1',
        submittedAt: new Date().toISOString(),
        status: 'mentor-approved',
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St',
        },
        academicRecords: [],
        financialDocuments: [],
        personalStatement: '',
        references: [],
        reviewHistory: [
          {
            stage: 'mentor',
            reviewerId: 'mentor-1',
            reviewerName: 'Dr. Smith',
            action: 'approve',
            reviewedAt: new Date().toISOString(),
          },
        ],
      },
    ];
    setApplications(mockApplications);
  }, []);

  const getStatusBadge = (status: ScholarshipApplicationStatus) => {
    const statusConfig = {
      'pending-mentor-review': { variant: 'warning' as const, label: 'Pending Mentor Review' },
      'mentor-approved': { variant: 'default' as const, label: 'Mentor Approved' },
      'mentor-rejected': { variant: 'error' as const, label: 'Mentor Rejected' },
      'admin-review': { variant: 'warning' as const, label: 'Admin Review' },
      'admin-approved': { variant: 'default' as const, label: 'Admin Approved' },
      'admin-rejected': { variant: 'error' as const, label: 'Admin Rejected' },
      'scholarship-portal-review': { variant: 'warning' as const, label: 'Final Review' },
      'approved': { variant: 'success' as const, label: 'Approved' },
      'rejected': { variant: 'error' as const, label: 'Rejected' },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getWorkflowStage = (status: ScholarshipApplicationStatus): number => {
    if (status.includes('mentor')) return 1;
    if (status.includes('admin')) return 2;
    if (status.includes('scholarship-portal') || status === 'approved' || status === 'rejected') return 3;
    return 0;
  };

  const bootcampCourses = enrolledCoursesAsCourses.filter(
    c => c.courseCategory === 'bootcamp'
  );

  return (
    <AccessControl
      enrolledCourses={enrolledCoursesAsCourses}
      requiredFeature="scholarships"
      fallback={
        <div className="p-8 text-center">
          <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Scholarships Feature Unavailable
          </h2>
          <p className="text-muted-foreground mb-4">
            This feature is only available for Full Career Bootcamp students.
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scholarships</h1>
            <p className="text-gray-600 mt-1">
              Apply for financial aid and track your applications
            </p>
          </div>
          {bootcampCourses.length > 0 && (
            <Button
              variant="primary"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => setShowApplicationForm(true)}
            >
              New Application
            </Button>
          )}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map(application => {
            const stage = getWorkflowStage(application.status);
            return (
              <Card key={application.id} variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Scholarship Application</CardTitle>
                      <CardDescription>
                        Submitted on{' '}
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Workflow Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Application Progress
                      </span>
                      <span className="text-sm text-gray-600">
                        Stage {stage} of 3
                      </span>
                    </div>
                    <ProgressBar
                      value={(stage / 3) * 100}
                      variant="primary"
                      showLabel={false}
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>Mentor Review</span>
                      <span>Admin Review</span>
                      <span>Scholarship Portal</span>
                    </div>
                  </div>

                  {/* Review History */}
                  {application.reviewHistory.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Review History
                      </h4>
                      {application.reviewHistory.map((review, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          {review.action === 'approve' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {review.reviewerName} ({review.stage})
                            </p>
                            <p className="text-xs text-gray-600">
                              {review.action === 'approve' ? 'Approved' : 'Rejected'} on{' '}
                              {new Date(review.reviewedAt).toLocaleDateString()}
                            </p>
                            {review.feedback && (
                              <p className="text-sm text-gray-700 mt-1">
                                {review.feedback}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {applications.length === 0 && (
          <Card variant="flat">
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Applications Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Apply for scholarships to get financial aid for your bootcamp courses
              </p>
              <Button
                variant="primary"
                onClick={() => setShowApplicationForm(true)}
              >
                Start Application
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Application Form Modal */}
        <Modal
          isOpen={showApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          title="New Scholarship Application"
          description="Complete all required information to apply for a scholarship"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a bootcamp course</option>
                {bootcampCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Statement
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Explain why you need this scholarship..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop files or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Academic records, financial documents, etc.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowApplicationForm(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}>
                Submit Application
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AccessControl>
  );
}


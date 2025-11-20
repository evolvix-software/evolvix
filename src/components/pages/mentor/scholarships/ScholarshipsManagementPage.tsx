/**
 * Mentor Scholarships Management Page
 * Review scholarship applications and forward to admin
 * Available only for Full Career Bootcamp mentors
 * 3-stage workflow: Mentor Review → Admin Review → Scholarship Portal Review
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  FileText,
  User,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { ProgressBar } from '@/components/common/ui/ProgressBar';
import { Modal } from '@/components/common/ui/Modal';
import { useAppSelector } from '@/hooks';
import { ScholarshipApplication, ScholarshipApplicationStatus } from '@/types/student';
import { ScholarshipReview } from '@/interfaces/mentor';

export function MentorScholarshipsManagementPage() {
  const { courses } = useAppSelector(state => state.courses);
  const [mentorId, setMentorId] = useState<string>('');
  const [mentorName, setMentorName] = useState<string>('Mentor');
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject' | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Get mentor ID and name from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || '');
      setMentorName(parsedData.fullName || 'Mentor');
    }
  }, []);

  // Check if mentor has bootcamp courses
  const hasBootcampAccess = courses.some(
    course => course.instructor.id === mentorId && course.courseCategory === 'bootcamp'
  );

  useEffect(() => {
    // Mock data - replace with API call
    const mockApplications: ScholarshipApplication[] = [
      {
        id: '1',
        studentId: 'student-1',
        scholarshipId: 'scholarship-1',
        courseId: 'course-1',
        submittedAt: new Date().toISOString(),
        status: 'pending-mentor-review',
        personalInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St',
        },
        academicRecords: [],
        financialDocuments: [],
        personalStatement: 'I am passionate about learning and need financial assistance...',
        references: [],
        reviewHistory: [],
      },
    ];
    setApplications(mockApplications);
  }, []);

  if (!hasBootcampAccess) {
    return (
      <div className="p-8 text-center">
        <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Scholarships Management Unavailable
        </h2>
        <p className="text-gray-600 mb-4">
          This feature is only available for Full Career Bootcamp mentors.
        </p>
        <Button variant="primary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: ScholarshipApplicationStatus) => {
    const statusConfig = {
      'pending-mentor-review': { variant: 'warning' as const, label: 'Pending Review' },
      'mentor-approved': { variant: 'success' as const, label: 'Approved' },
      'mentor-rejected': { variant: 'error' as const, label: 'Rejected' },
      'admin-review': { variant: 'info' as const, label: 'Admin Review' },
      'admin-approved': { variant: 'success' as const, label: 'Admin Approved' },
      'admin-rejected': { variant: 'error' as const, label: 'Admin Rejected' },
      'scholarship-portal-review': { variant: 'info' as const, label: 'Final Review' },
      'approved': { variant: 'success' as const, label: 'Approved' },
      'rejected': { variant: 'error' as const, label: 'Rejected' },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const pendingApplications = applications.filter(
    app => app.status === 'pending-mentor-review'
  );
  const reviewedApplications = applications.filter(
    app => app.status !== 'pending-mentor-review'
  );

  const handleReview = (application: ScholarshipApplication) => {
    setSelectedApplication(application);
    setShowReviewModal(true);
  };

  const submitReview = () => {
    if (!selectedApplication || !reviewDecision) return;

    const review: ScholarshipReview = {
      applicationId: selectedApplication.id,
      mentorId: mentorId || '',
      reviewedAt: new Date().toISOString(),
      decision: reviewDecision,
      feedback: reviewFeedback,
      studentCapabilityAssessment: {
        courseProgress: 75,
        assignmentScores: [85, 90, 88],
        testScores: [82, 87],
        engagementScore: 90,
        commitmentLevel: 'high',
        potential: 'high',
      },
    };

    // Update application status
    const updatedApplications: ScholarshipApplication[] = applications.map(app =>
      app.id === selectedApplication.id
        ? {
            ...app,
            status: (
              reviewDecision === 'approve'
                ? 'mentor-approved'
                : 'mentor-rejected'
            ) as ScholarshipApplicationStatus,
            reviewHistory: [
              ...app.reviewHistory,
              {
                stage: 'mentor' as const,
                reviewerId: mentorId || '',
                reviewerName: mentorName,
                action: reviewDecision,
                feedback: reviewFeedback,
                reviewedAt: review.reviewedAt,
              },
            ],
          }
        : app
    );

    setApplications(updatedApplications);
    setShowReviewModal(false);
    setSelectedApplication(null);
    setReviewDecision(null);
    setReviewFeedback('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Scholarships Management
          </h1>
          <p className="text-gray-600 mt-1">
            Review scholarship applications and forward to admin
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingApplications.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter(a => a.status.includes('approved')).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter(a => a.status.includes('rejected')).length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      {pendingApplications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Review ({pendingApplications.length})
          </h2>
          <div className="space-y-4">
            {pendingApplications.map(application => (
              <Card key={application.id} variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {application.personalInfo.name}
                      </CardTitle>
                      <CardDescription>
                        Submitted on{' '}
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Personal Statement
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {application.personalStatement}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={() => handleReview(application)}
                      >
                        Review Application
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // View full application
                          setSelectedApplication(application);
                          setShowReviewModal(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Applications */}
      {reviewedApplications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Reviewed Applications
          </h2>
          <div className="space-y-4">
            {reviewedApplications.map(application => (
              <Card key={application.id} variant="outlined">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {application.personalInfo.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {application.reviewHistory[0]?.reviewedAt &&
                          `Reviewed on ${new Date(
                            application.reviewHistory[0].reviewedAt
                          ).toLocaleDateString()}`}
                      </p>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <Card variant="flat">
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600">
              Scholarship applications from students will appear here
            </p>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      {selectedApplication && (
        <Modal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedApplication(null);
            setReviewDecision(null);
            setReviewFeedback('');
          }}
          title="Review Scholarship Application"
          description={`Review application from ${selectedApplication.personalInfo.name}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Student Info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Student Information
              </h4>
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span>{' '}
                  {selectedApplication.personalInfo.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{' '}
                  {selectedApplication.personalInfo.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{' '}
                  {selectedApplication.personalInfo.phone}
                </p>
              </div>
            </div>

            {/* Personal Statement */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Personal Statement
              </h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {selectedApplication.personalStatement}
                </p>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Documents
              </h4>
              <div className="space-y-2">
                {selectedApplication.academicRecords.length > 0 ? (
                  selectedApplication.academicRecords.map(record => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{record.type}</span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No documents uploaded</p>
                )}
              </div>
            </div>

            {/* Review Decision */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Your Decision
              </h4>
              <div className="flex gap-3 mb-4">
                <Button
                  variant={reviewDecision === 'approve' ? 'primary' : 'outline'}
                  onClick={() => setReviewDecision('approve')}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Approve
                </Button>
                <Button
                  variant={reviewDecision === 'reject' ? 'danger' : 'outline'}
                  onClick={() => setReviewDecision('reject')}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Reject
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  rows={4}
                  value={reviewFeedback}
                  onChange={e => setReviewFeedback(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add your feedback or notes..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedApplication(null);
                  setReviewDecision(null);
                  setReviewFeedback('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={submitReview}
                disabled={!reviewDecision}
                leftIcon={<Send className="w-4 h-4" />}
              >
                {reviewDecision === 'approve'
                  ? 'Approve & Forward to Admin'
                  : 'Reject Application'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}



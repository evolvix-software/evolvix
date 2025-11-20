"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Course } from '@/data/mock/coursesData';
import { Send, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import { useAppDispatch } from '@/hooks';
import { updateCourse } from '@/store/features/courses/coursesSlice';

interface CourseSubmissionProps {
  course: Course;
  onSubmitted?: () => void;
}

export function CourseSubmission({ course, onSubmitted }: CourseSubmissionProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit this course for admin verification? You won\'t be able to edit it until admin reviews it.')) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update course status to pending-verification
    dispatch(updateCourse({
      id: course.id,
      courseStatus: 'pending-verification',
    }));

    setIsSubmitting(false);
    if (onSubmitted) {
      onSubmitted();
    }
  };

  const getStatusInfo = () => {
    switch (course.courseStatus) {
      case 'draft':
        return {
          icon: FileText,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          text: 'Draft',
          description: 'Course is in draft mode. Submit for admin verification when ready.',
        };
      case 'pending-verification':
        return {
          icon: Clock,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'Pending Verification',
          description: 'Course is under admin review. You will be notified once verified.',
        };
      case 'verified':
        return {
          icon: CheckCircle2,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'Verified',
          description: 'Course has been verified. Waiting for contract and pricing.',
        };
      case 'published':
        return {
          icon: CheckCircle2,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          text: 'Published',
          description: 'Course is live and visible to students.',
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          text: 'Rejected',
          description: course.adminNotes || 'Course was rejected. Please review admin notes and resubmit.',
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();

  if (!course.isBundleCourse) {
    return null; // Only show for bundle courses
  }

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Course Submission</span>
        </CardTitle>
        <CardDescription>Submit your course for admin verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {statusInfo && (
          <div className={`p-4 rounded-lg ${statusInfo.bgColor}`}>
            <div className="flex items-center space-x-2 mb-2">
              <statusInfo.icon className={`w-5 h-5 ${statusInfo.color}`} />
              <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
            </div>
            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
            {course.adminNotes && course.courseStatus === 'rejected' && (
              <div className="mt-3 p-3 bg-background rounded border border-border">
                <p className="text-sm font-medium text-foreground mb-1">Admin Notes:</p>
                <p className="text-sm text-muted-foreground">{course.adminNotes}</p>
              </div>
            )}
          </div>
        )}

        {course.courseStatus === 'draft' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Before submitting, make sure your course is complete with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>All modules and lessons</li>
              <li>Course description and requirements</li>
              <li>Projects (if applicable)</li>
              <li>Course images</li>
            </ul>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-card mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Verification
                </>
              )}
            </Button>
          </div>
        )}

        {course.courseStatus === 'verified' && course.contractDocument && (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Contract Ready</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Admin has set the course pricing and sent you a contract. Please review and sign to proceed.
              </p>
              {course.commissionSplit && (
                <div className="mb-3 p-3 bg-background rounded">
                  <p className="text-sm font-medium text-foreground mb-1">Commission Split:</p>
                  <p className="text-sm text-muted-foreground">
                    Evolvix: {course.commissionSplit.evolvix}% | Mentor: {course.commissionSplit.mentor}%
                  </p>
                  {course.adminPricing && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Course Price: ${course.adminPricing.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(course.contractDocument, '_blank')}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Contract
                </Button>
                {!course.mentorSigned && (
                  <Button
                    onClick={() => {
                      if (confirm('By clicking this, you agree to sign the contract and accept the commission split.')) {
                        dispatch(updateCourse({
                          id: course.id,
                          mentorSigned: true,
                          mentorSignedAt: new Date().toISOString(),
                        }));
                      }
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Sign Contract
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {course.mentorSigned && course.courseStatus === 'verified' && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-800 dark:text-green-200">Contract Signed</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your contract has been signed. Waiting for admin approval to publish the course.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


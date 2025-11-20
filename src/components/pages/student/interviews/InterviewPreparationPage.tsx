/**
 * Interview Preparation Page (Manual Interview Training)
 * Access manual interview training conducted by specialized interview mentors
 * Available only for Full Career Bootcamp students
 * Optional Feature: Students can purchase or skip
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Play,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { ProgressBar } from '@/components/common/ui/ProgressBar';
import { Modal } from '@/components/common/ui/Modal';
import { useAppSelector } from '@/hooks';
import { InterviewTrainingEnrollment, InterviewRound } from '@/types/student';
import { Course } from '@/data/mock/coursesData';

export function InterviewPreparationPage() {
  const { courses, enrolledCourses } = useAppSelector(state => state.courses);
  const [enrollment, setEnrollment] = useState<InterviewTrainingEnrollment | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState<InterviewRound | null>(null);

  // Mock data - replace with API call
  useEffect(() => {
    // Check if student has enrolled in interview training
    const mockEnrollment: InterviewTrainingEnrollment | null = null; // Set to null to show purchase option
    setEnrollment(mockEnrollment);
  }, []);

  const interviewRounds = [
    {
      id: 'round-1',
      roundNumber: 1,
      mentorId: 'mentor-1',
      mentorName: 'Sarah Johnson',
      type: 'technical',
      scheduledAt: '2024-02-15T10:00:00Z',
      completedAt: undefined,
      feedback: undefined,
    },
    {
      id: 'round-2',
      roundNumber: 2,
      mentorId: 'mentor-2',
      mentorName: 'Michael Chen',
      type: 'hr',
      scheduledAt: undefined,
      completedAt: undefined,
      feedback: undefined,
    },
    {
      id: 'round-3',
      roundNumber: 3,
      mentorId: 'mentor-3',
      mentorName: 'Emily Rodriguez',
      type: 'behavioral',
      scheduledAt: undefined,
      completedAt: undefined,
      feedback: undefined,
    },
  ] as InterviewRound[];

  // Get enrolled courses with full course data and filter for bootcamp courses
  const bootcampCourses = enrolledCourses
    .map(enrollment => courses.find(c => c.id === enrollment.courseId))
    .filter((course): course is Course => course !== undefined && course.courseCategory === 'bootcamp');

  if (!enrollment) {
    return (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Preparation</h1>
            <p className="text-gray-600 mt-1">
              Manual interview training conducted by specialized interview mentors
            </p>
          </div>

          {/* Purchase Option */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Interview Training Course</CardTitle>
              <CardDescription>
                Get personalized interview training from salary-paid specialized mentors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">
                        Multiple interview rounds with different specialized mentors
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">
                        Technical, HR, and Behavioral interview training
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">
                        Personalized feedback and improvement suggestions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">
                        Mock interview sessions with real-time feedback
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {interviewRounds.map(round => (
                    <Card key={round.id} variant="outlined">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Badge variant="primary" className="mb-2">
                            Round {round.roundNumber}
                          </Badge>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {round.type.charAt(0).toUpperCase() + round.type.slice(1)}
                          </h4>
                          <p className="text-sm text-gray-600">{round.mentorName}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Course Price</p>
                    <p className="text-2xl font-bold text-blue-600">$299</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Skip option
                        console.log('Skipped interview training');
                      }}
                    >
                      Skip
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setShowPurchaseModal(true)}
                      leftIcon={<DollarSign className="w-4 h-4" />}
                    >
                      Purchase Course
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Modal */}
          <Modal
            isOpen={showPurchaseModal}
            onClose={() => setShowPurchaseModal(false)}
            title="Purchase Interview Training Course"
            description="Complete your purchase to start interview training"
          >
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Course Details</p>
                <p className="font-semibold text-gray-900">Interview Training Course</p>
                <p className="text-sm text-gray-600">
                  3 rounds with specialized mentors
                </p>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">$299</span>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPurchaseModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary">Complete Purchase</Button>
              </div>
            </div>
          </Modal>
        </div>
    );
  }

  // Enrolled view
  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Preparation</h1>
          <p className="text-gray-600 mt-1">
            Track your interview training progress
          </p>
        </div>

        {/* Progress Overview */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressBar
                value={enrollment.progress || 0}
                variant="primary"
                showLabel
                label="Overall Progress"
              />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {interviewRounds.filter(r => r.completedAt).length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {interviewRounds.filter(r => r.scheduledAt && !r.completedAt).length}
                  </p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-400">
                    {interviewRounds.filter(r => !r.scheduledAt).length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Rounds */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Interview Rounds
          </h2>
          <div className="space-y-4">
            {interviewRounds.map(round => (
              <Card
                key={round.id}
                variant="elevated"
                hover
                clickable
                onClick={() => setSelectedRound(round)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {round.roundNumber}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Round {round.roundNumber}:{' '}
                          {round.type.charAt(0).toUpperCase() + round.type.slice(1)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Mentor: {round.mentorName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {round.completedAt ? (
                        <Badge variant="success">Completed</Badge>
                      ) : round.scheduledAt ? (
                        <Badge variant="warning">Scheduled</Badge>
                      ) : (
                        <Badge variant="default">Pending</Badge>
                      )}
                      {round.scheduledAt && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(round.scheduledAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Round Detail Modal */}
        {selectedRound && (
          <Modal
            isOpen={!!selectedRound}
            onClose={() => setSelectedRound(null)}
            title={`Round ${selectedRound.roundNumber}: ${selectedRound.type}`}
            size="lg"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mentor</p>
                <p className="font-semibold text-gray-900">
                  {selectedRound.mentorName}
                </p>
              </div>
              {selectedRound.scheduledAt && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Scheduled</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedRound.scheduledAt).toLocaleString()}
                  </p>
                </div>
              )}
              {selectedRound.feedback && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Scores
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Technical Skills</p>
                        <ProgressBar
                          value={selectedRound.feedback.technicalSkills}
                          variant="primary"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Communication</p>
                        <ProgressBar
                          value={selectedRound.feedback.communicationSkills}
                          variant="success"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Problem Solving</p>
                        <ProgressBar
                          value={selectedRound.feedback.problemSolving}
                          variant="primary"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Overall</p>
                        <ProgressBar
                          value={selectedRound.feedback.overallAssessment}
                          variant="primary"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Feedback
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedRound.feedback.detailedFeedback}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Recommendations
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {selectedRound.feedback.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {!selectedRound.scheduledAt && (
                <Button variant="primary" fullWidth>
                  Schedule Interview
                </Button>
              )}
            </div>
          </Modal>
        )}
      </div>
  );
}


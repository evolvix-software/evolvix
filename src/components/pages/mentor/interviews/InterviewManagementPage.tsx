/**
 * Mentor Interview Management Page
 * View AI interview results and manage interview training course
 * Available only for Full Career Bootcamp mentors
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  UserCheck,
  Eye,
  TrendingUp,
  BarChart3,
  Users,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { ProgressBar } from '@/components/common/ui/ProgressBar';
import { Modal } from '@/components/common/ui/Modal';
import { useAppSelector } from '@/hooks';
import { AIInterviewResult, InterviewTrainingCoordination } from '@/interfaces/mentor';

export function MentorInterviewManagementPage() {
  const { courses } = useAppSelector(state => state.courses);
  const [mentorId, setMentorId] = useState<string>('');
  const [aiInterviewResults, setAIInterviewResults] = useState<AIInterviewResult[]>([]);
  const [trainingCoordination, setTrainingCoordination] = useState<
    InterviewTrainingCoordination[]
  >([]);
  const [selectedResult, setSelectedResult] = useState<AIInterviewResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai-results' | 'training'>('ai-results');

  // Get mentor ID from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || '');
    }
  }, []);

  // Check if mentor has bootcamp courses
  const hasBootcampAccess = courses.some(
    course => course.instructor.id === mentorId && course.courseCategory === 'bootcamp'
  );

  useEffect(() => {
    // Mock data - replace with API call
    const mockAIResults: AIInterviewResult[] = [
      {
        interviewId: '1',
        studentId: 'student-1',
        studentName: 'John Doe',
        category: 'full-stack-development',
        type: 'coding',
        completedAt: new Date().toISOString(),
        score: 85,
        usageType: 'free',
        feedback: {
          strengths: ['Strong problem-solving skills', 'Good code structure'],
          weaknesses: ['Could improve time management'],
          suggestions: ['Practice more timed coding challenges'],
          scoreBreakdown: {
            technical: 88,
            communication: 82,
            problemSolving: 85,
            overall: 85,
          },
          categorySpecificFeedback: 'Good understanding of React and Node.js.',
        },
      },
    ];
    setAIInterviewResults(mockAIResults);

    const mockTraining: InterviewTrainingCoordination[] = [
      {
        studentId: 'student-1',
        studentName: 'John Doe',
        enrolledInTraining: true,
        trainingCourseId: 'training-1',
        progress: 60,
        needsAssessment: 'Needs more practice with system design',
        recommendations: [
          'Schedule Round 2 interview',
          'Focus on behavioral questions',
        ],
      },
    ];
    setTrainingCoordination(mockTraining);
  }, []);

  if (!hasBootcampAccess) {
    return (
      <div className="p-8 text-center">
        <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Interview Management Unavailable
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

  const averageScore =
    aiInterviewResults.length > 0
      ? Math.round(
          aiInterviewResults.reduce((sum, r) => sum + r.score, 0) /
            aiInterviewResults.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600 mt-1">
            View AI interview results and manage interview training
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('ai-results')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ai-results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            AI Mock Interview Results
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'training'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Interview Training Coordination
          </button>
        </nav>
      </div>

      {/* AI Interview Results Tab */}
      {activeTab === 'ai-results' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Interviews</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {aiInterviewResults.length}
                    </p>
                  </div>
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-green-600">{averageScore}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Free Usage</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {aiInterviewResults.filter(r => r.usageType === 'free').length}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Paid Usage</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {aiInterviewResults.filter(r => r.usageType === 'paid').length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Results List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interview Results
            </h2>
            <div className="space-y-4">
              {aiInterviewResults.map(result => (
                <Card key={result.interviewId} variant="elevated" hover clickable>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {result.studentName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {result.category
                              .split('-')
                              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(' ')}{' '}
                            - {result.type === 'coding' ? 'Coding' : 'HR'} Interview
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant="primary" size="lg">
                            {result.score}%
                          </Badge>
                          {result.usageType === 'free' && (
                            <Badge variant="success" size="sm" className="mt-1">
                              Free
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedResult(result);
                            setShowResultModal(true);
                          }}
                          leftIcon={<Eye className="w-4 h-4" />}
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

          {aiInterviewResults.length === 0 && (
            <Card variant="flat">
              <CardContent className="p-12 text-center">
                <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Interview Results Yet
                </h3>
                <p className="text-gray-600">
                  AI interview results from students will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Interview Training Coordination Tab */}
      {activeTab === 'training' && (
        <>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Training Coordination
            </h2>
            <div className="space-y-4">
              {trainingCoordination.map(coordination => (
                <Card key={coordination.studentId} variant="elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{coordination.studentName}</CardTitle>
                      {coordination.enrolledInTraining ? (
                        <Badge variant="success">Enrolled</Badge>
                      ) : (
                        <Badge variant="default">Not Enrolled</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {coordination.progress !== undefined && (
                        <div>
                          <ProgressBar
                            value={coordination.progress}
                            variant="primary"
                            showLabel
                            label="Training Progress"
                          />
                        </div>
                      )}
                      {coordination.needsAssessment && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Needs Assessment
                          </p>
                          <p className="text-sm text-gray-600">
                            {coordination.needsAssessment}
                          </p>
                        </div>
                      )}
                      {coordination.recommendations && coordination.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Recommendations
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {coordination.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                          Contact Student
                        </Button>
                        <Button variant="primary" size="sm" leftIcon={<UserCheck className="w-4 h-4" />}>
                          Coordinate Training
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {trainingCoordination.length === 0 && (
            <Card variant="flat">
              <CardContent className="p-12 text-center">
                <UserCheck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Training Coordination Yet
                </h3>
                <p className="text-gray-600">
                  Students enrolled in interview training will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Result Detail Modal */}
      {selectedResult && (
        <Modal
          isOpen={showResultModal}
          onClose={() => {
            setShowResultModal(false);
            setSelectedResult(null);
          }}
          title={`Interview Result - ${selectedResult.studentName}`}
          description={`${selectedResult.category} - ${selectedResult.type} Interview`}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall Score</p>
              <div className="flex items-center gap-3">
                <Badge variant="primary" size="lg">
                  {selectedResult.score}%
                </Badge>
                <Badge variant={selectedResult.usageType === 'free' ? 'success' : 'default'}>
                  {selectedResult.usageType === 'free' ? 'Free Usage' : 'Paid Usage'}
                </Badge>
              </div>
            </div>

            {selectedResult.feedback && (
              <>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Score Breakdown
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Technical</p>
                      <ProgressBar
                        value={selectedResult.feedback.scoreBreakdown.technical}
                        variant="primary"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Communication</p>
                      <ProgressBar
                        value={selectedResult.feedback.scoreBreakdown.communication}
                        variant="success"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Problem Solving</p>
                      <ProgressBar
                        value={selectedResult.feedback.scoreBreakdown.problemSolving}
                        variant="primary"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Overall</p>
                      <ProgressBar
                        value={selectedResult.feedback.scoreBreakdown.overall}
                        variant="primary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Strengths</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {selectedResult.feedback.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Areas for Improvement
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {selectedResult.feedback.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Suggestions
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {selectedResult.feedback.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>

                {selectedResult.feedback.categorySpecificFeedback && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Category-Specific Feedback
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedResult.feedback.categorySpecificFeedback}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  setShowResultModal(false);
                  setSelectedResult(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}



/**
 * AI Mock Interview Page
 * Pre-built AI interview simulation for all IT categories
 * Available only for Full Career Bootcamp students
 * Optional feature: Students can purchase or skip
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Play, Clock, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { ProgressBar } from '@/components/common/ui/ProgressBar';
import { Modal } from '@/components/common/ui/Modal';
import { useAppSelector } from '@/hooks';
import { AIMockInterview } from '@/types/student';

export function AIMockInterviewPage() {
  const [interviews, setInterviews] = useState<AIMockInterview[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [freeUsageRemaining, setFreeUsageRemaining] = useState(3); // Mock: 3 free interviews per month

  // Mock data - replace with API call
  useEffect(() => {
    const mockInterviews: AIMockInterview[] = [
      {
        id: '1',
        studentId: 'student-1',
        category: 'full-stack-development',
        type: 'coding',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        score: 85,
        isFreeUsage: true,
        feedback: {
          strengths: ['Strong problem-solving skills', 'Good code structure'],
          weaknesses: ['Could improve time management', 'Needs more edge case handling'],
          suggestions: ['Practice more timed coding challenges', 'Review system design basics'],
          scoreBreakdown: {
            technical: 88,
            communication: 82,
            problemSolving: 85,
            overall: 85,
          },
          categorySpecificFeedback: 'Good understanding of React and Node.js concepts.',
        },
      },
    ];
    setInterviews(mockInterviews);
  }, []);

  const categories = [
    'full-stack-development',
    'data-science',
    'cybersecurity',
    'ai-ml',
    'devops',
    'mobile-development',
  ];

  const canStartInterview = freeUsageRemaining > 0;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Mock Interview</h1>
            <p className="text-gray-600 mt-1">
              Practice interviews with AI-powered simulations
            </p>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Free Interviews</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {freeUsageRemaining}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {interviews.length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {interviews.length > 0
                      ? Math.round(
                          interviews.reduce((sum, i) => sum + (i.score || 0), 0) /
                            interviews.length
                        )
                      : 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start Interview Section */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Start New Interview</CardTitle>
            <CardDescription>
              Choose a category and interview type to begin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat
                        .split('-')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  leftIcon={<Play className="w-5 h-5" />}
                  disabled={!canStartInterview}
                  onClick={() => {
                    if (!canStartInterview) {
                      setShowPurchaseModal(true);
                    } else {
                      // Start interview
                      console.log('Starting coding interview...');
                    }
                  }}
                >
                  Coding Interview
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  leftIcon={<Play className="w-5 h-5" />}
                  disabled={!canStartInterview}
                  onClick={() => {
                    if (!canStartInterview) {
                      setShowPurchaseModal(true);
                    } else {
                      // Start HR interview
                      console.log('Starting HR interview...');
                    }
                  }}
                >
                  HR Interview
                </Button>
              </div>
              {!canStartInterview && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    You've used all free interviews. Purchase more to continue practicing.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interview History */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Interview History
          </h2>
          <div className="space-y-4">
            {interviews.map(interview => (
              <Card key={interview.id} variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {interview.category
                          .split('-')
                          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')}{' '}
                        - {interview.type === 'coding' ? 'Coding' : 'HR'} Interview
                      </CardTitle>
                      <CardDescription>
                        Completed on{' '}
                        {interview.completedAt &&
                          new Date(interview.completedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {interview.isFreeUsage && (
                        <Badge variant="success" size="sm">
                          Free
                        </Badge>
                      )}
                      <Badge variant="primary" size="lg">
                        {interview.score}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                {interview.feedback && (
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Score Breakdown
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Technical</p>
                            <ProgressBar
                              value={interview.feedback.scoreBreakdown.technical}
                              variant="primary"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Communication</p>
                            <ProgressBar
                              value={interview.feedback.scoreBreakdown.communication}
                              variant="success"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Problem Solving</p>
                            <ProgressBar
                              value={interview.feedback.scoreBreakdown.problemSolving}
                              variant="primary"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Overall</p>
                            <ProgressBar
                              value={interview.feedback.scoreBreakdown.overall}
                              variant="primary"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Strengths
                        </h4>
                        <ul className="list-disc list-inside text-sm text-foreground/90">
                          {interview.feedback.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Areas for Improvement
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {interview.feedback.weaknesses.map((weakness, idx) => (
                            <li key={idx}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {interviews.length === 0 && (
          <Card variant="flat">
            <CardContent className="p-12 text-center">
              <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Interviews Yet
              </h3>
              <p className="text-gray-600">
                Start your first AI mock interview to practice and improve
              </p>
            </CardContent>
          </Card>
        )}

        {/* Purchase Modal */}
        <Modal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          title="Purchase Interview Credits"
          description="Buy additional interview attempts"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                You've used all free interviews. Purchase more to continue practicing.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">5 Interviews</p>
                  <p className="text-sm text-gray-600">$9.99</p>
                </div>
                <Button variant="primary">Select</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">10 Interviews</p>
                  <p className="text-sm text-gray-600">$17.99</p>
                </div>
                <Button variant="primary">Select</Button>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPurchaseModal(false)}
              >
                Skip
              </Button>
            </div>
          </div>
        </Modal>
      </div>
  );
}


"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadAssignment, StudentSubmissions, GradeAssignment } from './components';
import { Assignment, AssignmentSubmission } from '@/interfaces/assignments';
import { mockAssignments, mockSubmissions } from '@/data/mock/assignments';
import { useSearchParams } from 'next/navigation';
import { FileText, Upload, Users, CheckCircle2 } from 'lucide-react';

export function MentorAssignmentsPage() {
  const searchParams = useSearchParams();
  const studentIdParam = searchParams.get('studentId');
  const projectNumberParam = searchParams.get('projectNumber');

  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(mockSubmissions);
  const [activeTab, setActiveTab] = useState('submissions');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [showGradeModal, setShowGradeModal] = useState(false);

  // Filter submissions based on URL params
  const filteredSubmissions = useMemo(() => {
    let filtered = submissions;

    if (studentIdParam) {
      filtered = filtered.filter(sub => sub.studentId === studentIdParam);
    }

    if (projectNumberParam) {
      filtered = filtered.filter(sub => {
        const assignment = assignments.find(a => a.id === sub.assignmentId);
        return assignment?.projectNumber === parseInt(projectNumberParam);
      });
    }

    return filtered;
  }, [submissions, assignments, studentIdParam, projectNumberParam]);

  // Auto-switch to submissions tab if filtering by student/project
  useEffect(() => {
    if (studentIdParam || projectNumberParam) {
      setActiveTab('submissions');
    }
  }, [studentIdParam, projectNumberParam]);

  const handleCreateAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'createdBy'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign_${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: 'suhxil14@gmail.com' // Current mentor
    };

    setAssignments([...assignments, newAssignment]);
    setShowUploadForm(false);

    // Save to localStorage
    const stored = localStorage.getItem('evolvix_assignments');
    const storedAssignments = stored ? JSON.parse(stored) : [];
    localStorage.setItem('evolvix_assignments', JSON.stringify([...storedAssignments, newAssignment]));
  };

  const handleGrade = (submissionId: string, score: number, feedback: string) => {
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === submissionId) {
        const updated: AssignmentSubmission = {
          ...sub,
          score,
          feedback,
          status: 'graded',
          gradedAt: new Date().toISOString(),
          gradedBy: 'suhxil14@gmail.com'
        };

        // Create notification for student
        const notification = {
          id: `notif_${Date.now()}`,
          studentId: sub.studentId,
          assignmentId: sub.assignmentId,
          submissionId: sub.id,
          type: 'graded' as const,
          message: `Your assignment has been graded. Score: ${score}/${sub.maxScore}`,
          createdAt: new Date().toISOString(),
          read: false
        };

        // Save notification to localStorage (for student dashboard)
        const storedNotifications = localStorage.getItem('evolvix_notifications');
        const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
        localStorage.setItem('evolvix_notifications', JSON.stringify([...notifications, notification]));

        return updated;
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);
    setShowGradeModal(false);
    setSelectedSubmission(null);

    // Save to localStorage
    localStorage.setItem('evolvix_submissions', JSON.stringify(updatedSubmissions));
  };

  const handleViewDetails = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setShowGradeModal(true);
  };

  const handleGradeClick = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setShowGradeModal(true);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const storedAssignments = localStorage.getItem('evolvix_assignments');
    const storedSubmissions = localStorage.getItem('evolvix_submissions');

    if (storedAssignments) {
      const parsed = JSON.parse(storedAssignments);
      setAssignments([...mockAssignments, ...parsed]);
    }

    if (storedSubmissions) {
      const parsed = JSON.parse(storedSubmissions);
      setSubmissions([...mockSubmissions, ...parsed]);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Assignments Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {studentIdParam || projectNumberParam
              ? `Viewing assignments${studentIdParam ? ' for selected student' : ''}${projectNumberParam ? ` (Project ${projectNumberParam})` : ''}`
              : 'Upload assignments, review submissions, and grade students'}
          </p>
        </div>
        {activeTab === 'upload' && (
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            {showUploadForm ? 'Cancel' : 'New Assignment'}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submissions" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Student Submissions</span>
            {filteredSubmissions.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                {filteredSubmissions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Assignments</span>
          </TabsTrigger>
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="mt-6">
          <StudentSubmissions
            submissions={filteredSubmissions}
            onGrade={handleGradeClick}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="mt-6">
          {showUploadForm ? (
            <UploadAssignment
              onSubmit={handleCreateAssignment}
              onCancel={() => setShowUploadForm(false)}
            />
          ) : (
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardContent className="p-12 text-center">
                <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Create New Assignment
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Upload assignments for your classes or projects. Students will receive notifications when assignments are posted.
                </p>
                <Button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Grade Modal */}
      {showGradeModal && selectedSubmission && (
        <GradeAssignment
          submission={selectedSubmission}
          onClose={() => {
            setShowGradeModal(false);
            setSelectedSubmission(null);
          }}
          onGrade={handleGrade}
        />
      )}
    </div>
  );
}


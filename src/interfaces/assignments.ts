// Types for Assignment Management

export type AssignmentType = 'class' | 'project';
export type SubmissionStatus = 'submitted' | 'late' | 'pending' | 'graded' | 'returned';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: AssignmentType;
  courseId: string;
  courseTitle: string;
  projectId?: string; // If type is 'project'
  projectNumber?: number;
  dueDate: string;
  maxScore: number;
  instructions: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  createdAt: string;
  createdBy: string; // Mentor ID
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  dueDate: string;
  status: SubmissionStatus;
  files: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  githubUrl?: string;
  liveLink?: string;
  notes?: string;
  score?: number;
  maxScore: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
  isLate: boolean;
}

export interface AssignmentNotification {
  id: string;
  studentId: string;
  assignmentId: string;
  submissionId: string;
  type: 'graded' | 'feedback' | 'returned';
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AssignmentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  courseId?: string;
  instructions: string;
  maxScore: number;
  rubric?: Rubric;
  createdBy: string;
  createdAt: string;
  isShared: boolean;
}

export interface Rubric {
  id: string;
  name: string;
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

export interface AssignmentAnalytics {
  assignmentId: string;
  totalStudents: number;
  submittedCount: number;
  submissionRate: number;
  averageScore: number;
  averageTimeToComplete: number; // in hours
  lateSubmissions: number;
  commonMistakes: string[];
  gradeDistribution: { range: string; count: number }[];
}


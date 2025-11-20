/**
 * Student Type Definitions
 */

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  skills: Skill[];
  education?: Education;
  schoolInfo?: SchoolInfo;
  kycStatus?: KYCStatus;
  preferences?: StudentPreferences;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced';
}

export interface Education {
  college?: string;
  degree?: string;
  graduationYear?: number;
  specialization?: string;
  gpa?: number;
}

export interface SchoolInfo {
  enabled: boolean;
  schoolName?: string;
  gradeLevel?: '10th' | '11th' | '12th';
  schoolBoard?: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'IGCSE' | 'Other';
}

export interface KYCStatus {
  status: 'pending' | 'verified' | 'rejected';
  level: number;
  documentUrl?: string;
  submittedDate?: string;
}

export interface StudentPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  types: NotificationType[];
}

export type NotificationType = 
  | 'classes' 
  | 'assignments' 
  | 'feedback' 
  | 'scholarships' 
  | 'hackathons' 
  | 'system';

// Scholarship Application Types
export interface ScholarshipApplication {
  id: string;
  studentId: string;
  scholarshipId: string;
  courseId: string;
  submittedAt: string;
  status: ScholarshipApplicationStatus;
  personalInfo: PersonalInfo;
  academicRecords: AcademicRecord[];
  financialDocuments: FinancialDocument[];
  personalStatement: string;
  references: Reference[];
  reviewHistory: ReviewHistory[];
}

export type ScholarshipApplicationStatus =
  | 'pending-mentor-review'
  | 'mentor-approved'
  | 'mentor-rejected'
  | 'admin-review'
  | 'admin-approved'
  | 'admin-rejected'
  | 'scholarship-portal-review'
  | 'approved'
  | 'rejected';

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface AcademicRecord {
  id: string;
  type: 'transcript' | 'certificate' | 'diploma';
  fileUrl: string;
  uploadedAt: string;
}

export interface FinancialDocument {
  id: string;
  type: 'income-proof' | 'tax-return' | 'bank-statement';
  fileUrl: string;
  uploadedAt: string;
}

export interface Reference {
  id: string;
  name: string;
  email: string;
  relationship: string;
  submitted: boolean;
}

export interface ReviewHistory {
  stage: 'mentor' | 'admin' | 'scholarship-portal';
  reviewerId: string;
  reviewerName: string;
  action: 'approve' | 'reject' | 'request-info';
  feedback?: string;
  reviewedAt: string;
}

// Hackathon Types
export interface HackathonLink {
  id: string;
  title: string;
  url: string;
  type: 'practice-problem' | 'hackathon-event' | 'contest';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sentBy?: string; // Mentor ID
  sentAt?: string;
  completed?: boolean;
  completedAt?: string;
  notes?: string;
}

export interface PracticeTracking {
  problemsCompleted: number;
  timeSpent: number; // in minutes
  skillImprovement: SkillImprovement[];
  externalPlatformProfiles: ExternalPlatformProfile[];
}

export interface SkillImprovement {
  skill: string;
  improvement: number; // percentage
  period: string;
}

export interface ExternalPlatformProfile {
  platform: 'leetcode' | 'hackerrank' | 'codeforces' | 'other';
  profileUrl: string;
  username: string;
}

// Interview Types
export interface AIMockInterview {
  id: string;
  studentId: string;
  category: string; // IT category
  type: 'coding' | 'hr';
  startedAt: string;
  completedAt?: string;
  score?: number;
  feedback?: AIInterviewFeedback;
  isFreeUsage: boolean;
}

export interface AIInterviewFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  scoreBreakdown: ScoreBreakdown;
  categorySpecificFeedback: string;
}

export interface ScoreBreakdown {
  technical: number;
  communication: number;
  problemSolving: number;
  overall: number;
}

export interface InterviewTrainingEnrollment {
  id: string;
  studentId: string;
  courseId: string; // Interview training course ID
  enrolledAt: string;
  rounds: InterviewRound[];
  progress: number;
}

export interface InterviewRound {
  id: string;
  roundNumber: number;
  mentorId: string;
  mentorName: string;
  type: 'technical' | 'hr' | 'behavioral';
  scheduledAt?: string;
  completedAt?: string;
  feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
  technicalSkills: number;
  communicationSkills: number;
  problemSolving: number;
  overallAssessment: number;
  detailedFeedback: string;
  recommendations: string[];
}


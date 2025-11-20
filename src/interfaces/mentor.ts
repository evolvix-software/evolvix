/**
 * Mentor Type Definitions
 */

import { AIInterviewFeedback } from '@/types/student';

export type MentorCompensationType = 'salary' | 'commission';
export type MentorAccountType = 'bootcamp' | 'crash-skill' | 'both';

export interface Mentor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  expertise: string[];
  rating: number;
  reputationScore: number;
  totalStudents: number;
  totalCourses: number;
  compensationType: MentorCompensationType;
  accountType: MentorAccountType;
  hasPremiumFeatures: boolean; // Bootcamp mentors only
  socialLinks?: SocialLinks;
  verified: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  website?: string;
  twitter?: string;
}

// Vacancy Application Types
export interface VacancyApplication {
  id: string;
  mentorId: string;
  vacancyId: string;
  submittedAt: string;
  status: VacancyApplicationStatus;
  qualifications: Qualification[];
  portfolioLink?: string;
  demoClassVideoUrl?: string;
  teachingExperience: TeachingExperience[];
  coverLetter: string;
  adminFeedback?: string;
  reviewedAt?: string;
}

export type VacancyApplicationStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'verified';

export interface Qualification {
  id: string;
  type: 'education' | 'certification' | 'license';
  title: string;
  issuer: string;
  date: string;
  fileUrl?: string;
}

export interface TeachingExperience {
  id: string;
  organization: string;
  position: string;
  duration: string;
  description: string;
}

// Hackathon Management Types
export interface ExternalLink {
  id: string;
  title: string;
  url: string;
  type: 'practice-problem' | 'hackathon-event' | 'contest';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  platform: 'leetcode' | 'hackerrank' | 'codeforces' | 'other';
  tags: string[];
  createdAt: string;
  sentToStudents: string[]; // Student IDs
}

export interface LinkLibrary {
  mentorId: string;
  links: ExternalLink[];
  categories: string[];
}

// Scholarship Review Types
export interface ScholarshipReview {
  applicationId: string;
  mentorId: string;
  reviewedAt: string;
  decision: 'approve' | 'reject' | 'request-info';
  feedback?: string;
  notes?: string; // Private notes
  studentCapabilityAssessment: CapabilityAssessment;
}

export interface CapabilityAssessment {
  courseProgress: number;
  assignmentScores: number[];
  testScores: number[];
  engagementScore: number;
  commitmentLevel: 'high' | 'medium' | 'low';
  potential: 'high' | 'medium' | 'low';
}

// Interview Management Types
export interface AIInterviewResult {
  interviewId: string;
  studentId: string;
  studentName: string;
  category: string;
  type: 'coding' | 'hr';
  completedAt: string;
  score: number;
  feedback: AIInterviewFeedback;
  usageType: 'free' | 'paid';
}

export interface InterviewTrainingCoordination {
  studentId: string;
  studentName: string;
  enrolledInTraining: boolean;
  trainingCourseId?: string;
  progress?: number;
  needsAssessment?: string;
  recommendations?: string[];
}


/**
 * Job Application and Related Interfaces
 */

import { Job } from '@/data/mock/jobsData';

export type ApplicationStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'interview' 
  | 'accepted' 
  | 'rejected'
  | 'withdrawn';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: ApplicationStatus;
  resumeId: string;
  resumeName: string;
  coverLetterId?: string;
  coverLetterContent?: string;
  notes?: string;
  updates: ApplicationUpdate[];
  withdrawnAt?: string;
}

export interface ApplicationUpdate {
  date: string;
  status: ApplicationStatus;
  note?: string;
  updatedBy?: 'company' | 'system' | 'user';
}

export interface Resume {
  id: string;
  name: string;
  fileName: string;
  fileUrl?: string; // For uploaded files
  content?: string; // For text-based resumes
  uploadedAt: string;
  isDefault: boolean;
  lastModified: string;
}

export interface CoverLetter {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  lastModified: string;
  isTemplate: boolean;
}

export interface JobAlert {
  id: string;
  name: string;
  keywords: string[];
  location: string[];
  company: string[];
  experienceLevel: ('entry' | 'mid' | 'senior' | 'executive')[];
  jobType: ('full-time' | 'part-time' | 'contract' | 'freelance' | 'internship')[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  frequency: 'daily' | 'weekly' | 'instant';
  active: boolean;
  matches: string[]; // Job IDs that match this alert
  createdAt: string;
  lastChecked?: string;
}

export interface CompanyPost {
  id: string;
  companyId: string;
  companyName: string;
  content: string;
  postedAt: string;
  likes: string[]; // User IDs
  comments: PostComment[];
  reposts: string[]; // User IDs
  image?: string;
  authorId?: string;
  authorName?: string;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  postedAt: string;
  likes: string[];
  replies?: PostComment[];
}

export interface JobFilters {
  search?: string;
  location?: string[];
  jobType?: ('full-time' | 'part-time' | 'contract' | 'freelance' | 'internship')[];
  company?: string[];
  experienceLevel?: ('entry' | 'mid' | 'senior' | 'executive')[];
  salaryRange?: {
    min: number;
    max: number;
  };
  remote?: boolean;
  datePosted?: 'all' | '24h' | '7d' | '30d';
}

export interface SearchHistory {
  query: string;
  timestamp: string;
  filters?: JobFilters;
  resultsCount?: number;
}

export interface JobRecommendation {
  job: Job;
  reason: string;
  matchScore: number;
}


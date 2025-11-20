/**
 * Course Type Definitions
 * Based on STUDENT_MENTOR_PORTAL_COMPLETE_GUIDE.md
 */

export type CourseType = 'crash' | 'skill-focused' | 'bootcamp';
export type DeliveryMethod = 'live' | 'recorded' | 'mixed';
export type CourseCategory = 
  | 'development' 
  | 'design' 
  | 'business' 
  | 'data-science' 
  | 'other'
  | string; // Allow any category for crash/skill courses
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected';

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  thumbnail: string;
  category: CourseCategory;
  level: CourseLevel;
  skills: string[];
  rating: number;
  ratingCount: number;
  duration: string;
  language: string;
  instructor: Instructor;
  price: number;
  scholarshipAvailable: boolean;
  modules: Module[];
  prerequisites: Prerequisite[];
  requirements: string[];
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Course Type & Delivery
  courseType: CourseType;
  courseCategory: CourseType; // Alias for courseType
  deliveryMethod: DeliveryMethod;
  schedule?: CourseSchedule; // For live courses
  
  // Time Limits (for Crash/Skill courses)
  timeLimitDays?: number; // 1-2 weeks for Crash, 1-4 weeks for Skill
  timeLimitStartDate?: string; // Enrollment date
  timeLimitEndDate?: string; // Calculated expiration date
  
  // Free Course Settings
  isFree: boolean;
  freeCourseDurationMinutes?: number; // 30-120 minutes for free courses
  
  // Category Restrictions
  categoryRestriction?: 'it-only' | 'any'; // Bootcamp: IT only, Others: Any
  
  // Premium Features (Bootcamp only)
  hasHackathons: boolean;
  hasScholarships: boolean;
  hasAIInterview: boolean;
  hasManualInterview: boolean;
  
  // Settings
  maxStudents?: number;
  visibility?: 'public' | 'private' | 'invite-only';
  autoCertificate?: boolean;
  certificateTemplate?: string;
  badges?: Badge[];
  coInstructors?: CoInstructor[];
  teachingAssistants?: TeachingAssistant[];
  
  // Vacancy System (Bootcamp only)
  requiresVacancy?: boolean;
  vacancyId?: string;
  applicationId?: string;
  adminPricing?: number;
  commissionSplit?: CommissionSplit;
  courseStatus?: CourseStatus;
  
  // Installment Options
  installmentEnabled?: boolean;
  installmentOptions?: number[]; // [3, 4]
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  rating?: number;
  totalStudents?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  deliveryMethod?: DeliveryMethod; // For mixed delivery courses
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: 'video' | 'reading' | 'assignment' | 'live';
  videoUrl?: string;
  content?: string;
  order: number;
  completed?: boolean;
}

export interface CourseSchedule {
  startDate: string;
  endDate: string;
  sessions: LiveSession[];
}

export interface LiveSession {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  maxStudents?: number;
}

export interface Prerequisite {
  id: string;
  title: string;
  type: 'course' | 'skill' | 'knowledge';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  criteria: string;
}

export interface CoInstructor {
  id: string;
  name: string;
  email: string;
}

export interface TeachingAssistant {
  id: string;
  name: string;
  email: string;
}

export interface CommissionSplit {
  evolvix: number; // percentage
  mentor: number; // percentage
}

// DSA Course Recommendation Types
export type DSAFocusArea = 'problem-solving' | 'hackathons' | 'interviews';

export interface DSACourse extends Course {
  focusAreas: DSAFocusArea[];
  isRecommended: boolean;
  recommendationReason?: string;
  bootcampStudentSuccessRate?: number;
}

// Course Enrollment Types
export interface CourseEnrollment {
  courseId: string;
  studentId: string;
  enrolledAt: string;
  progress: number;
  completed: boolean;
  completedLessons: string[];
  paymentMethod?: 'full' | 'installment';
  installments?: InstallmentSchedule[];
  accessStatus: 'active' | 'paused' | 'suspended';
  timeLimitExpired?: boolean;
}

export interface InstallmentSchedule {
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'failed';
}

// Course Filter Types
export interface CourseFilters {
  category?: CourseCategory;
  level?: CourseLevel;
  courseType?: CourseType;
  price?: 'free' | 'paid';
  rating?: number;
  duration?: string;
  mentor?: string;
  search?: string;
}

// Course Access Control Types
export interface CourseAccessControl {
  canAccessHackathons: boolean;
  canAccessScholarships: boolean;
  canAccessAIInterview: boolean;
  canAccessManualInterview: boolean;
  canAccessLiveClasses: boolean;
  canAccessRecordedContent: boolean;
  visibleMenuItems: string[];
}


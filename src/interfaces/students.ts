// Types for Student Management

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[]; // Course IDs
  overallProgress: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  lastActive: string;
  joinedAt: string;
  rating?: number;
  // Enhanced fields
  phone?: string;
  location?: string;
  timezone?: string;
  loginFrequency?: number; // times per week
  timeSpentLearning?: number; // hours
  assignmentSubmissionRate?: number; // percentage
  discussionParticipation?: number; // count
  classAttendanceRate?: number; // percentage
  gpa?: number;
  certificates?: string[];
  badges?: string[];
  tags?: string[];
  status?: 'enrolled' | 'completed' | 'dropped' | 'at-risk';
  paymentStatus?: 'paid' | 'unpaid' | 'partial';
  engagementLevel?: 'high' | 'medium' | 'low';
  performanceLevel?: 'high' | 'medium' | 'low';
  strengths?: string[];
  weaknesses?: string[];
  learningPace?: 'fast' | 'average' | 'slow';
  recommendedCourses?: string[];
  careerGoals?: string[];
  supportTickets?: number;
  // Profile information visible to mentors
  skills?: Array<{
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced';
  }>;
  kycStatus?: {
    status: 'pending' | 'verified' | 'rejected';
    idUploaded: boolean;
    verificationDate?: string;
  };
  schoolInfo?: {
    isSchoolStudent: boolean;
    schoolName?: string;
    gradeLevel?: string; // 10th, 11th, 12th
    schoolBoard?: string; // CBSE, ICSE, State Board, IB, IGCSE, Other
  };
  educationInfo?: {
    college?: string;
    degree?: string;
    year?: string;
    specialization?: string;
  };
}

export interface StudentTestCompletion {
  testId: string;
  testTitle: string;
  moduleTitle: string;
  courseId: string;
  courseTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // in minutes
  completedAt: string;
  wrongAnswers: number;
}

export interface StudentCourseProgress {
  courseId: string;
  courseTitle: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  enrolledAt: string;
  testCompletions?: StudentTestCompletion[];
}

export interface StudentFeedback {
  id: string;
  studentId: string;
  courseId?: string;
  participation: number; // 1-5
  skills: number; // 1-5
  communication: number; // 1-5
  overallRating: number; // Calculated average
  comments: string;
  submittedAt: string;
  submittedBy: string; // Mentor ID
}

export interface ChatMessage {
  id: string;
  studentId: string;
  mentorId: string;
  message: string;
  sender: 'student' | 'mentor';
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}


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


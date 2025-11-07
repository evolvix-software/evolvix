// Types for Analytics

export interface ClassAnalytics {
  courseId: string;
  courseTitle: string;
  totalSessions: number;
  attendanceRate: number; // Percentage
  averageSatisfactionScore: number; // 1-5 scale
  totalStudents: number;
  sessions: Array<{
    id: string;
    date: string;
    title: string;
    attendance: number;
    totalEnrolled: number;
    satisfactionScore: number;
  }>;
}

export interface StudentPerformanceMetrics {
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  initialScore: number;
  currentScore: number;
  improvement: number; // Percentage improvement
  assignmentsCompleted: number;
  assignmentsTotal: number;
  averageAssignmentScore: number;
  progress: number;
}

export interface RevenueData {
  month: string;
  year: number;
  earnings: number;
  students: number;
  courses: number;
  transactions: number;
}

export interface RatingReview {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  rating: number; // 1-5
  review: string;
  createdAt: string;
  helpful: number;
}

export interface MentorAnalytics {
  overallRating: number;
  totalRatings: number;
  totalReviews: number;
  ratingDistribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
  recentReviews: RatingReview[];
}


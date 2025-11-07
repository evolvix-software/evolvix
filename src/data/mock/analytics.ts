import { ClassAnalytics, StudentPerformanceMetrics, RevenueData, MentorAnalytics } from '@/interfaces/analytics';

// Mock Class Analytics Data
export const mockClassAnalytics: ClassAnalytics[] = [
  {
    courseId: '5',
    courseTitle: 'Live Full-Stack Web Development Bootcamp',
    totalSessions: 45,
    attendanceRate: 87.5,
    averageSatisfactionScore: 4.6,
    totalStudents: 32,
    sessions: [
      {
        id: 'sess_1',
        date: '2024-12-15',
        title: 'Introduction to HTML5 & CSS3',
        attendance: 28,
        totalEnrolled: 32,
        satisfactionScore: 4.5
      },
      {
        id: 'sess_2',
        date: '2024-12-17',
        title: 'JavaScript Fundamentals',
        attendance: 30,
        totalEnrolled: 32,
        satisfactionScore: 4.7
      },
      {
        id: 'sess_3',
        date: '2024-12-19',
        title: 'React Basics',
        attendance: 27,
        totalEnrolled: 32,
        satisfactionScore: 4.6
      },
      {
        id: 'sess_4',
        date: '2024-12-22',
        title: 'State Management with Redux',
        attendance: 29,
        totalEnrolled: 32,
        satisfactionScore: 4.8
      },
      {
        id: 'sess_5',
        date: '2024-12-24',
        title: 'Node.js & Express',
        attendance: 26,
        totalEnrolled: 32,
        satisfactionScore: 4.4
      }
    ]
  },
  {
    courseId: '6',
    courseTitle: 'Live Advanced React & Next.js Mastery',
    totalSessions: 30,
    attendanceRate: 92.3,
    averageSatisfactionScore: 4.8,
    totalStudents: 24,
    sessions: [
      {
        id: 'sess_6',
        date: '2024-12-10',
        title: 'Advanced React Patterns',
        attendance: 23,
        totalEnrolled: 24,
        satisfactionScore: 4.9
      },
      {
        id: 'sess_7',
        date: '2024-12-12',
        title: 'Next.js App Router',
        attendance: 22,
        totalEnrolled: 24,
        satisfactionScore: 4.7
      },
      {
        id: 'sess_8',
        date: '2024-12-14',
        title: 'Server Components & Data Fetching',
        attendance: 24,
        totalEnrolled: 24,
        satisfactionScore: 4.8
      }
    ]
  },
  {
    courseId: '7',
    courseTitle: 'Complete Python Data Science & Machine Learning',
    totalSessions: 60,
    attendanceRate: 78.2,
    averageSatisfactionScore: 4.5,
    totalStudents: 45,
    sessions: [
      {
        id: 'sess_9',
        date: '2024-12-01',
        title: 'Python Basics Review',
        attendance: 38,
        totalEnrolled: 45,
        satisfactionScore: 4.3
      },
      {
        id: 'sess_10',
        date: '2024-12-03',
        title: 'NumPy & Pandas',
        attendance: 35,
        totalEnrolled: 45,
        satisfactionScore: 4.6
      },
      {
        id: 'sess_11',
        date: '2024-12-05',
        title: 'Data Visualization',
        attendance: 36,
        totalEnrolled: 45,
        satisfactionScore: 4.5
      }
    ]
  }
];

// Mock Student Performance Metrics
export const mockStudentPerformance: StudentPerformanceMetrics[] = [
  {
    studentId: 'student_1',
    studentName: 'Alex Johnson',
    courseId: '5',
    courseTitle: 'Live Full-Stack Web Development Bootcamp',
    initialScore: 65,
    currentScore: 88,
    improvement: 35.4,
    assignmentsCompleted: 12,
    assignmentsTotal: 15,
    averageAssignmentScore: 85,
    progress: 80
  },
  {
    studentId: 'student_2',
    studentName: 'Sarah Chen',
    courseId: '5',
    courseTitle: 'Live Full-Stack Web Development Bootcamp',
    initialScore: 72,
    currentScore: 92,
    improvement: 27.8,
    assignmentsCompleted: 14,
    assignmentsTotal: 15,
    averageAssignmentScore: 90,
    progress: 93
  },
  {
    studentId: 'student_3',
    studentName: 'Michael Brown',
    courseId: '6',
    courseTitle: 'Live Advanced React & Next.js Mastery',
    initialScore: 58,
    currentScore: 82,
    improvement: 41.4,
    assignmentsCompleted: 8,
    assignmentsTotal: 10,
    averageAssignmentScore: 80,
    progress: 80
  },
  {
    studentId: 'student_4',
    studentName: 'Emily Davis',
    courseId: '7',
    courseTitle: 'Complete Python Data Science & Machine Learning',
    initialScore: 70,
    currentScore: 89,
    improvement: 27.1,
    assignmentsCompleted: 18,
    assignmentsTotal: 20,
    averageAssignmentScore: 87,
    progress: 90
  },
  {
    studentId: 'student_5',
    studentName: 'David Wilson',
    courseId: '5',
    courseTitle: 'Live Full-Stack Web Development Bootcamp',
    initialScore: 55,
    currentScore: 75,
    improvement: 36.4,
    assignmentsCompleted: 10,
    assignmentsTotal: 15,
    averageAssignmentScore: 72,
    progress: 67
  }
];

// Mock Revenue Data
export const mockRevenueData: RevenueData[] = [
  { month: 'Jan', year: 2024, earnings: 8500, students: 45, courses: 3, transactions: 45 },
  { month: 'Feb', year: 2024, earnings: 9200, students: 52, courses: 3, transactions: 52 },
  { month: 'Mar', year: 2024, earnings: 10800, students: 58, courses: 4, transactions: 58 },
  { month: 'Apr', year: 2024, earnings: 12500, students: 65, courses: 4, transactions: 65 },
  { month: 'May', year: 2024, earnings: 14200, students: 72, courses: 5, transactions: 72 },
  { month: 'Jun', year: 2024, earnings: 15800, students: 78, courses: 5, transactions: 78 },
  { month: 'Jul', year: 2024, earnings: 17200, students: 85, courses: 5, transactions: 85 },
  { month: 'Aug', year: 2024, earnings: 18900, students: 92, courses: 6, transactions: 92 },
  { month: 'Sep', year: 2024, earnings: 20500, students: 98, courses: 6, transactions: 98 },
  { month: 'Oct', year: 2024, earnings: 22100, students: 105, courses: 6, transactions: 105 },
  { month: 'Nov', year: 2024, earnings: 23800, students: 112, courses: 7, transactions: 112 },
  { month: 'Dec', year: 2024, earnings: 25500, students: 120, courses: 7, transactions: 120 }
];

// Mock Ratings & Reviews
export const mockMentorAnalytics: MentorAnalytics = {
  overallRating: 4.7,
  totalRatings: 156,
  totalReviews: 89,
  ratingDistribution: {
    five: 98,
    four: 42,
    three: 12,
    two: 3,
    one: 1
  },
  recentReviews: [
    {
      id: 'review_1',
      studentId: 'student_1',
      studentName: 'Alex Johnson',
      courseId: '5',
      courseTitle: 'Live Full-Stack Web Development Bootcamp',
      rating: 5,
      review: 'Excellent mentor! The classes are well-structured and the explanations are clear. I\'ve learned so much in just a few weeks.',
      createdAt: '2024-12-20T10:30:00Z',
      helpful: 12
    },
    {
      id: 'review_2',
      studentId: 'student_2',
      studentName: 'Sarah Chen',
      courseId: '5',
      courseTitle: 'Live Full-Stack Web Development Bootcamp',
      rating: 5,
      review: 'Amazing teaching style. The mentor is patient and always available to help. Highly recommend!',
      createdAt: '2024-12-18T14:20:00Z',
      helpful: 8
    },
    {
      id: 'review_3',
      studentId: 'student_3',
      studentName: 'Michael Brown',
      courseId: '6',
      courseTitle: 'Live Advanced React & Next.js Mastery',
      rating: 4,
      review: 'Great course content and practical examples. The mentor explains complex concepts in an easy-to-understand way.',
      createdAt: '2024-12-15T09:15:00Z',
      helpful: 5
    },
    {
      id: 'review_4',
      studentId: 'student_4',
      studentName: 'Emily Davis',
      courseId: '7',
      courseTitle: 'Complete Python Data Science & Machine Learning',
      rating: 5,
      review: 'Outstanding mentor! The course has exceeded my expectations. The assignments are challenging but fair.',
      createdAt: '2024-12-12T16:45:00Z',
      helpful: 15
    },
    {
      id: 'review_5',
      studentId: 'student_5',
      studentName: 'David Wilson',
      courseId: '5',
      courseTitle: 'Live Full-Stack Web Development Bootcamp',
      rating: 4,
      review: 'Good course overall. The mentor is knowledgeable and provides helpful feedback on assignments.',
      createdAt: '2024-12-10T11:00:00Z',
      helpful: 3
    }
  ]
};


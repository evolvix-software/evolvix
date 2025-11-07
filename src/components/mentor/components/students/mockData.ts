import { Student, StudentCourseProgress, StudentFeedback, ChatConversation } from './types';

// Mock students data - All enrolled in mentor's courses (IDs: 5, 6, 7, 8, 9)
export const mockStudents: Student[] = [
  {
    id: 'student_1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    enrolledCourses: ['5', '6', '7'], // Live Full-Stack, Live Mobile, Python Data Science
    overallProgress: 85,
    assignmentsCompleted: 12,
    assignmentsTotal: 15,
    lastActive: '2 hours ago',
    joinedAt: '2024-11-15',
    rating: 4.8
  },
  {
    id: 'student_2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    enrolledCourses: ['5', '8'], // Live Full-Stack, UI/UX Design
    overallProgress: 72,
    assignmentsCompleted: 8,
    assignmentsTotal: 12,
    lastActive: '1 day ago',
    joinedAt: '2024-11-20',
    rating: 4.5
  },
  {
    id: 'student_3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    enrolledCourses: ['6', '7', '9'], // Live Mobile, Python Data Science, Advanced JavaScript
    overallProgress: 90,
    assignmentsCompleted: 15,
    assignmentsTotal: 18,
    lastActive: '5 hours ago',
    joinedAt: '2024-11-10',
    rating: 4.9
  },
  {
    id: 'student_4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    enrolledCourses: ['7', '8'], // Python Data Science, UI/UX Design
    overallProgress: 68,
    assignmentsCompleted: 10,
    assignmentsTotal: 14,
    lastActive: '3 days ago',
    joinedAt: '2024-11-25',
    rating: 4.2
  },
  {
    id: 'student_5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    enrolledCourses: ['5', '9'], // Live Full-Stack, Advanced JavaScript
    overallProgress: 95,
    assignmentsCompleted: 18,
    assignmentsTotal: 20,
    lastActive: '1 hour ago',
    joinedAt: '2024-11-05',
    rating: 5.0
  }
];

// Mock course progress for students
export const mockStudentProgress: Record<string, StudentCourseProgress[]> = {
  student_1: [
    {
      courseId: '5',
      courseTitle: 'Live Full-Stack Web Development Bootcamp',
      progress: 85,
      completedLessons: 12,
      totalLessons: 15,
      assignmentsCompleted: 7,
      assignmentsTotal: 7,
      enrolledAt: '2024-11-15'
    },
    {
      courseId: '6',
      courseTitle: 'Live Mobile App Development with React Native',
      progress: 90,
      completedLessons: 8,
      totalLessons: 9,
      assignmentsCompleted: 5,
      assignmentsTotal: 5,
      enrolledAt: '2024-11-20'
    }
  ],
  student_2: [
    {
      courseId: '5',
      courseTitle: 'Live Full-Stack Web Development Bootcamp',
      progress: 72,
      completedLessons: 9,
      totalLessons: 15,
      assignmentsCompleted: 4,
      assignmentsTotal: 7,
      enrolledAt: '2024-11-20'
    },
    {
      courseId: '8',
      courseTitle: 'Complete UI/UX Design Masterclass',
      progress: 65,
      completedLessons: 6,
      totalLessons: 10,
      assignmentsCompleted: 4,
      assignmentsTotal: 5,
      enrolledAt: '2024-11-25'
    }
  ],
  student_3: [
    {
      courseId: '6',
      courseTitle: 'Live Mobile App Development with React Native',
      progress: 90,
      completedLessons: 8,
      totalLessons: 9,
      assignmentsCompleted: 5,
      assignmentsTotal: 5,
      enrolledAt: '2024-11-10'
    },
    {
      courseId: '7',
      courseTitle: 'Complete Python Data Science & Machine Learning',
      progress: 88,
      completedLessons: 10,
      totalLessons: 12,
      assignmentsCompleted: 6,
      assignmentsTotal: 7,
      enrolledAt: '2024-11-12'
    },
    {
      courseId: '9',
      courseTitle: 'Advanced JavaScript & Modern Web Development',
      progress: 92,
      completedLessons: 8,
      totalLessons: 9,
      assignmentsCompleted: 4,
      assignmentsTotal: 6,
      enrolledAt: '2024-11-15'
    }
  ],
  student_4: [
    {
      courseId: '7',
      courseTitle: 'Complete Python Data Science & Machine Learning',
      progress: 68,
      completedLessons: 7,
      totalLessons: 12,
      assignmentsCompleted: 5,
      assignmentsTotal: 7,
      enrolledAt: '2024-11-25'
    },
    {
      courseId: '8',
      courseTitle: 'Complete UI/UX Design Masterclass',
      progress: 70,
      completedLessons: 5,
      totalLessons: 10,
      assignmentsCompleted: 5,
      assignmentsTotal: 7,
      enrolledAt: '2024-11-26'
    }
  ],
  student_5: [
    {
      courseId: '5',
      courseTitle: 'Live Full-Stack Web Development Bootcamp',
      progress: 95,
      completedLessons: 14,
      totalLessons: 15,
      assignmentsCompleted: 7,
      assignmentsTotal: 7,
      enrolledAt: '2024-11-05'
    },
    {
      courseId: '9',
      courseTitle: 'Advanced JavaScript & Modern Web Development',
      progress: 98,
      completedLessons: 9,
      totalLessons: 9,
      assignmentsCompleted: 11,
      assignmentsTotal: 13,
      enrolledAt: '2024-11-08'
    }
  ]
};

// Mock feedback data
export const mockFeedbacks: StudentFeedback[] = [
  {
    id: 'feedback_1',
    studentId: 'student_1',
    courseId: '5',
    participation: 5,
    skills: 4,
    communication: 5,
    overallRating: 4.67,
    comments: 'Excellent participation in live sessions. Shows strong understanding of concepts and communicates effectively.',
    submittedAt: '2024-12-10',
    submittedBy: 'suhxil14@gmail.com'
  },
  {
    id: 'feedback_2',
    studentId: 'student_2',
    courseId: '5',
    participation: 4,
    skills: 3,
    communication: 4,
    overallRating: 3.67,
    comments: 'Good effort but needs to practice more. Communication is clear.',
    submittedAt: '2024-12-08',
    submittedBy: 'suhxil14@gmail.com'
  }
];

// Mock chat conversations
export const mockChatConversations: ChatConversation[] = [
  {
    studentId: 'student_1',
    studentName: 'Alex Johnson',
    lastMessage: 'Thank you for the feedback! I\'ll work on improving my skills.',
    lastMessageTime: '2 hours ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_1',
        studentId: 'student_1',
        mentorId: 'suhxil14@gmail.com',
        message: 'Hi, I have a question about the React hooks assignment.',
        sender: 'student',
        timestamp: '2024-12-15T10:00:00Z',
        read: true
      },
      {
        id: 'msg_2',
        studentId: 'student_1',
        mentorId: 'suhxil14@gmail.com',
        message: 'Sure! What would you like to know?',
        sender: 'mentor',
        timestamp: '2024-12-15T10:05:00Z',
        read: true
      },
      {
        id: 'msg_3',
        studentId: 'student_1',
        mentorId: 'suhxil14@gmail.com',
        message: 'Thank you for the feedback! I\'ll work on improving my skills.',
        sender: 'student',
        timestamp: '2024-12-15T14:00:00Z',
        read: true
      }
    ]
  },
  {
    studentId: 'student_2',
    studentName: 'Sarah Chen',
    lastMessage: 'Can you help me with the design project?',
    lastMessageTime: '1 day ago',
    unreadCount: 1,
    messages: [
      {
        id: 'msg_4',
        studentId: 'student_2',
        mentorId: 'suhxil14@gmail.com',
        message: 'Can you help me with the design project?',
        sender: 'student',
        timestamp: '2024-12-14T15:00:00Z',
        read: false
      }
    ]
  },
  {
    studentId: 'student_3',
    studentName: 'Michael Brown',
    lastMessage: 'I completed the mobile app project. Can you review it?',
    lastMessageTime: '5 hours ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_5',
        studentId: 'student_3',
        mentorId: 'suhxil14@gmail.com',
        message: 'I completed the mobile app project. Can you review it?',
        sender: 'student',
        timestamp: '2024-12-15T12:00:00Z',
        read: true
      },
      {
        id: 'msg_6',
        studentId: 'student_3',
        mentorId: 'suhxil14@gmail.com',
        message: 'Great! I\'ll review it and provide feedback soon.',
        sender: 'mentor',
        timestamp: '2024-12-15T12:30:00Z',
        read: true
      }
    ]
  },
  {
    studentId: 'student_4',
    studentName: 'Emily Davis',
    lastMessage: 'When is the next live session?',
    lastMessageTime: '3 days ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_7',
        studentId: 'student_4',
        mentorId: 'suhxil14@gmail.com',
        message: 'When is the next live session?',
        sender: 'student',
        timestamp: '2024-12-12T10:00:00Z',
        read: true
      }
    ]
  },
  {
    studentId: 'student_5',
    studentName: 'David Wilson',
    lastMessage: 'Thanks for the help with the advanced JavaScript concepts!',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg_8',
        studentId: 'student_5',
        mentorId: 'suhxil14@gmail.com',
        message: 'I\'m having trouble understanding closures. Can you explain?',
        sender: 'student',
        timestamp: '2024-12-15T13:00:00Z',
        read: true
      },
      {
        id: 'msg_9',
        studentId: 'student_5',
        mentorId: 'suhxil14@gmail.com',
        message: 'Sure! Closures allow a function to access variables from its outer scope...',
        sender: 'mentor',
        timestamp: '2024-12-15T13:15:00Z',
        read: true
      },
      {
        id: 'msg_10',
        studentId: 'student_5',
        mentorId: 'suhxil14@gmail.com',
        message: 'Thanks for the help with the advanced JavaScript concepts!',
        sender: 'student',
        timestamp: '2024-12-15T14:00:00Z',
        read: true
      }
    ]
  }
];


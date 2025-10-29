export interface Instructor {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  studentsCount: number;
  bio: string;
}

// Lesson interface is now defined above in Course interface section

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Prerequisite {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface CourseSchedule {
  frequency: 'daily' | 'weekly' | 'twice-weekly';
  days?: string[]; // ['monday', 'wednesday'] or ['saturday', 'sunday']
  time?: string; // Default time for classes (HH:MM)
  duration?: number; // Default duration in minutes
}

export interface VideoTimestamp {
  id: string;
  title: string;
  timestamp: number; // seconds
  description?: string;
}

export interface LessonAssignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  maxScore: number;
  files?: File[];
}

export interface LessonTest {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    options?: string[];
    correctAnswer: string;
    points: number;
  }>;
  passingScore: number;
  timeLimit?: number; // in minutes
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
  completed?: boolean;
  // For recorded courses
  videoUrl?: string;
  videoFile?: File | undefined;
  timestamps?: VideoTimestamp[];
  assignment?: LessonAssignment;
  test?: LessonTest;
  // For live courses (optional)
  liveSessionLink?: string;
  content?: string;
}

export interface CourseProject {
  id: string;
  projectNumber: number;
  title: string;
  description: string;
  technologies: string[]; // Technologies to be used
  requirements: string[]; // Project requirements
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string; // e.g., "2 weeks"
  dueDate?: string; // Deadline for submission
  isFinalProject: boolean; // If true, student chooses their own project
  finalProjectGuidelines?: string; // Guidelines for final project if student choice
  maxScore: number;
  weight: number; // Percentage weight in final grade
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  courseId: string;
  studentId: string;
  studentName: string;
  githubUrl: string;
  liveLink?: string;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'zip' | 'other';
  }>;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'returned';
  mentorFeedback?: string;
  score?: number;
  maxScore: number;
}

export interface DoubtClearingSession {
  id: string;
  courseId: string;
  date: string; // Sunday date
  time: string; // Time in HH:MM
  duration: number; // minutes
  platform: 'zoom' | 'jitsi';
  meetingLink?: string;
  meetingId?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  attendance: string[]; // Student IDs
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  thumbnail: string;
  category: 'development' | 'design' | 'business' | 'data-science' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced';
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
  // New fields
  courseType: 'live' | 'recorded'; // Course delivery type
  schedule?: CourseSchedule; // For live courses
  allowStudentPreferences?: boolean; // Let students choose schedule
  // Projects
  projects?: CourseProject[]; // Projects defined by mentor
  enableSundayDoubtClearing?: boolean; // For recorded courses
  doubtClearingSessions?: DoubtClearingSession[]; // Sunday sessions
}

export const coursesData: Course[] = [
  {
    id: '1',
    title: 'Complete React Development Masterclass',
    description: 'Master React.js from scratch with this comprehensive course. Build real-world applications and learn hooks, context, routing, and more.',
    shortDescription: 'Learn React.js from basics to advanced with hands-on projects',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    category: 'development',
    level: 'intermediate',
    skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'CSS'],
    rating: 4.7,
    ratingCount: 1234,
    duration: '24h 30m',
    language: 'English',
    instructor: {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior Frontend Developer at Google',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 4.9,
      studentsCount: 15420,
      bio: '10+ years of experience in React and modern JavaScript'
    },
    price: 89,
    scholarshipAvailable: true,
    modules: [
      {
        id: 'm1',
        courseId: '1',
        title: 'Introduction to React',
        description: 'Get started with React fundamentals',
        lessons: [
          {
            id: 'l1',
            moduleId: 'm1',
            title: 'What is React?',
            duration: '15:30',
            type: 'video',
            completed: false,
            videoUrl: 'https://example.com/video1'
          },
          {
            id: 'l2',
            moduleId: 'm1',
            title: 'Setting up your development environment',
            duration: '12:45',
            type: 'video',
            completed: false,
            videoUrl: 'https://example.com/video2'
          },
          {
            id: 'l3',
            moduleId: 'm1',
            title: 'Your first React component',
            duration: '20:15',
            type: 'video',
            completed: false,
            videoUrl: 'https://example.com/video3'
          }
        ]
      },
      {
        id: 'm2',
        courseId: '1',
        title: 'Components and Props',
        description: 'Deep dive into React components',
        lessons: [
          {
            id: 'l4',
            moduleId: 'm2',
            title: 'Understanding Props',
            duration: '18:20',
            type: 'video',
            completed: false
          },
          {
            id: 'l5',
            moduleId: 'm2',
            title: 'Props vs State',
            duration: '22:10',
            type: 'video',
            completed: false
          }
        ]
      }
    ],
    prerequisites: [
      {
        id: 'p1',
        title: 'JavaScript Fundamentals',
        description: 'Basic understanding of JavaScript ES6+',
        completed: true
      },
      {
        id: 'p2',
        title: 'HTML & CSS Basics',
        description: 'Knowledge of HTML and CSS',
        completed: true
      }
    ],
    requirements: [
      'Basic knowledge of JavaScript',
      'Node.js and npm installed',
      'Code editor (VS Code recommended)'
    ],
    enrolledCount: 5634,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    courseType: 'recorded' as const,
    schedule: undefined,
    allowStudentPreferences: false,
    projects: undefined,
    enableSundayDoubtClearing: false,
    doubtClearingSessions: undefined,
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of great user interface and user experience design. Master Figma, user research, and design systems.',
    shortDescription: 'Master UI/UX design principles and tools',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    category: 'design',
    level: 'beginner',
    skills: ['Figma', 'UX Research', 'Prototyping', 'Design Systems'],
    rating: 4.6,
    ratingCount: 892,
    duration: '18h 45m',
    language: 'English',
    instructor: {
      id: '2',
      name: 'Michael Chen',
      title: 'Lead Designer at Airbnb',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
      rating: 4.8,
      studentsCount: 9876,
      bio: 'Award-winning designer with expertise in product design'
    },
    price: 75,
    scholarshipAvailable: false,
    modules: [
      {
        id: 'm3',
        courseId: '2',
        title: 'Design Thinking',
        description: 'Understanding user-centered design',
        lessons: [
          {
            id: 'l6',
            moduleId: 'm3',
            title: 'Introduction to Design Thinking',
            duration: '25:00',
            type: 'video',
            completed: false
          },
          {
            id: 'l7',
            moduleId: 'm3',
            title: 'User Research Methods',
            duration: '30:15',
            type: 'video',
            completed: false
          }
        ]
      }
    ],
    prerequisites: [
      {
        id: 'p3',
        title: 'Basic Design Knowledge',
        description: 'Understanding of basic design principles',
        completed: false
      }
    ],
    requirements: [
      'Figma account (free tier works)',
      'Passion for design and creativity'
    ],
    enrolledCount: 3421,
    createdAt: '2024-02-10',
    updatedAt: '2024-04-05',
    courseType: 'recorded' as const,
    schedule: undefined,
    allowStudentPreferences: false,
    projects: undefined,
    enableSundayDoubtClearing: false,
    doubtClearingSessions: undefined,
  },
  {
    id: '3',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis, machine learning, and visualization. Learn pandas, numpy, and matplotlib.',
    shortDescription: 'Comprehensive Python course for data science',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    category: 'data-science',
    level: 'advanced',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Machine Learning'],
    rating: 4.8,
    ratingCount: 2156,
    duration: '30h 15m',
    language: 'English',
    instructor: {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      title: 'Data Scientist at Microsoft',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      rating: 4.9,
      studentsCount: 21234,
      bio: 'PhD in Data Science with 15+ years in the field'
    },
    price: 129,
    scholarshipAvailable: true,
    modules: [
      {
        id: 'm4',
        courseId: '3',
        title: 'Python Basics',
        description: 'Python fundamentals for data science',
        lessons: [
          {
            id: 'l8',
            moduleId: 'm4',
            title: 'Python Introduction',
            duration: '20:00',
            type: 'video',
            completed: false
          },
          {
            id: 'l9',
            moduleId: 'm4',
            title: 'Data Structures',
            duration: '25:30',
            type: 'video',
            completed: false
          }
        ]
      }
    ],
    prerequisites: [
      {
        id: 'p4',
        title: 'Mathematics Basics',
        description: 'Understanding of basic algebra and statistics',
        completed: true
      }
    ],
    requirements: [
      'Python 3.8+ installed',
      'Jupyter Notebook',
      'Basic computer knowledge'
    ],
    enrolledCount: 12345,
    createdAt: '2024-01-20',
    updatedAt: '2024-05-10',
    courseType: 'recorded' as const,
    schedule: undefined,
    allowStudentPreferences: false,
    projects: undefined,
    enableSundayDoubtClearing: false,
    doubtClearingSessions: undefined,
  },
  {
    id: '4',
    title: 'Digital Marketing Mastery',
    description: 'Learn SEO, social media marketing, content marketing, and analytics. Build strategies that drive results.',
    shortDescription: 'Complete digital marketing course',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    category: 'business',
    level: 'intermediate',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics', 'Content Marketing'],
    rating: 4.5,
    ratingCount: 567,
    duration: '22h 00m',
    language: 'English',
    instructor: {
      id: '4',
      name: 'James Mitchell',
      title: 'Marketing Director at Shopify',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      rating: 4.7,
      studentsCount: 5432,
      bio: 'Helped 1000+ businesses grow their online presence'
    },
    price: 99,
    scholarshipAvailable: true,
    modules: [
      {
        id: 'm5',
        courseId: '4',
        title: 'SEO Fundamentals',
        description: 'Master search engine optimization',
        lessons: [
          {
            id: 'l10',
            moduleId: 'm5',
            title: 'Understanding Search Engines',
            duration: '18:45',
            type: 'video',
            completed: false
          }
        ]
      }
    ],
    prerequisites: [],
    requirements: [
      'Basic understanding of websites',
      'Familiarity with social media platforms'
    ],
    enrolledCount: 2345,
    createdAt: '2024-03-01',
    updatedAt: '2024-06-15',
    courseType: 'recorded' as const,
    schedule: undefined,
    allowStudentPreferences: false,
    projects: undefined,
    enableSundayDoubtClearing: false,
    doubtClearingSessions: undefined,
  }
];

export const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'development', label: 'Development' },
  { id: 'design', label: 'Design' },
  { id: 'business', label: 'Business' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'other', label: 'Other' }
];

export const levels = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];

export const skills = [
  'React', 'JavaScript', 'TypeScript', 'Python', 'Figma',
  'SEO', 'Marketing', 'Pandas', 'NumPy', 'CSS', 'UX Research'
];

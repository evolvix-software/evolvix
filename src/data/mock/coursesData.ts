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
  startDate?: string; // Course start date (YYYY-MM-DD)
  endDate?: string; // Course end date (YYYY-MM-DD)
  admissionDeadline?: string; // Last date for enrollment (YYYY-MM-DD)
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
  // Course Settings & Configuration
  maxStudents?: number; // Enrollment limit
  visibility?: 'public' | 'private' | 'invite-only'; // Access control
  autoCertificate?: boolean; // Auto-generate certificates
  certificateTemplate?: string; // Certificate template
  badges?: Array<{ id: string; name: string; description: string; criteria: string }>; // Achievement badges
  coInstructors?: Array<{ id: string; name: string; email: string }>; // Co-instructors
  teachingAssistants?: Array<{ id: string; name: string; email: string }>; // Teaching assistants
  // Course Category System
  courseCategory?: 'crash' | 'skill-focused' | 'bootcamp' | 'bundle'; // Course category type
  requiresVacancy?: boolean; // Computed: bootcamp || bundle
  allowsScholarship?: boolean; // Computed: bootcamp || bundle
  
  // Bundle/Master Course System
  isBundleCourse?: boolean; // Is this a bundle/master course (deprecated, use courseCategory)
  bundleDuration?: '4-months' | '5-months' | '6-months'; // Duration for bundle courses
  scholarshipOnly?: boolean; // Scholarship-only courses (deprecated)
  adminPricing?: number; // Pricing set by admin (for bundle courses)
  commissionSplit?: {
    evolvix: number; // Percentage
    mentor: number; // Percentage
  };
  courseStatus?: 'draft' | 'pending-verification' | 'verified' | 'published' | 'rejected'; // Course verification status
  adminNotes?: string; // Admin notes during verification
  contractDocument?: string; // URL to contract PDF
  mentorSigned?: boolean; // Has mentor signed the contract
  adminApproved?: boolean; // Has admin approved the course
  vacancyId?: string; // Associated vacancy ID
  applicationId?: string; // Associated application ID
  submissionId?: string; // Course submission ID
  mentorSignedAt?: string; // When mentor signed the contract
  
  // Installment Payment System
  installmentEnabled?: boolean; // Allow installment payments (default: true for paid courses)
  installmentOptions?: number[]; // [3, 4] - number of installments allowed
  
  // Career Path System
  careerPathId?: string; // Associated career path ID
  careerPathOrder?: number; // Order within career path
}

// Career Path System
export interface CareerPath {
  id: string;
  title: string;
  description: string;
  image?: string;
  courses: Array<{
    courseId: string;
    order: number;
    required: boolean; // Is this course required for path completion
  }>;
  duration: string; // Total duration (e.g., "6 months")
  outcome: string; // Career outcome (e.g., "Job-ready Full Stack Developer")
  category: 'development' | 'design' | 'business' | 'data-science' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced';
  price?: number; // Optional bundle price for entire path
  scholarshipAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Course Progress & Certification System
export interface CourseProgress {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  completedModules: number;
  totalModules: number;
  completedLessons: string[]; // Array of lesson IDs
  progressPercentage: number; // 0-100
  certificateIssued: boolean;
  certificateUrl?: string;
  certificateIssuedAt?: string;
  mentorSigned?: boolean; // For verified bootcamp/bundle certificates
  lastAccessedAt: string;
}

// Mentor Reputation System
export interface MentorProfile {
  mentorId: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  totalRatings: number;
  verifiedCourses: number; // Number of verified bootcamp/bundle courses
  reputationScore: number; // Weighted metric (0-100)
  specialties: string[]; // Areas of expertise
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  joinedAt: string;
  lastActiveAt: string;
}

// Commission & Payment Distribution
export interface PaymentDistribution {
  id: string;
  courseId: string;
  mentorId: string;
  studentId: string;
  amount: number; // Total payment amount
  paymentMethod: 'full' | 'installment';
  installmentNumber?: number; // If installment payment
  totalInstallments?: number;
  platformCut: number; // Evolvix commission
  mentorCut: number; // Mentor commission
  status: 'pending' | 'processing' | 'completed' | 'failed';
  distributedAt?: string;
  createdAt: string;
}

// Bundle Course System Interfaces
export interface CourseVacancy {
  id: string;
  title: string;
  category: 'development' | 'design' | 'business' | 'data-science' | 'gaming' | 'cybersecurity' | 'app-development' | 'jewelry-design' | 'other';
  description: string;
  requirements: string[];
  duration: string; // Optional - can be blank or '4-months', '5-months', '6-months', '20-60-hours', etc.
  courseCategory: 'bootcamp' | 'bundle'; // Determined by admin
  adminPricing: number;
  commissionSplit: {
    evolvix: number; // Percentage
    mentor: number; // Percentage
  };
  status: 'open' | 'closed' | 'filled';
  applications?: CourseApplication[];
  createdAt: string;
  deadline: string;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface CourseApplication {
  id: string;
  vacancyId: string;
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  coverLetter: string;
  portfolio: string; // URL
  experience: string;
  qualifications: string; // Detailed qualifications
  demoClassUrl?: string; // URL to demo class video
  demoClassFile?: string; // File path/URL if uploaded
  status: 'pending' | 'accepted' | 'rejected' | 'verified'; // verified = mentor approved, can create gig
  adminNotes?: string;
  createdAt: string;
  reviewedAt?: string;
  verifiedAt?: string; // When admin verifies qualifications and demo class
}

export interface CourseSubmission {
  id: string;
  courseId: string;
  vacancyId: string;
  applicationId: string;
  mentorId: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs-revision';
  adminNotes?: string;
  adminVerifiedAt?: string;
  contractDocument?: string;
  mentorSigned: boolean;
  mentorSignedAt?: string;
  commissionSplit?: {
    evolvix: number;
    mentor: number;
  };
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
  },
  // NEW MOCK COURSE 1 - LIVE COURSE
  {
    id: '5',
    title: 'Live Full-Stack Web Development Bootcamp',
    description: 'Master full-stack web development through daily live coding sessions. Build real-world projects with React, Node.js, and MongoDB. Get instant feedback, code reviews, and mentorship. Perfect for beginners who want hands-on learning with daily assignments and projects.',
    shortDescription: 'Master full-stack development through daily live sessions',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    category: 'development',
    level: 'beginner',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST APIs', 'Git'],
    rating: 4.8,
    ratingCount: 156,
    duration: '12 weeks',
    language: 'English',
    instructor: {
      id: 'suhxil14@gmail.com',
      name: 'Alex Thompson',
      title: 'Senior Full-Stack Developer at Microsoft',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 4.9,
      studentsCount: 3420,
      bio: '15+ years building scalable web applications'
    },
    price: 199,
    scholarshipAvailable: true,
    modules: [
      {
        id: 'm6',
        courseId: '5',
        title: 'HTML, CSS & JavaScript Fundamentals',
        description: 'Master the basics of web development',
        lessons: [
          {
            id: 'l11',
            moduleId: 'm6',
            title: 'HTML Structure & Semantics (Live Session)',
            duration: '90 min',
            type: 'video',
            content: 'Learn HTML5 semantic elements, forms, and accessibility. Daily assignment: Build a personal portfolio page.',
            liveSessionLink: 'https://meet.jit.si/evolvix-html-fundamentals',
            assignment: {
              id: 'assign_daily_1',
              title: 'Daily Assignment: Personal Portfolio Page',
              description: 'Create a responsive personal portfolio page using HTML5 semantic elements. Include sections for About, Skills, Projects, and Contact. Use proper form validation.',
              dueDate: '2024-12-20',
              maxScore: 100
            }
          },
          {
            id: 'l12',
            moduleId: 'm6',
            title: 'CSS Flexbox & Grid (Live Session)',
            duration: '90 min',
            type: 'video',
            content: 'Master CSS layout with Flexbox and Grid. Build responsive layouts. Daily assignment: Create a responsive dashboard layout.',
            liveSessionLink: 'https://meet.jit.si/evolvix-css-layouts',
            assignment: {
              id: 'assign_daily_2',
              title: 'Daily Assignment: Responsive Dashboard Layout',
              description: 'Build a responsive dashboard layout using CSS Grid and Flexbox. Include sidebar, header, main content area, and cards. Must work on mobile, tablet, and desktop.',
              dueDate: '2024-12-21',
              maxScore: 100
            }
          },
          {
            id: 'l13',
            moduleId: 'm6',
            title: 'JavaScript ES6+ Fundamentals (Live Session)',
            duration: '120 min',
            type: 'video',
            content: 'Learn modern JavaScript: arrow functions, destructuring, async/await, promises. Daily assignment: Build a todo app with local storage.',
            liveSessionLink: 'https://meet.jit.si/evolvix-js-fundamentals',
            assignment: {
              id: 'assign_daily_3',
              title: 'Daily Assignment: Todo App with Local Storage',
              description: 'Create a todo application using vanilla JavaScript. Features: add, delete, mark complete, filter todos. Persist data using localStorage.',
              dueDate: '2024-12-22',
              maxScore: 150
            }
          }
        ]
      },
      {
        id: 'm7',
        courseId: '5',
        title: 'React Development',
        description: 'Build modern UIs with React',
        lessons: [
          {
            id: 'l14',
            moduleId: 'm7',
            title: 'React Components & Props (Live Session)',
            duration: '120 min',
            type: 'video',
            content: 'Learn React fundamentals: components, props, JSX. Daily assignment: Build a weather widget component.',
            liveSessionLink: 'https://meet.jit.si/evolvix-react-components',
            assignment: {
              id: 'assign_daily_4',
              title: 'Daily Assignment: Weather Widget Component',
              description: 'Create a React component that displays weather information. Use props to pass data. Include temperature, condition, and location.',
              dueDate: '2024-12-25',
              maxScore: 100
            }
          },
          {
            id: 'l15',
            moduleId: 'm7',
            title: 'React Hooks & State Management (Live Session)',
            duration: '120 min',
            type: 'video',
            content: 'Master useState, useEffect, useContext. Daily assignment: Build a shopping cart with state management.',
            liveSessionLink: 'https://meet.jit.si/evolvix-react-hooks',
            assignment: {
              id: 'assign_daily_5',
              title: 'Daily Assignment: Shopping Cart with Hooks',
              description: 'Build a shopping cart component using React hooks. Features: add items, remove items, update quantities, calculate total. Use useState and useEffect.',
              dueDate: '2024-12-26',
              maxScore: 150
            }
          }
        ]
      },
      {
        id: 'm8',
        courseId: '5',
        title: 'Backend Development with Node.js',
        description: 'Build RESTful APIs and server-side logic',
        lessons: [
          {
            id: 'l16',
            moduleId: 'm8',
            title: 'Node.js & Express Setup (Live Session)',
            duration: '120 min',
            type: 'video',
            content: 'Set up Node.js server with Express. Create routes and middleware. Daily assignment: Build a REST API for a blog.',
            liveSessionLink: 'https://meet.jit.si/evolvix-node-backend',
            assignment: {
              id: 'assign_daily_6',
              title: 'Daily Assignment: Blog REST API',
              description: 'Create a REST API for a blog with endpoints: GET /posts, POST /posts, PUT /posts/:id, DELETE /posts/:id. Use Express and store data in memory (JSON file).',
              dueDate: '2024-12-29',
              maxScore: 150
            }
          },
          {
            id: 'l17',
            moduleId: 'm8',
            title: 'MongoDB & Database Integration (Live Session)',
            duration: '120 min',
            type: 'video',
            content: 'Connect to MongoDB, create schemas, perform CRUD operations. Daily assignment: Integrate MongoDB with your blog API.',
            liveSessionLink: 'https://meet.jit.si/evolvix-mongodb',
            assignment: {
              id: 'assign_daily_7',
              title: 'Daily Assignment: MongoDB Integration',
              description: 'Integrate MongoDB with your blog API. Create Post schema, connect to database, update all endpoints to use MongoDB. Include error handling.',
              dueDate: '2024-12-30',
              maxScore: 150
            }
          }
        ]
      }
    ],
    prerequisites: [],
    requirements: [
      'Basic computer skills',
      'Stable internet connection',
      'Code editor (VS Code recommended)',
      'Node.js installed'
    ],
    enrolledCount: 45,
    createdAt: '2024-12-01',
    updatedAt: '2024-12-15',
    courseType: 'live' as const,
    schedule: {
      frequency: 'daily',
      time: '19:00',
      duration: 120,
      startDate: '2024-12-20',
      endDate: '2025-03-15',
      admissionDeadline: '2024-12-15'
    },
    allowStudentPreferences: true,
    projects: [
      {
        id: 'proj_live_3',
        projectNumber: 1,
        title: 'E-Commerce Frontend Project',
        description: 'Build a complete e-commerce frontend with product listing, search, filters, cart, and checkout. This project covers Module 1 & 2 concepts.',
        technologies: ['React', 'CSS', 'JavaScript', 'React Router'],
        requirements: [
          'Product catalog with search and filters',
          'Shopping cart functionality',
          'User authentication UI',
          'Responsive design',
          'State management with hooks'
        ],
        difficulty: 'intermediate',
        estimatedDuration: '2 weeks',
        dueDate: '2025-01-10',
        maxScore: 300,
        weight: 25,
        isFinalProject: false
      },
      {
        id: 'proj_live_4',
        projectNumber: 2,
        title: 'Social Media API Backend',
        description: 'Create a complete REST API for a social media platform. Includes user authentication, posts, comments, likes, and followers. Covers Module 3 concepts.',
        technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Mongoose'],
        requirements: [
          'User authentication and authorization',
          'CRUD operations for posts',
          'Comment and like system',
          'Follow/unfollow functionality',
          'API documentation'
        ],
        difficulty: 'intermediate',
        estimatedDuration: '2 weeks',
        dueDate: '2025-01-24',
        maxScore: 350,
        weight: 30,
        isFinalProject: false
      },
      {
        id: 'proj_live_5',
        projectNumber: 3,
        title: 'Full-Stack Application (Final Project)',
        description: 'Build your own full-stack application combining frontend and backend. Choose your own project idea and implement all features.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
        requirements: [
          'Choose your own project idea',
          'React frontend with routing',
          'Node.js backend with REST API',
          'MongoDB database',
          'User authentication',
          'Deployment to production'
        ],
        difficulty: 'advanced',
        estimatedDuration: '4 weeks',
        dueDate: '2025-03-01',
        maxScore: 500,
        weight: 45,
        isFinalProject: true,
        finalProjectGuidelines: 'Choose your own project idea. Must include: React frontend, Node.js backend, MongoDB database, user authentication, and deployment. Project should solve a real-world problem.'
      }
    ]
  },
  // NEW MOCK COURSE 2 - LIVE COURSE
  {
    id: '6',
    title: 'Live Mobile App Development with React Native',
    description: 'Learn to build cross-platform mobile apps using React Native. Daily live coding sessions covering components, navigation, state management, and API integration. Build 3 real mobile apps throughout the course with daily assignments and projects.',
    shortDescription: 'Build mobile apps with React Native through live sessions',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    category: 'development',
    level: 'intermediate',
    skills: ['React Native', 'JavaScript', 'Mobile Development', 'Navigation', 'State Management', 'API Integration'],
    rating: 4.7,
    ratingCount: 89,
    duration: '10 weeks',
    language: 'English',
    instructor: {
      id: 'suhxil14@gmail.com',
      name: 'Maria Garcia',
      title: 'Mobile App Developer at Meta',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 4.8,
      studentsCount: 2100,
      bio: 'Expert in React Native with 8+ years building mobile apps'
    },
    price: 179,
    scholarshipAvailable: true,
    modules: [
      {
        id: 'm9',
        courseId: '6',
        title: 'React Native Fundamentals',
        description: 'Get started with React Native development',
        lessons: [
          {
            id: 'l18',
            moduleId: 'm9',
            title: 'React Native Setup & First App (Live Session)',
            duration: '90 min',
            type: 'video',
            content: 'Set up React Native development environment. Create your first mobile app. Daily assignment: Build a welcome screen app.',
            liveSessionLink: 'https://meet.jit.si/evolvix-rn-setup',
            assignment: {
              id: 'assign_daily_8',
              title: 'Daily Assignment: Welcome Screen App',
              description: 'Create a React Native app with a welcome screen. Include app logo, welcome message, and a button to navigate to next screen. Style it beautifully.',
              dueDate: '2025-01-05',
              maxScore: 100
            }
          },
          {
            id: 'l19',
            moduleId: 'm9',
            title: 'Components & Styling (Live Session)',
            duration: '90 min',
            type: 'video',
            content: 'Learn React Native components, StyleSheet API, and Flexbox. Daily assignment: Build a profile card component.',
            liveSessionLink: 'https://meet.jit.si/evolvix-rn-components',
            assignment: {
              id: 'assign_daily_9',
              title: 'Daily Assignment: Profile Card Component',
              description: 'Create a profile card component with user avatar, name, bio, and social links. Use StyleSheet and Flexbox for layout. Make it responsive.',
              dueDate: '2025-01-06',
              maxScore: 100
            }
          }
        ]
      },
      {
        id: 'm10',
        courseId: '6',
        title: 'Navigation & State Management',
        description: 'Implement navigation and manage app state',
        lessons: [
          {
            id: 'l20',
            moduleId: 'm10',
            title: 'React Navigation (Live Session)',
            duration: '120 min',
            type: 'video',
            content: 'Set up navigation with React Navigation. Stack, Tab, and Drawer navigators. Daily assignment: Build a multi-screen app with navigation.',
            liveSessionLink: 'https://meet.jit.si/evolvix-rn-navigation',
            assignment: {
              id: 'assign_daily_10',
              title: 'Daily Assignment: Multi-Screen App',
              description: 'Create a React Native app with 3 screens: Home, Profile, Settings. Implement stack navigation. Add navigation buttons and header.',
              dueDate: '2025-01-10',
              maxScore: 150
            }
          },
          {
            id: 'l21',
            moduleId: 'm10',
            title: 'State Management with Redux (Live Session)',
            duration: '120 min',
            type: 'video',
            content: 'Integrate Redux for state management. Actions, reducers, and store. Daily assignment: Add Redux to your app.',
            liveSessionLink: 'https://meet.jit.si/evolvix-rn-redux',
            assignment: {
              id: 'assign_daily_11',
              title: 'Daily Assignment: Redux Integration',
              description: 'Integrate Redux into your React Native app. Create actions and reducers for user data. Connect components to Redux store.',
              dueDate: '2025-01-11',
              maxScore: 150
            }
          }
        ]
      },
      {
        id: 'm11',
        courseId: '6',
        title: 'API Integration & Advanced Features',
        description: 'Connect to APIs and implement advanced features',
        lessons: [
          {
            id: 'l22',
            moduleId: 'm11',
            title: 'Fetch API & Async Operations (Live Session)',
            duration: '120 min',
            type: 'video',
            content: 'Fetch data from REST APIs, handle async operations, loading states. Daily assignment: Build a news feed app with API integration.',
            liveSessionLink: 'https://meet.jit.si/evolvix-rn-api',
            assignment: {
              id: 'assign_daily_12',
              title: 'Daily Assignment: News Feed App',
              description: 'Create a React Native app that fetches news articles from a public API. Display articles in a list with images, titles, and descriptions. Add pull-to-refresh.',
              dueDate: '2025-01-15',
              maxScore: 150
            }
          }
        ]
      }
    ],
    prerequisites: [
      {
        id: 'p5',
        title: 'React Fundamentals',
        description: 'Basic understanding of React',
        completed: false
      }
    ],
    requirements: [
      'React basics',
      'JavaScript ES6+',
      'Node.js installed',
      'Android Studio or Xcode (for emulator)'
    ],
    enrolledCount: 32,
    createdAt: '2024-12-05',
    updatedAt: '2024-12-18',
    courseType: 'live' as const,
    schedule: {
      frequency: 'daily',
      time: '20:00',
      duration: 90,
      startDate: '2025-01-05',
      endDate: '2025-03-15',
      admissionDeadline: '2025-01-01'
    },
    allowStudentPreferences: false,
    projects: [
      {
        id: 'proj_live_6',
        projectNumber: 1,
        title: 'Todo Mobile App',
        description: 'Build a complete todo mobile app with local storage. Covers Module 1 & 2 concepts.',
        technologies: ['React Native', 'AsyncStorage', 'React Navigation'],
        requirements: [
          'Add, edit, delete todos',
          'Mark todos as complete',
          'Filter todos (all, active, completed)',
          'Persist data with AsyncStorage',
          'Beautiful UI/UX'
        ],
        difficulty: 'beginner',
        estimatedDuration: '1 week',
        dueDate: '2025-01-20',
        maxScore: 200,
        weight: 20,
        isFinalProject: false
      },
      {
        id: 'proj_live_7',
        projectNumber: 2,
        title: 'Weather App with API',
        description: 'Create a weather app that fetches real-time weather data. Covers Module 3 concepts.',
        technologies: ['React Native', 'API Integration', 'React Navigation', 'Redux'],
        requirements: [
          'Search weather by city',
          'Display current weather and forecast',
          'Beautiful weather icons',
          'Location-based weather',
          'Offline support'
        ],
        difficulty: 'intermediate',
        estimatedDuration: '2 weeks',
        dueDate: '2025-02-05',
        maxScore: 300,
        weight: 30,
        isFinalProject: false
      },
      {
        id: 'proj_live_8',
        projectNumber: 3,
        title: 'Social Media Mobile App (Final Project)',
        description: 'Build your own social media mobile app. Choose features and implement them.',
        technologies: ['React Native', 'Backend API', 'Redux', 'React Navigation'],
        requirements: [
          'User authentication',
          'Create and view posts',
          'Like and comment on posts',
          'User profiles',
          'Real-time updates',
          'Push notifications'
        ],
        difficulty: 'advanced',
        estimatedDuration: '4 weeks',
        dueDate: '2025-03-01',
        maxScore: 500,
        weight: 50,
        isFinalProject: true,
        finalProjectGuidelines: 'Build a complete social media mobile app. Must include: authentication, posts, interactions, profiles, and real-time features. Choose your own unique features to differentiate your app.'
      }
    ]
  },
  // NEW MOCK COURSE 3 - RECORDED COURSE
  {
    id: '7',
    title: 'Complete Python Data Science & Machine Learning',
    description: 'Master Python for data science and machine learning. Learn pandas, numpy, matplotlib, scikit-learn, and TensorFlow. Build real-world projects, complete assignments, and take quizzes. Includes video lessons with timestamps, comprehensive assignments, tests, and 3 major projects. Perfect for self-paced learning.',
    shortDescription: 'Master Python data science and ML with comprehensive content',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    category: 'data-science',
    level: 'intermediate',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'Machine Learning', 'Data Visualization'],
    rating: 4.9,
    ratingCount: 342,
    duration: '50 hours',
    language: 'English',
    instructor: {
      id: 'suhxil14@gmail.com',
      name: 'Dr. Robert Kim',
      title: 'Data Scientist at Google',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 4.9,
      studentsCount: 5670,
      bio: 'PhD in Machine Learning, 12+ years in data science'
    },
    price: 149,
    scholarshipAvailable: true,
    modules: [
      {
        id: 'm12',
        courseId: '7',
        title: 'Python for Data Science',
        description: 'Python fundamentals for data analysis',
        lessons: [
          {
            id: 'l23',
            moduleId: 'm12',
            title: 'Python Basics & Data Types',
            duration: '25:30',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts6', title: 'Introduction', timestamp: 0 },
              { id: 'ts7', title: 'Python Installation', timestamp: 120 },
              { id: 'ts8', title: 'Data Types', timestamp: 450 },
              { id: 'ts9', title: 'Variables & Operators', timestamp: 780 },
              { id: 'ts10', title: 'Summary', timestamp: 1500 }
            ],
            assignment: {
              id: 'assign_rec_1',
              title: 'Python Basics Assignment',
              description: 'Complete the following exercises: 1) Create variables for different data types, 2) Perform arithmetic operations, 3) Work with strings and lists, 4) Write a function to calculate factorial. Submit your code via GitHub.',
              dueDate: '2025-01-15',
              maxScore: 100
            },
            test: {
              id: 'test_rec_1',
              title: 'Python Basics Quiz',
              questions: [
                {
                  id: 'q1',
                  question: 'What is the output of print(type([1, 2, 3]))?',
                  type: 'multiple-choice',
                  options: ['list', 'tuple', 'array', 'dict'],
                  correctAnswer: 'list',
                  points: 10
                },
                {
                  id: 'q2',
                  question: 'Python is a dynamically typed language.',
                  type: 'true-false',
                  correctAnswer: 'true',
                  points: 10
                },
                {
                  id: 'q3',
                  question: 'What is a list comprehension?',
                  type: 'short-answer',
                  correctAnswer: 'A concise way to create lists',
                  points: 20
                }
              ],
              passingScore: 60,
              timeLimit: 15
            }
          },
          {
            id: 'l24',
            moduleId: 'm12',
            title: 'Working with Pandas DataFrames',
            duration: '32:15',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts11', title: 'Introduction to Pandas', timestamp: 0 },
              { id: 'ts12', title: 'Creating DataFrames', timestamp: 180 },
              { id: 'ts13', title: 'Reading CSV Files', timestamp: 600 },
              { id: 'ts14', title: 'Data Selection & Filtering', timestamp: 1200 },
              { id: 'ts15', title: 'Data Manipulation', timestamp: 1800 }
            ],
            assignment: {
              id: 'assign_rec_2',
              title: 'Pandas Data Analysis Assignment',
              description: 'Load a CSV dataset, perform data cleaning, filtering, and basic analysis. Tasks: 1) Load dataset, 2) Display basic statistics, 3) Filter data based on conditions, 4) Create new columns, 5) Export results. Use a real dataset (e.g., Titanic, Iris).',
              dueDate: '2025-01-20',
              maxScore: 150
            },
            test: {
              id: 'test_rec_2',
              title: 'Pandas Quiz',
              questions: [
                {
                  id: 'q4',
                  question: 'What method is used to read a CSV file in Pandas?',
                  type: 'multiple-choice',
                  options: ['read_csv()', 'load_csv()', 'import_csv()', 'get_csv()'],
                  correctAnswer: 'read_csv()',
                  points: 10
                },
                {
                  id: 'q5',
                  question: 'How do you select a column in a DataFrame?',
                  type: 'short-answer',
                  correctAnswer: 'df["column_name"] or df.column_name',
                  points: 20
                }
              ],
              passingScore: 70,
              timeLimit: 20
            }
          }
        ]
      },
      {
        id: 'm13',
        courseId: '7',
        title: 'Data Visualization',
        description: 'Create beautiful visualizations with Matplotlib and Seaborn',
        lessons: [
          {
            id: 'l25',
            moduleId: 'm13',
            title: 'Matplotlib Fundamentals',
            duration: '28:45',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts16', title: 'Introduction to Matplotlib', timestamp: 0 },
              { id: 'ts17', title: 'Line Plots', timestamp: 300 },
              { id: 'ts18', title: 'Bar Charts', timestamp: 900 },
              { id: 'ts19', title: 'Scatter Plots', timestamp: 1500 }
            ],
            assignment: {
              id: 'assign_rec_3',
              title: 'Data Visualization Assignment',
              description: 'Create 5 different types of visualizations using Matplotlib: line plot, bar chart, scatter plot, histogram, and box plot. Use real data and make them publication-ready with proper labels, titles, and styling.',
              dueDate: '2025-01-25',
              maxScore: 150
            }
          },
          {
            id: 'l26',
            moduleId: 'm13',
            title: 'Advanced Visualization with Seaborn',
            duration: '35:20',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts20', title: 'Seaborn Introduction', timestamp: 0 },
              { id: 'ts21', title: 'Statistical Plots', timestamp: 600 },
              { id: 'ts22', title: 'Heatmaps', timestamp: 1500 },
              { id: 'ts23', title: 'Pair Plots', timestamp: 2100 }
            ],
            assignment: {
              id: 'assign_rec_4',
              title: 'Seaborn Visualization Project',
              description: 'Create a comprehensive data visualization dashboard using Seaborn. Include: correlation heatmap, pair plots, distribution plots, and statistical visualizations. Use a real dataset and provide insights.',
              dueDate: '2025-01-30',
              maxScore: 200
            }
          }
        ]
      },
      {
        id: 'm14',
        courseId: '7',
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning algorithms',
        lessons: [
          {
            id: 'l27',
            moduleId: 'm14',
            title: 'Introduction to Machine Learning',
            duration: '30:00',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts24', title: 'What is ML?', timestamp: 0 },
              { id: 'ts25', title: 'Supervised vs Unsupervised', timestamp: 600 },
              { id: 'ts26', title: 'ML Workflow', timestamp: 1500 },
              { id: 'ts27', title: 'Model Evaluation', timestamp: 2400 }
            ],
            assignment: {
              id: 'assign_rec_5',
              title: 'ML Workflow Assignment',
              description: 'Complete a full machine learning workflow: 1) Load and explore data, 2) Preprocess data, 3) Split into train/test, 4) Train a model, 5) Evaluate performance. Use scikit-learn.',
              dueDate: '2025-02-05',
              maxScore: 200
            },
            test: {
              id: 'test_rec_3',
              title: 'Machine Learning Quiz',
              questions: [
                {
                  id: 'q6',
                  question: 'What is the difference between supervised and unsupervised learning?',
                  type: 'short-answer',
                  correctAnswer: 'Supervised uses labeled data, unsupervised uses unlabeled data',
                  points: 25
                },
                {
                  id: 'q7',
                  question: 'What is overfitting?',
                  type: 'short-answer',
                  correctAnswer: 'Model performs well on training data but poorly on test data',
                  points: 25
                }
              ],
              passingScore: 70,
              timeLimit: 30
            }
          },
          {
            id: 'l28',
            moduleId: 'm14',
            title: 'Linear Regression & Classification',
            duration: '40:15',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts28', title: 'Linear Regression', timestamp: 0 },
              { id: 'ts29', title: 'Logistic Regression', timestamp: 1200 },
              { id: 'ts30', title: 'Classification Metrics', timestamp: 2000 },
              { id: 'ts31', title: 'Hands-on Example', timestamp: 3000 }
            ],
            assignment: {
              id: 'assign_rec_6',
              title: 'Regression & Classification Project',
              description: 'Build two models: 1) Linear regression model to predict house prices, 2) Logistic regression model for classification. Include data preprocessing, model training, evaluation, and visualization of results.',
              dueDate: '2025-02-10',
              maxScore: 250
            }
          }
        ]
      },
      {
        id: 'm15',
        courseId: '7',
        title: 'Deep Learning with TensorFlow',
        description: 'Build neural networks with TensorFlow',
        lessons: [
          {
            id: 'l29',
            moduleId: 'm15',
            title: 'Introduction to Neural Networks',
            duration: '35:30',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts32', title: 'Neural Network Basics', timestamp: 0 },
              { id: 'ts33', title: 'Activation Functions', timestamp: 900 },
              { id: 'ts34', title: 'Backpropagation', timestamp: 1800 },
              { id: 'ts35', title: 'TensorFlow Introduction', timestamp: 2400 }
            ],
            assignment: {
              id: 'assign_rec_7',
              title: 'First Neural Network',
              description: 'Build your first neural network using TensorFlow/Keras. Create a model for image classification (e.g., MNIST dataset). Include: model architecture, compilation, training, and evaluation.',
              dueDate: '2025-02-15',
              maxScore: 250
            }
          }
        ]
      }
    ],
    prerequisites: [
      {
        id: 'p6',
        title: 'Python Basics',
        description: 'Basic Python programming knowledge',
        completed: false
      }
    ],
    requirements: [
      'Python 3.8+ installed',
      'Jupyter Notebook',
      'Basic math knowledge',
      'Computer with 8GB+ RAM'
    ],
    enrolledCount: 567,
    createdAt: '2024-11-15',
    updatedAt: '2024-12-10',
    courseType: 'recorded' as const,
    enableSundayDoubtClearing: true,
    projects: [
      {
        id: 'proj_rec_1',
        projectNumber: 1,
        title: 'Exploratory Data Analysis Project',
        description: 'Perform comprehensive EDA on a real-world dataset. Analyze patterns, create visualizations, and provide insights.',
        technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'NumPy'],
        requirements: [
          'Load and clean dataset',
          'Perform statistical analysis',
          'Create at least 10 visualizations',
          'Identify patterns and correlations',
          'Write comprehensive insights report'
        ],
        difficulty: 'intermediate',
        estimatedDuration: '2 weeks',
        dueDate: '2025-02-01',
        maxScore: 300,
        weight: 25,
        isFinalProject: false
      },
      {
        id: 'proj_rec_2',
        projectNumber: 2,
        title: 'Machine Learning Prediction Model',
        description: 'Build a complete ML model to solve a real-world prediction problem. Include data preprocessing, feature engineering, model selection, and evaluation.',
        technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
        requirements: [
          'Choose a prediction problem',
          'Preprocess and engineer features',
          'Train multiple models',
          'Compare model performance',
          'Deploy best model',
          'Documentation and report'
        ],
        difficulty: 'intermediate',
        estimatedDuration: '3 weeks',
        dueDate: '2025-02-20',
        maxScore: 400,
        weight: 35,
        isFinalProject: false
      },
      {
        id: 'proj_rec_3',
        projectNumber: 3,
        title: 'Deep Learning Project (Final Project)',
        description: 'Build a deep learning model for image classification, NLP, or time series prediction. Choose your own project.',
        technologies: ['Python', 'TensorFlow', 'Keras', 'NumPy'],
        requirements: [
          'Choose your own deep learning project',
          'Collect or use appropriate dataset',
          'Design and train neural network',
          'Evaluate model performance',
          'Deploy model (optional)',
          'Comprehensive documentation'
        ],
        difficulty: 'advanced',
        estimatedDuration: '4 weeks',
        dueDate: '2025-03-10',
        maxScore: 500,
        weight: 40,
        isFinalProject: true,
        finalProjectGuidelines: 'Choose your own deep learning project. Options: image classification, NLP sentiment analysis, time series forecasting, or any other deep learning application. Must include: data preparation, model design, training, evaluation, and documentation.'
      }
    ],
    doubtClearingSessions: [
      {
        id: 'doubt_1',
        courseId: '7',
        date: '2025-01-05',
        time: '14:00',
        duration: 60,
        platform: 'zoom',
        meetingLink: 'https://zoom.us/j/123456789',
        meetingId: '123456789',
        status: 'scheduled',
        attendance: []
      }
    ]
  },
  // NEW MOCK COURSE 4 - RECORDED COURSE
  {
    id: '8',
    title: 'Complete UI/UX Design Masterclass',
    description: 'Master UI/UX design from scratch. Learn design principles, user research, prototyping, and design systems. Includes video lessons with timestamps, practical assignments, quizzes, and portfolio projects. Build a complete design portfolio by the end of the course.',
    shortDescription: 'Master UI/UX design with comprehensive video content',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    category: 'design',
    level: 'beginner',
    skills: ['Figma', 'UX Research', 'Prototyping', 'Design Systems', 'User Testing', 'Wireframing', 'Visual Design'],
    rating: 4.7,
    ratingCount: 234,
    duration: '35 hours',
    language: 'English',
    instructor: {
      id: 'suhxil14@gmail.com',
      name: 'Sophie Martinez',
      title: 'Senior UX Designer at Apple',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 4.8,
      studentsCount: 3450,
      bio: 'Award-winning designer with 10+ years in product design'
    },
    price: 129,
    scholarshipAvailable: false,
    modules: [
      {
        id: 'm16',
        courseId: '8',
        title: 'Design Fundamentals',
        description: 'Learn the basics of design',
        lessons: [
          {
            id: 'l30',
            moduleId: 'm16',
            title: 'Introduction to UI/UX Design',
            duration: '22:15',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts36', title: 'What is UI/UX?', timestamp: 0 },
              { id: 'ts37', title: 'UI vs UX', timestamp: 300 },
              { id: 'ts38', title: 'Design Process', timestamp: 900 },
              { id: 'ts39', title: 'Career Paths', timestamp: 1500 }
            ],
            assignment: {
              id: 'assign_rec_8',
              title: 'Design Analysis Assignment',
              description: 'Analyze 3 mobile apps or websites. Document: 1) UI elements, 2) UX flow, 3) Strengths and weaknesses, 4) Suggestions for improvement. Create a presentation or document.',
              dueDate: '2025-01-20',
              maxScore: 100
            },
            test: {
              id: 'test_rec_4',
              title: 'Design Fundamentals Quiz',
              questions: [
                {
                  id: 'q8',
                  question: 'What is the difference between UI and UX?',
                  type: 'short-answer',
                  correctAnswer: 'UI is visual design, UX is user experience',
                  points: 25
                },
                {
                  id: 'q9',
                  question: 'What are the main stages of the design process?',
                  type: 'multiple-choice',
                  options: ['Research, Design, Test', 'Ideate, Prototype, Test', 'All of the above', 'None'],
                  correctAnswer: 'All of the above',
                  points: 25
                }
              ],
              passingScore: 70,
              timeLimit: 15
            }
          },
          {
            id: 'l31',
            moduleId: 'm16',
            title: 'Design Principles & Color Theory',
            duration: '28:30',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts40', title: 'Design Principles', timestamp: 0 },
              { id: 'ts41', title: 'Color Theory', timestamp: 900 },
              { id: 'ts42', title: 'Typography', timestamp: 1800 },
              { id: 'ts43', title: 'Spacing & Layout', timestamp: 2400 }
            ],
            assignment: {
              id: 'assign_rec_9',
              title: 'Design System Exercise',
              description: 'Create a basic design system with: 1) Color palette (primary, secondary, neutral), 2) Typography scale, 3) Spacing system, 4) Button styles. Document in Figma.',
              dueDate: '2025-01-25',
              maxScore: 150
            }
          }
        ]
      },
      {
        id: 'm17',
        courseId: '8',
        title: 'User Research & Personas',
        description: 'Learn user research methods',
        lessons: [
          {
            id: 'l32',
            moduleId: 'm17',
            title: 'User Research Methods',
            duration: '30:45',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts44', title: 'Research Methods', timestamp: 0 },
              { id: 'ts45', title: 'Interviews & Surveys', timestamp: 900 },
              { id: 'ts46', title: 'User Personas', timestamp: 1800 },
              { id: 'ts47', title: 'User Journeys', timestamp: 2400 }
            ],
            assignment: {
              id: 'assign_rec_10',
              title: 'User Research Project',
              description: 'Conduct user research for a product idea. Tasks: 1) Create research plan, 2) Conduct 3 user interviews, 3) Create 2 user personas, 4) Map user journey, 5) Document findings.',
              dueDate: '2025-02-01',
              maxScore: 200
            }
          },
          {
            id: 'l33',
            moduleId: 'm17',
            title: 'Information Architecture',
            duration: '25:20',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts48', title: 'IA Fundamentals', timestamp: 0 },
              { id: 'ts49', title: 'Sitemaps', timestamp: 900 },
              { id: 'ts50', title: 'Card Sorting', timestamp: 1500 }
            ],
            assignment: {
              id: 'assign_rec_11',
              title: 'Information Architecture Assignment',
              description: 'Create information architecture for a website or app. Include: 1) Sitemap, 2) User flow diagrams, 3) Content hierarchy. Use Figma or Miro.',
              dueDate: '2025-02-05',
              maxScore: 150
            }
          }
        ]
      },
      {
        id: 'm18',
        courseId: '8',
        title: 'Wireframing & Prototyping',
        description: 'Create wireframes and interactive prototypes',
        lessons: [
          {
            id: 'l34',
            moduleId: 'm18',
            title: 'Wireframing in Figma',
            duration: '32:00',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts51', title: 'Figma Basics', timestamp: 0 },
              { id: 'ts52', title: 'Creating Wireframes', timestamp: 900 },
              { id: 'ts53', title: 'Low-fidelity Design', timestamp: 1800 },
              { id: 'ts54', title: 'Best Practices', timestamp: 2400 }
            ],
            assignment: {
              id: 'assign_rec_12',
              title: 'Wireframe Project',
              description: 'Create wireframes for a mobile app (5+ screens). Include: 1) Low-fidelity wireframes, 2) Annotations, 3) User flow. Use Figma.',
              dueDate: '2025-02-10',
              maxScore: 150
            }
          },
          {
            id: 'l35',
            moduleId: 'm18',
            title: 'High-Fidelity Design & Prototyping',
            duration: '35:15',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts55', title: 'High-Fidelity Design', timestamp: 0 },
              { id: 'ts56', title: 'Prototyping', timestamp: 1500 },
              { id: 'ts57', title: 'Interactive Prototypes', timestamp: 2400 },
              { id: 'ts58', title: 'Prototype Testing', timestamp: 3000 }
            ],
            assignment: {
              id: 'assign_rec_13',
              title: 'High-Fidelity Prototype',
              description: 'Create high-fidelity designs and interactive prototype for your wireframe project. Include: 1) Complete visual design, 2) Interactive prototype with animations, 3) Design system documentation.',
              dueDate: '2025-02-15',
              maxScore: 200
            }
          }
        ]
      },
      {
        id: 'm19',
        courseId: '8',
        title: 'User Testing & Iteration',
        description: 'Test designs and iterate based on feedback',
        lessons: [
          {
            id: 'l36',
            moduleId: 'm19',
            title: 'Usability Testing',
            duration: '28:45',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts59', title: 'Testing Methods', timestamp: 0 },
              { id: 'ts60', title: 'Conducting Tests', timestamp: 900 },
              { id: 'ts61', title: 'Analyzing Results', timestamp: 1800 },
              { id: 'ts62', title: 'Iterating Designs', timestamp: 2400 }
            ],
            assignment: {
              id: 'assign_rec_14',
              title: 'Usability Testing Project',
              description: 'Conduct usability testing on your prototype. Tasks: 1) Create test plan, 2) Recruit 3-5 participants, 3) Conduct tests, 4) Analyze results, 5) Create iteration plan.',
              dueDate: '2025-02-20',
              maxScore: 200
            }
          }
        ]
      }
    ],
    prerequisites: [],
    requirements: [
      'Figma account (free tier works)',
      'Passion for design',
      'Basic computer skills'
    ],
    enrolledCount: 423,
    createdAt: '2024-11-20',
    updatedAt: '2024-12-12',
    courseType: 'recorded' as const,
    enableSundayDoubtClearing: true,
    projects: [
      {
        id: 'proj_rec_4',
        projectNumber: 1,
        title: 'Mobile App UI Design',
        description: 'Design a complete mobile app interface from scratch. Apply all design principles learned.',
        technologies: ['Figma', 'Design Systems'],
        requirements: [
          'User research and personas',
          'Wireframes (low and high fidelity)',
          'Complete visual design',
          'Interactive prototype',
          'Design system documentation'
        ],
        difficulty: 'intermediate',
        estimatedDuration: '3 weeks',
        dueDate: '2025-02-25',
        maxScore: 350,
        weight: 30,
        isFinalProject: false
      },
      {
        id: 'proj_rec_5',
        projectNumber: 2,
        title: 'Website Redesign Project',
        description: 'Redesign an existing website. Conduct research, create new design, and prototype.',
        technologies: ['Figma', 'Prototyping'],
        requirements: [
          'Competitive analysis',
          'User research',
          'New design solution',
          'High-fidelity prototype',
          'Usability testing',
          'Case study documentation'
        ],
        difficulty: 'intermediate',
        estimatedDuration: '3 weeks',
        dueDate: '2025-03-10',
        maxScore: 400,
        weight: 35,
        isFinalProject: false
      },
      {
        id: 'proj_rec_6',
        projectNumber: 3,
        title: 'Portfolio Project (Final Project)',
        description: 'Create a complete design portfolio showcasing your work. Choose your own project.',
        technologies: ['Figma', 'Portfolio Tools'],
        requirements: [
          'Choose your own project',
          'Complete design process documentation',
          'Multiple project case studies',
          'Professional portfolio presentation',
          'Resume and cover letter design'
        ],
        difficulty: 'advanced',
        estimatedDuration: '4 weeks',
        dueDate: '2025-03-25',
        maxScore: 500,
        weight: 35,
        isFinalProject: true,
        finalProjectGuidelines: 'Create a complete design portfolio. Must include: 3+ project case studies, design process documentation, professional presentation, and resume. Choose projects that showcase your best work and different skills.'
      }
    ],
    doubtClearingSessions: [
      {
        id: 'doubt_2',
        courseId: '8',
        date: '2025-01-12',
        time: '15:00',
        duration: 60,
        platform: 'jitsi',
        meetingLink: 'https://meet.jit.si/evolvix-design-doubt',
        status: 'scheduled',
        attendance: []
      }
    ]
  },
  // NEW MOCK COURSE 5 - RECORDED COURSE
  {
    id: '9',
    title: 'Advanced JavaScript & Modern Web Development',
    description: 'Master advanced JavaScript concepts, modern frameworks, and web development best practices. Learn ES6+, async programming, design patterns, and build production-ready applications. Includes comprehensive video lessons with timestamps, coding assignments, quizzes, and real-world projects.',
    shortDescription: 'Master advanced JavaScript and modern web development',
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',
    category: 'development',
    level: 'advanced',
    skills: ['JavaScript', 'ES6+', 'Async/Await', 'Design Patterns', 'Webpack', 'Babel', 'Testing', 'Performance'],
    rating: 4.8,
    ratingCount: 189,
    duration: '45 hours',
    language: 'English',
    instructor: {
      id: 'suhxil14@gmail.com',
      name: 'David Wilson',
      title: 'Senior JavaScript Architect at Netflix',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      rating: 4.9,
      studentsCount: 4560,
      bio: 'JavaScript expert with 15+ years building scalable applications'
    },
    price: 159,
    scholarshipAvailable: true,
    modules: [
      {
        id: 'm20',
        courseId: '9',
        title: 'Advanced JavaScript Concepts',
        description: 'Master advanced JavaScript features',
        lessons: [
          {
            id: 'l37',
            moduleId: 'm20',
            title: 'Closures, Scope & Hoisting',
            duration: '30:20',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts63', title: 'Understanding Closures', timestamp: 0 },
              { id: 'ts64', title: 'Scope Chain', timestamp: 900 },
              { id: 'ts65', title: 'Hoisting Explained', timestamp: 1800 },
              { id: 'ts66', title: 'Practical Examples', timestamp: 2400 }
            ],
            assignment: {
              id: 'assign_rec_15',
              title: 'Closures & Scope Assignment',
              description: 'Complete exercises: 1) Create closure examples, 2) Explain scope chain, 3) Debug hoisting issues, 4) Build a module pattern using closures. Submit code with explanations.',
              dueDate: '2025-01-25',
              maxScore: 150
            },
            test: {
              id: 'test_rec_5',
              title: 'Advanced JS Concepts Quiz',
              questions: [
                {
                  id: 'q10',
                  question: 'What is a closure in JavaScript?',
                  type: 'short-answer',
                  correctAnswer: 'A function that has access to variables in its outer scope',
                  points: 25
                },
                {
                  id: 'q11',
                  question: 'What is hoisting?',
                  type: 'short-answer',
                  correctAnswer: 'JavaScript behavior of moving declarations to the top',
                  points: 25
                }
              ],
              passingScore: 70,
              timeLimit: 20
            }
          },
          {
            id: 'l38',
            moduleId: 'm20',
            title: 'Async Programming: Promises & Async/Await',
            duration: '35:45',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts67', title: 'Promises Introduction', timestamp: 0 },
              { id: 'ts68', title: 'Promise Chaining', timestamp: 1200 },
              { id: 'ts69', title: 'Async/Await', timestamp: 2100 },
              { id: 'ts70', title: 'Error Handling', timestamp: 3000 }
            ],
            assignment: {
              id: 'assign_rec_16',
              title: 'Async Programming Project',
              description: 'Build an application that fetches data from multiple APIs: 1) Use Promises, 2) Implement async/await, 3) Handle errors properly, 4) Implement loading states, 5) Chain multiple async operations.',
              dueDate: '2025-01-30',
              maxScore: 200
            }
          },
          {
            id: 'l39',
            moduleId: 'm20',
            title: 'Design Patterns in JavaScript',
            duration: '40:30',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts71', title: 'Creational Patterns', timestamp: 0 },
              { id: 'ts72', title: 'Structural Patterns', timestamp: 1500 },
              { id: 'ts73', title: 'Behavioral Patterns', timestamp: 3000 },
              { id: 'ts74', title: 'Module Pattern', timestamp: 4200 }
            ],
            assignment: {
              id: 'assign_rec_17',
              title: 'Design Patterns Implementation',
              description: 'Implement 5 design patterns: 1) Singleton, 2) Factory, 3) Observer, 4) Module, 5) Strategy. Create practical examples for each pattern. Document usage and benefits.',
              dueDate: '2025-02-05',
              maxScore: 250
            }
          }
        ]
      },
      {
        id: 'm21',
        courseId: '9',
        title: 'Modern JavaScript Tooling',
        description: 'Learn modern build tools and workflows',
        lessons: [
          {
            id: 'l40',
            moduleId: 'm21',
            title: 'Webpack & Module Bundling',
            duration: '32:15',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts75', title: 'Webpack Basics', timestamp: 0 },
              { id: 'ts76', title: 'Configuration', timestamp: 1200 },
              { id: 'ts77', title: 'Loaders & Plugins', timestamp: 2400 },
              { id: 'ts78', title: 'Code Splitting', timestamp: 3600 }
            ],
            assignment: {
              id: 'assign_rec_18',
              title: 'Webpack Configuration Project',
              description: 'Set up a Webpack configuration from scratch: 1) Configure entry and output, 2) Add loaders (Babel, CSS, images), 3) Set up dev server, 4) Implement code splitting, 5) Optimize for production.',
              dueDate: '2025-02-10',
              maxScore: 200
            }
          },
          {
            id: 'l41',
            moduleId: 'm21',
            title: 'Babel & Transpilation',
            duration: '25:30',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts79', title: 'Babel Introduction', timestamp: 0 },
              { id: 'ts80', title: 'Configuring Babel', timestamp: 900 },
              { id: 'ts81', title: 'Presets & Plugins', timestamp: 1800 }
            ],
            assignment: {
              id: 'assign_rec_19',
              title: 'Babel Setup Assignment',
              description: 'Configure Babel for a project: 1) Set up Babel config, 2) Use presets and plugins, 3) Transpile ES6+ code, 4) Test compatibility.',
              dueDate: '2025-02-12',
              maxScore: 150
            }
          }
        ]
      },
      {
        id: 'm22',
        courseId: '9',
        title: 'Testing & Performance',
        description: 'Learn testing and performance optimization',
        lessons: [
          {
            id: 'l42',
            moduleId: 'm22',
            title: 'JavaScript Testing with Jest',
            duration: '28:45',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts82', title: 'Jest Introduction', timestamp: 0 },
              { id: 'ts83', title: 'Writing Tests', timestamp: 1200 },
              { id: 'ts84', title: 'Mocking & Spies', timestamp: 2400 }
            ],
            assignment: {
              id: 'assign_rec_20',
              title: 'Testing Project',
              description: 'Write comprehensive tests for a JavaScript application: 1) Unit tests, 2) Integration tests, 3) Mock external dependencies, 4) Achieve 80%+ code coverage.',
              dueDate: '2025-02-18',
              maxScore: 200
            }
          },
          {
            id: 'l43',
            moduleId: 'm22',
            title: 'Performance Optimization',
            duration: '30:20',
            type: 'video',
            completed: false,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            timestamps: [
              { id: 'ts85', title: 'Performance Metrics', timestamp: 0 },
              { id: 'ts86', title: 'Optimization Techniques', timestamp: 1200 },
              { id: 'ts87', title: 'Memory Management', timestamp: 2400 },
              { id: 'ts88', title: 'Profiling Tools', timestamp: 3000 }
            ],
            assignment: {
              id: 'assign_rec_21',
              title: 'Performance Optimization Project',
              description: 'Optimize an existing application: 1) Profile performance, 2) Identify bottlenecks, 3) Implement optimizations, 4) Measure improvements, 5) Document changes.',
              dueDate: '2025-02-22',
              maxScore: 200
            }
          }
        ]
      }
    ],
    prerequisites: [
      {
        id: 'p7',
        title: 'JavaScript Fundamentals',
        description: 'Strong JavaScript basics required',
        completed: false
      }
    ],
    requirements: [
      'Strong JavaScript fundamentals',
      'Node.js installed',
      'Code editor (VS Code)',
      'Git knowledge'
    ],
    enrolledCount: 278,
    createdAt: '2024-11-25',
    updatedAt: '2024-12-14',
    courseType: 'recorded' as const,
    enableSundayDoubtClearing: true,
    projects: [
      {
        id: 'proj_rec_7',
        projectNumber: 1,
        title: 'Advanced JavaScript Application',
        description: 'Build a complex JavaScript application using advanced concepts. Apply closures, async programming, and design patterns.',
        technologies: ['JavaScript', 'ES6+', 'Webpack', 'Jest'],
        requirements: [
          'Use advanced JS concepts',
          'Implement design patterns',
          'Async operations with proper error handling',
          'Comprehensive test coverage',
          'Webpack configuration',
          'Performance optimized'
        ],
        difficulty: 'advanced',
        estimatedDuration: '3 weeks',
        dueDate: '2025-02-28',
        maxScore: 400,
        weight: 30,
        isFinalProject: false
      },
      {
        id: 'proj_rec_8',
        projectNumber: 2,
        title: 'Build Tool & Development Environment',
        description: 'Create a custom build tool and development environment. Configure Webpack, Babel, and testing setup.',
        technologies: ['Webpack', 'Babel', 'Jest', 'Node.js'],
        requirements: [
          'Custom Webpack configuration',
          'Babel setup with presets',
          'Testing framework integration',
          'Development and production builds',
          'Documentation'
        ],
        difficulty: 'advanced',
        estimatedDuration: '2 weeks',
        dueDate: '2025-03-05',
        maxScore: 350,
        weight: 25,
        isFinalProject: false
      },
      {
        id: 'proj_rec_9',
        projectNumber: 3,
        title: 'Production-Ready Application (Final Project)',
        description: 'Build a complete, production-ready JavaScript application. Choose your own project idea.',
        technologies: ['JavaScript', 'Build Tools', 'Testing', 'Performance'],
        requirements: [
          'Choose your own project',
          'Use advanced JavaScript features',
          'Comprehensive testing (80%+ coverage)',
          'Performance optimized',
          'Production build configuration',
          'Documentation and deployment'
        ],
        difficulty: 'advanced',
        estimatedDuration: '4 weeks',
        dueDate: '2025-03-20',
        maxScore: 600,
        weight: 45,
        isFinalProject: true,
        finalProjectGuidelines: 'Build a complete, production-ready JavaScript application. Must include: advanced JS features, design patterns, comprehensive testing, performance optimization, build configuration, and deployment. Choose a project that demonstrates mastery of all course concepts.'
      }
    ],
    doubtClearingSessions: [
      {
        id: 'doubt_3',
        courseId: '9',
        date: '2025-01-19',
        time: '16:00',
        duration: 90,
        platform: 'zoom',
        meetingLink: 'https://zoom.us/j/987654321',
        meetingId: '987654321',
        status: 'scheduled',
        attendance: []
      }
    ]
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

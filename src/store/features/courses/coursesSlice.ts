import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '@/data/mock/coursesData';

export interface Enrollment {
  courseId: string;
  enrolledAt: string;
  progress: number;
  completed: boolean;
  completedLessons: string[];
  currentModule?: string;
  currentLesson?: string;
}

export interface CoursesState {
  courses: Course[];
  enrolledCourses: Enrollment[];
  filters: {
    category: string;
    level: string;
    skill: string;
    searchQuery: string;
  };
  isLoading: boolean;
  error: string | null;
}

// Mock courses for initial data
const getMockCourses = (): Course[] => {
  const storedData = typeof window !== 'undefined' ? localStorage.getItem('evolvix_registration') : null;
  const mentorData = storedData ? JSON.parse(storedData) : { email: 'mentor@example.com', fullName: 'Mentor' };
  
  return [
    // LIVE COURSE 1
    {
      id: 'mock_live_1',
      title: 'Live Python Data Science Bootcamp',
      description: 'Master Python for data science through live interactive sessions. Learn pandas, numpy, matplotlib, and machine learning with real-time guidance. Join our intensive bootcamp and learn from scratch! This course features daily live sessions where you\'ll code along with the instructor and get instant feedback.',
      shortDescription: 'Master Python for data science through live interactive sessions',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      category: 'data-science',
      level: 'beginner',
      skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Data Analysis', 'Machine Learning', 'Jupyter Notebooks'],
      rating: 4.8,
      ratingCount: 45,
      duration: '8 weeks',
      language: 'English',
      instructor: {
        id: mentorData.email || 'mentor@example.com',
        name: mentorData.fullName || 'Mentor',
        title: 'Data Science Instructor',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4.9,
        studentsCount: 1250,
        bio: 'Experienced data scientist with 10+ years in the field',
      },
      price: 149,
      scholarshipAvailable: true,
      modules: [
        {
          id: 'mock_m1',
          courseId: 'mock_live_1',
          title: 'Python Basics for Data Science',
          description: 'Learn Python fundamentals needed for data science work',
          lessons: [
            {
              id: 'mock_l1',
              moduleId: 'mock_m1',
              title: 'Python Setup and First Steps (Live Session)',
              duration: '120 min',
              type: 'video',
              content: 'In this live session, we\'ll cover installing Python, Jupyter Notebooks, and basic syntax. Bring your questions!',
              liveSessionLink: 'https://meet.jit.si/evolvix-python-basics',
            },
            {
              id: 'mock_l2',
              moduleId: 'mock_m1',
              title: 'Data Structures and Collections (Live Session)',
              duration: '120 min',
              type: 'video',
              content: 'Working with lists, dictionaries, tuples, and sets. Hands-on coding practice.',
            },
          ],
        },
        {
          id: 'mock_m2',
          courseId: 'mock_live_1',
          title: 'Introduction to Pandas',
          description: 'Learn to manipulate and analyze data with Pandas',
          lessons: [
            {
              id: 'mock_l3',
              moduleId: 'mock_m2',
              title: 'Pandas DataFrames and Series (Live Session)',
              duration: '120 min',
              type: 'video',
              content: 'Creating DataFrames, reading CSV files, and basic data exploration.',
            },
          ],
        },
      ],
      prerequisites: [],
      requirements: ['No prior programming experience required', 'Basic computer skills', 'Stable internet connection'],
      enrolledCount: 25,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      courseType: 'live',
      schedule: {
        frequency: 'daily',
        time: '18:00',
        duration: 120,
        startDate: '2024-12-15',
        endDate: '2025-02-15',
        admissionDeadline: '2024-12-10',
      },
      allowStudentPreferences: true,
      projects: [
        {
          id: 'proj_live_1',
          projectNumber: 1,
          title: 'Exploratory Data Analysis Project',
          description: 'Perform comprehensive EDA on a real-world dataset',
          technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
          requirements: ['Load and clean dataset', 'Create at least 10 visualizations', 'Write insights'],
          difficulty: 'beginner',
          estimatedDuration: '1 week',
          maxScore: 200,
          weight: 25,
          isFinalProject: false,
        },
      ],
    },
    
    // LIVE COURSE 2
    {
      id: 'mock_live_2',
      title: 'Live JavaScript Mastery Bootcamp',
      description: 'Master modern JavaScript (ES6+) through live coding sessions. Learn async/await, promises, closures, and advanced patterns. Build real projects with real-time mentor guidance.',
      shortDescription: 'Master modern JavaScript through live interactive coding sessions',
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',
      category: 'development',
      level: 'intermediate',
      skills: ['JavaScript', 'ES6+', 'Async/Await', 'Promises', 'Closures', 'DOM Manipulation'],
      rating: 4.7,
      ratingCount: 38,
      duration: '6 weeks',
      language: 'English',
      instructor: {
        id: mentorData.email || 'mentor@example.com',
        name: mentorData.fullName || 'Mentor',
        title: 'Senior JavaScript Developer',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        rating: 4.8,
        studentsCount: 890,
        bio: 'JavaScript expert with 12+ years of experience',
      },
      price: 129,
      scholarshipAvailable: false,
      modules: [
        {
          id: 'mock_m3',
          courseId: 'mock_live_2',
          title: 'ES6+ Features',
          description: 'Modern JavaScript features and syntax',
          lessons: [
            {
              id: 'mock_l4',
              moduleId: 'mock_m3',
              title: 'Arrow Functions and Destructuring (Live Session)',
              duration: '90 min',
              type: 'video',
              content: 'Learn arrow functions, destructuring, spread operator, and template literals.',
            },
          ],
        },
      ],
      prerequisites: [],
      requirements: ['Basic HTML/CSS knowledge', 'Code editor installed', 'Chrome browser'],
      enrolledCount: 18,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      courseType: 'live',
      schedule: {
        frequency: 'weekly',
        days: ['monday', 'wednesday', 'friday'],
        time: '19:00',
        duration: 90,
        startDate: '2024-12-20',
        endDate: '2025-01-31',
        admissionDeadline: '2024-12-15',
      },
      allowStudentPreferences: false,
      projects: [],
    },

    // RECORDED COURSE 1
    {
      id: 'mock_recorded_1',
      title: 'Complete Full-Stack Web Development with React & Node.js',
      description: 'This comprehensive course takes you from zero to hero in full-stack web development. You\'ll learn to build modern, scalable web applications using the most in-demand technologies. Build 3 complete projects and be ready for your first developer job.',
      shortDescription: 'Master modern web development from frontend to backend',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      category: 'development',
      level: 'intermediate',
      skills: ['React', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'RESTful APIs', 'Redux'],
      rating: 4.9,
      ratingCount: 234,
      duration: '40 hours',
      language: 'English',
      instructor: {
        id: mentorData.email || 'mentor@example.com',
        name: mentorData.fullName || 'Mentor',
        title: 'Full-Stack Developer',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4.9,
        studentsCount: 3450,
        bio: 'Experienced full-stack developer with 8+ years',
      },
      price: 99,
      scholarshipAvailable: true,
      modules: [
        {
          id: 'mock_m4',
          courseId: 'mock_recorded_1',
          title: 'Introduction to React',
          description: 'Learn React fundamentals, JSX, components, and props',
          lessons: [
            {
              id: 'mock_l5',
              moduleId: 'mock_m4',
              title: 'What is React and Why Use It?',
              duration: '15:30',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              timestamps: [
                { id: 'ts1', title: 'Introduction', timestamp: 0 },
                { id: 'ts2', title: 'What is React?', timestamp: 120 },
                { id: 'ts3', title: 'React vs Vanilla JS', timestamp: 300 },
              ],
              assignment: {
                id: 'assign1',
                title: 'Create Your First React Component',
                description: 'Create a simple React component that displays your name and a short bio. Use functional components and JSX. Submit your code via GitHub link.',
                maxScore: 100,
                dueDate: '2024-12-31',
              },
            },
            {
              id: 'mock_l6',
              moduleId: 'mock_m4',
              title: 'JSX and Component Structure',
              duration: '18:20',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              timestamps: [
                { id: 'ts4', title: 'JSX Syntax', timestamp: 0 },
                { id: 'ts5', title: 'Component Structure', timestamp: 180 },
              ],
              assignment: {
                id: 'assign2',
                title: 'Build a Todo List Component',
                description: 'Create a TodoList component that can add, remove, and mark todos as complete. Use proper JSX syntax.',
                maxScore: 100,
                dueDate: '2024-12-31',
              },
            },
          ],
        },
        {
          id: 'mock_m5',
          courseId: 'mock_recorded_1',
          title: 'Advanced React Concepts',
          description: 'Hooks, Context API, and performance optimization',
          lessons: [
            {
              id: 'mock_l7',
              moduleId: 'mock_m5',
              title: 'React Hooks: useState and useEffect',
              duration: '22:15',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              assignment: {
                id: 'assign3',
                title: 'Build a Weather App with Hooks',
                description: 'Create a weather application using React hooks. Fetch data from a weather API.',
                maxScore: 150,
                dueDate: '2024-12-31',
              },
            },
          ],
        },
        {
          id: 'mock_m6',
          courseId: 'mock_recorded_1',
          title: 'Backend Development with Node.js',
          description: 'Learn to build RESTful APIs with Node.js and Express',
          lessons: [
            {
              id: 'mock_l8',
              moduleId: 'mock_m6',
              title: 'Introduction to Node.js',
              duration: '20:00',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              assignment: {
                id: 'assign4',
                title: 'Create a Simple HTTP Server',
                description: 'Build a basic HTTP server using Node.js that handles GET and POST requests.',
                maxScore: 100,
                dueDate: '2024-12-31',
              },
            },
          ],
        },
      ],
      prerequisites: [],
      requirements: ['Basic knowledge of JavaScript', 'Node.js and npm installed', 'Code editor (VS Code recommended)'],
      enrolledCount: 156,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      courseType: 'recorded',
      enableSundayDoubtClearing: true,
      projects: [
        {
          id: 'proj1',
          projectNumber: 1,
          title: 'E-Commerce Frontend',
          description: 'Build a complete e-commerce frontend with product listing, cart, and checkout',
          technologies: ['React', 'Redux', 'CSS', 'React Router'],
          requirements: ['Product catalog with search', 'Shopping cart functionality', 'User authentication UI'],
          difficulty: 'intermediate',
          estimatedDuration: '2 weeks',
          maxScore: 200,
          weight: 20,
          isFinalProject: false,
        },
        {
          id: 'proj2',
          projectNumber: 2,
          title: 'RESTful API Backend',
          description: 'Create a complete REST API for a blog platform',
          technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
          requirements: ['CRUD operations for posts', 'User authentication', 'Comment system'],
          difficulty: 'intermediate',
          estimatedDuration: '2 weeks',
          maxScore: 250,
          weight: 25,
          isFinalProject: false,
        },
        {
          id: 'proj3',
          projectNumber: 3,
          title: 'Full-Stack Application (Final Project)',
          description: 'Build your own full-stack application combining frontend and backend',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
          requirements: ['Choose your own project idea', 'Must include React frontend, Node.js backend, database, authentication, and deployment'],
          difficulty: 'advanced',
          estimatedDuration: '4 weeks',
          maxScore: 300,
          weight: 35,
          isFinalProject: true,
          finalProjectGuidelines: 'Choose your own project idea. Must include: React frontend, Node.js backend, database, authentication, and deployment.',
        },
      ],
    },

    // RECORDED COURSE 2
    {
      id: 'mock_recorded_2',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of great user interface and user experience design. Master Figma, user research, and design systems. Create beautiful, user-friendly interfaces that solve real problems.',
      shortDescription: 'Master UI/UX design principles and tools',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      category: 'design',
      level: 'beginner',
      skills: ['Figma', 'UX Research', 'Prototyping', 'Design Systems', 'User Testing'],
      rating: 4.6,
      ratingCount: 189,
      duration: '18h 45m',
      language: 'English',
      instructor: {
        id: mentorData.email || 'mentor@example.com',
        name: mentorData.fullName || 'Mentor',
        title: 'Lead Designer',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        rating: 4.8,
        studentsCount: 2100,
        bio: 'Award-winning designer with expertise in product design',
      },
      price: 75,
      scholarshipAvailable: false,
      modules: [
        {
          id: 'mock_m7',
          courseId: 'mock_recorded_2',
          title: 'Design Thinking',
          description: 'Understanding user-centered design',
          lessons: [
            {
              id: 'mock_l9',
              moduleId: 'mock_m7',
              title: 'Introduction to Design Thinking',
              duration: '25:00',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              assignment: {
                id: 'assign5',
                title: 'Design Thinking Exercise',
                description: 'Apply design thinking to solve a real-world problem. Document your process.',
                maxScore: 100,
                dueDate: '2024-12-31',
              },
            },
            {
              id: 'mock_l10',
              moduleId: 'mock_m7',
              title: 'User Research Methods',
              duration: '30:15',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            },
          ],
        },
        {
          id: 'mock_m8',
          courseId: 'mock_recorded_2',
          title: 'Figma Fundamentals',
          description: 'Master Figma for UI design',
          lessons: [
            {
              id: 'mock_l11',
              moduleId: 'mock_m8',
              title: 'Getting Started with Figma',
              duration: '20:30',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            },
          ],
        },
      ],
      prerequisites: [],
      requirements: ['Figma account (free tier works)', 'Passion for design and creativity'],
      enrolledCount: 89,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      courseType: 'recorded',
      enableSundayDoubtClearing: false,
      projects: [
        {
          id: 'proj4',
          projectNumber: 1,
          title: 'Mobile App UI Design',
          description: 'Design a complete mobile app interface',
          technologies: ['Figma', 'Design Systems'],
          requirements: ['Wireframes', 'High-fidelity mockups', 'Prototype'],
          difficulty: 'beginner',
          estimatedDuration: '2 weeks',
          maxScore: 200,
          weight: 30,
          isFinalProject: false,
        },
      ],
    },

    // RECORDED COURSE 3
    {
      id: 'mock_recorded_3',
      title: 'Digital Marketing Mastery',
      description: 'Learn SEO, social media marketing, content marketing, and analytics. Build strategies that drive results. Master Google Ads, Facebook Ads, and content creation.',
      shortDescription: 'Complete digital marketing course',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      category: 'business',
      level: 'intermediate',
      skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics', 'Content Marketing'],
      rating: 4.5,
      ratingCount: 112,
      duration: '22h 00m',
      language: 'English',
      instructor: {
        id: mentorData.email || 'mentor@example.com',
        name: mentorData.fullName || 'Mentor',
        title: 'Marketing Director',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
        rating: 4.7,
        studentsCount: 1800,
        bio: 'Helped 1000+ businesses grow their online presence',
      },
      price: 99,
      scholarshipAvailable: true,
      modules: [
        {
          id: 'mock_m9',
          courseId: 'mock_recorded_3',
          title: 'SEO Fundamentals',
          description: 'Master search engine optimization',
          lessons: [
            {
              id: 'mock_l12',
              moduleId: 'mock_m9',
              title: 'Understanding Search Engines',
              duration: '18:45',
              type: 'video',
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              assignment: {
                id: 'assign6',
                title: 'SEO Audit Assignment',
                description: 'Perform an SEO audit on a website and provide recommendations.',
                maxScore: 100,
                dueDate: '2024-12-31',
              },
            },
          ],
        },
      ],
      prerequisites: [],
      requirements: ['Basic understanding of websites', 'Familiarity with social media platforms'],
      enrolledCount: 67,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      courseType: 'recorded',
      enableSundayDoubtClearing: true,
      projects: [],
    },

    // LIVE COURSE 3
    {
      id: 'mock_live_3',
      title: 'Live Machine Learning Bootcamp',
      description: 'Learn machine learning from scratch through live coding sessions. Build real ML models, understand algorithms, and deploy your models. Perfect for beginners who want hands-on learning.',
      shortDescription: 'Learn machine learning through live interactive sessions',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      category: 'data-science',
      level: 'intermediate',
      skills: ['Python', 'Scikit-learn', 'TensorFlow', 'Machine Learning', 'Data Preprocessing'],
      rating: 4.9,
      ratingCount: 52,
      duration: '10 weeks',
      language: 'English',
      instructor: {
        id: mentorData.email || 'mentor@example.com',
        name: mentorData.fullName || 'Mentor',
        title: 'ML Engineer',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
        rating: 5.0,
        studentsCount: 560,
        bio: 'PhD in Machine Learning with 15+ years experience',
      },
      price: 199,
      scholarshipAvailable: true,
      modules: [
        {
          id: 'mock_m10',
          courseId: 'mock_live_3',
          title: 'Introduction to Machine Learning',
          description: 'ML fundamentals and concepts',
          lessons: [
            {
              id: 'mock_l13',
              moduleId: 'mock_m10',
              title: 'What is Machine Learning? (Live Session)',
              duration: '120 min',
              type: 'video',
              content: 'Introduction to ML concepts, supervised vs unsupervised learning, and real-world applications.',
            },
          ],
        },
      ],
      prerequisites: [],
      requirements: ['Python basics', 'Basic math knowledge', 'Jupyter Notebook'],
      enrolledCount: 32,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      courseType: 'live',
      schedule: {
        frequency: 'twice-weekly',
        days: ['tuesday', 'thursday'],
        time: '20:00',
        duration: 120,
        startDate: '2025-01-10',
        endDate: '2025-03-21',
        admissionDeadline: '2025-01-05',
      },
      allowStudentPreferences: true,
      projects: [
        {
          id: 'proj_live_2',
          projectNumber: 1,
          title: 'ML Prediction Model',
          description: 'Build your first ML model to predict outcomes',
          technologies: ['Python', 'Scikit-learn', 'Pandas'],
          requirements: ['Choose prediction problem', 'Preprocess data', 'Train and evaluate model'],
          difficulty: 'intermediate',
          estimatedDuration: '2 weeks',
          maxScore: 300,
          weight: 35,
          isFinalProject: false,
        },
      ],
    },
  ];
};

// Load from localStorage on initialization
const loadCoursesFromStorage = (): Course[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('evolvix_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If there are courses in storage, use them
        if (parsed && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to load courses from localStorage:', e);
      }
    }
    // If no courses in storage, initialize with mock data
    const mockCourses = getMockCourses();
    localStorage.setItem('evolvix_courses', JSON.stringify(mockCourses));
    return mockCourses;
  }
  return [];
};

const initialState: CoursesState = {
  courses: loadCoursesFromStorage(),
  enrolledCourses: [],
  filters: {
    category: 'all',
    level: 'all',
    skill: '',
    searchQuery: ''
  },
  isLoading: false,
  error: null
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses(state, action: PayloadAction<Course[]>) {
      state.courses = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_courses', JSON.stringify(action.payload));
      }
    },
    addCourse(state, action: PayloadAction<Course>) {
      state.courses.push(action.payload);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_courses', JSON.stringify(state.courses));
      }
    },
    updateCourse(state, action: PayloadAction<Partial<Course> & { id: string }>) {
      const index = state.courses.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], ...action.payload, updatedAt: new Date().toISOString() };
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_courses', JSON.stringify(state.courses));
        }
      }
    },
    deleteCourse(state, action: PayloadAction<string>) {
      state.courses = state.courses.filter(c => c.id !== action.payload);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_courses', JSON.stringify(state.courses));
      }
    },
    setFilters(state, action: PayloadAction<Partial<CoursesState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    enrollCourse(state, action: PayloadAction<string>) {
      const existingEnrollment = state.enrolledCourses.find(
        e => e.courseId === action.payload
      );
      
      if (!existingEnrollment) {
        state.enrolledCourses.push({
          courseId: action.payload,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          completed: false,
          completedLessons: [],
          currentModule: undefined,
          currentLesson: undefined
        });
      }
    },
    unenrollCourse(state, action: PayloadAction<string>) {
      state.enrolledCourses = state.enrolledCourses.filter(
        e => e.courseId !== action.payload
      );
    },
    updateProgress(state, action: PayloadAction<{ courseId: string; progress: number }>) {
      const enrollment = state.enrolledCourses.find(
        e => e.courseId === action.payload.courseId
      );
      if (enrollment) {
        enrollment.progress = action.payload.progress;
      }
    },
    completeLesson(state, action: PayloadAction<{ courseId: string; lessonId: string }>) {
      const enrollment = state.enrolledCourses.find(
        e => e.courseId === action.payload.courseId
      );
      if (enrollment && !enrollment.completedLessons.includes(action.payload.lessonId)) {
        enrollment.completedLessons.push(action.payload.lessonId);
        // Recalculate progress
        const course = state.courses.find(c => c.id === action.payload.courseId);
        if (course) {
          const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
          enrollment.progress = Math.round(
            (enrollment.completedLessons.length / totalLessons) * 100
          );
          if (enrollment.progress >= 100) {
            enrollment.completed = true;
          }
        }
      }
    },
    setCurrentLesson(state, action: PayloadAction<{ courseId: string; moduleId: string; lessonId: string }>) {
      const enrollment = state.enrolledCourses.find(
        e => e.courseId === action.payload.courseId
      );
      if (enrollment) {
        enrollment.currentModule = action.payload.moduleId;
        enrollment.currentLesson = action.payload.lessonId;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

export const {
  setCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  setFilters,
  enrollCourse,
  unenrollCourse,
  updateProgress,
  completeLesson,
  setCurrentLesson,
  setLoading,
  setError
} = coursesSlice.actions;

export default coursesSlice.reducer;

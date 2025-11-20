import { MentorClass, ClassRecording } from '@/store/features/classes/classesSlice';

// Generate mock recordings for a class
const generateRecordings = (count: number, baseDate: string): ClassRecording[] => {
  const recordings: ClassRecording[] = [];
  const baseDateObj = new Date(baseDate);
  
  for (let i = 0; i < count; i++) {
    const recordingDate = new Date(baseDateObj);
    recordingDate.setDate(recordingDate.getDate() + i);
    
    recordings.push({
      id: `rec_${Date.now()}_${i}`,
      url: `https://example.com/recordings/class_recording_${i + 1}.mp4`,
      duration: `${45 + Math.floor(Math.random() * 30)}`, // 45-75 minutes
      createdAt: recordingDate.toISOString(),
    });
  }
  
  return recordings;
};

// Mock classes with recordings for enrolled courses
export const getMockClassesWithRecordings = (): MentorClass[] => {
  const now = new Date();
  const pastDate1 = new Date(now);
  pastDate1.setDate(pastDate1.getDate() - 7);
  const pastDate2 = new Date(now);
  pastDate2.setDate(pastDate2.getDate() - 5);
  const pastDate3 = new Date(now);
  pastDate3.setDate(pastDate3.getDate() - 3);
  const pastDate4 = new Date(now);
  pastDate4.setDate(pastDate4.getDate() - 2);
  const pastDate5 = new Date(now);
  pastDate5.setDate(pastDate5.getDate() - 1);

  return [
    // React & Next.js Course Recordings
    {
      id: 'class_react_1',
      topic: 'Introduction to React Fundamentals',
      description: 'Learn the core concepts of React including components, props, state, and hooks. We\'ll build a simple todo app to practice these concepts.',
      date: pastDate1.toISOString().split('T')[0],
      time: '10:00',
      duration: 60,
      category: 'Live Session',
      courseId: '1', // Complete React Development Masterclass
      courseName: 'Complete React Development Masterclass',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'react-intro-001',
      meetingLink: 'https://meet.jit.si/react-intro-001',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
        { id: 'student2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate1.toISOString()),
      feedback: [],
      createdAt: pastDate1.toISOString(),
      updatedAt: pastDate1.toISOString(),
    },
    {
      id: 'class_react_2',
      topic: 'React Hooks Deep Dive',
      description: 'Master useState, useEffect, useContext, and custom hooks. Learn best practices and common patterns.',
      date: pastDate2.toISOString().split('T')[0],
      time: '14:00',
      duration: 75,
      category: 'Live Session',
      courseId: '1',
      courseName: 'React & Next.js Mastery',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'react-hooks-002',
      meetingLink: 'https://meet.jit.si/react-hooks-002',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
        { id: 'student2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(2, pastDate2.toISOString()),
      feedback: [],
      createdAt: pastDate2.toISOString(),
      updatedAt: pastDate2.toISOString(),
    },
    {
      id: 'class_react_3',
      topic: 'Next.js Server Components & App Router',
      description: 'Explore Next.js 14+ features including Server Components, App Router, and data fetching strategies.',
      date: pastDate3.toISOString().split('T')[0],
      time: '10:00',
      duration: 90,
      category: 'Live Session',
      courseId: '1',
      courseName: 'React & Next.js Mastery',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'nextjs-app-router-003',
      meetingLink: 'https://meet.jit.si/nextjs-app-router-003',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
        { id: 'student2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate3.toISOString()),
      feedback: [],
      createdAt: pastDate3.toISOString(),
      updatedAt: pastDate3.toISOString(),
    },

    // Full-Stack Web Development Course Recordings
    {
      id: 'class_fullstack_1',
      topic: 'HTML5 & CSS3 Fundamentals',
      description: 'Build modern, responsive layouts with HTML5 semantic elements and advanced CSS3 features including Flexbox and Grid.',
      date: pastDate1.toISOString().split('T')[0],
      time: '09:00',
      duration: 60,
      category: 'Live Session',
      courseId: '2', // UI/UX Design Fundamentals
      courseName: 'UI/UX Design Fundamentals',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'html-css-fundamentals-001',
      meetingLink: 'https://meet.jit.si/html-css-fundamentals-001',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate1.toISOString()),
      feedback: [],
      createdAt: pastDate1.toISOString(),
      updatedAt: pastDate1.toISOString(),
    },
    {
      id: 'class_fullstack_2',
      topic: 'JavaScript ES6+ Features',
      description: 'Master modern JavaScript including arrow functions, destructuring, async/await, promises, and modules.',
      date: pastDate2.toISOString().split('T')[0],
      time: '11:00',
      duration: 90,
      category: 'Live Session',
      courseId: '2',
      courseName: 'Full-Stack Web Development Bootcamp',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'js-es6-features-002',
      meetingLink: 'https://meet.jit.si/js-es6-features-002',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(2, pastDate2.toISOString()),
      feedback: [],
      createdAt: pastDate2.toISOString(),
      updatedAt: pastDate2.toISOString(),
    },
    {
      id: 'class_fullstack_3',
      topic: 'Node.js & Express Backend Development',
      description: 'Build RESTful APIs with Node.js and Express. Learn about middleware, routing, authentication, and database integration.',
      date: pastDate4.toISOString().split('T')[0],
      time: '13:00',
      duration: 120,
      category: 'Live Session',
      courseId: '2',
      courseName: 'Full-Stack Web Development Bootcamp',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'nodejs-express-003',
      meetingLink: 'https://meet.jit.si/nodejs-express-003',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate4.toISOString()),
      feedback: [],
      createdAt: pastDate4.toISOString(),
      updatedAt: pastDate4.toISOString(),
    },

    // Python & Django Course Recordings
    {
      id: 'class_python_1',
      topic: 'Python Basics & Data Structures',
      description: 'Introduction to Python syntax, data types, lists, dictionaries, and control flow structures.',
      date: pastDate2.toISOString().split('T')[0],
      time: '15:00',
      duration: 60,
      category: 'Live Session',
      courseId: '3', // Python for Data Science
      courseName: 'Python for Data Science',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'python-basics-001',
      meetingLink: 'https://meet.jit.si/python-basics-001',
      enrolledStudents: [
        { id: 'student2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate2.toISOString()),
      feedback: [],
      createdAt: pastDate2.toISOString(),
      updatedAt: pastDate2.toISOString(),
    },
    {
      id: 'class_python_2',
      topic: 'Django Models & Admin Panel',
      description: 'Learn Django ORM, model relationships, migrations, and how to use the Django admin interface effectively.',
      date: pastDate3.toISOString().split('T')[0],
      time: '16:00',
      duration: 90,
      category: 'Live Session',
      courseId: '3',
      courseName: 'Python & Django Web Development',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'django-models-002',
      meetingLink: 'https://meet.jit.si/django-models-002',
      enrolledStudents: [
        { id: 'student2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(2, pastDate3.toISOString()),
      feedback: [],
      createdAt: pastDate3.toISOString(),
      updatedAt: pastDate3.toISOString(),
    },

    // Data Science Course Recordings
    {
      id: 'class_datascience_1',
      topic: 'Introduction to Data Analysis with Pandas',
      description: 'Learn how to load, clean, transform, and analyze data using the Pandas library. Work with real-world datasets.',
      date: pastDate1.toISOString().split('T')[0],
      time: '10:00',
      duration: 75,
      category: 'Live Session',
      courseId: '4', // Digital Marketing Mastery
      courseName: 'Digital Marketing Mastery',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'pandas-intro-001',
      meetingLink: 'https://meet.jit.si/pandas-intro-001',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
        { id: 'student2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate1.toISOString()),
      feedback: [],
      createdAt: pastDate1.toISOString(),
      updatedAt: pastDate1.toISOString(),
    },
    {
      id: 'class_datascience_2',
      topic: 'Data Visualization with Matplotlib & Seaborn',
      description: 'Create beautiful and informative visualizations using Matplotlib and Seaborn. Learn best practices for data storytelling.',
      date: pastDate4.toISOString().split('T')[0],
      time: '14:00',
      duration: 60,
      category: 'Live Session',
      courseId: '4',
      courseName: 'Data Science with Python',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'data-viz-002',
      meetingLink: 'https://meet.jit.si/data-viz-002',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
        { id: 'student2', name: 'Jane Smith', email: 'jane@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate4.toISOString()),
      feedback: [],
      createdAt: pastDate4.toISOString(),
      updatedAt: pastDate4.toISOString(),
    },

    // Machine Learning Course Recordings
    {
      id: 'class_ml_1',
      topic: 'Introduction to Machine Learning',
      description: 'Understand the fundamentals of machine learning, supervised vs unsupervised learning, and the ML workflow.',
      date: pastDate2.toISOString().split('T')[0],
      time: '11:00',
      duration: 90,
      category: 'Live Session',
      courseId: '5', // Live Full-Stack Web Development Bootcamp
      courseName: 'Live Full-Stack Web Development Bootcamp',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'ml-intro-001',
      meetingLink: 'https://meet.jit.si/ml-intro-001',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(2, pastDate2.toISOString()),
      feedback: [],
      createdAt: pastDate2.toISOString(),
      updatedAt: pastDate2.toISOString(),
    },
    {
      id: 'class_ml_2',
      topic: 'Linear Regression & Model Evaluation',
      description: 'Build and evaluate linear regression models. Learn about metrics like R-squared, MSE, and cross-validation.',
      date: pastDate5.toISOString().split('T')[0],
      time: '13:00',
      duration: 75,
      category: 'Live Session',
      courseId: '5',
      courseName: 'Machine Learning Fundamentals',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'linear-regression-002',
      meetingLink: 'https://meet.jit.si/linear-regression-002',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate5.toISOString()),
      feedback: [],
      createdAt: pastDate5.toISOString(),
      updatedAt: pastDate5.toISOString(),
    },

    // Additional recordings for course '1' (React) - recorded course
    {
      id: 'class_react_4',
      topic: 'React Context API & State Management',
      description: 'Learn how to use React Context API for global state management and when to use it vs local state.',
      date: pastDate4.toISOString().split('T')[0],
      time: '16:00',
      duration: 60,
      category: 'Recorded Session',
      courseId: '1',
      courseName: 'Complete React Development Masterclass',
      classType: 'recorded',
      platform: 'internal',
      videoUrl: 'https://example.com/recordings/react-context-api.mp4',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate4.toISOString()),
      feedback: [],
      createdAt: pastDate4.toISOString(),
      updatedAt: pastDate4.toISOString(),
    },
    {
      id: 'class_react_5',
      topic: 'Advanced React Patterns',
      description: 'Explore advanced patterns like render props, higher-order components, and custom hooks.',
      date: pastDate5.toISOString().split('T')[0],
      time: '10:00',
      duration: 90,
      category: 'Recorded Session',
      courseId: '1',
      courseName: 'Complete React Development Masterclass',
      classType: 'recorded',
      platform: 'internal',
      videoUrl: 'https://example.com/recordings/advanced-react-patterns.mp4',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(2, pastDate5.toISOString()),
      feedback: [],
      createdAt: pastDate5.toISOString(),
      updatedAt: pastDate5.toISOString(),
    },

    // Additional recordings for course '2' (Full-Stack) - live course with upcoming session
    {
      id: 'class_fullstack_4',
      topic: 'MongoDB Database Design',
      description: 'Learn MongoDB schema design, indexing, and query optimization techniques.',
      date: pastDate3.toISOString().split('T')[0],
      time: '15:00',
      duration: 75,
      category: 'Live Session',
      courseId: '2',
      courseName: 'Full-Stack Web Development Bootcamp',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'mongodb-design-004',
      meetingLink: 'https://meet.jit.si/mongodb-design-004',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate3.toISOString()),
      feedback: [],
      createdAt: pastDate3.toISOString(),
      updatedAt: pastDate3.toISOString(),
    },
    {
      id: 'class_fullstack_5',
      topic: 'RESTful API Best Practices',
      description: 'Design and implement RESTful APIs following industry best practices and conventions.',
      date: pastDate5.toISOString().split('T')[0],
      time: '14:00',
      duration: 60,
      category: 'Live Session',
      courseId: '2',
      courseName: 'Full-Stack Web Development Bootcamp',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'restful-api-005',
      meetingLink: 'https://meet.jit.si/restful-api-005',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'past',
      recordings: generateRecordings(1, pastDate5.toISOString()),
      feedback: [],
      createdAt: pastDate5.toISOString(),
      updatedAt: pastDate5.toISOString(),
    },
    // Upcoming live class for course '2'
    {
      id: 'class_fullstack_upcoming',
      topic: 'Deployment & DevOps Basics',
      description: 'Learn how to deploy your full-stack applications using modern DevOps tools and practices.',
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
      time: '10:00',
      duration: 90,
      category: 'Live Session',
      courseId: '2',
      courseName: 'Full-Stack Web Development Bootcamp',
      classType: 'live',
      platform: 'jitsi',
      meetingId: 'deployment-devops-upcoming',
      meetingLink: 'https://meet.jit.si/deployment-devops-upcoming',
      enrolledStudents: [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
      ],
      status: 'upcoming',
      recordings: [],
      feedback: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

export default getMockClassesWithRecordings;


import { Assignment, AssignmentSubmission, AssignmentNotification } from './types';

// Mock assignments data
export const mockAssignments: Assignment[] = [
  {
    id: 'assign_1',
    title: 'Daily Assignment: Personal Portfolio Page',
    description: 'Create a responsive personal portfolio page using HTML5 semantic elements. Include sections for About, Skills, Projects, and Contact.',
    type: 'class',
    courseId: '5',
    courseTitle: 'Live Full-Stack Web Development Bootcamp',
    dueDate: '2024-12-20',
    maxScore: 100,
    instructions: '1. Use HTML5 semantic elements\n2. Include proper form validation\n3. Make it responsive\n4. Submit via GitHub link',
    createdAt: '2024-12-15',
    createdBy: 'suhxil14@gmail.com'
  },
  {
    id: 'assign_2',
    title: 'Daily Assignment: Todo App with Local Storage',
    description: 'Create a todo application using vanilla JavaScript. Features: add, delete, mark complete, filter todos. Persist data using localStorage.',
    type: 'class',
    courseId: '5',
    courseTitle: 'Live Full-Stack Web Development Bootcamp',
    dueDate: '2024-12-22',
    maxScore: 150,
    instructions: 'Build a complete todo app with all features mentioned. Use vanilla JavaScript only.',
    createdAt: '2024-12-17',
    createdBy: 'suhxil14@gmail.com'
  },
  {
    id: 'assign_3',
    title: 'E-Commerce Frontend Project',
    description: 'Build a complete e-commerce frontend with product listing, search, filters, cart, and checkout.',
    type: 'project',
    courseId: '5',
    courseTitle: 'Live Full-Stack Web Development Bootcamp',
    projectId: 'proj_live_3',
    projectNumber: 1,
    dueDate: '2025-01-10',
    maxScore: 300,
    instructions: 'This is Project 1 for the course. Build a complete e-commerce frontend with all required features.',
    createdAt: '2024-12-01',
    createdBy: 'suhxil14@gmail.com'
  },
  {
    id: 'assign_4',
    title: 'Python Basics Assignment',
    description: 'Complete the following exercises: 1) Create variables for different data types, 2) Perform arithmetic operations, 3) Work with strings and lists, 4) Write a function to calculate factorial.',
    type: 'class',
    courseId: '7',
    courseTitle: 'Complete Python Data Science & Machine Learning',
    dueDate: '2025-01-15',
    maxScore: 100,
    instructions: 'Submit your code via GitHub. Include comments explaining your code.',
    createdAt: '2024-12-10',
    createdBy: 'suhxil14@gmail.com'
  },
  {
    id: 'assign_5',
    title: 'Exploratory Data Analysis Project',
    description: 'Perform comprehensive EDA on a real-world dataset. Analyze patterns, create visualizations, and provide insights.',
    type: 'project',
    courseId: '7',
    courseTitle: 'Complete Python Data Science & Machine Learning',
    projectId: 'proj_rec_1',
    projectNumber: 1,
    dueDate: '2025-02-01',
    maxScore: 300,
    instructions: 'Choose a dataset, perform EDA, create at least 10 visualizations, and write comprehensive insights report.',
    createdAt: '2024-12-05',
    createdBy: 'suhxil14@gmail.com'
  }
];

// Mock submissions data
export const mockSubmissions: AssignmentSubmission[] = [
  {
    id: 'sub_1',
    assignmentId: 'assign_1',
    studentId: 'student_1',
    studentName: 'Alex Johnson',
    studentEmail: 'alex.johnson@example.com',
    submittedAt: '2024-12-19T14:30:00Z',
    dueDate: '2024-12-20',
    status: 'submitted',
    files: [
      {
        id: 'file_1',
        name: 'portfolio.html',
        url: 'https://example.com/files/portfolio.html',
        type: 'text/html',
        size: 15240
      },
      {
        id: 'file_2',
        name: 'styles.css',
        url: 'https://example.com/files/styles.css',
        type: 'text/css',
        size: 8230
      }
    ],
    githubUrl: 'https://github.com/alexjohnson/portfolio',
    liveLink: 'https://alexjohnson-portfolio.netlify.app',
    notes: 'I added some extra features like dark mode toggle.',
    maxScore: 100,
    isLate: false
  },
  {
    id: 'sub_2',
    assignmentId: 'assign_1',
    studentId: 'student_2',
    studentName: 'Sarah Chen',
    studentEmail: 'sarah.chen@example.com',
    submittedAt: '2024-12-21T10:15:00Z',
    dueDate: '2024-12-20',
    status: 'late',
    files: [
      {
        id: 'file_3',
        name: 'portfolio.zip',
        url: 'https://example.com/files/portfolio.zip',
        type: 'application/zip',
        size: 45620
      }
    ],
    githubUrl: 'https://github.com/sarahchen/portfolio',
    maxScore: 100,
    isLate: true
  },
  {
    id: 'sub_3',
    assignmentId: 'assign_2',
    studentId: 'student_1',
    studentName: 'Alex Johnson',
    studentEmail: 'alex.johnson@example.com',
    submittedAt: '2024-12-21T16:45:00Z',
    dueDate: '2024-12-22',
    status: 'graded',
    files: [
      {
        id: 'file_4',
        name: 'todo-app.js',
        url: 'https://example.com/files/todo-app.js',
        type: 'application/javascript',
        size: 12350
      },
      {
        id: 'file_5',
        name: 'index.html',
        url: 'https://example.com/files/index.html',
        type: 'text/html',
        size: 3450
      }
    ],
    githubUrl: 'https://github.com/alexjohnson/todo-app',
    liveLink: 'https://alexjohnson-todo.netlify.app',
    score: 145,
    maxScore: 150,
    feedback: 'Excellent implementation! All features work perfectly. Great use of localStorage. Minor suggestion: add keyboard shortcuts for better UX.',
    gradedAt: '2024-12-22T09:00:00Z',
    gradedBy: 'suhxil14@gmail.com',
    isLate: false
  },
  {
    id: 'sub_4',
    assignmentId: 'assign_3',
    studentId: 'student_5',
    studentName: 'David Wilson',
    studentEmail: 'david.wilson@example.com',
    submittedAt: '2025-01-08T12:00:00Z',
    dueDate: '2025-01-10',
    status: 'graded',
    files: [
      {
        id: 'file_6',
        name: 'ecommerce-frontend.zip',
        url: 'https://example.com/files/ecommerce-frontend.zip',
        type: 'application/zip',
        size: 245680
      }
    ],
    githubUrl: 'https://github.com/davidwilson/ecommerce-frontend',
    liveLink: 'https://davidwilson-ecommerce.netlify.app',
    score: 285,
    maxScore: 300,
    feedback: 'Outstanding work! The UI is beautiful and all features are implemented correctly. The code is well-organized and follows best practices. Excellent job!',
    gradedAt: '2025-01-09T10:30:00Z',
    gradedBy: 'suhxil14@gmail.com',
    isLate: false
  },
  {
    id: 'sub_5',
    assignmentId: 'assign_4',
    studentId: 'student_3',
    studentName: 'Michael Brown',
    studentEmail: 'michael.brown@example.com',
    submittedAt: '2025-01-14T18:20:00Z',
    dueDate: '2025-01-15',
    status: 'submitted',
    files: [
      {
        id: 'file_7',
        name: 'python_basics.py',
        url: 'https://example.com/files/python_basics.py',
        type: 'text/x-python',
        size: 5670
      }
    ],
    githubUrl: 'https://github.com/michaelbrown/python-basics',
    maxScore: 100,
    isLate: false
  },
  {
    id: 'sub_6',
    assignmentId: 'assign_5',
    studentId: 'student_4',
    studentName: 'Emily Davis',
    studentEmail: 'emily.davis@example.com',
    submittedAt: '2025-01-30T20:00:00Z',
    dueDate: '2025-02-01',
    status: 'returned',
    files: [
      {
        id: 'file_8',
        name: 'eda_project.ipynb',
        url: 'https://example.com/files/eda_project.ipynb',
        type: 'application/json',
        size: 156780
      },
      {
        id: 'file_9',
        name: 'eda_report.pdf',
        url: 'https://example.com/files/eda_report.pdf',
        type: 'application/pdf',
        size: 234560
      }
    ],
    githubUrl: 'https://github.com/emilydavis/eda-project',
    score: 180,
    maxScore: 300,
    feedback: 'Good start but needs improvement. Please add more visualizations (currently only 6, need at least 10). Also expand on the insights section. Resubmit after improvements.',
    gradedAt: '2025-02-02T11:00:00Z',
    gradedBy: 'suhxil14@gmail.com',
    isLate: false
  }
];

// Mock notifications (for auto-notifications when grading)
export const mockNotifications: AssignmentNotification[] = [
  {
    id: 'notif_1',
    studentId: 'student_1',
    assignmentId: 'assign_2',
    submissionId: 'sub_3',
    type: 'graded',
    message: 'Your assignment "Todo App with Local Storage" has been graded. Score: 145/150',
    createdAt: '2024-12-22T09:00:00Z',
    read: false
  },
  {
    id: 'notif_2',
    studentId: 'student_5',
    assignmentId: 'assign_3',
    submissionId: 'sub_4',
    type: 'graded',
    message: 'Your project "E-Commerce Frontend Project" has been graded. Score: 285/300',
    createdAt: '2025-01-09T10:30:00Z',
    read: true
  },
  {
    id: 'notif_3',
    studentId: 'student_4',
    assignmentId: 'assign_5',
    submissionId: 'sub_6',
    type: 'returned',
    message: 'Your assignment "Exploratory Data Analysis Project" has been returned. Please review feedback and resubmit.',
    createdAt: '2025-02-02T11:00:00Z',
    read: false
  }
];


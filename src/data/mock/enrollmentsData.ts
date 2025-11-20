/**
 * Mock Enrollment Data
 * Pre-populated enrollments for students with different course types:
 * - Crash Courses (2-10 hours, any category, time-limited: 1-2 weeks)
 * - Skill Courses (4-20 hours, any category, time-limited: 1-4 weeks)
 * - Full Career Bootcamp (2-6 months, IT only, no time limit)
 */

import { Enrollment } from '@/store/features/courses/coursesSlice';

// Mock enrollments for demo student - using actual course IDs from coursesData
export const mockEnrollments: Enrollment[] = [
  // Full Career Bootcamp (IT category, 2-6 months, no time limit)
  {
    courseId: '5', // Live Full-Stack Web Development Bootcamp
    enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    progress: 45,
    completed: false,
    completedLessons: ['l11', 'l12', 'l13', 'l14', 'l15'],
    currentModule: 'm7',
    currentLesson: 'l14',
  },
  {
    courseId: '6', // Live Mobile App Development Bootcamp
    enrolledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    progress: 25,
    completed: false,
    completedLessons: ['l18', 'l19'],
    currentModule: 'm9',
    currentLesson: 'l19',
  },

  // Crash Course (2-10 hours, any category, time-limited: 1-2 weeks)
  {
    courseId: 'crash-react-hooks',
    enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    progress: 60,
    completed: false,
    completedLessons: ['crash-l1'],
    currentModule: 'crash-m1',
    currentLesson: 'crash-l2',
  },
  {
    courseId: 'crash-python-basics',
    enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    progress: 85,
    completed: false,
    completedLessons: ['crash-l3'],
    currentModule: 'crash-m2',
    currentLesson: 'crash-l3',
  },
  {
    courseId: 'crash-figma-design',
    enrolledAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago (almost expired)
    progress: 30,
    completed: false,
    completedLessons: [],
    currentModule: 'crash-m3',
    currentLesson: 'crash-l4',
  },

  // Skill Course (4-20 hours, any category, time-limited: 1-4 weeks)
  {
    courseId: '1', // Complete React Development Masterclass
    enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    progress: 40,
    completed: false,
    completedLessons: ['l1', 'l2'],
    currentModule: 'm1',
    currentLesson: 'l3',
  },
  {
    courseId: '3', // Python for Data Science
    enrolledAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    progress: 75,
    completed: false,
    completedLessons: ['l8', 'l9'],
    currentModule: 'm4',
    currentLesson: 'l9',
  },
  {
    courseId: '8', // Complete UI/UX Design Masterclass
    enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    progress: 15,
    completed: false,
    completedLessons: ['l30'],
    currentModule: 'm16',
    currentLesson: 'l31',
  },
];

// Helper function to initialize enrollments in localStorage
export function initializeMockEnrollments() {
  if (typeof window === 'undefined') return;

  const existing = localStorage.getItem('evolvix_enrollments');
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem('evolvix_enrollments', JSON.stringify(mockEnrollments));
  }
}

// Get enrollments for a specific student
export function getStudentEnrollments(studentId: string): Enrollment[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('evolvix_enrollments');
  if (stored) {
    const enrollments: Enrollment[] = JSON.parse(stored);
    return enrollments;
  }
  
  return mockEnrollments;
}


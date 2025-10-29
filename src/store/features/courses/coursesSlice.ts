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

// Load from localStorage on initialization
const loadCoursesFromStorage = (): Course[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('evolvix_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load courses from localStorage:', e);
      }
    }
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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadStudentData } from './studentThunks';

export interface StudentStats {
  coursesEnrolled: number;
  mentorsConnected: number;
  certificatesEarned: number;
  progressScore: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  rating: number;
  icon: string;
  gradient: string;
  action: string;
}

export interface Event {
  id: number;
  title: string;
  time: string;
  icon: string;
  color: string;
  action: string;
}

export interface QuickAction {
  id: number;
  label: string;
  icon: string;
}

export interface Activity {
  id: number;
  title: string;
  time: string;
  icon: string;
  color: string;
}

interface StudentState {
  stats: StudentStats;
  featuredCourses: Course[];
  upcomingEvents: Event[];
  quickActions: QuickAction[];
  recentActivity: Activity[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  stats: {
    coursesEnrolled: 0,
    mentorsConnected: 0,
    certificatesEarned: 0,
    progressScore: 0
  },
  featuredCourses: [],
  upcomingEvents: [],
  quickActions: [],
  recentActivity: [],
  isLoading: false,
  error: null
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStats: (state, action: PayloadAction<StudentStats>) => {
      state.stats = action.payload;
    },
    setFeaturedCourses: (state, action: PayloadAction<Course[]>) => {
      state.featuredCourses = action.payload;
    },
    setUpcomingEvents: (state, action: PayloadAction<Event[]>) => {
      state.upcomingEvents = action.payload;
    },
    setQuickActions: (state, action: PayloadAction<QuickAction[]>) => {
      state.quickActions = action.payload;
    },
    setRecentActivity: (state, action: PayloadAction<Activity[]>) => {
      state.recentActivity = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStudentData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadStudentData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.featuredCourses = action.payload.featuredCourses;
        state.upcomingEvents = action.payload.upcomingEvents;
        state.quickActions = action.payload.quickActions;
        state.recentActivity = action.payload.recentActivity;
      })
      .addCase(loadStudentData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setLoading,
  setError,
  setStats,
  setFeaturedCourses,
  setUpcomingEvents,
  setQuickActions,
  setRecentActivity
} = studentSlice.actions;

export default studentSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadMentorData } from './mentorThunks';

export interface MentorStats {
  totalClasses: number;
  totalStudents: number;
  activeStudents: number;
  averageRating: number;
  pendingReviews: number;
  pendingPayments: number;
  totalRevenue: {
    thisMonth: number;
    thisYear: number;
    allTime: number;
  };
  upcomingClasses: number;
  pendingGrading: number;
  completionRate: number;
  responseTime: number; // in hours
  retentionRate: number;
}

export interface Notification {
  id: string;
  type: 'enrollment' | 'assignment_submission' | 'test_completion' | 'message' | 'payment' | 'announcement';
  title: string;
  description: string;
  time: string;
}

export interface UpcomingSession {
  id: string;
  title: string;
  student: string;
  date: string;
  time: string;
}

interface MentorState {
  stats: MentorStats;
  notifications: Notification[];
  upcomingSessions: UpcomingSession[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MentorState = {
  stats: {
    totalClasses: 0,
    totalStudents: 0,
    activeStudents: 0,
    averageRating: 0,
    pendingReviews: 0,
    pendingPayments: 0,
    totalRevenue: {
      thisMonth: 0,
      thisYear: 0,
      allTime: 0,
    },
    upcomingClasses: 0,
    pendingGrading: 0,
    completionRate: 0,
    responseTime: 0,
    retentionRate: 0,
  },
  notifications: [],
  upcomingSessions: [],
  isLoading: false,
  error: null,
};

const mentorSlice = createSlice({
  name: 'mentor',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStats: (state, action: PayloadAction<MentorStats>) => {
      state.stats = action.payload;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    setUpcomingSessions: (state, action: PayloadAction<UpcomingSession[]>) => {
      state.upcomingSessions = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMentorData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadMentorData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.notifications = action.payload.notifications;
        state.upcomingSessions = action.payload.upcomingSessions;
      })
      .addCase(loadMentorData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  setStats,
  setNotifications,
  setUpcomingSessions,
  addNotification,
  removeNotification,
} = mentorSlice.actions;

export default mentorSlice.reducer;


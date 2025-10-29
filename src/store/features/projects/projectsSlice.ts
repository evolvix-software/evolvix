import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectSubmission, CourseProject, DoubtClearingSession } from '@/data/mock/coursesData';

export interface ProjectsState {
  submissions: ProjectSubmission[];
  doubtClearingSessions: DoubtClearingSession[];
  isLoading: boolean;
  error: string | null;
}

const loadSubmissionsFromStorage = (): ProjectSubmission[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('evolvix_project_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load submissions from localStorage:', e);
      }
    }
  }
  return [];
};

const loadSessionsFromStorage = (): DoubtClearingSession[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('evolvix_doubt_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load sessions from localStorage:', e);
      }
    }
  }
  return [];
};

const initialState: ProjectsState = {
  submissions: loadSubmissionsFromStorage(),
  doubtClearingSessions: loadSessionsFromStorage(),
  isLoading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    submitProject: (state, action: PayloadAction<ProjectSubmission>) => {
      const existingIndex = state.submissions.findIndex(
        s => s.projectId === action.payload.projectId && s.studentId === action.payload.studentId
      );
      if (existingIndex !== -1) {
        state.submissions[existingIndex] = action.payload;
      } else {
        state.submissions.push(action.payload);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_project_submissions', JSON.stringify(state.submissions));
      }
    },
    updateSubmission: (state, action: PayloadAction<Partial<ProjectSubmission> & { id: string }>) => {
      const index = state.submissions.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.submissions[index] = { ...state.submissions[index], ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_project_submissions', JSON.stringify(state.submissions));
        }
      }
    },
    evaluateProject: (
      state,
      action: PayloadAction<{
        submissionId: string;
        score: number;
        feedback: string;
        status: 'reviewed' | 'returned';
      }>
    ) => {
      const submission = state.submissions.find(s => s.id === action.payload.submissionId);
      if (submission) {
        submission.score = action.payload.score;
        submission.mentorFeedback = action.payload.feedback;
        submission.status = action.payload.status;
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_project_submissions', JSON.stringify(state.submissions));
        }
      }
    },
    scheduleDoubtSession: (state, action: PayloadAction<DoubtClearingSession>) => {
      const existingIndex = state.doubtClearingSessions.findIndex(
        s => s.id === action.payload.id
      );
      if (existingIndex !== -1) {
        state.doubtClearingSessions[existingIndex] = action.payload;
      } else {
        state.doubtClearingSessions.push(action.payload);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_doubt_sessions', JSON.stringify(state.doubtClearingSessions));
      }
    },
    cancelDoubtSession: (state, action: PayloadAction<string>) => {
      state.doubtClearingSessions = state.doubtClearingSessions.filter(s => s.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_doubt_sessions', JSON.stringify(state.doubtClearingSessions));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  submitProject,
  updateSubmission,
  evaluateProject,
  scheduleDoubtSession,
  cancelDoubtSession,
  setLoading,
  setError,
} = projectsSlice.actions;

export default projectsSlice.reducer;


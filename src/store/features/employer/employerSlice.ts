import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadEmployerData } from './employerThunks';

export interface EmployerStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  hiredCount: number;
  averageTimeToHire: number; // in days
  jobViews: number;
  applicationRate: number; // percentage
}

export interface Job {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'expired';
  applications: number;
  views: number;
  createdAt: string;
  expiresAt?: string;
  location: string;
  employmentType: string;
  // Full job details
  remoteType?: 'remote' | 'hybrid' | 'onsite';
  seniorityLevel?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  salaryPeriod?: string;
  benefits?: string[];
  applicationMethod?: 'easy-apply' | 'external-link' | 'email';
  externalLink?: string;
  applicationEmail?: string;
  requireCoverLetter?: boolean;
  requirePortfolio?: boolean;
  customQuestions?: Array<{
    id: string;
    type: 'text' | 'textarea' | 'multiple-choice' | 'file';
    question: string;
    required: boolean;
    options?: string[];
  }>;
  publishDate?: string;
  autoExpire?: boolean;
  promoteJob?: boolean;
}

export interface JobDraft {
  id: string;
  formData: Partial<Job>;
  lastSaved: string;
  step: number;
}

export interface ApplicationNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isPrivate: boolean;
  tags?: string[];
  mentions?: string[];
}

export interface ApplicationActivity {
  id: string;
  type: 'status_change' | 'note_added' | 'message_sent' | 'resume_viewed' | 'interview_scheduled';
  description: string;
  actor: string;
  timestamp: string;
}

export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhoto?: string;
  jobTitle: string;
  jobId: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  matchScore?: number;
  appliedAt: string;
  resumeUrl?: string;
  skills?: string[];
  location?: string;
  experience?: string;
  assignedRecruiter?: string;
  tags?: string[];
  notes?: ApplicationNote[];
  activities?: ApplicationActivity[];
  hasUnreadNotes?: boolean;
  lastActivityAt?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  applicantCount: number;
  isCustom: boolean;
  color: string;
  maxApplicants?: number;
  averageTimeInStage?: number; // in hours
  conversionRate?: number; // percentage to next stage
  dropOffRate?: number; // percentage
}

export interface PipelineStageMetrics {
  stageId: string;
  totalApplicants: number;
  averageTimeInStage: number;
  conversionRate: number;
  dropOffRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RecentActivity {
  id: string;
  type: 'application' | 'job_posted' | 'job_closed' | 'message' | 'hired';
  title: string;
  description: string;
  timestamp: string;
}

interface EmployerState {
  stats: EmployerStats;
  jobs: Job[];
  applications: Application[];
  recentActivity: RecentActivity[];
  jobDrafts: JobDraft[];
  pipelineStages: PipelineStage[];
  stageMetrics: Record<string, PipelineStageMetrics>;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmployerState = {
  stats: {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    hiredCount: 0,
    averageTimeToHire: 0,
    jobViews: 0,
    applicationRate: 0,
  },
  jobs: [],
  applications: [],
  recentActivity: [],
  jobDrafts: [],
  pipelineStages: [
    { id: 'new', name: 'New', order: 0, applicantCount: 0, isCustom: false, color: 'bg-blue-500' },
    { id: 'reviewed', name: 'Reviewed', order: 1, applicantCount: 0, isCustom: false, color: 'bg-purple-500' },
    { id: 'shortlisted', name: 'Shortlisted', order: 2, applicantCount: 0, isCustom: false, color: 'bg-green-500' },
    { id: 'interviewed', name: 'Interviewed', order: 3, applicantCount: 0, isCustom: false, color: 'bg-yellow-500' },
    { id: 'offered', name: 'Offered', order: 4, applicantCount: 0, isCustom: false, color: 'bg-emerald-500' },
    { id: 'hired', name: 'Hired', order: 5, applicantCount: 0, isCustom: false, color: 'bg-green-600' },
    { id: 'rejected', name: 'Rejected', order: 6, applicantCount: 0, isCustom: false, color: 'bg-red-500' },
  ],
  stageMetrics: {},
  isLoading: false,
  error: null,
};

const employerSlice = createSlice({
  name: 'employer',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStats: (state, action: PayloadAction<EmployerStats>) => {
      state.stats = action.payload;
    },
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.unshift(action.payload);
      state.stats.totalJobs += 1;
      if (action.payload.status === 'active') {
        state.stats.activeJobs += 1;
      }
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex(j => j.id === action.payload.id);
      if (index !== -1) {
        const oldStatus = state.jobs[index].status;
        state.jobs[index] = action.payload;
        
        // Update active jobs count
        if (oldStatus === 'active' && action.payload.status !== 'active') {
          state.stats.activeJobs = Math.max(0, state.stats.activeJobs - 1);
        } else if (oldStatus !== 'active' && action.payload.status === 'active') {
          state.stats.activeJobs += 1;
        }
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      const job = state.jobs.find(j => j.id === action.payload);
      if (job) {
        if (job.status === 'active') {
          state.stats.activeJobs = Math.max(0, state.stats.activeJobs - 1);
        }
        state.stats.totalJobs = Math.max(0, state.stats.totalJobs - 1);
      }
      state.jobs = state.jobs.filter(j => j.id !== action.payload);
    },
    duplicateJob: (state, action: PayloadAction<string>) => {
      const job = state.jobs.find(j => j.id === action.payload);
      if (job) {
        const duplicatedJob: Job = {
          ...job,
          id: Date.now().toString(),
          title: `${job.title} (Copy)`,
          status: 'draft',
          applications: 0,
          views: 0,
          createdAt: new Date().toISOString(),
          expiresAt: undefined,
          promoteJob: false,
        };
        state.jobs.unshift(duplicatedJob);
        state.stats.totalJobs += 1;
      }
    },
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.unshift(action.payload);
      state.stats.totalApplications += 1;
      state.stats.pendingApplications += 1;
    },
    updateApplication: (state, action: PayloadAction<Application>) => {
      const index = state.applications.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        const oldStatus = state.applications[index].status;
        state.applications[index] = action.payload;
        
        // Update pending count
        if (oldStatus === 'new' && action.payload.status !== 'new') {
          state.stats.pendingApplications = Math.max(0, state.stats.pendingApplications - 1);
        }
        
        // Update hired count
        if (action.payload.status === 'hired' && oldStatus !== 'hired') {
          state.stats.hiredCount += 1;
        }
      }
    },
    setRecentActivity: (state, action: PayloadAction<RecentActivity[]>) => {
      state.recentActivity = action.payload;
    },
    addActivity: (state, action: PayloadAction<RecentActivity>) => {
      state.recentActivity.unshift(action.payload);
      // Keep only last 50 activities
      if (state.recentActivity.length > 50) {
        state.recentActivity = state.recentActivity.slice(0, 50);
      }
    },
    // Job Draft Management
    saveJobDraft: (state, action: PayloadAction<{ draftId?: string; formData: Partial<Job>; step: number }>) => {
      const { draftId, formData, step } = action.payload;
      const existingIndex = draftId 
        ? state.jobDrafts.findIndex(d => d.id === draftId)
        : -1;
      
      const draft: JobDraft = {
        id: draftId || `draft-${Date.now()}`,
        formData,
        lastSaved: new Date().toISOString(),
        step,
      };

      if (existingIndex >= 0) {
        state.jobDrafts[existingIndex] = draft;
      } else {
        state.jobDrafts.unshift(draft);
        // Keep only last 10 drafts
        if (state.jobDrafts.length > 10) {
          state.jobDrafts = state.jobDrafts.slice(0, 10);
        }
      }
    },
    deleteJobDraft: (state, action: PayloadAction<string>) => {
      state.jobDrafts = state.jobDrafts.filter(d => d.id !== action.payload);
    },
    clearJobDrafts: (state) => {
      state.jobDrafts = [];
    },
    // Pipeline Stage Management
    addPipelineStage: (state, action: PayloadAction<Omit<PipelineStage, 'applicantCount'>>) => {
      const newStage: PipelineStage = {
        ...action.payload,
        applicantCount: 0,
      };
      state.pipelineStages.push(newStage);
      state.pipelineStages.sort((a, b) => a.order - b.order);
    },
    updatePipelineStage: (state, action: PayloadAction<Partial<PipelineStage> & { id: string }>) => {
      const index = state.pipelineStages.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.pipelineStages[index] = { ...state.pipelineStages[index], ...action.payload };
        state.pipelineStages.sort((a, b) => a.order - b.order);
      }
    },
    deletePipelineStage: (state, action: PayloadAction<string>) => {
      const stage = state.pipelineStages.find(s => s.id === action.payload);
      if (stage && stage.isCustom && stage.applicantCount === 0) {
        state.pipelineStages = state.pipelineStages.filter(s => s.id !== action.payload);
      }
    },
    reorderPipelineStages: (state, action: PayloadAction<Array<{ id: string; order: number }>>) => {
      action.payload.forEach(({ id, order }) => {
        const index = state.pipelineStages.findIndex(s => s.id === id);
        if (index !== -1) {
          state.pipelineStages[index].order = order;
        }
      });
      state.pipelineStages.sort((a, b) => a.order - b.order);
    },
    setStageMetrics: (state, action: PayloadAction<Record<string, PipelineStageMetrics>>) => {
      state.stageMetrics = action.payload;
    },
    // Application Notes & Activities
    addApplicationNote: (state, action: PayloadAction<{ applicationId: string; note: ApplicationNote }>) => {
      const app = state.applications.find(a => a.id === action.payload.applicationId);
      if (app) {
        if (!app.notes) app.notes = [];
        app.notes.push(action.payload.note);
        app.hasUnreadNotes = true;
        app.lastActivityAt = new Date().toISOString();
      }
    },
    addApplicationActivity: (state, action: PayloadAction<{ applicationId: string; activity: ApplicationActivity }>) => {
      const app = state.applications.find(a => a.id === action.payload.applicationId);
      if (app) {
        if (!app.activities) app.activities = [];
        app.activities.push(action.payload.activity);
        app.lastActivityAt = new Date().toISOString();
      }
    },
    assignRecruiter: (state, action: PayloadAction<{ applicationIds: string[]; recruiter: string }>) => {
      action.payload.applicationIds.forEach(id => {
        const app = state.applications.find(a => a.id === id);
        if (app) {
          app.assignedRecruiter = action.payload.recruiter;
        }
      });
    },
    addApplicationTags: (state, action: PayloadAction<{ applicationIds: string[]; tags: string[] }>) => {
      action.payload.applicationIds.forEach(id => {
        const app = state.applications.find(a => a.id === id);
        if (app) {
          if (!app.tags) app.tags = [];
          action.payload.tags.forEach(tag => {
            if (!app.tags!.includes(tag)) {
              app.tags!.push(tag);
            }
          });
        }
      });
    },
    removeApplicationTags: (state, action: PayloadAction<{ applicationIds: string[]; tags: string[] }>) => {
      action.payload.applicationIds.forEach(id => {
        const app = state.applications.find(a => a.id === id);
        if (app && app.tags) {
          app.tags = app.tags.filter(tag => !action.payload.tags.includes(tag));
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEmployerData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadEmployerData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.jobs = action.payload.jobs;
        state.applications = action.payload.applications;
        state.recentActivity = action.payload.recentActivity;
      })
      .addCase(loadEmployerData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  setStats,
  setJobs,
  addJob,
  updateJob,
  deleteJob,
  duplicateJob,
  setApplications,
  addApplication,
  updateApplication,
  setRecentActivity,
  addActivity,
  saveJobDraft,
  deleteJobDraft,
  clearJobDrafts,
  addPipelineStage,
  updatePipelineStage,
  deletePipelineStage,
  reorderPipelineStages,
  setStageMetrics,
  addApplicationNote,
  addApplicationActivity,
  assignRecruiter,
  addApplicationTags,
  removeApplicationTags,
} = employerSlice.actions;

export default employerSlice.reducer;


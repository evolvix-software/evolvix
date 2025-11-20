/**
 * Job Service - localStorage-based data access layer
 * Backend-ready: Can swap localStorage calls with API calls later
 */

import { Job } from '@/data/mock/jobsData';
import { 
  JobApplication, 
  Resume, 
  CoverLetter, 
  JobAlert, 
  CompanyPost, 
  JobFilters,
  SearchHistory,
  JobRecommendation,
  ApplicationStatus
} from '@/interfaces/jobs';
import { mockJobs } from '@/data/mock/jobsData';

// localStorage Keys
const STORAGE_KEYS = {
  JOBS: 'evolvix_jobs',
  APPLICATIONS: 'evolvix_job_applications',
  RESUMES: 'evolvix_resumes',
  COVER_LETTERS: 'evolvix_cover_letters',
  SAVED_JOBS: 'evolvix_saved_jobs',
  FOLLOWED_COMPANIES: 'evolvix_followed_companies',
  JOB_ALERTS: 'evolvix_job_alerts',
  COMPANY_POSTS: 'evolvix_company_posts',
  SEARCH_HISTORY: 'evolvix_search_history',
  UI_STATE: 'evolvix_ui_state',
} as const;

// Initialize localStorage with seed data
export function initializeJobData() {
  if (typeof window === 'undefined') return;

  // Seed jobs if not exists
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(mockJobs));
  }

  // Initialize other storage keys if not exists
  const defaults: Record<string, any> = {
    [STORAGE_KEYS.APPLICATIONS]: [],
    [STORAGE_KEYS.RESUMES]: [],
    [STORAGE_KEYS.COVER_LETTERS]: [],
    [STORAGE_KEYS.SAVED_JOBS]: [],
    [STORAGE_KEYS.FOLLOWED_COMPANIES]: [],
    [STORAGE_KEYS.JOB_ALERTS]: [],
    [STORAGE_KEYS.COMPANY_POSTS]: {},
    [STORAGE_KEYS.SEARCH_HISTORY]: [],
    [STORAGE_KEYS.UI_STATE]: {},
  };

  Object.entries(defaults).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
}

// ==================== JOBS ====================

export async function fetchJobs(filters?: JobFilters): Promise<Job[]> {
  if (typeof window === 'undefined') return [];
  
  initializeJobData();
  const jobsJson = localStorage.getItem(STORAGE_KEYS.JOBS);
  if (!jobsJson) return [];
  
  let jobs: Job[] = JSON.parse(jobsJson);
  
  // Apply filters
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.requirements.some(req => req.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.location && filters.location.length > 0) {
      jobs = jobs.filter(job => 
        filters.location!.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()))
      );
    }
    
    if (filters.jobType && filters.jobType.length > 0) {
      jobs = jobs.filter(job => filters.jobType!.includes(job.type));
    }
    
    if (filters.company && filters.company.length > 0) {
      jobs = jobs.filter(job => filters.company!.includes(job.company));
    }
    
    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      jobs = jobs.filter(job => filters.experienceLevel!.includes(job.experienceLevel));
    }
    
    if (filters.remote !== undefined) {
      jobs = jobs.filter(job => job.remote === filters.remote);
    }
    
    if (filters.salaryRange) {
      jobs = jobs.filter(job => {
        if (!job.salaryRange) return false;
        return job.salaryRange.min >= filters.salaryRange!.min && 
               job.salaryRange.max <= filters.salaryRange!.max;
      });
    }
    
    if (filters.datePosted && filters.datePosted !== 'all') {
      const now = Date.now();
      const daysAgo = filters.datePosted === '24h' ? 1 : 
                     filters.datePosted === '7d' ? 7 : 30;
      const cutoff = now - (daysAgo * 24 * 60 * 60 * 1000);
      jobs = jobs.filter(job => new Date(job.postedAt).getTime() >= cutoff);
    }
  }
  
  return jobs;
}

export async function getJobById(jobId: string): Promise<Job | null> {
  const jobs = await fetchJobs();
  return jobs.find(job => job.id === jobId) || null;
}

export async function getSimilarJobs(jobId: string, limit: number = 5): Promise<Job[]> {
  const targetJob = await getJobById(jobId);
  if (!targetJob) return [];
  
  const jobs = await fetchJobs();
  return jobs
    .filter(job => 
      job.id !== jobId && (
        job.title.toLowerCase().includes(targetJob.title.toLowerCase().split(' ')[0]) ||
        job.company === targetJob.company ||
        job.location === targetJob.location
      )
    )
    .slice(0, limit);
}

// ==================== APPLICATIONS ====================

export async function getApplications(): Promise<JobApplication[]> {
  if (typeof window === 'undefined') return [];
  
  const appsJson = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
  return appsJson ? JSON.parse(appsJson) : [];
}

export async function getApplicationByJobId(jobId: string): Promise<JobApplication | null> {
  const applications = await getApplications();
  return applications.find(app => app.jobId === jobId) || null;
}

export async function submitApplication(
  jobId: string,
  resumeId: string,
  coverLetterId?: string,
  coverLetterContent?: string,
  notes?: string
): Promise<JobApplication> {
  const job = await getJobById(jobId);
  if (!job) throw new Error('Job not found');
  
  const resume = await getResumeById(resumeId);
  if (!resume) throw new Error('Resume not found');
  
  const applications = await getApplications();
  
  // Check if already applied
  const existingApp = applications.find(app => app.jobId === jobId);
  if (existingApp) {
    throw new Error('You have already applied to this job');
  }
  
  const application: JobApplication = {
    id: `app-${Date.now()}`,
    jobId,
    jobTitle: job.title,
    company: job.company,
    appliedAt: new Date().toISOString(),
    status: 'pending',
    resumeId,
    resumeName: resume.name,
    coverLetterId,
    coverLetterContent,
    notes,
    updates: [{
      date: new Date().toISOString(),
      status: 'pending',
      note: 'Application submitted',
      updatedBy: 'user',
    }],
  };
  
  applications.push(application);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  
  return application;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  note?: string
): Promise<JobApplication> {
  const applications = await getApplications();
  const appIndex = applications.findIndex(app => app.id === applicationId);
  
  if (appIndex === -1) throw new Error('Application not found');
  
  const application = applications[appIndex];
  application.status = status;
  application.updates.push({
    date: new Date().toISOString(),
    status,
    note,
    updatedBy: 'system',
  });
  
  if (status === 'withdrawn') {
    application.withdrawnAt = new Date().toISOString();
  }
  
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  return application;
}

// ==================== RESUMES ====================

export async function getResumes(): Promise<Resume[]> {
  if (typeof window === 'undefined') return [];
  
  const resumesJson = localStorage.getItem(STORAGE_KEYS.RESUMES);
  return resumesJson ? JSON.parse(resumesJson) : [];
}

export async function getResumeById(resumeId: string): Promise<Resume | null> {
  const resumes = await getResumes();
  return resumes.find(r => r.id === resumeId) || null;
}

export async function getDefaultResume(): Promise<Resume | null> {
  const resumes = await getResumes();
  return resumes.find(r => r.isDefault) || resumes[0] || null;
}

export async function createResume(
  name: string,
  fileName: string,
  fileUrl?: string,
  content?: string
): Promise<Resume> {
  const resumes = await getResumes();
  const now = new Date().toISOString();
  
  // If this is the first resume, make it default
  const isDefault = resumes.length === 0;
  
  // If setting as default, unset others
  if (isDefault) {
    resumes.forEach(r => r.isDefault = false);
  }
  
  const resume: Resume = {
    id: `resume-${Date.now()}`,
    name,
    fileName,
    fileUrl,
    content,
    uploadedAt: now,
    isDefault,
    lastModified: now,
  };
  
  resumes.push(resume);
  localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
  
  return resume;
}

export async function setDefaultResume(resumeId: string): Promise<void> {
  const resumes = await getResumes();
  resumes.forEach(r => r.isDefault = r.id === resumeId);
  localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
}

export async function deleteResume(resumeId: string): Promise<void> {
  const resumes = await getResumes();
  const filtered = resumes.filter(r => r.id !== resumeId);
  localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(filtered));
}

// ==================== COVER LETTERS ====================

export async function getCoverLetters(): Promise<CoverLetter[]> {
  if (typeof window === 'undefined') return [];
  
  const lettersJson = localStorage.getItem(STORAGE_KEYS.COVER_LETTERS);
  return lettersJson ? JSON.parse(lettersJson) : [];
}

export async function getCoverLetterById(letterId: string): Promise<CoverLetter | null> {
  const letters = await getCoverLetters();
  return letters.find(l => l.id === letterId) || null;
}

export async function createCoverLetter(
  title: string,
  content: string,
  isTemplate: boolean = false
): Promise<CoverLetter> {
  const letters = await getCoverLetters();
  const now = new Date().toISOString();
  
  const letter: CoverLetter = {
    id: `letter-${Date.now()}`,
    title,
    content,
    createdAt: now,
    lastModified: now,
    isTemplate,
  };
  
  letters.push(letter);
  localStorage.setItem(STORAGE_KEYS.COVER_LETTERS, JSON.stringify(letters));
  
  return letter;
}

export async function updateCoverLetter(
  letterId: string,
  content: string
): Promise<CoverLetter> {
  const letters = await getCoverLetters();
  const letterIndex = letters.findIndex(l => l.id === letterId);
  
  if (letterIndex === -1) throw new Error('Cover letter not found');
  
  letters[letterIndex].content = content;
  letters[letterIndex].lastModified = new Date().toISOString();
  
  localStorage.setItem(STORAGE_KEYS.COVER_LETTERS, JSON.stringify(letters));
  return letters[letterIndex];
}

export async function deleteCoverLetter(letterId: string): Promise<void> {
  const letters = await getCoverLetters();
  const filtered = letters.filter(l => l.id !== letterId);
  localStorage.setItem(STORAGE_KEYS.COVER_LETTERS, JSON.stringify(filtered));
}

// ==================== SAVED JOBS ====================

export async function getSavedJobs(): Promise<string[]> {
  if (typeof window === 'undefined') return [];
  
  const savedJson = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
  return savedJson ? JSON.parse(savedJson) : [];
}

export async function isJobSaved(jobId: string): Promise<boolean> {
  const saved = await getSavedJobs();
  return saved.includes(jobId);
}

export async function saveJob(jobId: string): Promise<void> {
  const saved = await getSavedJobs();
  if (!saved.includes(jobId)) {
    saved.push(jobId);
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(saved));
  }
}

export async function unsaveJob(jobId: string): Promise<void> {
  const saved = await getSavedJobs();
  const filtered = saved.filter(id => id !== jobId);
  localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(filtered));
}

// ==================== FOLLOWED COMPANIES ====================

export async function getFollowedCompanies(): Promise<string[]> {
  if (typeof window === 'undefined') return [];
  
  const followedJson = localStorage.getItem(STORAGE_KEYS.FOLLOWED_COMPANIES);
  return followedJson ? JSON.parse(followedJson) : [];
}

export async function isCompanyFollowed(companyName: string): Promise<boolean> {
  const followed = await getFollowedCompanies();
  return followed.includes(companyName);
}

export async function followCompany(companyName: string): Promise<void> {
  const followed = await getFollowedCompanies();
  if (!followed.includes(companyName)) {
    followed.push(companyName);
    localStorage.setItem(STORAGE_KEYS.FOLLOWED_COMPANIES, JSON.stringify(followed));
  }
}

export async function unfollowCompany(companyName: string): Promise<void> {
  const followed = await getFollowedCompanies();
  const filtered = followed.filter(name => name !== companyName);
  localStorage.setItem(STORAGE_KEYS.FOLLOWED_COMPANIES, JSON.stringify(filtered));
}

// ==================== JOB ALERTS ====================

export async function getJobAlerts(): Promise<JobAlert[]> {
  if (typeof window === 'undefined') return [];
  
  const alertsJson = localStorage.getItem(STORAGE_KEYS.JOB_ALERTS);
  return alertsJson ? JSON.parse(alertsJson) : [];
}

export async function createJobAlert(alert: Omit<JobAlert, 'id' | 'createdAt' | 'matches' | 'lastChecked'>): Promise<JobAlert> {
  const alerts = await getJobAlerts();
  
  const newAlert: JobAlert = {
    ...alert,
    id: `alert-${Date.now()}`,
    createdAt: new Date().toISOString(),
    matches: [],
  };
  
  alerts.push(newAlert);
  localStorage.setItem(STORAGE_KEYS.JOB_ALERTS, JSON.stringify(alerts));
  
  // Check for matches immediately
  await checkAlertMatches(newAlert.id);
  
  return newAlert;
}

export async function updateJobAlert(alertId: string, updates: Partial<JobAlert>): Promise<JobAlert> {
  const alerts = await getJobAlerts();
  const alertIndex = alerts.findIndex(a => a.id === alertId);
  
  if (alertIndex === -1) throw new Error('Alert not found');
  
  alerts[alertIndex] = { ...alerts[alertIndex], ...updates };
  localStorage.setItem(STORAGE_KEYS.JOB_ALERTS, JSON.stringify(alerts));
  
  // Recheck matches if alert is active
  if (alerts[alertIndex].active) {
    await checkAlertMatches(alertId);
  }
  
  return alerts[alertIndex];
}

export async function deleteJobAlert(alertId: string): Promise<void> {
  const alerts = await getJobAlerts();
  const filtered = alerts.filter(a => a.id !== alertId);
  localStorage.setItem(STORAGE_KEYS.JOB_ALERTS, JSON.stringify(filtered));
}

export async function checkAlertMatches(alertId: string): Promise<string[]> {
  const alerts = await getJobAlerts();
  const alert = alerts.find(a => a.id === alertId);
  if (!alert || !alert.active) return [];
  
  const jobs = await fetchJobs();
  const matches: string[] = [];
  
  jobs.forEach(job => {
    let matchesAlert = true;
    
    // Check keywords
    if (alert.keywords.length > 0) {
      const jobText = `${job.title} ${job.description} ${job.requirements.join(' ')}`.toLowerCase();
      matchesAlert = matchesAlert && alert.keywords.some(keyword => 
        jobText.includes(keyword.toLowerCase())
      );
    }
    
    // Check location
    if (alert.location.length > 0) {
      matchesAlert = matchesAlert && alert.location.some(loc => 
        job.location.toLowerCase().includes(loc.toLowerCase())
      );
    }
    
    // Check company
    if (alert.company.length > 0) {
      matchesAlert = matchesAlert && alert.company.includes(job.company);
    }
    
    // Check experience level
    if (alert.experienceLevel.length > 0) {
      matchesAlert = matchesAlert && alert.experienceLevel.includes(job.experienceLevel);
    }
    
    // Check job type
    if (alert.jobType.length > 0) {
      matchesAlert = matchesAlert && alert.jobType.includes(job.type);
    }
    
    // Check salary range
    if (alert.salaryRange && job.salaryRange) {
      matchesAlert = matchesAlert && 
        job.salaryRange.min >= alert.salaryRange.min &&
        job.salaryRange.max <= alert.salaryRange.max;
    }
    
    if (matchesAlert) {
      matches.push(job.id);
    }
  });
  
  // Update alert with matches
  const alertIndex = alerts.findIndex(a => a.id === alertId);
  if (alertIndex !== -1) {
    alerts[alertIndex].matches = matches;
    alerts[alertIndex].lastChecked = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.JOB_ALERTS, JSON.stringify(alerts));
  }
  
  return matches;
}

export async function checkAllAlerts(): Promise<void> {
  const alerts = await getJobAlerts();
  const activeAlerts = alerts.filter(a => a.active);
  
  await Promise.all(activeAlerts.map(alert => checkAlertMatches(alert.id)));
}

// ==================== COMPANY POSTS ====================

export async function getCompanyPosts(companyName: string): Promise<CompanyPost[]> {
  if (typeof window === 'undefined') return [];
  
  const postsJson = localStorage.getItem(STORAGE_KEYS.COMPANY_POSTS);
  const posts: Record<string, CompanyPost[]> = postsJson ? JSON.parse(postsJson) : {};
  return posts[companyName] || [];
}

export async function createCompanyPost(
  companyName: string,
  content: string,
  image?: string
): Promise<CompanyPost> {
  const postsJson = localStorage.getItem(STORAGE_KEYS.COMPANY_POSTS);
  const posts: Record<string, CompanyPost[]> = postsJson ? JSON.parse(postsJson) : {};
  
  if (!posts[companyName]) {
    posts[companyName] = [];
  }
  
  const post: CompanyPost = {
    id: `post-${Date.now()}`,
    companyId: companyName.toLowerCase().replace(/\s+/g, '-'),
    companyName,
    content,
    postedAt: new Date().toISOString(),
    likes: [],
    comments: [],
    reposts: [],
    image,
  };
  
  posts[companyName].unshift(post);
  localStorage.setItem(STORAGE_KEYS.COMPANY_POSTS, JSON.stringify(posts));
  
  return post;
}

export async function likeCompanyPost(
  companyName: string,
  postId: string,
  userId: string
): Promise<void> {
  const posts = await getCompanyPosts(companyName);
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  const index = post.likes.indexOf(userId);
  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(index, 1);
  }
  
  const postsJson = localStorage.getItem(STORAGE_KEYS.COMPANY_POSTS);
  const allPosts: Record<string, CompanyPost[]> = postsJson ? JSON.parse(postsJson) : {};
  allPosts[companyName] = posts;
  localStorage.setItem(STORAGE_KEYS.COMPANY_POSTS, JSON.stringify(allPosts));
}

export async function addPostComment(
  companyName: string,
  postId: string,
  userId: string,
  userName: string,
  content: string,
  parentCommentId?: string
): Promise<void> {
  const posts = await getCompanyPosts(companyName);
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  const comment = {
    id: `comment-${Date.now()}`,
    userId,
    userName,
    content,
    postedAt: new Date().toISOString(),
    likes: [],
  };
  
  if (parentCommentId) {
    const parentComment = post.comments.find(c => c.id === parentCommentId);
    if (parentComment) {
      if (!parentComment.replies) parentComment.replies = [];
      parentComment.replies.push(comment);
    }
  } else {
    post.comments.push(comment);
  }
  
  const postsJson = localStorage.getItem(STORAGE_KEYS.COMPANY_POSTS);
  const allPosts: Record<string, CompanyPost[]> = postsJson ? JSON.parse(postsJson) : {};
  allPosts[companyName] = posts;
  localStorage.setItem(STORAGE_KEYS.COMPANY_POSTS, JSON.stringify(allPosts));
}

// ==================== SEARCH HISTORY ====================

export async function getSearchHistory(limit: number = 10): Promise<SearchHistory[]> {
  if (typeof window === 'undefined') return [];
  
  const historyJson = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
  const history: SearchHistory[] = historyJson ? JSON.parse(historyJson) : [];
  return history.slice(0, limit).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function addSearchHistory(
  query: string,
  filters?: JobFilters,
  resultsCount?: number
): Promise<void> {
  const history = await getSearchHistory(1000); // Get all
  
  // Remove duplicate
  const filtered = history.filter(h => h.query !== query);
  
  filtered.unshift({
    query,
    timestamp: new Date().toISOString(),
    filters,
    resultsCount,
  });
  
  // Keep only last 50 searches
  const limited = filtered.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limited));
}

export async function clearSearchHistory(): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([]));
}

// ==================== RECOMMENDATIONS ====================

export async function getJobRecommendations(limit: number = 5): Promise<JobRecommendation[]> {
  const savedJobs = await getSavedJobs();
  const applications = await getApplications();
  const followedCompanies = await getFollowedCompanies();
  
  const allJobs = await fetchJobs();
  const appliedJobIds = applications.map(app => app.jobId);
  const availableJobs = allJobs.filter(job => 
    !appliedJobIds.includes(job.id) && !savedJobs.includes(job.id)
  );
  
  const recommendations: JobRecommendation[] = [];
  
  // Based on saved jobs (similar titles/companies)
  if (savedJobs.length > 0) {
    const savedJobDetails = await Promise.all(
      savedJobs.map(id => getJobById(id))
    );
    const savedTitles = savedJobDetails
      .filter(Boolean)
      .map(job => job!.title.toLowerCase().split(' ')[0]);
    const savedCompanies = savedJobDetails
      .filter(Boolean)
      .map(job => job!.company);
    
    availableJobs.forEach(job => {
      const titleMatch = savedTitles.some(title => 
        job.title.toLowerCase().includes(title)
      );
      const companyMatch = savedCompanies.includes(job.company);
      
      if (titleMatch || companyMatch) {
        recommendations.push({
          job,
          reason: titleMatch && companyMatch 
            ? `Similar to jobs you saved at ${job.company}`
            : titleMatch
            ? `Similar to jobs you saved`
            : `From ${job.company}, a company you follow`,
          matchScore: job.matchScore || 75,
        });
      }
    });
  }
  
  // Based on followed companies
  if (followedCompanies.length > 0) {
    availableJobs.forEach(job => {
      if (followedCompanies.includes(job.company) && 
          !recommendations.find(r => r.job.id === job.id)) {
        recommendations.push({
          job,
          reason: `New job from ${job.company}, a company you follow`,
          matchScore: job.matchScore || 70,
        });
      }
    });
  }
  
  // Sort by match score and return top N
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

// ==================== UI STATE ====================

export async function saveUIState(state: Record<string, any>): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const currentState = getUIState();
  const newState = { ...currentState, ...state };
  localStorage.setItem(STORAGE_KEYS.UI_STATE, JSON.stringify(newState));
}

export function getUIState(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  
  const stateJson = localStorage.getItem(STORAGE_KEYS.UI_STATE);
  return stateJson ? JSON.parse(stateJson) : {};
}


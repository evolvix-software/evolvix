import { createAsyncThunk } from '@reduxjs/toolkit';
import { EmployerStats, Job, Application, RecentActivity } from './employerSlice';

// Mock data - replace with actual API calls
const mockStats: EmployerStats = {
  totalJobs: 12,
  activeJobs: 8,
  totalApplications: 245,
  pendingApplications: 4, // Updated to match mock applications (new status)
  hiredCount: 1, // Updated to match mock applications
  averageTimeToHire: 14,
  jobViews: 3420,
  applicationRate: 7.2,
};

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    status: 'active',
    applications: 45,
    views: 320,
    createdAt: '2024-03-01',
    expiresAt: '2024-04-01',
    location: 'Remote',
    employmentType: 'Full-time',
  },
  {
    id: '2',
    title: 'Product Designer',
    status: 'active',
    applications: 28,
    views: 245,
    createdAt: '2024-03-05',
    expiresAt: '2024-04-05',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
  },
  {
    id: '3',
    title: 'Marketing Manager',
    status: 'paused',
    applications: 15,
    views: 180,
    createdAt: '2024-02-20',
    location: 'New York, NY',
    employmentType: 'Full-time',
  },
];

const mockApplications: Application[] = [
  // New Applications
  {
    id: 'app-1',
    candidateId: 'candidate-1',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.johnson@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Senior Software Engineer',
    jobId: '1',
    status: 'new',
    matchScore: 94,
    appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    resumeUrl: 'https://example.com/resumes/sarah-johnson.pdf',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    location: 'San Francisco, CA',
    experience: '5+ years',
    assignedRecruiter: undefined,
    tags: ['Top Candidate', 'Full Stack'],
    notes: [],
    activities: [
      {
        id: 'act-1',
        type: 'resume_viewed',
        description: 'Resume viewed',
        actor: 'HR Team',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-2',
    candidateId: 'candidate-2',
    candidateName: 'Michael Chen',
    candidateEmail: 'michael.chen@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Senior Software Engineer',
    jobId: '1',
    status: 'new',
    matchScore: 87,
    appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    resumeUrl: 'https://example.com/resumes/michael-chen.pdf',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
    location: 'Remote',
    experience: '4+ years',
    assignedRecruiter: undefined,
    tags: ['Backend'],
    notes: [],
    activities: [],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-3',
    candidateId: 'candidate-3',
    candidateName: 'Emily Rodriguez',
    candidateEmail: 'emily.rodriguez@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Product Designer',
    jobId: '2',
    status: 'new',
    matchScore: 91,
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    resumeUrl: 'https://example.com/resumes/emily-rodriguez.pdf',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
    location: 'New York, NY',
    experience: '3+ years',
    assignedRecruiter: undefined,
    tags: ['UI/UX'],
    notes: [],
    activities: [],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-4',
    candidateId: 'candidate-4',
    candidateName: 'David Kim',
    candidateEmail: 'david.kim@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Senior Software Engineer',
    jobId: '1',
    status: 'new',
    matchScore: 82,
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    resumeUrl: 'https://example.com/resumes/david-kim.pdf',
    skills: ['Java', 'Spring Boot', 'Microservices', 'MongoDB', 'Kafka'],
    location: 'Seattle, WA',
    experience: '6+ years',
    assignedRecruiter: undefined,
    tags: ['Backend', 'Microservices'],
    notes: [],
    activities: [],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  
  // Reviewed Applications
  {
    id: 'app-5',
    candidateId: 'candidate-5',
    candidateName: 'Jessica Martinez',
    candidateEmail: 'jessica.martinez@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Product Designer',
    jobId: '2',
    status: 'reviewed',
    matchScore: 89,
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    resumeUrl: 'https://example.com/resumes/jessica-martinez.pdf',
    skills: ['Figma', 'Design Systems', 'User Testing', 'Prototyping', 'Illustration'],
    location: 'Los Angeles, CA',
    experience: '4+ years',
    assignedRecruiter: 'Alice Thompson',
    tags: ['UI/UX', 'Design Systems'],
    notes: [
      {
        id: 'note-1',
        content: 'Strong portfolio with excellent design system work. Good cultural fit.',
        author: 'Alice Thompson',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: false,
      },
    ],
    activities: [
      {
        id: 'act-2',
        type: 'status_change',
        description: 'Moved to Reviewed',
        actor: 'Alice Thompson',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'act-3',
        type: 'note_added',
        description: 'Note added',
        actor: 'Alice Thompson',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-6',
    candidateId: 'candidate-6',
    candidateName: 'Robert Taylor',
    candidateEmail: 'robert.taylor@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Senior Software Engineer',
    jobId: '1',
    status: 'reviewed',
    matchScore: 85,
    appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    resumeUrl: 'https://example.com/resumes/robert-taylor.pdf',
    skills: ['React', 'Vue.js', 'GraphQL', 'TypeScript', 'Jest'],
    location: 'Austin, TX',
    experience: '5+ years',
    assignedRecruiter: 'Bob Wilson',
    tags: ['Frontend'],
    notes: [
      {
        id: 'note-2',
        content: 'Good technical skills. Need to verify experience with GraphQL.',
        author: 'Bob Wilson',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: false,
      },
    ],
    activities: [
      {
        id: 'act-4',
        type: 'status_change',
        description: 'Moved to Reviewed',
        actor: 'Bob Wilson',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  
  // Shortlisted Applications
  {
    id: 'app-7',
    candidateId: 'candidate-7',
    candidateName: 'Amanda White',
    candidateEmail: 'amanda.white@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Product Designer',
    jobId: '2',
    status: 'shortlisted',
    matchScore: 93,
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    resumeUrl: 'https://example.com/resumes/amanda-white.pdf',
    skills: ['Figma', 'User Research', 'Design Thinking', 'Prototyping', 'Accessibility'],
    location: 'San Francisco, CA',
    experience: '6+ years',
    assignedRecruiter: 'Alice Thompson',
    tags: ['UI/UX', 'Top Candidate', 'Senior'],
    notes: [
      {
        id: 'note-3',
        content: 'Excellent portfolio. Strong user research background. Schedule interview.',
        author: 'Alice Thompson',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: false,
      },
      {
        id: 'note-4',
        content: 'Interview scheduled for next week.',
        author: 'Alice Thompson',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: true,
      },
    ],
    activities: [
      {
        id: 'act-5',
        type: 'status_change',
        description: 'Moved to Shortlisted',
        actor: 'Alice Thompson',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'act-6',
        type: 'interview_scheduled',
        description: 'Interview scheduled',
        actor: 'Alice Thompson',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: true,
    lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-8',
    candidateId: 'candidate-8',
    candidateName: 'James Wilson',
    candidateEmail: 'james.wilson@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Senior Software Engineer',
    jobId: '1',
    status: 'shortlisted',
    matchScore: 90,
    appliedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    resumeUrl: 'https://example.com/resumes/james-wilson.pdf',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'CI/CD'],
    location: 'Remote',
    experience: '7+ years',
    assignedRecruiter: 'Bob Wilson',
    tags: ['Full Stack', 'DevOps'],
    notes: [
      {
        id: 'note-5',
        content: 'Strong full-stack experience. Good communication skills.',
        author: 'Bob Wilson',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: false,
      },
    ],
    activities: [
      {
        id: 'act-7',
        type: 'status_change',
        description: 'Moved to Shortlisted',
        actor: 'Bob Wilson',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  
  // Interviewed Applications
  {
    id: 'app-9',
    candidateId: 'candidate-9',
    candidateName: 'Lisa Anderson',
    candidateEmail: 'lisa.anderson@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Product Designer',
    jobId: '2',
    status: 'interviewed',
    matchScore: 88,
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    resumeUrl: 'https://example.com/resumes/lisa-anderson.pdf',
    skills: ['Figma', 'Sketch', 'User Testing', 'Design Systems', 'Animation'],
    location: 'Chicago, IL',
    experience: '4+ years',
    assignedRecruiter: 'Alice Thompson',
    tags: ['UI/UX'],
    notes: [
      {
        id: 'note-6',
        content: 'Interview went well. Strong design skills and good team fit.',
        author: 'Alice Thompson',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: false,
      },
    ],
    activities: [
      {
        id: 'act-8',
        type: 'status_change',
        description: 'Moved to Interviewed',
        actor: 'Alice Thompson',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'act-9',
        type: 'interview_scheduled',
        description: 'Technical interview completed',
        actor: 'Alice Thompson',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-10',
    candidateId: 'candidate-10',
    candidateName: 'Christopher Brown',
    candidateEmail: 'christopher.brown@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Senior Software Engineer',
    jobId: '1',
    status: 'interviewed',
    matchScore: 86,
    appliedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    resumeUrl: 'https://example.com/resumes/christopher-brown.pdf',
    skills: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'AWS', 'Terraform'],
    location: 'Denver, CO',
    experience: '5+ years',
    assignedRecruiter: 'Bob Wilson',
    tags: ['Full Stack', 'Cloud'],
    notes: [
      {
        id: 'note-7',
        content: 'Technical interview completed. Good problem-solving skills.',
        author: 'Bob Wilson',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: false,
      },
    ],
    activities: [
      {
        id: 'act-10',
        type: 'status_change',
        description: 'Moved to Interviewed',
        actor: 'Bob Wilson',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  
  // Offered Applications
  {
    id: 'app-11',
    candidateId: 'candidate-11',
    candidateName: 'Maria Garcia',
    candidateEmail: 'maria.garcia@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Product Designer',
    jobId: '2',
    status: 'offered',
    matchScore: 95,
    appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    resumeUrl: 'https://example.com/resumes/maria-garcia.pdf',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Leadership'],
    location: 'San Francisco, CA',
    experience: '8+ years',
    assignedRecruiter: 'Alice Thompson',
    tags: ['UI/UX', 'Top Candidate', 'Senior', 'Leadership'],
    notes: [
      {
        id: 'note-8',
        content: 'Excellent candidate. Offer extended. Waiting for response.',
        author: 'Alice Thompson',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: false,
      },
    ],
    activities: [
      {
        id: 'act-11',
        type: 'status_change',
        description: 'Moved to Offered',
        actor: 'Alice Thompson',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  
  // Hired Applications
  {
    id: 'app-12',
    candidateId: 'candidate-12',
    candidateName: 'Daniel Lee',
    candidateEmail: 'daniel.lee@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Senior Software Engineer',
    jobId: '1',
    status: 'hired',
    matchScore: 92,
    appliedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    resumeUrl: 'https://example.com/resumes/daniel-lee.pdf',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'GraphQL', 'Jest'],
    location: 'Remote',
    experience: '6+ years',
    assignedRecruiter: 'Bob Wilson',
    tags: ['Full Stack', 'Top Candidate'],
    notes: [
      {
        id: 'note-9',
        content: 'Offer accepted! Start date: Next Monday.',
        author: 'Bob Wilson',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: false,
      },
    ],
    activities: [
      {
        id: 'act-12',
        type: 'status_change',
        description: 'Moved to Hired',
        actor: 'Bob Wilson',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  
  // Rejected Applications
  {
    id: 'app-13',
    candidateId: 'candidate-13',
    candidateName: 'Kevin Patel',
    candidateEmail: 'kevin.patel@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Senior Software Engineer',
    jobId: '1',
    status: 'rejected',
    matchScore: 65,
    appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    resumeUrl: 'https://example.com/resumes/kevin-patel.pdf',
    skills: ['Java', 'Spring', 'MySQL'],
    location: 'Boston, MA',
    experience: '2+ years',
    assignedRecruiter: 'Bob Wilson',
    tags: [],
    notes: [
      {
        id: 'note-10',
        content: 'Not enough experience for senior role. Consider for mid-level position.',
        author: 'Bob Wilson',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: true,
      },
    ],
    activities: [
      {
        id: 'act-13',
        type: 'status_change',
        description: 'Moved to Rejected',
        actor: 'Bob Wilson',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app-14',
    candidateId: 'candidate-14',
    candidateName: 'Rachel Green',
    candidateEmail: 'rachel.green@email.com',
    candidatePhoto: undefined,
    jobTitle: 'Product Designer',
    jobId: '2',
    status: 'rejected',
    matchScore: 58,
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    resumeUrl: 'https://example.com/resumes/rachel-green.pdf',
    skills: ['Photoshop', 'Illustrator'],
    location: 'Portland, OR',
    experience: '1+ year',
    assignedRecruiter: 'Alice Thompson',
    tags: [],
    notes: [
      {
        id: 'note-11',
        content: 'Portfolio doesn\'t match our requirements. Lacks modern design tools experience.',
        author: 'Alice Thompson',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isPrivate: true,
      },
    ],
    activities: [
      {
        id: 'act-14',
        type: 'status_change',
        description: 'Moved to Rejected',
        actor: 'Alice Thompson',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    hasUnreadNotes: false,
    lastActivityAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'application',
    title: 'New application received',
    description: 'John Doe applied for Senior Software Engineer',
    timestamp: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    type: 'job_posted',
    title: 'Job posted',
    description: 'Product Designer job is now live',
    timestamp: '2024-03-05T09:00:00Z',
  },
];

export const loadEmployerData = createAsyncThunk(
  'employer/loadEmployerData',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[loadEmployerData] Starting to load employer data...');
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      const data = {
        stats: mockStats,
        jobs: mockJobs,
        applications: mockApplications,
        recentActivity: mockActivity,
      };
      
      console.log('[loadEmployerData] Data loaded successfully:', {
        stats: data.stats,
        jobsCount: data.jobs.length,
        applicationsCount: data.applications.length,
        activityCount: data.recentActivity.length,
      });
      
      return data;
    } catch (error) {
      console.error('[loadEmployerData] Failed to load employer data:', error);
      return rejectWithValue('Failed to load employer data');
    }
  }
);


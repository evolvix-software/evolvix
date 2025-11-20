// Mock data for Scholarship Provider Portal
// Uses localStorage for persistence

export interface Provider {
  id: string;
  userId: string;
  organizationName: string;
  organizationSlug: string;
  logo?: string;
  banner?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  balance: number;
  totalPledged: number;
  totalTransferred: number;
  totalDisbursed: number;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  providerId: string;
  campaignSlug: string;
  title: string;
  description: string;
  campaignType: 'course-specific' | 'pooled' | 'general';
  linkedCourseIds: string[];
  totalSlots: number;
  slotsAvailable: number;
  slotsAwarded: number;
  slotsReserved: number;
  requiredAmount: number;
  fundedAmount: number;
  reservedFunds: number;
  fundingModel: 'per-student' | 'pooled' | 'variable';
  awardType: 'full' | 'partial';
  partialAmount?: number;
  eligibilityRules: {
    minCGPA?: number;
    maxCGPA?: number;
    financialNeedRequired: boolean;
    meritBased: boolean;
    needBased: boolean;
    specificCourses?: string[];
    geographicRestrictions?: string[];
    otherCriteria?: string;
  };
  applicationOpenDate: string;
  applicationCloseDate: string;
  isOpen: boolean;
  status: 'draft' | 'open' | 'closed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Application {
  id: string;
  studentId: string;
  courseId: string;
  campaignId: string;
  providerId: string;
  status: 'submitted' | 'under_verification' | 'review_pending' | 'shortlisted' | 'awarded' | 'rejected' | 'withdrawn';
  submittedAt: string;
  studentSnapshot: {
    name: string;
    email: string;
    phone?: string;
    cgpa: number;
    currentInstitution?: string;
  };
  documents: Array<{
    id: string;
    type: string;
    fileName: string;
    fileUrl: string;
    verified: boolean;
  }>;
  cgpa: number;
  familyIncome?: number;
  scholarshipJustification: string;
  verificationStatus: {
    documentsVerified: boolean;
    cgpaVerified: boolean;
    incomeVerified: boolean;
    overallStatus: string;
  };
  reviewerScores: Array<{
    reviewerId: string;
    academicScore: number;
    financialNeedScore: number;
    motivationScore: number;
    overallScore: number;
  }>;
  totalScore?: number;
  ranking?: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Scholar {
  id: string;
  studentId: string;
  providerId: string;
  campaignId: string;
  applicationId: string;
  awardAmount: number;
  awardType: 'full' | 'partial';
  awardDate: string;
  awardStatus: 'active' | 'completed' | 'paused' | 'revoked';
  profile: {
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    location?: string;
    linkedinUrl?: string;
  };
  baselineCGPA: number;
  currentCGPA?: number;
  cgpaImprovement?: number;
  graduationStatus: 'not-graduated' | 'graduated' | 'dropped-out';
  graduationDate?: string;
  graduationCGPA?: number;
  jobPlacement?: {
    id: string;
    jobTitle: string;
    companyName: string;
    location?: string;
    salary?: {
      amount: number;
      currency: string;
      period: string;
    };
    status: string;
    verified: boolean;
    startDate: string;
  };
  enrollments: Array<{
    id: string;
    courseId: string;
    enrollmentDate: string;
    completionPercentage: number;
    status: string;
  }>;
  engagement: {
    totalLogins: number;
    videoWatchPercentage: number;
    assignmentSubmissionRate: number;
    mentorSessionCount: number;
  };
  riskScore?: number;
  achievements: Array<{
    id: string;
    type: string;
    title: string;
    earnedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Transfer {
  id: string;
  providerId: string;
  campaignId?: string;
  amount: number;
  currency: string;
  transferMethod: string;
  status: 'initiated' | 'in-transit' | 'confirmed' | 'failed' | 'cancelled';
  transactionReference?: string;
  proofFileUrl?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  scholarshipSlots: number;
  scholarshipSlotsAvailable: number;
  price: number;
  thumbnail?: string;
}

// LocalStorage keys
const STORAGE_KEYS = {
  PROVIDERS: 'evolvix_providers',
  CAMPAIGNS: 'evolvix_campaigns',
  APPLICATIONS: 'evolvix_applications',
  SCHOLARS: 'evolvix_scholars',
  TRANSFERS: 'evolvix_transfers',
  COURSES: 'evolvix_courses',
  CURRENT_PROVIDER: 'evolvix_current_provider',
};

// Initialize mock data
const initializeMockData = () => {
  if (typeof window === 'undefined') return;

  // Initialize courses
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    const courses: Course[] = [
      {
        id: '1',
        title: 'Full Stack Web Development',
        description: 'Learn modern web development with React, Node.js, and MongoDB',
        instructor: 'John Doe',
        duration: '12 weeks',
        scholarshipSlots: 50,
        scholarshipSlotsAvailable: 35,
        price: 50000,
      },
      {
        id: '2',
        title: 'Data Science & Machine Learning',
        description: 'Master data science and ML with Python, TensorFlow, and more',
        instructor: 'Jane Smith',
        duration: '16 weeks',
        scholarshipSlots: 30,
        scholarshipSlotsAvailable: 20,
        price: 60000,
      },
      {
        id: '3',
        title: 'Cloud Computing & DevOps',
        description: 'Learn AWS, Docker, Kubernetes, and CI/CD pipelines',
        instructor: 'Mike Johnson',
        duration: '10 weeks',
        scholarshipSlots: 40,
        scholarshipSlotsAvailable: 28,
        price: 55000,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }

  // Initialize campaigns if not exists
  if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify([]));
  }

  // Initialize applications if not exists
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
  }

  // Initialize scholars if not exists
  if (!localStorage.getItem(STORAGE_KEYS.SCHOLARS)) {
    localStorage.setItem(STORAGE_KEYS.SCHOLARS, JSON.stringify([]));
  }

  // Initialize transfers if not exists
  if (!localStorage.getItem(STORAGE_KEYS.TRANSFERS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify([]));
  }
};

// Provider Service
export const providerService = {
  getCurrentProvider: (): Provider | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PROVIDER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentProvider: (provider: Provider): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROVIDER, JSON.stringify(provider));
  },

  createProvider: (providerData: Partial<Provider>): Provider => {
    const provider: Provider = {
      id: `provider_${Date.now()}`,
      userId: providerData.userId || `user_${Date.now()}`,
      organizationName: providerData.organizationName || '',
      organizationSlug: providerData.organizationSlug || '',
      contactEmail: providerData.contactEmail || '',
      balance: 0,
      totalPledged: 0,
      totalTransferred: 0,
      totalDisbursed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...providerData,
    };
    providerService.setCurrentProvider(provider);
    return provider;
  },

  updateProvider: (updates: Partial<Provider>): Provider | null => {
    const current = providerService.getCurrentProvider();
    if (!current) return null;
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    providerService.setCurrentProvider(updated);
    return updated;
  },
};

// Campaign Service
export const campaignService = {
  getAll: (providerId?: string): Campaign[] => {
    if (typeof window === 'undefined') return [];
    initializeMockData();
    const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    const campaigns: Campaign[] = data ? JSON.parse(data) : [];
    return providerId ? campaigns.filter(c => c.providerId === providerId) : campaigns;
  },

  getById: (id: string): Campaign | null => {
    const campaigns = campaignService.getAll();
    return campaigns.find(c => c.id === id) || null;
  },

  create: (campaign: Partial<Campaign>): Campaign => {
    initializeMockData();
    const newCampaign: Campaign = {
      id: `campaign_${Date.now()}`,
      providerId: campaign.providerId || '',
      campaignSlug: campaign.campaignSlug || '',
      title: campaign.title || '',
      description: campaign.description || '',
      campaignType: campaign.campaignType || 'general',
      linkedCourseIds: campaign.linkedCourseIds || [],
      totalSlots: campaign.totalSlots || 0,
      slotsAvailable: campaign.totalSlots || 0,
      slotsAwarded: 0,
      slotsReserved: 0,
      requiredAmount: campaign.requiredAmount || 0,
      fundedAmount: 0,
      reservedFunds: 0,
      fundingModel: campaign.fundingModel || 'per-student',
      awardType: campaign.awardType || 'full',
      eligibilityRules: campaign.eligibilityRules || {
        financialNeedRequired: false,
        meritBased: false,
        needBased: false,
      },
      applicationOpenDate: campaign.applicationOpenDate || new Date().toISOString(),
      applicationCloseDate: campaign.applicationCloseDate || new Date().toISOString(),
      isOpen: campaign.isOpen ?? true,
      status: campaign.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...campaign,
    };
    const campaigns = campaignService.getAll();
    campaigns.push(newCampaign);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    return newCampaign;
  },

  update: (id: string, updates: Partial<Campaign>): Campaign | null => {
    const campaigns = campaignService.getAll();
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;
    campaigns[index] = { ...campaigns[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    return campaigns[index];
  },

  delete: (id: string): boolean => {
    const campaigns = campaignService.getAll();
    const filtered = campaigns.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(filtered));
    return filtered.length < campaigns.length;
  },
};

// Application Service
export const applicationService = {
  getAll: (providerId?: string, campaignId?: string): Application[] => {
    if (typeof window === 'undefined') return [];
    initializeMockData();
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    let applications: Application[] = data ? JSON.parse(data) : [];
    if (providerId) applications = applications.filter(a => a.providerId === providerId);
    if (campaignId) applications = applications.filter(a => a.campaignId === campaignId);
    return applications;
  },

  getById: (id: string): Application | null => {
    const applications = applicationService.getAll();
    return applications.find(a => a.id === id) || null;
  },

  create: (application: Partial<Application>): Application => {
    initializeMockData();
    const newApplication: Application = {
      id: `app_${Date.now()}`,
      studentId: application.studentId || '',
      courseId: application.courseId || '',
      campaignId: application.campaignId || '',
      providerId: application.providerId || '',
      status: application.status || 'submitted',
      submittedAt: application.submittedAt || new Date().toISOString(),
      studentSnapshot: application.studentSnapshot || {
        name: '',
        email: '',
        cgpa: 0,
      },
      documents: application.documents || [],
      cgpa: application.cgpa || 0,
      scholarshipJustification: application.scholarshipJustification || '',
      verificationStatus: application.verificationStatus || {
        documentsVerified: false,
        cgpaVerified: false,
        incomeVerified: false,
        overallStatus: 'pending',
      },
      reviewerScores: application.reviewerScores || [],
      priority: application.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...application,
    };
    const applications = applicationService.getAll();
    applications.push(newApplication);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return newApplication;
  },

  update: (id: string, updates: Partial<Application>): Application | null => {
    const applications = applicationService.getAll();
    const index = applications.findIndex(a => a.id === id);
    if (index === -1) return null;
    applications[index] = { ...applications[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return applications[index];
  },
};

// Scholar Service
export const scholarService = {
  getAll: (providerId?: string): Scholar[] => {
    if (typeof window === 'undefined') return [];
    initializeMockData();
    const data = localStorage.getItem(STORAGE_KEYS.SCHOLARS);
    let scholars: Scholar[] = data ? JSON.parse(data) : [];
    if (providerId) scholars = scholars.filter(s => s.providerId === providerId);
    return scholars;
  },

  getById: (id: string): Scholar | null => {
    const scholars = scholarService.getAll();
    return scholars.find(s => s.id === id) || null;
  },

  create: (scholar: Partial<Scholar>): Scholar => {
    initializeMockData();
    const newScholar: Scholar = {
      id: `scholar_${Date.now()}`,
      studentId: scholar.studentId || '',
      providerId: scholar.providerId || '',
      campaignId: scholar.campaignId || '',
      applicationId: scholar.applicationId || '',
      awardAmount: scholar.awardAmount || 0,
      awardType: scholar.awardType || 'full',
      awardDate: scholar.awardDate || new Date().toISOString(),
      awardStatus: scholar.awardStatus || 'active',
      profile: scholar.profile || {
        name: '',
        email: '',
      },
      baselineCGPA: scholar.baselineCGPA || 0,
      graduationStatus: scholar.graduationStatus || 'not-graduated',
      enrollments: scholar.enrollments || [],
      engagement: scholar.engagement || {
        totalLogins: 0,
        videoWatchPercentage: 0,
        assignmentSubmissionRate: 0,
        mentorSessionCount: 0,
      },
      achievements: scholar.achievements || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...scholar,
    };
    const scholars = scholarService.getAll();
    scholars.push(newScholar);
    localStorage.setItem(STORAGE_KEYS.SCHOLARS, JSON.stringify(scholars));
    return newScholar;
  },

  update: (id: string, updates: Partial<Scholar>): Scholar | null => {
    const scholars = scholarService.getAll();
    const index = scholars.findIndex(s => s.id === id);
    if (index === -1) return null;
    scholars[index] = { ...scholars[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.SCHOLARS, JSON.stringify(scholars));
    return scholars[index];
  },
};

// Transfer Service
export const transferService = {
  getAll: (providerId?: string): Transfer[] => {
    if (typeof window === 'undefined') return [];
    initializeMockData();
    const data = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
    let transfers: Transfer[] = data ? JSON.parse(data) : [];
    if (providerId) transfers = transfers.filter(t => t.providerId === providerId);
    return transfers;
  },

  create: (transfer: Partial<Transfer>): Transfer => {
    initializeMockData();
    const newTransfer: Transfer = {
      id: `transfer_${Date.now()}`,
      providerId: transfer.providerId || '',
      amount: transfer.amount || 0,
      currency: transfer.currency || 'INR',
      transferMethod: transfer.transferMethod || 'bank_transfer',
      status: transfer.status || 'initiated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...transfer,
    };
    const transfers = transferService.getAll();
    transfers.push(newTransfer);
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
    return newTransfer;
  },
};

// Course Service
export const courseService = {
  getAll: (): Course[] => {
    if (typeof window === 'undefined') return [];
    initializeMockData();
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Course | null => {
    const courses = courseService.getAll();
    return courses.find(c => c.id === id) || null;
  },
};

// Initialize on import
if (typeof window !== 'undefined') {
  initializeMockData();
}


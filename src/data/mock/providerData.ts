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
  enrolledCount?: number;
  appliedForScholarships?: number;
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
        enrolledCount: 45,
        appliedForScholarships: 25,
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
        enrolledCount: 38,
        appliedForScholarships: 18,
      },
      {
        id: '3',
        title: 'Cloud Computing & DevOps',
        description: 'Learn AWS, Docker, Kubernetes, and CI/CD pipelines',
        instructor: 'Mike Johnson',
        duration: '10 weeks',
        scholarshipSlots: 40,
        scholarshipSlotsAvailable: 28,
        enrolledCount: 42,
        appliedForScholarships: 22,
        price: 55000,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }

  // Initialize campaigns with mock data
  if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
    console.log('[initializeMockData] Initializing campaigns...');
    // Use placeholder provider ID - campaigns will be assigned to actual provider when they access the page
    // This avoids hydration issues and ensures campaigns are assigned to the logged-in provider
    const defaultProviderId = 'provider_placeholder';

    const mockCampaigns: Campaign[] = [
      {
        id: 'campaign_1',
        providerId: defaultProviderId,
        campaignSlug: 'tech-scholarship-2024',
        title: 'Tech Scholarship Program 2024',
        description: 'A comprehensive scholarship program designed to support talented students pursuing careers in technology. This program covers full tuition for selected courses and provides mentorship opportunities. We are looking for students with strong academic records, financial need, and a passion for technology.',
        campaignType: 'course-specific',
        linkedCourseIds: ['1', '2'],
        totalSlots: 50,
        slotsAvailable: 35,
        slotsAwarded: 12,
        slotsReserved: 3,
        requiredAmount: 2500000,
        fundedAmount: 1500000,
        reservedFunds: 300000,
        fundingModel: 'per-student',
        awardType: 'full',
        eligibilityRules: {
          minCGPA: 7.5,
          maxCGPA: 10,
          financialNeedRequired: true,
          meritBased: true,
          needBased: true,
          specificCourses: ['1', '2'],
          otherCriteria: 'Must demonstrate passion for technology and provide recommendation letter',
        },
        applicationOpenDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCloseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        isOpen: true,
        status: 'open',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'campaign_2',
        providerId: defaultProviderId,
        campaignSlug: 'women-in-tech-2024',
        title: 'Women in Tech Scholarship 2024',
        description: 'Empowering women to pursue careers in technology through financial support and mentorship. This scholarship is specifically designed to bridge the gender gap in tech by supporting female students with exceptional potential. Includes networking opportunities, mentorship from industry leaders, and career guidance.',
        campaignType: 'pooled',
        linkedCourseIds: ['1', '2', '3'],
        totalSlots: 30,
        slotsAvailable: 18,
        slotsAwarded: 10,
        slotsReserved: 2,
        requiredAmount: 1800000,
        fundedAmount: 1200000,
        reservedFunds: 200000,
        fundingModel: 'pooled',
        awardType: 'full',
        eligibilityRules: {
          minCGPA: 7.0,
          maxCGPA: 10,
          financialNeedRequired: true,
          meritBased: true,
          needBased: true,
          otherCriteria: 'Open only to female students. Must submit personal statement about career goals in technology.',
        },
        applicationOpenDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        isOpen: true,
        status: 'open',
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'campaign_3',
        providerId: defaultProviderId,
        campaignSlug: 'cloud-computing-scholarship',
        title: 'Cloud Computing Excellence Scholarship',
        description: 'Supporting students interested in cloud computing and DevOps. This scholarship covers courses in AWS, Docker, Kubernetes, and CI/CD pipelines. Ideal for students looking to build careers in cloud infrastructure and DevOps engineering.',
        campaignType: 'course-specific',
        linkedCourseIds: ['3'],
        totalSlots: 25,
        slotsAvailable: 15,
        slotsAwarded: 8,
        slotsReserved: 2,
        requiredAmount: 1375000,
        fundedAmount: 825000,
        reservedFunds: 275000,
        fundingModel: 'per-student',
        awardType: 'full',
        eligibilityRules: {
          minCGPA: 8.0,
          maxCGPA: 10,
          financialNeedRequired: false,
          meritBased: true,
          needBased: false,
          specificCourses: ['3'],
          otherCriteria: 'Must demonstrate interest in cloud computing through projects or previous coursework',
        },
        applicationOpenDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isOpen: true,
        status: 'open',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'campaign_4',
        providerId: defaultProviderId,
        campaignSlug: 'data-science-scholarship-2024',
        title: 'Data Science & ML Scholarship 2024',
        description: 'Comprehensive scholarship for students pursuing data science and machine learning. Covers full course fees and provides access to industry datasets, mentorship from data scientists, and internship opportunities. Perfect for students passionate about AI and data analytics.',
        campaignType: 'course-specific',
        linkedCourseIds: ['2'],
        totalSlots: 20,
        slotsAvailable: 8,
        slotsAwarded: 10,
        slotsReserved: 2,
        requiredAmount: 1200000,
        fundedAmount: 1200000,
        reservedFunds: 240000,
        fundingModel: 'per-student',
        awardType: 'full',
        eligibilityRules: {
          minCGPA: 8.5,
          maxCGPA: 10,
          financialNeedRequired: true,
          meritBased: true,
          needBased: true,
          specificCourses: ['2'],
          otherCriteria: 'Must have completed at least one statistics or programming course. Portfolio of data projects preferred.',
        },
        applicationOpenDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCloseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        isOpen: false,
        status: 'closed',
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'campaign_5',
        providerId: defaultProviderId,
        campaignSlug: 'general-tech-scholarship',
        title: 'General Technology Scholarship',
        description: 'A flexible scholarship program open to all technology-related courses. This program supports students across various tech disciplines and provides partial funding based on financial need and academic merit. Great for students exploring different tech career paths.',
        campaignType: 'general',
        linkedCourseIds: [],
        totalSlots: 40,
        slotsAvailable: 25,
        slotsAwarded: 12,
        slotsReserved: 3,
        requiredAmount: 2000000,
        fundedAmount: 1000000,
        reservedFunds: 300000,
        fundingModel: 'variable',
        awardType: 'partial',
        partialAmount: 25000,
        eligibilityRules: {
          minCGPA: 6.5,
          maxCGPA: 10,
          financialNeedRequired: true,
          meritBased: true,
          needBased: true,
          otherCriteria: 'Open to all technology courses. Award amount varies based on financial need and academic performance.',
        },
        applicationOpenDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        applicationCloseDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
        isOpen: true,
        status: 'open',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(mockCampaigns));
    console.log('[initializeMockData] Initialized', mockCampaigns.length, 'campaigns with providerId:', defaultProviderId);
  } else {
    const existingCampaigns = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');
    console.log('[initializeMockData] Campaigns already exist:', existingCampaigns.length, existingCampaigns.map((c: Campaign) => ({ id: c.id, providerId: c.providerId })));
  }

  // Initialize applications if not exists
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    const defaultProviderId = 'provider_placeholder';
    const mockApplications: Application[] = [
      {
        id: 'app_1',
        studentId: 'ST-101',
        courseId: '1',
        campaignId: 'campaign_1',
        providerId: defaultProviderId,
        status: 'review_pending',
        submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        studentSnapshot: {
          name: 'Aarav Patel',
          email: 'aarav.p@example.com',
          phone: '+91 98765 43210',
          cgpa: 8.9,
          currentInstitution: 'Mumbai University',
        },
        documents: [
          {
            id: 'doc_1',
            type: 'transcript',
            fileName: 'Transcript.pdf',
            fileUrl: '#',
            verified: true,
          },
          {
            id: 'doc_2',
            type: 'income_proof',
            fileName: 'Income_Proof.pdf',
            fileUrl: '#',
            verified: true,
          },
        ],
        cgpa: 8.9,
        familyIncome: 350000,
        scholarshipJustification: 'I am a third-year Computer Science student with a strong passion for full-stack web development.',
        verificationStatus: {
          documentsVerified: true,
          cgpaVerified: true,
          incomeVerified: true,
          overallStatus: 'completed',
        },
        reviewerScores: [
          {
            reviewerId: 'rev_1',
            academicScore: 90,
            financialNeedScore: 80,
            motivationScore: 85,
            overallScore: 85,
          },
        ],
        totalScore: 85,
        ranking: 12,
        priority: 'high',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'app_2',
        studentId: 'ST-102',
        courseId: '2',
        campaignId: 'campaign_2',
        providerId: defaultProviderId,
        status: 'under_verification',
        submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        studentSnapshot: {
          name: 'Zara Khan',
          email: 'zara.k@example.com',
          phone: '+91 98765 43211',
          cgpa: 9.2,
          currentInstitution: 'Mumbai University',
        },
        documents: [
          {
            id: 'doc_3',
            type: 'transcript',
            fileName: 'Transcript.pdf',
            fileUrl: '#',
            verified: false,
          },
        ],
        cgpa: 9.2,
        familyIncome: 280000,
        scholarshipJustification: 'As a female student pursuing Data Science, I face financial constraints.',
        verificationStatus: {
          documentsVerified: false,
          cgpaVerified: false,
          incomeVerified: false,
          overallStatus: 'in_progress',
        },
        reviewerScores: [],
        priority: 'medium',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'app_3',
        studentId: 'ST-104',
        courseId: '1',
        campaignId: 'campaign_1',
        providerId: defaultProviderId,
        status: 'shortlisted',
        submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        studentSnapshot: {
          name: 'Priya Sharma',
          email: 'priya.s@example.com',
          phone: '+91 98765 43212',
          cgpa: 9.5,
          currentInstitution: 'Indian Institute of Technology',
        },
        documents: [
          {
            id: 'doc_4',
            type: 'transcript',
            fileName: 'Transcript.pdf',
            fileUrl: '#',
            verified: true,
          },
          {
            id: 'doc_5',
            type: 'income_proof',
            fileName: 'Income_Proof.pdf',
            fileUrl: '#',
            verified: true,
          },
        ],
        cgpa: 9.5,
        familyIncome: 320000,
        scholarshipJustification: 'I am a Computer Science student at IIT with a CGPA of 9.5.',
        verificationStatus: {
          documentsVerified: true,
          cgpaVerified: true,
          incomeVerified: true,
          overallStatus: 'completed',
        },
        reviewerScores: [
          {
            reviewerId: 'rev_2',
            academicScore: 95,
            financialNeedScore: 90,
            motivationScore: 90,
            overallScore: 92,
          },
        ],
        totalScore: 92,
        ranking: 3,
        priority: 'high',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(mockApplications));
  }

  // Initialize scholars if not exists
  if (!localStorage.getItem(STORAGE_KEYS.SCHOLARS)) {
    console.log('[initializeMockData] Initializing scholars...');
    const defaultProviderId = 'provider_placeholder';
    const mockScholars: Scholar[] = [
      {
        id: 'scholar_1',
        studentId: 'ST-101',
        providerId: defaultProviderId,
        campaignId: 'campaign_1',
        applicationId: 'app_1',
        awardAmount: 50000,
        awardType: 'full',
        awardDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        awardStatus: 'active',
        profile: {
          name: 'Aarav Patel',
          email: 'aarav.p@example.com',
          phone: '+91 98765 43210',
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
          location: 'Mumbai, Maharashtra',
          linkedinUrl: 'https://linkedin.com/in/aarav-patel',
        },
        baselineCGPA: 8.9,
        currentCGPA: 9.1,
        cgpaImprovement: 0.2,
        graduationStatus: 'not-graduated',
        enrollments: [
          {
            id: 'enroll_1',
            courseId: '1',
            enrollmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            completionPercentage: 65,
            status: 'in-progress',
          },
        ],
        engagement: {
          totalLogins: 45,
          videoWatchPercentage: 72,
          assignmentSubmissionRate: 85,
          mentorSessionCount: 3,
        },
        achievements: [
          {
            id: 'ach_1',
            type: 'milestone',
            title: 'Completed Module 3',
            earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        riskScore: 25,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'scholar_2',
        studentId: 'ST-104',
        providerId: defaultProviderId,
        campaignId: 'campaign_1',
        applicationId: 'app_3',
        awardAmount: 50000,
        awardType: 'full',
        awardDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        awardStatus: 'active',
        profile: {
          name: 'Priya Sharma',
          email: 'priya.s@example.com',
          phone: '+91 98765 43212',
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
          location: 'Bangalore, Karnataka',
          linkedinUrl: 'https://linkedin.com/in/priya-sharma',
        },
        baselineCGPA: 9.5,
        currentCGPA: 9.6,
        cgpaImprovement: 0.1,
        graduationStatus: 'not-graduated',
        enrollments: [
          {
            id: 'enroll_2',
            courseId: '1',
            enrollmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            completionPercentage: 85,
            status: 'in-progress',
          },
        ],
        engagement: {
          totalLogins: 62,
          videoWatchPercentage: 88,
          assignmentSubmissionRate: 95,
          mentorSessionCount: 5,
        },
        achievements: [
          {
            id: 'ach_2',
            type: 'achievement',
            title: 'Top Performer - Highest Score in Module 4',
            earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        riskScore: 15,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'scholar_3',
        studentId: 'ST-105',
        providerId: defaultProviderId,
        campaignId: 'campaign_2',
        applicationId: 'app_5',
        awardAmount: 60000,
        awardType: 'full',
        awardDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        awardStatus: 'active',
        profile: {
          name: 'Vikram Singh',
          email: 'vikram.s@example.com',
          phone: '+91 98765 43213',
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
          location: 'Pune, Maharashtra',
        },
        baselineCGPA: 8.8,
        currentCGPA: 9.0,
        cgpaImprovement: 0.2,
        graduationStatus: 'graduated',
        graduationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        graduationCGPA: 9.0,
        jobPlacement: {
          id: 'job_1',
          jobTitle: 'Data Scientist',
          companyName: 'Tech Corp',
          location: 'Bangalore',
          salary: {
            amount: 1200000,
            currency: 'INR',
            period: 'year',
          },
          status: 'started',
          verified: true,
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        enrollments: [
          {
            id: 'enroll_3',
            courseId: '2',
            enrollmentDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            completionPercentage: 100,
            status: 'completed',
          },
        ],
        engagement: {
          totalLogins: 120,
          videoWatchPercentage: 95,
          assignmentSubmissionRate: 100,
          mentorSessionCount: 8,
        },
        achievements: [
          {
            id: 'ach_3',
            type: 'graduation',
            title: 'Course Completed - Data Science & Machine Learning',
            earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'ach_4',
            type: 'job',
            title: 'Job Placed - Data Scientist at Tech Corp',
            earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        riskScore: 5,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SCHOLARS, JSON.stringify(mockScholars));
    console.log('[initializeMockData] Initialized', mockScholars.length, 'scholars with providerId:', defaultProviderId);
  } else {
    const existingScholars = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARS) || '[]');
    console.log('[initializeMockData] Scholars already exist:', existingScholars.length, existingScholars.map((s: Scholar) => ({ id: s.id, providerId: s.providerId })));
  }

  // Initialize transfers if not exists
  if (!localStorage.getItem(STORAGE_KEYS.TRANSFERS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify([]));
  }

  // Initialize providers if not exists
  if (!localStorage.getItem(STORAGE_KEYS.PROVIDERS)) {
    const mockProviders: Provider[] = [
      {
        id: 'provider_1',
        userId: 'user_1',
        organizationName: 'Tech Education Foundation',
        organizationSlug: 'tech-education-foundation',
        contactEmail: 'contact@techedu.org',
        balance: 5000000,
        totalPledged: 10000000,
        totalTransferred: 5000000,
        totalDisbursed: 3000000,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'provider_2',
        userId: 'user_2',
        organizationName: 'Global Scholarship Initiative',
        organizationSlug: 'global-scholarship-initiative',
        contactEmail: 'info@globalscholarship.org',
        balance: 3000000,
        totalPledged: 8000000,
        totalTransferred: 5000000,
        totalDisbursed: 2000000,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'provider_3',
        userId: 'user_3',
        organizationName: 'Future Leaders Fund',
        organizationSlug: 'future-leaders-fund',
        contactEmail: 'hello@futureleaders.org',
        balance: 2000000,
        totalPledged: 5000000,
        totalTransferred: 3000000,
        totalDisbursed: 1000000,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(mockProviders));
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
    
    // Also add to providers list
    if (typeof window !== 'undefined') {
      initializeMockData();
      const providers = providerService.getAll();
      // Check if provider already exists
      const existingIndex = providers.findIndex(p => p.id === provider.id);
      if (existingIndex !== -1) {
        providers[existingIndex] = provider;
      } else {
        providers.push(provider);
      }
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
      
      // Assign placeholder campaigns and scholars to this provider immediately
      // Assign campaigns
      const allCampaigns = campaignService.getAll();
      const campaignsToAssign = allCampaigns.filter(c => {
        const pid = String(c.providerId || '').trim();
        return pid === 'provider_placeholder' || 
               pid.startsWith('provider_mock_') ||
               pid === '' ||
               !c.providerId;
      });
      
      // If no placeholder campaigns found but provider has none, assign all (for demo)
      const campaignsToAssignFinal = campaignsToAssign.length > 0 
        ? campaignsToAssign 
        : (allCampaigns.length > 0 ? allCampaigns : []);
      
      console.log('[createProvider] Assigning', campaignsToAssignFinal.length, 'campaigns to provider', provider.id);
      campaignsToAssignFinal.forEach(campaign => {
        campaignService.update(campaign.id, { providerId: provider.id });
      });
      
      // Assign scholars
      const allScholars = scholarService.getAll();
      const scholarsToAssign = allScholars.filter(s => {
        const pid = String(s.providerId || '').trim();
        return pid === 'provider_placeholder' || 
               pid.startsWith('provider_mock_') ||
               pid === '' ||
               !s.providerId;
      });
      
      // If no placeholder scholars found but provider has none, assign all (for demo)
      const scholarsToAssignFinal = scholarsToAssign.length > 0 
        ? scholarsToAssign 
        : (allScholars.length > 0 ? allScholars : []);
      
      console.log('[createProvider] Assigning', scholarsToAssignFinal.length, 'scholars to provider', provider.id);
      scholarsToAssignFinal.forEach(scholar => {
        scholarService.update(scholar.id, { providerId: provider.id });
      });
    }
    
    return provider;
  },

  // Helper function to ensure data is assigned to provider
  ensureDataAssigned: (providerId: string): void => {
    if (typeof window === 'undefined') return;
    
    console.log('[ensureDataAssigned] Starting for provider:', providerId);
    
    // Initialize mock data first
    initializeMockData();
    
    // Assign campaigns - get all campaigns without filtering by providerId
    const allCampaigns = campaignService.getAll();
    console.log('[ensureDataAssigned] All campaigns found:', allCampaigns.length);
    console.log('[ensureDataAssigned] Campaign providerIds:', allCampaigns.map(c => ({ id: c.id, providerId: c.providerId })));
    
    // Check if provider already has campaigns
    const existingProviderCampaigns = campaignService.getAll(providerId);
    console.log('[ensureDataAssigned] Existing provider campaigns:', existingProviderCampaigns.length);
    
    // If provider has no campaigns, assign all placeholder campaigns
    if (existingProviderCampaigns.length === 0) {
      // More permissive filter - assign any campaign that looks like a placeholder
      const campaignsToAssign = allCampaigns.filter(c => {
        const pid = String(c.providerId || '').trim();
        return pid === 'provider_placeholder' || 
               pid.startsWith('provider_mock_') ||
               pid === '' ||
               !c.providerId;
      });
      console.log('[ensureDataAssigned] Campaigns to assign:', campaignsToAssign.length);
      if (campaignsToAssign.length > 0) {
        console.log('[ensureDataAssigned] Campaign details:', campaignsToAssign.map(c => ({ id: c.id, providerId: String(c.providerId || 'undefined'), type: typeof c.providerId })));
        campaignsToAssign.forEach(campaign => {
          console.log('[ensureDataAssigned] Assigning campaign', campaign.id, 'from providerId', campaign.providerId, 'to provider', providerId);
          const result = campaignService.update(campaign.id, { providerId });
          console.log('[ensureDataAssigned] Update result:', result ? 'success' : 'failed');
        });
      } else {
        console.log('[ensureDataAssigned] No campaigns match placeholder criteria. All campaigns:', allCampaigns.map(c => ({ id: c.id, providerId: String(c.providerId || 'undefined') })));
        // Fallback: if provider has no campaigns and no placeholders exist, assign all campaigns (for demo)
        if (allCampaigns.length > 0) {
          console.log('[ensureDataAssigned] Fallback: Assigning all campaigns to provider (demo mode)');
          allCampaigns.forEach(campaign => {
            campaignService.update(campaign.id, { providerId });
          });
        }
      }
    }
    
    // Verify assignment
    const assignedCampaigns = campaignService.getAll(providerId);
    console.log('[ensureDataAssigned] Assigned campaigns after update:', assignedCampaigns.length);
    
    // Assign scholars - get all scholars without filtering by providerId
    const allScholars = scholarService.getAll();
    console.log('[ensureDataAssigned] All scholars found:', allScholars.length);
    console.log('[ensureDataAssigned] Scholar providerIds:', allScholars.map(s => ({ id: s.id, providerId: s.providerId })));
    
    // Check if provider already has scholars
    const existingProviderScholars = scholarService.getAll(providerId);
    console.log('[ensureDataAssigned] Existing provider scholars:', existingProviderScholars.length);
    
    // If provider has no scholars, assign all placeholder scholars
    if (existingProviderScholars.length === 0) {
      // More permissive filter - assign any scholar that looks like a placeholder
      const scholarsToAssign = allScholars.filter(s => {
        const pid = String(s.providerId || '').trim();
        return pid === 'provider_placeholder' || 
               pid.startsWith('provider_mock_') ||
               pid === '' ||
               !s.providerId;
      });
      console.log('[ensureDataAssigned] Scholars to assign:', scholarsToAssign.length);
      if (scholarsToAssign.length > 0) {
        console.log('[ensureDataAssigned] Scholar details:', scholarsToAssign.map(s => ({ id: s.id, providerId: String(s.providerId || 'undefined'), type: typeof s.providerId })));
        scholarsToAssign.forEach(scholar => {
          console.log('[ensureDataAssigned] Assigning scholar', scholar.id, 'from providerId', scholar.providerId, 'to provider', providerId);
          const result = scholarService.update(scholar.id, { providerId });
          console.log('[ensureDataAssigned] Update result:', result ? 'success' : 'failed');
        });
      } else {
        console.log('[ensureDataAssigned] No scholars match placeholder criteria. All scholars:', allScholars.map(s => ({ id: s.id, providerId: String(s.providerId || 'undefined') })));
        // Fallback: if provider has no scholars and no placeholders exist, assign all scholars (for demo)
        if (allScholars.length > 0) {
          console.log('[ensureDataAssigned] Fallback: Assigning all scholars to provider (demo mode)');
          allScholars.forEach(scholar => {
            scholarService.update(scholar.id, { providerId });
          });
        }
      }
    }
    
    // Verify assignment
    const assignedScholars = scholarService.getAll(providerId);
    console.log('[ensureDataAssigned] Assigned scholars after update:', assignedScholars.length);
    
    // Also assign applications
    const allApplications = applicationService.getAll();
    console.log('[ensureDataAssigned] All applications found:', allApplications.length);
    const applicationsToAssign = allApplications.filter(
      a => a.providerId === 'provider_placeholder' || 
           (a.providerId && a.providerId.startsWith('provider_mock_')) ||
           !a.providerId
    );
    console.log('[ensureDataAssigned] Applications to assign:', applicationsToAssign.length);
    applicationsToAssign.forEach(application => {
      console.log('[ensureDataAssigned] Assigning application', application.id, 'to provider', providerId);
      applicationService.update(application.id, { providerId });
    });
    
    console.log('[ensureDataAssigned] Completed for provider:', providerId);
  },

  updateProvider: (updates: Partial<Provider>): Provider | null => {
    const current = providerService.getCurrentProvider();
    if (!current) return null;
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    providerService.setCurrentProvider(updated);
    
    // Also update in providers list
    if (typeof window !== 'undefined') {
      const providers = providerService.getAll();
      const index = providers.findIndex(p => p.id === current.id);
      if (index !== -1) {
        providers[index] = updated;
        localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
      }
    }
    
    return updated;
  },

  getAll: (): Provider[] => {
    if (typeof window === 'undefined') return [];
    initializeMockData();
    const data = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    if (data) {
      return JSON.parse(data);
    }
    // If no providers list exists, return current provider if it exists
    const current = providerService.getCurrentProvider();
    return current ? [current] : [];
  },

  getById: (id: string): Provider | null => {
    if (typeof window === 'undefined') return null;
    const providers = providerService.getAll();
    return providers.find(p => p.id === id) || null;
  },
};

// Campaign Service
export const campaignService = {
  getAll: (providerId?: string): Campaign[] => {
    if (typeof window === 'undefined') return [];
    initializeMockData();
    const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    const campaigns: Campaign[] = data ? JSON.parse(data) : [];
    console.log('[campaignService.getAll] Total campaigns:', campaigns.length, 'Filter by providerId:', providerId);
    if (providerId) {
      const filtered = campaigns.filter(c => c.providerId === providerId);
      console.log('[campaignService.getAll] Filtered campaigns:', filtered.length, filtered.map(c => ({ id: c.id, providerId: c.providerId })));
      return filtered;
    }
    console.log('[campaignService.getAll] Returning all campaigns:', campaigns.map(c => ({ id: c.id, providerId: c.providerId })));
    return campaigns;
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
    if (index === -1) {
      console.log('[campaignService.update] Campaign not found:', id);
      return null;
    }
    console.log('[campaignService.update] Updating campaign:', id, 'with updates:', updates, 'old providerId:', campaigns[index].providerId);
    campaigns[index] = { ...campaigns[index], ...updates, updatedAt: new Date().toISOString() };
    console.log('[campaignService.update] New providerId:', campaigns[index].providerId);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    console.log('[campaignService.update] Saved to localStorage');
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
    console.log('[scholarService.getAll] Total scholars:', scholars.length, 'Filter by providerId:', providerId);
    if (providerId) {
      const filtered = scholars.filter(s => s.providerId === providerId);
      console.log('[scholarService.getAll] Filtered scholars:', filtered.length, filtered.map(s => ({ id: s.id, providerId: s.providerId })));
      return filtered;
    }
    console.log('[scholarService.getAll] Returning all scholars:', scholars.map(s => ({ id: s.id, providerId: s.providerId })));
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
    if (index === -1) {
      console.log('[scholarService.update] Scholar not found:', id);
      return null;
    }
    console.log('[scholarService.update] Updating scholar:', id, 'with updates:', updates, 'old providerId:', scholars[index].providerId);
    scholars[index] = { ...scholars[index], ...updates, updatedAt: new Date().toISOString() };
    console.log('[scholarService.update] New providerId:', scholars[index].providerId);
    localStorage.setItem(STORAGE_KEYS.SCHOLARS, JSON.stringify(scholars));
    console.log('[scholarService.update] Saved to localStorage');
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

// Note: initializeMockData() is called automatically by service methods
// No top-level execution needed to avoid module parsing issues

// Explicit export to ensure module recognition
export {};


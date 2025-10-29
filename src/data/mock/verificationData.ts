// Verification data interfaces for all roles
export interface BaseVerificationData {
  id: string;
  userId: string;
  role: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor';
  verificationLevel: 0 | 1 | 2;
  status: 'pending' | 'approved' | 'rejected' | 'incomplete';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface StudentVerificationData extends BaseVerificationData {
  role: 'student';
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    nationality: string;
  };
  idProof: {
    type: 'passport' | 'aadhar' | 'student_id' | 'driving_license';
    number: string;
    documentUrl?: string;
    expiryDate?: string;
  };
  educationInfo: {
    institution: string;
    course: string;
    year: string;
    studentId: string;
    transcriptUrl?: string;
  };
  profilePicture?: string;
  additionalDocuments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface MentorVerificationData extends BaseVerificationData {
  role: 'mentor';
  // Mandatory Fields
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    email: string;
    phoneNumber: string;
    nationality: string;
  };
  professionalCredentials: {
    degree: string;
    institution: string;
    graduationYear: string;
    certifications: Array<{
      name: string;
      issuer: string;
      issueDate: string;
      documentUrl?: string;
    }>;
  };
  experienceProof: {
    workCertificate?: string;
    linkedinUrl?: string;
    experienceYears: number;
    currentPosition?: string;
    company?: string;
    specialization: string[];
  };
  idProof: {
    type: 'passport' | 'aadhar' | 'driving_license';
    number: string;
    documentUrl?: string;
  };
  profilePicture?: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
    documentUrl?: string;
  };
  // Optional Fields
  socialProfiles?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  // Admin Action
  adminVerification?: {
    verifiedBy?: string;
    verificationDate?: string;
    videoCallCompleted?: boolean;
    adminNotes?: string;
  };
  verifiedBadge?: boolean; // "Verified Mentor" badge
}

export interface EmployerVerificationData extends BaseVerificationData {
  role: 'employer';
  companyInfo: {
    companyName: string;
    registrationNumber: string;
    gstNumber?: string;
    panNumber?: string;
    industry: string;
    companySize: string;
    website?: string;
  };
  contactInfo: {
    contactPerson: string;
    designation: string;
    email: string;
    phone: string;
    address: string;
  };
  businessDocuments: {
    registrationCertificate?: string;
    gstCertificate?: string;
    panCard?: string;
    companyProfile?: string;
  };
  verificationStatus: {
    businessRegistration: boolean;
    gstVerification: boolean;
    panVerification: boolean;
  };
}

export interface InvestorVerificationData extends BaseVerificationData {
  role: 'investor';
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
  };
  investmentInfo: {
    investmentRange: string;
    preferredSectors: string[];
    investmentExperience: number;
    portfolioSize: string;
  };
  kycDocuments: {
    panCard?: string;
    passport?: string;
    addressProof?: string;
    bankStatement?: string;
  };
  financialInfo: {
    annualIncome: string;
    netWorth: string;
    sourceOfFunds: string;
  };
  idProof: {
    type: 'passport' | 'aadhar' | 'pan';
    number: string;
    documentUrl?: string;
  };
}

export interface SponsorVerificationData extends BaseVerificationData {
  role: 'sponsor';
  organizationInfo: {
    organizationName: string;
    organizationType: 'corporate' | 'ngo' | 'government' | 'individual';
    registrationNumber?: string;
    website?: string;
  };
  contactInfo: {
    contactPerson: string;
    designation: string;
    email: string;
    phone: string;
    address: string;
  };
  sponsorshipInfo: {
    sponsorshipType: 'scholarship' | 'hackathon' | 'event' | 'general';
    budgetRange: string;
    targetAudience: string[];
    preferredDuration: string;
  };
  documents: {
    organizationRegistration?: string;
    taxExemptionCertificate?: string;
    sponsorshipLetter?: string;
  };
}

export type VerificationData = 
  | StudentVerificationData 
  | MentorVerificationData 
  | EmployerVerificationData 
  | InvestorVerificationData 
  | SponsorVerificationData;

// Verification requirements for each role
export const verificationRequirements = {
  student: {
    level0: ['Basic registration'],
    level1: ['ID proof', 'Education info', 'Profile picture'],
    level2: ['Additional documents', 'Transcript verification']
  },
  mentor: {
    level0: ['Basic registration'],
    level1: ['ID proof', 'Professional info', 'Education info'],
    level2: ['Bank details', 'Portfolio verification', 'Background check']
  },
  employer: {
    level0: ['Basic registration'],
    level1: ['Company registration', 'Contact info', 'Business documents'],
    level2: ['GST verification', 'PAN verification', 'Company profile']
  },
  investor: {
    level0: ['Basic registration'],
    level1: ['KYC documents', 'Investment info', 'Financial info'],
    level2: ['Background verification', 'Financial verification', 'Compliance check']
  },
  sponsor: {
    level0: ['Basic registration'],
    level1: ['Organization info', 'Contact info', 'Sponsorship details'],
    level2: ['Document verification', 'Budget verification', 'Approval process']
  }
};

// Mock verification data
export const mockVerificationData: Record<string, Partial<VerificationData>> = {
  student: {
    id: 'ver_001',
    userId: 'user_001',
    role: 'student',
    verificationLevel: 1,
    status: 'pending',
    personalInfo: {
      fullName: 'John Doe',
      dateOfBirth: '2000-01-15',
      gender: 'male',
      nationality: 'Indian'
    },
    idProof: {
      type: 'aadhar',
      number: '1234-5678-9012'
    },
    educationInfo: {
      institution: 'Delhi University',
      course: 'Computer Science',
      year: '2023',
      studentId: 'DU2023001'
    }
  },
  mentor: {
    id: 'ver_002',
    userId: 'user_002',
    role: 'mentor',
    verificationLevel: 2,
    status: 'approved',
    personalInfo: {
      fullName: 'Sarah Chen',
      dateOfBirth: '1985-05-20',
      nationality: 'American'
    },
    professionalInfo: {
      currentPosition: 'Senior Software Engineer',
      company: 'Google',
      experience: 8,
      specialization: ['React', 'Node.js', 'AWS'],
      linkedinUrl: 'https://linkedin.com/in/sarahchen'
    },
    educationInfo: {
      degree: 'MS Computer Science',
      institution: 'Stanford University',
      graduationYear: '2010',
      certifications: ['AWS Certified', 'Google Cloud Professional']
    }
  }
};


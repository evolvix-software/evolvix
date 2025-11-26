export interface CompanyProfile {
  companyName: string;
  companySlug: string;
  industry: string;
  companySize: string;
  headquarters: string;
  website: string;
  description: string;
  logo?: string;
  banner?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'viewer';
  status: 'active' | 'pending';
  permissions: Permission[];
  lastActive?: string;
  invitedAt?: string;
}

export type Permission = 
  | 'post_jobs'
  | 'manage_jobs'
  | 'view_applicants'
  | 'manage_applicants'
  | 'manage_career_page'
  | 'view_analytics'
  | 'manage_team'
  | 'manage_billing'
  | 'manage_settings';

export interface JobPostingSettings {
  defaultEmploymentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  defaultLocation: string;
  defaultRemoteType: 'remote' | 'hybrid' | 'onsite';
  autoPublish: boolean;
  requireApproval: boolean;
  enableEasyApply: boolean;
  requireCoverLetter: boolean;
  requirePortfolio: boolean;
  customQuestions: Array<{
    id: string;
    question: string;
    type: 'text' | 'textarea' | 'multiple-choice';
    required: boolean;
    options?: string[];
  }>;
  autoRejectRules: Array<{
    id: string;
    condition: string;
    action: string;
  }>;
  autoShortlistRules: Array<{
    id: string;
    condition: string;
    action: string;
  }>;
}

export interface NotificationPreferences {
  email: {
    newApplications: boolean;
    applicationStatusChanges: boolean;
    jobExpiringSoon: boolean;
    newMessages: boolean;
    teamActivity: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
  inApp: {
    realTime: boolean;
    notificationCenter: boolean;
    pushNotifications: boolean;
    soundNotifications: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly' | 'never';
}

export interface Integration {
  id: string;
  name: string;
  type: 'ats' | 'calendar' | 'email' | 'slack' | 'zapier' | 'webhook';
  connected: boolean;
  lastSync?: string;
  config?: Record<string, any>;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'annual';
  features: string[];
  jobPostingCredits: number;
  usage: {
    jobsPosted: number;
    applicationsReceived: number;
    teamMembers: number;
  };
  limits: {
    maxJobs: number;
    maxTeamMembers: number;
    maxApplications: number;
  };
  renewalDate?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActivity: string;
  isCurrent: boolean;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: Permission[];
}

export type SettingsTab = 
  | 'profile' 
  | 'team' 
  | 'jobs' 
  | 'notifications' 
  | 'integrations' 
  | 'billing' 
  | 'security' 
  | 'privacy';


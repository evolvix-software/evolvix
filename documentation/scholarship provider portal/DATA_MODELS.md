# 📊 Scholarship Provider Portal - Data Models

## Database Schema Overview

### Core Entities

1. **Provider/Organization**
2. **Scholarship Campaigns**
3. **Applications**
4. **Scholars**
5. **Enrollments**
6. **Progress Records**
7. **Job Placements**
8. **Fund Transfers & Disbursements**
9. **Mentors**
10. **Communications**

---

## 1. Provider/Organization Model

```typescript
interface Provider {
  id: string;                    // UUID
  userId: string;                // Reference to User table
  organizationName: string;
  organizationSlug: string;       // URL-friendly identifier
  logo: string;                  // Logo URL
  banner: string;                // Banner image URL
  
  // Contact Information
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  
  // Financial
  balance: number;               // Current balance
  totalPledged: number;          // Total pledged amount
  totalTransferred: number;      // Total transferred to Evolvix
  totalDisbursed: number;        // Total disbursed to scholars
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  
  // Settings
  settings: ProviderSettings;
  
  // Compliance
  taxId?: string;
  registrationNumber?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'credit_card' | 'paypal' | 'other';
  details: Record<string, any>;  // Masked for security
  isDefault: boolean;
  last4?: string;                // Last 4 digits for display
}

interface ProviderSettings {
  defaultCampaignSettings?: CampaignDefaults;
  notificationPreferences: NotificationPreferences;
  verificationRules: VerificationRules;
  disbursementPolicy: DisbursementPolicy;
  consentSettings: ConsentSettings;
}
```

---

## 2. Scholarship Campaign Model

```typescript
interface Campaign {
  id: string;                     // UUID
  providerId: string;             // Reference to Provider
  campaignSlug: string;           // URL-friendly identifier
  
  // Campaign Details
  title: string;
  description: string;            // HTML description
  campaignType: 'course-specific' | 'pooled' | 'general';
  
  // Linked Courses
  linkedCourseIds: string[];     // Course IDs
  
  // Scholarship Details
  totalSlots: number;              // Total scholarship slots
  slotsAvailable: number;          // Remaining slots
  slotsAwarded: number;            // Awarded slots
  slotsReserved: number;           // Reserved slots
  
  // Funding
  requiredAmount: number;          // Total amount needed
  fundedAmount: number;            // Amount funded so far
  reservedFunds: number;           // Reserved funds
  fundingModel: 'per-student' | 'pooled' | 'variable';
  awardType: 'full' | 'partial';
  partialAmount?: number;          // If partial, fixed amount
  
  // Eligibility Rules
  eligibilityRules: EligibilityRules;
  
  // Application Window
  applicationOpenDate: Date;
  applicationCloseDate: Date;
  isOpen: boolean;
  
  // Status
  status: 'draft' | 'open' | 'closed' | 'completed' | 'cancelled';
  
  // Selection Criteria
  selectionCriteria: SelectionCriteria;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

interface EligibilityRules {
  minCGPA?: number;               // Minimum CGPA requirement
  maxCGPA?: number;               // Maximum CGPA (if applicable)
  financialNeedRequired: boolean;
  meritBased: boolean;
  needBased: boolean;
  specificCourses?: string[];     // Course IDs
  specificPrograms?: string[];     // Program names
  geographicRestrictions?: string[]; // Locations
  ageRange?: {
    min: number;
    max: number;
  };
  otherCriteria?: string;         // Free text
}

interface SelectionCriteria {
  academicWeight: number;          // 0-100
  financialNeedWeight: number;     // 0-100
  motivationWeight: number;        // 0-100
  interviewRequired: boolean;
  mentorRecommendationRequired: boolean;
  autoAwardThreshold?: number;    // Auto-award if score >= threshold
}
```

---

## 3. Application Model

```typescript
interface Application {
  id: string;                     // UUID
  studentId: string;              // Reference to Student
  courseId: string;                // Reference to Course
  campaignId: string;              // Reference to Campaign
  providerId: string;              // Reference to Provider
  
  // Application Status
  status: 'submitted' | 'under_verification' | 'review_pending' | 'shortlisted' | 'awarded' | 'rejected' | 'withdrawn';
  
  // Submission
  submittedAt: Date;
  
  // Student Information (Snapshot)
  studentSnapshot: {
    name: string;
    email: string;
    phone?: string;
    cgpa: number;
    currentInstitution?: string;
    graduationYear?: number;
  };
  
  // Documents
  documents: ApplicationDocument[];
  
  // Application Data
  cgpa: number;                    // Extracted CGPA
  familyIncome?: number;           // Extracted income
  financialNeedScore?: number;     // Calculated need score
  scholarshipJustification: string; // Essay/justification
  
  // Verification
  verificationStatus: VerificationStatus;
  verificationLogs: VerificationLog[];
  
  // Review & Scoring
  reviewerScores: ReviewerScore[];
  totalScore?: number;             // Weighted total score
  ranking?: number;                 // Rank among applicants
  
  // Decision
  decision?: {
    decision: 'awarded' | 'rejected';
    decidedBy: string;              // User ID
    decidedAt: Date;
    notes?: string;
  };
  
  // Flags
  flags: ApplicationFlag[];
  priority: 'low' | 'medium' | 'high';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface ApplicationDocument {
  id: string;
  type: 'transcript' | 'id_proof' | 'income_proof' | 'resume' | 'recommendation' | 'other';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
}

interface VerificationStatus {
  documentsVerified: boolean;
  cgpaVerified: boolean;
  incomeVerified: boolean;
  backgroundCheckCompleted: boolean;
  overallStatus: 'pending' | 'in-progress' | 'completed' | 'needs-info';
}

interface VerificationLog {
  id: string;
  verifierId: string;
  verifierName: string;
  action: 'verified' | 'rejected' | 'requested_info' | 'flagged';
  documentType?: string;
  notes?: string;
  createdAt: Date;
}

interface ReviewerScore {
  id: string;
  reviewerId: string;
  reviewerName: string;
  academicScore: number;           // 0-100
  financialNeedScore: number;      // 0-100
  motivationScore: number;         // 0-100
  overallScore: number;            // Weighted score
  notes?: string;
  reviewedAt: Date;
}

interface ApplicationFlag {
  type: 'missing_document' | 'discrepancy' | 'high_priority' | 'needs_interview' | 'background_check';
  flaggedBy: string;
  flaggedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
  notes?: string;
}
```

---

## 4. Scholar Model

```typescript
interface Scholar {
  id: string;                     // UUID
  studentId: string;              // Reference to Student (same as Application.studentId)
  providerId: string;             // Reference to Provider
  campaignId: string;             // Reference to Campaign
  applicationId: string;          // Reference to Application
  
  // Award Information
  awardAmount: number;
  awardType: 'full' | 'partial';
  awardDate: Date;
  awardStatus: 'active' | 'completed' | 'paused' | 'revoked';
  
  // Scholar Profile Snapshot
  profile: {
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  
  // Academic Baseline & Growth
  baselineCGPA: number;            // CGPA at time of award
  currentCGPA?: number;           // Current CGPA (updated)
  cgpaImprovement?: number;       // Current - Baseline
  cgpaImprovementPercentage?: number; // Percentage improvement
  graduationStatus: 'not-graduated' | 'graduated' | 'dropped-out';
  graduationDate?: Date;
  graduationCGPA?: number;
  graduationCGPAImprovement?: number; // Graduation - Baseline
  // Grade History
  gradeHistory: GradeRecord[];   // Historical grade records
  // Academic Milestones
  academicMilestones: AcademicMilestone[];
  
  // Job Placement
  jobPlacement?: JobPlacement;
  
  // Course Enrollment
  enrollments: Enrollment[];
  
  // Progress Tracking
  progressRecords: ProgressRecord[];
  
  // Engagement Metrics
  engagement: EngagementMetrics;
  
  // Risk Assessment
  riskFlags: RiskFlag[];
  riskScore?: number;             // 0-100, higher = more risk
  
  // Financial
  disbursementStatus: DisbursementStatus;
  disbursementRecords: DisbursementRecord[];
  
  // Notes & Communication
  notes: ScholarNote[];
  lastContactAt?: Date;
  
  // Achievements
  achievements: Achievement[];
  
  // Success Story
  successStory?: SuccessStory;
  
  // Growth Timeline
  growthTimeline: TimelineEvent[];
  
  // Encouragement & Recognition
  encouragementHistory: EncouragementRecord[];
  publicRecognition: PublicRecognition[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface JobPlacement {
  id: string;
  scholarId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  location?: string;
  salary?: {
    amount: number;
    currency: string;
    period: 'monthly' | 'yearly';
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  startDate: Date;
  status: 'searching' | 'interviewing' | 'offered' | 'accepted' | 'started' | 'completed';
  source: 'course-placement' | 'self-applied' | 'referral' | 'other';
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;              // Provider who verified
  linkedinUrl?: string;
  offerLetterUrl?: string;         // Uploaded offer letter
  // Job Application Timeline
  applicationDate?: Date;
  interviewDates?: Date[];
  offerDate?: Date;
  acceptanceDate?: Date;
  // Success Tracking
  celebrated: boolean;              // Achievement celebrated
  celebratedAt?: Date;
  addedToSuccessStory: boolean;    // Added to success stories
  sharedPublicly: boolean;         // Shared publicly (with consent)
  consentForSharing: boolean;       // Scholar consent for public sharing
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Enrollment {
  id: string;
  scholarId: string;
  courseId: string;
  campaignId: string;
  enrollmentDate: Date;
  completionDate?: Date;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  completionPercentage: number;   // 0-100
  finalGrade?: string;
  certificateIssued: boolean;
  certificateIssuedAt?: Date;
}

interface ProgressRecord {
  id: string;
  scholarId: string;
  courseId: string;
  date: Date;
  metricType: 'grade' | 'assignment' | 'attendance' | 'video_watch' | 'module_completion' | 'cgpa';
  value: number;
  maxValue?: number;
  percentage?: number;
  notes?: string;
  recordedBy?: string;             // System or mentor ID
}

interface EngagementMetrics {
  totalLogins: number;
  lastLoginAt?: Date;
  videoWatchPercentage: number;   // Average across courses
  assignmentSubmissionRate: number; // 0-100
  liveSessionAttendanceRate: number; // 0-100
  mentorSessionCount: number;
  lastMentorSessionAt?: Date;
  forumActivityCount: number;
  averageTimeSpent: number;        // Minutes per week
}

interface RiskFlag {
  type: 'low_grades' | 'missed_milestones' | 'inactivity' | 'low_engagement' | 'financial_concern' | 'personal_issue';
  severity: 'low' | 'medium' | 'high';
  flaggedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
  notes?: string;
  actionTaken?: string;
}

interface DisbursementStatus {
  totalAwarded: number;
  totalDisbursed: number;
  pendingDisbursement: number;
  nextDisbursementDate?: Date;
  disbursementSchedule: DisbursementSchedule[];
}

interface DisbursementSchedule {
  id: string;
  amount: number;
  scheduledDate: Date;
  status: 'pending' | 'scheduled' | 'disbursed' | 'cancelled';
  disbursedAt?: Date;
  milestone?: string;              // Milestone that triggers disbursement
}

interface DisbursementRecord {
  id: string;
  enrollmentId: string;
  scholarId: string;
  amount: number;
  disbursementDate: Date;
  status: 'scheduled' | 'disbursed' | 'cancelled' | 'refunded';
  transferId?: string;             // Reference to Evolvix transfer
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
}

interface ScholarNote {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  isPrivate: boolean;
  tags: string[];
  createdAt: Date;
}

interface Achievement {
  id: string;
  type: 'course_completion' | 'job_placement' | 'high_gpa' | 'top_performer' | 'milestone' | 'certification' | 'graduation' | 'most_improved' | 'fastest_graduate' | 'best_placement';
  title: string;
  description: string;
  icon?: string;
  badgeUrl?: string;
  earnedAt: Date;
  courseId?: string;
  // Encouragement Features
  isPublic: boolean;                 // Can be shared publicly
  consentGiven: boolean;            // Scholar consent for sharing
  sharedOnSocial: boolean;          // Shared on social media
  featured: boolean;                // Featured in success stories
}
```

---

## 5. Fund Transfer Model

```typescript
interface Transfer {
  id: string;                     // UUID
  providerId: string;             // Reference to Provider
  campaignId?: string;           // Optional: if campaign-specific
  
  // Transfer Details
  amount: number;
  currency: string;              // Default: INR
  transferMethod: 'bank_transfer' | 'upi' | 'credit_card' | 'paypal' | 'other';
  
  // Status
  status: 'initiated' | 'in-transit' | 'confirmed' | 'failed' | 'cancelled';
  
  // Transfer Information
  fromAccount?: string;          // Masked account details
  toAccount: string;             // Evolvix account
  transactionReference?: string;
  proofFileUrl?: string;         // Uploaded proof document
  
  // Confirmation
  confirmedBy?: string;          // Evolvix admin ID
  confirmedAt?: Date;
  confirmationNotes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface Disbursement {
  id: string;                     // UUID
  transferId: string;             // Reference to Transfer
  enrollmentId: string;           // Reference to Enrollment
  scholarId: string;              // Reference to Scholar
  
  // Disbursement Details
  amount: number;
  disbursementDate: Date;
  status: 'scheduled' | 'disbursed' | 'cancelled' | 'refunded';
  
  // Recipient
  recipientType: 'course' | 'mentor' | 'student_waiver';
  recipientId: string;           // Course ID, Mentor ID, or Student ID
  
  // Tracking
  receiptUrl?: string;
  notes?: string;
  
  // Timestamps
  createdAt: Date;
  disbursedAt?: Date;
}
```

---

## 6. Mentor Model

```typescript
interface Mentor {
  id: string;                     // UUID
  providerId: string;             // Reference to Provider
  
  // Personal Information
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  
  // Employment
  salaryInfo: {
    monthlySalary: number;
    currency: string;
    paymentFrequency: 'monthly' | 'bi-weekly';
  };
  
  // Assignments
  assignedCourses: string[];      // Course IDs
  assignedScholars: string[];     // Scholar IDs
  
  // Performance
  performanceRating?: number;      // 0-5
  totalSessions: number;
  activeSessions: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface MentorSession {
  id: string;
  mentorId: string;
  scholarId: string;
  courseId?: string;
  
  // Session Details
  sessionDate: Date;
  duration: number;               // Minutes
  sessionType: 'one-on-one' | 'group' | 'workshop' | 'review';
  topics: string[];
  
  // Outcomes
  notes: string;
  actionItems: string[];
  scholarFeedback?: string;
  mentorRating?: number;          // Scholar's rating of mentor
  
  // Timestamps
  createdAt: Date;
}
```

---

## 7. Communication Model

```typescript
interface Conversation {
  id: string;                     // UUID
  providerId: string;
  participantId: string;          // Scholar ID or Mentor ID
  participantType: 'scholar' | 'mentor';
  
  // Context
  campaignId?: string;
  courseId?: string;
  
  // Metadata
  subject?: string;
  lastMessageAt: Date;
  unreadCount: number;
  isArchived: boolean;
  isStarred: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;                     // UUID
  conversationId: string;
  senderId: string;               // Provider or Scholar/Mentor ID
  senderType: 'provider' | 'scholar' | 'mentor';
  
  // Content
  content: string;                // HTML content
  attachments: Attachment[];
  
  // Status
  isRead: boolean;
  readAt?: Date;
  isEdited: boolean;
  editedAt?: Date;
  
  // Template
  templateId?: string;             // If sent from template
  
  // Timestamps
  createdAt: Date;
}

interface Announcement {
  id: string;                     // UUID
  providerId: string;
  campaignId?: string;            // If campaign-specific
  
  // Content
  title: string;
  content: string;                // HTML content
  priority: 'low' | 'medium' | 'high';
  
  // Recipients
  recipientType: 'all' | 'campaign' | 'scholars' | 'mentors' | 'custom';
  recipientIds?: string[];        // If custom
  
  // Delivery
  deliveryMethod: 'in-app' | 'email' | 'both';
  sentAt?: Date;
  scheduledFor?: Date;
  
  // Status
  status: 'draft' | 'scheduled' | 'sent';
  
  // Analytics
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 8. Success Story & Encouragement Models

```typescript
interface SuccessStory {
  id: string;
  scholarId: string;
  providerId: string;
  campaignId: string;
  
  // Story Content
  title: string;
  summary: string;                 // Short summary
  fullStory: string;               // Full narrative
  beforeMetrics: BeforeAfterMetrics;
  afterMetrics: BeforeAfterMetrics;
  
  // Visual Content
  scholarPhoto?: string;            // With consent
  beforePhoto?: string;
  afterPhoto?: string;
  videoUrl?: string;               // Video testimonial
  
  // Testimonial
  testimonial?: {
    quote: string;
    author: string;
    date: Date;
  };
  
  // Key Achievements
  keyAchievements: string[];
  milestones: string[];
  
  // Impact Statement
  impactStatement: string;
  
  // Sharing & Visibility
  isPublic: boolean;
  consentGiven: boolean;
  featured: boolean;
  featuredAt?: Date;
  sharedOnSocial: boolean;
  shareCount: number;
  
  // SEO & Discovery
  tags: string[];
  category: 'job_placement' | 'graduation' | 'academic_excellence' | 'transformation' | 'overall_success';
  
  // Timestamps
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

interface BeforeAfterMetrics {
  cgpa?: number;
  jobStatus?: string;
  graduationStatus?: string;
  skills?: string[];
  confidence?: number;              // 0-100
  financialStatus?: string;
  description: string;              // Text description
}

interface TimelineEvent {
  id: string;
  scholarId: string;
  eventType: 'award' | 'enrollment' | 'milestone' | 'assignment' | 'grade_update' | 'job_placement' | 'graduation' | 'achievement';
  title: string;
  description: string;
  date: Date;
  icon?: string;
  badge?: string;
  metadata?: Record<string, any>;
}

interface GradeRecord {
  id: string;
  scholarId: string;
  courseId: string;
  date: Date;
  grade: number;                    // CGPA or percentage
  gradeType: 'assignment' | 'midterm' | 'final' | 'overall' | 'cgpa';
  maxGrade?: number;
  assignmentName?: string;
  notes?: string;
  recordedBy?: string;
}

interface AcademicMilestone {
  id: string;
  scholarId: string;
  milestoneType: 'first_assignment' | 'mid_course' | 'course_completion' | 'high_grade' | 'cgpa_improvement' | 'graduation';
  title: string;
  description: string;
  achievedAt: Date;
  cgpaAtMilestone?: number;
  celebrated: boolean;
}

interface EncouragementRecord {
  id: string;
  scholarId: string;
  type: 'message' | 'badge' | 'announcement' | 'recognition' | 'bonus' | 'celebration';
  title: string;
  message: string;
  sentBy: string;                  // Provider ID
  sentAt: Date;
  isPublic: boolean;
  responseReceived: boolean;
  scholarResponse?: string;
}

interface PublicRecognition {
  id: string;
  scholarId: string;
  recognitionType: 'leaderboard' | 'success_story' | 'testimonial' | 'featured' | 'award';
  title: string;
  description: string;
  visibility: 'public' | 'provider_only' | 'scholars_only';
  consentGiven: boolean;
  featuredAt: Date;
  expiresAt?: Date;
  viewCount: number;
  shareCount: number;
}

interface LeaderboardEntry {
  id: string;
  scholarId: string;
  leaderboardType: 'highest_cgpa' | 'most_improved' | 'fastest_graduate' | 'best_placement' | 'most_engaged' | 'top_performer';
  rank: number;
  metric: number;                  // The value being ranked
  period: 'all_time' | 'monthly' | 'quarterly' | 'yearly';
  periodStart: Date;
  periodEnd: Date;
  badge?: string;
  isPublic: boolean;
  consentGiven: boolean;
  updatedAt: Date;
}
```

---

## 9. Analytics & Reporting Model

```typescript
interface ScholarGrowthMetrics {
  scholarId: string;
  providerId: string;
  campaignId: string;
  
  // Academic Growth
  baselineCGPA: number;
  currentCGPA: number;
  cgpaImprovement: number;
  cgpaImprovementPercentage: number;
  graduationStatus: string;
  graduationCGPA?: number;
  graduationCGPAImprovement?: number;
  gradeTrend: 'improving' | 'stable' | 'declining';
  
  // Course Progress
  courseCompletionRate: number;   // 0-100
  averageGrade: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  assignmentsPassRate: number;    // 0-100
  modulesCompleted: number;
  modulesTotal: number;
  
  // Engagement
  videoWatchPercentage: number;
  sessionAttendanceRate: number;
  mentorSessionCount: number;
  forumActivityCount: number;
  totalLogins: number;
  averageTimeSpentPerWeek: number; // Minutes
  engagementScore: number;         // 0-100
  
  // Job Placement
  jobPlaced: boolean;
  jobTitle?: string;
  companyName?: string;
  placementDate?: Date;
  timeToPlacement?: number;       // Days from course start
  salary?: number;
  salaryImprovement?: number;     // Salary vs baseline expectation
  jobVerified: boolean;
  
  // Graduation
  graduated: boolean;
  graduationDate?: Date;
  timeToGraduation?: number;      // Days from course start
  certificateIssued: boolean;
  
  // Achievements
  achievementsCount: number;
  certificationsEarned: number;
  topPerformerRank?: number;      // Rank in cohort
  improvementRank?: number;        // Rank by improvement
  
  // Success Indicators
  isTopPerformer: boolean;
  isMostImproved: boolean;
  isFastestGraduate: boolean;
  hasBestPlacement: boolean;
  
  // Period
  periodStart: Date;
  periodEnd: Date;
  lastUpdated: Date;
}

interface CampaignImpactMetrics {
  campaignId: string;
  providerId: string;
  
  // Financial
  totalInvested: number;
  totalDisbursed: number;
  averageAwardAmount: number;
  
  // Scholars
  totalScholars: number;
  activeScholars: number;
  graduatedScholars: number;
  droppedOutScholars: number;
  
  // Academic Outcomes
  averageCGPAImprovement: number;
  averageCGPAImprovementPercentage: number;
  graduationRate: number;
  courseCompletionRate: number;
  averageGraduationCGPA: number;
  topPerformersCount: number;
  mostImprovedCount: number;
  
  // Job Placement
  jobPlacementRate: number;
  averageSalary?: number;
  averageTimeToPlacement: number;  // Days
  topCompanies: string[];          // Top hiring companies
  topJobRoles: string[];           // Most common job roles
  
  // Engagement
  averageEngagementScore: number;
  
  // Success Stories
  successStoriesCount: number;
  featuredStoriesCount: number;
  
  // ROI Metrics
  costPerGraduate: number;
  costPerJobPlacement: number;
  overallROI: number;             // Calculated metric
  socialImpactScore: number;      // 0-100
  
  // Period
  periodStart: Date;
  periodEnd: Date;
  lastUpdated: Date;
}
```

---

## Relationships

### ER Diagram Overview

```
Provider (1) ──< (Many) Campaigns
Provider (1) ──< (Many) Transfers
Provider (1) ──< (Many) Scholars

Campaign (1) ──< (Many) Applications
Campaign (1) ──< (Many) Scholars

Application (Many) ──< (1) Student
Application (Many) ──< (1) Campaign
Application (Many) ──< (1) Course

Scholar (1) ──< (1) Application
Scholar (1) ──< (Many) Enrollments
Scholar (1) ──< (Many) ProgressRecords
Scholar (1) ──< (1) JobPlacement
Scholar (1) ──< (Many) DisbursementRecords

Transfer (1) ──< (Many) Disbursements
Enrollment (1) ──< (Many) DisbursementRecords
```

---

## Indexes

### Recommended Database Indexes

```sql
-- Providers
CREATE INDEX idx_provider_user_id ON providers(user_id);
CREATE INDEX idx_provider_slug ON providers(organization_slug);

-- Campaigns
CREATE INDEX idx_campaign_provider ON campaigns(provider_id);
CREATE INDEX idx_campaign_status ON campaigns(status);
CREATE INDEX idx_campaign_dates ON campaigns(application_open_date, application_close_date);

-- Applications
CREATE INDEX idx_application_campaign ON applications(campaign_id);
CREATE INDEX idx_application_student ON applications(student_id);
CREATE INDEX idx_application_status ON applications(status);
CREATE INDEX idx_application_score ON applications(total_score DESC);

-- Scholars
CREATE INDEX idx_scholar_provider ON scholars(provider_id);
CREATE INDEX idx_scholar_campaign ON scholars(campaign_id);
CREATE INDEX idx_scholar_status ON scholars(award_status);
CREATE INDEX idx_scholar_risk ON scholars(risk_score);

-- Transfers
CREATE INDEX idx_transfer_provider ON transfers(provider_id);
CREATE INDEX idx_transfer_status ON transfers(status);
CREATE INDEX idx_transfer_date ON transfers(created_at);

-- Progress Records
CREATE INDEX idx_progress_scholar ON progress_records(scholar_id);
CREATE INDEX idx_progress_date ON progress_records(date);
CREATE INDEX idx_progress_course ON progress_records(course_id);
```

---

## Data Validation Rules

### Campaign
- Title: 5-200 characters
- Total slots: Minimum 1
- Required amount: Must be positive
- Application dates: Close date must be after open date

### Application
- CGPA: 0-10 (or 0-4 for GPA systems)
- Documents: Required based on eligibility rules
- Justification: Minimum 100 characters

### Scholar
- Award amount: Must be positive
- Baseline CGPA: Required at award time
- Job placement: Must be verified before marking as placed

### Transfer
- Amount: Must be positive
- Status transitions: Only valid transitions allowed
- Proof: Required for initiated transfers


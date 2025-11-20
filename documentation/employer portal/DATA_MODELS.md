# 📊 Employer Portal - Data Models

## Database Schema Overview

### Core Entities

1. **Employer/Company**
2. **Job Postings**
3. **Applications**
4. **Candidates/Applicants**
5. **Messages**
6. **Career Page**
7. **Team Members**
8. **Analytics**

---

## 1. Employer/Company Model

```typescript
interface Employer {
  id: string;                    // UUID
  userId: string;                // Reference to User table
  companyName: string;
  companySlug: string;           // URL-friendly identifier
  logo: string;                  // Logo URL
  banner: string;                // Banner image URL
  industry: string;
  companySize: string;           // "1-10", "11-50", "51-200", etc.
  headquarters: string;          // City, Country
  website: string;
  description: string;            // Company description
  foundedYear: number;
  linkedinUrl?: string;
  twitterUrl?: string;
  
  // Career Page Settings
  careerPageEnabled: boolean;
  careerPageTheme: string;        // Theme color scheme
  careerPageCustomDomain?: string;
  
  // Subscription
  subscriptionPlan: string;       // "free", "basic", "premium"
  subscriptionStatus: string;     // "active", "cancelled", "expired"
  subscriptionExpiresAt?: Date;
  jobPostingCredits: number;
  
  // Settings
  settings: EmployerSettings;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface EmployerSettings {
  defaultJobTemplate?: string;
  autoPublishJobs: boolean;
  requireApproval: boolean;
  notificationPreferences: NotificationPreferences;
  applicationSettings: ApplicationSettings;
  branding: BrandingSettings;
}

interface ApplicationSettings {
  enableEasyApply: boolean;
  requireCoverLetter: boolean;
  requirePortfolio: boolean;
  customQuestions: CustomQuestion[];
  screeningRules: ScreeningRule[];
}

interface CustomQuestion {
  id: string;
  type: "text" | "textarea" | "multiple-choice" | "file-upload";
  question: string;
  required: boolean;
  options?: string[];            // For multiple-choice
  maxLength?: number;            // For text/textarea
  allowedFileTypes?: string[];   // For file-upload
}

interface ScreeningRule {
  id: string;
  condition: string;             // "years_experience >= 2"
  action: "auto-reject" | "auto-shortlist" | "flag";
}
```

---

## 2. Job Posting Model

```typescript
interface JobPosting {
  id: string;                     // UUID
  employerId: string;            // Reference to Employer
  jobTitle: string;
  jobSlug: string;                // URL-friendly identifier
  
  // Job Details
  description: string;            // Full job description (HTML)
  responsibilities: string[];     // Array of responsibilities
  requirements: string[];         // Array of requirements
  skills: string[];               // Required skills
  
  // Job Metadata
  employmentType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  seniorityLevel: "entry" | "mid" | "senior" | "executive";
  location: string;               // City, State, Country
  remoteType: "remote" | "hybrid" | "onsite";
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: "hourly" | "monthly" | "yearly";
  };
  
  // Application Settings
  applicationMethod: "easy-apply" | "external-link" | "email";
  externalApplicationUrl?: string;
  applicationEmail?: string;
  
  // Hiring Details
  hiringManagerName: string;
  hiringManagerEmail: string;
  assignedRecruiterId?: string;   // Reference to TeamMember
  
  // Status & Visibility
  status: "draft" | "active" | "paused" | "closed" | "expired";
  publishedAt?: Date;
  expiresAt?: Date;
  autoExpire: boolean;
  
  // Promotion
  isPromoted: boolean;
  promotedUntil?: Date;
  
  // Analytics
  views: number;
  applications: number;
  saves: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface JobTemplate {
  id: string;
  employerId: string;
  name: string;
  category: string;              // "software-engineer", "designer", etc.
  jobTitle: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  employmentType: string;
  seniorityLevel: string;
  createdAt: Date;
}
```

---

## 3. Application Model

```typescript
interface Application {
  id: string;                     // UUID
  jobId: string;                  // Reference to JobPosting
  candidateId: string;            // Reference to Candidate/Student
  employerId: string;             // Reference to Employer
  
  // Application Status
  status: "new" | "reviewed" | "shortlisted" | "interviewed" | "offered" | "hired" | "rejected";
  stage: string;                  // Pipeline stage name
  stageOrder: number;             // Order in pipeline
  
  // Application Documents
  resumeId: string;               // Reference to File
  coverLetterId?: string;          // Reference to File
  portfolioUrl?: string;
  
  // Screening Answers
  screeningAnswers: ScreeningAnswer[];
  
  // Custom Questions Answers
  customAnswers: CustomAnswer[];
  
  // Matching Score
  matchScore?: number;            // 0-100 AI matching score
  skillsMatch: string[];           // Matching skills
  missingSkills: string[];         // Missing skills
  
  // Recruiter Assignment
  assignedRecruiterId?: string;
  assignedAt?: Date;
  
  // Notes & Comments
  internalNotes: Note[];
  
  // Activity Timeline
  activities: Activity[];
  
  // Timestamps
  appliedAt: Date;
  reviewedAt?: Date;
  shortlistedAt?: Date;
  interviewedAt?: Date;
  offeredAt?: Date;
  hiredAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ScreeningAnswer {
  questionId: string;
  answer: string | string[];      // String for text, array for multiple-choice
  fileId?: string;                // For file uploads
}

interface CustomAnswer {
  questionId: string;
  answer: string | string[] | string; // Based on question type
}

interface Note {
  id: string;
  authorId: string;               // Team member who wrote note
  content: string;
  isPrivate: boolean;             // Private to team vs visible to candidate
  tags: string[];
  createdAt: Date;
}

interface Activity {
  id: string;
  type: "status_change" | "note_added" | "message_sent" | "interview_scheduled" | "file_viewed";
  actorId: string;                // Who performed the action
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}
```

---

## 4. Candidate/Applicant Model

```typescript
interface Candidate {
  id: string;                     // UUID (same as Student ID)
  userId: string;                 // Reference to User
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  
  // Professional Info
  headline?: string;              // Professional headline
  summary?: string;               // Professional summary
  currentPosition?: string;
  currentCompany?: string;
  
  // Experience
  experience: Experience[];
  
  // Education
  education: Education[];
  
  // Skills
  skills: Skill[];
  
  // Location
  location: string;
  willingToRelocate: boolean;
  
  // Availability
  availability: "immediately" | "2-weeks" | "1-month" | "3-months" | "not-looking";
  noticePeriod?: number;          // Days
  
  // Salary Expectations
  expectedSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Social Links
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  
  // Talent Pool
  inTalentPool: boolean;
  talentPoolTags: string[];
  interestLevel?: "high" | "medium" | "low";
  
  // Resumes
  resumes: Resume[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;                 // null if current
  isCurrent: boolean;
  description?: string;
  achievements?: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
}

interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
}

interface Resume {
  id: string;
  candidateId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  isDefault: boolean;
  uploadedAt: Date;
}
```

---

## 5. Message Model

```typescript
interface Conversation {
  id: string;                     // UUID
  employerId: string;
  candidateId: string;
  jobId?: string;                 // If related to a job application
  applicationId?: string;         // If related to an application
  
  // Participants
  participants: Participant[];
  
  // Metadata
  subject?: string;
  lastMessageAt: Date;
  unreadCount: number;            // Unread by employer
  isArchived: boolean;
  isStarred: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;                     // UUID
  conversationId: string;
  senderId: string;               // Employer or Candidate ID
  senderType: "employer" | "candidate";
  
  // Content
  content: string;                 // Message text (HTML)
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

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

interface MessageTemplate {
  id: string;
  employerId: string;
  name: string;
  category: "rejection" | "interview" | "offer" | "follow-up" | "custom";
  subject?: string;
  content: string;               // HTML with variables like {{candidateName}}
  variables: string[];            // Available variables
  createdAt: Date;
}
```

---

## 6. Career Page Model

```typescript
interface CareerPage {
  id: string;                     // UUID
  employerId: string;
  
  // Page Content
  sections: CareerPageSection[];
  
  // Settings
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  
  // Analytics
  views: number;
  uniqueVisitors: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface CareerPageSection {
  id: string;
  type: "hero" | "about" | "values" | "benefits" | "team" | "testimonials" | "jobs" | "cta";
  order: number;
  isVisible: boolean;
  content: Record<string, any>;  // Section-specific content
}

interface TalentInterest {
  id: string;
  careerPageId: string;
  candidateId?: string;           // If logged in
  email: string;
  name: string;
  phone?: string;
  message?: string;
  interestedIn: string[];         // Job categories
  createdAt: Date;
}
```

---

## 7. Team Member Model

```typescript
interface TeamMember {
  id: string;                     // UUID
  employerId: string;
  userId: string;                  // Reference to User
  
  // Role & Permissions
  role: "admin" | "recruiter" | "viewer";
  permissions: Permission[];
  
  // Assignment
  assignedJobs: string[];         // Job IDs
  assignedApplicants: string[];   // Applicant IDs
  
  // Activity
  lastActiveAt: Date;
  
  // Timestamps
  invitedAt: Date;
  joinedAt?: Date;
  createdAt: Date;
}

interface Permission {
  resource: "jobs" | "applicants" | "career-page" | "analytics" | "settings" | "team" | "billing";
  actions: ("create" | "read" | "update" | "delete" | "manage")[];
}
```

---

## 8. Analytics Model

```typescript
interface JobAnalytics {
  jobId: string;
  employerId: string;
  
  // Views
  totalViews: number;
  uniqueViews: number;
  viewsBySource: Record<string, number>;  // Source breakdown
  
  // Applications
  totalApplications: number;
  applicationsByStage: Record<string, number>;
  applicationsByDate: TimeSeriesData[];
  
  // Engagement
  saves: number;
  shares: number;
  clicks: number;
  
  // Conversion
  viewToApplyRate: number;
  applyToInterviewRate: number;
  interviewToOfferRate: number;
  offerToHireRate: number;
  
  // Demographics
  applicantLocations: Record<string, number>;
  applicantExperience: Record<string, number>;
  
  // Period
  periodStart: Date;
  periodEnd: Date;
  lastUpdated: Date;
}

interface CareerPageAnalytics {
  careerPageId: string;
  employerId: string;
  
  // Traffic
  totalViews: number;
  uniqueVisitors: number;
  viewsByDate: TimeSeriesData[];
  
  // Engagement
  averageTimeOnPage: number;
  bounceRate: number;
  jobClicks: number;
  
  // Conversions
  talentInterestSubmissions: number;
  applicationsFromPage: number;
  
  // Period
  periodStart: Date;
  periodEnd: Date;
  lastUpdated: Date;
}

interface TimeSeriesData {
  date: Date;
  value: number;
}
```

---

## 9. Notification Model

```typescript
interface Notification {
  id: string;                     // UUID
  employerId: string;
  userId: string;                  // Team member who should see it
  
  // Notification Details
  type: "new_application" | "application_status_change" | "job_expiring" | "message" | "talent_interest" | "system";
  title: string;
  message: string;
  
  // Related Entities
  jobId?: string;
  applicationId?: string;
  conversationId?: string;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Action
  actionUrl?: string;             // URL to navigate to
  
  // Timestamps
  createdAt: Date;
}
```

---

## 10. Search & Saved Searches

```typescript
interface SavedSearch {
  id: string;
  employerId: string;
  name: string;
  
  // Search Criteria
  filters: SearchFilters;
  
  // Results
  resultCount: number;
  lastSearchedAt: Date;
  
  // Settings
  emailAlerts: boolean;
  alertFrequency: "daily" | "weekly" | "instant";
  
  // Timestamps
  createdAt: Date;
}

interface SearchFilters {
  skills?: string[];
  experience?: {
    min: number;
    max: number;
  };
  location?: string;
  availability?: string;
  education?: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
}
```

---

## Relationships

### ER Diagram Overview

```
Employer (1) ──< (Many) JobPostings
Employer (1) ──< (Many) TeamMembers
Employer (1) ──< (1) CareerPage

JobPosting (1) ──< (Many) Applications
JobPosting (1) ──< (Many) JobAnalytics

Application (Many) ──< (1) Candidate
Application (Many) ──< (1) JobPosting
Application (Many) ──< (1) Employer

Candidate (1) ──< (Many) Resumes
Candidate (1) ──< (Many) Applications
Candidate (1) ──< (Many) Conversations

Conversation (1) ──< (Many) Messages
```

---

## Indexes

### Recommended Database Indexes

```sql
-- Employers
CREATE INDEX idx_employer_user_id ON employers(user_id);
CREATE INDEX idx_employer_slug ON employers(company_slug);

-- Jobs
CREATE INDEX idx_job_employer ON jobs(employer_id);
CREATE INDEX idx_job_status ON jobs(status);
CREATE INDEX idx_job_expires ON jobs(expires_at);
CREATE INDEX idx_job_slug ON jobs(job_slug);

-- Applications
CREATE INDEX idx_application_job ON applications(job_id);
CREATE INDEX idx_application_candidate ON applications(candidate_id);
CREATE INDEX idx_application_status ON applications(status);
CREATE INDEX idx_application_stage ON applications(stage);

-- Messages
CREATE INDEX idx_conversation_employer ON conversations(employer_id);
CREATE INDEX idx_conversation_candidate ON conversations(candidate_id);
CREATE INDEX idx_message_conversation ON messages(conversation_id);
CREATE INDEX idx_message_created ON messages(created_at);

-- Analytics
CREATE INDEX idx_analytics_job ON job_analytics(job_id);
CREATE INDEX idx_analytics_date ON job_analytics(period_start, period_end);
```

---

## Data Validation Rules

### Job Posting
- Title: 5-100 characters
- Description: Minimum 200 characters
- Skills: Maximum 20 skills
- Salary: Min must be less than max

### Application
- Resume: Required, PDF/DOCX, max 10MB
- Cover Letter: Optional, max 5000 characters
- Custom Answers: Required if question is marked required

### Career Page
- Sections: Minimum 1 section
- Meta Title: 30-60 characters
- Meta Description: 120-160 characters


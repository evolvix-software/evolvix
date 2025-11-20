# 📄 Employer Portal - Pages & Routes

## Route Structure

### Base Path
All employer portal routes are prefixed with `/portal/employer`

## Complete Route Map

### 1. Dashboard
```
/portal/employer/dashboard
```
**Purpose**: Main landing page showing hiring activity overview

**Components**:
- `DashboardPage.tsx`
- `StatsCards.tsx`
- `RecentActivity.tsx`
- `QuickActions.tsx`
- `JobPerformanceChart.tsx`

---

### 2. Post a Job
```
/portal/employer/jobs/new
```
**Purpose**: Create new job posting

**Components**:
- `PostJobPage.tsx`
- `JobForm.tsx`
- `JobPreview.tsx`
- `AIGenerator.tsx`
- `TemplateSelector.tsx`

**Sub-routes**:
- `/portal/employer/jobs/new?template=software-engineer` - Pre-filled template

---

### 3. Manage Jobs
```
/portal/employer/jobs/manage
```
**Purpose**: View and manage all posted jobs

**Components**:
- `ManageJobsPage.tsx`
- `JobCard.tsx`
- `JobFilters.tsx`
- `JobActions.tsx`
- `BulkActions.tsx`

**Query Parameters**:
- `?status=active` - Filter by status
- `?search=engineer` - Search jobs
- `?sort=date` - Sort order

---

### 4. Job Details
```
/portal/employer/jobs/[jobId]
```
**Purpose**: View individual job details and analytics

**Components**:
- `JobDetailsPage.tsx`
- `JobInfo.tsx`
- `JobAnalytics.tsx`
- `QuickActions.tsx`

**Sub-routes**:
- `/portal/employer/jobs/[jobId]/edit` - Edit job
- `/portal/employer/jobs/[jobId]/duplicate` - Duplicate job
- `/portal/employer/jobs/[jobId]/analytics` - Detailed analytics

---

### 5. Applicant Pipeline
```
/portal/employer/jobs/[jobId]/applicants
```
**Purpose**: Track and manage applicants for a specific job

**Components**:
- `ApplicantPipelinePage.tsx`
- `PipelineBoard.tsx` (Kanban)
- `ApplicantCard.tsx`
- `ApplicantFilters.tsx`
- `BulkActions.tsx`
- `ApplicantDetails.tsx`

**Query Parameters**:
- `?stage=new` - Filter by pipeline stage
- `?search=john` - Search applicants
- `?sort=date` - Sort order

---

### 6. Applicant Details
```
/portal/employer/applicants/[applicantId]
```
**Purpose**: View detailed applicant profile and application

**Components**:
- `ApplicantDetailsPage.tsx`
- `ApplicantProfile.tsx`
- `ResumeViewer.tsx`
- `ApplicationDetails.tsx`
- `NotesPanel.tsx`
- `ActivityTimeline.tsx`
- `MessageButton.tsx`

**Sub-routes**:
- `/portal/employer/applicants/[applicantId]/resume` - Full resume view
- `/portal/employer/applicants/[applicantId]/notes` - Notes panel

---

### 7. All Applicants (Cross-Job View)
```
/portal/employer/applicants
```
**Purpose**: View all applicants across all jobs

**Components**:
- `AllApplicantsPage.tsx`
- `ApplicantTable.tsx`
- `ApplicantFilters.tsx`
- `BulkActions.tsx`

**Query Parameters**:
- `?job=[jobId]` - Filter by job
- `?status=shortlisted` - Filter by status
- `?search=john` - Search applicants

---

### 8. Career Page Builder
```
/portal/employer/career-page
```
**Purpose**: Build and manage company career page

**Components**:
- `CareerPageBuilder.tsx`
- `PageEditor.tsx`
- `SectionManager.tsx`
- `MediaUploader.tsx`
- `PreviewPanel.tsx`
- `ThemeSelector.tsx`

**Sub-routes**:
- `/portal/employer/career-page/edit` - Edit mode
- `/portal/employer/career-page/preview` - Preview mode
- `/portal/employer/career-page/analytics` - Page analytics

**Public Route**:
- `/careers/[companySlug]` - Public career page

---

### 9. Messaging Hub
```
/portal/employer/messaging
```
**Purpose**: Communicate with candidates

**Components**:
- `MessagingPage.tsx`
- `ConversationList.tsx`
- `ConversationView.tsx`
- `MessageComposer.tsx`
- `TemplateSelector.tsx`
- `AttachmentUploader.tsx`

**Sub-routes**:
- `/portal/employer/messaging/[conversationId]` - Individual conversation
- `/portal/employer/messaging/compose` - New message
- `/portal/employer/messaging/templates` - Message templates

---

### 10. Talent Pool
```
/portal/employer/talent-pool
```
**Purpose**: Manage candidate database

**Components**:
- `TalentPoolPage.tsx`
- `CandidateGrid.tsx`
- `CandidateCard.tsx`
- `TalentFilters.tsx`
- `BulkActions.tsx`
- `ImportDialog.tsx`

**Sub-routes**:
- `/portal/employer/talent-pool/[candidateId]` - Candidate details
- `/portal/employer/talent-pool/import` - Import candidates

---

### 11. Search Talent
```
/portal/employer/search
```
**Purpose**: Search and discover candidates

**Components**:
- `SearchTalentPage.tsx`
- `SearchFilters.tsx`
- `SearchResults.tsx`
- `CandidateCard.tsx`
- `SaveSearchDialog.tsx`

**Query Parameters**:
- `?skills=react,nodejs` - Filter by skills
- `?experience=2-5` - Experience range
- `?location=mumbai` - Location filter
- `?available=true` - Availability filter

**Sub-routes**:
- `/portal/employer/search/saved` - Saved searches
- `/portal/employer/search/[searchId]` - Saved search results

---

### 12. Analytics Dashboard
```
/portal/employer/analytics
```
**Purpose**: View hiring performance metrics

**Components**:
- `AnalyticsPage.tsx`
- `MetricsOverview.tsx`
- `JobPerformanceChart.tsx`
- `ApplicantFunnel.tsx`
- `TimeSeriesChart.tsx`
- `ExportButton.tsx`

**Sub-routes**:
- `/portal/employer/analytics/jobs` - Job-specific analytics
- `/portal/employer/analytics/career-page` - Career page analytics
- `/portal/employer/analytics/reports` - Generated reports

**Query Parameters**:
- `?period=7d` - Time period (7d, 30d, 90d, 1y)
- `?job=[jobId]` - Filter by job

---

### 13. Settings
```
/portal/employer/settings
```
**Purpose**: Configure account and preferences

**Components**:
- `SettingsPage.tsx`
- `SettingsTabs.tsx`

**Sub-routes**:
- `/portal/employer/settings/profile` - Company profile
- `/portal/employer/settings/team` - Team management
- `/portal/employer/settings/jobs` - Job posting settings
- `/portal/employer/settings/notifications` - Notification preferences
- `/portal/employer/settings/integrations` - Third-party integrations
- `/portal/employer/settings/billing` - Billing and subscription
- `/portal/employer/settings/security` - Security settings

---

### 14. Notifications
```
/portal/employer/notifications
```
**Purpose**: View and manage notifications

**Components**:
- `NotificationsPage.tsx`
- `NotificationList.tsx`
- `NotificationItem.tsx`
- `NotificationSettings.tsx`

**Query Parameters**:
- `?type=applicant` - Filter by type
- `?unread=true` - Show only unread

---

### 15. Account & Billing
```
/portal/employer/settings/billing
```
**Purpose**: Manage subscription and payments

**Components**:
- `BillingPage.tsx`
- `PlanSelector.tsx`
- `PaymentMethod.tsx`
- `InvoiceHistory.tsx`
- `UsageStats.tsx`

**Sub-routes**:
- `/portal/employer/settings/billing/plans` - View plans
- `/portal/employer/settings/billing/invoices` - Invoice history
- `/portal/employer/settings/billing/payment` - Payment methods

---

## Route Guards & Permissions

### Authentication Required
All routes require employer authentication.

### Role-Based Access
- **Admin**: Full access to all routes
- **Recruiter**: Limited access (no billing, team management)
- **Viewer**: Read-only access

### Route Protection
```typescript
// Example middleware
export function requireEmployerAuth() {
  // Check authentication
  // Redirect to login if not authenticated
}

export function requireRole(roles: string[]) {
  // Check user role
  // Redirect to unauthorized if role not allowed
}
```

## Navigation Structure

### Main Navigation
```
Dashboard
├── Jobs
│   ├── Post New Job
│   ├── Manage Jobs
│   └── Job Analytics
├── Applicants
│   ├── All Applicants
│   └── Pipeline View
├── Career Page
├── Messaging
├── Talent Pool
├── Search Talent
├── Analytics
└── Settings
```

### Breadcrumbs
Each page should show breadcrumb navigation:
```
Dashboard > Jobs > Manage Jobs > Software Engineer
```

## URL Patterns

### Clean URLs
- Use slugs for company names: `/careers/techverse`
- Use IDs for jobs: `/jobs/12345`
- Use UUIDs for applicants: `/applicants/abc-123-def`

### Query Parameters
- Use for filters: `?status=active&location=mumbai`
- Use for pagination: `?page=2&limit=20`
- Use for sorting: `?sort=date&order=desc`

## Mobile Responsive Routes

All routes should be mobile-responsive with:
- Bottom navigation for mobile
- Collapsible sidebar for tablet
- Full sidebar for desktop

## SEO Considerations

### Public Routes (Career Pages)
- `/careers/[companySlug]` - SEO optimized
- Meta tags for job listings
- Structured data (JSON-LD)

### Protected Routes
- No indexing for employer portal routes
- Robots.txt configuration


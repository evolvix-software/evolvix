# 📄 Scholarship Provider Portal - Pages & Routes

## Route Structure

### Base Path
All provider portal routes are prefixed with `/portal/provider`

## Complete Route Map

### 1. Dashboard
```
/portal/provider/dashboard
```
**Purpose**: Main landing page showing campaign overview, fund status, scholar health, and impact metrics

**Components**:
- `DashboardPage.tsx`
- `ImpactMetrics.tsx`
- `FundStatusWidget.tsx`
- `ScholarHealthWidget.tsx`
- `RecentAwards.tsx`
- `QuickActions.tsx`

---

### 2. Programs & Courses
```
/portal/provider/programs
```
**Purpose**: View courses with scholarship slots and manage program associations

**Components**:
- `ProgramsPage.tsx`
- `CourseCard.tsx`
- `CourseFilters.tsx`
- `ScholarshipSlotsBadge.tsx`

**Sub-routes**:
- `/portal/provider/programs/[courseId]` - Course details with scholarship info

---

### 3. Scholarship Campaigns
```
/portal/provider/campaigns
```
**Purpose**: Create and manage scholarship campaigns

**Components**:
- `CampaignsPage.tsx`
- `CampaignCard.tsx`
- `CampaignFilters.tsx`
- `CampaignStats.tsx`

**Sub-routes**:
- `/portal/provider/campaigns/new` - Create new campaign
- `/portal/provider/campaigns/[campaignId]` - Campaign details
- `/portal/provider/campaigns/[campaignId]/edit` - Edit campaign
- `/portal/provider/campaigns/[campaignId]/applications` - Campaign applications

---

### 4. Applications Queue
```
/portal/provider/applications
```
**Purpose**: Review, verify, and score scholarship applications

**Components**:
- `ApplicationsPage.tsx`
- `ApplicationCard.tsx`
- `ApplicationFilters.tsx`
- `VerificationPanel.tsx`
- `ScorecardModal.tsx`
- `BulkActions.tsx`

**Query Parameters**:
- `?status=submitted` - Filter by status
- `?campaign=[campaignId]` - Filter by campaign
- `?priority=high` - Filter by priority

**Sub-routes**:
- `/portal/provider/applications/[applicationId]` - Application details
- `/portal/provider/applications/[applicationId]/verify` - Verification view
- `/portal/provider/applications/[applicationId]/score` - Scoring view

---

### 5. Awarded Scholars
```
/portal/provider/scholars
```
**Purpose**: Manage awarded scholars and track their progress

**Components**:
- `ScholarsPage.tsx`
- `ScholarCard.tsx`
- `ScholarFilters.tsx`
- `ScholarGrowthCard.tsx`
- `JobPlacementBadge.tsx`
- `GraduationBadge.tsx`

**Query Parameters**:
- `?status=active` - Filter by status
- `?campaign=[campaignId]` - Filter by campaign
- `?atRisk=true` - Show at-risk scholars
- `?graduated=true` - Show graduated scholars

**Sub-routes**:
- `/portal/provider/scholars/[scholarId]` - Scholar profile with growth tracking
- `/portal/provider/scholars/[scholarId]/progress` - Detailed progress view
- `/portal/provider/scholars/[scholarId]/job-tracking` - Job placement tracking

---

### 6. Scholar Profile (Detailed)
```
/portal/provider/scholars/[scholarId]
```
**Purpose**: Comprehensive scholar profile with growth metrics, job tracking, and achievements

**Components**:
- `ScholarProfilePage.tsx`
- `ScholarOverview.tsx`
- `GrowthTimeline.tsx`
- `JobPlacementCard.tsx`
- `GraduationInfo.tsx`
- `AchievementsBadges.tsx`
- `ProgressCharts.tsx`
- `CourseEnrollment.tsx`
- `MentorSessions.tsx`
- `FinancialSummary.tsx`
- `ActionButtons.tsx`

**Tabs**:
- Overview
- Progress & Growth
- Job Placement
- Graduation & Certification
- Financials
- Communications
- Notes

---

### 7. Fund Management
```
/portal/provider/funds
```
**Purpose**: Manage fund transfers to Evolvix and track disbursements

**Components**:
- `FundManagementPage.tsx`
- `BalanceWidget.tsx`
- `TransferHistory.tsx`
- `DisbursementLedger.tsx`
- `TransferModal.tsx`
- `FinancialReports.tsx`

**Sub-routes**:
- `/portal/provider/funds/transfers` - Transfer history
- `/portal/provider/funds/disbursements` - Disbursement records
- `/portal/provider/funds/reports` - Financial reports

---

### 8. Scholar Growth & Impact Analytics
```
/portal/provider/analytics
```
**Purpose**: View scholar growth metrics, impact measurements, and success stories

**Components**:
- `AnalyticsPage.tsx`
- `ImpactMetrics.tsx`
- `GrowthCharts.tsx`
- `CohortAnalysis.tsx`
- `SuccessStories.tsx`
- `JobPlacementStats.tsx`
- `GraduationRates.tsx`
- `ROIAnalysis.tsx`

**Query Parameters**:
- `?period=30d` - Time period
- `?campaign=[campaignId]` - Filter by campaign
- `?cohort=[cohortId]` - Filter by cohort

**Sub-routes**:
- `/portal/provider/analytics/growth` - Growth analytics
- `/portal/provider/analytics/impact` - Impact metrics
- `/portal/provider/analytics/jobs` - Job placement analytics
- `/portal/provider/analytics/roi` - ROI analysis

---

### 9. Mentors & Payroll
```
/portal/provider/mentors
```
**Purpose**: Manage mentors and track payroll costs

**Components**:
- `MentorsPage.tsx`
- `MentorCard.tsx`
- `MentorFilters.tsx`
- `SessionLogger.tsx`
- `PayrollSummary.tsx`
- `PerformanceMetrics.tsx`

**Sub-routes**:
- `/portal/provider/mentors/[mentorId]` - Mentor details
- `/portal/provider/mentors/[mentorId]/sessions` - Session log
- `/portal/provider/mentors/payroll` - Payroll management

---

### 10. Communications
```
/portal/provider/communications
```
**Purpose**: Communicate with scholars and mentors

**Components**:
- `CommunicationsPage.tsx`
- `ConversationList.tsx`
- `ConversationView.tsx`
- `MessageComposer.tsx`
- `AnnouncementCreator.tsx`
- `TemplateLibrary.tsx`

**Sub-routes**:
- `/portal/provider/communications/messages` - Messaging hub
- `/portal/provider/communications/announcements` - Announcements
- `/portal/provider/communications/templates` - Message templates
- `/portal/provider/communications/[conversationId]` - Individual conversation

---

### 11. Reports & Exports
```
/portal/provider/reports
```
**Purpose**: Generate and export reports

**Components**:
- `ReportsPage.tsx`
- `ReportBuilder.tsx`
- `ReportTemplates.tsx`
- `ExportOptions.tsx`
- `ScheduledReports.tsx`

**Sub-routes**:
- `/portal/provider/reports/campaign` - Campaign reports
- `/portal/provider/reports/scholar` - Scholar progress reports
- `/portal/provider/reports/financial` - Financial reports
- `/portal/provider/reports/impact` - Impact reports

---

### 12. Settings
```
/portal/provider/settings
```
**Purpose**: Configure account and preferences

**Components**:
- `SettingsPage.tsx`
- `SettingsTabs.tsx`

**Sub-routes**:
- `/portal/provider/settings/profile` - Provider profile
- `/portal/provider/settings/team` - Team management
- `/portal/provider/settings/notifications` - Notification preferences
- `/portal/provider/settings/integrations` - Third-party integrations
- `/portal/provider/settings/compliance` - Compliance settings
- `/portal/provider/settings/security` - Security settings

---

## Route Guards & Permissions

### Authentication Required
All routes require provider authentication.

### Role-Based Access
- **Admin**: Full access to all routes
- **Reviewer**: Access to applications and scholars (read/write)
- **Finance**: Access to funds and reports
- **Viewer**: Read-only access

### Route Protection
```typescript
// Example middleware
export function requireProviderAuth() {
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
├── Programs & Courses
├── Campaigns
│   ├── Create Campaign
│   ├── Manage Campaigns
│   └── Campaign Analytics
├── Applications
│   ├── Review Queue
│   ├── Verification
│   └── Scoring
├── Scholars
│   ├── All Scholars
│   ├── Scholar Profiles
│   └── Growth Tracking
├── Funds
│   ├── Transfer Funds
│   ├── Disbursements
│   └── Financial Reports
├── Analytics
│   ├── Growth Metrics
│   ├── Impact Analysis
│   └── ROI Reports
├── Mentors
├── Communications
├── Reports
└── Settings
```

### Breadcrumbs
Each page should show breadcrumb navigation:
```
Dashboard > Scholars > John Doe > Job Placement
```

## URL Patterns

### Clean URLs
- Use slugs for campaigns: `/campaigns/scholarship-2024`
- Use IDs for scholars: `/scholars/abc-123-def`
- Use UUIDs for applications: `/applications/uuid-123`

### Query Parameters
- Use for filters: `?status=active&campaign=123`
- Use for pagination: `?page=2&limit=20`
- Use for sorting: `?sort=date&order=desc`

## Mobile Responsive Routes

All routes should be mobile-responsive with:
- Bottom navigation for mobile
- Collapsible sidebar for tablet
- Full sidebar for desktop

## SEO Considerations

### Public Routes (Future)
- `/scholarship/[campaignSlug]` - Public campaign page
- Meta tags for campaign listings
- Structured data (JSON-LD)

### Protected Routes
- No indexing for provider portal routes
- Robots.txt configuration


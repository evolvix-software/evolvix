# 📊 Reports & Exports Page (ADMIN ONLY)

## Overview

**IMPORTANT: This page is for ADMINISTRATORS ONLY, not scholarship providers.**

The Reports & Exports page allows Evolvix administrators to generate comprehensive reports on campaigns, scholars, finances, and impact across the entire platform. It provides tools for custom report building, scheduled reports, and multiple export formats to support system-wide reporting and decision-making.

**Scholarship providers do NOT have access to comprehensive reports.** Providers can only view:
- Their own fund transactions (transparency)
- Evolvix fund distribution to scholars (transparency)
- Growth of scholars they've donated to (if applicable)

All fund management reports and comprehensive analytics are managed exclusively by administrators.

## Route

```
/admin/reports
/admin/reports/campaign
/admin/reports/scholar
/admin/reports/financial
/admin/reports/impact
```

## Page Layout

### Header Section
- Page title: "Reports & Exports"
- Report categories
- Quick report buttons
- Report builder button
- Scheduled reports link

### Tabs
- Campaign Reports
- Scholar Reports
- Financial Reports
- Impact Reports
- Custom Reports
- Scheduled Reports

## Components

### 1. Campaign Reports Tab

#### Report Types
**Available Reports:**
- Campaign Summary Report
- Application Report
- Award Report
- Scholar Progress Report
- Campaign Financial Report
- Campaign Impact Report

---

#### Campaign Summary Report
**Sections:**
- Campaign Overview
  - Campaign details
  - Status and dates
  - Slots and funding
- Application Statistics
  - Total applications
  - Applications by status
  - Application timeline
- Award Statistics
  - Total awards
  - Award breakdown
  - Award timeline
- Scholar Statistics
  - Active scholars
  - Graduated scholars
  - Job placed scholars
- Financial Summary
  - Total invested
  - Funds disbursed
  - Remaining balance
- Impact Metrics
  - Graduation rate
  - Job placement rate
  - Average CGPA improvement

**Configuration:**
- Select campaign(s)
- Choose date range
- Include/exclude sections
- Format options

---

#### Application Report
**Data Points:**
- Application ID
- Student name
- CGPA
- Application date
- Status
- Score
- Ranking
- Decision date
- Award amount (if awarded)

**Filters:**
- Status filter
- Score range
- Date range
- Campaign filter

---

#### Award Report
**Data Points:**
- Scholar name
- Award amount
- Award type
- Award date
- Campaign
- Course
- Current status
- Progress percentage

**Filters:**
- Award date range
- Campaign filter
- Status filter
- Amount range

---

### 2. Scholar Reports Tab

#### Report Types
**Available Reports:**
- Scholar Progress Report
- Scholar Growth Report
- Job Placement Report
- Graduation Report
- Achievement Report
- Engagement Report

---

#### Scholar Progress Report
**Data Points:**
- Scholar name
- Course
- Progress percentage
- Baseline CGPA
- Current CGPA
- CGPA improvement
- Job status
- Graduation status
- Engagement score

**Grouping Options:**
- By campaign
- By course
- By status
- By graduation status
- By job placement status

**Filters:**
- Campaign filter
- Status filter
- Date range
- Progress range

---

#### Scholar Growth Report
**Metrics:**
- CGPA trends
- Progress trends
- Engagement trends
- Achievement milestones
- Improvement rates

**Visualizations:**
- Growth charts
- Trend lines
- Comparison charts
- Before/after metrics

---

#### Job Placement Report
**Data Points:**
- Scholar name
- Job title
- Company name
- Location
- Salary
- Placement date
- Time to placement
- Source
- Verified status

**Statistics:**
- Placement rate
- Average time to placement
- Average salary
- Top companies
- Job roles distribution

---

#### Graduation Report
**Data Points:**
- Scholar name
- Graduation date
- Final CGPA
- CGPA improvement
- Time to graduation
- Certificate issued
- Course completed

**Statistics:**
- Graduation rate
- Average graduation CGPA
- Average time to graduation
- Certificate issuance rate

---

### 3. Financial Reports Tab

#### Report Types
**Available Reports:**
- Balance Summary
- Transfer History
- Disbursement Report
- Campaign Financials
- ROI Report
- Payment Ledger

---

#### Balance Summary Report
**Sections:**
- Current Balance
- In-Transit Funds
- Reserved Funds
- Total Pledged
- Total Transferred
- Total Disbursed
- Pending Disbursements

**Period Comparison:**
- Current period
- Previous period
- Year-over-year
- Trend analysis

---

#### Transfer History Report
**Data Points:**
- Transfer ID
- Amount
- Date
- Status
- Campaign
- Transaction reference
- Confirmation date

**Filters:**
- Status filter
- Date range
- Campaign filter
- Amount range

---

#### Disbursement Report
**Data Points:**
- Disbursement ID
- Scholar name
- Amount
- Date
- Status
- Campaign
- Receipt link

**Grouping:**
- By scholar
- By campaign
- By date
- By status

---

#### ROI Report
**Metrics:**
- Total investment
- Total disbursed
- Cost per scholar
- Cost per graduate
- Cost per job placement
- Overall ROI percentage
- ROI by campaign
- ROI by course

**Visualizations:**
- ROI chart
- Cost breakdown
- Impact vs Investment
- ROI trends

---

### 4. Impact Reports Tab

#### Report Types
**Available Reports:**
- Impact Summary
- Success Stories Report
- Stakeholder Report
- Annual Impact Report

---

#### Impact Summary Report
**Sections:**
- Lives Changed
  - Total scholars
  - Active scholars
  - Graduated scholars
- Academic Impact
  - Average CGPA improvement
  - Graduation rate
  - Top performers
- Career Impact
  - Job placement rate
  - Average salary
  - Top companies
- Financial Impact
  - Total investment
  - ROI percentage
  - Cost per outcome
- Success Stories
  - Featured stories
  - Testimonials
  - Before/after comparisons

**Visualizations:**
- Impact dashboard
- Success metrics
- ROI visualization
- Growth charts

---

#### Success Stories Report
**Content:**
- Featured success stories
- Scholar profiles
- Before/after metrics
- Testimonials
- Achievement highlights
- Impact narratives

**Format:**
- Narrative format
- Visual format
- Presentation format
- PDF format

---

#### Stakeholder Report
**Purpose:** Executive summary for stakeholders

**Sections:**
- Executive Summary
- Key Metrics
- Impact Highlights
- Success Stories
- Financial Summary
- Future Plans

**Format:**
- Professional PDF
- Presentation slides
- Infographic
- Interactive dashboard

---

### 5. Custom Report Builder

#### Report Builder Interface
**Steps:**
1. Select Report Type
2. Choose Data Sources
3. Select Fields
4. Apply Filters
5. Configure Grouping
6. Choose Format
7. Preview Report
8. Generate/Export

---

#### Field Selection
**Available Fields:**
- Scholar fields (name, CGPA, progress, etc.)
- Campaign fields (title, status, funding, etc.)
- Application fields (status, score, date, etc.)
- Financial fields (amount, date, status, etc.)
- Achievement fields (badges, milestones, etc.)

**Features:**
- Search fields
- Category grouping
- Field descriptions
- Required vs optional

---

#### Filter Configuration
**Filter Types:**
- Date range
- Status filters
- Numeric ranges
- Text search
- Multi-select
- Custom filters

**Filter Logic:**
- AND/OR logic
- Nested filters
- Save filter sets
- Apply filter presets

---

#### Format Options
**Export Formats:**
- PDF (formatted report)
- CSV (data export)
- Excel (spreadsheet)
- JSON (API format)
- HTML (web format)

**Formatting Options:**
- Include charts
- Include images
- Page layout
- Header/footer
- Branding

---

### 6. Scheduled Reports Tab

#### Scheduled Reports List
**Displays:**
- Report name
- Report type
- Schedule frequency
- Next run date
- Last run date
- Status
- Recipients
- Actions

**Actions:**
- Edit Schedule
- Run Now
- Pause Schedule
- Delete Schedule
- View History

---

#### Schedule Report Form
**Fields:**
- Report Name* (text input)
- Report Type* (dropdown)
- Configuration* (report builder)
- Schedule Frequency* (Daily, Weekly, Monthly, Quarterly, Yearly)
- Day/Time* (specific day/time)
- Recipients* (email list)
- Format* (PDF, CSV, Excel)
- Include Charts (checkbox)

**Features:**
- Preview schedule
- Test report generation
- Email notification
- Failure notifications

---

## Data Requirements

### API Endpoints
- `GET /api/provider/reports/campaign`
- `GET /api/provider/reports/scholar`
- `GET /api/provider/reports/financial`
- `GET /api/provider/reports/impact`
- `POST /api/provider/reports/generate`
- `GET /api/provider/reports/scheduled`
- `POST /api/provider/reports/scheduled`

### Data Structure
```typescript
interface Report {
  id: string;
  type: 'campaign' | 'scholar' | 'financial' | 'impact' | 'custom';
  name: string;
  configuration: ReportConfiguration;
  format: 'pdf' | 'csv' | 'excel' | 'json';
  generatedAt: Date;
  downloadUrl: string;
  expiresAt: Date;
}

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  configuration: ReportConfiguration;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  day?: number;
  time: string;
  recipients: string[];
  format: string;
  isActive: boolean;
  nextRunAt: Date;
  lastRunAt?: Date;
}
```

## User Interactions

### 1. Generate Report
- Select report type → Choose template
- Configure report → Set filters and fields
- Preview report → Review content
- Export report → Download file

### 2. Build Custom Report
- Open report builder → Start building
- Select fields → Choose data points
- Apply filters → Narrow data
- Configure format → Choose export format
- Generate → Create report

### 3. Schedule Report
- Create schedule → Set frequency
- Configure report → Build report
- Set recipients → Add emails
- Save schedule → Activate

### 4. View Scheduled Reports
- View list → Check schedules
- Edit schedule → Modify settings
- Run now → Generate immediately
- View history → Check past runs

## Responsive Design

### Desktop (>1024px)
- Multi-column layout
- Side-by-side builder
- Full feature set
- Data tables

### Tablet (768px - 1024px)
- 2-column layout
- Stacked builder
- Touch-optimized
- Responsive tables

### Mobile (<768px)
- Single column
- Full-screen builder
- Simplified interface
- Mobile-optimized

## Loading States

### Report Generation
- Loading indicator
- Progress bar
- Estimated time
- Cancel option

### Report Preview
- Skeleton loader
- Progressive loading
- Smooth transitions

## Error Handling

### Generation Errors
- Show error message
- Retry option
- Contact support
- Fallback options

### Data Errors
- Handle missing data
- Show warnings
- Provide alternatives
- Graceful degradation

## Performance Considerations

### Optimization
- Paginate large reports
- Lazy load data
- Cache report configurations
- Optimize queries

### Data Fetching
- Parallel API calls
- Background generation
- Progress updates
- Result caching

## Accessibility

### Keyboard Navigation
- Tab through builder
- Enter to generate
- Escape to cancel
- Arrow keys for navigation

### Screen Readers
- ARIA labels
- Report structure announcements
- Progress announcements
- Error announcements

## Future Enhancements

1. **Advanced Analytics**
   - Predictive analytics
   - Trend analysis
   - Benchmarking
   - Comparative analysis

2. **Interactive Reports**
   - Interactive dashboards
   - Drill-down capabilities
   - Real-time updates
   - Custom visualizations

3. **Report Sharing**
   - Shareable links
   - Public reports
   - Embed codes
   - Social sharing

4. **AI-Powered Insights**
   - Auto-generate insights
   - Anomaly detection
   - Recommendations
   - Smart summaries

5. **Integration**
   - Export to accounting software
   - API access
   - Webhook integration
   - Third-party tools


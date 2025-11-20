# 🎯 Scholarship Campaigns Page

## Overview

The Scholarship Campaigns page allows providers to create, manage, and monitor scholarship campaigns. Providers can define eligibility rules, set funding requirements, track applications, and measure campaign impact.

## Route

```
/portal/provider/campaigns
/portal/provider/campaigns/new
/portal/provider/campaigns/[campaignId]
/portal/provider/campaigns/[campaignId]/edit
/portal/provider/campaigns/[campaignId]/applications
```

## Page Layout

### Header Section
- Page title: "Scholarship Campaigns"
- Total campaigns count
- Quick filters (Draft, Open, Closed, Completed)
- Create Campaign button
- Bulk actions

### Filters & Search
- Search bar (title, description)
- Filter dropdowns:
  - Status (Draft, Open, Closed, Completed, Cancelled)
  - Campaign Type (Course-specific, Pooled, General)
  - Date Range
  - Linked Courses
- Clear filters button

### Campaign List/Grid
- Grid view (default) or List view
- Campaign cards with key metrics
- Sortable columns
- Bulk selection

## Components

### 1. Campaign Card

**Displays:**
- Campaign title
- Campaign type badge
- Status badge (Draft, Open, Closed, Completed)
- Total slots / Slots available / Slots awarded
- Funded amount / Required amount
- Application window (open/close dates)
- Linked courses count
- Applications count
- Quick stats (views, applications, awards)

**Quick Actions:**
- View Details
- Edit Campaign
- Duplicate Campaign
- Close Campaign
- View Applications
- View Scholars
- View Analytics
- Delete Campaign

**Interactions:**
- Click card → Open campaign details
- Hover → Show quick actions
- Right-click → Context menu

---

### 2. Campaign Creation Wizard

#### Step 1: Campaign Basics
**Fields:**
- Campaign Title* (5-200 characters)
- Campaign Description* (Rich text editor)
- Campaign Type* (Course-specific, Pooled, General)
- Linked Courses (if course-specific)
- Campaign Slug (auto-generated, editable)

**Validation:**
- Title required
- Description minimum 100 characters
- At least one course if course-specific

---

#### Step 2: Scholarship Details
**Fields:**
- Total Slots* (minimum 1)
- Award Type* (Full, Partial)
- Award Amount (if partial)
- Funding Model* (Per-student, Pooled, Variable)
- Required Amount* (total funding needed)
- Reserved Funds (optional)

**Calculations:**
- Auto-calculate required amount based on slots and award type
- Show funding breakdown
- Display per-student cost

---

#### Step 3: Eligibility Rules
**Academic Criteria:**
- Minimum CGPA (optional)
- Maximum CGPA (optional)
- Specific courses required (optional)
- Specific programs required (optional)

**Financial Criteria:**
- Financial need required (checkbox)
- Merit-based (checkbox)
- Need-based (checkbox)
- Income threshold (optional)

**Other Criteria:**
- Geographic restrictions (optional)
- Age range (optional)
- Custom criteria (free text)

**Visual Builder:**
- Drag-and-drop rule builder
- Rule preview
- Test eligibility with sample data

---

#### Step 4: Selection Criteria
**Scoring Weights:**
- Academic Weight (0-100)
- Financial Need Weight (0-100)
- Motivation Weight (0-100)
- Total must equal 100

**Selection Process:**
- Interview Required (checkbox)
- Mentor Recommendation Required (checkbox)
- Auto-award Threshold (optional, 0-100)
- Manual Review Required (checkbox)

**Features:**
- Weight slider controls
- Preview scoring calculation
- Example scoring scenarios

---

#### Step 5: Application Window
**Fields:**
- Application Open Date* (date picker)
- Application Close Date* (date picker)
- Auto-close when slots filled (checkbox)
- Timezone selection

**Validation:**
- Close date must be after open date
- Open date cannot be in the past (unless draft)
- Minimum window duration (e.g., 7 days)

**Preview:**
- Show application window timeline
- Display days remaining
- Show status (Upcoming, Open, Closing Soon, Closed)

---

#### Step 6: Funding & Budget
**Fields:**
- Total Required Amount* (calculated or manual)
- Funding Goal (optional)
- Payment Schedule (One-time, Monthly, Quarterly)
- Reserve Funds (optional)

**Budget Breakdown:**
- Per-student cost
- Total cost calculation
- Available balance check
- Funding gap indicator

---

#### Step 7: Review & Publish
**Preview:**
- Campaign summary
- Eligibility rules summary
- Selection criteria summary
- Application window summary
- Funding summary

**Actions:**
- Save as Draft
- Publish Campaign
- Schedule Publication (future date)
- Preview Public View

**Validation:**
- Check all required fields
- Validate dates
- Check funding availability
- Verify eligibility rules

---

### 3. Campaign Details Page

#### Overview Tab
**Displays:**
- Campaign title and description
- Status badge
- Key metrics:
  - Total slots / Available / Awarded
  - Funded amount / Required amount
  - Applications received
  - Awards made
  - Scholars active
- Application window status
- Linked courses list

**Actions:**
- Edit Campaign
- Duplicate Campaign
- Close Campaign
- View Applications
- View Scholars
- View Analytics
- Transfer Funds

---

#### Applications Tab
**Displays:**
- Applications list for this campaign
- Application status breakdown
- Application timeline
- Quick filters and search

**Features:**
- Filter by status
- Sort by score, date, CGPA
- Bulk actions
- Export applications

---

#### Scholars Tab
**Displays:**
- Awarded scholars from this campaign
- Scholar progress summary
- Job placement rate
- Graduation rate
- Success metrics

---

#### Analytics Tab
**Metrics:**
- Application metrics (views, applications, conversion rate)
- Award metrics (awards made, acceptance rate)
- Scholar metrics (active, graduated, placed)
- Financial metrics (funded, disbursed, ROI)
- Impact metrics (graduation rate, placement rate, CGPA improvement)

**Visualizations:**
- Application funnel chart
- Award timeline
- Scholar progress chart
- Financial breakdown
- Impact metrics dashboard

---

#### Settings Tab
**Campaign Settings:**
- Edit campaign details
- Update eligibility rules
- Modify selection criteria
- Change application window
- Update funding details

**Advanced Settings:**
- Auto-award rules
- Notification preferences
- Integration settings
- Archive campaign

---

### 4. Campaign List View

#### Grid View (Default)
**Layout:**
- 3-column grid (desktop)
- 2-column grid (tablet)
- 1-column grid (mobile)
- Campaign cards with images
- Hover effects
- Quick action overlays

#### List View
**Layout:**
- Table format
- Sortable columns
- Expandable rows
- Inline actions
- Bulk selection

**Columns:**
- Campaign Name
- Status
- Type
- Slots (Available/Awarded)
- Funding (Funded/Required)
- Applications
- Created Date
- Actions

---

## Data Requirements

### API Endpoints
- `GET /api/provider/campaigns`
- `GET /api/provider/campaigns/:campaignId`
- `POST /api/provider/campaigns`
- `PUT /api/provider/campaigns/:campaignId`
- `DELETE /api/provider/campaigns/:campaignId`
- `GET /api/provider/campaigns/:campaignId/applications`
- `GET /api/provider/campaigns/:campaignId/scholars`
- `GET /api/provider/campaigns/:campaignId/analytics`

### Data Structure
```typescript
interface Campaign {
  id: string;
  title: string;
  description: string;
  campaignType: 'course-specific' | 'pooled' | 'general';
  status: 'draft' | 'open' | 'closed' | 'completed' | 'cancelled';
  totalSlots: number;
  slotsAvailable: number;
  slotsAwarded: number;
  requiredAmount: number;
  fundedAmount: number;
  linkedCourseIds: string[];
  eligibilityRules: EligibilityRules;
  selectionCriteria: SelectionCriteria;
  applicationOpenDate: Date;
  applicationCloseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## User Interactions

### 1. Create Campaign
- Click "Create Campaign" → Opens wizard
- Fill each step → Progress indicator
- Review → Preview campaign
- Publish → Campaign goes live

### 2. Edit Campaign
- Click "Edit" → Opens edit form
- Make changes → Validate changes
- Save → Update campaign
- Check impact on existing applications

### 3. View Campaign Details
- Click campaign card → Open details
- Navigate tabs → View different aspects
- Drill down → View applications/scholars

### 4. Manage Applications
- Navigate to Applications tab
- Filter and search applications
- Review and award scholarships
- Track application status

### 5. Monitor Campaign
- View analytics → Track performance
- Check funding status → Transfer funds
- Monitor scholar progress → Track outcomes
- View impact metrics → Measure success

## Responsive Design

### Desktop (>1024px)
- 3-column grid for campaigns
- Side-by-side wizard steps
- Full feature set
- Hover effects

### Tablet (768px - 1024px)
- 2-column grid
- Stacked wizard steps
- Touch-optimized
- Collapsible sections

### Mobile (<768px)
- 1-column layout
- Full-screen wizard
- Bottom navigation
- Swipe actions

## Loading States

### Initial Load
- Skeleton loaders for campaign cards
- Progressive loading
- Smooth transitions

### Campaign Creation
- Step-by-step loading
- Form validation feedback
- Save progress indicator

## Error Handling

### Validation Errors
- Show inline errors
- Highlight invalid fields
- Provide helpful messages
- Prevent submission until valid

### API Errors
- Show error message
- Retry button
- Fallback to draft
- Contact support link

### Empty States
- No campaigns: "Create your first campaign"
- No applications: "No applications yet"
- No scholars: "No scholars awarded yet"

## Performance Considerations

### Optimization
- Paginate campaign list
- Lazy load campaign details
- Cache campaign data
- Debounce search

### Data Fetching
- Parallel API calls
- React Query for caching
- Background refresh
- Manual refresh button

## Accessibility

### Keyboard Navigation
- Tab through form fields
- Enter to submit
- Escape to cancel
- Arrow keys for navigation

### Screen Readers
- ARIA labels for all fields
- Form validation announcements
- Status announcements
- Progress indicators

## Future Enhancements

1. **Campaign Templates**
   - Pre-built templates
   - Save custom templates
   - Template library
   - Quick start from template

2. **AI-Powered Features**
   - Auto-generate descriptions
   - Suggest eligibility rules
   - Predict success probability
   - Optimize selection criteria

3. **Advanced Analytics**
   - Predictive analytics
   - Cohort analysis
   - A/B testing
   - Performance forecasting

4. **Campaign Automation**
   - Auto-close when full
   - Auto-award high scores
   - Scheduled actions
   - Workflow automation

5. **Social Features**
   - Share campaigns
   - Public campaign pages
   - Social media integration
   - Campaign promotion tools


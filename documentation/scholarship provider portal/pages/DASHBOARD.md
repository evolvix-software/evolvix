# 📊 Provider Dashboard

## Overview

The Provider Dashboard is the central hub showing campaign overview, fund status, scholar health, impact metrics, and recent activity.

## Route
```
/portal/provider/dashboard
```

## Components

### 1. Impact Metrics Cards
**Key Metrics:**
- **Total Active Scholars**: Currently active scholars
- **Graduation Rate**: % of scholars graduated
- **Job Placement Rate**: % of scholars placed in jobs
- **Average CGPA Improvement**: Average CGPA improvement
- **Total Investment**: Total funds invested
- **ROI**: Return on investment
- **Lives Changed**: Total scholars supported
- **Jobs Created**: Total jobs placed

**Design:**
- Large, prominent numbers
- Trend indicators (↑/↓ with percentage)
- Period comparison (vs previous period)
- Color-coded (green for positive, red for negative)
- Click to drill down

---

### 2. Fund Status Widget
**Displays:**
- **Current Balance**: Available funds
- **In-Transit**: Funds being transferred
- **Reserved**: Funds reserved for awards
- **Total Pledged**: Total amount pledged
- **Total Transferred**: Total transferred to Evolvix
- **Total Disbursed**: Total disbursed to scholars

**Visual Design:**
- Progress bar showing balance breakdown
- Color-coded sections
- Quick transfer button
- Transfer history link

---

### 3. Scholar Health Widget
**Metrics:**
- **Active Scholars**: Count of active scholars
- **At-Risk Scholars**: Scholars flagged as at-risk
- **Graduated Scholars**: Successfully graduated
- **Job Placed Scholars**: Scholars with jobs
- **Average Progress**: Average course completion
- **Average Engagement**: Average engagement score

**Visual Design:**
- Health score indicator
- Risk level breakdown
- Progress distribution
- Quick actions for at-risk scholars

---

### 4. Recent Awards
**Displays:**
- Last 5-10 recent scholarship awards
- Scholar name
- Award amount
- Award date
- Campaign name
- Quick link to scholar profile

**Actions:**
- View all awards
- Filter by campaign
- Export awards list

---

### 5. Recent Disbursements
**Displays:**
- Last 5-10 recent disbursements
- Scholar name
- Disbursement amount
- Disbursement date
- Status
- Receipt link

**Actions:**
- View all disbursements
- Filter by status
- Export disbursements

---

### 6. Campaign Overview
**Displays:**
- Active campaigns count
- Campaigns by status
- Total slots available
- Total applications received
- Campaign performance summary

**Quick Actions:**
- Create Campaign
- View All Campaigns
- View Campaign Analytics

---

### 7. Applications Queue Summary
**Displays:**
- Pending review count
- Under verification count
- Shortlisted count
- Urgent applications (high priority)

**Quick Actions:**
- Review Queue
- Verify Documents
- Score Applications

---

### 8. Scholar Growth Highlights
**Displays:**
- Recent job placements
- Recent graduations
- Top performers
- Most improved scholars
- Achievement highlights

**Features:**
- Success story cards
- Achievement badges
- Celebration announcements
- Share achievements

---

### 9. Quick Actions Panel
**Actions:**
- Create Campaign
- Review Applications
- Transfer Funds
- View Scholars
- Generate Report
- Send Announcement

**Design:**
- Icon buttons
- Clear labels
- Quick access
- Responsive grid

---

### 10. Activity Feed
**Recent Activity:**
- New applications received
- Applications awarded
- Scholars graduated
- Job placements
- Fund transfers
- Disbursements
- Team member actions

**Design:**
- Timeline layout
- Avatar + action description
- Timestamp
- Link to related item
- "View All" link

---

### 11. Success Stories Carousel
**Purpose:** Showcase scholar success to encourage

**Displays:**
- Featured success stories
- Scholar photos (with consent)
- Key achievements
- Before/After metrics
- Testimonials

**Features:**
- Auto-rotate carousel
- Manual navigation
- Click to view full story
- Share story option

---

## Data Requirements

### API Endpoints
- `GET /api/provider/dashboard/stats`
- `GET /api/provider/dashboard/funds`
- `GET /api/provider/dashboard/scholars`
- `GET /api/provider/dashboard/activity`
- `GET /api/provider/dashboard/success-stories`

### Data Structure
```typescript
interface DashboardData {
  impactMetrics: {
    totalScholars: number;
    graduationRate: number;
    jobPlacementRate: number;
    averageCGPAImprovement: number;
    totalInvestment: number;
    roi: number;
    livesChanged: number;
    jobsCreated: number;
  };
  fundStatus: {
    currentBalance: number;
    inTransit: number;
    reserved: number;
    totalPledged: number;
    totalTransferred: number;
    totalDisbursed: number;
  };
  scholarHealth: {
    activeCount: number;
    atRiskCount: number;
    graduatedCount: number;
    jobPlacedCount: number;
    averageProgress: number;
    averageEngagement: number;
  };
  recentAwards: Award[];
  recentDisbursements: Disbursement[];
  campaigns: {
    activeCount: number;
    byStatus: Record<string, number>;
    totalSlots: number;
    totalApplications: number;
  };
  applications: {
    pendingReview: number;
    underVerification: number;
    shortlisted: number;
    urgent: number;
  };
  growthHighlights: {
    recentPlacements: JobPlacement[];
    recentGraduations: Graduation[];
    topPerformers: Scholar[];
    mostImproved: Scholar[];
  };
  activity: Activity[];
  successStories: SuccessStory[];
}
```

## User Interactions

### 1. View Detailed Metrics
- Click metric card → Navigate to detailed analytics
- Hover → Show tooltip with more info
- Compare periods → Toggle period comparison

### 2. Quick Actions
- Click action button → Navigate to relevant page
- Create Campaign → Opens campaign creation
- Review Applications → Opens applications queue

### 3. Fund Management
- Click fund widget → Navigate to fund management
- Transfer Funds → Opens transfer modal
- View History → Opens transfer history

### 4. Scholar Management
- Click scholar card → Navigate to scholar profile
- View At-Risk → Filter at-risk scholars
- Celebrate Success → View success stories

### 5. Activity Feed
- Click activity item → Navigate to related page
- View All → Navigate to full activity page
- Filter activity → Filter by type

## Responsive Design

### Desktop (>1024px)
- 3-4 column grid for metrics
- Side-by-side widgets
- Full feature set
- Hover effects

### Tablet (768px - 1024px)
- 2-column grid
- Stacked widgets
- Touch-optimized
- Collapsible sections

### Mobile (<768px)
- 1-column layout
- Stacked cards
- Bottom navigation
- Swipe actions

## Loading States

### Initial Load
- Skeleton loaders for all sections
- Load critical metrics first
- Progressive loading
- Smooth transitions

### Data Refresh
- Show loading indicator
- Maintain current data
- Smooth update transition

## Error Handling

### API Errors
- Show error message in affected section
- Retry button
- Fallback to cached data
- Contact support link

### Empty States
- No scholars: "Award your first scholarship"
- No campaigns: "Create your first campaign"
- No activity: "No recent activity"

## Performance Considerations

### Optimization
- Cache dashboard data (5 minutes)
- Lazy load charts
- Paginate activity feed
- Debounce interactions

### Data Fetching
- Parallel API calls
- React Query for caching
- Background refresh (5 minutes)
- Manual refresh button

## Accessibility

### Keyboard Navigation
- Tab through all elements
- Enter/Space to activate
- Arrow keys for carousels
- Escape to close modals

### Screen Readers
- ARIA labels for metrics
- Live region for updates
- Descriptive chart titles
- Context announcements

## Future Enhancements

1. **Customizable Dashboard**
   - Drag-and-drop widgets
   - Show/hide sections
   - Custom date ranges
   - Saved views

2. **Real-time Updates**
   - WebSocket for live updates
   - Push notifications
   - Live activity feed
   - Instant metric updates

3. **Advanced Filtering**
   - Filter by campaign
   - Filter by date range
   - Filter by scholar status
   - Custom filters

4. **Predictive Insights**
   - AI-powered predictions
   - Risk alerts
   - Success probability
   - Trend forecasts

5. **Social Sharing**
   - Share impact metrics
   - Share success stories
   - Generate shareable reports
   - Social media integration


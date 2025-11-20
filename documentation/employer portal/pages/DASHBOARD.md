# 📊 Employer Dashboard

## Overview

The Employer Dashboard is the central hub where employers can view their hiring activity, job performance, candidate pipeline, and take quick actions.

## Route
```
/portal/employer/dashboard
```

## Components

### 1. Stats Cards Grid
Displays key metrics at a glance.

**Metrics:**
- Total Active Jobs
- Total Applications
- New Applications (Last 7 days)
- Jobs Expiring Soon (Next 7 days)
- Average Time to Fill
- Hire Rate

**Design:**
- 3-column grid on desktop
- 2-column grid on tablet
- 1-column grid on mobile
- Each card shows:
  - Icon
  - Metric value
  - Change indicator (↑/↓ percentage)
  - Link to detailed view

### 2. Quick Actions
Fast access to common tasks.

**Actions:**
- Post a Job
- View All Jobs
- View Applicants
- View Career Page
- Search Talent

**Design:**
- Horizontal button group
- Icon + text labels
- Responsive: Stack on mobile

### 3. Recent Activity Feed
Shows recent hiring activity.

**Activity Types:**
- New application received
- Application status changed
- Job posted
- Job closed
- Message received
- Team member activity

**Design:**
- Timeline-style layout
- Avatar + action description
- Timestamp
- Link to related item
- "View All" link

### 4. Job Performance Chart
Visual representation of job performance.

**Chart Types:**
- Line chart: Applications over time
- Bar chart: Top performing jobs
- Pie chart: Applications by status

**Time Periods:**
- Last 7 days
- Last 30 days
- Last 90 days
- Custom range

### 5. Upcoming Tasks
Reminders and tasks for the employer.

**Task Types:**
- Jobs expiring soon
- Applications pending review
- Interviews scheduled
- Messages unread

**Design:**
- List with checkboxes
- Priority indicators
- Due dates
- Quick actions

### 6. AI Insights Panel
AI-powered recommendations and insights.

**Insights:**
- Recommended skills to add
- Applicant quality trends
- Hiring market insights
- Optimization suggestions

**Design:**
- Card with insights list
- Dismissible items
- "Learn More" links

## Data Requirements

### API Endpoints
- `GET /api/employer/dashboard/stats`
- `GET /api/employer/dashboard/activity`
- `GET /api/employer/dashboard/charts`
- `GET /api/employer/dashboard/tasks`
- `GET /api/employer/dashboard/insights`

### Data Structure
```typescript
interface DashboardData {
  stats: {
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
    expiringJobs: number;
    averageTimeToFill: number;
    hireRate: number;
  };
  activity: Activity[];
  charts: {
    applicationsOverTime: TimeSeriesData[];
    topJobs: JobPerformance[];
    applicationsByStatus: StatusCount[];
  };
  tasks: Task[];
  insights: Insight[];
}
```

## User Interactions

### 1. View Detailed Stats
- Click on stat card → Navigate to detailed analytics page
- Hover over stat → Show tooltip with more info

### 2. Quick Actions
- Click action button → Navigate to relevant page
- Post Job → Opens job creation form

### 3. Activity Feed
- Click activity item → Navigate to related page
- View All → Navigate to full activity page

### 4. Chart Interactions
- Hover over data point → Show tooltip
- Click chart → Filter related data
- Change time period → Update chart

### 5. Task Management
- Check task → Mark as complete
- Click task → Navigate to related item

## Responsive Design

### Desktop (>1024px)
- 3-column stats grid
- Side-by-side charts
- Full activity feed

### Tablet (768px - 1024px)
- 2-column stats grid
- Stacked charts
- Condensed activity feed

### Mobile (<768px)
- 1-column stats grid
- Single column layout
- Collapsible sections
- Bottom navigation

## Loading States

### Initial Load
- Show skeleton loaders for all sections
- Load stats first (critical)
- Load charts second
- Load activity feed last

### Data Refresh
- Show loading indicator
- Maintain current data until new data loads
- Smooth transition

## Error Handling

### API Errors
- Show error message in affected section
- Retry button for failed requests
- Fallback to cached data if available

### Empty States
- No jobs: "Post your first job"
- No applications: "No applications yet"
- No activity: "No recent activity"

## Performance Considerations

### Optimization
- Cache dashboard data for 5 minutes
- Lazy load charts
- Paginate activity feed
- Debounce chart interactions

### Data Fetching
- Parallel API calls
- Use React Query for caching
- Background refresh every 5 minutes

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys for chart navigation

### Screen Readers
- ARIA labels for all metrics
- Live region for activity updates
- Descriptive chart titles

## Future Enhancements

1. **Customizable Dashboard**
   - Drag-and-drop widgets
   - Show/hide sections
   - Custom date ranges

2. **Real-time Updates**
   - WebSocket for live updates
   - Push notifications
   - Live activity feed

3. **Advanced Filtering**
   - Filter by job
   - Filter by date range
   - Filter by team member

4. **Export Functionality**
   - Export dashboard as PDF
   - Schedule email reports
   - Custom report builder


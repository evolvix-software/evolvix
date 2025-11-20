# 📋 Manage Jobs Page

## Overview

The Manage Jobs page allows employers to view, filter, search, and manage all their job postings in one centralized location.

## Route
```
/portal/employer/jobs/manage
```

## Page Layout

### Header Section
- Page title: "Manage Jobs"
- Total jobs count
- Quick action: "Post New Job" button
- View toggle: Grid/List view

### Filters & Search Bar
- Search input (full-text search)
- Filter dropdowns:
  - Status (All, Active, Draft, Closed, Expired)
  - Employment Type
  - Location
  - Date Posted
  - Assigned Recruiter
- Clear filters button
- Saved filters dropdown

### Job Listings Area

#### Grid View (Default)
- Card-based layout
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile

#### List View (Alternative)
- Table format
- Sortable columns
- Inline actions

## Components

### 1. Job Card
**Displays:**
- Job title
- Company logo/initials
- Status badge
- Location
- Employment type
- Applications count
- Views count
- Posted date
- Expiry date (if set)
- Quick actions menu

**Quick Actions:**
- View Details
- Edit Job
- Duplicate Job
- Pause/Resume
- Close Job
- View Applicants
- View Analytics
- Delete Job

**Interactions:**
- Click card → View job details
- Hover → Show actions
- Right-click → Context menu

### 2. Job Filters Panel
**Filter Options:**
- Status: Active, Draft, Closed, Expired, All
- Employment Type: Full-time, Part-time, Contract, Internship, Freelance
- Location: Search/Select location
- Date Posted: Last 7 days, 30 days, 90 days, Custom range
- Assigned Recruiter: Select from team
- Remote Type: Remote, Hybrid, Onsite
- Salary Range: Min-Max range

**Features:**
- Multiple filters active simultaneously
- Filter count badge
- Save filter preset
- Load saved filters
- Clear all filters

### 3. Search Bar
**Search Fields:**
- Job title
- Job description
- Skills
- Company name

**Features:**
- Real-time search
- Search suggestions
- Recent searches
- Advanced search modal
- Search history

### 4. Bulk Actions Toolbar
**Shows when:** Multiple jobs selected

**Actions:**
- Bulk Close
- Bulk Pause
- Bulk Delete
- Bulk Assign to Recruiter
- Bulk Promote
- Export Selected

**Selection:**
- Select all on page
- Select all (all pages)
- Clear selection

### 5. Sorting Options
**Sort By:**
- Date Posted (Newest/Oldest)
- Applications Count (High/Low)
- Views Count (High/Low)
- Expiry Date (Soonest/Latest)
- Job Title (A-Z/Z-A)

**Display:**
- Dropdown selector
- Visual sort indicators
- Remember user preference

## Data Structure

### Job Card Data
```typescript
interface JobCard {
  id: string;
  jobTitle: string;
  companyLogo?: string;
  status: 'active' | 'draft' | 'closed' | 'expired';
  location: string;
  employmentType: string;
  remoteType: 'remote' | 'hybrid' | 'onsite';
  applications: number;
  views: number;
  postedAt: Date;
  expiresAt?: Date;
  assignedRecruiter?: string;
  isPromoted: boolean;
}
```

## User Interactions

### 1. View Job Details
- Click job card
- Navigate to job details page
- Show full job information
- Quick actions available

### 2. Edit Job
- Click "Edit" action
- Navigate to edit form
- Pre-fill with current data
- Save changes

### 3. Duplicate Job
- Click "Duplicate" action
- Confirm duplication
- Create copy as draft
- Navigate to edit new job

### 4. Change Job Status
- Click status action (Pause/Close/Resume)
- Confirm action
- Update status
- Show success message
- Refresh list

### 5. Filter Jobs
- Select filter criteria
- Apply filters
- See filtered results
- Filter count badge
- Save filter preset

### 6. Search Jobs
- Type in search bar
- See real-time results
- Select from suggestions
- View search results
- Clear search

### 7. Bulk Actions
- Select multiple jobs
- Choose bulk action
- Confirm action
- Process all selected
- Show progress
- Display results

### 8. Sort Jobs
- Select sort option
- Choose order (asc/desc)
- Apply sorting
- Visual indicators
- Remember preference

## Status Management

### Job Statuses
- **Draft**: Not published, visible only to employer
- **Active**: Published and accepting applications
- **Paused**: Temporarily hidden from candidates
- **Closed**: No longer accepting applications
- **Expired**: Past expiration date

### Status Transitions
- Draft → Active (Publish)
- Active → Paused (Pause)
- Active → Closed (Close)
- Paused → Active (Resume)
- Closed → Active (Reopen, if not expired)

### Status Badges
- Color-coded badges
- Status-specific icons
- Hover tooltips
- Status change history

## Empty States

### No Jobs
- "No jobs posted yet" message
- "Post Your First Job" CTA
- Tips for getting started

### No Search Results
- "No jobs match your search" message
- Clear search button
- Search tips

### No Filter Results
- "No jobs match your filters" message
- Clear filters button
- Filter suggestions

## Responsive Design

### Desktop (>1024px)
- 3-column grid
- Full filters panel
- Side-by-side actions
- Hover effects

### Tablet (768px - 1024px)
- 2-column grid
- Collapsible filters
- Stacked actions
- Touch-optimized

### Mobile (<768px)
- 1-column list
- Bottom sheet filters
- Full-screen modals
- Swipe actions
- Bottom action bar

## Performance Optimization

### Pagination
- 20 jobs per page
- Infinite scroll option
- Page number navigation
- Load more button

### Virtual Scrolling
- Render only visible items
- Smooth scrolling
- Lazy load images

### Caching
- Cache job list data
- Cache filter results
- Cache search results
- Refresh on demand

## Real-time Updates

### Live Status Changes
- WebSocket updates
- Status change notifications
- Auto-refresh option
- Manual refresh button

## Accessibility

### Keyboard Navigation
- Tab through jobs
- Arrow keys to navigate
- Enter to select
- Escape to close modals

### Screen Readers
- Job card descriptions
- Status announcements
- Action descriptions
- Filter announcements

## Export Functionality

### Export Options
- Export to CSV
- Export to PDF
- Export selected jobs
- Export all jobs

### Export Data
- Job details
- Application counts
- View counts
- Status information
- Dates

## Future Enhancements

1. **Advanced Filtering**
   - Custom filter builder
   - Filter presets
   - Smart filters

2. **Job Templates**
   - Template library
   - Quick create from template
   - Template management

3. **Bulk Editing**
   - Edit multiple jobs at once
   - Bulk update fields
   - Batch operations

4. **Job Comparison**
   - Compare multiple jobs
   - Side-by-side view
   - Performance comparison

5. **Automation**
   - Auto-close expired jobs
   - Auto-pause low-performing jobs
   - Scheduled actions


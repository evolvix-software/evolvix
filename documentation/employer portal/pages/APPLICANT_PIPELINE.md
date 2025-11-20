# 👥 Applicant Pipeline Page

## Overview

The Applicant Pipeline page provides a Kanban board view for managing applicants through different stages of the hiring process.

## Route
```
/portal/employer/jobs/[jobId]/applicants
```

## Page Layout

### Header Section
- Job title and company
- Total applicants count
- Quick actions (Filter, Search, Bulk Actions)
- View toggle (Kanban/List)

### Main Content Area

#### Kanban Board View (Default)
**Stages:**
- New
- Reviewed
- Shortlisted
- Interviewed
- Offered
- Hired
- Rejected

**Features:**
- Drag and drop between stages
- Stage-specific actions
- Stage statistics
- Custom stages (optional)

#### List View (Alternative)
- Table format
- Sortable columns
- Bulk selection
- Inline actions

## Components

### 1. Pipeline Stage Column
**Displays:**
- Stage name
- Applicant count
- Applicant cards
- "Add" button (if custom stage)

**Interactions:**
- Drag applicants in/out
- Click stage header → Filter by stage
- Hover → Show stage actions

### 2. Applicant Card
**Displays:**
- Candidate photo/avatar
- Candidate name
- Match score (badge)
- Applied date
- Skills tags (top 3)
- Quick actions menu

**Quick Actions:**
- View Details
- Move to Stage
- Add Note
- Send Message
- Download Resume
- Reject

**Interactions:**
- Click card → Open details
- Drag → Move to stage
- Hover → Show actions
- Right-click → Context menu

### 3. Applicant Details Panel
**Side Panel (Desktop) / Modal (Mobile)**

**Sections:**
- Profile Overview
- Resume Viewer
- Application Details
- Notes & Comments
- Activity Timeline
- Actions

### 4. Filters Panel
**Filter Options:**
- Pipeline Stage
- Match Score Range
- Date Applied
- Assigned Recruiter
- Location
- Experience Level
- Skills
- Tags

**Features:**
- Multiple filters
- Saved filter presets
- Clear all filters
- Filter count badge

### 5. Search Bar
**Search Fields:**
- Candidate name
- Email
- Skills
- Notes content

**Features:**
- Real-time search
- Search suggestions
- Search history
- Advanced search

### 6. Bulk Actions Toolbar
**Actions:**
- Move to Stage
- Assign to Recruiter
- Send Message
- Add Tags
- Download Resumes
- Reject
- Export

**Shows when:**
- Multiple applicants selected
- Checkbox selection mode active

## Data Structure

### Applicant Card Data
```typescript
interface ApplicantCard {
  id: string;
  candidateId: string;
  candidateName: string;
  candidatePhoto?: string;
  matchScore: number;
  appliedAt: Date;
  currentStage: string;
  skills: string[];
  location?: string;
  experience?: string;
  assignedRecruiter?: string;
  tags: string[];
  hasUnreadNotes: boolean;
  lastActivityAt: Date;
}
```

### Pipeline Stage Data
```typescript
interface PipelineStage {
  id: string;
  name: string;
  order: number;
  applicantCount: number;
  isCustom: boolean;
  color: string;
}
```

## User Interactions

### 1. Move Applicant
**Drag & Drop:**
- Drag card to new stage
- Show drop indicator
- Confirm move (optional)
- Update stage

**Click Action:**
- Click "Move to Stage"
- Select stage from dropdown
- Add note (optional)
- Confirm move

### 2. View Applicant Details
- Click applicant card
- Open details panel/modal
- Load full applicant data
- Show all information

### 3. Filter Applicants
- Open filters panel
- Select filter criteria
- Apply filters
- See filtered results
- Save filter preset

### 4. Search Applicants
- Type in search bar
- See real-time results
- Select from suggestions
- View search results

### 5. Bulk Actions
- Select multiple applicants
- Choose bulk action
- Confirm action
- Process all selected
- Show progress
- Display results

### 6. Add Note
- Click "Add Note" on card
- Or open details → Notes tab
- Write note
- Choose visibility (Private/Team)
- Add tags
- @ Mention team members
- Save note

### 7. Send Message
- Click "Send Message"
- Opens messaging interface
- Pre-fills recipient
- Compose message
- Send

## Stage Management

### Default Stages
Cannot be deleted, can be reordered.

### Custom Stages
- Add custom stage
- Name stage
- Choose position
- Set color
- Delete custom stage (if empty)

### Stage Limits
- Set max applicants per stage
- Show warning when limit reached
- Prevent adding when full

## Analytics Per Stage

### Stage Metrics
- Total applicants
- Average time in stage
- Conversion rate to next stage
- Drop-off rate

### Visual Indicators
- Stage capacity (if limit set)
- Performance indicators
- Trend arrows

## Responsive Design

### Desktop (>1024px)
- Full Kanban board
- Side panel for details
- All columns visible
- Drag and drop enabled

### Tablet (768px - 1024px)
- Scrollable Kanban board
- Modal for details
- 4-5 columns visible
- Touch drag and drop

### Mobile (<768px)
- Single column list view
- Stack cards vertically
- Full-screen modal for details
- Swipe actions
- Bottom action bar

## Performance Optimization

### Virtual Scrolling
- Render only visible cards
- Load more on scroll
- Smooth scrolling

### Lazy Loading
- Load stage data on demand
- Load applicant details on open
- Cache frequently accessed data

### Debouncing
- Debounce search input
- Debounce filter changes
- Optimize drag operations

## Real-time Updates

### WebSocket Integration
- New application received
- Status change updates
- Note added notifications
- Message received alerts

### Polling (Fallback)
- Poll for updates every 30 seconds
- Show "New updates" indicator
- Refresh on demand

## Accessibility

### Keyboard Navigation
- Arrow keys to navigate cards
- Tab to move between stages
- Enter to open details
- Escape to close
- Space to select

### Screen Readers
- Announce stage changes
- Describe applicant cards
- Announce actions
- Provide context

### Drag and Drop Alternatives
- Keyboard shortcuts for moving
- Dropdown menu for stage selection
- Confirmation dialogs

## Empty States

### No Applicants
- "No applicants yet" message
- Link to job posting
- Tips for attracting candidates

### Empty Stage
- "No applicants in this stage"
- Drag applicants here hint
- Stage-specific tips

### No Search Results
- "No applicants match your search"
- Clear search button
- Search tips

## Error Handling

### API Errors
- Show error message
- Retry option
- Fallback to cached data
- Contact support

### Validation Errors
- Prevent invalid moves
- Show error message
- Suggest alternatives

## Future Enhancements

1. **Advanced Pipeline Views**
   - Timeline view
   - Calendar view
   - Gantt chart view

2. **Automation**
   - Auto-move based on rules
   - Auto-assign to recruiter
   - Auto-send messages

3. **Collaboration**
   - Real-time collaboration
   - Comments on cards
   - @ Mentions

4. **Analytics**
   - Stage performance metrics
   - Bottleneck identification
   - Predictive analytics

5. **Customization**
   - Custom card layouts
   - Custom fields
   - Custom workflows


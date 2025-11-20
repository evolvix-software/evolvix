# 👥 Mentors & Payroll Page

## Overview

The Mentors & Payroll page allows providers to manage mentors, assign them to courses and scholars, track mentorship sessions, monitor mentor performance, and manage payroll costs. It provides tools for mentor management and cost attribution to campaigns.

## Route

```
/portal/provider/mentors
/portal/provider/mentors/[mentorId]
/portal/provider/mentors/[mentorId]/sessions
/portal/provider/mentors/payroll
```

## Page Layout

### Header Section
- Page title: "Mentors & Payroll"
- Total mentors count
- Active mentors count
- Quick filters
- Add Mentor button

### Tabs
- Mentors
- Sessions
- Payroll
- Performance

## Components

### 1. Mentors Tab

#### Mentor List
**Displays:**
- Mentor photo and name
- Email and contact
- Assigned courses count
- Assigned scholars count
- Total sessions count
- Performance rating
- Status (Active, Inactive)
- Actions

**Filters:**
- Status filter
- Course filter
- Performance rating filter
- Search by name/email

**Sorting:**
- By name
- By performance rating
- By session count
- By assigned scholars

---

#### Mentor Card
**Displays:**
- Mentor photo
- Name and title
- Contact information
- Assigned courses (badges)
- Assigned scholars count
- Performance rating (stars)
- Total sessions
- Status badge

**Quick Actions:**
- View Profile
- Assign Scholars
- Assign Courses
- Log Session
- View Sessions
- Edit Mentor
- Deactivate Mentor

---

#### Mentor Profile Page

##### Overview Tab
**Displays:**
- Personal information
- Contact details
- Employment details
- Salary information
- Performance summary
- Quick stats

**Actions:**
- Edit Profile
- Assign Courses
- Assign Scholars
- View Sessions
- View Performance

---

##### Assigned Courses Tab
**Displays:**
- List of assigned courses
- Course details
- Scholar count per course
- Session count per course
- Performance per course

**Actions:**
- Assign New Course
- Remove Course Assignment
- View Course Details

---

##### Assigned Scholars Tab
**Displays:**
- List of assigned scholars
- Scholar progress
- Session history
- Performance metrics

**Actions:**
- Assign New Scholars
- Remove Scholar Assignment
- View Scholar Profile
- Log Session

---

##### Sessions Tab
**Displays:**
- Session history
- Upcoming sessions
- Session statistics
- Session calendar

**Actions:**
- Log New Session
- View Session Details
- Edit Session
- Delete Session

---

##### Performance Tab
**Displays:**
- Performance rating
- Session statistics
- Scholar feedback
- Improvement trends
- Performance metrics

**Metrics:**
- Average session rating
- Total sessions conducted
- Scholar satisfaction score
- Engagement score
- Impact on scholar progress

---

### 2. Sessions Tab

#### Session List
**Displays:**
- Session date and time
- Mentor name
- Scholar name(s)
- Course (if applicable)
- Session type
- Duration
- Topics covered
- Status
- Actions

**Filters:**
- Mentor filter
- Scholar filter
- Course filter
- Date range
- Session type

**Views:**
- List view
- Calendar view
- Timeline view

---

#### Log Session Form
**Fields:**
- Mentor* (dropdown)
- Scholar(s)* (multi-select)
- Course (optional dropdown)
- Session Date* (date picker)
- Session Time* (time picker)
- Duration* (minutes)
- Session Type* (One-on-one, Group, Workshop, Review)
- Topics Covered* (tags/multi-select)
- Notes* (textarea)
- Action Items (list)
- Scholar Feedback (optional)
- Mentor Rating (optional, 1-5)

**Validation:**
- All required fields
- Duration minimum (e.g., 15 minutes)
- Date cannot be in future
- Scholar must be assigned to mentor

**Features:**
- Auto-save draft
- Session templates
- Recurring session option
- Calendar integration

---

#### Session Details Modal
**Displays:**
- Session information
- Participants
- Topics covered
- Notes
- Action items
- Feedback
- Related sessions

**Actions:**
- Edit Session
- Delete Session
- Add Follow-up
- Schedule Next Session

---

### 3. Payroll Tab

#### Payroll Summary
**Displays:**
- Total payroll cost
- Monthly payroll
- Per-mentor costs
- Cost by course
- Cost by campaign
- Payroll trends

**Visualizations:**
- Payroll breakdown chart
- Cost by course chart
- Cost by campaign chart
- Trend line chart

---

#### Mentor Payroll Details
**Displays:**
- Mentor name
- Monthly salary
- Payment frequency
- Total paid (period)
- Sessions conducted
- Cost per session
- Cost per scholar

**Actions:**
- View Payment History
- Generate Payslip
- Update Salary
- View Reports

---

#### Payroll Attribution
**Purpose:** Attribute mentor costs to campaigns

**Displays:**
- Campaign name
- Assigned mentors
- Mentor costs
- Total campaign cost
- Cost per scholar
- ROI impact

**Features:**
- Auto-calculate attribution
- Manual adjustment
- Export attribution report
- Cost analysis

---

### 4. Performance Tab

#### Mentor Performance Dashboard
**Metrics:**
- Average performance rating
- Total sessions
- Scholar satisfaction
- Engagement score
- Impact score

**Visualizations:**
- Performance distribution
- Rating trends
- Session trends
- Impact metrics

---

#### Performance Comparison
**Features:**
- Compare mentors
- Performance rankings
- Best performers
- Improvement opportunities

---

## Data Requirements

### API Endpoints
- `GET /api/provider/mentors`
- `GET /api/provider/mentors/:mentorId`
- `POST /api/provider/mentors`
- `PUT /api/provider/mentors/:mentorId`
- `GET /api/provider/mentors/:mentorId/sessions`
- `POST /api/provider/mentors/:mentorId/sessions`
- `GET /api/provider/mentors/payroll`
- `GET /api/provider/mentors/performance`

### Data Structure
```typescript
interface Mentor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  salaryInfo: {
    monthlySalary: number;
    currency: string;
    paymentFrequency: 'monthly' | 'bi-weekly';
  };
  assignedCourses: string[];
  assignedScholars: string[];
  performanceRating?: number;
  totalSessions: number;
  activeSessions: number;
  status: 'active' | 'inactive';
}

interface MentorSession {
  id: string;
  mentorId: string;
  scholarId: string;
  courseId?: string;
  sessionDate: Date;
  duration: number;
  sessionType: 'one-on-one' | 'group' | 'workshop' | 'review';
  topics: string[];
  notes: string;
  actionItems: string[];
  scholarFeedback?: string;
  mentorRating?: number;
}
```

## User Interactions

### 1. Manage Mentors
- Add mentor → Fill form
- Assign courses → Select courses
- Assign scholars → Select scholars
- View performance → Check metrics

### 2. Log Sessions
- Click "Log Session" → Open form
- Fill session details → Add notes
- Save session → Update statistics
- View session → Check details

### 3. Track Performance
- View performance dashboard
- Compare mentors
- Identify top performers
- Plan improvements

### 4. Manage Payroll
- View payroll summary
- Check mentor costs
- Attribute to campaigns
- Generate reports

## Responsive Design

### Desktop (>1024px)
- Multi-column layout
- Side-by-side details
- Full feature set
- Data tables

### Tablet (768px - 1024px)
- 2-column layout
- Stacked details
- Touch-optimized
- Responsive tables

### Mobile (<768px)
- Single column
- Card-based layout
- Bottom navigation
- Simplified forms

## Loading States

### Initial Load
- Skeleton loaders
- Progressive loading
- Smooth transitions

### Session Logging
- Loading indicator
- Save confirmation
- Success message

## Error Handling

### Validation Errors
- Inline validation
- Error messages
- Prevent submission
- Guidance text

### API Errors
- Error notifications
- Retry buttons
- Fallback data
- Support contact

## Performance Considerations

### Optimization
- Paginate lists
- Lazy load details
- Cache mentor data
- Debounce search

### Data Fetching
- Parallel API calls
- React Query caching
- Background refresh
- Manual refresh

## Accessibility

### Keyboard Navigation
- Tab through forms
- Enter to submit
- Escape to cancel
- Arrow keys for navigation

### Screen Readers
- ARIA labels
- Status announcements
- Form validation announcements
- Rating announcements

## Future Enhancements

1. **Session Scheduling**
   - Calendar integration
   - Automated scheduling
   - Reminder notifications
   - Recurring sessions

2. **Performance Analytics**
   - Advanced metrics
   - Predictive analytics
   - Performance forecasting
   - Improvement recommendations

3. **Mentor Matching**
   - AI-powered matching
   - Skill-based matching
   - Compatibility scoring
   - Auto-assignment

4. **Communication Tools**
   - In-app messaging
   - Video call integration
   - Session recording
   - Feedback forms

5. **Payroll Automation**
   - Automated payroll
   - Payment processing
   - Payslip generation
   - Tax calculations


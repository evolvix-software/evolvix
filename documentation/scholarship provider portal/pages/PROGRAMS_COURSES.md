# 📚 Programs & Courses Page

## Overview

The Programs & Courses page allows providers to view courses (bootcamps) created by mentors, see which courses have scholarship slots, track course progress, and manage program associations. It provides visibility into the educational programs that scholarships support.

## Route

```
/portal/provider/programs
/portal/provider/programs/[courseId]
```

## Page Layout

### Header Section
- Page title: "Programs & Courses"
- Total courses count
- Quick filters (With Scholarships, Upcoming, Live, Completed)
- Search bar

### Filters & Search
- Search bar (course title, mentor name)
- Filter dropdowns:
  - Course Status (Upcoming, Live, Completed)
  - Scholarship Availability (With Slots, Without Slots, All)
  - Mentor
  - Duration
  - Mode (Recorded, Live, Hybrid)
- Clear filters button

### Course List/Grid
- Grid view (default) or List view
- Course cards with key information
- Sortable columns
- Bulk selection

## Components

### 1. Course Card

**Displays:**
- Course thumbnail/image
- Course title
- Mentor name(s) and photo(s)
- Course mode badge (Recorded, Live, Hybrid)
- Duration (weeks)
- Start date / End date
- Scholarship slots badge (if available)
- Enrolled students count
- Applied-for-scholarships count
- Course progress summary (avg completion %)
- Status badge (Upcoming, Live, Completed)

**Quick Actions:**
- View Details
- View Scholarships
- View Students
- View Progress
- Link Campaign

**Interactions:**
- Click card → Open course details
- Hover → Show quick actions
- Right-click → Context menu

---

### 2. Course Details Page

#### Overview Tab
**Displays:**
- Course title and description
- Course thumbnail/banner
- Mentor information (name, photo, bio)
- Course metadata:
  - Mode (Recorded, Live, Hybrid)
  - Duration (weeks)
  - Start date / End date
  - Tuition/fee amount
  - Language
  - Level (Beginner, Intermediate, Advanced)
- Course status badge
- Quick stats:
  - Total enrolled students
  - Scholarship slots available
  - Applications received
  - Average completion rate

**Actions:**
- Link Scholarship Campaign
- View Students
- View Progress
- View Analytics

---

#### Syllabus Tab
**Displays:**
- Course syllabus/curriculum
- Module breakdown
- Learning objectives
- Prerequisites
- Course outline
- Topics covered

**Features:**
- Expandable modules
- Progress indicators
- Estimated time per module
- Resource links

---

#### Schedule Tab
**Displays:**
- Live session schedule (if applicable)
- Session dates and times
- Session topics
- Recording links (if recorded)
- Attendance tracking

**Features:**
- Calendar view
- List view
- Filter by date
- Export schedule

---

#### Scholarship Slots Tab
**Displays:**
- Scholarship slots available
- Linked campaigns
- Applications received
- Awards made
- Slots remaining

**Campaign Links:**
- List of linked campaigns
- Campaign details
- Application count per campaign
- Award count per campaign

**Actions:**
- Link New Campaign
- Unlink Campaign
- View Applications
- View Awarded Scholars

---

#### Students Tab
**Displays:**
- Enrolled students list
- Student progress
- Completion status
- Grades
- Engagement metrics

**Filters:**
- By progress
- By status
- By scholarship status
- Search students

**Actions:**
- View Student Profile
- View Progress
- Send Message
- Export List

---

#### Progress Tab
**Displays:**
- Overall course progress
- Average completion rate
- Module completion rates
- Assignment completion rates
- Video watch percentages
- Session attendance rates

**Visualizations:**
- Progress chart
- Completion funnel
- Module heatmap
- Engagement trends

**Metrics:**
- Average progress %
- Completion rate
- Dropout rate
- Average grade
- Engagement score

---

#### Analytics Tab
**Metrics:**
- Enrollment trends
- Completion trends
- Engagement trends
- Performance trends
- Scholarship impact

**Visualizations:**
- Enrollment chart
- Completion chart
- Engagement chart
- Performance distribution
- Scholarship vs non-scholarship comparison

---

### 3. Course List View

#### Grid View (Default)
**Layout:**
- 3-column grid (desktop)
- 2-column grid (tablet)
- 1-column grid (mobile)
- Course cards with images
- Hover effects
- Quick action overlays

#### List View
**Layout:**
- Table format
- Sortable columns
- Expandable rows
- Inline actions

**Columns:**
- Course Name
- Mentor(s)
- Mode
- Duration
- Start Date
- Scholarship Slots
- Enrolled Students
- Progress %
- Status
- Actions

---

### 4. Scholarship Slots Widget

**Purpose:** Quick view of scholarship availability

**Displays:**
- Total scholarship slots
- Slots available
- Slots awarded
- Slots reserved
- Linked campaigns count

**Visual Design:**
- Progress bar
- Color-coded sections
- Quick link to campaigns

---

### 5. Course Progress Summary

**Displays:**
- Average completion percentage
- Students by progress range:
  - 0-25% (Just Started)
  - 25-50% (In Progress)
  - 50-75% (Almost Done)
  - 75-100% (Near Completion)
  - 100% (Completed)
- Completion rate
- Average grade
- Engagement score

**Visualizations:**
- Progress distribution chart
- Completion funnel
- Progress over time

---

## Data Requirements

### API Endpoints
- `GET /api/provider/programs/courses`
- `GET /api/provider/programs/courses/:courseId`
- `GET /api/provider/programs/courses/:courseId/scholarships`
- `GET /api/provider/programs/courses/:courseId/students`
- `GET /api/provider/programs/courses/:courseId/progress`
- `GET /api/provider/programs/courses/:courseId/analytics`

### Data Structure
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  mentorIds: string[];
  mode: 'recorded' | 'live' | 'hybrid';
  durationWeeks: number;
  startDate: Date;
  endDate: Date;
  tuitionFee: number;
  syllabus: SyllabusModule[];
  liveSessions?: LiveSession[];
  recordings?: Recording[];
  scholarshipSlots: {
    total: number;
    available: number;
    awarded: number;
    reserved: number;
  };
  enrolledStudents: number;
  appliedForScholarships: number;
  averageCompletionRate: number;
  status: 'upcoming' | 'live' | 'completed';
}

interface SyllabusModule {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number;
  topics: string[];
  resources: Resource[];
}
```

## User Interactions

### 1. Browse Courses
- View course list → Filter and search
- Click course → View details
- Navigate tabs → Explore different aspects
- Link campaign → Associate scholarship campaign

### 2. View Scholarship Slots
- Navigate to Scholarship Slots tab
- View linked campaigns
- Check slot availability
- View applications and awards

### 3. Monitor Progress
- View course progress → Check completion rates
- View student progress → Track individual progress
- View analytics → Analyze trends
- Export data → Download reports

### 4. Link Campaigns
- Click "Link Campaign" → Select campaign
- Associate campaign → Link to course
- View linked campaigns → Manage associations
- Unlink campaign → Remove association

## Responsive Design

### Desktop (>1024px)
- 3-column grid for courses
- Side-by-side details
- Full feature set
- Data tables

### Tablet (768px - 1024px)
- 2-column grid
- Stacked details
- Touch-optimized
- Responsive tables

### Mobile (<768px)
- 1-column layout
- Card-based details
- Bottom navigation
- Simplified interface

## Loading States

### Initial Load
- Skeleton loaders for course cards
- Progressive loading
- Smooth transitions

### Course Details
- Loading spinner
- Skeleton content
- Progressive reveal

## Error Handling

### API Errors
- Show error message
- Retry button
- Fallback to cached data
- Contact support link

### Empty States
- No courses: "No courses available"
- No scholarships: "No scholarship slots"
- No students: "No enrolled students"

## Performance Considerations

### Optimization
- Paginate course list
- Lazy load course details
- Cache course data
- Debounce search

### Data Fetching
- Parallel API calls
- React Query for caching
- Background refresh
- Manual refresh button

## Accessibility

### Keyboard Navigation
- Tab through courses
- Enter to open
- Escape to close
- Arrow keys for navigation

### Screen Readers
- ARIA labels for courses
- Status announcements
- Progress announcements
- Link announcements

## Future Enhancements

1. **Course Recommendations**
   - AI-powered recommendations
   - Similar courses
   - Popular courses
   - Trending courses

2. **Advanced Filtering**
   - Custom filter builder
   - Saved filters
   - Smart filters
   - Filter presets

3. **Course Comparison**
   - Compare multiple courses
   - Side-by-side comparison
   - Feature comparison
   - Performance comparison

4. **Integration**
   - LMS integration
   - Course platform integration
   - Student information system
   - Learning analytics

5. **Course Analytics**
   - Advanced analytics
   - Predictive analytics
   - Performance forecasting
   - Success prediction


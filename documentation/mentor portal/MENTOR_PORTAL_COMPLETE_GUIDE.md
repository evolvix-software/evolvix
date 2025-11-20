# Evolvix Platform - Mentor Portal Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Course Types & Mentor Responsibilities](#course-types--mentor-responsibilities)
   - [2.1 Course Type Overview](#21-course-type-overview)
   - [2.2 Course Creation Requirements](#22-course-creation-requirements)
   - [2.3 Feature Management by Course Type](#23-feature-management-by-course-type)
   - [2.4 Mentor Portal Access Control](#24-mentor-portal-access-control)
   - [2.5 Course Duration & Time Limits Management](#25-course-duration--time-limits-management)
   - [2.6 Free Courses Management](#26-free-courses-management)
   - [2.7 Compensation & Payment](#27-compensation--payment)
3. [Mentor Portal Features](#mentor-portal-features)
   - [3.1 Sidebar Menu](#31-sidebar-menu)
   - [3.2 Dashboard](#32-dashboard)
   - [3.3 Course Management](#33-course-management)
   - [3.4 Vacancy System](#34-vacancy-system)
   - [3.5 Live Classes Management](#35-live-classes-management)
   - [3.6 Recorded Content Management](#36-recorded-content-management)
   - [3.7 Student Management](#37-student-management)
   - [3.8 Assignments & Projects](#38-assignments--projects)
   - [3.9 Module Tests](#39-module-tests)
   - [3.10 Hackathons Management](#310-hackathons-management)
   - [3.11 Scholarships Management](#311-scholarships-management)
   - [3.12 Interview Management](#312-interview-management)
   - [3.13 Communication](#313-communication)
   - [3.14 Analytics & Reports](#314-analytics--reports)
   - [3.15 Calendar](#315-calendar)
   - [3.16 Settings](#316-settings)
4. [Course Type Specific Features](#course-type-specific-features)
5. [Best Practices & Guidelines](#best-practices--guidelines)
6. [Data Structure Overview](#data-structure-overview)

---

## Overview

The Evolvix Mentor Portal provides comprehensive tools for mentors to create, manage, and deliver courses across different course types. This guide details all features, responsibilities, and course type-specific requirements for mentors.

### Key Concepts
- **Mentors** create and manage courses, teach students, provide feedback, and track teaching analytics
- **Course Types** determine available features, compensation model, and creation process
- **Access Control** varies based on course type and delivery method (live vs recorded)
- **Premium Features** (Hackathons, Scholarships, Interviews) are exclusive to Full Career Bootcamp courses

---

## Course Types & Mentor Responsibilities

### 2.1 Course Type Overview

Mentors can create three main course types with distinct characteristics:

| Course Type | Category Restrictions | Duration | Compensation | Creation Process |
|------------|---------------------|----------|--------------|------------------|
| **Crash Course** | Any category worldwide | 2-10 hours | Commission-based | Direct creation |
| **Skill Course** | Any category worldwide | 4-20 hours | Commission-based | Direct creation |
| **Full Career Bootcamp** | IT category only | 2-6 months (80-400 hours) | Salary-based | Via Vacancy System |

**Key Points:**
- All course types support **both live and recorded** delivery methods
- Mentors can create **mixed delivery** courses (some modules live, some recorded)
- Course type determines which features are available in the mentor portal
- Full Career Bootcamp requires vacancy application and admin approval

---

### 2.2 Course Creation Requirements

#### Crash Course & Skill Course Creation
- **Direct Creation**: No vacancy system required
- **Category**: Any category worldwide
- **Pricing**: Free or Paid (mentor sets price)
- **Duration**: 
  - Crash Course: 2-10 hours (must complete within 1-2 weeks)
  - Skill Course: 4-20 hours (must complete within 1-4 weeks)
- **Time Limits**: Mentors must set time limits for student access
- **Compensation**: Commission-based (percentage of course sales)

#### Full Career Bootcamp Creation
- **Vacancy Required**: Must apply through vacancy system
- **Category**: IT category only (all IT levels)
- **Pricing**: Admin-controlled pricing
- **Duration**: 2-6 months (80-400 hours)
- **No Time Limits**: Students have full access throughout course duration
- **Compensation**: Salary-based (fixed monthly salary)
- **Requirements**:
  - Submit qualifications and certifications
  - Upload demo class video
  - Provide portfolio/experience
  - Pass admin verification
  - Sign employment contract

#### Free Courses
- **Course Types**: Crash Course or Skill Course only
- **Duration**: 30 minutes to 2 hours
- **Delivery Method**: Recorded only (cannot be live)
- **Category**: Any category worldwide
- **Purpose**: Attract students, showcase expertise, build reputation
- **Limitations**: No premium features (hackathons, scholarships, interviews)

---

### 2.3 Feature Management by Course Type

#### Full Career Bootcamp - Premium Features

Mentors teaching Full Career Bootcamp courses have access to premium features:

| Feature | Full Career Bootcamp | Crash/Skill Courses |
|---------|---------------------|---------------------|
| **Hackathons Management** | ✅ Available | ❌ Not Available |
| **Scholarships Management** | ✅ Available | ❌ Not Available |
| **AI Mock Interview** | ✅ Available | ❌ Not Available |
| **Manual Interview** | ✅ Available | ❌ Not Available |
| **Student Portal Access** | Premium features visible | Standard features only |

**Mentor Portal Access:**
- ✅ Can create and manage hackathons
- ✅ Can review scholarship applications
- ✅ Can conduct AI mock interviews
- ✅ Can conduct manual interviews
- ✅ Can access interview preparation tools

#### Crash Course & Skill Course - Standard Features

Mentors teaching Crash/Skill courses have access to standard features:
- ✅ Course creation and management
- ✅ Live classes scheduling
- ✅ Recorded content upload
- ✅ Assignments creation
- ✅ Module tests creation
- ✅ Student management
- ✅ Analytics and reports
- ❌ No hackathons, scholarships, or interview features

---

### 2.4 Mentor Portal Access Control

#### Course Type-Based Feature Visibility

**For Full Career Bootcamp Mentors:**
- ✅ **Hackathons** menu item visible in sidebar
- ✅ **Scholarships** menu item visible in sidebar
- ✅ **Interview Management** menu item visible in sidebar
- ✅ All premium features accessible

**For Crash/Skill Course Mentors:**
- ❌ **Hackathons** menu item hidden
- ❌ **Scholarships** menu item hidden
- ❌ **Interview Management** menu item hidden
- ✅ Standard features accessible

#### Delivery Method-Based Content Management

**Live Course Management:**
- ✅ Can schedule live classes
- ✅ Can manage live class recordings
- ✅ Can track live class attendance
- ❌ Cannot upload standalone recorded videos (only live class recordings)

**Recorded Course Management:**
- ✅ Can upload recorded video lessons
- ✅ Can organize recorded content into modules
- ✅ Can manage video timestamps and chapters
- ❌ Cannot schedule live classes (unless mixed delivery)

**Mixed Delivery Course Management:**
- ✅ Can schedule live classes for specific modules
- ✅ Can upload recorded content for other modules
- ✅ Can configure per-module delivery method
- ✅ Full access to both live and recorded management tools

---

### 2.5 Course Duration & Time Limits Management

#### Full Career Bootcamp
- **Duration Setting**: 2-6 months (80-400 hours)
- **No Time Limits**: Students have full access throughout course duration
- **Mentor Responsibilities**:
  - Set course start and end dates
  - Plan curriculum for entire duration
  - Schedule regular live sessions (if applicable)
  - Provide ongoing support throughout course

#### Crash Course
- **Duration Setting**: 2-10 hours total content
- **Time Limits**: Must set student access expiration (1-2 weeks from enrollment)
- **Mentor Responsibilities**:
  - Set time limit during course creation
  - Ensure content can be completed within time limit
  - Provide clear completion timeline
  - Send reminders as deadline approaches

#### Skill Course
- **Duration Setting**: 4-20 hours total content
- **Time Limits**: Must set student access expiration (1-4 weeks from enrollment)
- **Mentor Responsibilities**:
  - Set time limit during course creation
  - Organize content into manageable modules
  - Provide progress tracking
  - Support students within time limit

**Time Limit Configuration:**
- Set during course creation
- Cannot be changed after course is published (without admin approval)
- Students receive automatic reminders
- Mentors can grant extensions on case-by-case basis

---

### 2.6 Free Courses Management

#### Creating Free Courses
- **Course Type**: Crash Course or Skill Course only
- **Duration**: 30 minutes to 2 hours
- **Delivery Method**: Recorded only
- **Category**: Any category worldwide
- **Pricing**: Set to $0 (Free)

#### Free Course Best Practices
- Keep content concise and focused
- Provide value in short timeframe
- Include clear call-to-action for paid courses
- Showcase teaching style and expertise
- Build mentor reputation and trust

#### Free Course Limitations
- ❌ Cannot be Full Career Bootcamp
- ❌ Cannot be live courses
- ❌ No premium features
- ❌ No hackathons, scholarships, or interviews
- ✅ Standard features available (assignments, tests, etc.)

---

### 2.7 Compensation & Payment

#### Salary-Based Compensation (Full Career Bootcamp)

**Payment Structure:**
- Fixed monthly salary (set by admin)
- Performance-based bonuses possible
- Regular monthly payments
- Contract duration: 2-6 months (matches course duration)

**Payment Tracking:**
- View salary history in Settings → Financial
- Track performance bonuses
- View contract details
- Access payment statements

#### Commission-Based Compensation (Crash/Skill Courses)

**Payment Structure:**
- Percentage of course sales (set by platform)
- Paid after student enrollment
- Earnings vary based on enrollment numbers
- No fixed salary

**Payment Tracking:**
- View earnings per course in Analytics
- Track total revenue
- View commission breakdown
- Access payment history

**Payment Methods:**
- Bank transfer
- Digital wallet
- Payment schedule: Monthly or per-enrollment (configurable)

---

## Mentor Portal Features

### 3.1 Sidebar Menu

The mentor sidebar is organized into categories for better navigation.

#### Overview Category
| Menu Item | Path | Description | Badge |
|-----------|------|-------------|-------|
| **Dashboard** | `/portal/mentor` | Overview & Stats | Live |

#### Teaching Category
| Menu Item | Path | Description | Access Control |
|-----------|------|-------------|----------------|
| **My Courses** | `/portal/mentor/courses` | Create & Manage | All mentors |
| **Course Vacancies** | `/portal/mentor/vacancies` | Apply for Bootcamp | All mentors |
| **Classes** | `/portal/mentor/classes` | Schedule & Manage | All mentors |
| **Module Tests** | `/portal/mentor/tests` | Create & Manage Tests | All mentors |

#### Students Category
| Menu Item | Path | Description | Badge | Access Control |
|-----------|------|-------------|-------|----------------|
| **Student Management** | `/portal/mentor/students` | Students & Feedback | Count | All mentors |
| **Assignments** | `/portal/mentor/assignments` | Review Submissions | Count | All mentors |

#### Premium Features Category (Full Career Bootcamp Only)
| Menu Item | Path | Description | Access Control |
|-----------|------|-------------|----------------|
| **Hackathons** | `/portal/mentor/hackathons` | Create & Manage | Bootcamp mentors only |
| **Scholarships** | `/portal/mentor/scholarships` | Review Applications | Bootcamp mentors only |
| **Interviews** | `/portal/mentor/interviews` | Conduct Interviews | Bootcamp mentors only |

#### Communication Category
| Menu Item | Path | Description | Badge | Access Control |
|-----------|------|-------------|-------|----------------|
| **Messages** | `/portal/mentor/messages` | Unified Inbox | Count | All mentors |
| **Announcements** | `/portal/mentor/announcements` | Course Updates | - | All mentors |

#### Analytics & Tools Category
| Menu Item | Path | Description | Access Control |
|-----------|------|-------------|----------------|
| **Analytics** | `/portal/mentor/analytics` | Reports & Metrics | All mentors |
| **Calendar** | `/portal/mentor/calendar` | Schedule & Events | All mentors |

#### Settings Category
| Menu Item | Path | Description | Access Control |
|-----------|------|-------------|----------------|
| **Settings** | `/portal/mentor/settings` | Preferences | All mentors |

**Note:** Premium Features Category (Hackathons, Scholarships, Interviews) is only visible to mentors teaching Full Career Bootcamp courses.

---

### 3.2 Dashboard

**Purpose**: Overview of mentor's teaching activity and performance

**Access**: `/portal/mentor`

**Content / Data:**

1. **Welcome Header**
   - Mentor name and profile picture
   - Reputation score
   - Total students taught
   - Total courses created
   - Account type indicator (Salary-based / Commission-based)

2. **Key Metrics Cards**
   - **Total Students Enrolled**: Across all courses
   - **Active Courses**: Currently published courses
   - **Upcoming Live Classes**: Next scheduled sessions
   - **Pending Assignments**: Awaiting review
   - **Total Revenue / Earnings**: 
     - Commission-based: Total earnings from course sales
     - Salary-based: Monthly salary and bonuses
   - **Average Course Rating**: Overall rating across all courses

3. **Quick Actions**
   - **Create New Course**: Quick access to course creation
   - **Schedule Live Class**: For courses with live components
   - **Review Assignments**: Direct link to pending reviews
   - **Send Announcement**: Broadcast to students
   - **Upload Recorded Content**: For recorded courses

4. **Performance Insights**
   - **Student Progress Chart**: Overall completion rates
   - **Course Completion Rates**: Per-course breakdown
   - **Revenue Trends**: Earnings over time (commission-based mentors)
   - **Rating Trends**: Course ratings over time
   - **Enrollment Trends**: New enrollments per month

5. **Upcoming Sessions**
   - Next live classes with date/time
   - Scheduled office hours
   - Upcoming assignment deadlines
   - Test dates

6. **Notifications Feed**
   - New student enrollments
   - Assignment submissions
   - Student questions/messages
   - Course verification status (for Bootcamp)
   - Scholarship applications (Bootcamp mentors only)
   - Hackathon registrations (Bootcamp mentors only)

7. **Recent Activity**
   - Last course created
   - Recent student enrollments
   - Latest assignment reviews
   - Recent announcements sent

**Course Type Indicators:**
- Shows breakdown by course type (Crash Course, Skill Course, Bootcamp)
- Displays which courses have premium features enabled
- Highlights courses requiring attention

---

### 3.3 Course Management

**Purpose**: Create, edit, and manage courses

**Access**: `/portal/mentor/courses`

**Content / Data:**

1. **My Courses List**
   - Course cards displaying:
     - Course thumbnail
     - Course title and type badge
     - Enrollment count
     - Revenue generated (commission-based) or status (salary-based)
     - Average rating
     - Status (Draft / Pending / Published / Rejected)
     - Delivery method indicator (Live / Recorded / Mixed)
     - Quick actions (Edit / Delete / Duplicate / Analytics / View Students)

2. **Create Course Form**

   **Step 1: Course Type Selection**
   - **Crash Course**: 
     - Any category, 2-10 hours, commission-based
     - Direct creation (no vacancy required)
   - **Skill Course**: 
     - Any category, 4-20 hours, commission-based
     - Direct creation (no vacancy required)
   - **Full Career Bootcamp**: 
     - IT category only, 2-6 months, salary-based
     - Requires vacancy application (redirects to Vacancies page)

   **Step 2: Delivery Method Selection**
   - **Live**: Scheduled sessions with real-time interaction
   - **Recorded**: Self-paced with pre-recorded content
   - **Mixed**: Combination of both (configure per module)

   **Step 3: Basic Information**
   - Course title
   - Short description (for course cards)
   - Full description (for course detail page)
   - Category selection:
     - Crash/Skill: Any category worldwide
     - Bootcamp: IT category only (all levels)
   - Level selection (Beginner / Intermediate / Advanced)
   - Skills/tags
   - Course thumbnail/image upload
   - Language

   **Step 4: Pricing & Duration**
   - **Pricing**:
     - Free: $0 (30 min - 2 hours, recorded only, Crash/Skill only)
     - Paid: Set course price
     - Installment options: Enable 3 or 4 installment payments
   - **Duration**:
     - Crash Course: 2-10 hours (set time limit: 1-2 weeks)
     - Skill Course: 4-20 hours (set time limit: 1-4 weeks)
     - Bootcamp: 2-6 months (no time limit)
   - **Time Limit Configuration** (Crash/Skill only):
     - Set access expiration period
     - Enable/disable extensions
     - Set reminder schedule

   **Step 5: Syllabus Builder**
   - Add modules
   - Add lessons within modules
   - For Live courses: Schedule live sessions
   - For Recorded courses: Upload video files
   - For Mixed courses: Configure per-module delivery method
   - Add video timestamps/chapters
   - Set lesson prerequisites
   - Add downloadable resources
   - Set estimated time per lesson

   **Step 6: Course Settings**
   - Enrollment limits (max students)
   - Certificate configuration:
     - Auto-generate on completion
     - Completion percentage required (80-90%)
     - Certificate template selection
   - Badge system:
     - Create achievement badges
     - Set badge criteria
   - Co-instructors (add other mentors)
   - Teaching assistants
   - Course visibility (Public / Private / Invite-only)
   - Enable/disable student discussions
   - Enable/disable Q&A section

3. **Course Detail Page**
   - Full course information
   - Student list with progress
   - Performance analytics
   - Revenue tracking (commission-based)
   - Edit course content
   - Course settings
   - Module/lesson management
   - Student enrollment management

4. **Course Analytics** (per course)
   - Enrollment trends over time
   - Student progress tracking
   - Completion rates
   - Revenue breakdown (commission-based)
   - Student feedback and ratings
   - Popular content identification
   - Drop-off points analysis

**Course Type Restrictions:**
- Full Career Bootcamp: Must apply through vacancy system first
- Free courses: Limited to Crash/Skill, 30 min - 2 hours, recorded only
- Category restrictions enforced based on course type

---

### 3.4 Vacancy System

**Purpose**: Apply for Full Career Bootcamp course vacancies

**Access**: `/portal/mentor/vacancies`

**Content / Data:**

1. **Available Vacancies List**
   - Vacancy cards displaying:
     - Vacancy title
     - Course type: Full Career Bootcamp
     - Category: IT (specific subcategory)
     - Duration: 2-6 months
     - Requirements list
     - Application deadline
     - Commission split (Evolvix % / Mentor %)
     - Admin-set pricing
     - Status (Open / Closed / Filled)
     - Apply button

2. **Vacancy Filters**
   - Filter by category (Development, Data Science, Cybersecurity, etc.)
   - Filter by duration (2 months, 4 months, 6 months)
   - Filter by status
   - Sort by deadline, category, duration

3. **Application Form**
   - **Personal Information**:
     - Name, email, phone
     - Current position
     - Years of experience
   - **Qualifications**:
     - Education background
     - Certifications upload
     - Professional licenses
   - **Portfolio**:
     - Portfolio website link
     - GitHub profile
     - Previous work samples
   - **Demo Class Video** (Required):
     - Upload demo class recording
     - 15-30 minutes recommended
     - Showcase teaching style
   - **Teaching Experience**:
     - Previous teaching experience
     - Student testimonials
     - Course ratings (if applicable)
   - **Cover Letter**:
     - Why you're suitable for this vacancy
     - Your teaching philosophy
     - Course vision

4. **Application Status Tracking**
   - **Pending**: Under admin review
   - **Accepted**: Application approved, can create course
   - **Rejected**: Application declined (with feedback)
   - **Verified**: Course created and verified by admin
   - Application date and review date
   - Admin feedback and notes

5. **Application History**
   - View all past applications
   - Track application status
   - View admin feedback
   - Reapply if rejected (with improvements)

**Application Process:**
1. Browse available vacancies
2. Review requirements and commission split
3. Submit application with required documents
4. Wait for admin review (typically 3-7 days)
5. If accepted: Create course linked to vacancy
6. Submit course for admin verification
7. Sign contract after verification
8. Course published and visible to students

---

### 3.5 Live Classes Management

**Purpose**: Schedule and manage live teaching sessions

**Access**: `/portal/mentor/classes`

**Content / Data:**

1. **Live Classes List**
   - Upcoming classes
   - Past classes
   - Class details:
     - Class title
     - Course name
     - Date and time
     - Duration
     - Student count (enrolled)
     - Status (Scheduled / Live / Completed / Cancelled)

2. **Create Live Class**
   - **Class Information**:
     - Class title
     - Course selection (only courses with live delivery)
     - Date and time picker
     - Duration
     - Max students limit
     - Description/agenda
   - **Recording Options**:
     - Enable/disable recording
     - Auto-record option
     - Make recording available to students
   - **Settings**:
     - Enable chat/Q&A
     - Enable screen sharing
     - Enable polls
     - Enable breakout rooms

3. **Live Class Interface** (when hosting)
   - Video conferencing integration (Jitsi / Zoom)
   - Student list with attendance tracking
   - Chat/Q&A moderation panel
   - Screen sharing controls
   - Polls creation and management
   - Recording controls
   - Raise hand feature
   - End class button
   - Attendance auto-marking

4. **Class Recordings Management**
   - Upload recordings manually
   - Automatic recording list (if enabled)
   - Recording details:
     - Recording date/time
     - Duration
     - File size
     - View count
   - Make available/unavailable to students
   - Edit recording title/description
   - Delete recordings
   - Download recordings

5. **Attendance Tracking**
   - Student attendance list per class
   - Attendance percentage per student
   - Auto-marked attendance (on join)
   - Manual attendance adjustment
   - Export attendance report
   - Attendance analytics

**Access Control:**
- Only available for courses with Live or Mixed delivery method
- Recorded-only courses cannot schedule live classes
- Mixed delivery courses can schedule live classes for specific modules

---

### 3.6 Recorded Content Management

**Purpose**: Upload and manage recorded video content

**Access**: `/portal/mentor/courses/[courseId]/recorded-content`

**Content / Data:**

1. **Recorded Content Library**
   - Video list organized by modules
   - Video details:
     - Video title
     - Module/lesson assignment
     - Duration
     - Upload date
     - View count
     - File size
     - Status (Published / Draft / Processing)

2. **Upload Recorded Content**
   - **Video Upload**:
     - Drag and drop or file browser
     - Supported formats: MP4, MOV, AVI
     - Max file size: 2GB per video
     - Upload progress indicator
   - **Video Information**:
     - Video title
     - Description
     - Module/lesson assignment
     - Thumbnail upload (or auto-generate)
     - Video tags
   - **Video Settings**:
     - Enable/disable downloads
     - Set video quality options
     - Add subtitles/captions
     - Set video chapters/timestamps

3. **Video Editor**
   - Trim video (start/end points)
   - Add intro/outro
   - Add watermarks
   - Insert slides/images
   - Add annotations
   - Speed adjustment

4. **Video Analytics**
   - View count per video
   - Watch time analytics
   - Drop-off points
   - Student engagement metrics
   - Popular content identification

5. **Video Organization**
   - Organize into modules
   - Set lesson order
   - Add prerequisites
   - Create learning paths

**Access Control:**
- Only available for courses with Recorded or Mixed delivery method
- Live-only courses cannot upload standalone recorded content
- Mixed delivery courses can upload recorded content for specific modules

---

### 3.7 Student Management

**Purpose**: View and manage enrolled students

**Access**: `/portal/mentor/students`

**Content / Data:**

1. **Student List**
   - Student cards displaying:
     - Student profile picture
     - Student name
     - Course enrolled
     - Progress percentage
     - Last active date
     - Enrollment date
     - View profile button

2. **Student Filters**
   - Filter by course
   - Filter by progress status (Not Started / In Progress / Completed)
   - Filter by enrollment date
   - Search by student name/email

3. **Student Profile** (Detailed View)
   - **Personal Information**:
     - Name, email, phone
     - Profile picture
     - Bio
   - **Education Background**:
     - College/University
     - Degree/Qualification
     - School information (if applicable)
   - **Skills & Interests**:
     - Skills list
     - Proficiency levels
     - Learning goals
   - **Course Progress**:
     - Modules completed / total
     - Lessons completed / total
     - Assignments submitted / total
     - Tests completed / total
     - Overall progress percentage
   - **Performance Analytics**:
     - Time spent learning
     - Engagement score
     - Completion rate
     - Assignment average score
     - Test average score
   - **Communication**:
     - Send message button
     - Send feedback button
     - Schedule one-on-one button

4. **Student Analytics**
   - Progress over time (chart)
   - Engagement metrics
   - Assignment performance trends
   - Test performance trends
   - Comparison with class average
   - Learning patterns

5. **Bulk Actions**
   - Send announcement to selected students
   - Export student list (CSV)
   - Filter and export reports
   - Send bulk messages

6. **Student Progress Tracking**
   - Track individual student progress
   - Identify struggling students
   - Send personalized feedback
   - Recommend additional resources

---

### 3.8 Assignments & Projects

**Purpose**: Create assignments and review student submissions

**Access**: `/portal/mentor/assignments`

**Content / Data:**

1. **Assignments List**
   - Assignment cards displaying:
     - Assignment title
     - Course name
     - Due date
     - Submissions count
     - Pending reviews count
     - Status (Draft / Published / Closed)
     - Quick actions (Edit / View Submissions / Analytics)

2. **Create Assignment**
   - **Assignment Information**:
     - Assignment title
     - Description / Instructions
     - Course / Module selection
     - Due date and time
     - Points / Weight
   - **Submission Type**:
     - File upload (single/multiple files)
     - Text submission (rich text editor)
     - Code submission (code editor)
     - Link submission (GitHub, etc.)
   - **Grading**:
     - Grading rubric creation
     - Points breakdown
     - Allow resubmission (yes/no)
     - Late submission policy
   - **Resources**:
     - Attach files/resources
     - Add reference links
     - Include code templates

3. **Student Submissions View**
   - Submission list:
     - Student name
     - Submission date/time
     - Files submitted
     - Status (Pending / Graded)
     - View submission button
   - **Submission Filters**:
     - Filter by status
     - Filter by submission date
     - Sort by date, student name

4. **Grade Assignment**
   - **Submission View**:
     - View submitted files
     - Code review interface
     - Text submission display
   - **Grading Interface**:
     - Score input (points)
     - Rubric scoring (if applicable)
     - Feedback text editor:
       - Strengths highlighted
       - Areas for improvement
       - Specific suggestions
   - **Additional Options**:
     - Request resubmission
     - Add private notes (not visible to student)
     - Save draft / Publish grade

5. **Project Mentorship**
   - Project list (if applicable)
   - Team members (for group projects)
   - Project progress tracking
   - Milestone tracking
   - Provide guidance and feedback
   - Review project deliverables

6. **Assignment Analytics**
   - Submission rate
   - Average score
   - Score distribution
   - Common mistakes identification
   - Time to submission analysis

---

### 3.9 Module Tests

**Purpose**: Create and manage course assessments

**Access**: `/portal/mentor/tests`

**Content / Data:**

1. **Tests List**
   - Test cards displaying:
     - Test title
     - Course / Module name
     - Questions count
     - Student attempts
     - Average score
     - Status (Draft / Published / Closed)
     - Quick actions (Edit / View Results / Analytics)

2. **Create Test**
   - **Test Information**:
     - Test title
     - Course / Module selection
     - Description
   - **Test Settings**:
     - Duration (time limit)
     - Passing score (percentage)
     - Attempts allowed (1 / 2 / 3 / Unlimited)
     - Randomize questions (yes/no)
     - Randomize answer options (yes/no)
     - Show results immediately (yes/no)
   - **Question Types**:
     - **Multiple Choice**: 
       - Question text
       - Answer options (2-6 options)
       - Correct answer(s)
       - Points
       - Explanation (shown after submission)
     - **True/False**:
       - Question text
       - Correct answer
       - Points
       - Explanation
     - **Coding Questions**:
       - Problem statement
       - Code editor interface
       - Test cases
       - Expected output
       - Points
     - **Essay Questions**:
       - Question text
       - Word limit (optional)
       - Points
       - Manual grading required

3. **Question Bank**
   - Create reusable questions
   - Organize by topic/category
   - Import/export questions
   - Reuse across tests

4. **Test Analytics**
   - **Student Performance**:
     - Average score
     - Pass rate
     - Score distribution
     - Time taken analysis
   - **Question Analysis**:
     - Most missed questions
     - Question difficulty analysis
     - Answer distribution
   - **Individual Results**:
     - Per-student performance
     - Detailed answer review
     - Improvement suggestions

5. **Test Results Management**
   - View all student attempts
   - Review individual answers
   - Adjust scores (if needed)
   - Provide additional feedback
   - Export results (CSV)

---

### 3.10 Hackathons Management

**Purpose**: Help students with practice problems and send external hackathon links (Full Career Bootcamp only)

**Access**: `/portal/mentor/hackathons`

**Access Control**: 
- **Available only for Full Career Bootcamp mentors**
- **Hidden for Crash/Skill Course mentors**

**Content / Data:**

1. **External Links Management**
   - **Find Practice Problems**:
     - Use AI assistance to find relevant practice problems
     - Search external platforms (LeetCode, HackerRank, Codeforces, etc.)
     - Filter by topic, difficulty, student skill level
   - **Send Links to Students**:
     - Select students or course
     - Send external hackathon/problem-solving links
     - Add notes/instructions with links
     - Categorize links by topic/skill
   - **Link Library**:
     - Save frequently used links
     - Organize by category
     - Reuse for multiple students

2. **AI-Assisted Problem Finding**
   - **AI Integration**:
     - Use AI to identify relevant practice problems
     - Based on:
       - Current course module
       - Student progress
       - Skill level
       - Weak areas identified
   - **Problem Suggestions**:
     - AI generates problem recommendations
     - Review and select problems
     - Send selected problems to students
   - **Customized Learning Paths**:
     - Create practice paths for students
     - Sequence problems by difficulty
     - Track student progress

3. **Student Practice Support**
   - **Help Students Practice**:
     - Assist students with problem-solving
     - Use AI to find similar problems
     - Provide hints and guidance
     - Review student solutions
   - **Track Student Progress**:
     - View problems completed by students
     - Monitor practice time
     - Identify areas needing more practice

4. **External Hackathon Links**
   - **Hackathon Events**:
     - Find external hackathon events
     - Share registration links with students
     - Track student participation
   - **Practice Contests**:
     - Share coding contest links
     - Encourage participation
     - Track contest results

5. **Link Analytics**
   - Links sent count
   - Student engagement with links
   - Problems completed by students
   - Popular practice topics

---

### 3.11 Scholarships Management

**Purpose**: Review scholarship applications and forward to admin (Full Career Bootcamp only)

**Access**: `/portal/mentor/scholarships`

**Access Control**: 
- **Available only for Full Career Bootcamp mentors**
- **Hidden for Crash/Skill Course mentors**

**Content / Data:**

1. **Scholarship Applications List**
   - Application cards displaying:
     - Student name
     - Course name
     - Application date
     - Status (Pending Review / Approved / Rejected / Forwarded to Admin)
     - Quick actions (Review / Approve / Reject)

2. **Application Review Workflow**

   **Step 1: Mentor Review**
   - **Review Application**:
     - View student profile and progress
     - Review academic records
     - Review financial documents
     - Read personal statement/essay
     - Check references
   - **Assess Capability**:
     - Evaluate if student is capable
     - Review course progress
     - Check assignment/test performance
     - Assess commitment and potential
   - **Review Actions**:
     - **Approve**: If student is capable, approve and forward to admin
     - **Reject**: If student is not capable, reject with feedback
     - **Request Info**: Request additional information if needed
     - **Add Notes**: Add private notes about student

   **Step 2: Forward to Admin**
   - If approved, application is forwarded to admin
   - Admin rechecks application
   - Admin verifies documents and eligibility
   - Admin forwards to Scholarship Portal if approved

   **Step 3: Scholarship Portal Review**
   - Final review by scholarship providers
   - Final approval/rejection decision

3. **Application Status Tracking**
   - **Pending Mentor Review**: Awaiting mentor review
   - **Mentor Approved**: Forwarded to admin (awaiting admin review)
   - **Mentor Rejected**: Application declined by mentor
   - **Admin Review**: Under admin review
   - **Admin Approved**: Forwarded to Scholarship Portal
   - **Admin Rejected**: Application declined by admin
   - **Scholarship Portal Review**: Final review stage
   - **Approved**: Scholarship granted
   - **Rejected**: Final rejection

4. **Application Details View**
   - **Student Information**:
     - Personal information
     - Academic records
     - Financial documents
     - Personal statement / Essay
     - References
   - **Course Performance**:
     - Progress percentage
     - Assignment scores
     - Test scores
     - Engagement metrics
   - **Review Interface**:
     - Approve button (forwards to admin)
     - Reject button (with reason)
     - Request information button
     - Add notes field

5. **Scholarship Analytics**
   - Applications reviewed count
   - Approval rate (mentor level)
   - Rejection reasons
   - Average time to review
   - Student performance of approved applicants

---

### 3.12 Interview Management

**Purpose**: View AI interview results and manage interview training course (Full Career Bootcamp only)

**Access**: `/portal/mentor/interviews`

**Access Control**: 
- **Available only for Full Career Bootcamp mentors**
- **Hidden for Crash/Skill Course mentors**

**Content / Data:**

1. **AI Mock Interview Management**

   **Pre-Built AI Interview System**:
   - **Pre-Programmed UI**: Pre-built interview interface for all IT categories
   - **All IT Categories**: Full Stack, Data Science, Cybersecurity, AI/ML, DevOps, etc.
   - **Automated System**: No direct mentor involvement in conducting AI interviews
   - **Student Access**: Students can purchase or skip (optional feature)

   **Review AI Interview Results**:
   - **View Student Attempts**:
     - See student AI interview attempts
     - Review AI-generated feedback
     - View scores and performance
   - **Provide Guidance**:
     - Review AI feedback with students
     - Provide additional human insights
     - Suggest improvement areas
     - Recommend practice resources
   - **Usage Tracking**:
     - Monitor student usage (free vs paid)
     - Track interview frequency
     - Identify students needing more practice

   **AI Interview Features**:
   - Pre-built questions for all IT categories
   - Category-specific coding challenges
   - HR and behavioral questions
   - Automated scoring and feedback
   - Limited free usage, then pay-per-use

2. **Manual Interview Training Course**

   **Separate Course System**:
   - **Separate Course**: Interview training is a separate purchasable course
   - **Salary-Paid Interview Mentors**: Specialized mentors conduct training (salary-based)
   - **Multiple Rounds**: Different mentors for each interview round
   - **Optional Purchase**: Students can purchase or skip

   **Course Mentors (Regular Bootcamp Mentors)**:
   - **View Interview Training Enrollment**:
     - See which students enrolled in interview training
     - Track student progress in interview training
   - **Recommend Interview Training**:
     - Suggest interview training to students
     - Based on student performance and goals
   - **Coordinate with Interview Mentors**:
     - Communicate student needs
     - Share student progress information
     - Provide context for interview mentors

   **Interview Training Course Structure**:
   - Technical Interview Training
   - HR Interview Training
   - Behavioral Interview Training
   - Mock Interview Sessions
   - Multiple rounds with different mentors

3. **Interview Analytics**
   - **AI Interview Analytics**:
     - Student performance trends
     - Common strengths/weaknesses
     - Usage patterns
     - Improvement tracking
   - **Interview Training Analytics**:
     - Enrollment rates
     - Completion rates
     - Student progress
     - Mentor performance

**Note**: 
- Regular Bootcamp mentors do NOT conduct interviews directly
- AI interviews are automated (pre-built system)
- Manual interviews are conducted by specialized salary-paid interview mentors
- Interview training is a separate course that students can purchase

---

### 3.13 Communication

**Purpose**: Communicate with students through messages and announcements

**Access**: `/portal/mentor/messages` and `/portal/mentor/announcements`

#### Messages (Unified Inbox)

**Content / Data:**

1. **Inbox**
   - Conversation list:
     - Student name
     - Course name (if course-related)
     - Last message preview
     - Timestamp
     - Unread count badge
   - **Filters**:
     - All messages
     - Unread only
     - By course
     - By student

2. **Conversation View**
   - Message thread (chronological)
   - Student profile info sidebar
   - Message input:
     - Rich text editor
     - File attachments
     - Emoji support
   - **Actions**:
     - Mark as read/unread
     - Archive conversation
     - Delete conversation

3. **Message Features**
   - Quick replies
   - Message templates
   - File sharing
   - Link sharing
   - Mark important messages

#### Announcements

**Content / Data:**

1. **Announcements List**
   - Announcement cards:
     - Title
     - Course name
     - Date posted
     - Student views count
     - Status (Draft / Published)
     - Quick actions (Edit / View Analytics / Delete)

2. **Create Announcement**
   - **Announcement Information**:
     - Title
     - Course selection (or all courses)
     - Content (rich text editor)
   - **Settings**:
     - Attachments (files, links)
     - Schedule post (future date/time)
     - Send email notification (yes/no)
     - Priority (Normal / High / Urgent)
   - **Publish**:
     - Save as draft
     - Publish immediately
     - Schedule for later

3. **Announcement Analytics**
   - Views count
   - Student engagement
   - Read receipts
   - Click-through rates (if links included)

---

### 3.14 Analytics & Reports

**Purpose**: Comprehensive analytics and reporting

**Access**: `/portal/mentor/analytics`

**Content / Data:**

1. **Course Analytics**
   - **Enrollment Trends**:
     - New enrollments over time
     - Enrollment by course
     - Enrollment by category
   - **Student Progress**:
     - Overall completion rates
     - Progress by course
     - Progress by module
   - **Completion Rates**:
     - Course completion percentage
     - Module completion rates
     - Lesson completion rates
   - **Revenue Trends** (Commission-based):
     - Earnings over time
     - Revenue by course
     - Revenue by month
   - **Ratings and Reviews**:
     - Average rating trends
     - Review sentiment analysis
     - Rating distribution

2. **Student Performance Analytics**
   - **Individual Student Analytics**:
     - Progress tracking
     - Engagement metrics
     - Assignment performance
     - Test performance
   - **Class Performance Comparison**:
     - Average scores
     - Performance distribution
     - Top performers
     - Struggling students identification

3. **Financial Analytics** (Commission-based mentors)
   - **Revenue Breakdown**:
     - Earnings per course
     - Commission tracking
     - Payment history
   - **Pending Payments**:
     - Unpaid enrollments
     - Payment schedule
   - **Earnings Forecast**:
     - Projected earnings
     - Growth trends

4. **Teaching Analytics**
   - **Total Teaching Hours**:
     - Live class hours
     - Content creation hours
   - **Student Satisfaction**:
     - Course ratings
     - Student feedback
     - Retention rates
   - **Popular Content**:
     - Most viewed lessons
     - Most engaging content
     - Drop-off points

5. **Class Analytics** (Live courses)
   - **Attendance Rates**:
     - Per-class attendance
     - Student attendance trends
   - **Class Engagement**:
     - Q&A participation
     - Chat activity
     - Poll responses
   - **Recording Views**:
     - Recording view count
     - Watch time
     - Popular recordings

6. **Reports Export**
   - Export analytics data (CSV, PDF)
   - Custom date ranges
   - Filter by course, student, date
   - Scheduled reports (email)

---

### 3.15 Calendar

**Purpose**: Manage schedule and events

**Access**: `/portal/mentor/calendar`

**Content / Data:**

1. **Calendar View**
   - **Views**: Monthly / Weekly / Daily
   - **Event Types**:
     - Live classes (color-coded by course)
     - Office hours
     - Assignment deadlines
     - Test dates
     - Personal events
     - Hackathons (Bootcamp mentors)
     - Interview schedules (Bootcamp mentors)

2. **Schedule Management**
   - **Create Events**:
     - Event title
     - Date and time
     - Duration
     - Event type
     - Description
     - Reminders
   - **Edit Events**:
     - Modify date/time
     - Update details
     - Cancel events
   - **Delete Events**:
     - Remove events
     - Notify students (if applicable)

3. **Availability Management**
   - **Set Available Hours**:
     - Define working hours
     - Set timezone
     - Block unavailable times
   - **Office Hours**:
     - Schedule regular office hours
     - One-on-one session slots
     - Student booking (if enabled)

4. **Calendar Integration**
   - Export to Google Calendar
   - Export to Outlook
   - Import external events
   - Sync with external calendars

---

### 3.16 Settings

**Purpose**: Configure mentor account and preferences

**Access**: `/portal/mentor/settings`

**Content / Data:**

1. **Profile Settings**
   - **Personal Information**:
     - Name, email, phone
     - Bio / About section
     - Profile picture upload
   - **Social Links**:
     - LinkedIn profile
     - GitHub profile
     - Personal website
     - Social media links
   - **Expertise Areas**:
     - Skills and specializations
     - Years of experience
     - Certifications

2. **Teaching Preferences**
   - **Teaching Style**:
     - Preferred teaching methods
     - Communication preferences
   - **Availability**:
     - Timezone
     - Available hours
     - Response time expectations
   - **Student Capacity**:
     - Max students per course
     - Preferred class sizes

3. **Notification Settings**
   - **Email Notifications**:
     - New enrollments
     - Assignment submissions
     - Student messages
     - Course updates
   - **In-App Notifications**:
     - Enable/disable notification types
     - Notification frequency
   - **Push Notifications** (if mobile app):
     - Enable/disable
     - Notification preferences

4. **Financial Settings**
   - **Payment Methods**:
     - Bank account details
     - Digital wallet information
     - Payment preferences
   - **Tax Information** (if applicable):
     - Tax ID
     - Tax documents
   - **Payout Preferences**:
     - Payment frequency
     - Payment method
     - Payment threshold

5. **Privacy Settings**
   - **Profile Visibility**:
     - Public profile
     - Private profile
     - Visible to students only
   - **Contact Preferences**:
     - Who can message you
     - Office hours availability

6. **Account Settings**
   - **Change Password**:
     - Current password
     - New password
     - Confirm password
   - **Two-Factor Authentication**:
     - Enable/disable 2FA
     - Backup codes
   - **Account Deletion**:
     - Delete account option
     - Data export before deletion

---

## Course Type Specific Features

### Full Career Bootcamp Mentors

**Additional Features Available:**
1. **Hackathons Management**
   - Create hackathons
   - Manage participants
   - Judge submissions
   - Award prizes

2. **Scholarships Management**
   - Review applications
   - Approve/reject scholarships
   - Track scholarship impact

3. **Interview Management**
   - Conduct AI mock interviews
   - Schedule manual interviews
   - Provide interview feedback

4. **Salary Tracking**
   - View monthly salary
   - Track performance bonuses
   - View contract details

### Crash Course & Skill Course Mentors

**Standard Features:**
1. **Course Creation** (Direct, no vacancy)
2. **Content Management** (Live/Recorded)
3. **Student Management**
4. **Assignments & Tests**
5. **Analytics & Reports**
6. **Communication Tools**

**Limitations:**
- ❌ No hackathons
- ❌ No scholarships
- ❌ No interview features
- ✅ Commission-based compensation

---

## Best Practices & Guidelines

### Course Creation Best Practices

1. **Content Quality**:
   - Create clear, structured content
   - Use high-quality video/audio
   - Provide comprehensive resources
   - Include practical examples

2. **Student Engagement**:
   - Respond to student questions promptly
   - Provide timely feedback
   - Create interactive content
   - Encourage discussions

3. **Time Management**:
   - Set realistic time limits (Crash/Skill courses)
   - Plan curriculum for full duration (Bootcamp)
   - Schedule regular check-ins
   - Provide clear deadlines

4. **Communication**:
   - Send regular announcements
   - Respond to messages within 24 hours
   - Provide constructive feedback
   - Be available during office hours

### Full Career Bootcamp Specific Guidelines

1. **Hackathons**:
   - Plan hackathons aligned with course content
   - Provide clear guidelines and criteria
   - Offer mentorship during hackathons
   - Recognize all participants

2. **Scholarships**:
   - Review applications fairly
   - Provide clear feedback
   - Support scholarship recipients
   - Track scholarship impact

3. **Interviews**:
   - Prepare interview questions in advance
   - Provide constructive feedback
   - Help students improve
   - Track interview performance

---

## Data Structure Overview

### Mentor Portal Data

| Feature | Stored Data | Notes |
|---------|-------------|-------|
| **Profile** | Name, email, bio, expertise, rating, reputation score | Verified status tracked |
| **Courses** | Course id, title, syllabus, students, revenue, status | Track performance & earnings |
| **Live Classes** | Class id, schedule, students, attendance, recording | Attendance tracking |
| **Recorded Content** | Video id, title, module, views, analytics | Content management |
| **Assignments** | Assignment id, submissions, grades, feedback | Linked to course |
| **Tests** | Test id, questions, student attempts, analytics | Performance tracking |
| **Students** | Student id, progress, performance, communication | Per-course tracking |
| **Messages** | Message id, student, content, read status | Unified inbox |
| **Announcements** | Announcement id, course, content, views | Engagement tracking |
| **Analytics** | Metrics, trends, reports, performance data | Aggregated from activities |
| **Vacancies** | Vacancy id, application, status, admin feedback | Application tracking |
| **Financial** | Earnings, commissions, payments, revenue | Payment tracking |
| **Hackathons** | Hackathon id, participants, submissions, results | Bootcamp only |
| **Scholarships** | Scholarship id, applications, approvals | Bootcamp only |
| **Interviews** | Interview id, type, feedback, scores | Bootcamp only |

---

*Last Updated: [Current Date]*
*Version: 1.0*


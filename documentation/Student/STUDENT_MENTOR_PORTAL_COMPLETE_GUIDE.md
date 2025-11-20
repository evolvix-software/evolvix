# Evolvix Platform - Student & Mentor Portal Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Course Types & Features](#course-types--features)
   - [2.1 Course Type Overview](#21-course-type-overview)
   - [2.2 Course Categories & Restrictions](#22-course-categories--restrictions)
   - [2.3 Feature Access by Course Type](#23-feature-access-by-course-type)
   - [2.4 Student Portal Access Control](#24-student-portal-access-control)
   - [2.5 Course Duration & Time Limits](#25-course-duration--time-limits)
   - [2.6 Free Courses](#26-free-courses)
   - [2.7 Mentor Compensation Model](#27-mentor-compensation-model)
3. [Student Portal](#student-portal)
   - [3.1 Sidebar Menu](#31-sidebar-menu-student)
   - [3.2 Dashboard / Home Page](#32-dashboard--home-page)
   - [3.3 Settings Page (Profile & Preferences)](#33-settings-page-profile--preferences)
   - [3.4 Browse Courses Page](#34-browse-courses-page)
   - [3.5 My Courses Page](#35-my-courses-page)
   - [3.6 Live Classes Page](#36-live-classes-page)
   - [3.7 Assignments / Projects Page](#37-assignments--projects-page)
   - [3.8 Tests Page](#38-tests-page)
   - [3.9 Interview Preparation Page](#39-interview-preparation-page)
   - [3.10 AI Mock Interview Page](#310-ai-mock-interview-page)
   - [3.11 Scholarships Page](#311-scholarships-page)
   - [3.12 Entrepreneur Zone Page](#312-entrepreneur-zone-page)
   - [3.13 Job / Freelance Page](#313-job--freelance-page)
   - [3.14 Hackathons Page](#314-hackathons-page)
   - [3.15 Notifications Page](#315-notifications-page)
   - [3.16 Mentors Page](#316-mentors-page)
   - [3.17 Settings Page](#317-settings-page)
4. [Mentor Portal](#mentor-portal)
   - [4.1 Sidebar Menu](#41-sidebar-menu-mentor)
   - [4.2 Dashboard](#42-dashboard)
   - [4.3 Course Management](#43-course-management)
   - [4.4 Vacancy System](#44-vacancy-system)
   - [4.5 Live Classes](#45-live-classes)
   - [4.6 Student Management](#46-student-management)
   - [4.7 Assignments & Projects](#47-assignments--projects)
   - [4.8 Module Tests](#48-module-tests)
   - [4.9 Communication](#49-communication)
   - [4.10 Analytics](#410-analytics)
   - [4.11 Calendar](#411-calendar)
   - [4.12 Settings](#412-settings)
5. [Student-Mentor Interactions](#student-mentor-interactions)
6. [Data Structure Overview](#data-structure-overview)
7. [Integration Points](#integration-points)

---

## Overview

The Evolvix platform connects students and mentors through a comprehensive learning ecosystem. This document provides a complete guide to both portals, detailing all features, pages, and how they interconnect to facilitate seamless learning experiences.

### Key Concepts
- **Students** enroll in courses, complete assignments, attend live classes, and track their progress
- **Mentors** create courses, manage students, provide feedback, and track teaching analytics
- **Interactions** happen through assignments, live classes, messages, announcements, and project mentorship

---

## Course Types & Features

### 2.1 Course Type Overview

Evolvix supports three main course types, each with distinct characteristics, features, and access controls:

| Course Type | Delivery Methods | Category Restrictions | Duration | Mentor Compensation |
|------------|------------------|----------------------|----------|---------------------|
| **Crash Course** | Live or Recorded | Any category worldwide | 2-10 hours (several days to a week) | Commission-based |
| **Skill Course** (e.g., React) | Live or Recorded | Any category worldwide | 4-20 hours (1-4 weeks) | Commission-based |
| **Full Career Bootcamp** | Live or Recorded | IT category only, all IT levels | 2-6 months (80-400 hours) | Salary-based |

**Key Points:**
- All course types can have **both recorded and live classes** according to mentor's course creation preferences
- Mentors can create courses with mixed delivery methods (some modules live, some recorded)
- Course type determines which features are available in both student and mentor portals

---

### 2.2 Course Categories & Restrictions

#### Full Career Bootcamp
- **Category Restriction**: Only available in **IT category** (all IT levels: Beginner, Intermediate, Advanced)
- **Examples**:
  - Full Stack Web Developer Bootcamp (2-6 months)
  - Data Science Career Bootcamp (4 months)
  - Cybersecurity Bootcamp (6 months)
  - AI/ML Intensive Bootcamp (3 months)
- **Cannot be created in**: Design, Business, Marketing, Arts, or any non-IT categories

#### Crash Course & Skill Courses
- **Category Restriction**: **Any category worldwide** - no restrictions
- **Examples**:
  - **IT**: React Crash Course, Python Crash Course, Node.js Skill Course
  - **Design**: UI/UX Skill Course, Figma Crash Course, Graphic Design Skill Course
  - **Business**: Marketing Crash Course, Entrepreneurship Skill Course
  - **Arts**: Photography Skill Course, Music Production Skill Course
  - **Languages**: English Speaking Crash Course, Spanish Skill Course
  - **Any other category**: Mentors can create courses in any field

---

### 2.3 Feature Access by Course Type

#### Full Career Bootcamp - Exclusive Features

Full Career Bootcamp has **exclusive access** to premium features:

| Feature | Full Career Bootcamp | Crash/Skill Courses |
|---------|---------------------|---------------------|
| **Hackathons** | ✅ Available | ❌ Not Available |
| **Scholarships** | ✅ Available | ❌ Not Available |
| **AI Mock Interview** | ✅ Available | ❌ Not Available |
| **Manual Interview** | ✅ Available | ❌ Not Available |
| **Course Duration** | 2-6 months (80-400 hours) | Time-limited (varies by type) |
| **Category** | IT only | Any category |
| **Focus** | Practical, job-ready skills | Skill-specific learning |
| **Recognition** | Industry certifications | Skill certifications |

**Note**: Crash Course and Skill Courses work like **Udemy-style courses** - they provide standard course content (videos, assignments, tests) but do not include hackathons, scholarships, or interview features.

#### Feature Visibility in Student Portal

**For Full Career Bootcamp Students:**
- ✅ Can see and access **Hackathons** page
- ✅ Can see and access **Scholarships** page
- ✅ Can see and access **AI Mock Interview** page
- ✅ Can see and access **Interview Preparation** page (for manual interviews)
- ✅ All premium features visible in sidebar and dashboard

**For Crash/Skill Course Students:**
- ❌ **Hackathons** page is **hidden** (not accessible)
- ❌ **Scholarships** page is **hidden** (not accessible)
- ❌ **AI Mock Interview** page is **hidden** (not accessible)
- ❌ **Interview Preparation** page is **hidden** (not accessible)
- ✅ Standard features available: Courses, Assignments, Tests, Live Classes (if applicable)

---

### 2.4 Student Portal Access Control

#### Recorded vs Live Class Access

The student portal dynamically shows/hides pages based on the course delivery method:

**Scenario 1: Student Enrolled in Recorded Course**
- ✅ **Recorded Videos Page**: Visible and accessible
  - Can watch recorded video lessons
  - Can access course materials
  - Can track progress through recorded content
- ❌ **Live Classes Page**: **Hidden** (not accessible)
  - Live classes menu item hidden from sidebar
  - Cannot see upcoming live sessions
  - Cannot join live classes

**Scenario 2: Student Enrolled in Live Course**
- ✅ **Live Classes Page**: Visible and accessible
  - Can see upcoming live sessions
  - Can join live classes
  - Can view live class schedule
  - Can access live class recordings (if mentor provides)
- ❌ **Recorded Videos Page**: **Hidden** (not accessible)
  - Recorded videos menu item hidden from sidebar
  - Cannot access standalone recorded video library

**Implementation Logic:**
```typescript
// Student portal access control
if (course.courseType === 'recorded') {
  // Show recorded videos page
  // Hide live classes page
} else if (course.courseType === 'live') {
  // Show live classes page
  // Hide recorded videos page
}
```

**Note**: If a course has **both** live and recorded components (mixed delivery), the student sees both pages based on their enrollment type or mentor's configuration.

---

### 2.5 Course Duration & Time Limits

#### Full Career Bootcamp
- **Duration**: **2 to 6 months** (80-400 hours total)
- **Structure**: Daily/weekly live sessions, hands-on projects, real-world simulations
- **Focus**: Intensive, practical training targeting job-ready skills and industry demands
- **Recognition**: Industry-recognized certifications or employer partnerships
- **Target Audience**: Career switchers, upskillers looking for immediate job readiness
- **Coursework**: Hands-on projects, coding challenges, mentorship, portfolio development
- **No strict time limits**: Students have access throughout the course duration
- **Examples**:
  - 2-month Full Stack Web Developer Bootcamp (160 hours)
  - 4-month Data Science Bootcamp (320 hours)
  - 6-month Cybersecurity Bootcamp (400 hours)

#### Crash Course
- **Duration**: **2 to 10 hours** (across several days to a week)
- **Structure**: 3-5 lessons, each 30-60 minutes
- **Best Use Cases**: Rapid foundational knowledge, overviews, quick skill acquisition
- **Time limits apply**: Must complete within 1-2 weeks from enrollment
- **Examples**:
  - 4-hour "React Hooks Crash Course" (completed over 3 days)
  - 8-hour "Node.js Crash Course" (completed over 1 week)
  - 10-hour "UI/UX Design Crash Course" (completed over 5 days)

#### Skill Course
- **Duration**: **4 to 20 hours** (spread over 1-4 weeks)
- **Structure**: 5-10 modules of 20-40 minute videos
- **Best Use Cases**: Specific skills, certification courses, targeted learning
- **Time limits apply**: Must complete within 1-4 weeks from enrollment
- **Examples**:
  - 8-hour "Complete React Course" (2 weeks)
  - 15-hour "UI/UX Design Fundamentals" (3 weeks)
  - 20-hour "Node.js Backend Development" (4 weeks)

**Time Limit Rules (for Crash Course and Skill Courses):**
- Time limit starts from enrollment date
- Students receive reminders as deadline approaches
- After time limit expires, course access is restricted (may require extension or re-enrollment)
- Mentors can set time limits during course creation
- Progress tracking and interactive quizzes help maintain engagement

---

### 2.6 Free Courses

Mentors can create **free courses** with specific characteristics:

#### Free Course Specifications
- **Duration**: **30 minutes to 2 hours** (short duration)
- **Delivery Method**: **Recorded only** (free courses are pre-recorded)
- **Category**: **Any category worldwide** (no restrictions)
- **Course Types**: Can be Crash Course or Skill Course
- **Purpose**: 
  - Attract students to mentor's teaching style
  - Provide introductory content
  - Build mentor reputation
  - Showcase expertise

#### Free Course Examples
- "Introduction to React - 30 Minutes" (Recorded, Free)
- "Figma Basics Crash Course - 1 Hour" (Recorded, Free)
- "Python Fundamentals Crash Course - 2 Hours" (Recorded, Free)
- "Photography Basics - 45 Minutes" (Recorded, Free)

#### Free Course Limitations
- ❌ Cannot be Full Career Bootcamp (these are always paid/scholarship-based)
- ❌ Cannot be live courses (free courses are recorded only)
- ❌ No hackathons, scholarships, or interview features (standard course features only)

---

### 2.7 Mentor Compensation Model

#### Salary-Based Compensation (Full Career Bootcamp)

**Mentors teaching Full Career Bootcamp work on a salary basis:**

- **Fixed Salary**: Mentors receive a fixed monthly salary
- **Contract-Based**: Mentors sign contracts with Evolvix platform
- **Stable Income**: Predictable monthly earnings regardless of enrollment numbers
- **Benefits**: May include benefits package, performance bonuses
- **Requirements**: 
  - Must apply through vacancy system
  - Must meet qualification requirements
  - Must pass admin verification
  - Must sign employment contract

**Salary Structure:**
- Base salary set by admin during vacancy creation
- Performance-based bonuses possible
- Regular salary payments (monthly)
- Contract duration matches course duration: 2-6 months

#### Commission-Based Compensation (Crash Course, Skill Courses)

**Mentors teaching Crash Course or Skill Courses work on commission basis:**

- **Revenue Share**: Mentors earn percentage of course sales
- **Performance-Based**: Earnings depend on enrollment numbers
- **Direct Payment**: Commission paid per enrollment
- **Flexible**: Mentors can create unlimited courses
- **No Contract Required**: Direct course creation without vacancy system

**Commission Structure:**
- Percentage of course price (set by platform)
- Paid after student enrollment
- No fixed salary
- Earnings vary based on course popularity

---

## Student Portal

### 3.1 Sidebar Menu (Student)

The student sidebar provides navigation to all major features of the platform.

| Menu Item | Path | Description | Badge/Status |
|-----------|------|-------------|--------------|
| **Dashboard** | `/portal/student` | Overview & Progress | Live |
| **Browse Courses** | `/portal/student/courses` | Discover & Enroll | - |
| **My Courses** | `/portal/student/my-courses` | Enrolled Courses | Count badge |
| **Assignments** | `/portal/student/assignments` | Tasks & Projects | Count badge |
| **Tests** | `/portal/student/tests` | Module Assessments | - |
| **Live Classes** | `/portal/student/classes` | Join Sessions | - |
| **Mentors** | `/portal/student/mentors` | Connect & Learn | Count badge |
| **Scholarships** | `/portal/student/scholarships` | Financial Aid | - |
| **Jobs & Opportunities** | `/portal/student/jobs` | Career Path | - |
| **Hackathons** | `/portal/student/hackathons` | Compete & Win | - |
| **Settings** | `/portal/student/settings` | Profile & Preferences | Count badge |

**Note:** 
- Profile functionality has been moved into Settings. Access profile features via Settings (`/portal/student/settings?section=basic`).
- Notifications are accessed through Settings (`/portal/student/settings?section=notifications-app`). The Settings menu item displays a badge count for unread notifications.
- School students from 10th grade onwards can join courses. School information can be added in Settings → Education & School section.


**Additional Features:**
- **Today's Tasks Card**: Displays task count and next due assignment
- **Quick Actions**: Shortcuts to common tasks
- **Profile Section**: Shows user info and online status

---

### 3.2 Dashboard / Home Page

**Purpose**: Quick overview of student activity and progress

**Content / Data:**

1. **Welcome Header**
   - Student name and profile picture
   - Quick stats summary

2. **Progress Cards**
   - Courses completed / in-progress count
   - Upcoming live classes count
   - Assignments due count
   - Achievements / hackathons count
   - Tests completed / pending

3. **Quick Links**
   - "Join Live Class Now" button
   - "Apply for Scholarship" button
   - "Browse Courses" button (links to Browse Courses page)
   - "My Courses" button (links to My Courses page)
   - "View Certificates" button

4. **Charts / Graphs**
   - Skill progress over time
   - Course completion percentage
   - Interview readiness score
   - Learning streak calendar

5. **Upcoming Courses** (from My Courses)
   - List of enrolled courses with progress bars
   - Next lesson information
   - Course completion percentage
   - Quick link to My Courses page

6. **Recommended DSA Courses** (For Coding-Related Full Career Bootcamp Students)
   - **Access Control**: Only visible to students enrolled in coding-related Full Career Bootcamp courses
   - **Purpose**: Top-level DSA courses for problem solving, hackathon preparation, and interview preparation
   - **Course Recommendations**:
     - **Best DSA Courses**:
       - Top-rated Data Structures and Algorithms courses
       - Courses specifically designed for problem solving
       - Courses focused on hackathon preparation
       - Courses optimized for interview preparation
     - **Course Cards Display**:
       - Course title and thumbnail
       - Mentor name and rating
       - Course rating and student count
       - Focus areas (Problem Solving / Hackathons / Interviews)
       - Duration and difficulty level
       - Quick enroll button
     - **Filtering Options**:
       - Filter by focus: Problem Solving / Hackathons / Interview Prep
       - Filter by difficulty: Beginner / Intermediate / Advanced
       - Sort by: Rating / Popularity / Newest
     - **Course Details**:
       - Comprehensive DSA topics coverage
       - Problem-solving strategies
       - Coding patterns and techniques
       - Practice problems and exercises
       - Mock interviews and assessments
       - Hackathon preparation materials
   - **Integration with Bootcamp**:
     - Recommendations based on current bootcamp progress
     - Aligned with bootcamp curriculum
     - Complementary to main bootcamp course
   - **Quick Actions**:
     - "View All DSA Courses" button
     - "Enroll Now" buttons for each course
     - "Add to Wishlist" option

7. **Latest Notifications Feed**
   - Upcoming classes reminders
   - Assignment deadlines
   - Mentor feedback notifications
   - Scholarship updates
   - Hackathon announcements

7. **Recent Activity**
   - Last completed lessons
   - Recent test scores
   - Submitted assignments
   - Achievements unlocked

8. **Calendar (Full Width)**
   - Monthly calendar view with all events
   - Live classes scheduled
   - Assignment deadlines
   - Test dates
   - Course milestones
   - Filter by course
   - Event details on click
   - Navigation between months
   - Today's events highlighted

**Mentor Connection:**
- Shows courses created by mentors
- Displays mentor feedback on assignments
- Shows upcoming live classes scheduled by mentors
- Links to mentor profiles

---

### 3.3 Settings Page (Profile & Preferences)

**Purpose**: Manage personal information, profile, education, KYC status, and preferences

**Access**: `/portal/student/settings` or via Settings menu item in sidebar

**Note**: Profile functionality has been moved into Settings. All profile-related features are now accessible through Settings sections.

**Settings Sections:**

#### 1. Personal Information (`?section=basic`)
   - Name, DOB, Gender
   - Contact: Email, Phone, Address
   - Bio / About section
   - Edit and save functionality

#### 2. Profile Picture (`?section=picture`)
   - Upload / Edit profile picture
   - Image preview
   - Remove photo option
   - Supported formats: JPG, PNG, GIF (Max 2MB)

#### 3. Education & School (`?section=education`)
   - **College/University Information:**
     - College/University name
     - Degree / Qualification
     - Year of graduation
     - Specialization / Major
     - GPA / Grades (optional)
   
   - **School Student Information (Optional):**
     - Toggle to enable school student mode
     - **Available for students from 10th grade onwards**
     - School Name
     - Grade Level (10th, 11th, 12th)
     - School Board (CBSE, ICSE, State Board, IB, IGCSE, Other)
     - Note: School students can join courses from 10th grade onwards

#### 4. Skills & Interests (`?section=skills`)
   - Add & edit skills (tags)
   - Skill proficiency levels
   - Preferred courses / domains
   - Learning goals
   - Add/remove interests

#### 5. KYC & Verification (`?section=kyc`)
   - Verification status: Pending / Verified / Rejected
   - ID document upload
   - Verification level indicator
   - Document submission date
   - Link to verification page
   - Verification benefits information

#### 6. Achievements (`?section=achievements`)
   - **Certificates:**
     - Certificates earned from completed courses
     - Download certificate option
     - Certificate date and course information
   
   - **Badges:**
     - Badges unlocked (First Code Commit, Course Completer, Perfect Score, etc.)
     - Visual badge display
   
   - **Hackathon Wins:**
     - Hackathon achievements
     - Position and date information
     - Trophy display

#### 7. Change Password (`?section=password`)
   - Current password
   - New password
   - Confirm new password
   - Password visibility toggle

#### 8. Payment Methods (`?section=payment`)
   - Saved payment methods
   - Add new payment method
   - Set default payment method
   - Remove payment methods

#### 9. Notifications (`?section=notifications-app`)
   - Email notifications preferences
   - Push notification settings
   - Notification types (courses, assignments, scholarships, etc.)

#### 10. Account & Security (`?section=account`)
   - Two-factor authentication
   - Login history
   - Active sessions
   - Account deletion

#### 11. Privacy & Security (`?section=privacy`)
   - Privacy settings
   - Data sharing preferences
   - Profile visibility

#### 12. Preferences (`?section=preferences`)
   - Theme (Light / Dark)
   - Language preferences
   - Notification preferences

**Mentor Connection:**
- Profile visible to mentors when reviewing scholarship applications
- Skills visible to mentors for project team formation
- KYC status affects enrollment eligibility for certain courses
- School student information helps mentors understand student background

---

### 3.4 Browse Courses Page

**Purpose**: Discover and enroll in new courses

**Access**: `/portal/student/courses`

**Content / Data:**

1. **Course Catalog**
   - Grid/List view toggle
   - Search bar
   - Course cards with:
- Course image / thumbnail
- Course title
- Short description
- Mentor name and rating
- Course rating and review count
- Duration / Total hours
- Price (Free / Paid / Scholarship available)
- Enrollment count
- Enroll Button (Payment / Scholarship)

2. **Filters**
   - Skill / Technology
   - Level (Beginner / Intermediate / Advanced)
   - Category (Crash Course / Skill-Focused / Bootcamp / Bundle)
   - Price (Free / Paid)
   - Rating
   - Duration
   - Mentor

3. **Sorting Options**
   - Most Popular
   - Highest Rated
   - Newest
   - Price: Low to High / High to Low
   - Duration: Shortest to Longest

4. **Course Detail Page** (on click)
   - **Course Overview**
   - Full description
   - Learning objectives
   - Prerequisites
   - Who should take this course

   - **Syllabus Preview**
   - Modules list with descriptions
   - Lessons within each module
   - Estimated time per lesson
   - Lesson types (Video / Reading / Assignment)

   - **Mentor Info**
   - Mentor profile picture
   - Mentor name and bio
   - Mentor rating and reviews
   - Total students taught
   - Other courses by mentor
     - View mentor profile link

   - **Requirements / Prerequisites**
   - Required knowledge
   - Software / tools needed
   - System requirements

   - **Enrollment Options**
   - Full payment
   - Installment plan (3 or 4 payments)
   - Scholarship application (if eligible)
   - Free enrollment (if free course)
     - Add to wishlist (if not enrolled)
   
   - **Course Reviews**
     - Student reviews and ratings
     - Review filters
     - Write review option (if enrolled)

5. **Featured Courses Section**
   - Highlighted courses
   - Popular courses
   - New courses
   - Recommended courses (based on profile)

6. **Recommended DSA Courses Section** (For Coding-Related Full Career Bootcamp Students)
   - **Access Control**: 
     - Only visible to students enrolled in coding-related Full Career Bootcamp courses
     - Hidden for Crash Course, Skill Course, and non-coding bootcamp students
   - **Section Title**: "Top DSA Courses for Problem Solving, Hackathons & Interviews"
   - **Purpose**: Recommend best-in-class DSA courses specifically for:
     - **Problem Solving**: Advanced problem-solving techniques and patterns
     - **Hackathon Preparation**: Competitive programming and hackathon strategies
     - **Interview Preparation**: Technical interview coding challenges and solutions
   - **Course Recommendations**:
     - **Top-Level DSA Courses**:
       - Highest-rated courses in the platform
       - Courses with proven track records
       - Courses with high student success rates
       - Courses recommended by industry experts
     - **Course Cards**:
       - Course thumbnail and title
       - Mentor information and credentials
       - Course rating (4.5+ stars)
       - Student enrollment count
       - Focus badges: "Problem Solving" / "Hackathons" / "Interview Prep"
       - Key topics covered
       - Duration and difficulty level
       - Pricing information
       - "Enroll Now" or "View Details" button
     - **Course Categories**:
       - **Problem Solving Focus**:
         - Algorithm design and analysis
         - Data structure implementation
         - Pattern recognition
         - Optimization techniques
       - **Hackathon Focus**:
         - Competitive programming
         - Time-constrained problem solving
         - Team collaboration strategies
         - Project building under pressure
       - **Interview Focus**:
         - Coding interview patterns
         - System design basics
         - Behavioral interview prep
         - Mock interview sessions
   - **Filtering & Sorting**:
     - Filter by focus area (Problem Solving / Hackathons / Interviews)
     - Filter by difficulty level
     - Sort by rating, popularity, or price
     - Search within DSA courses
   - **Course Details Page** (for recommended DSA courses):
     - **Why This Course**:
       - Why it's recommended for bootcamp students
       - How it complements bootcamp curriculum
       - Success stories from bootcamp students
     - **Curriculum Highlights**:
       - Core DSA topics covered
       - Problem-solving frameworks
       - Interview question patterns
       - Hackathon strategies
     - **Learning Outcomes**:
       - Improved problem-solving skills
       - Better hackathon performance
       - Interview readiness
       - Competitive programming skills
     - **Student Testimonials**:
       - Reviews from bootcamp students
       - Success in interviews/hackathons
       - Impact on problem-solving abilities
   - **Integration Features**:
     - Link to Hackathons page (practice what you learn)
     - Link to AI Mock Interview (apply DSA knowledge)
     - Link to Interview Preparation (use DSA skills)
     - Progress tracking integration with bootcamp

7. **Categories / Browse by Topic**
   - Technology stacks
   - Career paths
   - Skill areas
   - Industry domains

**Mentor Connection:**
- Courses created by mentors
- Mentor profiles visible on course cards
- Mentor contact through course detail page
- View all courses by a specific mentor
- DSA course mentors specialize in problem solving, hackathons, and interviews
- Bootcamp mentors can recommend specific DSA courses to students

---

### 3.5 My Courses Page

**Purpose**: Access and manage enrolled courses

**Access**: `/portal/student/my-courses`

**Content / Data:**

1. **Enrolled Courses List**
   - Course cards with:
     - Course image / thumbnail
     - Course title
     - Mentor name
     - Progress bar (completion percentage)
     - Last accessed date
     - Continue Learning button
     - Course status (In Progress / Completed / Not Started)

2. **Course Filters**
   - All Courses
   - In Progress
   - Completed
   - Not Started
   - By category
   - By mentor

3. **Course Detail View** (for enrolled courses)
   - **Course Overview**
     - Full description
     - Learning objectives
     - Prerequisites
   
   - **Progress Dashboard**
     - Overall completion percentage
     - Modules completed / total
     - Lessons completed / total
     - Assignments completed / total
     - Tests completed / total
     - Time spent learning
     - Last activity date
   
   - **Lessons List**
     - Module organization
   - Lesson titles
   - Progress indicators (Completed / In Progress / Locked)
   - Video duration
     - Completion status
     - Mark as complete option
     - Access lesson button
   
   - **Course Content**
     - Video lessons
     - Reading materials
     - Downloadable resources
     - Code examples
     - Practice exercises
   
   - **Assignments Section**
     - Assignment list with due dates
     - Submission status
     - Grades and feedback
     - Link to assignments page
   
   - **Tests Section**
     - Available tests
     - Test results
     - Link to tests page
   
   - **Live Classes**
     - Upcoming live sessions
     - Past recordings
     - Link to live classes page
   
   - **Course Forum / Discussion**
     - Ask questions
     - View discussions
     - Mentor responses
   
   - **Certificates**
     - Certificate availability (80-90% completion)
     - Download certificate (if eligible)
     - Certificate preview

4. **Quick Actions**
   - Continue Learning (resume from last lesson)
   - View Assignments
   - View Tests
   - Join Live Class
   - Contact Mentor
   - Leave Course (if allowed)

5. **Course Statistics**
   - Total enrolled courses
   - Courses in progress
   - Courses completed
   - Certificates earned
   - Total learning hours
   - Average completion rate

6. **Recommended Next Steps**
   - Suggested courses based on current progress
   - Prerequisites for advanced courses
   - Related courses

7. **Wishlist** (if implemented)
   - Saved courses for later enrollment
   - Move to wishlist from browse page
   - Quick enroll from wishlist

**Mentor Connection:**
- Direct access to mentor from course page
- Mentor announcements visible
- Mentor feedback on assignments
- Live classes scheduled by mentor
- Course forum moderated by mentor

---

### 3.6 Live Classes Page

**Purpose**: Join live sessions and access recordings

**Access Control**: 
- **Visible only for students enrolled in Live courses**
- **Hidden for students enrolled in Recorded-only courses** (see [Section 2.4](#24-student-portal-access-control))
- Students enrolled in recorded courses will not see this page in their sidebar

**Content / Data:**

1. **Upcoming Live Sessions**
   - Class title
   - Mentor name
   - Date and time
   - Duration
   - Course name
   - Join button (active 15 min before start)
   - Add to calendar

2. **Join Live Class**
   - Integrated video (Jitsi / Zoom)
   - Chat / Q&A panel
   - Screen sharing
   - Polls / Interactive features
   - Raise hand feature
   - Attendance auto-marked on join

3. **Attendance Tracker**
   - Attendance history
   - Percentage attendance
   - Missed classes list
   - Auto-marked attendance status

4. **Recorded Classes Tab**
   - Playback list
   - Class recordings with timestamps
   - Bookmarks / Notes
   - Search within recordings
   - Download option (if available)
   - Playback speed control

5. **Class Schedule**
   - Weekly / Monthly view
   - Calendar integration
   - Reminder notifications

**Mentor Connection:**
- Live classes created and hosted by mentors
- Mentors can see student attendance
- Chat messages visible to mentor
- Recordings uploaded by mentor

---

### 3.7 Assignments / Projects Page

**Purpose**: View, submit, and track assignments and projects

**Content / Data:**

1. **Assignment List**
   - Assignment title
   - Course name
   - Description / Requirements
   - Due date and time
   - Status: Not Started / In Progress / Submitted / Graded
   - Points / Score (if graded)
   - Submission count

2. **Assignment Detail Page**
   - Full description
   - Attachments / Resources
   - Submission guidelines
   - Grading rubric
   - Due date countdown

3. **Submission Interface**
   - Upload files button
   - Text editor for written submissions
   - Code editor (if coding assignment)
   - Link submission option
   - Multiple file upload support
   - Preview before submission

4. **Status Tracking**
   - Submitted: Date and time
   - Pending: Awaiting mentor review
   - Graded: Score and feedback received

5. **Mentor Feedback**
   - Score / Grade
   - Written feedback
   - Strengths highlighted
   - Areas for improvement
   - Resubmission option (if allowed)

6. **Project Milestone Tracker**
   - Project title
   - Tasks list with checkboxes
   - Deadlines per task
   - Progress bar (overall completion)
   - Mentor guidance notes
   - Team members (if group project)

**Mentor Connection:**
- Assignments created by mentors
- Mentors review and grade submissions
- Mentor provides detailed feedback
- Project mentorship from mentors
- Mentor can request resubmissions

---

### 3.8 Tests Page

**Purpose**: Take module assessments and view results

**Content / Data:**

1. **Available Tests**
   - Test title
   - Course / Module name
   - Duration
   - Total questions
   - Passing score
   - Attempts allowed
   - Status: Available / Completed / Locked

2. **Test Taking Interface**
   - Question navigation
   - Timer display
   - Answer options (MCQ / True-False / Coding)
   - Code editor (for coding questions)
   - Save progress
   - Submit button

3. **Test Results**
   - Score / Percentage
   - Pass / Fail status
   - Correct answers review
   - Incorrect answers with explanations
   - Time taken
   - Attempt number

4. **Test History**
   - Previous attempts
   - Score improvement over time
   - Detailed analytics

**Mentor Connection:**
- Tests created by mentors
- Mentors can view student test results
- Mentors provide explanations for answers
- Test analytics visible to mentors

---

### 3.9 Interview Preparation Page (Manual Interview Training)

**Purpose**: Access manual interview training conducted by specialized interview mentors

**Access Control**: 
- **Available only for Full Career Bootcamp students**
- **Hidden for Crash Course and Skill Course students** (see [Section 2.3](#23-feature-access-by-course-type))
- **Optional Feature**: Students can purchase or skip
- This page provides access to manual interview training courses

**Content / Data:**

1. **Interview Training Courses**
   - **Separate Course**: Interview training is a separate course
   - **Salary-Paid Mentors**: Conducted by specialized interview mentors (salary-based)
   - **Multiple Rounds**: Different mentors for each interview round
   - **Course Structure**:
     - Technical Interview Training
     - HR Interview Training
     - Behavioral Interview Training
     - Mock Interview Sessions

2. **Course Purchase Options**
   - **Optional Purchase**: Students can purchase interview training course
   - **Skip Option**: Students can skip if not needed
   - **Pricing**: Separate course pricing
   - **Enrollment**: Enroll in interview training course separately

3. **Interview Rounds**
   - **Round 1**: Conducted by Mentor A (salary-paid)
   - **Round 2**: Conducted by Mentor B (salary-paid)
   - **Round 3**: Conducted by Mentor C (salary-paid)
   - Each round with different specialized mentor
   - Round-specific feedback and evaluation

4. **Training Content**
   - **Level-Based Sections**:
     - **Beginner**: Basic concepts, simple coding problems
     - **Intermediate**: Medium complexity, system design basics
     - **Advanced**: Complex algorithms, architecture, leadership
   - **Coding Exercises**:
     - Problem statements
     - Code editor
     - Test cases
     - Hints / Solutions
     - Difficulty levels
   - **HR Scenarios**:
     - Common interview questions
     - Behavioral questions
     - Situational questions
     - Answer templates / Tips

5. **Live Interview Sessions**
   - Schedule mock interviews with interview mentors
   - One-on-one sessions
   - Group practice sessions
   - Real-time feedback from mentors

6. **Progress Tracker**
   - Questions completed
   - Interview rounds completed
   - Mentor feedback received
   - Improvement over time
   - Weak areas identified

7. **Links to AI Mock Interview**
   - Quick access button to AI Mock Interview
   - Integration between manual and AI interviews
   - Compare results from both

**Mentor Connection:**
- **Interview Mentors**: Specialized salary-paid mentors conduct training
- **Separate Course**: Interview training is a separate purchasable course
- **Multiple Mentors**: Different mentors for different rounds
- **Optional**: Students can purchase or skip this course
- **Course Mentors**: Regular course mentors can recommend interview training

---

### 3.10 AI Mock Interview Page

**Purpose**: Pre-built AI interview simulation for all IT categories

**Access Control**: 
- **Available only for Full Career Bootcamp students**
- **Hidden for Crash Course and Skill Course students** (see [Section 2.3](#23-feature-access-by-course-type))
- **Optional Feature**: Students can purchase or skip
- This page provides AI-powered interview simulation features

**DSA Course Integration**:
- **Recommended DSA Courses**: Link to top DSA courses for interview preparation
- **Interview Questions**: DSA-focused interview questions from recommended courses
- **Skill Assessment**: Evaluate DSA knowledge gained from courses
- **Practice Integration**: Use DSA course problems in interview practice

**Content / Data:**

1. **Pre-Built Interview UI**
   - **All IT Categories Supported**:
     - Full Stack Development
     - Data Science
     - Cybersecurity
     - AI/ML
     - DevOps
     - Mobile Development
     - And all other IT categories
   - **Pre-Programmed Questions**:
     - Category-specific questions
     - Difficulty levels (Beginner/Intermediate/Advanced)
     - Technical and HR questions

2. **Mock Coding Interview**
   - Code editor interface
   - Problem statement (category-specific)
   - Test cases
   - Auto-evaluation
   - Time tracking
   - Code quality analysis
   - Category-specific coding challenges

3. **Mock HR Interview**
   - Question prompts (pre-built for IT roles)
   - Voice / Text input
   - AI scoring
   - Response analysis
   - Communication skills assessment
   - Behavioral questions

4. **Pricing & Usage**
   - **Premium Feature**: Limited free usage included
   - **Free Limit**: 
     - X free interviews per month (set by platform)
     - After limit: Pay-per-use pricing
   - **Purchase Options**:
     - Students can purchase additional interviews
     - Pay-per-interview or package deals
     - Skip if not needed (optional feature)

5. **Feedback Section**
   - Strengths identified
   - Weaknesses highlighted
   - Improvement suggestions
   - Score breakdown
   - Comparison with previous attempts
   - Category-specific feedback

6. **Progress Dashboard**
   - Interview attempts over time
   - Score trends
   - Skill improvement graph
   - Areas of focus
   - Usage tracking (free vs paid)

**Mentor Connection:**
- Mentors can view student AI interview results
- Mentors can provide additional guidance based on AI feedback
- Integration with course curriculum
- No direct mentor involvement in AI interviews (automated)

---

### 3.11 Scholarships Page

**Purpose**: Apply for and track scholarship applications

**Access Control**: 
- **Available only for Full Career Bootcamp students**
- **Hidden for Crash Course and Skill Course students** (see [Section 2.3](#23-feature-access-by-course-type))
- Students enrolled only in short-term courses will not see this page in their sidebar

**Content / Data:**

1. **Available Scholarships**
   - Scholarship name
   - Sponsor / Organization
   - Eligibility criteria
   - Coverage percentage
   - Application deadline
   - Number of recipients
   - Apply button

2. **Application Form**
   - Personal information (pre-filled from profile)
   - Academic records upload
   - Financial documents upload
   - ID verification
   - Personal statement / Essay
   - References
   - Submit application

3. **Application Status & Review Workflow**
   - **Step 1 - Mentor Review**: 
     - Application submitted to course mentor
     - Mentor reviews if student is capable
     - Mentor can approve or reject
     - If approved, mentor forwards to admin
   - **Step 2 - Admin Review**:
     - Admin rechecks application
     - Admin verifies documents and eligibility
     - Admin forwards to Scholarship Portal if approved
   - **Step 3 - Scholarship Portal Review**:
     - Final review by scholarship providers
     - Final approval/rejection decision
   - **Status Tracking**:
     - **Pending Mentor Review**: Awaiting mentor review
     - **Mentor Approved**: Forwarded to admin
     - **Mentor Rejected**: Application declined by mentor
     - **Admin Review**: Under admin review
     - **Admin Approved**: Forwarded to Scholarship Portal
     - **Admin Rejected**: Application declined by admin
     - **Scholarship Portal Review**: Final review stage
     - **Approved**: Scholarship granted
     - **Rejected**: Final rejection

4. **Status Details**
   - Application date
   - Review dates at each stage
   - Reviewer feedback (mentor/admin/scholarship portal)
   - Next steps
   - Award amount (if approved)

5. **Notifications**
   - Mentor review status
   - Admin review status
   - Scholarship portal approval/rejection
   - Request for additional documents
   - Status change alerts at each stage

**Mentor Connection:**
- Mentors review applications first (if student is capable)
- Mentors can approve and forward to admin
- Mentors can reject applications with feedback
- Mentor recommendations strengthen applications
- Scholarship recipients can be mentored by course mentors

---

### 3.12 Entrepreneur Zone Page

**Purpose**: Form teams, pitch ideas, and develop projects

**Content / Data:**

1. **Team Formation**
   - Skill-based member search
   - Send invitations
   - Pending invitations list
   - Accepted members list
   - Team roles assignment
   - Team chat / communication

2. **Idea Pitch**
   - Idea title
   - Description / Pitch deck
   - Document uploads
   - Problem statement
   - Solution overview
   - Market analysis
   - Status: Draft / Pending / Approved / Rejected
   - Feedback from reviewers

3. **Project Development**
   - Project title
   - Task tracker (Kanban board)
   - Progress bar
   - Documents repository
   - Code repository link (GitHub)
   - Milestone tracking
   - Team member contributions

4. **Mentor Guidance**
   - Assigned mentor
   - Mentor feedback
   - Notes and suggestions
   - Regular check-ins
   - Resource recommendations
   - Business advice

5. **Revenue / Equity Info**
   - Revenue sharing (backend)
   - Equity distribution
   - Investment tracking

**Mentor Connection:**
- Mentors provide guidance on projects
- Mentors review and approve ideas
- Mentors help with team formation
- Mentors provide business mentorship
- Mentors can invest in projects (if investor-mentor)

---

### 3.13 Job / Freelance Page

**Purpose**: Apply for jobs and track applications

**Content / Data:**

1. **Available Jobs**
   - Job title
   - Company / Employer name
   - Job description
   - Requirements
   - Milestones / Deliverables
   - Payment structure
   - Application deadline
   - Apply button

2. **Applied Jobs**
   - Application status: Pending / Under Review / Accepted / Rejected
   - Application date
   - Interview schedule (if applicable)
   - Employer contact info (if approved)

3. **Milestone Payments**
   - Milestone name
   - Amount
   - Progress status
   - Completion percentage
   - Payment status: Pending / Paid
   - Payment date

4. **Job Details**
   - Full job description
   - Required skills
   - Experience level
   - Remote / On-site
   - Duration
   - Rate / Salary

**Mentor Connection:**
- Mentors can recommend students for jobs
- Mentors provide references
- Mentors help prepare for job interviews
- Mentors can post jobs (if employer-mentor)

---

### 3.14 Hackathons Page

**Purpose**: Access external hackathon links for practice and problem solving

**Access Control**: 
- **Available only for Full Career Bootcamp students**
- **Hidden for Crash Course and Skill Course students** (see [Section 2.3](#23-feature-access-by-course-type))
- Students enrolled only in short-term courses will not see this page in their sidebar

**Content / Data:**

1. **External Hackathon Links**
   - **Practice Problems & Challenges**:
     - External links to coding platforms (LeetCode, HackerRank, Codeforces, etc.)
     - Problem-solving challenges
     - Practice contests
     - Links organized by category and difficulty level
   - **Hackathon Events**:
     - External hackathon websites
     - Registration links
     - Submission portals
     - Results and leaderboards
   - **Link Management**:
     - Links sent by mentor (with AI assistance)
     - Categorized by topic/skill
     - Difficulty level indicators
     - Completion tracking

2. **Mentor-Recommended Links**
   - Practice problems recommended by mentor
   - AI-generated problem suggestions based on student progress
   - Customized learning paths
   - Problem-solving exercises
   - Link to external platform with pre-filled filters

3. **Student-Managed Links**
   - Students can save external links
   - Organize links by category
   - Track progress on external platforms
   - Mark problems as completed
   - Notes and solutions

4. **Practice Tracking**
   - Problems completed count
   - Time spent practicing
   - Skill improvement tracking
   - Progress visualization
   - Link to external platform profiles

5. **AI-Assisted Problem Solving**
   - Get help finding relevant practice problems
   - AI suggests problems based on:
     - Current course module
     - Skill level
     - Weak areas identified
   - Mentor can use AI to find and send relevant links

**DSA Course Integration**:
- **Recommended DSA Courses**: Link to top DSA courses for hackathon preparation
- **Practice Problems**: DSA course problems integrated with hackathon practice
- **Skill Building**: Use DSA course knowledge in hackathon challenges
- **Problem Solving**: Apply DSA concepts learned from recommended courses

**Mentor Connection:**
- Mentors can help students practice tasks using AI assistance
- Mentors can find and send external hackathon/problem-solving links
- Mentors use AI to identify relevant practice problems for students
- Students manage and track their practice through external links
- Links are sent to student portal for easy access
- Bootcamp mentors can recommend DSA courses for better hackathon performance

---

### 3.15 Notifications Page

**Purpose**: Centralized notification center

**Access**: Accessed through Settings → Notifications section (`/portal/student/settings?section=notifications`)

**Content / Data:**

1. **All Alerts** (Chronological Order)
   - Upcoming classes (15 min / 1 hour before)
   - Assignment due dates (24 hours / 1 week before)
   - Mentor feedback received
   - Scholarship updates (approval / rejection)
   - Hackathon deadlines
   - Test results available
   - Course announcements
   - Project updates
   - Job application updates

2. **Notification Types**
   - Class reminders
   - Assignment deadlines
   - Feedback / Grades
   - Scholarship status
   - Hackathon alerts
   - System notifications
   - Achievement unlocks

3. **Actions**
   - Mark as read / unread
   - Delete notification
   - Filter by type
   - Mark all as read
   - Notification settings

4. **Filters**
   - All notifications
   - Unread only
   - By type (class, assignment, scholarship, hackathon)
   - By date range

**Mentor Connection:**
- Notifications from mentors (feedback, announcements)
- Live class reminders from mentors
- Assignment grading notifications
- Project mentorship updates

---

### 3.16 Mentors Page

**Purpose**: Connect with mentors and view mentor profiles

**Content / Data:**

1. **Mentor List**
   - Mentor profile picture
   - Mentor name
   - Specialization / Skills
   - Rating and reviews
   - Total students
   - Courses taught
   - View profile button

2. **Mentor Profile**
   - Full bio
   - Education background
   - Work experience
   - Courses offered
   - Student testimonials
   - Availability status
   - Contact / Message button

3. **Mentor Courses**
   - List of courses by mentor
   - Course ratings
   - Enroll options

**Mentor Connection:**
- Direct connection to mentor profiles
- Messaging with mentors
- View mentor's teaching history
- Follow / Favorite mentors

---

### 3.17 Settings Page

**Purpose**: Configure account preferences and manage notifications

**Content / Data:**

1. **Profile Settings**
   - Personal information
   - Profile picture
   - Password change
   - Email preferences

2. **Notifications** (Subsection)
   - **Notification Center**: View all notifications
     - All alerts in chronological order
     - Upcoming classes (15 min / 1 hour before)
     - Assignment due dates (24 hours / 1 week before)
     - Mentor feedback received
     - Scholarship updates (approval / rejection)
     - Hackathon deadlines
     - Test results available
     - Course announcements
     - Project updates
     - Job application updates
   - **Notification Types**
     - Class reminders
     - Assignment deadlines
     - Feedback / Grades
     - Scholarship status
     - Hackathon alerts
     - System notifications
     - Achievement unlocks
   - **Notification Actions**
     - Mark as read / unread
     - Delete notification
     - Filter by type
     - Mark all as read
   - **Notification Filters**
     - All notifications
     - Unread only
     - By type (class, assignment, scholarship, hackathon)
     - By date range
   - **Notification Settings**
     - Email notifications toggle
     - Push notifications
     - Notification frequency
     - Types of notifications to receive

3. **Privacy Settings**
   - Profile visibility
   - Data sharing preferences
   - KYC information

4. **Learning Preferences**
   - Preferred learning style
   - Course recommendations
   - Skill interests

5. **Account Settings**
   - Delete account
   - Export data
   - Subscription management

**Mentor Connection:**
- Notifications from mentors (feedback, announcements)
- Live class reminders from mentors
- Assignment grading notifications
- Project mentorship updates

---

## Mentor Portal

### 4.1 Sidebar Menu (Mentor)

The mentor sidebar is organized into categories for better navigation.

#### Overview Category
| Menu Item | Path | Description | Badge |
|-----------|------|-------------|-------|
| **Dashboard** | `/portal/mentor` | Overview & Stats | Live |

#### Teaching Category
| Menu Item | Path | Description |
|-----------|------|-------------|
| **My Courses** | `/portal/mentor/courses` | Create & Manage |
| **Course Vacancies** | `/portal/mentor/vacancies` | Apply for Bundle Courses |
| **Classes** | `/portal/mentor/classes` | Schedule & Manage |
| **Module Tests** | `/portal/mentor/tests` | Create & Manage Tests |

#### Students Category
| Menu Item | Path | Description | Badge |
|-----------|------|-------------|-------|
| **Student Management** | `/portal/mentor/students` | Students & Feedback | Count |
| **Assignments** | `/portal/mentor/assignments` | Review Submissions | Count |

#### Communication Category
| Menu Item | Path | Description | Badge |
|-----------|------|-------------|-------|
| **Messages** | `/portal/mentor/messages` | Unified Inbox | Count |
| **Announcements** | `/portal/mentor/announcements` | Course Updates | - |

#### Analytics & Tools Category
| Menu Item | Path | Description |
|-----------|------|-------------|
| **Analytics** | `/portal/mentor/analytics` | Reports & Metrics |
| **Calendar** | `/portal/mentor/calendar` | Schedule & Events |

#### Settings Category
| Menu Item | Path | Description |
|-----------|------|-------------|
| **Settings** | `/portal/mentor/settings` | Preferences |

---

### 4.2 Dashboard

**Purpose**: Overview of mentor's teaching activity and performance

**Content / Data:**

1. **Welcome Header**
   - Mentor name
   - Reputation score
   - Total students
   - Total courses

2. **Key Metrics**
   - Total students enrolled
   - Active courses
   - Upcoming live classes
   - Pending assignments to review
   - Total revenue / earnings
   - Average course rating

3. **Quick Actions**
   - Create new course
   - Schedule live class
   - Review assignments
   - Send announcement

4. **Performance Insights**
   - Student progress charts
   - Course completion rates
   - Revenue trends
   - Rating trends

5. **Upcoming Sessions**
   - Next live classes
   - Scheduled office hours
   - Upcoming deadlines

6. **Notifications Feed**
   - New student enrollments
   - Assignment submissions
   - Student questions
   - Course verification status

**Student Connection:**
- Shows student enrollment numbers
- Displays student progress across courses
- Links to student management

---

### 4.3 Course Management

**Purpose**: Create, edit, and manage courses

**Content / Data:**

1. **My Courses List**
   - Course cards with:
     - Course thumbnail
     - Course title
     - Enrollment count
     - Revenue generated
     - Average rating
     - Status (Draft / Pending / Published / Rejected)
     - Quick actions (Edit / Delete / Duplicate / Analytics)

2. **Create Course**
   - Course type selection:
     - **Crash Course** (Any category, 2-10 hours, commission-based)
     - **Skill Course** (e.g., React) (Any category, 4-20 hours, commission-based)
     - **Full Career Bootcamp** (IT category only, 2-6 months/80-400 hours, salary-based, via Vacancy)
   - Delivery method selection:
     - **Live**: Scheduled sessions with real-time interaction
     - **Recorded**: Self-paced with pre-recorded content
     - **Mixed**: Combination of both (mentor can configure per module)
   - Basic information:
     - Title, description
     - Category selection (restricted for Bootcamp - IT only)
     - Pricing (Free / Paid) - Free courses: 30 min to 2 hours, recorded only
     - Duration (2-6 months for Bootcamp, time-limited for others)
     - Thumbnail upload
   - **Course Type Restrictions**:
     - Full Career Bootcamp: IT category only, all IT levels, 2-6 months duration
     - Crash/Skill Courses: Any category worldwide, time-limited durations
     - Free courses: 30 minutes to 2 hours, recorded only, any category
   - **Course Type Characteristics**:
     - **Full Career Bootcamp**: Practical focus, job-ready skills, industry certifications, intensive hands-on learning
     - **Crash/Skill Courses**: Skill-specific learning, flexible duration, commission-based compensation
   - Syllabus builder:
     - Add modules
     - Add lessons within modules
     - Upload videos
     - Add video timestamps
     - Set prerequisites
   - Settings:
     - Enrollment limits
     - Certificate configuration
     - Badge system
     - Co-instructors
     - Teaching assistants

3. **Course Detail Page**
   - Full course information
   - Student list
   - Performance analytics
   - Revenue tracking
   - Edit course content
   - Course settings

4. **Course Analytics** (per course)
   - Enrollment trends
   - Student progress
   - Completion rates
   - Revenue breakdown
   - Student feedback
   - Ratings and reviews

**Student Connection:**
- Courses visible to students in catalog
- Students enroll in courses
- Student progress tracked per course
- Student feedback and ratings

---

### 4.4 Vacancy System

**Purpose**: Apply for course vacancies (Bootcamp/Bundle courses)

**Content / Data:**

1. **Available Vacancies**
   - Vacancy title
   - Course type (Bootcamp / Bundle)
   - Requirements
   - Application deadline
   - Commission split
   - Admin pricing
   - Apply button

2. **Application Form**
   - Qualifications upload
   - Portfolio link
   - Demo class video upload
   - Teaching experience
   - Submit application

3. **Application Status**
   - **Pending**: Under admin review
   - **Accepted**: Application approved
   - **Rejected**: Application declined
   - **Verified**: Course created and verified
   - Admin feedback

4. **Application Tracking**
   - Application date
   - Review date
   - Admin notes
   - Next steps

**Student Connection:**
- Vacancies lead to courses students can enroll in
- Approved applications create courses for students

---

### 4.5 Live Classes

**Purpose**: Schedule and manage live teaching sessions

**Content / Data:**

1. **Classes List**
   - Upcoming classes
   - Past classes
   - Class title
   - Date and time
   - Course name
   - Student count
   - Status (Scheduled / Live / Completed)

2. **Create Live Class**
   - Class title
   - Course selection
   - Date and time picker
   - Duration
   - Max students
   - Description
   - Recording option

3. **Live Class Interface** (when hosting)
   - Video conferencing (Jitsi / Zoom)
   - Student list with attendance
   - Chat / Q&A moderation
   - Screen sharing
   - Polls creation
   - Recording controls
   - End class button

4. **Class Recordings**
   - Upload recordings
   - Recording list
   - Make available to students
   - Delete recordings

5. **Attendance Tracking**
   - Student attendance list
   - Attendance percentage
   - Auto-mark attendance
   - Export attendance report

**Student Connection:**
- Students join live classes
- Students see scheduled classes
- Students access recordings
- Attendance tracked for students

---

### 4.6 Student Management

**Purpose**: View and manage enrolled students

**Content / Data:**

1. **Student List**
   - Student profile picture
   - Student name
   - Course enrolled
   - Progress percentage
   - Last active
   - View profile button

2. **Student Profile** (Detailed View)
   - Personal information
   - Education background
   - Skills
   - Course progress:
     - Modules completed
     - Lessons completed
     - Assignments submitted
     - Test scores
     - Overall progress
   - Performance analytics:
     - Time spent
     - Engagement score
     - Completion rate
   - Communication:
     - Send message
     - Send feedback
     - Schedule one-on-one

3. **Student Analytics**
   - Progress over time
   - Engagement metrics
   - Assignment performance
   - Test performance
   - Comparison with class average

4. **Bulk Actions**
   - Send announcement to all students
   - Export student list
   - Filter students

**Student Connection:**
- Direct view of student data
- Mentor can provide personalized guidance
- Mentor tracks student progress

---

### 4.7 Assignments & Projects

**Purpose**: Create assignments and review student submissions

**Content / Data:**

1. **Assignments List**
   - Assignment title
   - Course name
   - Due date
   - Submissions count
   - Pending reviews count
   - Status

2. **Create Assignment**
   - Assignment title
   - Description / Instructions
   - Course / Module selection
   - Due date
   - Points / Weight
   - Submission type (File / Text / Code / Link)
   - Grading rubric
   - Allow resubmission option
   - Attachments / Resources

3. **Student Submissions**
   - Student name
   - Submission date
   - Files submitted
   - Status (Pending / Graded)
   - View submission button

4. **Grade Assignment**
   - Submission view
   - Score input
   - Feedback text editor
   - Rubric scoring
   - Strengths / Weaknesses
   - Improvement suggestions
   - Request resubmission option
   - Save and publish

5. **Project Mentorship**
   - Project list
   - Team members
   - Project progress
   - Milestone tracking
   - Provide guidance
   - Review project deliverables

**Student Connection:**
- Students see assignments created by mentor
- Students submit assignments
- Students receive grades and feedback
- Students see project guidance

---

### 4.8 Module Tests

**Purpose**: Create and manage course assessments

**Content / Data:**

1. **Tests List**
   - Test title
   - Course / Module
   - Questions count
   - Student attempts
   - Average score
   - Status

2. **Create Test**
   - Test title
   - Course / Module selection
   - Duration
   - Passing score
   - Attempts allowed
   - Question types:
     - Multiple Choice
     - True/False
     - Coding questions
     - Essay questions
   - Add questions:
     - Question text
     - Answer options
     - Correct answer
     - Points
     - Explanation

3. **Test Analytics**
   - Student performance
   - Question analysis
   - Average score
   - Pass rate
   - Time taken analysis
   - Difficulty analysis

4. **Test Details**
   - Full test preview
   - Edit questions
   - Publish / Unpublish
   - Delete test

**Student Connection:**
- Students take tests created by mentor
- Students see test results
- Mentor views student test performance

---

### 4.9 Communication

**Purpose**: Communicate with students through messages and announcements

#### Messages (Unified Inbox)

**Content / Data:**

1. **Inbox**
   - Conversation list
   - Unread count
   - Student name
   - Last message preview
   - Timestamp

2. **Conversation View**
   - Message thread
   - Student profile info
   - Send message
   - File attachments
   - Mark as read

3. **Filters**
   - All messages
   - Unread only
   - By course
   - By student

#### Announcements

**Content / Data:**

1. **Announcements List**
   - Announcement title
   - Course name
   - Date posted
   - Student views count

2. **Create Announcement**
   - Title
   - Course selection (or all courses)
   - Content (rich text editor)
   - Attachments
   - Schedule post
   - Publish

3. **Announcement Analytics**
   - Views count
   - Student engagement
   - Read receipts

**Student Connection:**
- Students receive messages from mentors
- Students see announcements in notifications
- Students can reply to messages
- Students view announcements in course pages

---

### 4.10 Analytics

**Purpose**: Comprehensive analytics and reporting

**Content / Data:**

1. **Course Analytics**
   - Enrollment trends
   - Student progress
   - Completion rates
   - Revenue trends
   - Ratings and reviews

2. **Student Performance**
   - Individual student analytics
   - Class performance comparison
   - Engagement metrics
   - Assignment performance
   - Test performance

3. **Financial Analytics**
   - Revenue breakdown
   - Earnings per course
   - Commission tracking
   - Payment history
   - Pending payments

4. **Teaching Analytics**
   - Total teaching hours
   - Student satisfaction
   - Course ratings
   - Student retention
   - Popular content

5. **Class Analytics**
   - Attendance rates
   - Class engagement
   - Recording views
   - Q&A participation

**Student Connection:**
- Analytics based on student activity
- Student progress data
- Student engagement metrics

---

### 4.11 Calendar

**Purpose**: Manage schedule and events

**Content / Data:**

1. **Calendar View**
   - Monthly / Weekly / Daily view
   - Live classes scheduled
   - Office hours
   - Deadlines
   - Personal events

2. **Schedule Management**
   - Create events
   - Edit events
   - Delete events
   - Set reminders

3. **Availability**
   - Set available hours
   - Block unavailable times
   - Time zone settings

**Student Connection:**
- Students see mentor's scheduled classes
- Students can book office hours (if enabled)

---

### 4.12 Settings

**Purpose**: Configure mentor account and preferences

**Content / Data:**

1. **Profile Settings**
   - Personal information
   - Bio
   - Profile picture
   - Social links
   - Expertise areas

2. **Teaching Preferences**
   - Preferred teaching style
   - Availability
   - Student capacity
   - Communication preferences

3. **Notification Settings**
   - Email notifications
   - In-app notifications
   - Notification frequency

4. **Financial Settings**
   - Payment methods
   - Tax information
   - Payout preferences

5. **Privacy Settings**
   - Profile visibility
   - Contact preferences

---

## Student-Mentor Interactions

### 4.1 Course Enrollment Flow

1. **Student** browses course catalog
2. **Student** views course details (created by **Mentor**)
3. **Student** enrolls (payment / scholarship)
4. **Mentor** receives enrollment notification
5. **Student** gains access to course content
6. **Mentor** tracks student enrollment

### 4.2 Assignment Workflow

1. **Mentor** creates assignment in course
2. **Student** receives notification
3. **Student** views assignment details
4. **Student** submits assignment
5. **Mentor** receives submission notification
6. **Mentor** reviews and grades assignment
7. **Student** receives feedback notification
8. **Student** views grade and feedback

### 4.3 Live Class Flow

1. **Mentor** schedules live class
2. **Student** receives class reminder
3. **Student** joins live class (15 min before)
4. **Mentor** hosts class, **Student** participates
5. Attendance auto-marked for **Student**
6. **Mentor** uploads recording (optional)
7. **Student** accesses recording

### 4.4 Communication Flow

1. **Student** sends message to **Mentor**
2. **Mentor** receives in unified inbox
3. **Mentor** replies to **Student**
4. **Student** receives reply notification
5. **Mentor** sends announcement to course
6. **Student** receives announcement notification

### 4.5 Project Mentorship Flow

1. **Student** forms team / creates project
2. **Student** requests mentor guidance
3. **Mentor** accepts mentorship request
4. **Mentor** provides guidance and feedback
5. **Student** updates project progress
6. **Mentor** tracks project milestones

### 4.6 Test Flow

1. **Mentor** creates module test
2. **Student** receives test availability notification
3. **Student** takes test
4. **Student** submits test
5. **Mentor** views test results
6. **Student** views results and feedback

---

## Data Structure Overview

### Student Portal Data

| Feature | Stored Data | Notes |
|---------|-------------|-------|
| **Profile** | Name, email, phone, education, skills, ID, profile picture | KYC status tracked |
| **Courses** | Course id, title, mentor, syllabus, enrollment status, progress | Track progress & completion |
| **Live Classes** | Class id, date/time, attendance, recording URL | Attendance auto-marked |
| **Assignments** | Assignment id, submission file, status, score, mentor feedback | Linked to course |
| **Tests** | Test id, attempts, scores, answers, feedback | Linked to course/module |
| **AI Interviews** | Session id, type (coding / HR), feedback, score | Optional module |
| **Scholarships** | Scholarship id, sponsor, eligibility, documents, status | Track applied / approved |
| **Entrepreneur Zone** | Team id, project id, tasks, mentor feedback, progress | Revenue / equity info backend |
| **Jobs / Freelance** | Job id, employer, milestones, status, payment info | Status tracking & escrow |
| **Hackathons** | Hackathon id, submission, status, certificate | Achievements updated automatically |
| **Notifications** | Notification id, type, content, read/unread | Linked to user activity |

### Mentor Portal Data

| Feature | Stored Data | Notes |
|---------|-------------|-------|
| **Profile** | Name, email, bio, expertise, rating, reputation score | Verified status tracked |
| **Courses** | Course id, title, syllabus, students, revenue, status | Track performance & earnings |
| **Live Classes** | Class id, schedule, students, attendance, recording | Attendance tracking |
| **Assignments** | Assignment id, submissions, grades, feedback | Linked to course |
| **Tests** | Test id, questions, student attempts, analytics | Performance tracking |
| **Students** | Student id, progress, performance, communication | Per-course tracking |
| **Messages** | Message id, student, content, read status | Unified inbox |
| **Announcements** | Announcement id, course, content, views | Engagement tracking |
| **Analytics** | Metrics, trends, reports, performance data | Aggregated from activities |
| **Vacancies** | Vacancy id, application, status, admin feedback | Application tracking |
| **Financial** | Earnings, commissions, payments, revenue | Payment tracking |

---

## Integration Points

### 5.1 Real-Time Synchronization

- **Student Progress** → **Mentor Analytics**: Student course progress updates mentor analytics in real-time
- **Assignment Submission** → **Mentor Inbox**: New submissions trigger notifications for mentors
- **Live Class Attendance** → **Student Profile**: Attendance automatically updates student records
- **Test Completion** → **Mentor Analytics**: Test results immediately available to mentors

### 5.2 Notification System

- **Bidirectional Notifications**: Both students and mentors receive relevant notifications
- **Event-Driven**: Notifications triggered by actions (submissions, grades, classes, etc.)
- **Unified Inbox**: Mentors have unified inbox for all student communications

### 5.3 Data Sharing

- **Student Profile** → **Mentor View**: Mentors can view student profiles (with permissions)
- **Mentor Profile** → **Student View**: Students can view mentor profiles and ratings
- **Course Data**: Shared between student and mentor views with role-specific information

### 5.4 Communication Channels

- **Direct Messaging**: One-on-one communication between student and mentor
- **Course Announcements**: Broadcast messages from mentor to all enrolled students
- **Assignment Feedback**: Structured feedback system integrated with assignments
- **Live Class Chat**: Real-time communication during live sessions

### 5.5 Progress Tracking

- **Student Progress** → **Mentor Dashboard**: Mentors see aggregated student progress
- **Individual Tracking**: Mentors can drill down to individual student progress
- **Analytics Integration**: Progress data feeds into mentor analytics

### 5.6 Financial Integration

- **Course Enrollment** → **Mentor Earnings**: Student payments contribute to mentor revenue
- **Commission Tracking**: Mentors see commission breakdown per course
- **Payment History**: Both students and mentors track financial transactions

---

## Conclusion

This comprehensive guide documents the complete Student and Mentor Portal features, their interconnections, and data structures. The platform facilitates seamless learning experiences through:

- **Course Management**: Mentors create, students enroll
- **Content Delivery**: Videos, live classes, assignments, tests
- **Progress Tracking**: Real-time progress monitoring for both roles
- **Communication**: Multiple channels for student-mentor interaction
- **Analytics**: Comprehensive insights for mentors, progress tracking for students
- **Supporting Features**: Scholarships, jobs, hackathons, entrepreneur zone

The integration between Student and Mentor portals ensures a cohesive learning ecosystem where mentors can effectively teach and students can successfully learn.

---

*Last Updated: [Current Date]*
*Version: 1.0*


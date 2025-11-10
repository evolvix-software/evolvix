# Evolvix Course System - Complete Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Course Types & Categories](#course-types--categories)
3. [Mentor Portal Guide](#mentor-portal-guide)
4. [Admin Portal Guide](#admin-portal-guide)
5. [Student Portal Guide](#student-portal-guide)
6. [Scholarship Provider Portal Guide](#scholarship-provider-portal-guide)
7. [Payment & Enrollment Flows](#payment--enrollment-flows)
8. [Certification & Progress Tracking](#certification--progress-tracking)
9. [Career Paths](#career-paths)
10. [FAQs](#faqs)

---

## System Overview

Evolvix is a comprehensive online learning platform that connects mentors, students, and scholarship providers. The system supports multiple course types, flexible payment options, and structured learning paths to make quality education accessible and affordable.

### Key Features
- **Multiple Course Types**: Crash courses, skill-focused courses, bootcamps, and master bundles
- **Flexible Payment**: Full payment or 3-4 installment plans
- **Scholarship System**: Support for eligible students
- **Career Paths**: Structured learning journeys
- **Progress Tracking**: Real-time progress monitoring
- **Certification**: Auto-generated certificates upon completion
- **Mentor Reputation**: Quality scoring system

---

## Course Types & Categories

### 1. Crash Course
- **Duration**: 1-2 hours (optional)
- **Pricing**: Free or Paid
- **Vacancy Required**: ❌ No
- **Scholarship**: ❌ Not Available
- **Delivery**: Live or Recorded
- **Best For**: Quick skill introductions, concept overviews

**Examples:**
- "React Hooks in 90 Minutes"
- "Introduction to Figma"
- "Python Basics Crash Course"

### 2. Skill-Focused Course
- **Duration**: 5-10 hours (optional)
- **Pricing**: Free or Paid
- **Vacancy Required**: ❌ No
- **Scholarship**: ❌ Not Available
- **Delivery**: Live or Recorded
- **Best For**: Learning specific skills or tools

**Examples:**
- "Complete React Course"
- "UI/UX Design Fundamentals"
- "Node.js Backend Development"

### 3. Full Career Bootcamp
- **Duration**: 20-60 hours (optional)
- **Pricing**: Scholarship-Based (Regular + Scholarship enrollment)
- **Vacancy Required**: ✅ Yes
- **Scholarship**: ✅ Available
- **Delivery**: Live or Recorded
- **Best For**: Career-focused intensive training

**Examples:**
- "Full Stack Web Developer Bootcamp"
- "Data Science Career Bootcamp"
- "Digital Marketing Bootcamp"

### 4. Masterclass/Bundle
- **Duration**: 4-6 months (optional)
- **Pricing**: Scholarship-Based (Regular + Scholarship enrollment)
- **Vacancy Required**: ✅ Yes
- **Scholarship**: ✅ Available
- **Delivery**: Live or Recorded
- **Best For**: Comprehensive master-level programs

**Examples:**
- "Full Stack Master Course"
- "UI/UX Design Master Program"
- "Cybersecurity Masterclass"

---

## Mentor Portal Guide

### Overview
The Mentor Portal allows instructors to create, manage, and teach courses on Evolvix. Mentors can create various course types and earn through commission-based payments.

### Key Features

#### 1. Course Creation
**Location**: `/portal/mentor/courses`

**Features:**
- Create Crash, Skill-Focused, Bootcamp, or Bundle courses
- Auto-detection of course category from duration
- Support for Live and Recorded course types
- Rich content editor for modules and lessons
- Project configuration
- Prerequisites management

**Course Creation Flow:**
1. **Select Course Category** (if new course)
   - Choose: Crash, Skill-Focused, Bootcamp, or Bundle
   - Bootcamp/Bundle courses require vacancy application first
2. **Basic Information**
   - Course title, description, category, level
   - Duration (optional - auto-detects category)
   - Pricing (with installment option)
3. **Schedule** (for Live courses)
   - Set frequency, days, time
   - Allow student preferences
4. **Content**
   - Create modules and lessons
   - Add videos, assignments, tests
   - Configure timestamps for recorded courses
5. **Projects**
   - Define course projects
   - Set submission requirements
6. **Settings**
   - Enrollment limits
   - Visibility settings
   - Certificate configuration
   - Badges and achievements
7. **Review & Submit**
   - Review all course details
   - Submit for publication

#### 2. Vacancy Application System
**Location**: `/portal/mentor/vacancies`

**For Bootcamp/Bundle Courses:**
1. **Browse Vacancies**
   - View available course vacancies by category
   - Filter by duration, status, category
   - See admin pricing and commission splits

2. **Apply for Vacancy**
   - Submit qualifications and certifications
   - Upload demo class video (required)
   - Provide portfolio/experience
   - Write cover letter

3. **Application Status**
   - Track application status (Pending, Accepted, Verified, Rejected)
   - View admin feedback
   - Once verified, create course gig

4. **Create Course Gig**
   - Build course content
   - Submit for admin verification
   - Review and sign contract
   - Publish course

#### 3. Course Management
**Location**: `/portal/mentor/courses/[id]`

**Features:**
- **Overview**: Course statistics, enrolled students
- **Analytics**: Enrollment trends, completion rates, revenue
- **Settings**: Pricing, enrollment limits, access control
- **Communication**: Announcements, forums, FAQ
- **Performance**: Student progress tracking, engagement metrics
- **Submission Review**: Review student project submissions (for bundle courses)

#### 4. Dashboard
**Location**: `/portal/mentor/dashboard`

**Features:**
- **Stats Grid**: Total courses, students, revenue, ratings
- **Performance Insights**: Top courses, revenue trends
- **Notifications**: Activity feed, student messages
- **Quick Actions**: Create course, view applications, manage classes
- **Upcoming Sessions**: Live class schedule

#### 5. Live Classes Management
**Location**: `/portal/mentor/classes`

**Features:**
- Create live classes for enrolled students
- Schedule sessions based on student preferences
- Manage class recordings
- Track attendance

#### 6. Projects & Submissions
**Location**: `/portal/mentor/courses/[id]` → Projects tab

**Features:**
- Review student project submissions
- Provide feedback and grades
- Track submission status
- Approve/reject submissions

#### 7. Earnings & Payments
**Features:**
- View commission earnings
- Track payment distributions
- See pending and completed payments
- Payment history

**Commission Structure:**
- **Crash/Skill-Focused**: Standard platform fee (varies)
- **Bootcamp/Bundle**: Admin-set commission split (typically 30% Evolvix, 70% Mentor)

#### 8. Reputation System
**Features:**
- Track reputation score (0-100)
- View verified courses count
- Monitor average ratings
- See total students taught

**Reputation Score Factors:**
- Average rating (40% weight)
- Verified courses (30% weight)
- Completion rate (20% weight)
- Total students (10% weight)

---

## Admin Portal Guide

### Overview
The Admin Portal provides comprehensive control over the platform, including vacancy management, application review, course verification, and career path creation.

### Key Features

#### 1. Course Vacancy Management
**Location**: `/admin/vacancies`

**Features:**
- **Create Vacancies**
  - Set course category (Bootcamp or Bundle)
  - Define requirements and skills
  - Set admin pricing
  - Configure commission split
  - Set application deadline

- **Edit Vacancies**
  - Update vacancy details
  - Change pricing and commission
  - Extend deadlines

- **Manage Status**
  - Open, Close, or Mark as Filled
  - Track applications per vacancy

**Vacancy Fields:**
- Title and description
- Category (Development, Design, Cybersecurity, etc.)
- Course category (Bootcamp or Bundle)
- Duration (optional)
- Admin pricing
- Commission split (Evolvix % / Mentor %)
- Requirements and skills
- Level (Beginner, Intermediate, Advanced)
- Deadline

#### 2. Mentor Application Review
**Location**: `/admin/applications`

**Features:**
- **View Applications**
  - See all mentor applications
  - Filter by status (Pending, Accepted, Verified, Rejected)
  - View application details

- **Review Process**
  - Review qualifications
  - Watch demo class videos
  - Check portfolio and experience
  - Read cover letters

- **Actions**
  - **Accept**: Mentor can create course
  - **Verify**: Mentor approved, can create course (with verification badge)
  - **Reject**: Application declined with reason
  - **Add Notes**: Internal admin notes

**Application Details:**
- Mentor information
- Qualifications and certifications
- Demo class video/file
- Portfolio URL/file
- Experience summary
- Cover letter
- Application date

#### 3. Course Verification
**Location**: `/admin/course-verification`

**Features:**
- **Review Submitted Courses**
  - View course content
  - Check modules and lessons
  - Review pricing proposal

- **Verification Actions**
  - **Set Final Pricing**: Adjust course price
  - **Upload Contract**: Add contract document
  - **Set Commission Split**: Finalize commission percentages
  - **Approve**: Course ready for mentor signature
  - **Reject**: Request changes

- **Contract Management**
  - Upload contract PDF
  - Track mentor signature status
  - Send reminders for unsigned contracts

- **Publish Course**
  - Final approval to publish
  - Course becomes visible to students

**Verification Workflow:**
1. Mentor submits course for verification
2. Admin reviews course content
3. Admin sets final pricing and commission
4. Admin uploads contract
5. Mentor signs contract
6. Admin publishes course

#### 4. Career Path Management
**Location**: `/admin/career-paths`

**Features:**
- **Create Career Paths**
  - Group multiple bootcamp/bundle courses
  - Set career outcome
  - Define course order
  - Mark courses as required/optional
  - Set path duration and pricing

- **Manage Paths**
  - Edit path details
  - Reorder courses
  - Update pricing
  - Enable/disable scholarship

**Career Path Structure:**
- Title and description
- Career outcome (e.g., "Job-ready Full Stack Developer")
- Duration (e.g., "6 months")
- Courses (ordered list with required/optional flags)
- Category and level
- Optional bundle pricing
- Scholarship availability

#### 5. Platform Analytics
**Features:**
- Course performance metrics
- Enrollment statistics
- Revenue tracking
- Mentor performance
- Student completion rates
- Scholarship distribution

#### 6. User Management
**Features:**
- Manage mentors, students, scholarship providers
- View user statistics
- Handle account issues
- Monitor platform activity

---

## Student Portal Guide

### Overview
The Student Portal provides a comprehensive learning experience with course browsing, enrollment, progress tracking, and certification.

### Key Features

#### 1. Course Discovery
**Location**: `/portal/student/courses`

**Features:**
- **Browse Courses**
  - Filter by category, level, price
  - Search courses
  - View course details
  - See ratings and reviews

- **Course Cards Display**
  - Course thumbnail
  - Title and short description
  - Category badges (Crash, Skill, Bootcamp, Bundle)
  - Price and installment availability
  - Scholarship availability badge
  - Rating and student count

#### 2. Course Enrollment
**Location**: `/portal/student/courses/[id]`

**Enrollment Options:**

**A. Free Courses**
- Direct enrollment
- Immediate access

**B. Paid Courses**
- **Full Payment**: Pay entire amount upfront
- **Installment Plan**: Split into 3 or 4 payments
  - First payment required at enrollment
  - Remaining installments auto-scheduled (30 days apart)
  - Course access granted after first payment

**C. Scholarship Application** (Bootcamp/Bundle only)
- Apply for scholarship
- Provide documents (transcripts, income proof)
- Wait for approval
- If approved: Free access
- If rejected: Can still enroll with payment

**Enrollment Flow:**
1. Click "Enroll" button
2. Select payment method (Full or Installment)
3. If installment: Choose 3 or 4 installments
4. View payment schedule
5. Complete payment
6. Get immediate course access

#### 3. Learning Experience

**Course Dashboard:**
- Course overview
- Module list with progress
- Instructor information
- Course materials

**Content Types:**
- **Recorded Courses**:
  - Video lessons with timestamps
  - Assignments
  - Tests/quizzes
  - Downloadable resources

- **Live Courses**:
  - Scheduled live sessions
  - Join live classes
  - Access recordings
  - Interactive Q&A

**Progress Tracking:**
- Module completion status
- Lesson progress
- Overall completion percentage
- Time spent learning

#### 4. Projects & Submissions
**Features:**
- View project requirements
- Submit projects
- Track submission status
- Receive mentor feedback
- Resubmit if needed

#### 5. Certificates
**Features:**
- **Auto-Generation**: Certificate issued at 80-90% completion
- **Verified Certificates**: Mentor-signed for bootcamp/bundle courses
- **Download**: PDF certificate download
- **Share**: Share certificate on LinkedIn, portfolio

**Certificate Eligibility:**
- Complete 80-90% of course content
- Submit required projects
- Pass assessments (if applicable)

#### 6. Career Paths
**Location**: `/portal/student/career-paths` (if implemented)

**Features:**
- Browse structured career paths
- See learning journey
- Enroll in entire path or individual courses
- Track path progress

#### 7. My Courses
**Location**: `/portal/student/my-courses`

**Features:**
- View all enrolled courses
- See progress for each course
- Continue learning
- Access certificates
- View completion status

#### 8. Profile & Settings
**Features:**
- Update profile
- View certificates
- Payment history
- Scholarship applications status
- Notification preferences

---

## Scholarship Provider Portal Guide

### Overview
The Scholarship Provider Portal allows organizations and individuals to review and approve scholarship applications for eligible students.

### Key Features

#### 1. Scholarship Applications Review
**Location**: `/portal/scholarship-provider/applications` (to be implemented)

**Features:**
- **View Applications**
  - See all scholarship applications
  - Filter by course, status, date
  - View student profiles

- **Application Details**
  - Student information
  - Academic records (transcripts, GPA)
  - Financial documents (income proof)
  - Personal statement
  - Course details

- **Review Process**
  - Verify academic records
  - Check financial need
  - Review eligibility criteria
  - Assess student motivation

#### 2. Approval/Rejection
**Features:**
- **Approve Application**
  - Grant full scholarship
  - Grant partial scholarship
  - Set conditions/requirements

- **Reject Application**
  - Provide rejection reason
  - Suggest alternatives
  - Allow reapplication

#### 3. Scholarship Management
**Features:**
- Set scholarship criteria
- Define eligibility requirements
- Set budget limits
- Track scholarship distribution
- Monitor student progress

#### 4. Reports & Analytics
**Features:**
- Scholarship distribution reports
- Student success metrics
- Course completion rates
- ROI analysis
- Impact assessment

---

## Payment & Enrollment Flows

### Regular Enrollment Flow

```
Student → Browse Course → Select Enrollment
  ├─ Free Course:
  │   └─ Direct Enrollment → Immediate Access
  │
  └─ Paid Course:
      ├─ Payment Method Selection:
      │   ├─ Full Payment:
      │   │   ├─ Pay $X upfront
      │   │   └─ Get immediate access
      │   │
      │   └─ Installment Plan:
      │       ├─ Choose 3 or 4 installments
      │       ├─ Pay first installment ($X/3 or $X/4)
      │       ├─ Get immediate access
      │       ├─ Remaining installments auto-scheduled
      │       └─ Receive payment reminders
      │
      └─ Payment Processing:
          ├─ Credit/Debit Card
          ├─ Bank Transfer
          └─ Digital Wallet
```

### Scholarship Enrollment Flow

```
Student → Browse Course → Apply for Scholarship
  ├─ Fill Application Form:
  │   ├─ Personal Information
  │   ├─ Academic Records (transcripts, GPA)
  │   ├─ Financial Documents (income proof)
  │   └─ Personal Statement
  │
  ├─ Submit Application
  │
  └─ Wait for Review:
      ├─ Scholarship Provider Reviews:
      │   ├─ Verify documents
      │   ├─ Check eligibility
      │   └─ Assess need
      │
      └─ Decision:
          ├─ Approved:
          │   ├─ Student enrolled (free)
          │   ├─ Course access granted
          │   └─ Track scholarship status
          │
          └─ Rejected:
              ├─ Student notified with reason
              └─ Can still enroll with payment
```

### Commission Distribution Flow

```
Student Payment → Platform Processing
  ├─ Calculate Commission:
  │   ├─ Platform Cut (Evolvix %)
  │   └─ Mentor Cut (Mentor %)
  │
  ├─ Create Distribution Record:
  │   ├─ Payment ID
  │   ├─ Course ID
  │   ├─ Mentor ID
  │   ├─ Amounts
  │   └─ Status: Pending
  │
  └─ Process Distribution:
      ├─ Platform Cut → Evolvix Account
      └─ Mentor Cut → Mentor Account (Stripe Connect/RazorpayX)
```

---

## Certification & Progress Tracking

### Progress Tracking

**Metrics Tracked:**
- Modules completed
- Lessons completed
- Time spent
- Assignments submitted
- Tests passed
- Projects completed
- Overall percentage

**Progress Calculation:**
```
Progress % = (Completed Modules / Total Modules) × 100
```

### Certificate Generation

**Auto-Certificate System:**
- **Threshold**: 80-90% course completion
- **Requirements**:
  - Complete required modules
  - Submit projects (if applicable)
  - Pass assessments (if applicable)

**Certificate Types:**
1. **Standard Certificate**: For crash/skill-focused courses
2. **Verified Certificate**: Mentor-signed for bootcamp/bundle courses

**Certificate Contents:**
- Student name
- Course title
- Instructor name
- Completion date
- Progress percentage
- Mentor signature (for verified courses)
- Certificate ID

**Certificate Features:**
- PDF download
- Shareable link
- LinkedIn integration
- Verification code

---

## Career Paths

### Overview
Career Paths group multiple bootcamp/bundle courses into structured learning journeys that guide students toward specific career outcomes.

### Features

**For Students:**
- Browse career paths
- See learning journey
- Enroll in entire path or individual courses
- Track path progress
- Get path completion certificate

**For Admins:**
- Create career paths
- Group courses in order
- Set required/optional courses
- Define career outcomes
- Set path pricing

**Example Career Path:**
```
Full Stack Developer Path
├─ Course 1: HTML & CSS Fundamentals (Required)
├─ Course 2: JavaScript Bootcamp (Required)
├─ Course 3: React Masterclass (Required)
├─ Course 4: Node.js Bundle (Required)
└─ Course 5: DevOps Masterclass (Optional)

Duration: 6 months
Outcome: Job-ready Full Stack Developer
```

---

## FAQs

### For Mentors

**Q: How do I create a bootcamp or bundle course?**
A: You must first apply for a vacancy through `/portal/mentor/vacancies`. Once your application is verified, you can create the course.

**Q: Can I set my own price for bootcamp/bundle courses?**
A: Admin sets the final pricing during verification. You can propose a price, but admin has final approval.

**Q: How are installments handled?**
A: Students can choose 3 or 4 installments. You receive payment as installments are paid, according to your commission split.

**Q: What's the difference between bootcamp and bundle?**
A: Bootcamp is typically 20-60 hours, while Bundle is 4-6 months. Both require vacancies and support scholarships.

**Q: How is my reputation score calculated?**
A: Reputation = (Rating × 40%) + (Verified Courses × 30%) + (Completion Rate × 20%) + (Total Students × 10%)

### For Students

**Q: Can I pay in installments?**
A: Yes! All paid courses support 3 or 4 installment plans. First payment grants immediate access.

**Q: Who can apply for scholarships?**
A: Students with high college scores/GPA or from lower middle class backgrounds can apply for bootcamp/bundle courses.

**Q: When do I get my certificate?**
A: Certificates are auto-generated when you complete 80-90% of the course content.

**Q: Can I get a refund?**
A: Refund policies vary by course. Check the course details or contact support.

**Q: What's the difference between live and recorded courses?**
A: Live courses have scheduled sessions with real-time interaction. Recorded courses are self-paced with pre-recorded videos.

### For Admins

**Q: How do I create a vacancy?**
A: Go to `/admin/vacancies`, click "Create Vacancy", fill in details, set pricing and commission split.

**Q: What's the typical commission split?**
A: Common splits are 30% Evolvix / 70% Mentor, but you can adjust per vacancy.

**Q: How do I verify a course?**
A: Review course content, set final pricing, upload contract, and wait for mentor signature before publishing.

**Q: Can I edit a published course?**
A: Published courses can be edited, but major changes may require re-verification.

### For Scholarship Providers

**Q: How do I review applications?**
A: Access the scholarship provider portal, view applications, verify documents, and approve/reject based on criteria.

**Q: What criteria should I use?**
A: Consider academic merit, financial need, motivation, and alignment with scholarship goals.

**Q: Can I set my own criteria?**
A: Yes, you can define eligibility criteria, budget limits, and requirements per scholarship program.

---

## Support & Resources

### Documentation
- Course System Architecture: `COURSE_SYSTEM_ARCHITECTURE.md`
- Bundle Course System: `BUNDLE_COURSE_SYSTEM.md`
- Enterprise Enhancements: `ENTERPRISE_ENHANCEMENTS.md`
- Implementation Roadmap: `IMPLEMENTATION_ROADMAP.md`

### Contact
- Support Email: support@evolvix.com
- Mentor Support: mentors@evolvix.com
- Admin Support: admin@evolvix.com

---

## Version History

- **v1.0** (Current): Initial course system with all core features
- Career Paths, Auto-Detection, Certificates, Reputation System, Payment Distribution

---

*Last Updated: [Current Date]*


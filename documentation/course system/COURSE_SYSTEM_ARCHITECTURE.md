# Evolvix Course System Architecture

## Overview

Evolvix offers a comprehensive course system that supports multiple course types, delivery methods, and pricing models to make education accessible and affordable. This document outlines the complete course architecture, vacancy system, and how different course types integrate.

## Course Types & Classification

### 1. Course Duration Categories

| Course Type | Duration | Pricing Model | Vacancy System | Delivery Methods |
|------------|----------|---------------|----------------|------------------|
| **Crash Course** | - | Free or Paid | ❌ Not Required | Live or Recorded |
| **Skill-Focused** | - | Free or Paid | ❌ Not Required | Live or Recorded |
| **Full Career Bootcamp** | - | Scholarship-Based | ✅ Required | Live or Recorded |
| **Masterclass/Bundle** | - | Scholarship-Based | ✅ Required | Live or Recorded |

### 2. Course Delivery Methods

- **Live Courses**: Scheduled sessions with real-time interaction
- **Recorded Courses**: Self-paced with pre-recorded content

Both delivery methods can be used for any course type.

### 3. Pricing Models

#### A. Free Courses
- Available for: Crash Courses, Skill-Focused Courses
- No payment required
- Direct enrollment
- No vacancy system needed

#### B. Paid Courses
- Available for: Crash Courses, Skill-Focused Courses
- Fixed price set by mentor
- Direct enrollment
- No vacancy system needed

#### C. Scholarship-Based Courses
- Available for: Full Career Bootcamp, Masterclass/Bundle
- **Dual Enrollment Model**:
  - Regular enrollment: Students pay full price or installments (3-4 splits)
  - Scholarship enrollment: Eligible students apply for scholarship
- Requires vacancy system
- Admin-controlled pricing

#### D. Installment Payment System
- **Available for**: All paid courses (Crash, Skill-Focused, Bootcamp, Bundle)
- **Payment Options**:
  - Full payment: Pay entire course fee upfront
  - Installment plan: Split payment into 3 or 4 equal installments
- **Installment Rules**:
  - Student can choose 3 or 4 installments
  - Each installment is equal (total price ÷ number of installments)
  - First installment required at enrollment
  - Subsequent installments scheduled automatically
  - Course access granted after first payment
  - Access continues if installments are paid on time
- **Benefits**:
  - Makes courses more affordable
  - Increases enrollment accessibility
  - Reduces financial burden on students

## Vacancy System Architecture

### When Vacancies Are Required

Vacancies are **ONLY** required for:
1. **Full Career Bootcamp** (20-60 hours)
2. **Masterclass/Bundle** (40-80 hours / 4-6 months)

### Vacancy Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    VACANCY WORKFLOW                         │
└─────────────────────────────────────────────────────────────┘

1. ADMIN CREATES VACANCY
   ├─ Sets course category (development, design, etc.)
   ├─ Defines duration (20-60h for bootcamp, 4-6mo for bundle)
   ├─ Sets admin pricing
   ├─ Configures commission split
   └─ Sets application deadline

2. MENTOR APPLIES FOR VACANCY
   ├─ Submits qualifications & certifications
   ├─ Uploads demo class video
   ├─ Provides portfolio/experience
   └─ Writes cover letter

3. ADMIN REVIEWS APPLICATION
   ├─ Reviews qualifications
   ├─ Watches demo class
   ├─ Accepts/Rejects/Verifies
   └─ If verified → Mentor can create course

4. MENTOR CREATES COURSE
   ├─ Course type: Live or Recorded
   ├─ Duration matches vacancy (20-60h or 4-6mo)
   ├─ Builds course content
   └─ Submits for verification

5. ADMIN VERIFIES COURSE
   ├─ Reviews course content
   ├─ Sets final pricing
   ├─ Uploads contract
   └─ Sends to mentor

6. MENTOR SIGNS CONTRACT
   └─ Course published → Visible to students

7. STUDENT ENROLLMENT
   ├─ Regular: Pay full price
   └─ Scholarship: Apply (if eligible)
```

## Course Type Matrix

### Crash Course
```
┌─────────────────────────────────────────┐
│ CRASH COURSE                            │
├─────────────────────────────────────────┤
│ Duration: -                             │
│ Pricing: Free or Paid                   │
│ Vacancy: ❌ Not Required                │
│ Delivery: Live or Recorded              │
│ Scholarship: ❌ Not Available           │
│ Enrollment: Direct                      │
│ Payment: Full payment or Installments  │
└─────────────────────────────────────────┘

Examples:
- "React Hooks Crash Course"
- "Introduction to Figma"
- "Python Basics Crash Course"
```

### Skill-Focused Course
```
┌─────────────────────────────────────────┐
│ SKILL-FOCUSED COURSE                    │
├─────────────────────────────────────────┤
│ Duration: -                             │
│ Pricing: Free or Paid                   │
│ Vacancy: ❌ Not Required                │
│ Delivery: Live or Recorded              │
│ Scholarship: ❌ Not Available           │
│ Enrollment: Direct                      │
│ Payment: Full payment or Installments  │
└─────────────────────────────────────────┘

Examples:
- "Complete React Course"
- "UI/UX Design Fundamentals"
- "Node.js Backend Development"
```

### Full Career Bootcamp
```
┌─────────────────────────────────────────┐
│ FULL CAREER BOOTCAMP                     │
├─────────────────────────────────────────┤
│ Duration: -                             │
│ Pricing: Scholarship-Based              │
│ Vacancy: ✅ REQUIRED                     │
│ Delivery: Live or Recorded              │
│ Scholarship: ✅ Available                │
│ Enrollment: Regular or Scholarship       │
│ Payment: Full payment or Installments   │
└─────────────────────────────────────────┘

Examples:
- "Full Stack Web Developer Bootcamp"
- "Data Science Career Bootcamp"
- "Digital Marketing Bootcamp"
```

### Masterclass/Bundle
```
┌─────────────────────────────────────────┐
│ MASTERCLASS/BUNDLE                      │
├─────────────────────────────────────────┤
│ Duration: -                             │
│ Pricing: Scholarship-Based              │
│ Vacancy: ✅ REQUIRED                    │
│ Delivery: Live or Recorded              │
│ Scholarship: ✅ Available                │
│ Enrollment: Regular or Scholarship       │
│ Payment: Full payment or Installments   │
└─────────────────────────────────────────┘

Examples:
- "Full Stack Master Course"
- "UI/UX Design Master Program"
- "Cybersecurity Masterclass"
```

## Implementation Details

### Course Creation Flow

#### For Crash/Skill-Focused Courses (No Vacancy)
```
Mentor → Create Course Directly
  ├─ Select course type (Live/Recorded)
  ├─ Set price (Free or Paid)
  ├─ Build content
  └─ Publish immediately
```

#### For Bootcamp/Bundle Courses (With Vacancy)
```
Mentor → Browse Vacancies → Apply → Get Verified → Create Course
  ├─ Must apply through vacancy system
  ├─ Admin verifies application
  ├─ Create course (linked to vacancy)
  ├─ Submit for verification
  ├─ Admin verifies & sets pricing
  ├─ Sign contract
  └─ Publish
```

#### Student Enrollment & Payment Flow
```
Student → Browse Course → Select Enrollment Option
  ├─ Regular Enrollment:
  │   ├─ Choose payment method:
  │   │   ├─ Full Payment (one-time)
  │   │   └─ Installment Plan (3 or 4 splits)
  │   ├─ If Installment:
  │   │   ├─ Pay first installment
  │   │   ├─ Get course access
  │   │   ├─ Schedule remaining installments
  │   │   └─ Auto-charge on due dates
  │   └─ If Full Payment:
  │       ├─ Pay full amount
  │       └─ Get course access
  │
  └─ Scholarship Enrollment:
      ├─ Fill scholarship application
      ├─ Submit documents
      ├─ Wait for approval
      └─ If approved: Free access
```

### Database Schema

#### Course Interface
```typescript
interface Course {
  // Basic Info
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  
  // Duration & Type
  duration: string; // Optional - can be blank
  courseType: 'live' | 'recorded';
  courseCategory: 'crash' | 'skill-focused' | 'bootcamp' | 'bundle';
  
  // Pricing
  price: number;
  scholarshipAvailable: boolean; // Only for bootcamp/bundle
  installmentEnabled: boolean; // Allow installment payments
  installmentOptions: number[]; // [3, 4] - number of installments allowed
  
  // Vacancy System (only for bootcamp/bundle)
  isBundleCourse?: boolean; // true for bootcamp/bundle
  vacancyId?: string; // Linked vacancy
  applicationId?: string; // Mentor's application
  adminPricing?: number; // Set by admin
  commissionSplit?: {
    evolvix: number;
    mentor: number;
  };
  courseStatus?: 'draft' | 'pending-verification' | 'verified' | 'published';
  
  // Content
  modules: Module[];
  schedule?: CourseSchedule; // For live courses
  // ... other fields
}
```

#### Vacancy Interface
```typescript
interface CourseVacancy {
  id: string;
  title: string;
  category: string;
  description: string;
  
  // Duration (optional)
  duration: string; // Can be blank
  courseCategory: 'bootcamp' | 'bundle'; // Determined by admin
  
  // Pricing
  adminPricing: number;
  commissionSplit: {
    evolvix: number;
    mentor: number;
  };
  
  // Requirements
  requirements: string[];
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  
  // Status
  status: 'open' | 'closed' | 'filled';
  deadline: string;
  applications: CourseApplication[];
}
```

## Course Category Detection Logic

```typescript
// Course category is set manually by mentor/admin, not auto-detected from duration
// Duration field is optional and can be left blank

function requiresVacancy(courseCategory: string): boolean {
  return courseCategory === 'bootcamp' || courseCategory === 'bundle';
}

function allowsScholarship(courseCategory: string): boolean {
  return courseCategory === 'bootcamp' || courseCategory === 'bundle';
}

function allowsInstallments(courseCategory: string, price: number): boolean {
  // All paid courses allow installments
  return price > 0;
}
```

## UI/UX Flow

### Mentor Course Creation

#### Step 1: Course Type Selection
```
┌─────────────────────────────────────┐
│ Create New Course                   │
├─────────────────────────────────────┤
│                                     │
│  Select Course Category:            │
│  ○ Crash Course                    │
│  ○ Skill-Focused                   │
│  ○ Full Career Bootcamp            │
│  ○ Masterclass/Bundle               │
│                                     │
│  Select Delivery Method:            │
│  ○ Live                            │
│  ○ Recorded                        │
│                                     │
│  Duration (Optional):               │
│  [________________]                 │
│                                     │
└─────────────────────────────────────┘
```

#### Step 2: Vacancy Check
```typescript
if (courseCategory === 'bootcamp' || courseCategory === 'bundle') {
  // Redirect to vacancies page
  // Show message: "This course type requires applying through vacancies"
  router.push('/portal/mentor/vacancies');
} else {
  // Proceed with direct course creation
  // Show course form
}
```

### Vacancy Application Flow

```
Vacancies Page
  ├─ Shows categories (Development, Design, etc.)
  ├─ Click category → Shows vacancies
  ├─ Filter by:
  │   ├─ Duration (20-60h for bootcamp, 4-6mo for bundle)
  │   └─ Status (Open, Closed, Filled)
  └─ Click vacancy → Apply

Application Form
  ├─ Qualifications & Certifications
  ├─ Demo Class Video (Required)
  ├─ Portfolio/Experience
  └─ Cover Letter

Application Status
  ├─ Pending → Waiting for admin review
  ├─ Accepted → Can create course
  ├─ Verified → Can create course (approved)
  └─ Rejected → Cannot proceed
```

## Scholarship System

### Eligibility Criteria

Students can apply for scholarship if they meet:
1. **Academic Merit**: High college scores/GPA
2. **Financial Need**: Lower middle class background
3. **Other Criteria**: Set by admin per course

### Regular Enrollment & Installment Payment Flow

```
Student → Browse Course → Select Enrollment
  ├─ Payment Options:
  │   ├─ Full Payment:
  │   │   ├─ Pay entire course fee upfront
  │   │   └─ Get immediate course access
  │   │
  │   └─ Installment Plan:
  │       ├─ Choose number of installments (3 or 4)
  │       ├─ View installment breakdown:
  │       │   ├─ Total: $X,XXX
  │       │   ├─ Installments: $XXX per payment
  │       │   └─ Payment schedule (dates)
  │       ├─ Pay first installment
  │       ├─ Get course access immediately
  │       ├─ Remaining installments auto-scheduled
  │       └─ Receive reminders before due dates
  │
  └─ Payment Processing:
      ├─ Credit/Debit Card
      ├─ Bank Transfer
      └─ Digital Wallet
```

### Scholarship Application Flow

```
Student → Browse Course → See Scholarship Option
  ├─ Regular Enrollment: Pay full price or installments
  └─ Scholarship Application:
      ├─ Fill application form
      ├─ Provide documents (transcripts, income proof)
      ├─ Submit for review
      └─ Wait for approval
```

### Scholarship Approval

```
Admin Reviews Application
  ├─ Verify academic records
  ├─ Verify financial documents
  ├─ Check eligibility criteria
  └─ Approve/Reject

If Approved:
  ├─ Student enrolled without payment
  ├─ Course access granted
  └─ Track scholarship status

If Rejected:
  ├─ Student can still enroll by paying
  └─ Show rejection reason
```

## Pricing Structure

### Crash Course
- **Free**: $0 (Mentor sets)
- **Paid**: $5 - $29 (Mentor sets)
- **Payment Options**: Full payment or 3-4 installments
- **No Commission**: Direct payment to mentor

### Skill-Focused
- **Free**: $0 (Mentor sets)
- **Paid**: $29 - $99 (Mentor sets)
- **Payment Options**: Full payment or 3-4 installments
- **Commission**: Standard platform fee

### Full Career Bootcamp
- **Regular Price**: $500 - $2,000 (Admin sets)
- **Payment Options**: Full payment or 3-4 installments
- **Scholarship**: Free for eligible students
- **Commission**: Admin-controlled split

### Masterclass/Bundle
- **Regular Price**: $2,000 - $5,000 (Admin sets)
- **Payment Options**: Full payment or 3-4 installments
- **Scholarship**: Free for eligible students
- **Commission**: Admin-controlled split

## Installment Payment System Details

### How It Works

1. **Student Enrollment**:
   - Student selects course
   - Chooses payment method: Full or Installment
   - If installment: Selects 3 or 4 installments

2. **Installment Calculation**:
   ```
   Total Course Price: $1,200
   Installments: 4
   Each Installment: $1,200 ÷ 4 = $300
   
   Payment Schedule:
   - Installment 1: $300 (Due at enrollment)
   - Installment 2: $300 (Due in 30 days)
   - Installment 3: $300 (Due in 60 days)
   - Installment 4: $300 (Due in 90 days)
   ```

3. **Course Access**:
   - Student gets full course access after first payment
   - Access continues if installments are paid on time
   - If installment missed: Access paused until payment

4. **Payment Reminders**:
   - Email reminder 7 days before due date
   - Email reminder 3 days before due date
   - Email reminder on due date
   - Access suspension notice if payment overdue

### Installment Rules

- **Minimum Course Price**: $50 (to enable installments)
- **Installment Options**: 3 or 4 installments only
- **First Payment**: Required at enrollment
- **Payment Interval**: 30 days between installments
- **Late Fees**: Optional, configurable by admin
- **Refund Policy**: Pro-rated refunds available

### Database Schema for Installments

```typescript
interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrollmentDate: string;
  
  // Payment Information
  paymentMethod: 'full' | 'installment';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  
  // Installment Details (if applicable)
  installments?: {
    total: number; // 3 or 4
    amount: number; // Amount per installment
    schedule: InstallmentSchedule[];
  };
  
  // Course Access
  accessGranted: boolean;
  accessStatus: 'active' | 'paused' | 'suspended';
}

interface InstallmentSchedule {
  installmentNumber: number; // 1, 2, 3, or 4
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'failed';
  paymentMethod?: string;
}
```

## Next Steps & Implementation Roadmap

### Phase 1: Course Category System ✅ (Current)
- [x] Implement bundle/master course system
- [x] Vacancy system for bundle courses
- [x] Scholarship system for bundle courses
- [x] Admin verification workflow

### Phase 2: Bootcamp Integration (Next)
- [ ] Add bootcamp course category (20-60 hours)
- [ ] Extend vacancy system to support bootcamp
- [ ] Update course creation flow to detect bootcamp
- [ ] Add duration-based category detection

### Phase 3: Course Type Selection (Next)
- [ ] Add course category selector in CourseForm
- [ ] Auto-detect category from duration
- [ ] Show/hide vacancy requirement based on category
- [ ] Update UI to guide mentors

### Phase 4: Enhanced Vacancy System (Future)
- [ ] Support multiple duration types in vacancies
- [ ] Filter vacancies by course category
- [ ] Show course category badges
- [ ] Update vacancy creation form

### Phase 5: Scholarship Application (Future)
- [ ] Student scholarship application form
- [ ] Document upload system
- [ ] Admin scholarship review panel
- [ ] Scholarship status tracking

### Phase 6: Analytics & Reporting (Future)
- [ ] Course category analytics
- [ ] Vacancy performance metrics
- [ ] Scholarship distribution reports
- [ ] Revenue by course type

## Technical Implementation Guide

### 1. Update Course Interface

```typescript
// Add courseCategory field
interface Course {
  // ... existing fields
  courseCategory: 'crash' | 'skill-focused' | 'bootcamp' | 'bundle';
  
  // Auto-determined from duration
  requiresVacancy: boolean; // Computed: bootcamp || bundle
  allowsScholarship: boolean; // Computed: bootcamp || bundle
}
```

### 2. Update Vacancy Interface

```typescript
interface CourseVacancy {
  // ... existing fields
  courseCategory: 'bootcamp' | 'bundle'; // Determined by duration
  duration: '20-60-hours' | '4-months' | '5-months' | '6-months';
}
```

### 3. Course Creation Logic

```typescript
function handleCourseCreation(formData) {
  // Course category is selected by mentor, not auto-detected
  const courseCategory = formData.courseCategory;
  
  if (requiresVacancy(courseCategory)) {
    // Redirect to vacancies
    router.push('/portal/mentor/vacancies');
    return;
  }
  
  // Enable installments by default for paid courses
  if (formData.price > 0) {
    formData.installmentEnabled = true;
    formData.installmentOptions = [3, 4];
  }
  
  // Direct creation
  createCourse(formData);
}
```

### 4. Vacancy Matching

```typescript
function findMatchingVacancies(courseCategory: string, duration: string) {
  return vacancies.filter(v => {
    if (courseCategory === 'bootcamp') {
      return v.duration === '20-60-hours';
    }
    if (courseCategory === 'bundle') {
      return v.duration.startsWith('4-') || v.duration.startsWith('5-') || v.duration.startsWith('6-');
    }
    return false;
  });
}
```

## Benefits of This System

1. **Accessibility**: Free and affordable options for quick learning
2. **Quality Control**: Vacancy system ensures qualified instructors for intensive courses
3. **Financial Aid**: Scholarship system supports deserving students
4. **Flexibility**: Multiple course types cater to different learning needs
5. **Scalability**: Clear categorization enables better course management

## Conclusion

This architecture provides a comprehensive framework for managing different course types, ensuring quality education is accessible to all students while maintaining platform sustainability through appropriate pricing and commission models.


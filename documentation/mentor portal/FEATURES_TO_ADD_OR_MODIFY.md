# Mentor Portal - Features to Add or Modify

Based on the Student Portal requirements and Course Type specifications, here are the features that need to be added or modified in the Mentor Portal:

## Summary of Required Changes

### ✅ Features Already Documented (Need Implementation)
1. **Course Type Selection** - Crash Course, Skill Course, Full Career Bootcamp
2. **Delivery Method Selection** - Live, Recorded, Mixed
3. **Time Limits Management** - For Crash/Skill courses
4. **Free Courses** - 30 min - 2 hours, recorded only
5. **Category Restrictions** - IT only for Bootcamp, any category for others

### 🆕 New Features to Add

#### 1. **Hackathons Management** (Full Career Bootcamp Only)
   - **Status**: NEW FEATURE
   - **Access**: Only for mentors teaching Full Career Bootcamp
   - **Location**: New menu item in sidebar under "Premium Features"
   - **Features Needed**:
     - Create hackathons
     - Set registration and submission deadlines
     - Manage participants
     - Review submissions
     - Judge and score submissions
     - Award prizes
     - View hackathon analytics
   - **Student Portal Connection**: Students enrolled in Bootcamp can see and register for hackathons

#### 2. **Scholarships Management** (Full Career Bootcamp Only)
   - **Status**: NEW FEATURE
   - **Access**: Only for mentors teaching Full Career Bootcamp
   - **Location**: New menu item in sidebar under "Premium Features"
   - **Features Needed**:
     - Create scholarships (if mentor is sponsor)
     - Review scholarship applications
     - Approve/reject applications
     - Request additional information
     - Track scholarship recipients
     - View scholarship analytics
   - **Student Portal Connection**: Students enrolled in Bootcamp can apply for scholarships

#### 3. **Interview Management** (Full Career Bootcamp Only)
   - **Status**: NEW FEATURE
   - **Access**: Only for mentors teaching Full Career Bootcamp
   - **Location**: New menu item in sidebar under "Premium Features"
   - **Features Needed**:
     - **AI Mock Interview**:
       - Review student AI interview attempts
       - View AI-generated feedback
       - Provide additional human feedback
       - Configure interview settings
     - **Manual Interview**:
       - Schedule interviews with students
       - Conduct video/in-person interviews
       - Score interviews (technical, communication, problem-solving)
       - Provide detailed feedback
       - Track interview performance over time
   - **Student Portal Connection**: Students enrolled in Bootcamp can access AI Mock Interview and Interview Preparation pages

#### 4. **Recorded Content Management** (Separate from Live Classes)
   - **Status**: MODIFY EXISTING
   - **Current State**: May be mixed with live classes
   - **Needed Changes**:
     - Separate page/section for recorded content management
     - Upload recorded videos
     - Organize into modules/lessons
     - Add video timestamps/chapters
     - Video analytics (views, watch time, drop-off points)
     - Access control: Only for Recorded or Mixed delivery courses

#### 5. **Course Type-Based Access Control**
   - **Status**: NEW FEATURE
   - **Features Needed**:
     - Hide premium features (Hackathons, Scholarships, Interviews) for Crash/Skill course mentors
     - Show premium features only for Full Career Bootcamp mentors
     - Conditional menu items based on course types taught
     - Dashboard widgets based on course types

#### 6. **Time Limits Configuration** (Crash/Skill Courses)
   - **Status**: NEW FEATURE
   - **Features Needed**:
     - Set time limits during course creation (1-2 weeks for Crash, 1-4 weeks for Skill)
     - Configure access expiration
     - Enable/disable extensions
     - Set reminder schedule
     - View time limit analytics (completion rates, extensions granted)

#### 7. **Free Course Configuration**
   - **Status**: MODIFY EXISTING
   - **Features Needed**:
     - Enforce free course rules:
       - Duration: 30 min - 2 hours only
       - Delivery: Recorded only
       - Course types: Crash/Skill only
     - Validation during course creation
     - Free course badge/indicator

#### 8. **Category Restrictions Enforcement**
   - **Status**: NEW FEATURE
   - **Features Needed**:
     - Restrict Full Career Bootcamp to IT category only
     - Allow any category for Crash/Skill courses
     - Category validation during course creation
     - Filter vacancies by category (IT only for Bootcamp)

#### 9. **Mixed Delivery Course Management**
   - **Status**: MODIFY EXISTING
   - **Features Needed**:
     - Configure per-module delivery method
     - Some modules live, some recorded
     - Manage both live classes and recorded content
     - Clear indicators for each module type

#### 10. **Compensation Tracking**
   - **Status**: MODIFY EXISTING
   - **Features Needed**:
     - **Salary-Based (Bootcamp)**:
       - View monthly salary
       - Track performance bonuses
       - View contract details
       - Payment history
     - **Commission-Based (Crash/Skill)**:
       - View earnings per course
       - Track commission rates
       - Payment history
       - Revenue trends

## Implementation Priority

### High Priority (Core Features)
1. ✅ Course Type Selection & Restrictions
2. ✅ Delivery Method Selection (Live/Recorded/Mixed)
3. ✅ Time Limits Configuration
4. ✅ Category Restrictions Enforcement
5. ✅ Free Course Configuration

### Medium Priority (Premium Features)
6. ✅ Hackathons Management
7. ✅ Scholarships Management
8. ✅ Interview Management
9. ✅ Recorded Content Management (separate section)

### Low Priority (Enhancements)
10. ✅ Compensation Tracking (enhancement)
11. ✅ Course Type-Based Access Control (UI/UX)
12. ✅ Mixed Delivery Course Management (enhancement)

## Access Control Matrix

| Feature | Crash Course Mentor | Skill Course Mentor | Bootcamp Mentor |
|---------|---------------------|---------------------|-----------------|
| **Course Creation** | ✅ Direct | ✅ Direct | ✅ Via Vacancy |
| **Live Classes** | ✅ | ✅ | ✅ |
| **Recorded Content** | ✅ | ✅ | ✅ |
| **Assignments** | ✅ | ✅ | ✅ |
| **Tests** | ✅ | ✅ | ✅ |
| **Student Management** | ✅ | ✅ | ✅ |
| **Analytics** | ✅ | ✅ | ✅ |
| **Hackathons** | ❌ | ❌ | ✅ |
| **Scholarships** | ❌ | ❌ | ✅ |
| **Interviews** | ❌ | ❌ | ✅ |
| **Compensation** | Commission | Commission | Salary |

## UI/UX Changes Required

### Sidebar Menu
- Add "Premium Features" category (only visible to Bootcamp mentors)
- Conditionally show/hide menu items based on course types
- Add badges/indicators for course types

### Dashboard
- Show different widgets based on course types
- Display compensation type (Salary vs Commission)
- Highlight premium features availability

### Course Creation Form
- Add course type selector (Crash/Skill/Bootcamp)
- Add delivery method selector (Live/Recorded/Mixed)
- Add time limit configuration (Crash/Skill)
- Add category restrictions (Bootcamp: IT only)
- Add free course validation

### Settings Page
- Add compensation tracking section
- Add course type preferences
- Add premium features settings (if Bootcamp mentor)

## Database Schema Changes Needed

### New Tables
1. **hackathons** - Store hackathon data
2. **hackathon_participants** - Track participants
3. **hackathon_submissions** - Store submissions
4. **scholarships** - Store scholarship data
5. **scholarship_applications** - Track applications
6. **interviews** - Store interview data (AI and Manual)
7. **interview_sessions** - Track interview sessions

### Modified Tables
1. **courses** - Add fields:
   - `course_type` (crash/skill/bootcamp)
   - `delivery_method` (live/recorded/mixed)
   - `time_limit_days` (for crash/skill)
   - `category_restriction` (IT only for bootcamp)
   - `is_free` (boolean)
   - `free_course_duration_minutes` (30-120)

2. **mentors** - Add fields:
   - `compensation_type` (salary/commission)
   - `has_premium_features` (boolean, computed)

## API Endpoints Needed

### Hackathons
- `POST /api/mentor/hackathons` - Create hackathon
- `GET /api/mentor/hackathons` - List hackathons
- `GET /api/mentor/hackathons/:id` - Get hackathon details
- `PUT /api/mentor/hackathons/:id` - Update hackathon
- `POST /api/mentor/hackathons/:id/submissions/:submissionId/judge` - Judge submission

### Scholarships
- `GET /api/mentor/scholarships` - List scholarships
- `GET /api/mentor/scholarships/:id/applications` - Get applications
- `POST /api/mentor/scholarships/:id/applications/:applicationId/review` - Review application
- `PUT /api/mentor/scholarships/:id/applications/:applicationId/approve` - Approve application
- `PUT /api/mentor/scholarships/:id/applications/:applicationId/reject` - Reject application

### Interviews
- `GET /api/mentor/interviews` - List interviews
- `POST /api/mentor/interviews/schedule` - Schedule interview
- `GET /api/mentor/interviews/:id` - Get interview details
- `POST /api/mentor/interviews/:id/conduct` - Conduct interview
- `POST /api/mentor/interviews/:id/feedback` - Submit feedback

### Course Management
- `POST /api/mentor/courses` - Create course (with course type validation)
- `PUT /api/mentor/courses/:id` - Update course
- `POST /api/mentor/courses/:id/time-limit` - Set time limit (Crash/Skill)
- `GET /api/mentor/courses/:id/recorded-content` - Get recorded content
- `POST /api/mentor/courses/:id/recorded-content` - Upload recorded content

## Testing Requirements

### Unit Tests
- Course type validation
- Category restriction validation
- Time limit configuration
- Free course validation
- Access control logic

### Integration Tests
- Hackathons creation and management
- Scholarships application review
- Interview scheduling and conduction
- Recorded content upload and management

### E2E Tests
- Complete course creation flow (all types)
- Premium features access (Bootcamp only)
- Time limit enforcement
- Free course creation flow

---

*Last Updated: [Current Date]*
*Version: 1.0*


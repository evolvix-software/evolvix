# 📝 Post a Job Page

## Overview

The Post a Job page allows employers to create new job postings with a comprehensive form, AI assistance, templates, and preview functionality.

## Route
```
/portal/employer/jobs/new
```

## Page Structure

### Multi-Step Form

#### Step 1: Basic Information
**Fields:**
- Job Title* (text input, 5-100 chars)
- Employment Type* (select: Full-time, Part-time, Contract, Internship, Freelance)
- Location* (text input with autocomplete)
- Remote Type* (radio: Remote, Hybrid, Onsite)
- Seniority Level (select: Entry, Mid, Senior, Executive)

**Features:**
- Auto-save draft every 30 seconds
- Validation on blur
- Location suggestions

#### Step 2: Job Description
**Fields:**
- Job Description* (rich text editor, min 200 chars)
- Responsibilities (bullet list, add/remove items)
- Requirements (bullet list, add/remove items)
- Skills* (tag input, max 20 skills)

**Features:**
- AI Job Description Generator
  - Input: Job title, key requirements
  - Output: Generated description
  - Edit generated content
- Rich Text Editor
  - Bold, italic, lists
  - Headings
  - Links
  - Preview mode
- Skill Suggestions
  - Auto-complete as typing
  - Popular skills
  - Category-based suggestions

#### Step 3: Compensation & Benefits
**Fields:**
- Salary Range (optional)
  - Min salary (number)
  - Max salary (number)
  - Currency (select)
  - Period (select: Hourly, Monthly, Yearly)
- Benefits (multi-select checkboxes)
  - Health Insurance
  - Dental Insurance
  - Vision Insurance
  - Retirement Plan
  - Paid Time Off
  - Flexible Hours
  - Remote Work
  - Professional Development
  - Stock Options
  - Other (text input)

#### Step 4: Application Settings
**Fields:**
- Application Method* (radio)
  - Easy Apply (default)
  - External Link (URL input)
  - Email (email input)
- Require Cover Letter (checkbox)
- Require Portfolio (checkbox)
- Custom Questions (add/remove)
  - Question type (text, textarea, multiple-choice, file)
  - Question text
  - Required flag
  - Options (for multiple-choice)

#### Step 5: Publishing Options
**Fields:**
- Status* (select: Draft, Active)
- Publish Date (date picker, optional for scheduling)
- Expiration Date (date picker, optional)
- Auto-expire (checkbox)
- Promote Job (checkbox, premium feature)

**Features:**
- Preview before publishing
- Job credit check
- Scheduling option

## Components

### 1. Template Selector
**Purpose:** Quick start with pre-filled templates

**Templates:**
- Software Engineer
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Data Scientist
- Product Manager
- Designer
- Marketing Manager
- Sales Representative
- Custom Templates

**Design:**
- Grid of template cards
- Preview template
- Use template button

### 2. AI Job Description Generator
**Purpose:** Generate job descriptions using AI

**Input:**
- Job title
- Key requirements (optional)
- Tone (Professional, Casual, Technical)
- Length (Short, Medium, Long)

**Output:**
- Generated description
- Responsibilities list
- Requirements list
- Skills suggestions

**Features:**
- Edit generated content
- Regenerate option
- Save as template

### 3. Rich Text Editor
**Purpose:** Format job description

**Features:**
- Bold, italic, underline
- Headings (H1-H6)
- Lists (ordered, unordered)
- Links
- Code blocks
- Preview mode
- Character count
- Word count

### 4. Skill Tag Input
**Purpose:** Add and manage required skills

**Features:**
- Auto-complete suggestions
- Popular skills dropdown
- Category-based suggestions
- Remove skills
- Max 20 skills
- Skill validation

### 5. Job Preview
**Purpose:** Preview job before publishing

**Shows:**
- Job title
- Company info
- Location and type
- Full description
- Skills
- Salary (if provided)
- Benefits
- Application button
- How it appears to candidates

**Features:**
- Desktop preview
- Mobile preview
- Print preview

### 6. Form Navigation
**Purpose:** Navigate between steps

**Features:**
- Progress indicator
- Step numbers
- Next/Previous buttons
- Save Draft button
- Validation indicators

## User Workflow

### Standard Flow
```
1. Click "Post a Job"
2. Select template (optional) OR start from scratch
3. Fill Step 1: Basic Information
4. Click "Next"
5. Fill Step 2: Job Description
   - Optionally use AI generator
   - Add responsibilities and requirements
   - Add skills
6. Click "Next"
7. Fill Step 3: Compensation & Benefits
8. Click "Next"
9. Fill Step 4: Application Settings
10. Click "Next"
11. Review Step 5: Publishing Options
12. Click "Preview" to see job
13. Click "Publish" or "Save as Draft"
```

### AI-Assisted Flow
```
1. Click "Post a Job"
2. Click "Use AI Generator"
3. Enter job title and key requirements
4. Select tone and length
5. Click "Generate"
6. Review and edit generated content
7. Continue with standard flow
```

### Template Flow
```
1. Click "Post a Job"
2. Browse templates
3. Select template
4. Template pre-fills form
5. Edit as needed
6. Continue with standard flow
```

## Validation Rules

### Job Title
- Required
- 5-100 characters
- No special characters at start/end

### Description
- Required
- Minimum 200 characters
- Maximum 10,000 characters

### Skills
- Required
- Minimum 3 skills
- Maximum 20 skills
- No duplicates

### Salary Range
- If provided, min must be less than max
- Must include currency and period

### Application Method
- Required
- If External Link: Valid URL required
- If Email: Valid email required

## Auto-Save Functionality

### Implementation
- Save draft every 30 seconds
- Save on form blur
- Save before navigation
- Show "Saving..." indicator
- Show "Saved" confirmation

### Draft Storage
- Store in localStorage (temporary)
- Store in database (persistent)
- Restore on page reload
- Show "Resume editing" option

## Error Handling

### Validation Errors
- Show inline errors
- Highlight invalid fields
- Prevent form submission
- Show error summary

### API Errors
- Show error message
- Retry option
- Save as draft option
- Contact support link

## Responsive Design

### Desktop
- Multi-column layout
- Side-by-side preview
- Full feature set

### Tablet
- Single column form
- Stacked preview
- Touch-optimized inputs

### Mobile
- Single column
- Full-width inputs
- Bottom action bar
- Simplified preview

## Accessibility

### Keyboard Navigation
- Tab through all fields
- Enter to submit
- Escape to cancel
- Arrow keys in selects

### Screen Readers
- Form labels
- Error announcements
- Progress announcements
- Help text

## Performance

### Optimization
- Lazy load AI generator
- Debounce auto-save
- Optimize rich text editor
- Cache templates

### Loading States
- Skeleton loader for form
- Loading indicator for AI generation
- Saving indicator
- Publishing indicator

## Future Enhancements

1. **Advanced AI Features**
   - Skill matching suggestions
   - Salary range recommendations
   - Job description optimization

2. **Bulk Posting**
   - Upload multiple jobs via CSV
   - Template-based bulk creation

3. **Job Scheduling**
   - Schedule multiple jobs
   - Recurring job postings

4. **A/B Testing**
   - Test different descriptions
   - Compare performance

5. **Integration**
   - Import from ATS
   - Sync with company website
   - Post to job boards


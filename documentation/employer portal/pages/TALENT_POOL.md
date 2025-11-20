# 🎯 Talent Pool Management

## Overview

The Talent Pool allows employers to build and manage a database of potential candidates for current and future job openings, enabling proactive talent acquisition.

## Route
```
/portal/employer/talent-pool
/portal/employer/talent-pool/[candidateId]
```

## Page Layout

### Header Section
- Page title: "Talent Pool"
- Total candidates count
- Quick actions:
  - Add Candidate
  - Import CSV
  - Export CSV
  - Bulk Actions

### Filters & Search
- Search bar (name, skills, location)
- Filter dropdowns:
  - Tags
  - Interest Level
  - Skills
  - Location
  - Experience Level
  - Availability
  - Date Added

### Candidate Grid/List
- Grid view (default)
- List view (alternative)
- Card-based display
- Bulk selection

## Components

### 1. Candidate Card
**Displays:**
- Candidate photo/avatar
- Candidate name
- Headline/Current role
- Location
- Skills (top 3-5)
- Interest level badge
- Tags
- Last contact date
- Quick actions

**Quick Actions:**
- View Profile
- Send Message
- Add Note
- Assign Tags
- Remove from Pool
- Match to Jobs

### 2. Candidate Details Panel
**Sections:**
- Profile Overview
- Experience
- Education
- Skills
- Resumes
- Notes & Tags
- Activity History
- Job Matches

### 3. Add Candidate Dialog
**Fields:**
- Name*
- Email*
- Phone (optional)
- Current Position
- Location
- Skills
- Resumes (upload)
- Notes
- Tags
- Interest Level

**Sources:**
- Manual entry
- Import from CSV
- Add from application
- Add from search

### 4. Import Dialog
**Features:**
- CSV file upload
- Column mapping
- Data preview
- Validation
- Import progress
- Error handling

### 5. Tag Management
**Features:**
- Create tags
- Assign tags to candidates
- Filter by tags
- Tag colors
- Tag categories
- Bulk tag assignment

### 6. Bulk Actions Toolbar
**Actions:**
- Bulk Tag
- Bulk Message
- Bulk Export
- Bulk Remove
- Bulk Assign to Recruiter

## Data Structure

### Talent Pool Entry
```typescript
interface TalentPoolEntry {
  id: string;
  candidateId: string;
  candidate: Candidate;
  addedAt: Date;
  addedBy: string;
  interestLevel: 'high' | 'medium' | 'low';
  tags: string[];
  notes: Note[];
  lastContactAt?: Date;
  matchedJobs: string[];
  assignedRecruiter?: string;
}
```

## User Interactions

### 1. Add Candidate
- Click "Add Candidate"
- Fill candidate form
- Upload resume (optional)
- Add tags
- Set interest level
- Save

### 2. Import Candidates
- Click "Import CSV"
- Upload CSV file
- Map columns
- Preview data
- Validate
- Import

### 3. View Candidate
- Click candidate card
- View full profile
- See all details
- View resumes
- Check notes

### 4. Send Message
- Click "Send Message"
- Opens messaging interface
- Pre-fills recipient
- Compose message
- Send

### 5. Add Note
- Click "Add Note"
- Write note
- Add tags
- @ Mention team
- Save note

### 6. Assign Tags
- Select candidate(s)
- Click "Assign Tags"
- Select/create tags
- Apply tags
- Filter by tags

### 7. Match to Jobs
- Click "Match to Jobs"
- View matched jobs
- See match scores
- Send to job
- Apply to job

### 8. Remove from Pool
- Click "Remove"
- Confirm removal
- Remove entry
- Archive option

### 9. Export Candidates
- Click "Export"
- Select format (CSV, PDF)
- Choose fields
- Filter candidates
- Export

### 10. Bulk Actions
- Select multiple candidates
- Choose action
- Confirm
- Process
- Show results

## Tag System

### Tag Creation
- Create new tag
- Choose color
- Set category
- Save tag

### Tag Assignment
- Single candidate
- Multiple candidates
- Bulk assignment
- Quick tags

### Tag Management
- Edit tags
- Delete tags
- Merge tags
- Tag statistics

## AI Matching

### Job Matching
- Match candidates to open jobs
- Calculate match scores
- Show matching skills
- Highlight missing skills
- Recommendations

### Smart Suggestions
- Suggest candidates for jobs
- Recommend jobs for candidates
- Skill gap analysis
- Career progression suggestions

## Import/Export

### CSV Import
**Required Fields:**
- Name
- Email

**Optional Fields:**
- Phone
- Location
- Skills (comma-separated)
- Current Position
- Experience
- Education
- Notes
- Tags

**Process:**
1. Upload CSV
2. Map columns
3. Preview data
4. Validate
5. Import
6. Show results

### CSV Export
**Fields:**
- All candidate data
- Custom field selection
- Filtered export
- Formatted export

## Search & Filters

### Search
- Name
- Email
- Skills
- Location
- Company
- Notes content

### Filters
- Tags
- Interest Level
- Skills
- Location
- Experience Level
- Availability
- Date Added
- Assigned Recruiter
- Matched Jobs

### Saved Filters
- Save filter combinations
- Load saved filters
- Share filters
- Delete filters

## Responsive Design

### Desktop (>1024px)
- 3-column grid
- Side panel for details
- Full feature set

### Tablet (768px - 1024px)
- 2-column grid
- Modal for details
- Touch-optimized

### Mobile (<768px)
- 1-column list
- Full-screen details
- Swipe actions
- Bottom actions

## Performance

### Optimization
- Virtual scrolling
- Lazy load images
- Pagination
- Caching

### Loading States
- Skeleton loaders
- Progress indicators
- Lazy loading

## Analytics

### Talent Pool Metrics
- Total candidates
- By interest level
- By tags
- By skills
- Growth over time
- Source breakdown

### Engagement Metrics
- Contact rate
- Response rate
- Conversion rate
- Time to contact

## Future Enhancements

1. **Advanced Matching**
   - Machine learning matching
   - Predictive analytics
   - Skill gap analysis

2. **Automation**
   - Auto-add from applications
   - Auto-tagging
   - Auto-matching
   - Auto-outreach

3. **Integration**
   - ATS integration
   - LinkedIn integration
   - Email integration
   - Calendar integration

4. **Campaigns**
   - Email campaigns
   - Nurture sequences
   - Re-engagement campaigns
   - Talent pipeline campaigns

5. **Advanced Features**
   - Candidate scoring
   - Talent pipeline visualization
   - Succession planning
   - Internal mobility


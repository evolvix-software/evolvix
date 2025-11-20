# 📝 Applications Queue Page

## Overview

The Applications Queue page allows providers to review, verify, score, and make decisions on scholarship applications. It provides tools for document verification, application scoring, bulk actions, and tracking application status through the review process.

## Route

```
/portal/provider/applications
/portal/provider/applications/[applicationId]
/portal/provider/applications/[applicationId]/verify
/portal/provider/applications/[applicationId]/score
```

## Page Layout

### Header Section
- Page title: "Applications Queue"
- Total applications count
- Status breakdown (Submitted, Under Verification, Review Pending, Shortlisted, Awarded, Rejected)
- Quick filters
- Bulk actions dropdown

### Filters & Search
- Search bar (student name, email, application ID)
- Filter dropdowns:
  - Status (All statuses)
  - Campaign
  - Priority (Low, Medium, High)
  - Date Range
  - Score Range
  - CGPA Range
- Clear filters button
- Save filter presets

### Application List/Grid
- Kanban board view (by status)
- List view (sortable table)
- Card view (application cards)
- Bulk selection checkbox

## Components

### 1. Application Card (Kanban View)

**Displays:**
- Student name and photo
- Campaign name
- CGPA (extracted or manual)
- Application date
- Status badge
- Priority indicator
- Score (if reviewed)
- Ranking (if scored)
- Flags (missing docs, needs review, etc.)

**Quick Actions:**
- View Details
- Verify Documents
- Score Application
- Shortlist
- Award
- Reject
- Request More Info
- Add Note

**Interactions:**
- Drag & drop between status columns
- Click card → Open application details
- Hover → Show quick actions
- Right-click → Context menu

---

### 2. Application Details Page

#### Overview Tab
**Displays:**
- Student information snapshot
- Application status and timeline
- Campaign details
- Quick stats (CGPA, score, ranking)
- Flags and priority indicators

**Actions:**
- Change Status
- Assign Reviewer
- Set Priority
- Add Flag
- Request More Info

---

#### Documents Tab
**Purpose:** Verify uploaded documents

**Document List:**
- Transcript (with verification status)
- ID Proof (with verification status)
- Income Proof (with verification status)
- Resume (optional)
- Recommendation Letters (optional)
- Other Documents

**Document Viewer:**
- PDF/image viewer
- Zoom controls
- Download option
- Verification checklist

**Verification Actions:**
- Mark as Verified
- Request More Info
- Flag for Review
- Reject Document
- Add Verification Notes

**Auto-Verification (AI):**
- Auto-extract CGPA from transcript
- Auto-extract income from proof
- Flag discrepancies
- Suggest verification actions

**Verification Log:**
- Who verified what
- When verified
- Verification notes
- Status changes

---

#### Application Data Tab
**Student Information:**
- Name, email, phone
- Current institution
- Graduation year
- CGPA (extracted and verified)
- Family income (extracted and verified)

**Application Content:**
- Scholarship justification essay
- Additional information
- Custom answers (if any)

**Extracted Data:**
- CGPA (numeric)
- Income (numeric)
- Verification status
- Discrepancies flagged

---

#### Scoring Tab
**Purpose:** Score application using rubric

**Scorecard:**
- Academic Score (0-100)
  - CGPA evaluation
  - Transcript quality
  - Academic achievements
- Financial Need Score (0-100)
  - Income level
  - Family situation
  - Need documentation
- Motivation Score (0-100)
  - Essay quality
  - Goals alignment
  - Commitment level

**Scoring Features:**
- Weighted scoring (based on campaign criteria)
- Total score calculation
- Ranking among applicants
- Score justification (required notes)
- Multiple reviewers support
- Average score calculation

**Reviewer Notes:**
- Academic notes
- Financial need notes
- Motivation notes
- Overall assessment
- Recommendation

---

#### Review & Decision Tab
**Application Summary:**
- All scores
- Total weighted score
- Ranking
- Verification status
- Flags and notes

**Decision Actions:**
- Shortlist → Move to shortlist
- Award → Award scholarship
- Reject → Reject application
- Withdraw → Withdraw application
- Reopen → Reopen closed application

**Decision Form:**
- Select decision
- Add decision notes
- Set award amount (if awarding)
- Set award type (if awarding)
- Configure disbursement schedule

**Award Letter Generation:**
- Auto-generate award letter
- Customize letter content
- Preview letter
- Send to student

---

#### Activity Timeline Tab
**Displays:**
- Application submitted
- Documents uploaded
- Verification actions
- Scoring actions
- Status changes
- Notes added
- Decisions made

**Features:**
- Chronological timeline
- Filter by action type
- Search timeline
- Export timeline

---

### 3. Bulk Actions Panel

**Bulk Actions Available:**
- Bulk Verify Documents
- Bulk Assign Reviewer
- Bulk Shortlist
- Bulk Award
- Bulk Reject
- Bulk Request Info
- Bulk Export
- Bulk Add Tags

**Bulk Action Flow:**
1. Select multiple applications
2. Choose bulk action
3. Configure action parameters
4. Preview affected applications
5. Confirm and execute
6. Show results and errors

---

### 4. Verification Panel

**Verification Checklist:**
- ✅ Transcript verified
- ✅ ID proof verified
- ✅ Income proof verified
- ✅ Background check completed
- ⚠️ Missing documents
- ⚠️ Needs more info

**Verification Status:**
- Overall Status: Pending / In-Progress / Completed / Needs-Info
- Individual document status
- Verification progress indicator

**Quick Verification:**
- One-click verify all documents
- Batch verification
- Auto-verification suggestions

---

### 5. Scorecard Modal

**Purpose:** Quick scoring without leaving list view

**Features:**
- Compact scorecard
- Quick score entry
- Auto-calculate total
- Save and continue
- Save and next

---

### 6. Application Filters & Sorting

**Filters:**
- Status filter (multi-select)
- Campaign filter
- Priority filter
- Score range slider
- CGPA range slider
- Date range picker
- Flag filter

**Sorting:**
- By Score (highest/lowest)
- By CGPA (highest/lowest)
- By Date (newest/oldest)
- By Ranking
- By Priority

**Saved Filters:**
- Save filter combinations
- Quick apply saved filters
- Share filters with team

---

## Data Requirements

### API Endpoints
- `GET /api/provider/applications`
- `GET /api/provider/applications/:applicationId`
- `PUT /api/provider/applications/:applicationId/verify`
- `PUT /api/provider/applications/:applicationId/score`
- `PUT /api/provider/applications/:applicationId/status`
- `POST /api/provider/applications/:applicationId/award`
- `POST /api/provider/applications/bulk-action`

### Data Structure
```typescript
interface Application {
  id: string;
  studentId: string;
  campaignId: string;
  status: 'submitted' | 'under_verification' | 'review_pending' | 'shortlisted' | 'awarded' | 'rejected';
  cgpa: number;
  totalScore?: number;
  ranking?: number;
  priority: 'low' | 'medium' | 'high';
  documents: ApplicationDocument[];
  verificationStatus: VerificationStatus;
  reviewerScores: ReviewerScore[];
  flags: ApplicationFlag[];
  submittedAt: Date;
}
```

## User Interactions

### 1. Review Application
- Click application → Open details
- View documents → Verify documents
- Score application → Enter scores
- Make decision → Award/Reject/Shortlist

### 2. Verify Documents
- Open document → View in viewer
- Check authenticity → Verify or flag
- Extract data → Auto-extract CGPA/income
- Add notes → Document verification

### 3. Score Application
- Open scorecard → Enter scores
- Add notes → Justify scores
- Calculate total → See weighted score
- Save score → Update ranking

### 4. Bulk Actions
- Select multiple → Check applications
- Choose action → Select bulk action
- Configure → Set parameters
- Execute → Process all selected

### 5. Filter & Search
- Apply filters → Narrow down list
- Search → Find specific applications
- Sort → Order by criteria
- Save filters → Reuse later

## Responsive Design

### Desktop (>1024px)
- Kanban board with multiple columns
- Side-by-side document viewer
- Full feature set
- Keyboard shortcuts

### Tablet (768px - 1024px)
- 2-column kanban
- Stacked document viewer
- Touch-optimized
- Swipe actions

### Mobile (<768px)
- Single column list
- Full-screen document viewer
- Bottom sheet actions
- Swipe gestures

## Loading States

### Initial Load
- Skeleton loaders for applications
- Progressive loading
- Smooth transitions

### Document Loading
- Loading spinner for documents
- Progress indicator for large files
- Error handling for failed loads

## Error Handling

### Document Errors
- Show error message
- Retry download
- Contact support
- Mark as unavailable

### Verification Errors
- Show validation errors
- Highlight issues
- Provide guidance
- Prevent invalid verification

### Scoring Errors
- Validate score ranges
- Check required fields
- Show error messages
- Prevent invalid submission

## Performance Considerations

### Optimization
- Virtual scrolling for long lists
- Lazy load documents
- Paginate applications
- Debounce search

### Data Fetching
- Parallel API calls
- React Query for caching
- Background refresh
- Optimistic updates

## Accessibility

### Keyboard Navigation
- Tab through applications
- Arrow keys for navigation
- Enter to open
- Escape to close

### Screen Readers
- ARIA labels for status
- Document type announcements
- Score announcements
- Status change announcements

## Future Enhancements

1. **AI-Powered Review**
   - Auto-score applications
   - Flag suspicious documents
   - Suggest decisions
   - Predict success probability

2. **Advanced Filtering**
   - Custom filter builder
   - Saved filter sets
   - Filter templates
   - Smart filters

3. **Collaboration Features**
   - Team review assignments
   - Review comments
   - @ Mentions
   - Review discussions

4. **Workflow Automation**
   - Auto-verify high scores
   - Auto-award thresholds
   - Auto-reject low scores
   - Workflow rules

5. **Analytics Integration**
   - Application funnel
   - Review time metrics
   - Reviewer performance
   - Decision patterns


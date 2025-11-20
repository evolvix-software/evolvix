# 🔍 Search Talent Page

## Overview

The Search Talent page enables employers to search and discover candidates from the platform's candidate database, similar to LinkedIn Recruiter Lite functionality.

## Route
```
/portal/employer/search
/portal/employer/search/saved
/portal/employer/search/[searchId]
```

## Page Layout

### Left Sidebar: Search Filters
- Advanced filters panel
- Filter categories
- Saved searches
- Filter presets

### Main Content: Search Results
- Search bar
- Results count
- Sort options
- View toggle (Grid/List)
- Candidate cards
- Pagination

### Right Panel: Candidate Preview (Desktop)
- Quick candidate preview
- Match score
- Key information
- Quick actions

## Components

### 1. Search Bar
**Features:**
- Full-text search
- Auto-complete suggestions
- Recent searches
- Search history
- Advanced search toggle

**Search Fields:**
- Name
- Skills
- Company
- Location
- Education
- Keywords

### 2. Advanced Filters Panel
**Filter Categories:**

#### Skills
- Skill selector
- Multiple skills
- Skill level
- Years of experience

#### Experience
- Years range (min-max)
- Industry experience
- Company size
- Role level

#### Location
- City/State/Country
- Remote availability
- Willing to relocate
- Radius search

#### Education
- Degree level
- Field of study
- Institution
- Graduation year

#### Availability
- Immediately available
- 2 weeks notice
- 1 month notice
- 3+ months notice
- Not looking

#### Salary Expectations
- Min salary
- Max salary
- Currency
- Period

#### Other Filters
- Tags
- Languages
- Certifications
- Security clearance

### 3. Candidate Card
**Displays:**
- Candidate photo/avatar
- Candidate name
- Headline
- Current position
- Current company
- Location
- Skills (top 5)
- Match score
- Availability
- Quick actions

**Quick Actions:**
- View Full Profile
- Add to Talent Pool
- Send Message
- Save Candidate
- Download Resume

### 4. Search Results
**Features:**
- Results count
- Sort options:
  - Relevance (default)
  - Match Score
  - Experience
  - Date Updated
  - Name (A-Z)
- View toggle
- Pagination
- Load more

### 5. Saved Searches
**Features:**
- List of saved searches
- Search name
- Result count
- Last searched date
- Edit/Delete options
- Run search

### 6. Search Alerts
**Features:**
- Enable alerts
- Alert frequency (Daily, Weekly, Instant)
- Email notifications
- In-app notifications
- Alert settings

## Data Structure

### Search Filters
```typescript
interface SearchFilters {
  query?: string;
  skills?: string[];
  experience?: {
    min: number;
    max: number;
  };
  location?: string;
  remote?: boolean;
  availability?: string;
  education?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  tags?: string[];
  languages?: string[];
}
```

### Search Result
```typescript
interface SearchResult {
  candidate: Candidate;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  relevanceScore: number;
}
```

## User Interactions

### 1. Perform Search
- Enter search query
- Apply filters
- Click search
- View results
- Refine search

### 2. Apply Filters
- Open filter panel
- Select filter criteria
- Apply filters
- See filtered results
- Clear filters

### 3. View Candidate
- Click candidate card
- View full profile
- See all details
- Check match analysis

### 4. Save Search
- Click "Save Search"
- Name search
- Configure alerts
- Save search
- Access later

### 5. Load Saved Search
- Open saved searches
- Select search
- Load filters
- Run search
- View results

### 6. Set Search Alerts
- Open search settings
- Enable alerts
- Set frequency
- Configure notifications
- Save settings

### 7. Add to Talent Pool
- Click "Add to Pool"
- Select tags
- Set interest level
- Add notes
- Save

### 8. Send Message
- Click "Send Message"
- Opens messaging
- Pre-fills recipient
- Compose message
- Send

### 9. Export Results
- Click "Export"
- Select format
- Choose fields
- Export results

## Search Algorithm

### Relevance Scoring
- Keyword match
- Skill match
- Experience match
- Location match
- Education match
- Overall score

### Match Score Calculation
- Skills: 40%
- Experience: 25%
- Education: 15%
- Location: 10%
- Other: 10%

### Ranking Factors
- Relevance score
- Match score
- Profile completeness
- Activity level
- Recency

## Advanced Search

### Boolean Operators
- AND: All terms must match
- OR: Any term can match
- NOT: Exclude terms
- Quoted phrases: Exact match

### Field-Specific Search
- `skills:React Node.js`
- `location:Mumbai`
- `experience:3-5`
- `education:Bachelor`

### Search Suggestions
- Auto-complete
- Popular searches
- Related searches
- Search history

## Saved Searches

### Create Saved Search
- Perform search
- Apply filters
- Click "Save Search"
- Name search
- Configure alerts
- Save

### Manage Saved Searches
- View all saved searches
- Edit search
- Delete search
- Run search
- Share search (team)

### Search Alerts
- Email alerts
- In-app notifications
- Alert frequency
- Alert settings
- Unsubscribe

## Responsive Design

### Desktop (>1024px)
- Side-by-side layout
- Full filter panel
- Preview panel
- All features

### Tablet (768px - 1024px)
- Collapsible filters
- Stacked layout
- Touch-optimized

### Mobile (<768px)
- Bottom sheet filters
- Full-screen results
- Swipe actions
- Simplified UI

## Performance

### Optimization
- Debounced search
- Paginated results
- Virtual scrolling
- Cached searches
- Lazy loading

### Loading States
- Search loading indicator
- Skeleton loaders
- Progressive loading

## Analytics

### Search Metrics
- Popular searches
- Search patterns
- Filter usage
- Result clicks
- Conversion rate

### Performance Metrics
- Search speed
- Result relevance
- User satisfaction
- Search success rate

## Future Enhancements

1. **AI-Powered Search**
   - Natural language search
   - Semantic search
   - Intent understanding
   - Smart suggestions

2. **Visual Search**
   - Skills graph
   - Experience timeline
   - Location map
   - Network visualization

3. **Advanced Matching**
   - Machine learning matching
   - Predictive matching
   - Similarity search
   - Recommendation engine

4. **Integration**
   - LinkedIn integration
   - GitHub integration
   - Portfolio integration
   - Social media integration

5. **Collaboration**
   - Share searches
   - Team search history
   - Collaborative filtering
   - Search notes


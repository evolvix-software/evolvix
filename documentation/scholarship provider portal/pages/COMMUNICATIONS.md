# 💬 Communications Page

## Overview

The Communications page allows providers to send messages to scholars and mentors, create announcements, manage message templates, and track communication history. It provides tools for personalized communication and bulk messaging to encourage and support scholars.

## Route

```
/portal/provider/communications
/portal/provider/communications/messages
/portal/provider/communications/announcements
/portal/provider/communications/templates
/portal/provider/communications/[conversationId]
```

## Page Layout

### Header Section
- Page title: "Communications"
- Unread message count
- Quick filters
- New Message button
- New Announcement button

### Tabs
- Messages
- Announcements
- Templates
- Activity

## Components

### 1. Messages Tab

#### Conversation List
**Displays:**
- Participant name and photo
- Last message preview
- Timestamp
- Unread count badge
- Starred indicator
- Archive indicator
- Quick actions

**Filters:**
- Unread only
- Starred only
- By participant type (Scholar, Mentor)
- By campaign
- Search conversations

**Sorting:**
- By last message (newest first)
- By unread count
- Alphabetically

---

#### Conversation View
**Displays:**
- Participant information
- Message thread
- Message composer
- Attachment list
- Message status (sent, delivered, read)

**Message Features:**
- Rich text editor
- File attachments
- Emoji picker
- Message templates
- Variable insertion
- Scheduling

**Actions:**
- Send message
- Schedule message
- Save draft
- Mark as read
- Star conversation
- Archive conversation

---

#### Message Composer
**Fields:**
- Recipient* (searchable dropdown)
- Subject (optional)
- Message* (rich text editor)
- Attachments (file upload)
- Template (optional dropdown)
- Schedule (optional date/time)
- Priority (Low, Medium, High)

**Template Variables:**
- `{{scholarName}}` - Scholar's name
- `{{campaignName}}` - Campaign name
- `{{courseName}}` - Course name
- `{{awardAmount}}` - Award amount
- `{{cgpa}}` - Current CGPA
- Custom variables

**Features:**
- Auto-save draft
- Spell check
- Format toolbar
- Preview message
- Send test message

---

#### Bulk Messaging
**Purpose:** Send messages to multiple recipients

**Features:**
- Select multiple scholars
- Personalize with variables
- Use templates
- Schedule bulk send
- Track delivery status

**Process:**
1. Select recipients
2. Choose template (optional)
3. Customize message
4. Preview personalized messages
5. Schedule or send immediately
6. Track delivery

---

### 2. Announcements Tab

#### Announcements List
**Displays:**
- Announcement title
- Content preview
- Recipient count
- Delivery method
- Status (Draft, Scheduled, Sent)
- Sent date/time
- Engagement metrics (opened, clicked)

**Filters:**
- Status filter
- Date range
- Campaign filter
- Search announcements

**Actions:**
- View Details
- Edit Announcement
- Duplicate Announcement
- Delete Announcement
- View Analytics

---

#### Create Announcement Form
**Fields:**
- Title* (text input)
- Content* (rich text editor)
- Priority (Low, Medium, High)
- Recipient Type* (All, Campaign, Scholars, Mentors, Custom)
- Recipients* (if custom, multi-select)
- Delivery Method* (In-app, Email, Both)
- Schedule (optional date/time)
- Send Now / Schedule

**Content Editor:**
- Rich text formatting
- Images and media
- Links
- Template variables
- Preview mode

**Recipient Selection:**
- All scholars
- Campaign-specific
- Custom list
- Filter by criteria
- Exclude options

---

#### Announcement Analytics
**Metrics:**
- Sent count
- Delivered count
- Opened count
- Clicked count
- Engagement rate
- Open rate
- Click rate

**Visualizations:**
- Engagement chart
- Open rate over time
- Click rate over time
- Recipient breakdown

---

### 3. Templates Tab

#### Template Library
**Displays:**
- Template name
- Category
- Preview
- Usage count
- Last used date
- Actions

**Categories:**
- Award Letters
- Congratulations
- Reminders
- Support Messages
- Rejections
- Custom

**Actions:**
- Use Template
- Edit Template
- Duplicate Template
- Delete Template
- Preview Template

---

#### Template Editor
**Fields:**
- Template Name* (text input)
- Category* (dropdown)
- Subject (optional)
- Content* (rich text editor)
- Variables (auto-detected)
- Preview

**Template Variables:**
- Available variables list
- Insert variable button
- Variable preview
- Variable documentation

**Features:**
- Rich text editor
- Variable insertion
- Preview with sample data
- Save as draft
- Test template

---

### 4. Activity Tab

#### Communication Activity Feed
**Displays:**
- Message sent
- Announcement sent
- Template used
- Response received
- Engagement events

**Filters:**
- Activity type
- Date range
- Participant
- Campaign

**Features:**
- Timeline view
- Filter by type
- Export activity
- Search activity

---

## Data Requirements

### API Endpoints
- `GET /api/provider/communications/conversations`
- `GET /api/provider/communications/conversations/:conversationId`
- `POST /api/provider/communications/conversations/:conversationId/messages`
- `GET /api/provider/communications/announcements`
- `POST /api/provider/communications/announcements`
- `GET /api/provider/communications/templates`
- `POST /api/provider/communications/templates`
- `PUT /api/provider/communications/templates/:templateId`

### Data Structure
```typescript
interface Conversation {
  id: string;
  participantId: string;
  participantType: 'scholar' | 'mentor';
  lastMessageAt: Date;
  unreadCount: number;
  isArchived: boolean;
  isStarred: boolean;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'provider' | 'scholar' | 'mentor';
  content: string;
  attachments: Attachment[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  recipientType: 'all' | 'campaign' | 'scholars' | 'mentors' | 'custom';
  recipientIds?: string[];
  deliveryMethod: 'in-app' | 'email' | 'both';
  status: 'draft' | 'scheduled' | 'sent';
  sentAt?: Date;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
}
```

## User Interactions

### 1. Send Message
- Click "New Message" → Open composer
- Select recipient → Search and select
- Write message → Use template (optional)
- Attach files → Upload files
- Send → Message delivered

### 2. Create Announcement
- Click "New Announcement" → Open form
- Write content → Format text
- Select recipients → Choose type
- Schedule or send → Set date/time
- Track delivery → View analytics

### 3. Use Templates
- Browse templates → Filter by category
- Select template → Load into composer
- Customize → Insert variables
- Preview → Check personalized content
- Send → Use template

### 4. Track Communication
- View conversation → Check messages
- Check read receipts → See delivery status
- View analytics → Track engagement
- Export activity → Download reports

## Responsive Design

### Desktop (>1024px)
- Side-by-side conversation list and view
- Full feature set
- Rich text editor
- Keyboard shortcuts

### Tablet (768px - 1024px)
- Stacked layout
- Touch-optimized
- Simplified editor
- Swipe actions

### Mobile (<768px)
- Full-screen conversation
- Bottom sheet composer
- Simplified interface
- Voice input support

## Loading States

### Initial Load
- Skeleton loaders
- Progressive loading
- Smooth transitions

### Message Sending
- Sending indicator
- Progress bar
- Success confirmation

## Error Handling

### Send Errors
- Show error message
- Retry option
- Save as draft
- Contact support

### Validation Errors
- Inline validation
- Error messages
- Prevent sending
- Guidance text

## Performance Considerations

### Optimization
- Paginate conversations
- Lazy load messages
- Cache templates
- Debounce search

### Data Fetching
- Parallel API calls
- React Query caching
- Real-time updates (WebSocket)
- Background refresh

## Accessibility

### Keyboard Navigation
- Tab through elements
- Enter to send
- Escape to close
- Arrow keys for navigation

### Screen Readers
- ARIA labels
- Message announcements
- Status announcements
- Form validation announcements

## Real-time Features

### WebSocket Integration
- Real-time message delivery
- Read receipt updates
- Typing indicators
- Online status

### Notifications
- Browser notifications
- In-app notifications
- Email notifications
- Push notifications (mobile)

## Future Enhancements

1. **Video Calls**
   - Integrated video calls
   - Screen sharing
   - Recording sessions
   - Call scheduling

2. **AI-Powered Features**
   - Auto-reply suggestions
   - Message tone analysis
   - Sentiment analysis
   - Smart templates

3. **Advanced Analytics**
   - Communication patterns
   - Response time metrics
   - Engagement trends
   - Effectiveness analysis

4. **Integration**
   - Email integration
   - SMS integration
   - Social media integration
   - Calendar integration

5. **Automation**
   - Auto-messages on milestones
   - Scheduled reminders
   - Follow-up automation
   - Workflow automation



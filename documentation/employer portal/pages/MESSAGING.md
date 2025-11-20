# 💬 Messaging Hub

## Overview

The Messaging Hub enables employers to communicate with candidates directly, similar to LinkedIn's messaging system, with support for templates, attachments, and bulk messaging.

## Route
```
/portal/employer/messaging
/portal/employer/messaging/[conversationId]
```

## Page Layout

### Left Panel: Conversation List
- List of conversations
- Search conversations
- Filter options
- Unread count badges
- Last message preview

### Right Panel: Conversation View
- Message thread
- Message composer
- Attachment area
- Participant info

### Mobile Layout
- Conversation list (full screen)
- Conversation view (full screen)
- Toggle between views

## Components

### 1. Conversation List
**Displays:**
- Candidate avatar
- Candidate name
- Last message preview
- Timestamp
- Unread count badge
- Job context (if applicable)
- Status indicator

**Features:**
- Sort by: Recent, Unread, Name
- Filter by: Unread, Starred, By Job, By Candidate
- Search conversations
- Mark as read/unread
- Archive conversations
- Delete conversations

### 2. Conversation View
**Displays:**
- Participant info panel
- Message thread
- Message composer
- Attachment area
- Typing indicator

**Features:**
- Scroll to load more messages
- Message timestamps
- Read receipts
- Message status (Sent, Delivered, Read)
- Edit/Delete messages
- Reply/Forward

### 3. Message Composer
**Fields:**
- To: Candidate (pre-filled)
- Subject: Optional
- Message body: Rich text editor
- Attachments: File upload
- Template selector

**Features:**
- Rich text formatting
- Variable insertion ({{candidateName}}, etc.)
- Attachment upload
- Template selection
- Draft saving
- Schedule send
- Send now

### 4. Message Templates
**Template Categories:**
- Rejection
- Interview Invitation
- Offer Letter
- Follow-up
- Custom

**Template Features:**
- Template library
- Create/edit templates
- Variable support
- Preview template
- Usage statistics

### 5. Attachment Uploader
**Supported Types:**
- Documents (PDF, DOC, DOCX)
- Images (JPG, PNG, GIF)
- Other files (ZIP, etc.)

**Features:**
- Drag and drop
- File browser
- Multiple files
- File preview
- File size limit
- Virus scanning

## Data Structure

### Conversation
```typescript
interface Conversation {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  jobId?: string;
  jobTitle?: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  isArchived: boolean;
  isStarred: boolean;
  participants: Participant[];
}
```

### Message
```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'employer' | 'candidate';
  content: string;
  attachments: Attachment[];
  isRead: boolean;
  readAt?: Date;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
}
```

## User Interactions

### 1. Start New Conversation
- Click "New Message"
- Select candidate
- Choose job (optional)
- Compose message
- Send

### 2. Send Message
- Type message
- Add attachments (optional)
- Use template (optional)
- Preview message
- Send

### 3. Use Template
- Click "Use Template"
- Browse templates
- Select template
- Fill variables
- Customize content
- Send

### 4. Reply to Message
- Click reply button
- Quote original (optional)
- Type reply
- Send

### 5. Forward Message
- Click forward button
- Select recipient
- Add note (optional)
- Send

### 6. Edit Message
- Click edit button
- Modify content
- Save changes
- Show "Edited" indicator

### 7. Delete Message
- Click delete button
- Confirm deletion
- Remove from thread
- Notify if needed

### 8. Archive Conversation
- Click archive button
- Move to archived
- Filter to view archived
- Unarchive option

### 9. Star Conversation
- Click star icon
- Mark as important
- Filter starred conversations
- Quick access

### 10. Bulk Messaging
- Select multiple candidates
- Compose message
- Personalize with variables
- Preview messages
- Send bulk

## Message Features

### Rich Text Editor
- Bold, italic, underline
- Bullet lists
- Numbered lists
- Links
- Emojis
- Code blocks

### Variables
- {{candidateName}}
- {{jobTitle}}
- {{companyName}}
- {{interviewDate}}
- {{interviewTime}}
- {{offerAmount}}
- Custom variables

### Attachments
- Upload files
- Preview attachments
- Download attachments
- File size limits
- File type restrictions

### Scheduling
- Schedule send date/time
- Timezone selection
- Cancel scheduled message
- Edit scheduled message

### Drafts
- Auto-save drafts
- Manual save
- Load drafts
- Delete drafts

## Real-time Features

### Typing Indicator
- Show when candidate is typing
- Hide after timeout
- Real-time updates

### Read Receipts
- Show read status
- Read timestamp
- Delivery status

### Online Status
- Show online/offline
- Last seen time
- Status updates

### Notifications
- New message notification
- Unread count badge
- Sound notification (optional)
- Email notification (optional)

## Search & Filters

### Search Conversations
- Search by candidate name
- Search by job title
- Search message content
- Recent searches
- Search suggestions

### Filter Conversations
- Unread only
- Starred only
- By job
- By candidate
- Archived
- Date range

### Sort Conversations
- Recent (default)
- Unread first
- Alphabetical
- By job

## Bulk Messaging

### Select Recipients
- Select from applicants
- Select from talent pool
- Select from search results
- Import from CSV

### Compose Bulk Message
- Write message
- Use template
- Personalize variables
- Preview personalized messages

### Send Bulk
- Validate all messages
- Send individually
- Track delivery
- Handle failures
- Show results

## Message Templates

### Template Library
- Browse by category
- Search templates
- Preview templates
- Use template

### Create Template
- Name template
- Choose category
- Write content
- Add variables
- Save template

### Edit Template
- Modify content
- Update variables
- Save changes
- Version history

### Delete Template
- Confirm deletion
- Check usage
- Remove template

## Responsive Design

### Desktop (>1024px)
- Side-by-side layout
- Full conversation view
- Rich composer

### Tablet (768px - 1024px)
- Collapsible panels
- Touch-optimized
- Swipe gestures

### Mobile (<768px)
- Full-screen views
- Bottom navigation
- Swipe actions
- Quick actions

## Performance

### Optimization
- Lazy load messages
- Paginate conversations
- Cache messages
- Optimize images

### Loading States
- Skeleton loaders
- Loading indicators
- Progressive loading

## Accessibility

### Keyboard Navigation
- Tab through conversations
- Enter to open
- Arrow keys to navigate
- Escape to close

### Screen Readers
- Message announcements
- Read status announcements
- Conversation descriptions

## Future Enhancements

1. **Video Messages**
   - Record video messages
   - Video playback
   - Video attachments

2. **Voice Messages**
   - Record voice
   - Playback
   - Transcription

3. **Message Reactions**
   - Emoji reactions
   - Quick replies
   - Message threads

4. **Smart Suggestions**
   - AI message suggestions
   - Auto-complete
   - Smart replies

5. **Integration**
   - Email integration
   - SMS integration
   - Calendar integration

6. **Advanced Features**
   - Message scheduling
   - Auto-responses
   - Message analytics
   - Conversation insights


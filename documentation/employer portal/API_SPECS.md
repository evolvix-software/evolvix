# 🔌 Employer Portal - API Specifications

## API Overview

### Base URL
```
Production: https://api.evolvix.com/v1/employer
Staging: https://api-staging.evolvix.com/v1/employer
Development: http://localhost:3000/api/employer
```

### Authentication
All API requests require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "errors": []
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

---

## 1. Employer/Company APIs

### GET /employer/profile
Get employer profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "companyName": "TechVerse",
    "companySlug": "techverse",
    "logo": "https://...",
    "industry": "Technology",
    "subscriptionPlan": "premium",
    "jobPostingCredits": 10
  }
}
```

### PUT /employer/profile
Update employer profile.

**Request Body:**
```json
{
  "companyName": "TechVerse",
  "industry": "Technology",
  "website": "https://techverse.com",
  "description": "Company description"
}
```

---

## 2. Job Posting APIs

### GET /jobs
Get list of jobs with filters and pagination.

**Query Parameters:**
- `status`: active, draft, closed, expired
- `search`: Search query
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `sort`: Sort field (date, applications, views)
- `order`: asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "jobTitle": "Senior Software Engineer",
        "status": "active",
        "applications": 45,
        "views": 1200,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### GET /jobs/:jobId
Get single job details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobTitle": "Senior Software Engineer",
    "description": "Full job description...",
    "status": "active",
    "applications": 45,
    "views": 1200,
    "analytics": {
      "viewsBySource": {},
      "applicationsByStage": {}
    }
  }
}
```

### POST /jobs
Create new job posting.

**Request Body:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "description": "Job description...",
  "location": "Mumbai, India",
  "employmentType": "full-time",
  "remoteType": "hybrid",
  "skills": ["React", "Node.js"],
  "salaryRange": {
    "min": 800000,
    "max": 1200000,
    "currency": "INR",
    "period": "yearly"
  },
  "status": "draft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobTitle": "Senior Software Engineer",
    "jobSlug": "senior-software-engineer-123",
    "status": "draft"
  }
}
```

### PUT /jobs/:jobId
Update job posting.

**Request Body:** (Same as POST, all fields optional)

### DELETE /jobs/:jobId
Delete job posting.

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

### POST /jobs/:jobId/duplicate
Duplicate a job.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "jobTitle": "Senior Software Engineer (Copy)",
    "status": "draft"
  }
}
```

### POST /jobs/:jobId/publish
Publish a job.

**Request Body:**
```json
{
  "publishDate": "2024-01-20T10:00:00Z" // Optional, for scheduling
}
```

### POST /jobs/:jobId/pause
Pause a job.

### POST /jobs/:jobId/close
Close a job.

### POST /jobs/bulk
Bulk operations on jobs.

**Request Body:**
```json
{
  "jobIds": ["uuid1", "uuid2"],
  "action": "close" // close, pause, delete, assign
}
```

---

## 3. Application APIs

### GET /jobs/:jobId/applications
Get applications for a specific job.

**Query Parameters:**
- `stage`: Pipeline stage filter
- `status`: Application status
- `search`: Search query
- `page`: Page number
- `limit`: Items per page
- `sort`: Sort field
- `order`: asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "candidateId": "uuid",
        "candidateName": "John Doe",
        "status": "new",
        "stage": "new",
        "matchScore": 85,
        "appliedAt": "2024-01-15T10:00:00Z",
        "resumeUrl": "https://..."
      }
    ],
    "pagination": {}
  }
}
```

### GET /applications/:applicationId
Get single application details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobId": "uuid",
    "candidate": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "experience": [],
      "education": [],
      "skills": []
    },
    "resume": {
      "id": "uuid",
      "fileName": "resume.pdf",
      "fileUrl": "https://..."
    },
    "coverLetter": "Cover letter text...",
    "screeningAnswers": [],
    "matchScore": 85,
    "status": "new",
    "stage": "new",
    "activities": []
  }
}
```

### PUT /applications/:applicationId/stage
Move application to different pipeline stage.

**Request Body:**
```json
{
  "stage": "shortlisted",
  "note": "Strong candidate, good fit"
}
```

### PUT /applications/:applicationId/status
Update application status.

**Request Body:**
```json
{
  "status": "rejected",
  "reason": "Does not meet requirements"
}
```

### POST /applications/bulk
Bulk operations on applications.

**Request Body:**
```json
{
  "applicationIds": ["uuid1", "uuid2"],
  "action": "move-to-stage",
  "stage": "shortlisted"
}
```

### GET /applications/:applicationId/resume
Download application resume.

**Response:** File download

---

## 4. Candidate APIs

### GET /candidates/:candidateId
Get candidate profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "headline": "Senior Software Engineer",
    "experience": [],
    "education": [],
    "skills": [],
    "resumes": []
  }
}
```

### GET /candidates/search
Search candidates.

**Query Parameters:**
- `skills`: Comma-separated skills
- `experience`: min-max range
- `location`: Location filter
- `availability`: immediately, 2-weeks, etc.
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [],
    "pagination": {}
  }
}
```

---

## 5. Messaging APIs

### GET /conversations
Get list of conversations.

**Query Parameters:**
- `unread`: true/false
- `jobId`: Filter by job
- `candidateId`: Filter by candidate
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "candidateName": "John Doe",
        "lastMessage": "Message preview...",
        "lastMessageAt": "2024-01-15T10:00:00Z",
        "unreadCount": 2
      }
    ],
    "pagination": {}
  }
}
```

### GET /conversations/:conversationId
Get conversation details with messages.

**Query Parameters:**
- `page`: Page number for messages
- `limit`: Messages per page

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "candidate": {},
    "messages": [
      {
        "id": "uuid",
        "senderId": "uuid",
        "senderType": "employer",
        "content": "Message content...",
        "createdAt": "2024-01-15T10:00:00Z",
        "isRead": true
      }
    ],
    "pagination": {}
  }
}
```

### POST /conversations
Create new conversation or send message.

**Request Body:**
```json
{
  "candidateId": "uuid",
  "jobId": "uuid", // Optional
  "subject": "Interview Invitation",
  "content": "Message content...",
  "attachments": ["fileId1", "fileId2"],
  "templateId": "uuid" // Optional
}
```

### POST /conversations/:conversationId/messages
Send message in existing conversation.

**Request Body:**
```json
{
  "content": "Message content...",
  "attachments": []
}
```

### PUT /messages/:messageId/read
Mark message as read.

### GET /templates
Get message templates.

**Query Parameters:**
- `category`: Filter by category

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "uuid",
        "name": "Interview Invitation",
        "category": "interview",
        "subject": "Interview Invitation",
        "content": "Template content..."
      }
    ]
  }
}
```

### POST /templates
Create message template.

### PUT /templates/:templateId
Update message template.

### DELETE /templates/:templateId
Delete message template.

---

## 6. Career Page APIs

### GET /career-page
Get career page data.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sections": [],
    "theme": {
      "primaryColor": "#635bff",
      "secondaryColor": "#735fff"
    },
    "metaTitle": "Join TechVerse",
    "metaDescription": "Career page description"
  }
}
```

### PUT /career-page
Update career page.

**Request Body:**
```json
{
  "sections": [],
  "theme": {},
  "metaTitle": "Join TechVerse",
  "metaDescription": "Description"
}
```

### POST /career-page/publish
Publish career page.

### GET /career-page/analytics
Get career page analytics.

**Query Parameters:**
- `period`: 7d, 30d, 90d, 1y

**Response:**
```json
{
  "success": true,
  "data": {
    "totalViews": 5000,
    "uniqueVisitors": 3200,
    "viewsByDate": [],
    "jobClicks": 150,
    "applicationsFromPage": 45
  }
}
```

---

## 7. Analytics APIs

### GET /analytics/jobs/:jobId
Get job analytics.

**Query Parameters:**
- `period`: 7d, 30d, 90d, 1y
- `startDate`: Custom start date
- `endDate`: Custom end date

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "totalViews": 1200,
    "uniqueViews": 800,
    "totalApplications": 45,
    "applicationsByStage": {},
    "viewToApplyRate": 3.75,
    "viewsBySource": {},
    "applicantDemographics": {}
  }
}
```

### GET /analytics/overview
Get overall analytics dashboard.

**Query Parameters:**
- `period`: Time period

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 25,
    "activeJobs": 15,
    "totalApplications": 500,
    "averageTimeToFill": 15,
    "hireRate": 12.5,
    "topPerformingJobs": []
  }
}
```

### POST /analytics/reports
Generate analytics report.

**Request Body:**
```json
{
  "reportType": "job-performance",
  "jobIds": ["uuid1", "uuid2"],
  "period": "30d",
  "format": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "downloadUrl": "https://...",
    "expiresAt": "2024-01-20T10:00:00Z"
  }
}
```

---

## 8. Team Management APIs

### GET /team
Get team members.

**Response:**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "uuid",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "recruiter",
        "permissions": [],
        "assignedJobs": []
      }
    ]
  }
}
```

### POST /team/invite
Invite team member.

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "name": "New Member",
  "role": "recruiter",
  "permissions": [],
  "assignedJobs": []
}
```

### PUT /team/:memberId
Update team member.

### DELETE /team/:memberId
Remove team member.

### PUT /team/:memberId/permissions
Update team member permissions.

---

## 9. Talent Pool APIs

### GET /talent-pool
Get talent pool candidates.

**Query Parameters:**
- `tags`: Filter by tags
- `search`: Search query
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [],
    "pagination": {}
  }
}
```

### POST /talent-pool
Add candidate to talent pool.

**Request Body:**
```json
{
  "candidateId": "uuid",
  "tags": ["frontend", "react"],
  "interestLevel": "high",
  "notes": "Strong candidate"
}
```

### PUT /talent-pool/:candidateId
Update talent pool entry.

### DELETE /talent-pool/:candidateId
Remove from talent pool.

### POST /talent-pool/import
Import candidates from CSV.

**Request:** Multipart form data with CSV file

---

## 10. Search APIs

### GET /search/saved
Get saved searches.

**Response:**
```json
{
  "success": true,
  "data": {
    "searches": [
      {
        "id": "uuid",
        "name": "React Developers",
        "filters": {},
        "resultCount": 150,
        "lastSearchedAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

### POST /search/saved
Save search.

**Request Body:**
```json
{
  "name": "React Developers",
  "filters": {
    "skills": ["React", "JavaScript"],
    "experience": {"min": 2, "max": 5}
  },
  "emailAlerts": true,
  "alertFrequency": "daily"
}
```

### DELETE /search/saved/:searchId
Delete saved search.

---

## 11. File Upload APIs

### POST /upload/resume
Upload resume file.

**Request:** Multipart form data

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "uuid",
    "fileName": "resume.pdf",
    "fileUrl": "https://...",
    "fileSize": 1024000
  }
}
```

### POST /upload/image
Upload image file.

### POST /upload/document
Upload document file.

---

## 12. Notification APIs

### GET /notifications
Get notifications.

**Query Parameters:**
- `unread`: true/false
- `type`: Notification type
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "new_application",
        "title": "New Application",
        "message": "John Doe applied for Senior Software Engineer",
        "isRead": false,
        "actionUrl": "/applications/uuid",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {}
  }
}
```

### PUT /notifications/:notificationId/read
Mark notification as read.

### PUT /notifications/read-all
Mark all notifications as read.

---

## Error Codes

### Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid authentication token
- `PERMISSION_DENIED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Validation failed
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `SERVER_ERROR`: Internal server error

### Job-Specific Errors
- `JOB_NOT_FOUND`: Job not found
- `JOB_ALREADY_PUBLISHED`: Job already published
- `JOB_EXPIRED`: Job has expired
- `INSUFFICIENT_CREDITS`: Not enough job posting credits

### Application-Specific Errors
- `APPLICATION_NOT_FOUND`: Application not found
- `INVALID_STAGE_TRANSITION`: Invalid pipeline stage transition
- `RESUME_REQUIRED`: Resume is required

---

## Rate Limiting

### Limits
- **Standard Plan**: 100 requests/minute
- **Premium Plan**: 500 requests/minute
- **Enterprise Plan**: Unlimited

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

---

## Webhooks

### Supported Events
- `job.published`
- `job.closed`
- `application.received`
- `application.status_changed`
- `message.received`

### Webhook Payload
```json
{
  "event": "application.received",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "applicationId": "uuid",
    "jobId": "uuid",
    "candidateId": "uuid"
  }
}
```


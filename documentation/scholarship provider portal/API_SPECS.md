# 🔌 Scholarship Provider Portal - API Specifications

## API Overview

### Base URL
```
Production: https://api.evolvix.com/v1/provider
Staging: https://api-staging.evolvix.com/v1/provider
Development: http://localhost:3000/api/provider
```

### Authentication
All API requests require authentication via JWT token:
```
Authorization: Bearer <token>
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "errors": []
}
```

---

## 1. Provider APIs

### GET /provider/profile
Get provider profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "organizationName": "TechVerse Foundation",
    "balance": 500000,
    "totalPledged": 1000000,
    "totalTransferred": 800000,
    "totalDisbursed": 750000
  }
}
```

### PUT /provider/profile
Update provider profile.

---

## 2. Campaign APIs

### GET /campaigns
Get list of campaigns.

**Query Parameters:**
- `status`: draft, open, closed, completed
- `type`: course-specific, pooled, general
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "uuid",
        "title": "TechVerse Scholarship 2024",
        "status": "open",
        "totalSlots": 50,
        "slotsAvailable": 30,
        "fundedAmount": 500000,
        "requiredAmount": 1000000
      }
    ],
    "pagination": {}
  }
}
```

### GET /campaigns/:campaignId
Get single campaign details.

### POST /campaigns
Create new campaign.

**Request Body:**
```json
{
  "title": "TechVerse Scholarship 2024",
  "description": "Campaign description...",
  "campaignType": "course-specific",
  "linkedCourseIds": ["course-1", "course-2"],
  "totalSlots": 50,
  "awardType": "full",
  "requiredAmount": 1000000,
  "eligibilityRules": {
    "minCGPA": 7.0,
    "financialNeedRequired": true
  },
  "applicationOpenDate": "2024-01-01T00:00:00Z",
  "applicationCloseDate": "2024-12-31T23:59:59Z"
}
```

### PUT /campaigns/:campaignId
Update campaign.

### DELETE /campaigns/:campaignId
Delete campaign.

---

## 3. Application APIs

### GET /campaigns/:campaignId/applications
Get applications for a campaign.

**Query Parameters:**
- `status`: submitted, under_verification, review_pending, shortlisted, awarded, rejected
- `priority`: low, medium, high
- `page`: Page number
- `limit`: Items per page
- `sort`: score, date, cgpa
- `order`: asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "studentName": "John Doe",
        "cgpa": 8.5,
        "status": "review_pending",
        "totalScore": 85,
        "ranking": 5,
        "submittedAt": "2024-01-15T10:00:00Z"
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
    "student": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "cgpa": 8.5
    },
    "documents": [
      {
        "id": "uuid",
        "type": "transcript",
        "fileName": "transcript.pdf",
        "fileUrl": "https://...",
        "verified": true
      }
    ],
    "verificationStatus": {
      "documentsVerified": true,
      "cgpaVerified": true,
      "overallStatus": "completed"
    },
    "reviewerScores": [
      {
        "academicScore": 90,
        "financialNeedScore": 85,
        "motivationScore": 80,
        "overallScore": 85
      }
    ],
    "totalScore": 85,
    "ranking": 5
  }
}
```

### PUT /applications/:applicationId/verify
Verify application documents.

**Request Body:**
```json
{
  "documentId": "uuid",
  "verified": true,
  "notes": "Document verified successfully"
}
```

### PUT /applications/:applicationId/score
Score application.

**Request Body:**
```json
{
  "academicScore": 90,
  "financialNeedScore": 85,
  "motivationScore": 80,
  "notes": "Strong candidate"
}
```

### PUT /applications/:applicationId/status
Update application status.

**Request Body:**
```json
{
  "status": "shortlisted",
  "notes": "Shortlisted for final review"
}
```

### POST /applications/:applicationId/award
Award scholarship.

**Request Body:**
```json
{
  "awardAmount": 50000,
  "awardType": "full",
  "disbursementSchedule": [
    {
      "amount": 25000,
      "scheduledDate": "2024-02-01T00:00:00Z",
      "milestone": "course_start"
    }
  ]
}
```

---

## 4. Scholar APIs

### GET /scholars
Get list of scholars.

**Query Parameters:**
- `campaignId`: Filter by campaign
- `status`: active, completed, paused, revoked
- `graduated`: true/false
- `jobPlaced`: true/false
- `atRisk`: true/false
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "scholars": [
      {
        "id": "uuid",
        "name": "John Doe",
        "course": "Full Stack Development",
        "progressPercentage": 75,
        "currentCGPA": 8.8,
        "baselineCGPA": 8.5,
        "jobPlaced": true,
        "graduated": false,
        "riskScore": 20
      }
    ],
    "pagination": {}
  }
}
```

### GET /scholars/:scholarId
Get scholar profile with growth tracking.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "profile": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "award": {
      "amount": 50000,
      "type": "full",
      "date": "2024-01-20T00:00:00Z"
    },
    "academic": {
      "baselineCGPA": 8.5,
      "currentCGPA": 8.8,
      "graduationCGPA": null,
      "graduationStatus": "not-graduated"
    },
    "jobPlacement": {
      "placed": true,
      "jobTitle": "Software Engineer",
      "companyName": "TechCorp",
      "startDate": "2024-06-01T00:00:00Z",
      "verified": true
    },
    "progress": {
      "courseCompletionRate": 75,
      "videoWatchPercentage": 80,
      "assignmentSubmissionRate": 90,
      "sessionAttendanceRate": 85
    },
    "enrollments": [],
    "achievements": [],
    "riskFlags": []
  }
}
```

### PUT /scholars/:scholarId/job-placement
Update job placement information.

**Request Body:**
```json
{
  "jobTitle": "Software Engineer",
  "companyName": "TechCorp",
  "location": "Mumbai, India",
  "salary": {
    "amount": 800000,
    "currency": "INR",
    "period": "yearly"
  },
  "startDate": "2024-06-01T00:00:00Z",
  "jobType": "full-time",
  "source": "course-placement",
  "status": "started",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "offerLetterUrl": "https://...",
  "applicationDate": "2024-04-01T00:00:00Z",
  "interviewDates": ["2024-04-15T00:00:00Z", "2024-04-20T00:00:00Z"],
  "offerDate": "2024-04-25T00:00:00Z",
  "acceptanceDate": "2024-04-28T00:00:00Z",
  "verified": true,
  "consentForSharing": true,
  "notes": "Excellent placement"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobPlacement": {
      "id": "uuid",
      "timeToPlacement": 90,
      "celebrated": true,
      "achievementBadge": {
        "id": "uuid",
        "type": "job_placement",
        "badgeUrl": "https://..."
      }
    }
  }
}
```

### POST /scholars/:scholarId/job-placement/celebrate
Celebrate job placement achievement.

**Response:**
```json
{
  "success": true,
  "data": {
    "achievementBadge": {},
    "congratulatoryMessage": {},
    "successStoryCreated": false
  }
}
```

### PUT /scholars/:scholarId/graduation
Record graduation.

**Request Body:**
```json
{
  "graduationDate": "2024-05-15T00:00:00Z",
  "graduationCGPA": 8.9,
  "degree": "Certificate in Full Stack Development",
  "institution": "Evolvix Bootcamp",
  "certificateUrl": "https://...",
  "transcriptUrl": "https://...",
  "certificateIssued": true,
  "consentForSharing": true,
  "notes": "Outstanding performance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "graduation": {
      "id": "uuid",
      "timeToGraduation": 180,
      "cgpaImprovement": 0.4,
      "cgpaImprovementPercentage": 4.7,
      "certificates": [
        {
          "id": "uuid",
          "type": "graduation",
          "downloadUrl": "https://..."
        }
      ],
      "achievements": []
    }
  }
}
```

### POST /scholars/:scholarId/graduation/celebrate
Celebrate graduation achievement.

**Response:**
```json
{
  "success": true,
  "data": {
    "achievementBadge": {},
    "certificates": [],
    "congratulatoryMessage": {},
    "alumniNetworkAdded": true
  }
}
```

### GET /scholars/:scholarId/progress
Get detailed progress data.

**Query Parameters:**
- `period`: 7d, 30d, 90d, 1y, all

**Response:**
```json
{
  "success": true,
  "data": {
    "progressRecords": [
      {
        "date": "2024-01-20T00:00:00Z",
        "metricType": "cgpa",
        "value": 8.5
      },
      {
        "date": "2024-02-20T00:00:00Z",
        "metricType": "cgpa",
        "value": 8.7
      }
    ],
    "gradeHistory": [
      {
        "date": "2024-01-20T00:00:00Z",
        "grade": 8.5,
        "gradeType": "cgpa",
        "assignmentName": "Mid-term Assessment"
      }
    ],
    "growthMetrics": {
      "baselineCGPA": 8.5,
      "currentCGPA": 8.8,
      "graduationCGPA": 8.9,
      "cgpaImprovement": 0.3,
      "cgpaImprovementPercentage": 3.5,
      "gradeTrend": "improving",
      "progressImprovement": 75,
      "engagementScore": 85,
      "isTopPerformer": false,
      "isMostImproved": true
    },
    "academicMilestones": [
      {
        "id": "uuid",
        "milestoneType": "high_grade",
        "title": "Achieved High CGPA",
        "achievedAt": "2024-02-20T00:00:00Z"
      }
    ]
  }
}
```

### GET /scholars/:scholarId/growth
Get comprehensive growth metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "growthTimeline": [
      {
        "id": "uuid",
        "eventType": "award",
        "title": "Scholarship Awarded",
        "date": "2024-01-01T00:00:00Z"
      },
      {
        "id": "uuid",
        "eventType": "job_placement",
        "title": "Job Placed",
        "date": "2024-06-01T00:00:00Z"
      }
    ],
    "cgpaProgress": {
      "baseline": 8.5,
      "current": 8.8,
      "graduation": 8.9,
      "improvement": 0.4,
      "improvementPercentage": 4.7
    },
    "achievements": [],
    "rankings": {
      "cgpaRank": 5,
      "improvementRank": 2,
      "engagementRank": 8
    }
  }
}
```

### POST /scholars/:scholarId/grades
Record grade update.

**Request Body:**
```json
{
  "courseId": "uuid",
  "date": "2024-02-20T00:00:00Z",
  "grade": 8.7,
  "gradeType": "cgpa",
  "assignmentName": "Mid-term Assessment",
  "maxGrade": 10,
  "notes": "Excellent performance"
}
```

---

## 5. Fund Transfer APIs

### GET /transfers
Get transfer history.

**Query Parameters:**
- `status`: initiated, in-transit, confirmed, failed
- `campaignId`: Filter by campaign
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "transfers": [
      {
        "id": "uuid",
        "amount": 500000,
        "status": "confirmed",
        "createdAt": "2024-01-15T10:00:00Z",
        "confirmedAt": "2024-01-16T14:00:00Z"
      }
    ],
    "pagination": {}
  }
}
```

### POST /transfers
Initiate fund transfer.

**Request Body:**
```json
{
  "amount": 500000,
  "campaignId": "uuid",
  "transferMethod": "bank_transfer",
  "transactionReference": "TXN123456",
  "proofFileId": "file-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "initiated",
    "amount": 500000
  }
}
```

### GET /transfers/:transferId
Get transfer details.

---

## 6. Disbursement APIs

### GET /disbursements
Get disbursement records.

**Query Parameters:**
- `scholarId`: Filter by scholar
- `status`: scheduled, disbursed, cancelled
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "disbursements": [
      {
        "id": "uuid",
        "scholarName": "John Doe",
        "amount": 25000,
        "status": "disbursed",
        "disbursementDate": "2024-02-01T00:00:00Z"
      }
    ],
    "pagination": {}
  }
}
```

### GET /disbursements/:disbursementId
Get disbursement details.

---

## 7. Analytics APIs

### GET /analytics/overview
Get overview analytics.

**Query Parameters:**
- `period`: 7d, 30d, 90d, 1y
- `campaignId`: Filter by campaign

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScholars": 150,
    "activeScholars": 120,
    "graduatedScholars": 25,
    "jobPlacementRate": 80,
    "graduationRate": 85,
    "averageCGPAImprovement": 0.5,
    "totalInvestment": 5000000,
    "roi": 150
  }
}
```

### GET /analytics/growth
Get scholar growth analytics.

**Query Parameters:**
- `period`: Time period
- `campaignId`: Filter by campaign
- `cohortId`: Filter by cohort

**Response:**
```json
{
  "success": true,
  "data": {
    "averageCGPAImprovement": 0.5,
    "averageProgressRate": 75,
    "averageEngagementScore": 80,
    "topPerformers": [],
    "improvementLeaders": []
  }
}
```

### GET /analytics/job-placement
Get job placement analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "placementRate": 80,
    "averageTimeToPlacement": 45,
    "averageSalary": 800000,
    "topCompanies": [],
    "jobRoles": []
  }
}
```

### GET /analytics/impact
Get impact metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "livesChanged": 150,
    "jobsCreated": 120,
    "graduates": 25,
    "totalInvestment": 5000000,
    "costPerGraduate": 200000,
    "costPerJobPlacement": 41667,
    "roi": 150,
    "averageCGPAImprovement": 0.5,
    "averageCGPAImprovementPercentage": 6.2,
    "averageTimeToPlacement": 45,
    "averageTimeToGraduation": 180,
    "topCompanies": ["TechCorp", "DevSolutions", "CodeMasters"],
    "topJobRoles": ["Software Engineer", "Full Stack Developer", "Frontend Developer"],
    "successStoriesCount": 25,
    "featuredStoriesCount": 5,
    "socialImpactScore": 85
  }
}
```

### GET /analytics/graduation
Get graduation analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "graduationRate": 85,
    "averageGraduationCGPA": 8.7,
    "averageTimeToGraduation": 180,
    "certificatesIssued": 25,
    "graduationsByCourse": {
      "full-stack-dev": 15,
      "data-science": 10
    },
    "topPerformers": [],
    "fastestGraduates": []
  }
}
```

---

## 8. Mentor APIs

### GET /mentors
Get list of mentors.

**Response:**
```json
{
  "success": true,
  "data": {
    "mentors": [
      {
        "id": "uuid",
        "name": "Jane Smith",
        "assignedScholars": 10,
        "totalSessions": 50,
        "performanceRating": 4.5
      }
    ]
  }
}
```

### POST /mentors/:mentorId/sessions
Log mentor session.

**Request Body:**
```json
{
  "scholarId": "uuid",
  "courseId": "uuid",
  "sessionDate": "2024-01-20T10:00:00Z",
  "duration": 60,
  "sessionType": "one-on-one",
  "topics": ["React", "Node.js"],
  "notes": "Session notes...",
  "actionItems": ["Complete assignment", "Review concepts"]
}
```

---

## 9. Communication APIs

### GET /conversations
Get conversations.

**Query Parameters:**
- `participantType`: scholar, mentor
- `unread`: true/false
- `page`: Page number

### POST /conversations/:conversationId/messages
Send message.

**Request Body:**
```json
{
  "content": "Message content...",
  "attachments": ["file-id-1"]
}
```

### POST /announcements
Create announcement.

**Request Body:**
```json
{
  "title": "Congratulations!",
  "content": "Announcement content...",
  "recipientType": "all",
  "deliveryMethod": "both",
  "scheduledFor": "2024-01-25T10:00:00Z"
}
```

---

## 10. Success Stories & Achievements APIs

### GET /success-stories
Get success stories.

**Query Parameters:**
- `category`: job_placement, graduation, academic_excellence, transformation
- `featured`: true/false
- `campaignId`: Filter by campaign
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": "uuid",
        "title": "From Student to Software Engineer",
        "summary": "John's journey from scholarship to job placement",
        "scholarName": "John Doe",
        "category": "job_placement",
        "featured": true,
        "beforeMetrics": {
          "cgpa": 8.5,
          "jobStatus": "Unemployed"
        },
        "afterMetrics": {
          "cgpa": 8.9,
          "jobStatus": "Software Engineer at TechCorp"
        },
        "createdAt": "2024-06-01T00:00:00Z"
      }
    ],
    "pagination": {}
  }
}
```

### GET /success-stories/:storyId
Get single success story.

### POST /success-stories
Create success story.

**Request Body:**
```json
{
  "scholarId": "uuid",
  "title": "Success Story Title",
  "summary": "Short summary",
  "fullStory": "Full narrative...",
  "category": "job_placement",
  "consentGiven": true,
  "isPublic": true,
  "featured": false
}
```

### PUT /success-stories/:storyId
Update success story.

### DELETE /success-stories/:storyId
Delete success story.

### POST /success-stories/:storyId/share
Share success story.

**Request Body:**
```json
{
  "platforms": ["linkedin", "twitter"],
  "message": "Custom message"
}
```

### GET /achievements
Get achievements.

**Query Parameters:**
- `scholarId`: Filter by scholar
- `type`: Filter by achievement type
- `page`: Page number

**Response:**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "uuid",
        "type": "job_placement",
        "title": "Job Placed",
        "description": "Successfully placed in a job",
        "badgeUrl": "https://...",
        "earnedAt": "2024-06-01T00:00:00Z",
        "isPublic": true,
        "consentGiven": true
      }
    ]
  }
}
```

### POST /achievements
Create achievement.

**Request Body:**
```json
{
  "scholarId": "uuid",
  "type": "job_placement",
  "title": "Job Placed",
  "description": "Successfully placed in a job",
  "isPublic": false,
  "consentGiven": false
}
```

### GET /leaderboards
Get leaderboards.

**Query Parameters:**
- `type`: highest_cgpa, most_improved, fastest_graduate, best_placement, most_engaged
- `period`: all_time, monthly, quarterly, yearly
- `limit`: Number of entries

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "scholarId": "uuid",
        "scholarName": "John Doe",
        "metric": 9.2,
        "badge": "gold",
        "isPublic": true
      }
    ],
    "period": "all_time",
    "updatedAt": "2024-06-01T00:00:00Z"
  }
}
```

### POST /scholars/:scholarId/encouragement
Send encouragement message.

**Request Body:**
```json
{
  "type": "message",
  "title": "Congratulations!",
  "message": "Great job on your achievement!",
  "isPublic": false
}
```

---

## 11. Report APIs

### POST /reports/generate
Generate report.

**Request Body:**
```json
{
  "reportType": "campaign",
  "campaignId": "uuid",
  "format": "pdf",
  "dateRange": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-12-31T23:59:59Z"
  },
  "metrics": ["scholars", "progress", "financial"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "downloadUrl": "https://...",
    "expiresAt": "2024-01-25T10:00:00Z"
  }
}
```

---

## Error Codes

- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid token
- `PERMISSION_DENIED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Validation failed
- `INSUFFICIENT_FUNDS`: Not enough funds
- `SLOTS_FULL`: No slots available
- `TRANSFER_FAILED`: Transfer failed

---

## Rate Limiting

- **Standard Plan**: 100 requests/minute
- **Premium Plan**: 500 requests/minute


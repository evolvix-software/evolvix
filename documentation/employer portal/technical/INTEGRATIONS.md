# 🔌 Third-Party Integrations

## Overview

This document describes third-party integrations available in the Employer Portal, including ATS systems, calendar services, email providers, and other tools.

## Integration Categories

### 1. ATS (Applicant Tracking System) Integrations
### 2. Calendar Integrations
### 3. Email Integrations
### 4. Communication Integrations
### 5. Analytics Integrations
### 6. Payment Integrations
### 7. Webhook Integrations

---

## ATS Integrations

### Supported ATS Systems

#### Greenhouse
**Features:**
- Sync jobs
- Sync applications
- Sync candidates
- Two-way sync
- Webhook support

**Setup:**
1. Get API key from Greenhouse
2. Enter API key in settings
3. Authorize connection
4. Configure sync settings
5. Test connection

**API Endpoints:**
- Jobs: `GET /v1/jobs`
- Applications: `GET /v1/applications`
- Candidates: `GET /v1/candidates`

#### Lever
**Features:**
- Job posting sync
- Application import
- Candidate sync
- Status updates

**Setup:**
1. Generate API token
2. Configure integration
3. Map fields
4. Enable sync

#### Workday
**Features:**
- Job requisitions
- Candidate data
- Application tracking
- Reporting

**Setup:**
1. OAuth authentication
2. Configure endpoints
3. Map data fields
4. Enable sync

### ATS Integration Flow
```typescript
interface ATSIntegration {
  id: string;
  employerId: string;
  type: 'greenhouse' | 'lever' | 'workday';
  apiKey: string;
  apiSecret?: string;
  config: ATSConfig;
  isActive: boolean;
  lastSyncAt?: Date;
}

interface ATSConfig {
  syncJobs: boolean;
  syncApplications: boolean;
  syncCandidates: boolean;
  syncDirection: 'one-way' | 'two-way';
  webhookUrl?: string;
}
```

### Sync Service
```typescript
class ATSSyncService {
  async syncJobs(integration: ATSIntegration) {
    const atsClient = this.getClient(integration.type);
    const jobs = await atsClient.getJobs();
    
    for (const job of jobs) {
      await this.syncJob(job, integration);
    }
  }
  
  async syncApplications(integration: ATSIntegration) {
    const atsClient = this.getClient(integration.type);
    const applications = await atsClient.getApplications();
    
    for (const app of applications) {
      await this.syncApplication(app, integration);
    }
  }
}
```

---

## Calendar Integrations

### Google Calendar
**Features:**
- Create interview events
- Sync interview schedule
- Send calendar invites
- Check availability
- Two-way sync

**Setup:**
1. OAuth 2.0 authorization
2. Grant calendar permissions
3. Select calendar
4. Configure sync settings

**Implementation:**
```typescript
import { google } from 'googleapis';

class GoogleCalendarIntegration {
  async createEvent(event: InterviewEvent) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    
    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `Interview: ${event.candidateName}`,
        description: event.description,
        start: {
          dateTime: event.startTime,
          timeZone: event.timeZone,
        },
        end: {
          dateTime: event.endTime,
          timeZone: event.timeZone,
        },
        attendees: [
          { email: event.candidateEmail },
          { email: event.interviewerEmail },
        ],
        conferenceData: {
          createRequest: {
            requestId: event.id,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });
    
    return result.data;
  }
}
```

### Microsoft Outlook/Office 365
**Features:**
- Create events
- Sync calendar
- Send invites
- Check availability

**Setup:**
1. Azure AD app registration
2. OAuth authorization
3. Configure permissions
4. Enable sync

---

## Email Integrations

### Gmail Integration
**Features:**
- Send emails via Gmail
- Read emails
- Thread conversations
- Attachments

**Setup:**
1. OAuth 2.0 authorization
2. Grant Gmail permissions
3. Configure email settings
4. Enable integration

### Outlook Integration
**Features:**
- Send emails
- Read emails
- Manage conversations
- Attachments

**Setup:**
1. Microsoft Graph API
2. OAuth authorization
3. Configure settings
4. Enable integration

---

## Communication Integrations

### Slack Integration
**Features:**
- New application notifications
- Job status updates
- Team activity feed
- Custom notifications

**Setup:**
1. Create Slack app
2. Install to workspace
3. Configure webhooks
4. Set up notifications

**Implementation:**
```typescript
class SlackIntegration {
  async sendNotification(channel: string, message: string) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel,
        text: message,
        username: 'Evolvix',
        icon_emoji: ':briefcase:',
      }),
    });
  }
  
  async notifyNewApplication(application: Application) {
    await this.sendNotification(
      '#hiring',
      `New application: ${application.candidateName} applied for ${application.jobTitle}`
    );
  }
}
```

### Microsoft Teams
**Features:**
- Notifications
- Activity feed
- Team collaboration

**Setup:**
1. Teams app registration
2. Configure webhooks
3. Set up notifications

---

## Analytics Integrations

### Google Analytics
**Features:**
- Track page views
- Track events
- User behavior
- Conversion tracking

**Setup:**
1. Add GA tracking ID
2. Configure events
3. Enable tracking

**Implementation:**
```typescript
// Track job view
gtag('event', 'job_view', {
  job_id: jobId,
  job_title: jobTitle,
  company: companyName,
});

// Track application
gtag('event', 'application_submit', {
  job_id: jobId,
  candidate_id: candidateId,
});
```

### Mixpanel
**Features:**
- User analytics
- Event tracking
- Funnel analysis
- Cohort analysis

---

## Payment Integrations

### Stripe
**Features:**
- Subscription management
- Payment processing
- Invoice generation
- Payment methods

**Setup:**
1. Create Stripe account
2. Get API keys
3. Configure webhooks
4. Set up products/plans

**Implementation:**
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createSubscription(customerId: string, priceId: string) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
  
  return subscription;
}
```

---

## Webhook Integrations

### Webhook Configuration
```typescript
interface Webhook {
  id: string;
  employerId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  createdAt: Date;
}

enum WebhookEvent {
  APPLICATION_RECEIVED = 'application.received',
  APPLICATION_STATUS_CHANGED = 'application.status_changed',
  JOB_POSTED = 'job.posted',
  JOB_CLOSED = 'job.closed',
  MESSAGE_RECEIVED = 'message.received',
}
```

### Webhook Delivery
```typescript
class WebhookService {
  async deliver(webhook: Webhook, event: string, payload: any) {
    if (!webhook.events.includes(event)) return;
    
    const signature = this.generateSignature(webhook.secret, payload);
    
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
        },
        body: JSON.stringify({
          event,
          timestamp: new Date().toISOString(),
          data: payload,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Webhook delivery failed: ${response.statusText}`);
      }
    } catch (error) {
      // Retry logic
      await this.retryWebhook(webhook, event, payload);
    }
  }
  
  private generateSignature(secret: string, payload: any): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }
}
```

---

## Zapier Integration

### Zapier Setup
**Features:**
- Connect to 5000+ apps
- Automated workflows
- Custom triggers
- Custom actions

**Triggers:**
- New application
- Application status changed
- New message
- Job posted

**Actions:**
- Create job
- Update application
- Send message
- Add to CRM

---

## Integration Management

### Integration List
```typescript
// GET /api/integrations
async function getIntegrations(req: Request, res: Response) {
  const integrations = await Integration.find({
    employerId: req.user.employerId,
  });
  
  res.json({ success: true, data: integrations });
}
```

### Connect Integration
```typescript
// POST /api/integrations/:type/connect
async function connectIntegration(req: Request, res: Response) {
  const { type } = req.params;
  const { credentials } = req.body;
  
  // Validate credentials
  const isValid = await validateIntegration(type, credentials);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  
  // Create integration
  const integration = await Integration.create({
    employerId: req.user.employerId,
    type,
    credentials: encrypt(credentials),
    isActive: true,
  });
  
  // Test connection
  await testIntegration(integration);
  
  res.json({ success: true, data: integration });
}
```

### Disconnect Integration
```typescript
// DELETE /api/integrations/:id
async function disconnectIntegration(req: Request, res: Response) {
  const { id } = req.params;
  
  const integration = await Integration.findOne({
    id,
    employerId: req.user.employerId,
  });
  
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }
  
  // Stop sync
  await stopSync(integration);
  
  // Delete integration
  await Integration.delete(id);
  
  res.json({ success: true });
}
```

---

## Security Considerations

### Credential Storage
- Encrypt API keys
- Secure storage
- No plaintext secrets
- Regular rotation

### API Security
- Rate limiting
- IP whitelisting
- Signature verification
- HTTPS only

### Data Privacy
- GDPR compliance
- Data encryption
- Access controls
- Audit logging

---

## Future Integrations

1. **CRM Integration**
   - Salesforce
   - HubSpot
   - Pipedrive

2. **HRIS Integration**
   - BambooHR
   - Workday
   - ADP

3. **Assessment Platforms**
   - HackerRank
   - Codility
   - TestGorilla

4. **Background Check**
   - Checkr
   - GoodHire
   - Sterling

5. **Video Interviewing**
   - Zoom
   - Microsoft Teams
   - HireVue


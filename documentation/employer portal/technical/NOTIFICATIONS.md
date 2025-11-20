# 🔔 Notification System

## Overview

This document describes the notification system for the Employer Portal, including real-time notifications, email notifications, push notifications, and notification preferences.

## Notification Types

### 1. Application Notifications
- **New Application**: New candidate applied
- **Application Status Changed**: Status updated
- **Application Moved**: Moved to different stage
- **Application Note Added**: Team member added note
- **Application Message**: New message from candidate

### 2. Job Notifications
- **Job Posted**: Job successfully published
- **Job Expiring Soon**: Job expires in 7 days
- **Job Expired**: Job has expired
- **Job Paused**: Job paused by team member
- **Job Closed**: Job closed

### 3. Message Notifications
- **New Message**: New message from candidate
- **Message Read**: Candidate read your message
- **Bulk Message Sent**: Bulk message completed

### 4. Team Notifications
- **Team Member Invited**: New team member invited
- **Team Member Joined**: Team member accepted invitation
- **Permission Changed**: Your permissions updated
- **Job Assigned**: Job assigned to you

### 5. System Notifications
- **System Update**: Platform updates
- **Maintenance**: Scheduled maintenance
- **Security Alert**: Security-related alerts
- **Billing**: Payment and subscription updates

## Notification Channels

### 1. In-App Notifications
**Features:**
- Real-time updates
- Notification center
- Unread count badge
- Mark as read/unread
- Dismiss notifications
- Filter notifications

**Implementation:**
- WebSocket for real-time
- Polling fallback
- Local storage for offline

### 2. Email Notifications
**Features:**
- HTML email templates
- Plain text fallback
- Unsubscribe option
- Email preferences
- Digest emails

**Templates:**
- New application email
- Daily digest
- Weekly summary
- Custom templates

### 3. Push Notifications (Browser)
**Features:**
- Browser push API
- Service Worker
- Click to open
- Rich notifications
- Action buttons

**Requirements:**
- User permission
- Service Worker
- HTTPS required

### 4. SMS Notifications (Future)
- Critical alerts only
- Opt-in required
- Twilio integration

## Notification Data Structure

### Notification Model
```typescript
interface Notification {
  id: string;
  employerId: string;
  userId: string; // Team member who should see it
  type: NotificationType;
  title: string;
  message: string;
  
  // Related entities
  jobId?: string;
  applicationId?: string;
  conversationId?: string;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Action
  actionUrl?: string;
  actionLabel?: string;
  
  // Metadata
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  metadata?: Record<string, any>;
  
  // Timestamps
  createdAt: Date;
  expiresAt?: Date;
}
```

### Notification Types
```typescript
enum NotificationType {
  NEW_APPLICATION = 'new_application',
  APPLICATION_STATUS_CHANGED = 'application_status_changed',
  APPLICATION_MOVED = 'application_moved',
  APPLICATION_NOTE_ADDED = 'application_note_added',
  APPLICATION_MESSAGE = 'application_message',
  JOB_POSTED = 'job_posted',
  JOB_EXPIRING_SOON = 'job_expiring_soon',
  JOB_EXPIRED = 'job_expired',
  NEW_MESSAGE = 'new_message',
  MESSAGE_READ = 'message_read',
  TEAM_MEMBER_INVITED = 'team_member_invited',
  TEAM_MEMBER_JOINED = 'team_member_joined',
  PERMISSION_CHANGED = 'permission_changed',
  JOB_ASSIGNED = 'job_assigned',
  SYSTEM_UPDATE = 'system_update',
  MAINTENANCE = 'maintenance',
  SECURITY_ALERT = 'security_alert',
  BILLING = 'billing',
}
```

## Real-time Implementation

### WebSocket Setup
```typescript
// Server-side (Node.js)
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.use(async (socket, next) => {
  // Authenticate socket connection
  const token = socket.handshake.auth.token;
  const user = await verifyToken(token);
  
  if (!user) {
    return next(new Error('Authentication error'));
  }
  
  socket.userId = user.id;
  socket.employerId = user.employerId;
  next();
});

io.on('connection', (socket) => {
  // Join employer room
  socket.join(`employer:${socket.employerId}`);
  
  // Join user-specific room
  socket.join(`user:${socket.userId}`);
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Send notification
function sendNotification(notification: Notification) {
  io.to(`user:${notification.userId}`).emit('notification', notification);
}
```

### Client-side WebSocket
```typescript
// hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const socket = io(WS_URL, {
      auth: {
        token: getAccessToken(),
      },
    });
    
    socket.on('connect', () => {
      console.log('Connected to notification server');
    });
    
    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if enabled
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon.png',
        });
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);
  
  return { notifications, unreadCount };
}
```

## Notification Center UI

### Notification List Component
```typescript
function NotificationCenter() {
  const { notifications, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });
  
  return (
    <div className="notification-center">
      <div className="notification-header">
        <h3>Notifications</h3>
        <Badge>{unreadCount}</Badge>
        <button onClick={() => markAllAsRead()}>Mark all as read</button>
      </div>
      
      <div className="notification-list">
        {filteredNotifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={() => markAsRead(notification.id)}
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Notification Item Component
```typescript
function NotificationItem({ notification, onRead, onClick }: NotificationItemProps) {
  return (
    <div
      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
      onClick={() => {
        onClick();
        if (!notification.isRead) {
          onRead();
        }
      }}
    >
      <div className="notification-icon">
        <Icon type={notification.type} />
      </div>
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        <div className="notification-time">
          {formatTimeAgo(notification.createdAt)}
        </div>
      </div>
      {!notification.isRead && <div className="unread-indicator" />}
    </div>
  );
}
```

## Email Notifications

### Email Service Integration
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmailNotification(notification: Notification, user: User) {
  const template = getEmailTemplate(notification.type);
  
  await resend.emails.send({
    from: 'Evolvix <notifications@evolvix.com>',
    to: user.email,
    subject: notification.title,
    html: renderTemplate(template, {
      user,
      notification,
      actionUrl: `${FRONTEND_URL}${notification.actionUrl}`,
    }),
  });
}
```

### Email Templates
```typescript
// templates/new-application.html
const newApplicationTemplate = `
  <h2>New Application Received</h2>
  <p>Hello {{user.name}},</p>
  <p>A new candidate has applied for <strong>{{jobTitle}}</strong>:</p>
  <ul>
    <li>Candidate: {{candidateName}}</li>
    <li>Applied: {{appliedAt}}</li>
    <li>Match Score: {{matchScore}}%</li>
  </ul>
  <a href="{{actionUrl}}">View Application</a>
`;
```

## Push Notifications

### Service Worker Registration
```typescript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: '/icon.png',
    badge: '/badge.png',
    data: {
      url: data.actionUrl,
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

### Request Permission
```typescript
async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
}
```

## Notification Preferences

### Preference Model
```typescript
interface NotificationPreferences {
  userId: string;
  employerId: string;
  
  // Channel preferences
  emailEnabled: boolean;
  inAppEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  
  // Type preferences
  preferences: {
    [key in NotificationType]: {
      email: boolean;
      inApp: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  
  // Frequency
  emailFrequency: 'instant' | 'daily' | 'weekly' | 'never';
  digestTime: string; // For daily/weekly digests
}
```

### Preference Management
```typescript
// GET /api/notifications/preferences
async function getPreferences(req: Request, res: Response) {
  const preferences = await NotificationPreferences.findOne({
    userId: req.user.id,
  });
  
  res.json({ success: true, data: preferences });
}

// PUT /api/notifications/preferences
async function updatePreferences(req: Request, res: Response) {
  const { preferences } = req.body;
  
  await NotificationPreferences.updateOne(
    { userId: req.user.id },
    { $set: preferences },
    { upsert: true }
  );
  
  res.json({ success: true });
}
```

## Notification Delivery

### Delivery Service
```typescript
class NotificationService {
  async send(notification: Notification) {
    // Get user preferences
    const preferences = await this.getPreferences(notification.userId);
    
    // Send via enabled channels
    if (preferences.inAppEnabled) {
      await this.sendInApp(notification);
    }
    
    if (preferences.emailEnabled && this.shouldSendEmail(notification, preferences)) {
      await this.sendEmail(notification);
    }
    
    if (preferences.pushEnabled) {
      await this.sendPush(notification);
    }
  }
  
  private shouldSendEmail(notification: Notification, preferences: NotificationPreferences): boolean {
    if (preferences.emailFrequency === 'never') return false;
    if (preferences.emailFrequency === 'instant') return true;
    
    // Check if notification type is enabled for email
    return preferences.preferences[notification.type]?.email ?? true;
  }
}
```

## Notification Batching

### Digest Emails
```typescript
async function sendDigestEmail(userId: string, frequency: 'daily' | 'weekly') {
  const startDate = frequency === 'daily' 
    ? startOfDay(subDays(new Date(), 1))
    : startOfWeek(subWeeks(new Date(), 1));
  
  const notifications = await Notification.find({
    userId,
    createdAt: { $gte: startDate },
    isRead: false,
  });
  
  if (notifications.length === 0) return;
  
  await sendEmail({
    to: user.email,
    subject: `${frequency === 'daily' ? 'Daily' : 'Weekly'} Digest`,
    html: renderDigestTemplate(notifications),
  });
}
```

## Notification Analytics

### Tracking
```typescript
interface NotificationMetrics {
  totalSent: number;
  totalRead: number;
  readRate: number;
  clickRate: number;
  byType: Record<NotificationType, number>;
  byChannel: {
    email: number;
    inApp: number;
    push: number;
  };
}
```

## Future Enhancements

1. **Smart Notifications**
   - AI-powered prioritization
   - Context-aware notifications
   - Personalized timing

2. **Rich Notifications**
   - Images in notifications
   - Interactive buttons
   - Custom actions

3. **Notification Scheduling**
   - Schedule notifications
   - Quiet hours
   - Do not disturb mode

4. **Advanced Preferences**
   - Custom notification rules
   - Conditional notifications
   - Notification groups

5. **Integration**
   - Slack notifications
   - Microsoft Teams
   - Custom webhooks


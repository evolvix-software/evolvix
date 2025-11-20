# ⚙️ Settings Page

## Overview

The Settings page allows employers to configure their account, company profile, team, notifications, integrations, billing, and security settings.

## Route
```
/portal/employer/settings
/portal/employer/settings/[tab]
```

## Settings Tabs

### 1. Company Profile
**Sections:**
- Basic Information
- Company Details
- Branding
- Social Media Links

**Fields:**
- Company Name*
- Company Slug
- Industry*
- Company Size
- Headquarters
- Website
- Description
- Logo Upload
- Banner Upload
- LinkedIn URL
- Twitter URL
- Facebook URL

### 2. Team Management
**Features:**
- Team Members List
- Invite Team Member
- Role Management
- Permissions

**Team Member Actions:**
- View member details
- Edit role/permissions
- Remove member
- Resend invitation

**Roles:**
- Admin (Full access)
- Recruiter (Limited access)
- Viewer (Read-only)

**Permissions:**
- Post Jobs
- Manage Jobs
- View Applicants
- Manage Applicants
- Manage Career Page
- View Analytics
- Manage Team
- Manage Billing
- Manage Settings

### 3. Job Posting Settings
**Sections:**
- Default Settings
- Application Settings
- Screening Rules
- Templates

**Default Settings:**
- Default employment type
- Default location
- Default remote type
- Auto-publish jobs
- Require approval

**Application Settings:**
- Enable Easy Apply
- Require cover letter
- Require portfolio
- Custom questions
- File requirements

**Screening Rules:**
- Auto-reject rules
- Auto-shortlist rules
- Flag rules
- Custom rules

### 4. Notification Preferences
**Email Notifications:**
- New applications
- Application status changes
- Job expiring soon
- New messages
- Team activity
- System updates
- Marketing emails

**In-App Notifications:**
- Real-time notifications
- Notification center
- Push notifications (browser)
- Sound notifications

**Notification Frequency:**
- Instant
- Daily digest
- Weekly summary
- Never

### 5. Integrations
**Available Integrations:**
- ATS Systems (Greenhouse, Lever, Workday)
- Calendar (Google, Outlook)
- Email (Gmail, Outlook)
- Slack
- Zapier
- Webhooks

**Integration Features:**
- Connect/Disconnect
- Configure settings
- Test connection
- Sync status
- Error handling

### 6. Billing & Subscription
**Sections:**
- Current Plan
- Usage Statistics
- Payment Method
- Billing History
- Invoices

**Plan Information:**
- Plan name
- Plan features
- Job posting credits
- Usage this month
- Renewal date
- Plan limits

**Payment:**
- Payment method
- Update payment method
- Billing address
- Tax information

**Billing History:**
- Past invoices
- Download invoices
- Payment history
- Refund requests

### 7. Security Settings
**Sections:**
- Password
- Two-Factor Authentication
- Session Management
- API Keys
- Security Logs

**Password:**
- Change password
- Password requirements
- Password strength indicator

**2FA:**
- Enable/Disable 2FA
- Setup authenticator app
- Backup codes
- Recovery options

**Sessions:**
- Active sessions
- Device information
- Location
- Last activity
- Revoke sessions

**API Keys:**
- Generate API keys
- View API keys
- Revoke API keys
- API documentation

**Security Logs:**
- Login history
- Security events
- Failed login attempts
- Suspicious activity

### 8. Data & Privacy
**Sections:**
- Data Export
- Data Deletion
- Privacy Settings
- GDPR Compliance

**Data Export:**
- Export all data
- Select data types
- Export format
- Download export

**Data Deletion:**
- Delete account
- Delete data
- Data retention
- Confirmation

**Privacy Settings:**
- Profile visibility
- Data sharing
- Marketing preferences
- Cookie preferences

## Components

### 1. Settings Navigation
**Tabs:**
- Company Profile
- Team
- Jobs
- Notifications
- Integrations
- Billing
- Security
- Privacy

**Features:**
- Active tab indicator
- Badge for unsaved changes
- Quick navigation
- Mobile menu

### 2. Form Sections
**Structure:**
- Section title
- Section description
- Form fields
- Save button
- Cancel button

**Features:**
- Auto-save (optional)
- Validation
- Error messages
- Success messages

### 3. Team Member List
**Displays:**
- Member name
- Email
- Role
- Status (Active, Pending)
- Last active
- Actions

**Actions:**
- Edit
- Remove
- Resend invitation

### 4. Invite Dialog
**Fields:**
- Email*
- Name
- Role*
- Permissions
- Assigned Jobs (optional)

**Features:**
- Validation
- Send invitation
- Copy invitation link

### 5. Integration Cards
**Displays:**
- Integration name
- Logo
- Status (Connected/Disconnected)
- Last sync
- Actions

**Actions:**
- Connect
- Disconnect
- Configure
- Test

### 6. Plan Comparison
**Features:**
- Current plan highlighted
- Feature comparison
- Upgrade/Downgrade options
- Plan details

## User Interactions

### 1. Update Profile
- Edit fields
- Upload images
- Save changes
- See confirmation

### 2. Invite Team Member
- Click "Invite"
- Fill form
- Select role
- Send invitation
- Track status

### 3. Manage Permissions
- Select team member
- Edit permissions
- Save changes
- See updated access

### 4. Configure Notifications
- Toggle notifications
- Set frequency
- Save preferences
- Test notifications

### 5. Connect Integration
- Click "Connect"
- Authorize connection
- Configure settings
- Test connection
- Enable sync

### 6. Update Billing
- View current plan
- Compare plans
- Upgrade/Downgrade
- Update payment method
- View invoices

### 7. Change Password
- Enter current password
- Enter new password
- Confirm password
- Save changes
- Logout other sessions

### 8. Enable 2FA
- Click "Enable 2FA"
- Scan QR code
- Enter verification code
- Save backup codes
- Enable 2FA

## Validation & Security

### Form Validation
- Required fields
- Email format
- Password strength
- URL format
- File size/type

### Security Measures
- CSRF protection
- Rate limiting
- Input sanitization
- Secure file uploads
- Encrypted data

## Responsive Design

### Desktop (>1024px)
- Sidebar navigation
- Main content area
- Full forms
- All features

### Tablet (768px - 1024px)
- Collapsible sidebar
- Stacked forms
- Touch-optimized

### Mobile (<768px)
- Bottom navigation
- Full-screen forms
- Simplified UI
- Mobile-optimized

## Future Enhancements

1. **Advanced Permissions**
   - Custom roles
   - Granular permissions
   - Permission templates

2. **SSO Integration**
   - Single Sign-On
   - SAML support
   - OAuth providers

3. **Audit Logs**
   - Activity logs
   - Change history
   - Compliance reports

4. **Custom Branding**
   - White-label options
   - Custom domains
   - Branded emails

5. **Advanced Security**
   - IP whitelisting
   - Device management
   - Security policies


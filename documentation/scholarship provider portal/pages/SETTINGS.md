# ⚙️ Settings Page

## Overview

The Settings page allows providers to configure account settings, manage team members, set notification preferences, configure integrations, manage compliance settings, and customize portal preferences. It provides comprehensive control over the provider portal configuration.

## Route

```
/portal/provider/settings
/portal/provider/settings/profile
/portal/provider/settings/team
/portal/provider/settings/notifications
/portal/provider/settings/integrations
/portal/provider/settings/compliance
/portal/provider/settings/security
```

## Page Layout

### Header Section
- Page title: "Settings"
- Settings categories
- Save button (context-aware)
- Help link

### Tabs
- Profile
- Team
- Notifications
- Integrations
- Compliance
- Security
- Billing (if applicable)

## Components

### 1. Profile Tab

#### Organization Information
**Fields:**
- Organization Name* (text input)
- Organization Slug* (text input, auto-generated)
- Logo (image upload)
- Banner (image upload)
- Description (textarea)
- Website (url input)
- Contact Email* (email input)
- Contact Phone (tel input)
- Address (textarea)

**Features:**
- Image upload with preview
- Slug validation
- Auto-save draft
- Preview changes

---

#### Contact Information
**Fields:**
- Primary Contact Name* (text input)
- Primary Contact Email* (email input)
- Primary Contact Phone (tel input)
- Secondary Contact (optional)
- Billing Contact (optional)

**Validation:**
- Email format validation
- Phone format validation
- Required field validation

---

#### Organization Details
**Fields:**
- Industry (dropdown)
- Organization Type (dropdown)
- Tax ID (text input, masked)
- Registration Number (text input)
- Founded Year (number input)
- Organization Size (dropdown)

**Security:**
- Mask sensitive information
- Encrypt sensitive data
- Secure storage

---

### 2. Team Tab

#### Team Members List
**Displays:**
- Team member name and photo
- Email address
- Role
- Status (Active, Inactive, Pending)
- Last active
- Actions

**Actions:**
- Invite Member
- Edit Member
- Change Role
- Deactivate Member
- Remove Member

---

#### Invite Team Member Form
**Fields:**
- Email Address* (email input)
- Name (text input, optional)
- Role* (Admin, Reviewer, Finance, Viewer)
- Permissions* (granular permissions)
- Send Invitation Email (checkbox)

**Role Permissions:**
- **Admin**: Full access
- **Reviewer**: Applications, Scholars (read/write)
- **Finance**: Funds, Reports (read/write)
- **Viewer**: Read-only access

**Custom Permissions:**
- Campaigns (create, read, update, delete)
- Applications (read, verify, score, award)
- Scholars (read, update)
- Funds (read, transfer)
- Reports (read, generate)
- Settings (read, update)

**Process:**
1. Enter email and role
2. Set permissions
3. Send invitation
4. Member receives email
5. Member accepts and joins

---

#### Edit Team Member
**Fields:**
- Name (text input)
- Role (dropdown)
- Permissions (checkboxes)
- Status (Active, Inactive)

**Actions:**
- Update Role
- Update Permissions
- Deactivate Account
- Remove from Team

---

### 3. Notifications Tab

#### Email Notifications
**Notification Types:**
- New Application Received
- Application Status Changed
- Scholar Status Changed
- Job Placement Updated
- Graduation Recorded
- Fund Transfer Status
- Disbursement Completed
- Campaign Updates
- Team Member Actions
- System Alerts

**Settings:**
- Enable/Disable each notification
- Email frequency (Instant, Daily Digest, Weekly Digest)
- Email format (HTML, Plain Text)

---

#### In-App Notifications
**Settings:**
- Enable in-app notifications
- Notification sound
- Desktop notifications
- Notification categories

**Categories:**
- Applications
- Scholars
- Funds
- Campaigns
- Team
- System

---

#### Notification Preferences
**Preferences:**
- Quiet hours (time range)
- Do not disturb mode
- Priority notifications only
- Notification grouping

---

### 4. Integrations Tab

#### Available Integrations
**Integration Types:**
- Payment Gateways
- Email Services
- Calendar (Google, Outlook)
- Accounting Software
- LMS Integration
- Student Information System
- Analytics Tools
- Communication Tools

---

#### Integration Configuration
**For Each Integration:**
- Integration name
- Status (Connected, Disconnected)
- Configuration fields
- Test connection button
- Disconnect button

**Example - Payment Gateway:**
- API Key
- Secret Key
- Webhook URL
- Test Mode toggle
- Connection status

**Example - Email Service:**
- SMTP Server
- Port
- Username
- Password
- From Email
- Test email button

---

#### Webhook Configuration
**Fields:**
- Webhook URL* (url input)
- Events* (multi-select)
- Secret Key (text input, masked)
- Status (Active, Inactive)
- Test Webhook button

**Events:**
- Application submitted
- Application awarded
- Scholar graduated
- Job placement
- Fund transfer
- Disbursement

---

### 5. Compliance Tab

#### Data Retention Settings
**Settings:**
- Application retention period (days/years)
- Scholar data retention period
- Financial data retention period
- Archive old data (checkbox)
- Auto-delete after retention (checkbox)

---

#### Consent Management
**Settings:**
- Require explicit consent for data sharing
- Consent expiration period
- Consent renewal reminders
- Consent withdrawal process

**Features:**
- Consent tracking
- Consent history
- Consent reports
- Consent audit log

---

#### Privacy Settings
**Settings:**
- Data anonymization
- PII masking
- Data export options
- Data deletion requests
- GDPR compliance mode
- CCPA compliance mode

---

#### Audit Logging
**Settings:**
- Enable audit logging
- Log retention period
- Log export options
- Log access permissions

**Logged Actions:**
- User logins
- Data access
- Data modifications
- Settings changes
- Team member actions
- Financial transactions

---

### 6. Security Tab

#### Password Settings
**Settings:**
- Minimum password length
- Password complexity requirements
- Password expiration (days)
- Password history (prevent reuse)
- Two-factor authentication (2FA)

**2FA Configuration:**
- Enable 2FA
- Authentication method (SMS, Email, App)
- Backup codes
- Recovery options

---

#### Session Management
**Settings:**
- Session timeout (minutes)
- Remember me option
- Concurrent session limit
- Force logout on password change

**Active Sessions:**
- List of active sessions
- Device information
- Location
- Last activity
- Terminate session option

---

#### Access Control
**Settings:**
- IP whitelist (optional)
- IP blacklist
- Geographic restrictions
- Device restrictions
- Time-based access

---

#### Security Alerts
**Settings:**
- Failed login alerts
- Unusual activity alerts
- Password change alerts
- Permission change alerts
- Security breach alerts

**Alert Methods:**
- Email
- In-app notification
- SMS (optional)

---

### 7. Billing Tab (If Applicable)

#### Subscription Information
**Displays:**
- Current plan
- Subscription status
- Billing cycle
- Next billing date
- Amount

**Actions:**
- Upgrade Plan
- Downgrade Plan
- Cancel Subscription
- Update Payment Method

---

#### Payment Methods
**Displays:**
- Saved payment methods
- Default payment method
- Billing history

**Actions:**
- Add Payment Method
- Set Default
- Remove Payment Method
- View Invoices

---

#### Invoice History
**Displays:**
- Invoice number
- Date
- Amount
- Status
- Download link

**Actions:**
- Download Invoice
- View Invoice Details
- Request Receipt

---

## Data Requirements

### API Endpoints
- `GET /api/provider/settings/profile`
- `PUT /api/provider/settings/profile`
- `GET /api/provider/settings/team`
- `POST /api/provider/settings/team/invite`
- `PUT /api/provider/settings/team/:memberId`
- `GET /api/provider/settings/notifications`
- `PUT /api/provider/settings/notifications`
- `GET /api/provider/settings/integrations`
- `POST /api/provider/settings/integrations`
- `PUT /api/provider/settings/compliance`
- `PUT /api/provider/settings/security`

### Data Structure
```typescript
interface ProviderSettings {
  profile: {
    organizationName: string;
    organizationSlug: string;
    logo?: string;
    banner?: string;
    contactEmail: string;
    contactPhone?: string;
  };
  notifications: {
    email: NotificationSettings;
    inApp: NotificationSettings;
    preferences: NotificationPreferences;
  };
  integrations: Integration[];
  compliance: ComplianceSettings;
  security: SecuritySettings;
}
```

## User Interactions

### 1. Update Profile
- Edit fields → Make changes
- Upload images → Preview changes
- Save → Update profile
- View changes → Confirm updates

### 2. Manage Team
- Invite member → Send invitation
- Edit member → Update role/permissions
- Deactivate → Temporarily disable
- Remove → Permanently remove

### 3. Configure Notifications
- Enable/disable → Toggle notifications
- Set frequency → Choose timing
- Test notifications → Verify settings
- Save → Apply changes

### 4. Set Up Integrations
- Select integration → Choose type
- Configure → Enter credentials
- Test → Verify connection
- Activate → Enable integration

### 5. Manage Security
- Enable 2FA → Set up authentication
- Configure sessions → Set timeout
- Review access → Check active sessions
- Update password → Change password

## Responsive Design

### Desktop (>1024px)
- Multi-column layout
- Side-by-side forms
- Full feature set
- Data tables

### Tablet (768px - 1024px)
- 2-column layout
- Stacked forms
- Touch-optimized
- Responsive tables

### Mobile (<768px)
- Single column
- Full-screen forms
- Bottom navigation
- Simplified interface

## Loading States

### Initial Load
- Skeleton loaders
- Progressive loading
- Smooth transitions

### Saving Settings
- Loading indicator
- Save confirmation
- Success message

## Error Handling

### Validation Errors
- Inline validation
- Error messages
- Prevent save
- Guidance text

### API Errors
- Error notifications
- Retry buttons
- Fallback data
- Support contact

## Security Considerations

### Data Protection
- Encrypt sensitive data
- Mask sensitive fields
- Secure file uploads
- Audit logging

### Access Control
- Role-based permissions
- Session management
- IP restrictions
- 2FA enforcement

## Future Enhancements

1. **Advanced Permissions**
   - Custom role builder
   - Granular permissions
   - Permission templates
   - Permission inheritance

2. **Single Sign-On (SSO)**
   - SAML integration
   - OAuth integration
   - LDAP integration
   - Active Directory

3. **Advanced Security**
   - Biometric authentication
   - Risk-based authentication
   - Security monitoring
   - Threat detection

4. **Customization**
   - Theme customization
   - Branding options
   - Custom fields
   - Workflow customization

5. **API Management**
   - API key management
   - API usage analytics
   - Rate limiting
   - Webhook management


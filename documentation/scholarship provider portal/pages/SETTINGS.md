# ⚙️ Settings Page

## Overview

The Settings page allows scholarship providers to configure their organization profile, account security, payment methods, notification preferences, and system preferences. This page is essential for managing provider account details and customizing the portal experience.

## Route

```
/portal/provider/settings
/portal/provider/settings/[section]
```

## Page Layout

### Header Section
- Page title: "Settings"
- Current organization name
- Verification badge (if verified)
- Save changes button (when editing)

### Settings Sections Navigation
- Sidebar or tab navigation
- Section icons
- Active section indicator

## Settings Sections

### 1. Organization Profile

**Purpose:** Manage organization information and branding

#### Basic Information
**Fields:**
- **Organization Name*** (required)
- **Organization Slug** (auto-generated, editable)
- **Contact Email*** (required)
- **Contact Phone**
- **Website URL**
- **Address**
- **Country**
- **City/State**

**Actions:**
- Update organization name
- Edit contact information
- Update website and address
- Save changes

#### Branding
**Fields:**
- **Logo Upload**
  - Supported formats: PNG, JPG, SVG
  - Max size: 2MB
  - Recommended dimensions: 200x200px
  - Preview current logo
  - Remove logo option
- **Banner Upload**
  - Supported formats: PNG, JPG
  - Max size: 5MB
  - Recommended dimensions: 1200x300px
  - Preview current banner
  - Remove banner option

**Actions:**
- Upload logo
- Upload banner
- Remove logo/banner
- Preview changes
- Save branding

#### Organization Description
**Fields:**
- **About Organization** (textarea)
  - Mission statement
  - Values
  - Impact focus
  - Max 2000 characters
- **Focus Areas** (tags)
  - Education
  - Technology
  - Healthcare
  - Social Impact
  - etc.

**Actions:**
- Edit description
- Add/remove focus areas
- Save description

---

### 2. Account & Security

**Purpose:** Manage account credentials and security settings

#### Account Information
**Fields:**
- **Email Address*** (read-only, contact support to change)
- **User ID** (read-only, system-generated)
- **Account Created** (read-only)
- **Last Login** (read-only)
- **Account Status** (Active, Suspended, etc.)

**Actions:**
- View account details
- Request email change (contact support)

#### Password Management
**Fields:**
- **Current Password*** (required for changes)
- **New Password*** (required)
  - Minimum 8 characters
  - Must include uppercase, lowercase, number
  - Password strength indicator
- **Confirm New Password*** (required)
  - Must match new password

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Actions:**
- Change password
- View password requirements
- Show/hide password fields
- Save new password

#### Two-Factor Authentication (2FA)
**Features:**
- Enable/Disable 2FA
- Setup QR code for authenticator app
- Backup codes generation
- Recovery email setup

**2FA Methods:**
- Authenticator App (TOTP)
- SMS (optional)
- Email (backup)

**Actions:**
- Enable 2FA
- Disable 2FA
- Generate backup codes
- View recovery options

#### Security Settings
**Features:**
- **Active Sessions**
  - List of active sessions
  - Device information
  - Location
  - Last activity
  - Revoke session option
- **Login History**
  - Recent login attempts
  - Success/failure status
  - IP address
  - Location
  - Date/time
- **Security Alerts**
  - Enable email alerts for suspicious activity
  - Enable alerts for password changes
  - Enable alerts for new device login

**Actions:**
- View active sessions
- Revoke sessions
- View login history
- Configure security alerts

---

### 3. Payment Methods

**Purpose:** Manage payment methods for fund transfers

#### Payment Methods List
**Displays:**
- Payment method type (Bank Transfer, UPI, etc.)
- Account details (masked)
- Default indicator
- Status (Verified, Pending)
- Last used date

**Payment Method Types:**
- **Bank Transfer**
  - Bank name
  - Account number (masked)
  - IFSC code
  - Account holder name
  - Account type (Savings/Current)
- **UPI**
  - UPI ID
  - Verified status
- **Digital Wallet** (if applicable)
  - Wallet type
  - Wallet ID

**Actions:**
- Add new payment method
- Set default payment method
- Edit payment method
- Remove payment method
- Verify payment method

#### Add Payment Method
**Form Fields:**
- **Payment Method Type*** (dropdown)
  - Bank Transfer
  - UPI
  - Digital Wallet
- **Account Details** (based on type)
  - Bank name, account number, IFSC (for bank)
  - UPI ID (for UPI)
  - Wallet details (for wallet)
- **Account Holder Name*** (required)
- **Set as Default** (checkbox)

**Verification:**
- Upload proof document (bank statement, etc.)
- Verification status
- Verification notes

**Actions:**
- Add payment method
- Upload verification documents
- Cancel addition

---

### 4. Notification Preferences

**Purpose:** Configure email and in-app notification settings

#### Email Notifications
**Notification Types:**
- **Application Notifications**
  - New application received
  - Application status changed
  - Application requires attention
  - Bulk application updates
- **Scholar Notifications**
  - Scholar progress updates
  - Scholar achievements
  - Scholar at-risk alerts
  - Job placement updates
  - Graduation notifications
- **Campaign Notifications**
  - Campaign status changes
  - Campaign assignment notifications
  - Campaign deadline reminders
- **Fund Notifications**
  - Transfer status updates
  - Transfer confirmations
  - Disbursement notifications
  - Balance alerts
- **System Notifications**
  - System updates
  - Maintenance notices
  - Security alerts
  - Account changes

**Settings:**
- Enable/Disable each notification type
- Notification frequency (Instant, Daily Digest, Weekly Summary)
- Email format (HTML, Plain Text)

**Actions:**
- Toggle notification types
- Set notification frequency
- Save preferences
- Test email notification

#### In-App Notifications
**Settings:**
- **Enable In-App Notifications** (toggle)
- **Notification Sound** (toggle)
- **Desktop Notifications** (toggle, requires permission)
- **Notification Badge** (toggle)

**Notification Categories:**
- Applications
- Scholars
- Campaigns
- Funds
- System

**Actions:**
- Enable/disable notification categories
- Configure notification display
- Test notifications

---

### 5. Preferences

**Purpose:** Customize portal appearance and behavior

#### Display Preferences
**Settings:**
- **Theme**
  - Light
  - Dark
  - Auto (system preference)
- **Language**
  - English (default)
  - Hindi
  - Other languages (if available)
- **Date Format**
  - DD/MM/YYYY
  - MM/DD/YYYY
  - YYYY-MM-DD
- **Time Format**
  - 12-hour
  - 24-hour
- **Currency Display**
  - INR (₹)
  - USD ($)
  - Other currencies

**Actions:**
- Select theme
- Change language
- Set date/time format
- Save preferences

#### Dashboard Preferences
**Settings:**
- **Default Dashboard View**
  - Overview (default)
  - Detailed
  - Compact
- **Default Landing Page**
  - Dashboard
  - Campaigns
  - Applications
  - Scholars
- **Widget Visibility**
  - Show/hide specific widgets
  - Widget order preference
- **Data Refresh Rate**
  - Real-time
  - Every 5 minutes
  - Every 15 minutes
  - Manual refresh only

**Actions:**
- Configure dashboard layout
- Set default landing page
- Customize widgets
- Save dashboard preferences

#### Table & List Preferences
**Settings:**
- **Default View Mode**
  - Grid
  - List
  - Table
- **Items Per Page**
  - 10
  - 25
  - 50
  - 100
- **Default Sort**
  - By date (newest first)
  - By name (A-Z)
  - By status
  - Custom

**Actions:**
- Set default view mode
- Configure pagination
- Set default sort order

---

### 6. Privacy & Security

**Purpose:** Manage privacy settings and data sharing preferences

#### Privacy Settings
**Settings:**
- **Profile Visibility**
  - Public (visible to all)
  - Private (visible to Evolvix only)
  - Limited (visible to assigned scholars)
- **Data Sharing**
  - Share analytics data (anonymized)
  - Share success stories (with consent)
  - Share impact metrics publicly
- **Contact Information Visibility**
  - Show email to scholars
  - Show phone to scholars
  - Show address publicly

**Actions:**
- Configure visibility settings
- Update data sharing preferences
- Save privacy settings

#### Data Management
**Features:**
- **Data Export**
  - Export account data
  - Export campaign data
  - Export scholar data
  - Export financial data
  - Format: CSV, JSON, PDF
- **Data Deletion**
  - Request data deletion
  - Account deletion request
  - Data retention information

**Actions:**
- Request data export
- Request data deletion
- View data retention policy

#### Cookie Preferences
**Settings:**
- **Essential Cookies** (required, cannot disable)
- **Analytics Cookies** (optional)
- **Marketing Cookies** (optional)

**Actions:**
- Manage cookie preferences
- View cookie policy

---

### 8. Integration Settings (Future)

**Purpose:** Configure integrations with external services

#### API Access
**Features:**
- **API Keys**
  - Generate API key
  - Revoke API key
  - View API usage
  - Set API permissions
- **Webhooks**
  - Configure webhook URLs
  - Test webhooks
  - View webhook logs

**Actions:**
- Generate API key
- Configure webhooks
- View API documentation

#### Third-Party Integrations
**Available Integrations:**
- Accounting software (future)
- CRM systems (future)
- Email marketing (future)
- Analytics tools (future)

**Actions:**
- Connect integration
- Disconnect integration
- Configure integration settings

---

## User Interactions

### 1. Update Organization Profile
- Navigate to Settings → Organization Profile
- Edit organization details
- Upload logo/banner
- Update description
- Save changes
- View confirmation message

### 2. Change Password
- Navigate to Settings → Account & Security
- Click "Change Password"
- Enter current password
- Enter new password
- Confirm new password
- Save changes
- Receive confirmation email

### 3. Enable 2FA
- Navigate to Settings → Account & Security
- Click "Enable 2FA"
- Scan QR code with authenticator app
- Enter verification code
- Save backup codes
- Confirm 2FA enabled

### 4. Add Payment Method
- Navigate to Settings → Payment Methods
- Click "Add Payment Method"
- Select payment type
- Enter payment details
- Upload verification documents
- Set as default (optional)
- Save payment method
- Wait for verification

### 5. Configure Notifications
- Navigate to Settings → Notification Preferences
- Toggle notification types
- Set notification frequency
- Configure in-app notifications
- Save preferences

### 6. Update Preferences
- Navigate to Settings → Preferences
- Select theme
- Change language
- Configure dashboard preferences
- Save preferences
- See immediate changes

### 7. Manage Privacy
- Navigate to Settings → Privacy & Security
- Configure visibility settings
- Update data sharing preferences
- Request data export
- Save privacy settings

---

## Data Requirements

### API Endpoints
- `GET /api/provider/settings`
- `PUT /api/provider/settings/profile`
- `PUT /api/provider/settings/security`
- `PUT /api/provider/settings/notifications`
- `PUT /api/provider/settings/preferences`
- `POST /api/provider/settings/payment-methods`
- `DELETE /api/provider/settings/payment-methods/:id`
- `GET /api/provider/settings/team` (if applicable)
- `POST /api/provider/settings/team/invite` (if applicable)

### Data Structure
```typescript
interface ProviderSettings {
  profile: {
    organizationName: string;
    organizationSlug: string;
    contactEmail: string;
    contactPhone?: string;
    website?: string;
    address?: string;
    logo?: string;
    banner?: string;
    description?: string;
    focusAreas: string[];
  };
  security: {
    email: string;
    twoFactorEnabled: boolean;
    activeSessions: Session[];
    loginHistory: LoginAttempt[];
    securityAlerts: SecurityAlertSettings;
  };
  paymentMethods: PaymentMethod[];
  notifications: {
    email: EmailNotificationSettings;
    inApp: InAppNotificationSettings;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    currency: string;
    dashboardLayout: 'overview' | 'detailed' | 'compact';
    defaultLandingPage: string;
    itemsPerPage: number;
    defaultViewMode: 'grid' | 'list' | 'table';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'limited';
    dataSharing: DataSharingSettings;
    contactVisibility: ContactVisibilitySettings;
  };
  team?: TeamMember[]; // Optional, if team management is enabled
}
```

---

## Responsive Design

### Desktop (>1024px)
- Sidebar navigation for settings sections
- Two-column layout for forms
- Full feature set
- Inline editing

### Tablet (768px - 1024px)
- Collapsible sidebar
- Single column forms
- Touch-optimized inputs
- Stacked layout

### Mobile (<768px)
- Bottom navigation or drawer
- Single column
- Simplified forms
- Touch-friendly controls
- Swipe gestures

---

## Security Considerations

### 1. Password Security
- Enforce strong password requirements
- Show password strength indicator
- Prevent password reuse
- Require current password for changes

### 2. Two-Factor Authentication
- Encourage 2FA enablement
- Provide backup codes
- Support multiple 2FA methods
- Clear setup instructions

### 3. Session Management
- Show active sessions
- Allow session revocation
- Display session details (device, location)
- Auto-logout inactive sessions

### 4. Data Privacy
- Clear privacy settings
- Data export functionality
- Data deletion requests
- Transparent data usage

### 5. Payment Method Security
- Mask sensitive information
- Require verification
- Secure storage
- Audit trail

---

## Validation & Error Handling

### 1. Form Validation
- Required field validation
- Email format validation
- Phone number validation
- URL format validation
- File upload validation (size, type)
- Password strength validation

### 2. Error Messages
- Clear error messages
- Field-specific errors
- Inline validation
- Error summary at top

### 3. Success Feedback
- Success messages
- Confirmation dialogs
- Visual feedback
- Auto-dismiss messages

---

## Future Enhancements

1. **Advanced Security**
   - Biometric authentication
   - Security keys support
   - Advanced threat detection

2. **Customization**
   - Custom dashboard widgets
   - Custom color themes
   - Custom notification sounds

3. **Integrations**
   - Accounting software integration
   - CRM integration
   - Email marketing integration
   - Analytics integration

4. **Team Features**
   - Role templates
   - Permission groups
   - Activity logs
   - Audit trails

5. **Automation**
   - Notification rules
   - Auto-responses
   - Workflow automation

6. **Reporting**
   - Settings change history
   - Activity reports
   - Security reports

---

## Notes

- All settings changes are saved automatically or require explicit save action
- Critical changes (password, email, 2FA) require additional verification
- Payment method changes require verification
- Team management features are optional and may not be available for all providers
- Settings are synced across devices when logged in
- Some settings may require admin approval (e.g., organization name changes)


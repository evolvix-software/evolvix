# 🔐 Authentication & Authorization

## Overview

This document outlines the authentication and authorization system for the Employer Portal, including security measures, role-based access control, and session management.

## Authentication Flow

### Login Flow
```
1. User enters credentials (email/password)
2. Frontend validates input
3. POST /api/auth/login
4. Backend validates credentials
5. Generate JWT tokens (access + refresh)
6. Return tokens to frontend
7. Store tokens securely
8. Redirect to dashboard
```

### Registration Flow
```
1. User fills registration form
2. Frontend validates input
3. POST /api/auth/register
4. Backend creates employer account
5. Send verification email
6. User verifies email
7. Account activated
8. Auto-login or redirect to login
```

## Authentication Methods

### 1. Email/Password
**Implementation:**
- Email as username
- Password (min 8 chars, complexity requirements)
- Password hashing (bcrypt)
- Password reset flow

**Security:**
- Rate limiting (5 attempts per 15 minutes)
- Account lockout after failed attempts
- Password strength requirements
- Password history (prevent reuse)

### 2. Social Authentication (Future)
- Google OAuth
- LinkedIn OAuth
- Microsoft OAuth

### 3. Single Sign-On (SSO) - Future
- SAML 2.0
- OAuth 2.0
- Custom SSO providers

## Token Management

### JWT Structure
```typescript
interface JWTPayload {
  userId: string;
  employerId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}
```

### Access Token
- **Lifetime**: 15 minutes
- **Storage**: HttpOnly cookie (preferred) or localStorage
- **Usage**: Included in Authorization header
- **Format**: `Bearer <token>`

### Refresh Token
- **Lifetime**: 7 days
- **Storage**: HttpOnly cookie
- **Usage**: Refresh access token
- **Rotation**: New refresh token on each refresh

### Token Refresh Flow
```
1. Access token expires
2. Frontend detects 401 response
3. Call POST /api/auth/refresh with refresh token
4. Backend validates refresh token
5. Generate new access token
6. Optionally rotate refresh token
7. Return new tokens
8. Retry original request
```

## Session Management

### Session Storage
- **Server-side**: Redis sessions
- **Client-side**: HttpOnly cookies
- **Session timeout**: 30 minutes inactivity
- **Max session duration**: 24 hours

### Session Lifecycle
```
1. Login → Create session
2. Activity → Extend session
3. Logout → Destroy session
4. Timeout → Auto-logout
5. Multiple devices → Manage sessions
```

### Active Sessions
- View all active sessions
- Device information
- Location (IP-based)
- Last activity
- Revoke sessions

## Role-Based Access Control (RBAC)

### Roles

#### Admin
**Permissions:**
- Full access to all features
- Manage team members
- Manage billing
- Manage settings
- View all data

#### Recruiter
**Permissions:**
- Post jobs
- Manage assigned jobs
- View applicants
- Manage applicants
- Send messages
- View analytics (limited)
- Cannot:
  - Manage team
  - Manage billing
  - Manage settings

#### Viewer
**Permissions:**
- View jobs
- View applicants
- View analytics
- Cannot:
  - Edit anything
  - Post jobs
  - Send messages

### Permission System
```typescript
interface Permission {
  resource: string;  // 'jobs', 'applicants', 'settings'
  action: string;   // 'create', 'read', 'update', 'delete'
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}
```

### Permission Checks
```typescript
// Middleware example
function requirePermission(resource: string, action: string) {
  return (req, res, next) => {
    const user = req.user;
    const hasPermission = user.permissions.some(
      p => p.resource === resource && p.action === action
    );
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// Usage
router.post('/jobs', requirePermission('jobs', 'create'), createJob);
```

## Security Measures

### Password Security
- **Hashing**: bcrypt (cost factor 12)
- **Requirements**:
  - Minimum 8 characters
  - At least one uppercase
  - At least one lowercase
  - At least one number
  - At least one special character
- **History**: Prevent last 5 passwords
- **Expiration**: Optional (90 days)

### Account Security
- **Email Verification**: Required for activation
- **Two-Factor Authentication**: Optional (TOTP)
- **Account Lockout**: After 5 failed attempts
- **Suspicious Activity**: Alert on unusual login
- **Password Reset**: Secure token-based flow

### API Security
- **HTTPS Only**: All API calls over HTTPS
- **CORS**: Configured for allowed origins
- **Rate Limiting**: Per endpoint and per user
- **CSRF Protection**: Token-based
- **Input Validation**: All inputs validated
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: Input sanitization

### Rate Limiting
```typescript
// Rate limit configuration
const rateLimits = {
  login: '5/15m',        // 5 attempts per 15 minutes
  register: '3/1h',      // 3 attempts per hour
  passwordReset: '3/1h', // 3 attempts per hour
  api: '100/1m',         // 100 requests per minute
};
```

## Two-Factor Authentication (2FA)

### Setup Flow
```
1. User enables 2FA in settings
2. Generate secret key
3. Display QR code
4. User scans with authenticator app
5. User enters verification code
6. Verify and enable 2FA
7. Save backup codes
```

### Login with 2FA
```
1. User enters email/password
2. Backend validates credentials
3. Check if 2FA enabled
4. Request 2FA code
5. User enters code from app
6. Verify code
7. Generate tokens
8. Complete login
```

### Backup Codes
- Generate 10 backup codes
- Single-use codes
- Regenerate option
- Secure storage

## Password Reset Flow

### Request Reset
```
1. User clicks "Forgot Password"
2. Enters email
3. Backend generates reset token
4. Send email with reset link
5. Token expires in 1 hour
```

### Reset Password
```
1. User clicks reset link
2. Verify token validity
3. Show reset form
4. User enters new password
5. Validate password
6. Update password
7. Invalidate all sessions
8. Redirect to login
```

## Company-Level Authorization

### Company Context
- All data scoped to employer/company
- Users can only access their company's data
- Cross-company access prevented

### Multi-Company Support (Future)
- Users can belong to multiple companies
- Switch company context
- Company-specific permissions

## API Authentication

### Request Headers
```typescript
// Required headers
{
  'Authorization': 'Bearer <access_token>',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
}
```

### Authentication Middleware
```typescript
async function authenticate(req, res, next) {
  try {
    const token = extractToken(req);
    const payload = verifyToken(token);
    const user = await getUserById(payload.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    req.user = user;
    req.employer = await getEmployerById(payload.employerId);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Frontend Authentication

### Auth Context
```typescript
interface AuthContext {
  employer: Employer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Usage
const { employer, isAuthenticated, login, logout } = useAuth();
```

### Protected Routes
```typescript
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, employer } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && employer.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}

// Usage
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### Token Storage
```typescript
// Secure token storage
class TokenStorage {
  static setAccessToken(token: string) {
    // Option 1: HttpOnly cookie (server sets)
    // Option 2: localStorage (if no HttpOnly support)
    localStorage.setItem('accessToken', token);
  }
  
  static getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  
  static removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
```

## Logout Flow

### Logout Process
```
1. User clicks logout
2. Call POST /api/auth/logout
3. Backend invalidates refresh token
4. Clear tokens from storage
5. Clear user state
6. Redirect to login
```

### Logout All Devices
```
1. User selects "Logout All Devices"
2. Backend invalidates all refresh tokens
3. All sessions terminated
4. User must login again
```

## Security Best Practices

### 1. Token Security
- Use HttpOnly cookies when possible
- Set Secure flag (HTTPS only)
- Set SameSite attribute
- Short token lifetimes
- Token rotation

### 2. Password Security
- Never store plaintext passwords
- Use strong hashing algorithms
- Enforce password policies
- Regular password updates
- Password history

### 3. Session Security
- Secure session storage
- Session timeout
- Session fixation prevention
- Concurrent session limits

### 4. API Security
- Validate all inputs
- Sanitize outputs
- Rate limiting
- CORS configuration
- Error handling (no sensitive info)

### 5. Monitoring
- Log authentication events
- Monitor failed login attempts
- Alert on suspicious activity
- Track session anomalies
- Security audit logs

## Compliance

### GDPR
- Right to access data
- Right to deletion
- Data portability
- Consent management

### SOC 2
- Access controls
- Audit logging
- Encryption
- Incident response

## Future Enhancements

1. **Biometric Authentication**
   - Fingerprint
   - Face ID
   - Touch ID

2. **Hardware Tokens**
   - YubiKey support
   - Hardware security keys

3. **Advanced SSO**
   - SAML 2.0
   - OAuth 2.0
   - OpenID Connect

4. **Risk-Based Authentication**
   - Device fingerprinting
   - Behavioral analysis
   - Adaptive authentication

5. **Zero Trust Architecture**
   - Continuous verification
   - Least privilege access
   - Micro-segmentation


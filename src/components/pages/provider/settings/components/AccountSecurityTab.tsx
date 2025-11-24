"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Provider } from '@/data/mock/providerData';
import { Shield, Key, Eye, EyeOff, Smartphone, Monitor, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AccountSecurityTabProps {
  provider: Provider | null;
}

export function AccountSecurityTab({ provider }: AccountSecurityTabProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [saving, setSaving] = useState(false);

  // Mock active sessions
  const activeSessions = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      ip: '192.168.1.1',
      lastActivity: new Date().toISOString(),
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Delhi, India',
      ip: '192.168.1.2',
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      current: false,
    },
  ];

  // Mock login history
  const loginHistory = [
    {
      id: '1',
      date: new Date().toISOString(),
      success: true,
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      ip: '192.168.1.1',
    },
    {
      id: '2',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      success: true,
      device: 'Safari on iPhone',
      location: 'Delhi, India',
      ip: '192.168.1.2',
    },
    {
      id: '3',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      success: false,
      device: 'Unknown',
      location: 'Unknown',
      ip: '192.168.1.3',
    },
  ];

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      // TODO: Implement password change API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEnable2FA = () => {
    setShow2FASetup(true);
  };

  const handleRevokeSession = (sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      // TODO: Implement session revocation
      alert('Session revoked successfully');
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
    return { strength: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Account Information
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <p className="text-foreground">{provider?.contactEmail}</p>
              <p className="text-xs text-muted-foreground mt-1">Contact support to change email</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">User ID</label>
              <p className="text-foreground font-mono text-sm">{provider?.userId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Account Created</label>
              <p className="text-foreground">
                {provider?.createdAt ? new Date(provider.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Account Status</label>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5" />
            Change Password
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Current Password *"
            type={showCurrentPassword ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            icon={<Key className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />
          <Input
            label="New Password *"
            type={showNewPassword ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            icon={<Key className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />
          {passwordData.newPassword && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Password Strength</span>
                <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`${passwordStrength.color} h-2 rounded-full transition-all`}
                  style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
          <Input
            label="Confirm New Password *"
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            icon={<Key className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            required
          />
          {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
            <p className="text-sm text-red-600">Passwords do not match</p>
          )}
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-semibold text-foreground mb-2">Password Requirements:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            {saving ? 'Changing Password...' : 'Change Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Two-Factor Authentication
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-semibold text-foreground">2FA Status</p>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {twoFactorEnabled ? (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Enabled
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium">
                  Disabled
                </span>
              )}
            </div>
          </div>
          {!twoFactorEnabled && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <Button onClick={handleEnable2FA} variant="outline">
                Enable 2FA
              </Button>
            </div>
          )}
          {show2FASetup && (
            <div className="p-4 border border-border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-4">
                2FA setup will be implemented. Scan the QR code with your authenticator app.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => { setTwoFactorEnabled(true); setShow2FASetup(false); }}>
                  Complete Setup
                </Button>
                <Button variant="outline" onClick={() => setShow2FASetup(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Active Sessions
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-foreground">{session.device}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.location}
                      </span>
                      <span>{session.ip}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(session.lastActivity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.current && (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs font-medium">
                      Current
                    </span>
                  )}
                  {!session.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Login History</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginHistory.map((login) => (
              <div
                key={login.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {login.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{login.device}</p>
                    <p className="text-xs text-muted-foreground">
                      {login.location} • {login.ip} • {new Date(login.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    login.success
                      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  {login.success ? 'Success' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


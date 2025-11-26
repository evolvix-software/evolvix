"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { 
  Key, 
  Shield, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Download
} from 'lucide-react';
import { SecuritySession, APIKey } from '../types';

interface SecurityTabProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export function SecurityTab({ onUnsavedChanges }: SecurityTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [sessions] = useState<SecuritySession[]>([
    {
      id: '1',
      device: 'Chrome on Windows',
      browser: 'Chrome 120.0',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.1',
      lastActivity: new Date().toISOString(),
      isCurrent: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      browser: 'Safari 17.0',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.2',
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isCurrent: false,
    },
  ]);

  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'evlx_sk_live_••••••••••••••••',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      permissions: ['view_applicants', 'manage_applicants'],
    },
  ]);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    // TODO: Change password via API
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onUnsavedChanges?.(false);
  };

  const handleRevokeSession = (id: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      // TODO: Revoke session via API
      alert('Session revoked successfully!');
    }
  };

  const handleRevokeAPIKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key?')) {
      // TODO: Revoke API key via API
      alert('API key revoked successfully!');
    }
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak' };
    if (password.length < 10) return { strength: 2, label: 'Medium' };
    return { strength: 3, label: 'Strong' };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Security Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account security and access
        </p>
      </div>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
            <div className="relative">
              <Input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
            <div className="relative">
              <Input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        strength.strength === 1 ? 'bg-red-500 w-1/3' :
                        strength.strength === 2 ? 'bg-yellow-500 w-2/3' :
                        strength.strength === 3 ? 'bg-green-500 w-full' : ''
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{strength.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
            <Input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive mt-1">Passwords do not match</p>
            )}
          </div>
          <Button onClick={handleChangePassword} disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}>
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">2FA Status</div>
              <div className="text-sm text-muted-foreground mt-1">
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <Button
              variant={twoFactorEnabled ? 'outline' : 'default'}
              onClick={() => {
                if (twoFactorEnabled) {
                  if (confirm('Are you sure you want to disable 2FA?')) {
                    setTwoFactorEnabled(false);
                    onUnsavedChanges?.(true);
                  }
                } else {
                  // TODO: Show 2FA setup flow
                  alert('2FA setup flow would open here');
                  setTwoFactorEnabled(true);
                  onUnsavedChanges?.(true);
                }
              }}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active login sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Monitor className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">{session.device}</div>
                  <div className="text-sm text-muted-foreground">
                    {session.browser} • {session.location} • {session.ipAddress}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last activity: {new Date(session.lastActivity).toLocaleString()}
                  </div>
                </div>
                {session.isCurrent && (
                  <Badge variant="primary">Current</Badge>
                )}
              </div>
              {!session.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Keys
              </CardTitle>
              <CardDescription>Manage your API keys for integrations</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <div className="font-medium text-foreground">{key.name}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">{key.key}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Created: {new Date(key.createdAt).toLocaleDateString()}
                  {key.lastUsed && ` • Last used: ${new Date(key.lastUsed).toLocaleString()}`}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRevokeAPIKey(key.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


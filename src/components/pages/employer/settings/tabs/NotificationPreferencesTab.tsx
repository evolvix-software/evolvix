"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { NotificationPreferences } from '../types';

interface NotificationPreferencesTabProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export function NotificationPreferencesTab({ onUnsavedChanges }: NotificationPreferencesTabProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      newApplications: true,
      applicationStatusChanges: true,
      jobExpiringSoon: true,
      newMessages: true,
      teamActivity: false,
      systemUpdates: true,
      marketingEmails: false,
    },
    inApp: {
      realTime: true,
      notificationCenter: true,
      pushNotifications: true,
      soundNotifications: false,
    },
    frequency: 'instant',
  });

  const handleEmailChange = (field: keyof NotificationPreferences['email'], value: boolean) => {
    setPreferences({
      ...preferences,
      email: { ...preferences.email, [field]: value }
    });
    onUnsavedChanges?.(true);
  };

  const handleInAppChange = (field: keyof NotificationPreferences['inApp'], value: boolean) => {
    setPreferences({
      ...preferences,
      inApp: { ...preferences.inApp, [field]: value }
    });
    onUnsavedChanges?.(true);
  };

  const handleSave = () => {
    // TODO: Save to API
    alert('Notification preferences saved!');
    onUnsavedChanges?.(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage how you receive notifications
        </p>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose which emails you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.email.newApplications}
              onCheckedChange={(checked) => handleEmailChange('newApplications', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">New Applications</div>
              <div className="text-sm text-muted-foreground">Get notified when candidates apply</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.email.applicationStatusChanges}
              onCheckedChange={(checked) => handleEmailChange('applicationStatusChanges', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Application Status Changes</div>
              <div className="text-sm text-muted-foreground">Updates when application status changes</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.email.jobExpiringSoon}
              onCheckedChange={(checked) => handleEmailChange('jobExpiringSoon', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Job Expiring Soon</div>
              <div className="text-sm text-muted-foreground">Reminders before jobs expire</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.email.newMessages}
              onCheckedChange={(checked) => handleEmailChange('newMessages', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">New Messages</div>
              <div className="text-sm text-muted-foreground">When you receive messages from candidates</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.email.teamActivity}
              onCheckedChange={(checked) => handleEmailChange('teamActivity', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Team Activity</div>
              <div className="text-sm text-muted-foreground">Updates on team member actions</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.email.systemUpdates}
              onCheckedChange={(checked) => handleEmailChange('systemUpdates', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">System Updates</div>
              <div className="text-sm text-muted-foreground">Important platform updates</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.email.marketingEmails}
              onCheckedChange={(checked) => handleEmailChange('marketingEmails', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Marketing Emails</div>
              <div className="text-sm text-muted-foreground">Product updates and tips</div>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>Configure in-app notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.inApp.realTime}
              onCheckedChange={(checked) => handleInAppChange('realTime', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Real-time Notifications</div>
              <div className="text-sm text-muted-foreground">Receive notifications instantly</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.inApp.notificationCenter}
              onCheckedChange={(checked) => handleInAppChange('notificationCenter', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Notification Center</div>
              <div className="text-sm text-muted-foreground">Show notification center</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.inApp.pushNotifications}
              onCheckedChange={(checked) => handleInAppChange('pushNotifications', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Browser Push Notifications</div>
              <div className="text-sm text-muted-foreground">Receive push notifications in browser</div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={preferences.inApp.soundNotifications}
              onCheckedChange={(checked) => handleInAppChange('soundNotifications', !!checked)}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Sound Notifications</div>
              <div className="text-sm text-muted-foreground">Play sound for notifications</div>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>How often you want to receive email digests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(['instant', 'daily', 'weekly', 'never'] as const).map((freq) => (
              <label key={freq} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
                <input
                  type="radio"
                  name="frequency"
                  value={freq}
                  checked={preferences.frequency === freq}
                  onChange={() => {
                    setPreferences({ ...preferences, frequency: freq });
                    onUnsavedChanges?.(true);
                  }}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground capitalize">{freq}</div>
                  {freq === 'instant' && <div className="text-sm text-muted-foreground">Receive notifications immediately</div>}
                  {freq === 'daily' && <div className="text-sm text-muted-foreground">Daily summary email</div>}
                  {freq === 'weekly' && <div className="text-sm text-muted-foreground">Weekly summary email</div>}
                  {freq === 'never' && <div className="text-sm text-muted-foreground">No email digests</div>}
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-purple-600">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';

interface NotificationSettings {
  email: {
    applications: {
      newApplication: boolean;
      statusChanged: boolean;
      requiresAttention: boolean;
      bulkUpdates: boolean;
    };
    scholars: {
      progressUpdates: boolean;
      achievements: boolean;
      atRiskAlerts: boolean;
      jobPlacement: boolean;
      graduation: boolean;
    };
    campaigns: {
      statusChanges: boolean;
      assignmentNotifications: boolean;
      deadlineReminders: boolean;
    };
    funds: {
      transferStatus: boolean;
      transferConfirmations: boolean;
      disbursements: boolean;
      balanceAlerts: boolean;
    };
    system: {
      updates: boolean;
      maintenance: boolean;
      securityAlerts: boolean;
      accountChanges: boolean;
    };
    frequency: 'instant' | 'daily' | 'weekly';
    format: 'html' | 'plain';
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    badge: boolean;
    categories: {
      applications: boolean;
      scholars: boolean;
      campaigns: boolean;
      funds: boolean;
      system: boolean;
    };
  };
}

export function NotificationPreferencesTab() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      applications: {
        newApplication: true,
        statusChanged: true,
        requiresAttention: true,
        bulkUpdates: false,
      },
      scholars: {
        progressUpdates: true,
        achievements: true,
        atRiskAlerts: true,
        jobPlacement: true,
        graduation: true,
      },
      campaigns: {
        statusChanges: true,
        assignmentNotifications: true,
        deadlineReminders: true,
      },
      funds: {
        transferStatus: true,
        transferConfirmations: true,
        disbursements: true,
        balanceAlerts: true,
      },
      system: {
        updates: true,
        maintenance: true,
        securityAlerts: true,
        accountChanges: true,
      },
      frequency: 'instant',
      format: 'html',
    },
    inApp: {
      enabled: true,
      sound: true,
      desktop: false,
      badge: true,
      categories: {
        applications: true,
        scholars: true,
        campaigns: true,
        funds: true,
        system: true,
      },
    },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const saved = localStorage.getItem('evolvix_provider_notification_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading notification settings:', e);
      }
    }
  }, []);

  const handleEmailToggle = (category: string, field: string, value: boolean) => {
    setSettings(prev => {
      const categoryKey = category as keyof typeof prev.email;
      const categoryData = prev.email[categoryKey];
      if (categoryData && typeof categoryData === 'object' && !Array.isArray(categoryData)) {
        return {
          ...prev,
          email: {
            ...prev.email,
            [category]: {
              ...categoryData,
              [field]: value,
            },
          },
        };
      }
      return prev;
    });
  };

  const handleInAppToggle = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      inApp: {
        ...prev.inApp,
        [field]: value,
      },
    }));
  };

  const handleCategoryToggle = (category: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      inApp: {
        ...prev.inApp,
        categories: {
          ...prev.inApp.categories,
          [category]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('evolvix_provider_notification_settings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Notification preferences saved successfully!');
    } catch (error) {
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Application Notifications */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Application Notifications</h4>
            <div className="space-y-2">
              <Checkbox
                label="New application received"
                checked={settings.email.applications.newApplication}
                onCheckedChange={(checked) =>
                  handleEmailToggle('applications', 'newApplication', checked as boolean)
                }
              />
              <Checkbox
                label="Application status changed"
                checked={settings.email.applications.statusChanged}
                onCheckedChange={(checked) =>
                  handleEmailToggle('applications', 'statusChanged', checked as boolean)
                }
              />
              <Checkbox
                label="Application requires attention"
                checked={settings.email.applications.requiresAttention}
                onCheckedChange={(checked) =>
                  handleEmailToggle('applications', 'requiresAttention', checked as boolean)
                }
              />
              <Checkbox
                label="Bulk application updates"
                checked={settings.email.applications.bulkUpdates}
                onCheckedChange={(checked) =>
                  handleEmailToggle('applications', 'bulkUpdates', checked as boolean)
                }
              />
            </div>
          </div>

          {/* Scholar Notifications */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Scholar Notifications</h4>
            <div className="space-y-2">
              <Checkbox
                label="Scholar progress updates"
                checked={settings.email.scholars.progressUpdates}
                onCheckedChange={(checked) =>
                  handleEmailToggle('scholars', 'progressUpdates', checked as boolean)
                }
              />
              <Checkbox
                label="Scholar achievements"
                checked={settings.email.scholars.achievements}
                onCheckedChange={(checked) =>
                  handleEmailToggle('scholars', 'achievements', checked as boolean)
                }
              />
              <Checkbox
                label="Scholar at-risk alerts"
                checked={settings.email.scholars.atRiskAlerts}
                onCheckedChange={(checked) =>
                  handleEmailToggle('scholars', 'atRiskAlerts', checked as boolean)
                }
              />
              <Checkbox
                label="Job placement updates"
                checked={settings.email.scholars.jobPlacement}
                onCheckedChange={(checked) =>
                  handleEmailToggle('scholars', 'jobPlacement', checked as boolean)
                }
              />
              <Checkbox
                label="Graduation notifications"
                checked={settings.email.scholars.graduation}
                onCheckedChange={(checked) =>
                  handleEmailToggle('scholars', 'graduation', checked as boolean)
                }
              />
            </div>
          </div>

          {/* Campaign Notifications */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Campaign Notifications</h4>
            <div className="space-y-2">
              <Checkbox
                label="Campaign status changes"
                checked={settings.email.campaigns.statusChanges}
                onCheckedChange={(checked) =>
                  handleEmailToggle('campaigns', 'statusChanges', checked as boolean)
                }
              />
              <Checkbox
                label="Campaign assignment notifications"
                checked={settings.email.campaigns.assignmentNotifications}
                onCheckedChange={(checked) =>
                  handleEmailToggle('campaigns', 'assignmentNotifications', checked as boolean)
                }
              />
              <Checkbox
                label="Campaign deadline reminders"
                checked={settings.email.campaigns.deadlineReminders}
                onCheckedChange={(checked) =>
                  handleEmailToggle('campaigns', 'deadlineReminders', checked as boolean)
                }
              />
            </div>
          </div>

          {/* Fund Notifications */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Fund Notifications</h4>
            <div className="space-y-2">
              <Checkbox
                label="Transfer status updates"
                checked={settings.email.funds.transferStatus}
                onCheckedChange={(checked) =>
                  handleEmailToggle('funds', 'transferStatus', checked as boolean)
                }
              />
              <Checkbox
                label="Transfer confirmations"
                checked={settings.email.funds.transferConfirmations}
                onCheckedChange={(checked) =>
                  handleEmailToggle('funds', 'transferConfirmations', checked as boolean)
                }
              />
              <Checkbox
                label="Disbursement notifications"
                checked={settings.email.funds.disbursements}
                onCheckedChange={(checked) =>
                  handleEmailToggle('funds', 'disbursements', checked as boolean)
                }
              />
              <Checkbox
                label="Balance alerts"
                checked={settings.email.funds.balanceAlerts}
                onCheckedChange={(checked) =>
                  handleEmailToggle('funds', 'balanceAlerts', checked as boolean)
                }
              />
            </div>
          </div>

          {/* System Notifications */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">System Notifications</h4>
            <div className="space-y-2">
              <Checkbox
                label="System updates"
                checked={settings.email.system.updates}
                onCheckedChange={(checked) =>
                  handleEmailToggle('system', 'updates', checked as boolean)
                }
              />
              <Checkbox
                label="Maintenance notices"
                checked={settings.email.system.maintenance}
                onCheckedChange={(checked) =>
                  handleEmailToggle('system', 'maintenance', checked as boolean)
                }
              />
              <Checkbox
                label="Security alerts"
                checked={settings.email.system.securityAlerts}
                onCheckedChange={(checked) =>
                  handleEmailToggle('system', 'securityAlerts', checked as boolean)
                }
              />
              <Checkbox
                label="Account changes"
                checked={settings.email.system.accountChanges}
                onCheckedChange={(checked) =>
                  handleEmailToggle('system', 'accountChanges', checked as boolean)
                }
              />
            </div>
          </div>

          {/* Email Settings */}
          <div className="pt-4 border-t border-border">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notification Frequency
                </label>
                <select
                  value={settings.email.frequency}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, frequency: e.target.value as any },
                    }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Format</label>
                <select
                  value={settings.email.format}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      email: { ...prev.email, format: e.target.value as any },
                    }))
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="html">HTML</option>
                  <option value="plain">Plain Text</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            In-App Notifications
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Checkbox
            label="Enable in-app notifications"
            checked={settings.inApp.enabled}
            onCheckedChange={(checked) => handleInAppToggle('enabled', checked as boolean)}
          />
          {settings.inApp.enabled && (
            <>
              <div className="pl-6 space-y-2">
                <Checkbox
                  label="Notification sound"
                  checked={settings.inApp.sound}
                  onCheckedChange={(checked) => handleInAppToggle('sound', checked as boolean)}
                />
                <Checkbox
                  label="Desktop notifications"
                  checked={settings.inApp.desktop}
                  onCheckedChange={(checked) => handleInAppToggle('desktop', checked as boolean)}
                />
                <Checkbox
                  label="Notification badge"
                  checked={settings.inApp.badge}
                  onCheckedChange={(checked) => handleInAppToggle('badge', checked as boolean)}
                />
              </div>
              <div className="pl-6 pt-4 border-t border-border">
                <h4 className="font-semibold text-foreground mb-3">Notification Categories</h4>
                <div className="space-y-2">
                  <Checkbox
                    label="Applications"
                    checked={settings.inApp.categories.applications}
                    onCheckedChange={(checked) => handleCategoryToggle('applications', checked as boolean)}
                  />
                  <Checkbox
                    label="Scholars"
                    checked={settings.inApp.categories.scholars}
                    onCheckedChange={(checked) => handleCategoryToggle('scholars', checked as boolean)}
                  />
                  <Checkbox
                    label="Campaigns"
                    checked={settings.inApp.categories.campaigns}
                    onCheckedChange={(checked) => handleCategoryToggle('campaigns', checked as boolean)}
                  />
                  <Checkbox
                    label="Funds"
                    checked={settings.inApp.categories.funds}
                    onCheckedChange={(checked) => handleCategoryToggle('funds', checked as boolean)}
                  />
                  <Checkbox
                    label="System"
                    checked={settings.inApp.categories.system}
                    onCheckedChange={(checked) => handleCategoryToggle('system', checked as boolean)}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}


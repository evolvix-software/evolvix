"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { Provider } from '@/data/mock/providerData';
import { Shield, Download, Trash2, Eye, EyeOff, Save, AlertTriangle } from 'lucide-react';

interface PrivacySecurityTabProps {
  provider: Provider | null;
}

export function PrivacySecurityTab({ provider }: PrivacySecurityTabProps) {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'limited' as 'public' | 'private' | 'limited',
    dataSharing: {
      analytics: false,
      successStories: false,
      impactMetrics: false,
    },
    contactVisibility: {
      emailToScholars: true,
      phoneToScholars: false,
      addressPublic: false,
    },
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Load saved privacy settings from localStorage
    const saved = localStorage.getItem('evolvix_provider_privacy_settings');
    if (saved) {
      try {
        setPrivacySettings(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading privacy settings:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('evolvix_provider_privacy_settings', JSON.stringify(privacySettings));
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Privacy settings saved successfully!');
    } catch (error) {
      alert('Failed to save privacy settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async (type: string) => {
    try {
      // TODO: Implement actual data export
      alert(`Exporting ${type} data... This feature will be implemented.`);
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  const handleRequestDataDeletion = () => {
    if (confirm('Are you sure you want to request data deletion? This action cannot be undone.')) {
      // TODO: Implement data deletion request
      alert('Data deletion request submitted. You will be contacted for confirmation.');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Settings
          </h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Profile Visibility</label>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) =>
                setPrivacySettings(prev => ({
                  ...prev,
                  profileVisibility: e.target.value as any,
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="public">Public (visible to all)</option>
              <option value="private">Private (visible to Evolvix only)</option>
              <option value="limited">Limited (visible to assigned scholars)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {privacySettings.profileVisibility === 'public' &&
                'Your organization profile will be visible to everyone.'}
              {privacySettings.profileVisibility === 'private' &&
                'Your organization profile will only be visible to Evolvix administrators.'}
              {privacySettings.profileVisibility === 'limited' &&
                'Your organization profile will be visible to scholars assigned to your campaigns.'}
            </p>
          </div>

          {/* Data Sharing */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Data Sharing</h4>
            <div className="space-y-2">
              <Checkbox
                label="Share analytics data (anonymized)"
                checked={privacySettings.dataSharing.analytics}
                onCheckedChange={(checked) =>
                  setPrivacySettings(prev => ({
                    ...prev,
                    dataSharing: { ...prev.dataSharing, analytics: checked as boolean },
                  }))
                }
              />
              <Checkbox
                label="Share success stories (with consent)"
                checked={privacySettings.dataSharing.successStories}
                onCheckedChange={(checked) =>
                  setPrivacySettings(prev => ({
                    ...prev,
                    dataSharing: { ...prev.dataSharing, successStories: checked as boolean },
                  }))
                }
              />
              <Checkbox
                label="Share impact metrics publicly"
                checked={privacySettings.dataSharing.impactMetrics}
                onCheckedChange={(checked) =>
                  setPrivacySettings(prev => ({
                    ...prev,
                    dataSharing: { ...prev.dataSharing, impactMetrics: checked as boolean },
                  }))
                }
              />
            </div>
          </div>

          {/* Contact Information Visibility */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Contact Information Visibility</h4>
            <div className="space-y-2">
              <Checkbox
                label="Show email to scholars"
                checked={privacySettings.contactVisibility.emailToScholars}
                onCheckedChange={(checked) =>
                  setPrivacySettings(prev => ({
                    ...prev,
                    contactVisibility: { ...prev.contactVisibility, emailToScholars: checked as boolean },
                  }))
                }
              />
              <Checkbox
                label="Show phone to scholars"
                checked={privacySettings.contactVisibility.phoneToScholars}
                onCheckedChange={(checked) =>
                  setPrivacySettings(prev => ({
                    ...prev,
                    contactVisibility: { ...prev.contactVisibility, phoneToScholars: checked as boolean },
                  }))
                }
              />
              <Checkbox
                label="Show address publicly"
                checked={privacySettings.contactVisibility.addressPublic}
                onCheckedChange={(checked) =>
                  setPrivacySettings(prev => ({
                    ...prev,
                    contactVisibility: { ...prev.contactVisibility, addressPublic: checked as boolean },
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Privacy Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Export */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Export Your Data</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Download a copy of your data in various formats.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleExportData('account')}
                className="flex items-center gap-2 justify-start"
              >
                <Download className="w-4 h-4" />
                Export Account Data
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportData('campaigns')}
                className="flex items-center gap-2 justify-start"
              >
                <Download className="w-4 h-4" />
                Export Campaign Data
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportData('scholars')}
                className="flex items-center gap-2 justify-start"
              >
                <Download className="w-4 h-4" />
                Export Scholar Data
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportData('financial')}
                className="flex items-center gap-2 justify-start"
              >
                <Download className="w-4 h-4" />
                Export Financial Data
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Available formats: CSV, JSON, PDF
            </p>
          </div>

          {/* Data Deletion */}
          <div className="pt-4 border-t border-border">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Data Deletion
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Request deletion of your account data. This action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                Request Data Deletion
              </Button>
            ) : (
              <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                  Are you sure you want to request data deletion? This will permanently delete all your account data, campaigns, and associated information. This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRequestDataDeletion}
                    className="text-red-600 border-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Confirm Deletion Request
                  </Button>
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Data retention: Your data will be retained according to our data retention policy. Contact support for more information.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cookie Preferences */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Cookie Preferences</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Essential Cookies</p>
                <p className="text-xs text-muted-foreground">Required for the site to function</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Always Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Analytics Cookies</p>
                <p className="text-xs text-muted-foreground">Help us improve our services</p>
              </div>
              <Checkbox
                checked={true}
                onCheckedChange={() => {}}
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Marketing Cookies</p>
                <p className="text-xs text-muted-foreground">Used for advertising purposes</p>
              </div>
              <Checkbox
                checked={false}
                onCheckedChange={() => {}}
              />
            </div>
            <Button variant="outline" className="w-full">
              View Cookie Policy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


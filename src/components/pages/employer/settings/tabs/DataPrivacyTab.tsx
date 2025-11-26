"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { Download, Trash2, AlertTriangle } from 'lucide-react';

interface DataPrivacyTabProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export function DataPrivacyTab({ onUnsavedChanges }: DataPrivacyTabProps) {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    marketingPreferences: false,
    cookiePreferences: true,
  });

  const handleExport = () => {
    // TODO: Generate and download data export
    alert('Data export will be prepared and sent to your email.');
  };

  const handleDeleteData = () => {
    const confirmed = confirm(
      'Are you sure you want to delete your data? This action cannot be undone.'
    );
    if (confirmed) {
      const doubleConfirm = prompt(
        'Type "DELETE" to confirm data deletion:'
      );
      if (doubleConfirm === 'DELETE') {
        // TODO: Delete data via API
        alert('Data deletion request submitted. You will receive a confirmation email.');
      }
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    );
    if (confirmed) {
      const doubleConfirm = prompt(
        'Type "DELETE ACCOUNT" to confirm:'
      );
      if (doubleConfirm === 'DELETE ACCOUNT') {
        // TODO: Delete account via API
        alert('Account deletion request submitted. You will receive a confirmation email.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Data & Privacy</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your data and privacy settings
        </p>
      </div>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Export
          </CardTitle>
          <CardDescription>Download a copy of your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can request a copy of all your data including jobs, applicants, team members, and settings.
            The export will be prepared and sent to your email address.
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox defaultChecked />
              <span className="text-sm text-foreground">Include all job postings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox defaultChecked />
              <span className="text-sm text-foreground">Include all applicant data</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox defaultChecked />
              <span className="text-sm text-foreground">Include team member information</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox defaultChecked />
              <span className="text-sm text-foreground">Include settings and preferences</span>
            </label>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Export Format</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg bg-background">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <Button onClick={handleExport} className="bg-gradient-to-r from-primary to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Request Data Export
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control how your data is shared and used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Profile Visibility</label>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) => {
                setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value });
                onUnsavedChanges?.(true);
              }}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="limited">Limited</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={privacySettings.dataSharing}
              onCheckedChange={(checked) => {
                setPrivacySettings({ ...privacySettings, dataSharing: !!checked });
                onUnsavedChanges?.(true);
              }}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Data Sharing</div>
              <div className="text-sm text-muted-foreground">
                Allow us to share anonymized data with partners
              </div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={privacySettings.marketingPreferences}
              onCheckedChange={(checked) => {
                setPrivacySettings({ ...privacySettings, marketingPreferences: !!checked });
                onUnsavedChanges?.(true);
              }}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Marketing Preferences</div>
              <div className="text-sm text-muted-foreground">
                Receive marketing emails and updates
              </div>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent/50 rounded-lg">
            <Checkbox
              checked={privacySettings.cookiePreferences}
              onCheckedChange={(checked) => {
                setPrivacySettings({ ...privacySettings, cookiePreferences: !!checked });
                onUnsavedChanges?.(true);
              }}
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Cookie Preferences</div>
              <div className="text-sm text-muted-foreground">
                Accept cookies for analytics and personalization
              </div>
            </div>
          </label>
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={() => {
              alert('Privacy settings saved!');
              onUnsavedChanges?.(false);
            }}>
              Save Privacy Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GDPR Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>GDPR Compliance</CardTitle>
          <CardDescription>Your rights under GDPR</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Under the General Data Protection Regulation (GDPR), you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Erase your data</li>
            <li>Restrict processing of your data</li>
            <li>Data portability</li>
            <li>Object to processing</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            To exercise any of these rights, please contact our support team or use the options below.
          </p>
        </CardContent>
      </Card>

      {/* Data Deletion */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Data
          </CardTitle>
          <CardDescription>Permanently delete your data or account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Delete All Data</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete all your data including jobs, applicants, and settings.
              This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleDeleteData}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Data
            </Button>
          </div>
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


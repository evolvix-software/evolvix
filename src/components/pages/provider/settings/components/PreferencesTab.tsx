"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Palette, Monitor, Table, Save } from 'lucide-react';

interface Preferences {
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    currency: string;
  };
  dashboard: {
    defaultView: 'overview' | 'detailed' | 'compact';
    defaultLandingPage: string;
    refreshRate: 'realtime' | '5min' | '15min' | 'manual';
  };
  table: {
    defaultViewMode: 'grid' | 'list' | 'table';
    itemsPerPage: number;
    defaultSort: string;
  };
}

export function PreferencesTab() {
  const [preferences, setPreferences] = useState<Preferences>({
    display: {
      theme: 'light',
      language: 'English',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      currency: 'INR',
    },
    dashboard: {
      defaultView: 'overview',
      defaultLandingPage: 'dashboard',
      refreshRate: 'realtime',
    },
    table: {
      defaultViewMode: 'grid',
      itemsPerPage: 25,
      defaultSort: 'date-desc',
    },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('evolvix_provider_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading preferences:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('evolvix_provider_preferences', JSON.stringify(preferences));
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Preferences saved successfully!');
    } catch (error) {
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Display Preferences
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
            <select
              value={preferences.display.theme}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  display: { ...prev.display, theme: e.target.value as any },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System Preference)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Language</label>
            <select
              value={preferences.display.language}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  display: { ...prev.display, language: e.target.value },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
            <select
              value={preferences.display.dateFormat}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  display: { ...prev.display, dateFormat: e.target.value },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Time Format</label>
            <select
              value={preferences.display.timeFormat}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  display: { ...prev.display, timeFormat: e.target.value as any },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Currency Display</label>
            <select
              value={preferences.display.currency}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  display: { ...prev.display, currency: e.target.value },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Preferences */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Dashboard Preferences
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Default Dashboard View</label>
            <select
              value={preferences.dashboard.defaultView}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  dashboard: { ...prev.dashboard, defaultView: e.target.value as any },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed</option>
              <option value="compact">Compact</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Default Landing Page</label>
            <select
              value={preferences.dashboard.defaultLandingPage}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  dashboard: { ...prev.dashboard, defaultLandingPage: e.target.value },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="dashboard">Dashboard</option>
              <option value="campaigns">Campaigns</option>
              <option value="applications">Applications</option>
              <option value="scholars">Scholars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data Refresh Rate</label>
            <select
              value={preferences.dashboard.refreshRate}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  dashboard: { ...prev.dashboard, refreshRate: e.target.value as any },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="realtime">Real-time</option>
              <option value="5min">Every 5 minutes</option>
              <option value="15min">Every 15 minutes</option>
              <option value="manual">Manual refresh only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table & List Preferences */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Table className="w-5 h-5" />
            Table & List Preferences
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Default View Mode</label>
            <select
              value={preferences.table.defaultViewMode}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  table: { ...prev.table, defaultViewMode: e.target.value as any },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="table">Table</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Items Per Page</label>
            <select
              value={preferences.table.itemsPerPage}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  table: { ...prev.table, itemsPerPage: parseInt(e.target.value) },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Default Sort</label>
            <select
              value={preferences.table.defaultSort}
              onChange={(e) =>
                setPreferences(prev => ({
                  ...prev,
                  table: { ...prev.table, defaultSort: e.target.value },
                }))
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="date-desc">By date (newest first)</option>
              <option value="date-asc">By date (oldest first)</option>
              <option value="name-asc">By name (A-Z)</option>
              <option value="name-desc">By name (Z-A)</option>
              <option value="status">By status</option>
            </select>
          </div>
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


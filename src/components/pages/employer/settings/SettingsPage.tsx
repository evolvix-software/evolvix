"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Badge } from '@/components/common/ui/Badge';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsTab } from './types';
import { CompanyProfileTab } from './tabs/CompanyProfileTab';
import { TeamManagementTab } from './tabs/TeamManagementTab';
import { JobPostingSettingsTab } from './tabs/JobPostingSettingsTab';
import { NotificationPreferencesTab } from './tabs/NotificationPreferencesTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';
import { BillingTab } from './tabs/BillingTab';
import { SecurityTab } from './tabs/SecurityTab';
import { DataPrivacyTab } from './tabs/DataPrivacyTab';

function SettingsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab') as SettingsTab;
    if (tab && ['profile', 'team', 'jobs', 'notifications', 'integrations', 'billing', 'security', 'privacy'].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('profile');
    }
  }, [searchParams]);

  return (
    <Layout noCard title="Settings" role="employer" noPaddingX>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your company settings and preferences
              </p>
            </div>
            {hasUnsavedChanges && (
              <Badge variant="warning" className="flex items-center gap-1 bg-yellow-500/20 text-yellow-600">
                <SettingsIcon className="w-3 h-3" />
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && <CompanyProfileTab onUnsavedChanges={setHasUnsavedChanges} />}
          {activeTab === 'team' && <TeamManagementTab onUnsavedChanges={setHasUnsavedChanges} />}
          {activeTab === 'jobs' && <JobPostingSettingsTab onUnsavedChanges={setHasUnsavedChanges} />}
          {activeTab === 'notifications' && <NotificationPreferencesTab onUnsavedChanges={setHasUnsavedChanges} />}
          {activeTab === 'integrations' && <IntegrationsTab onUnsavedChanges={setHasUnsavedChanges} />}
          {activeTab === 'billing' && <BillingTab onUnsavedChanges={setHasUnsavedChanges} />}
          {activeTab === 'security' && <SecurityTab onUnsavedChanges={setHasUnsavedChanges} />}
          {activeTab === 'privacy' && <DataPrivacyTab onUnsavedChanges={setHasUnsavedChanges} />}
        </div>
      </div>
    </Layout>
  );
}

export function EmployerSettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}

"use client";

import { SettingsLayout } from '@/components/pages/provider/settings/SettingsLayout';
import { PreferencesTab } from '@/components/pages/provider/settings/components/PreferencesTab';

export default function PreferencesSettingsPage() {
  return (
    <SettingsLayout activeSection="preferences">
      <PreferencesTab />
    </SettingsLayout>
  );
}


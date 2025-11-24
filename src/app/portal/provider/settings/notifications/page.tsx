"use client";

import { SettingsLayout } from '@/components/pages/provider/settings/SettingsLayout';
import { NotificationPreferencesTab } from '@/components/pages/provider/settings/components/NotificationPreferencesTab';

export default function NotificationsSettingsPage() {
  return (
    <SettingsLayout activeSection="notifications">
      <NotificationPreferencesTab />
    </SettingsLayout>
  );
}


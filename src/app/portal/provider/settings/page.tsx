"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile section by default
    router.replace('/portal/provider/settings/profile');
  }, [router]);

  return null;
}

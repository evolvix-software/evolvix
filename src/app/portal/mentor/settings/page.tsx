"use client";

import { useState, useEffect, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SettingsContent } from '@/components/settings/SettingsContent';

function SettingsContentWrapper() {
  const [activeSection, setActiveSection] = useState('profile'); // Default to profile
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setActiveSection(params.get('section') || 'profile'); // Default to profile
    }
  }, []);

  useEffect(() => {
    const updateSection = () => {
      if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setActiveSection(params.get('section') || 'profile');
      }
    };

    window.addEventListener('popstate', updateSection);
    const interval = setInterval(updateSection, 100);
    return () => {
      window.removeEventListener('popstate', updateSection);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Layout title="Settings" role="mentor">
      <SettingsContent section={activeSection} role="mentor" />
    </Layout>
  );
}

export default function MentorSettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading Settings...</div>
      </div>
    }>
      <SettingsContentWrapper />
    </Suspense>
  );
}


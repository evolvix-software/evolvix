"use client";

import { useState, useEffect, Suspense } from 'react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { SettingsContent } from '@/components/settings/SettingsContent';

function SettingsContentWrapper() {
  const [activeSection, setActiveSection] = useState('basic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get section from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setActiveSection(params.get('section') || 'basic');
    }
  }, []);

  // Listen for URL changes
  useEffect(() => {
    const updateSection = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        setActiveSection(params.get('section') || 'basic');
      }
    };

    window.addEventListener('popstate', updateSection);
    const interval = setInterval(updateSection, 100); // Poll for URL changes
    return () => {
      window.removeEventListener('popstate', updateSection);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <StudentLayout title="Settings">
      <SettingsContent section={activeSection} role="student" />
    </StudentLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-slate-600 dark:text-slate-400">Loading Settings...</div>
      </div>
    }>
      <SettingsContentWrapper />
    </Suspense>
  );
}


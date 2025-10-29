"use client";

import { useState, useEffect, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
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
    <Layout title="Settings" role="student">
      <SettingsContent section={activeSection} role="student" />
    </Layout>
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


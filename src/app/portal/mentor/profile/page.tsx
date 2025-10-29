"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MentorProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings profile section
    router.replace('/portal/mentor/settings?section=profile');
  }, [router]);

  return null;
}

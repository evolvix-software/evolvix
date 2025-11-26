"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployerProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings profile section
    router.replace('/portal/employer/settings?section=profile');
  }, [router]);

  return null;
}


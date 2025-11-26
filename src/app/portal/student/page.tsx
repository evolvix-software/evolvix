"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentPortalPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/portal/student/dashboard');
  }, [router]);
  
  return null;
}

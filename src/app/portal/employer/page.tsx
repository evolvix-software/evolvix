"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployerPortalPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/portal/employer/dashboard');
  }, [router]);
  
  return null;
}

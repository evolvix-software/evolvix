"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings profile section
    router.replace('/portal/provider/settings/profile');
  }, [router]);

  return null;
}


"use client";

import { Suspense } from 'react';
import { CareerPathsPage } from '@/components/pages/admin/career-paths/CareerPathsPage';

export default function AdminCareerPathsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CareerPathsPage />
    </Suspense>
  );
}


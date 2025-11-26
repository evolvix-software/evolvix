"use client";

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { PublicCareerPage } from '@/components/pages/employer/career-page/PublicCareerPage';

function PublicCareerPageContent() {
  const params = useParams();
  const companySlug = params.companySlug as string;

  return <PublicCareerPage companySlug={companySlug} />;
}

export default function PublicCareerPageRoute() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <PublicCareerPageContent />
    </Suspense>
  );
}


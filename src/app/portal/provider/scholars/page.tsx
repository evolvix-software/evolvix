"use client";

import { Suspense } from 'react';
import { ScholarsPage } from '@/components/pages/provider/scholars/ScholarsPage';

function ScholarsPageWrapper() {
  return <ScholarsPage />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <ScholarsPageWrapper />
    </Suspense>
  );
}

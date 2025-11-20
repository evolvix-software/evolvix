'use client';

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { TestSummaryPage } from '@/components/pages/student/tests/TestSummaryPage';

function TestSummaryPageContent() {
  return (
    <Layout title="Test Summary" role="student">
      <TestSummaryPage />
    </Layout>
  );
}

export default function TestSummaryPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="Test Summary" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading...</h2>
          </div>
        </div>
      </Layout>
    }>
      <TestSummaryPageContent />
    </Suspense>
  );
}


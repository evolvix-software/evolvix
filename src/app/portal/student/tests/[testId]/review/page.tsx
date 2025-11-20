'use client';

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { TestReviewPage } from '@/components/pages/student/tests/TestReviewPage';

function TestReviewPageContent() {
  return (
    <Layout title="Test Review" role="student">
      <TestReviewPage />
    </Layout>
  );
}

export default function TestReviewPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="Test Review" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading...</h2>
          </div>
        </div>
      </Layout>
    }>
      <TestReviewPageContent />
    </Suspense>
  );
}


'use client';

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { TestTakingPage } from '@/components/pages/student/tests/TestTakingPage';

function TestTakingPageContent() {
  return (
    <Layout noCard title="Taking Test" role="student">
      <TestTakingPage />
    </Layout>
  );
}

export default function TestTakingPageRoute() {
  return (
    <Suspense fallback={
      <Layout noCard title="Taking Test" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading test...</h2>
          </div>
        </div>
      </Layout>
    }>
      <TestTakingPageContent />
    </Suspense>
  );
}


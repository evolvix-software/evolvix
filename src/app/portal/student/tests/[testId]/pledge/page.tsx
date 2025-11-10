'use client';

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { TestPledgePage } from '@/components/pages/student/tests/TestPledgePage';

function TestPledgePageContent() {
  return (
    <Layout title="Test Pledge" role="student">
      <TestPledgePage />
    </Layout>
  );
}

export default function TestPledgePageRoute() {
  return (
    <Suspense fallback={
      <Layout title="Test Pledge" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Loading...</h2>
          </div>
        </div>
      </Layout>
    }>
      <TestPledgePageContent />
    </Suspense>
  );
}


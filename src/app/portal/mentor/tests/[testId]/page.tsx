import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { TestDetailsPage } from '@/components/pages/mentor/tests/TestDetailsPage';

function TestDetailsPageContent() {
  return (
    <Layout title="Test Details" role="mentor">
      <TestDetailsPage />
    </Layout>
  );
}

export default function TestDetailsPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="Test Details" role="mentor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading...</h2>
          </div>
        </div>
      </Layout>
    }>
      <TestDetailsPageContent />
    </Suspense>
  );
}


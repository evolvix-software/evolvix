import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { TestsPage } from '@/components/pages/mentor/tests';

function TestsPageContent() {
  return (
    <Layout title="Module Tests" role="mentor">
      <TestsPage />
    </Layout>
  );
}

export default function TestsPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="Module Tests" role="mentor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading...</h2>
          </div>
        </div>
      </Layout>
    }>
      <TestsPageContent />
    </Suspense>
  );
}


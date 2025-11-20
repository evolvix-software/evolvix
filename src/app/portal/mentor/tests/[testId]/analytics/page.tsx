import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { TestAnalyticsPage } from '@/components/pages/mentor/tests/TestAnalyticsPage';

function TestAnalyticsPageContent() {
  return (
    <Layout title="Test Analytics" role="mentor">
      <TestAnalyticsPage />
    </Layout>
  );
}

export default function TestAnalyticsPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="Test Analytics" role="mentor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading...</h2>
          </div>
        </div>
      </Layout>
    }>
      <TestAnalyticsPageContent />
    </Suspense>
  );
}


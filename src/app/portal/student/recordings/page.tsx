import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { RecordingsPage } from '@/components/pages/student/recordings';

function RecordingsPageContent() {
  return (
    <Layout title="My Recordings" role="student">
      <RecordingsPage />
    </Layout>
  );
}

export default function StudentRecordingsPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="My Recordings" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] dark:border-[#735fff] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading recordings...</h2>
          </div>
        </div>
      </Layout>
    }>
      <RecordingsPageContent />
    </Suspense>
  );
}


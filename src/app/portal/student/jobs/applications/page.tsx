import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { ApplicationsPage } from '@/components/pages/student/jobs/ApplicationsPage';
import { Spinner } from '@/components/common/ui/Loading';

function ApplicationsPageContent() {
  return (
    <Layout role="student" title="My Applications">
      <ApplicationsPage />
    </Layout>
  );
}

export default function StudentApplicationsPageRoute() {
  return (
    <Suspense fallback={
      <Layout role="student" title="My Applications">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" variant="primary" />
        </div>
      </Layout>
    }>
      <ApplicationsPageContent />
    </Suspense>
  );
}


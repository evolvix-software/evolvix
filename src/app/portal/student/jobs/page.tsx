import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { JobsPage } from '@/components/pages/student/jobs/JobsPage';
import { Spinner } from '@/components/common/ui/Loading';

function JobsPageContent() {
  return (
    <Layout role="student" title="Jobs & Opportunities" noCard={true} noPaddingX={true}>
      <JobsPage />
    </Layout>
  );
}

export default function StudentJobsPageRoute() {
  return (
    <Suspense fallback={
      <Layout role="student" title="Jobs & Opportunities" noCard={true} noPaddingX={true}>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" variant="primary" />
        </div>
      </Layout>
    }>
      <JobsPageContent />
    </Suspense>
  );
}


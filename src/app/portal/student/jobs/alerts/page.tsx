import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { AlertsPage } from '@/components/pages/student/jobs/AlertsPage';
import { Spinner } from '@/components/common/ui/Loading';

function AlertsPageContent() {
  return (
    <Layout role="student" title="Job Alerts">
      <AlertsPage />
    </Layout>
  );
}

export default function StudentAlertsPageRoute() {
  return (
    <Suspense fallback={
      <Layout role="student" title="Job Alerts">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" variant="primary" />
        </div>
      </Layout>
    }>
      <AlertsPageContent />
    </Suspense>
  );
}


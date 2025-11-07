import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { MentorAssignmentsPage } from '@/components/pages/mentor/assignments';

function AssignmentsContentWrapper() {
  return <MentorAssignmentsPage />;
}

export default function AssignmentsPage() {
  return (
    <Layout title="Assignments" role="mentor">
      <Suspense fallback={<div className="p-6 text-center">Loading assignments...</div>}>
        <AssignmentsContentWrapper />
      </Suspense>
    </Layout>
  );
}

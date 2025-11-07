"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AssignmentsContent } from '@/components/mentor/components';

function AssignmentsContentWrapper() {
  return <AssignmentsContent />;
}

export default function MentorAssignmentsPage() {
  return (
    <Layout title="Assignments" role="mentor">
      <Suspense fallback={<div className="p-6 text-center">Loading assignments...</div>}>
        <AssignmentsContentWrapper />
      </Suspense>
    </Layout>
  );
}

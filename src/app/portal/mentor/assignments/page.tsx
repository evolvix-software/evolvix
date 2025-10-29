"use client";

import { Layout } from '@/components/layout/Layout';
import { AssignmentsContent } from '@/components/mentor/components';

export default function MentorAssignmentsPage() {
  return (
    <Layout title="Assignments" role="mentor">
      <AssignmentsContent />
    </Layout>
  );
}

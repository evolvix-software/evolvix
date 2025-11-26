'use client';

import { Layout } from '@/components/common/layout/Layout';
import { StudentTestsPage } from '@/components/pages/student/tests';

export default function StudentTestsPageRoute() {
  return (
    <Layout noCard title="My Tests" role="student">
      <StudentTestsPage />
    </Layout>
  );
}


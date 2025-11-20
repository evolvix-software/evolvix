import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { StudentAssignmentsPage } from '@/components/pages/student/assignments';

function AssignmentsPageContent() {
  return (
    <Layout title="My Assignments" role="student">
      <StudentAssignmentsPage />
    </Layout>
  );
}

export default function StudentAssignmentsPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="My Assignments" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] dark:border-[#735fff] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading assignments...</h2>
          </div>
        </div>
      </Layout>
    }>
      <AssignmentsPageContent />
    </Suspense>
  );
}




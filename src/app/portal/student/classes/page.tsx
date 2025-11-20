import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { StudentClassesPage } from '@/components/pages/student/classes';

function ClassesPageContent() {
  return (
    <Layout title="My Classes" role="student">
      <StudentClassesPage />
    </Layout>
  );
}

export default function StudentClassesPageRoute() {
                return (
    <Suspense fallback={
      <Layout title="My Classes" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] dark:border-[#735fff] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading classes...</h2>
          </div>
      </div>
    </Layout>
    }>
      <ClassesPageContent />
    </Suspense>
  );
}

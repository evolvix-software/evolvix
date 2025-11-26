import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { MyCoursesPage } from '@/components/pages/student/courses';

function MyCoursesPageContent() {
  return (
    <Layout noCard title="My Courses" role="student">
      <MyCoursesPage />
    </Layout>
  );
}

export default function StudentMyCoursesPage() {
  return (
    <Suspense fallback={
      <Layout noCard title="My Courses" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] dark:border-[#735fff] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading courses...</h2>
          </div>
        </div>
      </Layout>
    }>
      <MyCoursesPageContent />
    </Suspense>
  );
}

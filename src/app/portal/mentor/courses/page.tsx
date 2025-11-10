import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { MentorCoursesPage } from '@/components/pages/mentor/courses';

function CoursesPageContent() {
  return (
    <Layout title="My Courses" role="mentor">
      <MentorCoursesPage />
    </Layout>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <Layout title="My Courses" role="mentor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
          </div>
        </div>
      </Layout>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}


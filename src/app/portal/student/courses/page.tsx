"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { CoursesPage } from '@/components/pages/student/courses';

function CoursesPageContent() {
  return (
    <Layout noCard title="Browse Courses" role="student">
      <CoursesPage />
    </Layout>
  );
}

export default function StudentCoursesPage() {
  return (
    <Suspense fallback={
      <Layout noCard title="Browse Courses" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] dark:border-[#735fff] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading courses...</h2>
          </div>
        </div>
      </Layout>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}

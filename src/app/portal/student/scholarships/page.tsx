"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { StudentScholarshipsPage } from '@/components/pages/student/scholarships';

function ScholarshipsPageContent() {
  return (
    <Layout title="Scholarships" role="student">
      <StudentScholarshipsPage />
    </Layout>
  );
}

export default function StudentScholarshipsPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="Scholarships" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading scholarships...</h2>
          </div>
        </div>
      </Layout>
    }>
      <ScholarshipsPageContent />
    </Suspense>
  );
}



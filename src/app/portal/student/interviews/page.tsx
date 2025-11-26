"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { AIMockInterviewPage } from '@/components/pages/student/interviews';

function InterviewsPageContent() {
  return (
    <Layout noCard title="AI Mock Interview" role="student">
      <AIMockInterviewPage />
    </Layout>
  );
}

export default function StudentInterviewsPageRoute() {
  return (
    <Suspense fallback={
      <Layout noCard title="AI Mock Interview" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading interviews...</h2>
          </div>
        </div>
      </Layout>
    }>
      <InterviewsPageContent />
    </Suspense>
  );
}



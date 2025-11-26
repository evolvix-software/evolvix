"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { MentorInterviewManagementPage } from '@/components/pages/mentor/interviews';

function InterviewManagementPageContent() {
  return (
    <Layout noCard title="Interview Management" role="mentor">
      <MentorInterviewManagementPage />
    </Layout>
  );
}

export default function MentorInterviewsPageRoute() {
  return (
    <Suspense fallback={
      <Layout noCard title="Interview Management" role="mentor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading interview management...</h2>
          </div>
        </div>
      </Layout>
    }>
      <InterviewManagementPageContent />
    </Suspense>
  );
}

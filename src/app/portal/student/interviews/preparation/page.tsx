"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { InterviewPreparationPage } from '@/components/pages/student/interviews';

function InterviewPreparationPageContent() {
  return (
    <Layout noCard title="Interview Preparation" role="student">
      <InterviewPreparationPage />
    </Layout>
  );
}

export default function StudentInterviewPreparationPageRoute() {
  return (
    <Suspense fallback={
      <Layout noCard title="Interview Preparation" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading interview preparation...</h2>
          </div>
        </div>
      </Layout>
    }>
      <InterviewPreparationPageContent />
    </Suspense>
  );
}



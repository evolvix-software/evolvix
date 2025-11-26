"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { StudentHackathonsPage } from '@/components/pages/student/hackathons';

function HackathonsPageContent() {
  return (
    <Layout noCard title="Hackathons" role="student">
      <StudentHackathonsPage />
    </Layout>
  );
}

export default function StudentHackathonsPageRoute() {
  return (
    <Suspense fallback={
      <Layout noCard title="Hackathons" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading hackathons...</h2>
          </div>
        </div>
      </Layout>
    }>
      <HackathonsPageContent />
    </Suspense>
  );
}



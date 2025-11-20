"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { MentorHackathonsManagementPage } from '@/components/pages/mentor/hackathons';

function HackathonsManagementPageContent() {
  return (
    <Layout title="Hackathons Management" role="mentor">
      <MentorHackathonsManagementPage />
    </Layout>
  );
}

export default function MentorHackathonsPageRoute() {
  return (
    <Suspense fallback={
      <Layout title="Hackathons Management" role="mentor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading hackathons management...</h2>
          </div>
        </div>
      </Layout>
    }>
      <HackathonsManagementPageContent />
    </Suspense>
  );
}



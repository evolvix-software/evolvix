"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { CompanyPage } from '@/components/pages/student/jobs/CompanyPage';

function CompanyPageContent() {
  return (
    <Layout title="Company Profile" role="student" noCard>
      <CompanyPage />
    </Layout>
  );
}

export default function StudentCompanyPageRoute() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff]"></div>
      </div>
    }>
      <CompanyPageContent />
    </Suspense>
  );
}


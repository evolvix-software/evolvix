"use client";

import { Layout } from '@/components/layout/Layout';
import { InterviewsContent } from '@/components/mentor/components';

export default function MentorInterviewsPage() {
  return (
    <Layout title="Interview Evaluation" role="mentor">
      <InterviewsContent />
    </Layout>
  );
}

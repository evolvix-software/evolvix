"use client";

import { Layout } from '@/components/layout/Layout';
import { ProjectsContent } from '@/components/mentor/components';

export default function MentorProjectsPage() {
  return (
    <Layout title="Project Mentorship" role="mentor">
      <ProjectsContent />
    </Layout>
  );
}

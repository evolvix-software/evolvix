"use client";

import { Layout } from '@/components/layout/Layout';
import { ClassesContent } from '@/components/mentor/components';

export default function MentorClassesPage() {
  return (
    <Layout title="Classes" role="mentor">
      <ClassesContent />
    </Layout>
  );
}

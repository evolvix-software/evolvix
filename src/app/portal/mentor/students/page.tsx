"use client";

import { Layout } from '@/components/layout/Layout';
import { StudentsContent } from '@/components/mentor/components';

export default function MentorStudentsPage() {
  return (
    <Layout title="Student Management" role="mentor">
      <StudentsContent />
    </Layout>
  );
}

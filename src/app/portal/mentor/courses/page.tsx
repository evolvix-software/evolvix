"use client";

import { Layout } from '@/components/layout/Layout';
import { CoursesManagement } from '@/components/mentor/components';

export default function MentorCoursesPage() {
  return (
    <Layout title="My Courses" role="mentor">
      <CoursesManagement />
    </Layout>
  );
}


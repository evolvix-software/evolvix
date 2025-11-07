import { Layout } from '@/components/common/layout/Layout';
import { MentorCoursesPage } from '@/components/pages/mentor/courses';

export default function CoursesPage() {
  return (
    <Layout title="My Courses" role="mentor">
      <MentorCoursesPage />
    </Layout>
  );
}


import { Layout } from '@/components/common/layout/Layout';
import { MentorStudentsPage } from '@/components/pages/mentor/students';

export default function StudentsPage() {
  return (
    <Layout noCard title="Student Management" role="mentor">
      <MentorStudentsPage />
    </Layout>
  );
}

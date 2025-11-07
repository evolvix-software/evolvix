import { Layout } from '@/components/common/layout/Layout';
import { MentorClassesPage } from '@/components/pages/mentor/classes';

export default function ClassesPage() {
  return (
    <Layout title="Classes" role="mentor">
      <MentorClassesPage />
    </Layout>
  );
}

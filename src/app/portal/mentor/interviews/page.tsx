import { Layout } from '@/components/common/layout/Layout';
import { MentorInterviewsPage } from '@/components/pages/mentor/interviews';

export default function InterviewsPage() {
  return (
    <Layout title="Interview Evaluation" role="mentor">
      <MentorInterviewsPage />
    </Layout>
  );
}

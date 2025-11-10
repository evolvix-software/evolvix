import { Layout } from '@/components/common/layout/Layout';
import { ApplicationStatus } from '@/components/pages/mentor/vacancies/ApplicationStatus';

export default function ViewApplicationPage() {
  return (
    <Layout title="Application Status" role="mentor">
      <ApplicationStatus />
    </Layout>
  );
}


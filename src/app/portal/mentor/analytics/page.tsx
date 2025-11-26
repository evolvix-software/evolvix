import { Layout } from '@/components/common/layout/Layout';
import { MentorAnalyticsPage } from '@/components/pages/mentor/analytics';

export default function AnalyticsPage() {
  return (
    <Layout noCard title="Analytics" role="mentor">
      <MentorAnalyticsPage />
    </Layout>
  );
}

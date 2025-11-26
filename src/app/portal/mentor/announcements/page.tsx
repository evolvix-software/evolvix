import { Layout } from '@/components/common/layout/Layout';
import { AnnouncementsPage } from '@/components/pages/mentor/announcements/AnnouncementsPage';

export default function AnnouncementsPageRoute() {
  return (
    <Layout noCard title="Announcements" role="mentor">
      <AnnouncementsPage />
    </Layout>
  );
}


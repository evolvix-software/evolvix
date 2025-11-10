import { Layout } from '@/components/common/layout/Layout';
import { AdminApplicationsPage } from '@/components/pages/admin/bundle-courses/AdminApplicationsPage';

export default function AdminApplicationsPageRoute() {
  return (
    <Layout title="Mentor Applications" role="admin">
      <AdminApplicationsPage />
    </Layout>
  );
}


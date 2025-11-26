import { Layout } from '@/components/common/layout/Layout';
import { AdminVacanciesPage } from '@/components/pages/admin/bundle-courses/AdminVacanciesPage';

export default function AdminVacanciesPageRoute() {
  return (
    <Layout noCard title="Course Vacancies" role="admin">
      <AdminVacanciesPage />
    </Layout>
  );
}


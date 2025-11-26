import { Layout } from '@/components/common/layout/Layout';
import { AdminCourseVerificationPage } from '@/components/pages/admin/bundle-courses/AdminCourseVerificationPage';

export default function AdminCourseVerificationPageRoute() {
  return (
    <Layout noCard title="Course Verification" role="admin">
      <AdminCourseVerificationPage />
    </Layout>
  );
}


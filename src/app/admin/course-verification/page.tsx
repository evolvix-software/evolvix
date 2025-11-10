import { Layout } from '@/components/common/layout/Layout';
import { AdminCourseVerificationPage } from '@/components/pages/admin/bundle-courses/AdminCourseVerificationPage';

export default function AdminCourseVerificationPageRoute() {
  return (
    <Layout title="Course Verification" role="admin">
      <AdminCourseVerificationPage />
    </Layout>
  );
}


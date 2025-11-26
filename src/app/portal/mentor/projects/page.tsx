import { Layout } from '@/components/common/layout/Layout';
import { MentorProjectsPage } from '@/components/pages/mentor/projects';

export default function ProjectsPage() {
  return (
    <Layout noCard title="Project Mentorship" role="mentor">
      <MentorProjectsPage />
    </Layout>
  );
}

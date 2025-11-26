import { Layout } from '@/components/common/layout/Layout';
import { VacanciesPage } from '@/components/pages/mentor/vacancies';

export default function MentorVacanciesPage() {
  return (
    <Layout noCard title="Course Vacancies" role="mentor">
      <VacanciesPage />
    </Layout>
  );
}


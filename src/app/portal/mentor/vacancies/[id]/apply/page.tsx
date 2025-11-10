import { Layout } from '@/components/common/layout/Layout';
import { ApplicationForm } from '@/components/pages/mentor/vacancies/ApplicationForm';

export default function ApplyVacancyPage() {
  return (
    <Layout title="Apply for Vacancy" role="mentor">
      <ApplicationForm />
    </Layout>
  );
}


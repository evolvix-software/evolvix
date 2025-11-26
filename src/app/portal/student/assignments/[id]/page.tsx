import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { AssignmentDetailPage } from '@/components/pages/student/assignments/components';

interface AssignmentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function AssignmentDetailPageContent({ params }: AssignmentDetailPageProps) {
  const { id } = await params;
  return (
    <Layout noCard title="Assignment Details" role="student">
      <AssignmentDetailPage assignmentId={id} />
    </Layout>
  );
}

export default function StudentAssignmentDetailPageRoute({ params }: AssignmentDetailPageProps) {
  return (
    <Suspense fallback={
      <Layout noCard title="Assignment Details" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] dark:border-[#735fff] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading assignment...</h2>
          </div>
        </div>
      </Layout>
    }>
      <AssignmentDetailPageContent params={params} />
    </Suspense>
  );
}


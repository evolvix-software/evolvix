import { ApplicationDetailPage } from '@/components/pages/provider/applications/ApplicationDetailPage';

export default function Page({ params }: { params: { applicationId: string } }) {
    return <ApplicationDetailPage applicationId={params.applicationId} />;
}

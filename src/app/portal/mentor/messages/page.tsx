import { Layout } from '@/components/common/layout/Layout';
import { UnifiedInbox } from '@/components/pages/mentor/messages/UnifiedInbox';

export default function MessagesPage() {
  return (
    <Layout title="Messages" role="mentor">
      <UnifiedInbox />
    </Layout>
  );
}


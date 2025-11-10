"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { CalendarPageContent } from '@/components/pages/mentor/calendar/CalendarPage';

export default function MentorCalendarPage() {
  return (
    <Layout title="Calendar" role="mentor" noPaddingX={true} noCard={true}>
      <Suspense fallback={<div>Loading calendar...</div>}>
        <CalendarPageContent />
      </Suspense>
    </Layout>
  );
}


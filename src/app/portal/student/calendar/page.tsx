"use client";

import { Suspense } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { CalendarPageContent } from '@/components/pages/student/calendar/CalendarPage';

export default function StudentCalendarPage() {
  return (
    <Layout title="Calendar" role="student" noPaddingX={true} noCard={true}>
      <Suspense fallback={<div>Loading calendar...</div>}>
        <CalendarPageContent />
      </Suspense>
    </Layout>
  );
}


"use client";

import { useParams } from 'next/navigation';
import { ScholarProfilePage } from '@/components/pages/provider/scholars/ScholarProfilePage';

export default function Page() {
  const params = useParams();
  const scholarId = params.scholarId as string;

  return <ScholarProfilePage scholarId={scholarId} />;
}


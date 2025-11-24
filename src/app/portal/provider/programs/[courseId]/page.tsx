"use client";

import { useParams } from 'next/navigation';
import { CourseDetailsPage } from '@/components/pages/provider/programs/CourseDetailsPage';

export default function Page() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  return <CourseDetailsPage courseId={courseId} />;
}


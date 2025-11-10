"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest } from './TestsPage';
import { TestAnalytics } from './components/TestAnalytics';
import { ArrowLeft } from 'lucide-react';

export function TestAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { courses } = useAppSelector(state => state.courses);
  const [test, setTest] = useState<ModuleTest | null>(null);
  const [mentorId, setMentorId] = useState<string>('');

  const testId = params.testId as string;

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || '');
    }
  }, []);

  useEffect(() => {
    const storedTests = localStorage.getItem('evolvix_module_tests');
    if (storedTests) {
      try {
        const parsedTests: ModuleTest[] = JSON.parse(storedTests);
        const foundTest = parsedTests.find(t => t.id === testId);
        if (foundTest) {
          setTest(foundTest);
        }
      } catch (e) {
        console.error('Error parsing stored tests:', e);
      }
    }
  }, [testId]);

  const mentorCourses = useMemo(() => {
    if (!mentorId) return [];
    return courses.filter(c => c.instructor.id === mentorId);
  }, [courses, mentorId]);

  if (!test) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Test not found
          </h2>
          <Button onClick={() => router.push('/portal/mentor/tests')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Test Analytics
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {test.title} - {test.courseTitle}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/portal/mentor/tests/${testId}`)}
          className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Test Details
        </Button>
      </div>

      {/* Analytics Content */}
      <TestAnalytics test={test} />
    </div>
  );
}


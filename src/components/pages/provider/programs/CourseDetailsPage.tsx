"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Award,
  Users,
  TrendingUp,
  BarChart3,
  FileText,
  Clock,
  Link as LinkIcon,
} from 'lucide-react';
import { providerService, courseService, Course, campaignService } from '@/data/mock/providerData';
import { OverviewTab } from './components/tabs/OverviewTab';
import { SyllabusTab } from './components/tabs/SyllabusTab';
import { ScheduleTab } from './components/tabs/ScheduleTab';
import { ScholarshipSlotsTab } from './components/tabs/ScholarshipSlotsTab';
import { StudentsTab } from './components/tabs/StudentsTab';
import { ProgressTab } from './components/tabs/ProgressTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';

type Tab = 'overview' | 'syllabus' | 'schedule' | 'scholarship-slots' | 'students' | 'progress' | 'analytics';

interface CourseDetailsPageProps {
  courseId: string;
}

export function CourseDetailsPage({ courseId }: CourseDetailsPageProps) {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        const newProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(newProvider);
      } else {
        router.push('/auth/signin');
        return;
      }
    }

    const foundCourse = courseService.getById(courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      router.push('/portal/provider/programs');
      return;
    }
    setLoading(false);
  }, [courseId, provider, router]);

  if (loading || !course) {
    return (
      <Layout title="Course Details" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const instructorName = typeof course.instructor === 'string' ? course.instructor : (course.instructor as any)?.name || 'Unknown';
  const linkedCampaigns = campaignService.getAll(provider?.id).filter(c => c.linkedCourseIds?.includes(courseId));

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'syllabus', label: 'Syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'scholarship-slots', label: 'Scholarship Slots', icon: <Award className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <Layout title="Course Details" role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Button variant="ghost" size="sm" onClick={() => router.push('/portal/provider/programs')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div className="flex items-start gap-4">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-24 rounded-lg object-cover border border-border"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{instructorName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">
                      {course.scholarshipSlotsAvailable} / {course.scholarshipSlots} slots available
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolledCount || 0} enrolled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'scholarship-slots' && linkedCampaigns.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    {linkedCampaigns.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab course={course} />}
          {activeTab === 'syllabus' && <SyllabusTab course={course} />}
          {activeTab === 'schedule' && <ScheduleTab course={course} />}
          {activeTab === 'scholarship-slots' && (
            <ScholarshipSlotsTab course={course} courseId={courseId} providerId={provider?.id || ''} />
          )}
          {activeTab === 'students' && <StudentsTab course={course} courseId={courseId} />}
          {activeTab === 'progress' && <ProgressTab course={course} courseId={courseId} />}
          {activeTab === 'analytics' && <AnalyticsTab course={course} courseId={courseId} />}
        </div>
      </div>
    </Layout>
  );
}


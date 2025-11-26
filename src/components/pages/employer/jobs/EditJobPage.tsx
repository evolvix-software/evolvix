"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { updateJob } from '@/store/features/employer/employerSlice';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ArrowLeft } from 'lucide-react';
import { PostJobSteps, JobFormData } from './components/PostJobSteps';

export function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { jobs } = useAppSelector((state) => state.employer);
  const jobId = params?.jobId as string;

  const job = jobs.find(j => j.id === jobId);
  const [formData, setFormData] = useState<JobFormData | null>(null);

  useEffect(() => {
    if (!job && jobs.length > 0) {
      router.push('/portal/employer/jobs/manage');
    } else if (job) {
      // Convert job to JobFormData format
      setFormData({
        title: job.title,
        employmentType: job.employmentType,
        location: job.location,
        remoteType: job.remoteType || 'remote',
        seniorityLevel: job.seniorityLevel || '',
        description: job.description || '',
        responsibilities: job.responsibilities || [],
        requirements: job.requirements || [],
        skills: job.skills || [],
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        currency: job.currency || 'USD',
        salaryPeriod: job.salaryPeriod || 'yearly',
        benefits: job.benefits || [],
        applicationMethod: job.applicationMethod || 'easy-apply',
        externalLink: job.externalLink || '',
        applicationEmail: job.applicationEmail || '',
        requireCoverLetter: job.requireCoverLetter || false,
        requirePortfolio: job.requirePortfolio || false,
        customQuestions: job.customQuestions || [],
        status: job.status,
        publishDate: job.publishDate || '',
        expirationDate: job.expiresAt || '',
        autoExpire: job.autoExpire || false,
        promoteJob: job.promoteJob || false,
      });
    }
  }, [job, jobs.length, router]);

  const handleSubmit = () => {
    if (!job || !formData) return;

    const updatedJob = {
      ...job,
      title: formData.title,
      employmentType: formData.employmentType,
      location: formData.location,
      remoteType: formData.remoteType,
      seniorityLevel: formData.seniorityLevel,
      description: formData.description,
      responsibilities: formData.responsibilities,
      requirements: formData.requirements,
      skills: formData.skills,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      currency: formData.currency,
      salaryPeriod: formData.salaryPeriod,
      benefits: formData.benefits,
      applicationMethod: formData.applicationMethod,
      externalLink: formData.externalLink,
      applicationEmail: formData.applicationEmail,
      requireCoverLetter: formData.requireCoverLetter,
      requirePortfolio: formData.requirePortfolio,
      customQuestions: formData.customQuestions,
      publishDate: formData.publishDate,
      expiresAt: formData.expirationDate || undefined,
      autoExpire: formData.autoExpire,
      promoteJob: formData.promoteJob,
      status: formData.status,
    };

    dispatch(updateJob(updatedJob));
    router.push(`/portal/employer/jobs/${job.id}`);
  };

  if (!job) {
    return (
      <Layout noCard title="Job Not Found" role="employer">
        <Card className="border border-border">
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Job not found</h3>
            <Button onClick={() => router.push('/portal/employer/jobs/manage')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Manage Jobs
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (!formData) {
    return (
      <Layout noCard title="Loading..." role="employer">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout noCard title={`Edit: ${job.title}`} role="employer">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Job</h1>
            <p className="text-muted-foreground mt-1">Update job posting details</p>
          </div>
        </div>

        <PostJobSteps
          formData={formData}
          onFormDataChange={setFormData}
          onSaveDraft={() => {}}
          onSubmit={handleSubmit}
        />
      </div>
    </Layout>
  );
}


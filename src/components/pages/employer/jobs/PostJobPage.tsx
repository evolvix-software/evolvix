"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addJob, saveJobDraft, clearJobDrafts } from '@/store/features/employer/employerSlice';
import { Layout } from '@/components/common/layout/Layout';
import { Button } from '@/components/common/forms/Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PostJobSteps, JobFormData } from './components/PostJobSteps';
import { TemplateSelector } from './components/TemplateSelector';
import { AIGenerator } from './components/AIGenerator';
import { JobTemplate } from './components/JobTemplates';

const initialFormData: JobFormData = {
  title: '',
  employmentType: '',
  location: '',
  remoteType: 'remote',
  seniorityLevel: '',
  description: '',
  responsibilities: [],
  requirements: [],
  skills: [],
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  salaryPeriod: 'yearly',
  benefits: [],
  applicationMethod: 'easy-apply',
  externalLink: '',
  applicationEmail: '',
  requireCoverLetter: false,
  requirePortfolio: false,
  customQuestions: [],
  status: 'draft',
  publishDate: '',
  expirationDate: '',
  autoExpire: false,
  promoteJob: false,
};

export function PostJobPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const jobDrafts = useAppSelector((state) => state.employer.jobDrafts);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>();
  const [currentStep, setCurrentStep] = useState(1);
  const hasUnsavedChanges = useRef(false);

  // Auto-save draft every 30 seconds using Redux
  useEffect(() => {
    if (!showTemplateSelector && formData.title) {
      const interval = setInterval(() => {
        handleSaveDraft();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [formData, showTemplateSelector, currentStep]);

  // Load draft from Redux on mount
  useEffect(() => {
    if (jobDrafts.length > 0) {
      const latestDraft = jobDrafts[0];
      // Show resume editing option
      const resumeEditing = window.confirm(
        `You have a saved draft from ${new Date(latestDraft.lastSaved).toLocaleString()}. Would you like to resume editing?`
      );
      if (resumeEditing) {
        setFormData({ ...initialFormData, ...latestDraft.formData } as JobFormData);
        setCurrentDraftId(latestDraft.id);
        setCurrentStep(latestDraft.step);
        setShowTemplateSelector(false);
      } else {
        // Clear draft if user doesn't want to resume
        dispatch(clearJobDrafts());
        localStorage.removeItem('employer_job_draft');
      }
    } else {
      // Fallback to localStorage for backward compatibility
      const savedDraft = localStorage.getItem('employer_job_draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          const resumeEditing = window.confirm(
            'You have a saved draft. Would you like to resume editing?'
          );
          if (resumeEditing) {
            setFormData(draft);
            setShowTemplateSelector(false);
          } else {
            localStorage.removeItem('employer_job_draft');
          }
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
  }, [dispatch]);

  const handleTemplateSelect = (template: JobTemplate) => {
    setFormData({ ...initialFormData, ...template.data });
    setShowTemplateSelector(false);
  };

  const handleStartFromScratch = () => {
    setFormData(initialFormData);
    setShowTemplateSelector(false);
  };

  const handleSaveDraft = () => {
    setSavingDraft(true);
    setDraftSaved(false);
    // Save to Redux
    dispatch(saveJobDraft({
      draftId: currentDraftId,
      formData: formData,
      step: currentStep,
    }));
    // Also save to localStorage for backward compatibility
    localStorage.setItem('employer_job_draft', JSON.stringify(formData));
    setTimeout(() => {
      setSavingDraft(false);
      setDraftSaved(true);
      hasUnsavedChanges.current = false;
      // Hide "Saved" message after 3 seconds
      setTimeout(() => setDraftSaved(false), 3000);
    }, 1000);
  };

  // Warn before navigation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleSubmit = () => {
    // Create job object with all details
    const job = {
      id: Date.now().toString(),
      title: formData.title,
      status: formData.status as any,
      applications: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      expiresAt: formData.expirationDate || undefined,
      location: formData.location,
      employmentType: formData.employmentType,
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
      autoExpire: formData.autoExpire,
      promoteJob: formData.promoteJob,
    };

    // Dispatch to Redux
    dispatch(addJob(job));

    // Clear draft from Redux and localStorage
    if (currentDraftId) {
      // Draft will be cleared automatically when job is published
    }
    localStorage.removeItem('employer_job_draft');

    // Redirect to manage jobs
    router.push('/portal/employer/jobs/manage');
  };

  const handleAIGenerate = (
    description: string,
    responsibilities: string[],
    requirements: string[],
    skills: string[]
  ) => {
    setFormData({
      ...formData,
      description,
      responsibilities,
      requirements,
      skills,
    });
    setShowAIGenerator(false);
  };

  if (showTemplateSelector) {
    return (
      <Layout noCard title="Post a Job" role="employer">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
              <p className="text-muted-foreground mt-1">
                Create a job posting to attract top talent
              </p>
            </div>
          </div>
          <TemplateSelector
            onSelectTemplate={handleTemplateSelect}
            onStartFromScratch={handleStartFromScratch}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout noCard title="Post a Job" role="employer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
              <p className="text-muted-foreground mt-1">
                Create a job posting to attract top talent
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savingDraft && (
              <span className="text-sm text-muted-foreground">Saving draft...</span>
            )}
            {draftSaved && !savingDraft && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Draft saved
              </span>
            )}
          </div>
        </div>

        {showAIGenerator ? (
          <AIGenerator
            jobTitle={formData.title}
            onGenerate={handleAIGenerate}
            onClose={() => setShowAIGenerator(false)}
          />
        ) : (
          <PostJobSteps
            formData={formData}
            onFormDataChange={(data) => {
              setFormData(data);
              hasUnsavedChanges.current = true;
              // Auto-save on change
              if (data.title) {
                handleSaveDraft();
              }
            }}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            onShowAIGenerator={() => setShowAIGenerator(true)}
            onStepChange={setCurrentStep}
          />
        )}
      </div>
    </Layout>
  );
}


"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { Badge } from '@/components/common/ui/Badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  Sparkles, 
  FileText,
  X,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/utils';
import { RichTextEditor } from './RichTextEditor';
import { SkillInput } from './SkillInput';
import { LocationAutocomplete } from './LocationAutocomplete';
import { JobPreview } from './JobPreview';

export interface JobFormData {
  // Step 1: Basic Information
  title: string;
  employmentType: string;
  location: string;
  remoteType: 'remote' | 'hybrid' | 'onsite';
  seniorityLevel: string;
  
  // Step 2: Job Description
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  
  // Step 3: Compensation & Benefits
  salaryMin: string;
  salaryMax: string;
  currency: string;
  salaryPeriod: string;
  benefits: string[];
  
  // Step 4: Application Settings
  applicationMethod: 'easy-apply' | 'external-link' | 'email';
  externalLink: string;
  applicationEmail: string;
  requireCoverLetter: boolean;
  requirePortfolio: boolean;
  customQuestions: Array<{
    id: string;
    type: 'text' | 'textarea' | 'multiple-choice' | 'file';
    question: string;
    required: boolean;
    options?: string[];
  }>;
  
  // Step 5: Publishing Options
  status: 'draft' | 'active';
  publishDate: string;
  expirationDate: string;
  autoExpire: boolean;
  promoteJob: boolean;
}

interface PostJobStepsProps {
  formData: JobFormData;
  onFormDataChange: (data: JobFormData) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onShowAIGenerator?: () => void;
  onStepChange?: (step: number) => void;
}

const steps = [
  { id: 1, title: 'Basic Information', icon: FileText },
  { id: 2, title: 'Job Description', icon: FileText },
  { id: 3, title: 'Compensation & Benefits', icon: FileText },
  { id: 4, title: 'Application Settings', icon: FileText },
  { id: 5, title: 'Publishing Options', icon: FileText },
];

export function PostJobSteps({ formData, onFormDataChange, onSubmit, onSaveDraft, onShowAIGenerator, onStepChange }: PostJobStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorSummary, setShowErrorSummary] = useState(false);

  const updateFormData = (updates: Partial<JobFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title || formData.title.length < 5) {
        newErrors.title = 'Job title must be at least 5 characters';
      }
      if (formData.title.length > 100) {
        newErrors.title = 'Job title must be less than 100 characters';
      }
      // Check for special characters at start/end
      if (formData.title && /^[^a-zA-Z0-9]|[^a-zA-Z0-9]$/.test(formData.title.trim())) {
        newErrors.title = 'Job title cannot start or end with special characters';
      }
      if (!formData.employmentType) {
        newErrors.employmentType = 'Employment type is required';
      }
      if (!formData.location) {
        newErrors.location = 'Location is required';
      }
      if (!formData.remoteType) {
        newErrors.remoteType = 'Remote type is required';
      }
    }

    if (step === 2) {
      const textContent = formData.description.replace(/<[^>]*>/g, '');
      if (!formData.description || textContent.length < 200) {
        newErrors.description = 'Description must be at least 200 characters';
      }
      if (textContent.length > 10000) {
        newErrors.description = 'Description must be less than 10,000 characters';
      }
      if (formData.skills.length < 3) {
        newErrors.skills = 'At least 3 skills are required';
      }
      if (formData.skills.length > 20) {
        newErrors.skills = 'Maximum 20 skills allowed';
      }
    }

    if (step === 3) {
      if (formData.salaryMin && formData.salaryMax) {
        const min = parseInt(formData.salaryMin);
        const max = parseInt(formData.salaryMax);
        if (min >= max) {
          newErrors.salary = 'Minimum salary must be less than maximum salary';
        }
      }
    }

    if (step === 4) {
      if (!formData.applicationMethod) {
        newErrors.applicationMethod = 'Application method is required';
      }
      if (formData.applicationMethod === 'external-link') {
        if (!formData.externalLink) {
          newErrors.externalLink = 'External link is required';
        } else {
          // Validate URL format
          try {
            new URL(formData.externalLink);
          } catch {
            newErrors.externalLink = 'Please enter a valid URL';
          }
        }
      }
      if (formData.applicationMethod === 'email') {
        if (!formData.applicationEmail) {
          newErrors.applicationEmail = 'Application email is required';
        } else {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.applicationEmail)) {
            newErrors.applicationEmail = 'Please enter a valid email address';
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = () => {
    // Validate all steps before submitting
    let allValid = true;
    for (let i = 1; i <= steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        setCurrentStep(i);
        setShowErrorSummary(true);
        onStepChange?.(i);
        break;
      }
    }

    if (allValid) {
      // Check job credits before publishing (mock check)
      if (formData.status === 'active') {
        // In a real app, this would check against user's job credits
        const hasCredits = true; // Mock: assume user has credits
        if (!hasCredits) {
          setErrors({ ...errors, credits: 'You do not have enough job credits to publish this job.' });
          setShowErrorSummary(true);
          return;
        }
      }
      onSubmit();
    } else {
      setShowErrorSummary(true);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setErrors({});
        setShowErrorSummary(false);
        onStepChange?.(nextStep);
      }
    } else {
      setShowErrorSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setErrors({});
      onStepChange?.(prevStep);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && formData.skills.length < 20) {
      updateFormData({
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    updateFormData({
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      updateFormData({
        responsibilities: [...formData.responsibilities, newResponsibility.trim()],
      });
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index: number) => {
    updateFormData({
      responsibilities: formData.responsibilities.filter((_, i) => i !== index),
    });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      updateFormData({
        requirements: [...formData.requirements, newRequirement.trim()],
      });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    updateFormData({
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const toggleBenefit = (benefit: string) => {
    const benefits = formData.benefits.includes(benefit)
      ? formData.benefits.filter(b => b !== benefit)
      : [...formData.benefits, benefit];
    updateFormData({ benefits });
  };

  const addCustomQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'text' as const,
      question: '',
      required: false,
    };
    updateFormData({
      customQuestions: [...formData.customQuestions, newQuestion],
    });
  };

  const updateCustomQuestion = (id: string, updates: Partial<JobFormData['customQuestions'][0]>) => {
    updateFormData({
      customQuestions: formData.customQuestions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      ),
    });
  };

  const removeCustomQuestion = (id: string) => {
    updateFormData({
      customQuestions: formData.customQuestions.filter(q => q.id !== id),
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Job Title *
              </label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={formData.title}
                onChange={(e) => {
                  updateFormData({ title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: '' });
                  }
                }}
                onBlur={() => {
                  validateStep(1);
                  onSaveDraft();
                }}
                required
                minLength={5}
                maxLength={100}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-xs text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Employment Type *
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => {
                    updateFormData({ employmentType: e.target.value });
                    if (errors.employmentType) {
                      setErrors({ ...errors, employmentType: '' });
                    }
                  }}
                  onBlur={() => {
                    validateStep(1);
                    onSaveDraft();
                  }}
                  className={cn(
                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground",
                    errors.employmentType && "border-destructive"
                  )}
                  required
                >
                  <option value="">Select type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Seniority Level
                </label>
                <select
                  value={formData.seniorityLevel}
                  onChange={(e) => updateFormData({ seniorityLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Select level</option>
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Location *
              </label>
              <LocationAutocomplete
                value={formData.location}
                onChange={(value) => updateFormData({ location: value })}
                placeholder="e.g., San Francisco, CA or Remote"
                required
              />
              {errors.location && (
                <p className="text-xs text-destructive mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Remote Type *
              </label>
              {errors.remoteType && (
                <p className="text-xs text-destructive mb-1">{errors.remoteType}</p>
              )}
              <div className="flex gap-4">
                {(['remote', 'hybrid', 'onsite'] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="remoteType"
                      value={type}
                      checked={formData.remoteType === type}
                      onChange={(e) => updateFormData({ remoteType: e.target.value as any })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Job Description</h3>
              {onShowAIGenerator && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onShowAIGenerator}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generator
                </Button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Job Description * (min 200 characters)
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => updateFormData({ description: value })}
                placeholder="Describe the role, responsibilities, and requirements..."
                minLength={200}
                maxLength={10000}
              />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Responsibilities
              </label>
              <div className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                      {resp}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResponsibility(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add responsibility..."
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                  />
                  <Button type="button" onClick={addResponsibility}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Requirements
              </label>
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                      {req}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add requirement..."
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button type="button" onClick={addRequirement}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Required Skills * (min 3, max 20)
              </label>
              <SkillInput
                skills={formData.skills}
                onChange={(skills) => updateFormData({ skills })}
                maxSkills={20}
                minSkills={3}
              />
              {errors.skills && (
                <p className="text-xs text-destructive mt-1">{errors.skills}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Min Salary
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 80000"
                  value={formData.salaryMin}
                  onChange={(e) => {
                    updateFormData({ salaryMin: e.target.value });
                    if (errors.salary) {
                      setErrors({ ...errors, salary: '' });
                    }
                  }}
                  onBlur={() => {
                    validateStep(3);
                    onSaveDraft();
                  }}
                  className={errors.salary ? 'border-destructive' : ''}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Max Salary
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 120000"
                  value={formData.salaryMax}
                  onChange={(e) => {
                    updateFormData({ salaryMax: e.target.value });
                    if (errors.salary) {
                      setErrors({ ...errors, salary: '' });
                    }
                  }}
                  onBlur={() => {
                    validateStep(3);
                    onSaveDraft();
                  }}
                  className={errors.salary ? 'border-destructive' : ''}
                />
              </div>
            </div>
            {errors.salary && (
              <p className="text-xs text-destructive">{errors.salary}</p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => updateFormData({ currency: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Period
                </label>
                <select
                  value={formData.salaryPeriod}
                  onChange={(e) => updateFormData({ salaryPeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="hourly">Hourly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Benefits
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Health Insurance',
                  'Dental Insurance',
                  'Vision Insurance',
                  'Retirement Plan',
                  'Paid Time Off',
                  'Flexible Hours',
                  'Remote Work',
                  'Professional Development',
                  'Stock Options',
                ].map((benefit) => (
                  <label key={benefit} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.benefits.includes(benefit)}
                      onCheckedChange={() => toggleBenefit(benefit)}
                    />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Application Method *
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="easy-apply"
                    checked={formData.applicationMethod === 'easy-apply'}
                    onChange={(e) => updateFormData({ applicationMethod: e.target.value as any })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Easy Apply (default)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="external-link"
                    checked={formData.applicationMethod === 'external-link'}
                    onChange={(e) => updateFormData({ applicationMethod: e.target.value as any })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">External Link</span>
                </label>
                {formData.applicationMethod === 'external-link' && (
                  <div className="ml-6">
                    <Input
                      placeholder="https://..."
                      value={formData.externalLink}
                      onChange={(e) => {
                        updateFormData({ externalLink: e.target.value });
                        if (errors.externalLink) {
                          setErrors({ ...errors, externalLink: '' });
                        }
                      }}
                      onBlur={() => {
                        validateStep(4);
                        onSaveDraft();
                      }}
                      className={errors.externalLink ? 'border-destructive' : ''}
                    />
                    {errors.externalLink && (
                      <p className="text-xs text-destructive mt-1">{errors.externalLink}</p>
                    )}
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="email"
                    checked={formData.applicationMethod === 'email'}
                    onChange={(e) => updateFormData({ applicationMethod: e.target.value as any })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Email</span>
                </label>
                {formData.applicationMethod === 'email' && (
                  <div className="ml-6">
                    <Input
                      type="email"
                      placeholder="applications@company.com"
                      value={formData.applicationEmail}
                      onChange={(e) => {
                        updateFormData({ applicationEmail: e.target.value });
                        if (errors.applicationEmail) {
                          setErrors({ ...errors, applicationEmail: '' });
                        }
                      }}
                      onBlur={() => {
                        validateStep(4);
                        onSaveDraft();
                      }}
                      className={errors.applicationEmail ? 'border-destructive' : ''}
                    />
                    {errors.applicationEmail && (
                      <p className="text-xs text-destructive mt-1">{errors.applicationEmail}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.requireCoverLetter}
                  onCheckedChange={(checked) => updateFormData({ requireCoverLetter: !!checked })}
                />
                <span className="text-sm text-foreground">Require Cover Letter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.requirePortfolio}
                  onCheckedChange={(checked) => updateFormData({ requirePortfolio: !!checked })}
                />
                <span className="text-sm text-foreground">Require Portfolio</span>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">
                  Custom Questions
                </label>
                <Button type="button" variant="outline" size="sm" onClick={addCustomQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
              <div className="space-y-4">
                {formData.customQuestions.map((question) => (
                  <Card key={question.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <select
                          value={question.type}
                          onChange={(e) => updateCustomQuestion(question.id, { type: e.target.value as any })}
                          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        >
                          <option value="text">Text</option>
                          <option value="textarea">Textarea</option>
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="file">File</option>
                        </select>
                        <Input
                          placeholder="Question text..."
                          value={question.question}
                          onChange={(e) => updateCustomQuestion(question.id, { question: e.target.value })}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomQuestion(question.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={question.required}
                          onCheckedChange={(checked) => updateCustomQuestion(question.id, { required: !!checked })}
                        />
                        <span className="text-xs text-muted-foreground">Required</span>
                      </label>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => updateFormData({ status: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Publish Date (optional)
                </label>
                <Input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => updateFormData({ publishDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Expiration Date (optional)
                </label>
                <Input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => updateFormData({ expirationDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.autoExpire}
                  onCheckedChange={(checked) => updateFormData({ autoExpire: !!checked })}
                />
                <span className="text-sm text-foreground">Auto-expire after expiration date</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.promoteJob}
                  onCheckedChange={(checked) => updateFormData({ promoteJob: !!checked })}
                />
                <span className="text-sm text-foreground">Promote Job (Premium Feature)</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className={cn(
                "text-xs mt-2 text-center",
                currentStep >= step.id ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "h-0.5 flex-1 mx-2",
                currentStep > step.id ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Error Summary */}
      {showErrorSummary && Object.keys(errors).length > 0 && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-destructive mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowErrorSummary(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
            {Object.keys(errors).length > 0 && (
              <Badge variant="error" className="text-xs">
                {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>
        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleFinalSubmit} className="bg-gradient-to-r from-primary to-purple-600">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Job Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <JobPreview
              formData={formData}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}


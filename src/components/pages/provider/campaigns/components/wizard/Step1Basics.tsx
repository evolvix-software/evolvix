"use client";

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/common/forms/Input';
import { CampaignWizardFormData } from '../CampaignCreationWizard';
import { courseService } from '@/data/mock/providerData';
import { useEffect, useState } from 'react';

export function Step1Basics() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CampaignWizardFormData>();

  const campaignType = watch('campaignType');
  const title = watch('title');
  const [courses] = useState(courseService.getAll());
  const linkedCourseIds = watch('linkedCourseIds') || [];

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('campaignSlug', slug);
    }
  }, [title, setValue]);

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Provider * (Admin Only)
          </label>
          <select
            {...register('providerId', { required: isAdmin ? 'Provider is required' : false })}
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.organizationName}
              </option>
            ))}
          </select>
          {errors.providerId && (
            <p className="text-sm text-destructive mt-1">{errors.providerId.message}</p>
          )}
        </div>
      )}

      <div>
        <Input
          label="Campaign Title *"
          placeholder="e.g., Tech Scholarship 2024"
          error={errors.title?.message}
          {...register('title')}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {title?.length || 0} / 200 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Campaign Description *
        </label>
        <textarea
          {...register('description')}
          rows={6}
          className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe your scholarship campaign in detail..."
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Minimum 100 characters. Use rich formatting to make your campaign stand out.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Campaign Type *
        </label>
        <select
          {...register('campaignType')}
          className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="general">General Scholarship</option>
          <option value="course-specific">Course-Specific</option>
          <option value="pooled">Pooled Scholarship</option>
        </select>
        {errors.campaignType && (
          <p className="text-sm text-destructive mt-1">{errors.campaignType.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {campaignType === 'course-specific' && 'Select specific courses for this scholarship'}
          {campaignType === 'pooled' && 'Multiple courses share scholarship slots'}
          {campaignType === 'general' && 'General scholarship not tied to specific courses'}
        </p>
      </div>

      {campaignType === 'course-specific' && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Linked Courses *
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto border border-input rounded-lg p-3">
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses available</p>
            ) : (
              courses.map((course) => (
                <label
                  key={course.id}
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={linkedCourseIds.includes(course.id)}
                    onChange={(e) => {
                      const current = linkedCourseIds || [];
                      if (e.target.checked) {
                        setValue('linkedCourseIds', [...current, course.id]);
                      } else {
                        setValue(
                          'linkedCourseIds',
                          current.filter((id) => id !== course.id)
                        );
                      }
                    }}
                    className="w-4 h-4 rounded border-input"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.scholarshipSlotsAvailable} slots available
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
          {errors.linkedCourseIds && (
            <p className="text-sm text-destructive mt-1">
              {errors.linkedCourseIds.message}
            </p>
          )}
        </div>
      )}

      <div>
        <Input
          label="Campaign Slug"
          placeholder="auto-generated-from-title"
          {...register('campaignSlug')}
        />
        <p className="text-xs text-muted-foreground mt-1">
          URL-friendly identifier. Auto-generated from title but can be edited.
        </p>
      </div>
    </div>
  );
}


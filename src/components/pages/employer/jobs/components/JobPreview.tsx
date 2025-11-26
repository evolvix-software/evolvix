"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Smartphone, Monitor, Printer, X } from 'lucide-react';
import { JobFormData } from './PostJobSteps';
import { format } from 'date-fns';
import { cn } from '@/utils';

interface JobPreviewProps {
  formData: JobFormData;
  companyName?: string;
  companyLogo?: string;
  onClose?: () => void;
}

export function JobPreview({ formData, companyName = "Your Company", companyLogo, onClose }: JobPreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const formatSalary = () => {
    if (!formData.salaryMin || !formData.salaryMax) return null;
    const min = parseInt(formData.salaryMin).toLocaleString();
    const max = parseInt(formData.salaryMax).toLocaleString();
    return `${formData.currency} ${min} - ${max} ${formData.salaryPeriod === 'yearly' ? 'per year' : formData.salaryPeriod === 'monthly' ? 'per month' : 'per hour'}`;
  };

  const renderPreview = () => (
    <div className={cn(
      "bg-white rounded-lg shadow-lg overflow-hidden",
      previewMode === 'mobile' ? "max-w-sm mx-auto" : "w-full"
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{formData.title || 'Job Title'}</h1>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>{companyName}</span>
              <span>•</span>
              <span>{formData.location || 'Location'}</span>
              <span>•</span>
              <span className="capitalize">{formData.employmentType || 'Full-time'}</span>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={cn("p-6 space-y-6", previewMode === 'mobile' && "p-4 space-y-4")}>
        {/* Job Details */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {formData.remoteType}
          </Badge>
          {formData.seniorityLevel && (
            <Badge variant="outline" className="capitalize">
              {formData.seniorityLevel}
            </Badge>
          )}
          {formatSalary() && (
            <Badge variant="outline">
              {formatSalary()}
            </Badge>
          )}
        </div>

        {/* Description */}
        {formData.description && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Job Description</h2>
            <div 
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: formData.description }}
            />
          </div>
        )}

        {/* Responsibilities */}
        {formData.responsibilities.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              {formData.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {formData.requirements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Requirements</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              {formData.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {formData.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {formData.benefits.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Benefits</h2>
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline">{benefit}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Application Info */}
        <div className="pt-4 border-t border-border">
          <div className="space-y-2 text-sm text-muted-foreground">
            {formData.requireCoverLetter && (
              <p>✓ Cover letter required</p>
            )}
            {formData.requirePortfolio && (
              <p>✓ Portfolio required</p>
            )}
            {formData.customQuestions.length > 0 && (
              <p>✓ {formData.customQuestions.length} custom question(s)</p>
            )}
          </div>
        </div>

        {/* Apply Button */}
        <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
          {formData.applicationMethod === 'easy-apply' 
            ? 'Easy Apply' 
            : formData.applicationMethod === 'external-link'
            ? 'Apply on Company Website'
            : 'Apply via Email'}
        </Button>

        {/* Publishing Info */}
        {formData.publishDate && (
          <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
            <p>Publishes: {format(new Date(formData.publishDate), 'MMM d, yyyy')}</p>
            {formData.expirationDate && (
              <p>Expires: {format(new Date(formData.expirationDate), 'MMM d, yyyy')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Job Preview</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-border rounded-lg">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="rounded-r-none"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="rounded-l-none"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "overflow-auto",
          previewMode === 'mobile' ? "max-h-[600px]" : "max-h-[800px]"
        )}>
          {renderPreview()}
        </div>
      </CardContent>
    </Card>
  );
}


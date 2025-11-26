"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { Plus, X, Trash2 } from 'lucide-react';
import { JobPostingSettings } from '../types';

interface JobPostingSettingsTabProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export function JobPostingSettingsTab({ onUnsavedChanges }: JobPostingSettingsTabProps) {
  const [settings, setSettings] = useState<JobPostingSettings>({
    defaultEmploymentType: 'full-time',
    defaultLocation: 'San Francisco, CA',
    defaultRemoteType: 'remote',
    autoPublish: false,
    requireApproval: true,
    enableEasyApply: true,
    requireCoverLetter: false,
    requirePortfolio: false,
    customQuestions: [],
    autoRejectRules: [],
    autoShortlistRules: [],
  });

  const handleChange = (field: keyof JobPostingSettings, value: any) => {
    setSettings({ ...settings, [field]: value });
    onUnsavedChanges?.(true);
  };

  const addCustomQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'text' as const,
      required: false,
    };
    handleChange('customQuestions', [...settings.customQuestions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<JobPostingSettings['customQuestions'][0]>) => {
    handleChange('customQuestions', settings.customQuestions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const removeQuestion = (id: string) => {
    handleChange('customQuestions', settings.customQuestions.filter(q => q.id !== id));
  };

  const handleSave = () => {
    // TODO: Save to API
    alert('Settings saved successfully!');
    onUnsavedChanges?.(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Job Posting Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure default settings for job postings
        </p>
      </div>

      {/* Default Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Default Settings</CardTitle>
          <CardDescription>Default values for new job postings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Default Employment Type</label>
              <select
                value={settings.defaultEmploymentType}
                onChange={(e) => handleChange('defaultEmploymentType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Default Remote Type</label>
              <select
                value={settings.defaultRemoteType}
                onChange={(e) => handleChange('defaultRemoteType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Default Location</label>
            <Input
              value={settings.defaultLocation}
              onChange={(e) => handleChange('defaultLocation', e.target.value)}
              placeholder="City, State, Country"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={settings.autoPublish}
                onCheckedChange={(checked) => handleChange('autoPublish', checked)}
              />
              <span className="text-sm text-foreground">Auto-publish jobs</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={settings.requireApproval}
                onCheckedChange={(checked) => handleChange('requireApproval', checked)}
              />
              <span className="text-sm text-foreground">Require approval before publishing</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Configure application requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={settings.enableEasyApply}
                onCheckedChange={(checked) => handleChange('enableEasyApply', checked)}
              />
              <span className="text-sm text-foreground">Enable Easy Apply</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={settings.requireCoverLetter}
                onCheckedChange={(checked) => handleChange('requireCoverLetter', checked)}
              />
              <span className="text-sm text-foreground">Require cover letter</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={settings.requirePortfolio}
                onCheckedChange={(checked) => handleChange('requirePortfolio', checked)}
              />
              <span className="text-sm text-foreground">Require portfolio</span>
            </label>
          </div>

          {/* Custom Questions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Custom Questions</label>
              <Button variant="outline" size="sm" onClick={addCustomQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
            <div className="space-y-3">
              {settings.customQuestions.map((question) => (
                <div key={question.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      placeholder="Enter question"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, { type: e.target.value as any })}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="multiple-choice">Multiple Choice</option>
                    </select>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={question.required}
                        onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                      />
                      <span className="text-sm text-foreground">Required</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-purple-600">
          Save Changes
        </Button>
      </div>
    </div>
  );
}


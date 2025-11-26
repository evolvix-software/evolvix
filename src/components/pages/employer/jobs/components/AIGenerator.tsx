"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Sparkles, Loader2, RefreshCw, Save } from 'lucide-react';
import { JobTemplate, saveTemplate } from './JobTemplates';

interface AIGeneratorProps {
  jobTitle: string;
  onGenerate: (description: string, responsibilities: string[], requirements: string[], skills: string[]) => void;
  onClose: () => void;
}

export function AIGenerator({ jobTitle, onGenerate, onClose }: AIGeneratorProps) {
  const [keyRequirements, setKeyRequirements] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    description: string;
    responsibilities: string[];
    requirements: string[];
    skills: string[];
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock generated content
    const mockDescription = `We are seeking a talented ${jobTitle} to join our team. In this role, you will be responsible for driving innovation and delivering high-quality solutions. You'll work closely with cross-functional teams to achieve our business objectives.

${keyRequirements ? `Key requirements include: ${keyRequirements}` : 'The ideal candidate will have strong technical skills and a passion for excellence.'}

This is an exciting opportunity to make a significant impact in a fast-paced, collaborative environment.`;

    const mockResponsibilities = [
      `Lead ${jobTitle.toLowerCase()} initiatives and projects`,
      'Collaborate with team members to deliver solutions',
      'Analyze and improve existing processes',
      'Communicate effectively with stakeholders',
    ];

    const mockRequirements = [
      `Proven experience as a ${jobTitle}`,
      'Strong problem-solving and analytical skills',
      'Excellent communication abilities',
      'Ability to work in a team environment',
    ];

    const mockSkills = ['Problem Solving', 'Communication', 'Teamwork', 'Analytical Thinking'];

    setGeneratedContent({
      description: mockDescription,
      responsibilities: mockResponsibilities,
      requirements: mockRequirements,
      skills: mockSkills,
    });
    
    setIsGenerating(false);
  };

  const handleUseGenerated = () => {
    if (generatedContent) {
      onGenerate(
        generatedContent.description,
        generatedContent.responsibilities,
        generatedContent.requirements,
        generatedContent.skills
      );
      onClose();
    }
  };

  const handleSaveAsTemplate = () => {
    if (generatedContent) {
      const templateName = prompt('Enter a name for this template:');
      if (templateName && templateName.trim()) {
        const template: JobTemplate = {
          id: `template-${Date.now()}`,
          name: templateName.trim(),
          category: 'Custom',
          description: `AI-generated template for ${jobTitle}`,
          isPreBuilt: false,
          createdAt: new Date().toISOString(),
          data: {
            title: jobTitle,
            description: generatedContent.description,
            responsibilities: generatedContent.responsibilities,
            requirements: generatedContent.requirements,
            skills: generatedContent.skills,
          },
        };
        saveTemplate(template);
        alert('Template saved successfully!');
      }
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Job Description Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Job Title
          </label>
          <Input value={jobTitle} disabled />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Key Requirements (optional)
          </label>
          <textarea
            value={keyRequirements}
            onChange={(e) => setKeyRequirements(e.target.value)}
            placeholder="Enter key requirements or qualifications..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground min-h-[100px]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Length
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Generating...</span>
          </div>
        ) : generatedContent ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Generated Description</h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">{generatedContent.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline" onClick={handleSaveAsTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Save as Template
              </Button>
              <Button onClick={handleUseGenerated} className="flex-1">
                Use Generated Content
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleGenerate} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Description
          </Button>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { 
  FileText, 
  Code, 
  Database, 
  Palette, 
  TrendingUp, 
  Users, 
  Briefcase,
  Sparkles,
  Eye,
  Trash2,
  Save,
  Search,
  X
} from 'lucide-react';
import { JobFormData } from './PostJobSteps';
import { JobTemplate, preBuiltTemplates, loadSavedTemplates, deleteTemplate } from './JobTemplates';
import { cn } from '@/utils';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Engineering: Code,
  Data: Database,
  Product: TrendingUp,
  Design: Palette,
  Marketing: Users,
  Sales: Briefcase,
};

interface TemplateSelectorProps {
  onSelectTemplate: (template: JobTemplate) => void;
  onStartFromScratch: () => void;
}

export function TemplateSelector({ onSelectTemplate, onStartFromScratch }: TemplateSelectorProps) {
  const [savedTemplates, setSavedTemplates] = useState<JobTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<JobTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setSavedTemplates(loadSavedTemplates());
  }, []);

  const allTemplates = [...preBuiltTemplates, ...savedTemplates];
  
  const categories = Array.from(new Set(allTemplates.map(t => t.category)));

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId);
      setSavedTemplates(loadSavedTemplates());
      if (previewTemplate?.id === templateId) {
        setPreviewTemplate(null);
        setShowPreview(false);
      }
    }
  };

  const handlePreview = (template: JobTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  if (showPreview && previewTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Template Preview</h2>
            <p className="text-muted-foreground mt-1">{previewTemplate.name}</p>
          </div>
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            <X className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
        </div>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{previewTemplate.name}</span>
              <Badge variant="default">{previewTemplate.category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Job Title</h3>
              <p className="text-foreground">{previewTemplate.data.title || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {previewTemplate.data.description || 'No description'}
              </p>
            </div>
            {previewTemplate.data.responsibilities && previewTemplate.data.responsibilities.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {previewTemplate.data.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}
            {previewTemplate.data.requirements && previewTemplate.data.requirements.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {previewTemplate.data.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {previewTemplate.data.skills && previewTemplate.data.skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {previewTemplate.data.skills.map((skill, index) => (
                    <Badge key={index} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  setShowPreview(false);
                }}
              >
                Use This Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose a Template</h2>
        <p className="text-muted-foreground">
          Start with a pre-built template or create from scratch
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories.map((category) => {
            const Icon = categoryIcons[category] || FileText;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'No templates available'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = categoryIcons[template.category] || FileText;
            return (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-all border border-border group"
                onClick={() => onSelectTemplate(template)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">{template.category}</p>
                      </div>
                    </div>
                    {template.isPreBuilt && (
                      <Badge variant="default" className="text-xs">Pre-built</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      size="sm"
                      onClick={(e) => handlePreview(template, e)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="default" 
                      className="flex-1 bg-gradient-to-r from-primary to-purple-600" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template);
                      }}
                    >
                      Use
                    </Button>
                    {!template.isPreBuilt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteTemplate(template.id, e)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="text-center">
        <Button variant="ghost" onClick={onStartFromScratch}>
          Start from Scratch
        </Button>
      </div>
    </div>
  );
}

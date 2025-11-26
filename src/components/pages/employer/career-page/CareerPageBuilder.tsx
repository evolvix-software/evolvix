"use client";

import { useState, useRef } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { 
  Eye, 
  Save, 
  GripVertical,
  X,
  Palette,
  Settings,
  Search,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Trash2,
  EyeOff,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/utils';
import { PageSection, SectionType, SectionContent, CareerPageTheme, SEOSettings } from './types';
import { SectionsLibrary } from './components/SectionsLibrary';
import { SectionRenderer } from './components/SectionRenderer';
import { SectionProperties } from './components/SectionProperties';
import { ThemePanel } from './components/ThemePanel';
import { SEOPanel } from './components/SEOPanel';
import { MediaUploader } from './components/MediaUploader';

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type RightPanelMode = 'properties' | 'theme' | 'seo' | 'media';

const getDefaultContent = (type: SectionType): SectionContent => {
  switch (type) {
    case 'hero':
      return { 
        headline: 'Join Our Team', 
        subheadline: 'Build the future with us', 
        ctaText: 'View Open Positions',
        ctaLink: '/jobs',
        height: 'custom',
        customHeight: 600,
        overlayOpacity: 0.5
      };
    case 'about':
      return { 
        title: 'About Us', 
        description: '<p>Tell your company story...</p>',
        layout: 'single'
      };
    case 'values':
      return { 
        title: 'Our Values', 
        values: [],
        columns: 3
      };
    case 'benefits':
      return { 
        title: 'Benefits & Perks', 
        benefits: []
      };
    case 'team':
      return { 
        title: 'Our Team', 
        members: [],
        layout: 'grid'
      };
    case 'testimonials':
      return { 
        title: 'What Our Team Says', 
        testimonials: []
      };
    case 'jobs':
      return { 
        title: 'Open Positions', 
        showFilters: false,
        jobsToShow: 6,
        sortOrder: 'date'
      };
    case 'cta':
      return { 
        title: 'Ready to Join Us?', 
        description: 'Start your journey today',
        buttons: [{ id: '1', text: 'View Jobs', link: '/jobs', variant: 'primary' }]
      };
    case 'contact':
      return { 
        title: 'Contact Us',
        showForm: false
      };
    default:
      return {};
  }
};

export function CareerPageBuilder() {
  const [sections, setSections] = useState<PageSection[]>([
    {
      id: '1',
      type: 'hero',
      order: 0,
      visible: true,
      content: getDefaultContent('hero'),
    },
  ]);
  const [selectedSection, setSelectedSection] = useState<string | null>('1');
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<ViewMode>('desktop');
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('properties');
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<CareerPageTheme>({
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    linkColor: '#3b82f6',
    accentColors: [],
    fontFamily: 'Inter',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    containerWidth: '1200px',
    sectionSpacing: 64,
    borderRadius: 8,
  });

  const [seo, setSeo] = useState<SEOSettings>({
    pageTitle: 'Career Page - Company Name',
    metaDescription: 'Join our team and build the future with us. Explore open positions and discover what makes us unique.',
    customSlug: 'company-name',
  });

  const [mediaItems, setMediaItems] = useState<any[]>([]);

  const addSection = (type: SectionType) => {
    const newSection: PageSection = {
      id: Date.now().toString(),
      type,
      order: sections.length,
      visible: true,
      content: getDefaultContent(type),
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    if (selectedSection === id) {
      setSelectedSection(sections.length > 1 ? sections.find(s => s.id !== id)?.id || null : null);
    }
  };

  const duplicateSection = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (section) {
      const newSection: PageSection = {
        ...section,
        id: Date.now().toString(),
        order: section.order + 1,
      };
      const newSections = [...sections];
      const index = sections.findIndex(s => s.id === id);
      newSections.splice(index + 1, 0, newSection);
      // Reorder all sections
      const reorderedSections = newSections.map((s, idx) => ({ ...s, order: idx }));
      setSections(reorderedSections);
      setSelectedSection(newSection.id);
    }
  };

  const toggleSectionVisibility = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const updateSectionContent = (id: string, content: Partial<SectionContent>) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, content: { ...s.content, ...content } } : s
    ));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    const reorderedSections = newSections.map((s, idx) => ({ ...s, order: idx }));
    setSections(reorderedSections);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSection(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedSection !== id) {
      setDraggedOver(id);
    }
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDraggedOver(null);

    if (!draggedSection || draggedSection === targetId) {
      setDraggedSection(null);
      return;
    }

    const sourceIndex = sections.findIndex(s => s.id === draggedSection);
    const targetIndex = sections.findIndex(s => s.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedSection(null);
      return;
    }

    const newSections = [...sections];
    [newSections[sourceIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sourceIndex]];
    const reorderedSections = newSections.map((s, idx) => ({ ...s, order: idx }));
    setSections(reorderedSections);
    setDraggedSection(null);
  };

  const handlePublish = async () => {
    // TODO: Implement publish logic
    const pageData = {
      sections: sections.filter(s => s.visible),
      theme,
      seo,
    };
    console.log('Publishing page:', pageData);
    alert('Page published successfully!');
  };

  const handleMediaUpload = async (file: File): Promise<string> => {
    // TODO: Implement actual upload
    return URL.createObjectURL(file);
  };

  const selectedSectionData = sections.find(s => s.id === selectedSection);
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const previewWidth = previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px';

  return (
    <Layout noCard title="Career Page Builder" role="employer" noPaddingX>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Career Page Builder</h1>
              <p className="text-muted-foreground mt-1">
                Design and customize your company career page
              </p>
            </div>
            <div className="flex items-center gap-2">
              {showPreview && (
                <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button variant="outline" onClick={() => setRightPanelMode('theme')}>
                <Palette className="w-4 h-4 mr-2" />
                Theme
              </Button>
              <Button variant="outline" onClick={() => setRightPanelMode('seo')}>
                <Search className="w-4 h-4 mr-2" />
                SEO
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all"
                onClick={handlePublish}
              >
                <Save className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Sections Library */}
          {!showPreview && (
            <div className="w-64 border-r border-border bg-card overflow-y-auto p-4">
              <SectionsLibrary onAddSection={addSection} />
            </div>
          )}

          {/* Center - Canvas/Preview */}
          <div className="flex-1 overflow-y-auto bg-muted/30 p-6">
            {showPreview ? (
              <div className="flex justify-center">
                <div 
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all"
                  style={{ width: previewWidth, maxWidth: '100%' }}
                >
                  <div className="bg-muted/50 p-2 text-center text-xs text-muted-foreground border-b border-border">
                    {previewMode === 'desktop' ? 'Desktop Preview' : previewMode === 'tablet' ? 'Tablet Preview' : 'Mobile Preview'}
                  </div>
                  <div style={{ fontFamily: theme.fontFamily }}>
                    {sortedSections.filter(s => s.visible).map((section) => (
                      <div key={section.id}>
                        <SectionRenderer section={section} theme={theme} isPreview />
                  </div>
                ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-4">
                {sortedSections.map((section) => (
                  <Card
                    key={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, section.id)}
                    onDragOver={(e) => handleDragOver(e, section.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, section.id)}
                    className={cn(
                      "border border-border cursor-pointer transition-all",
                      selectedSection === section.id && "ring-2 ring-primary",
                      !section.visible && "opacity-50",
                      draggedOver === section.id && "border-primary border-2",
                      draggedSection === section.id && "opacity-50"
                    )}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                          <CardTitle className="text-sm font-semibold capitalize">
                            {section.type} Section
                          </CardTitle>
                          {!section.visible && (
                            <Badge variant="default" className="text-xs">Hidden</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(section.id, 'up');
                            }}
                            disabled={section.order === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(section.id, 'down');
                            }}
                            disabled={section.order === sections.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSectionVisibility(section.id);
                            }}
                          >
                            {section.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateSection(section.id);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSection(section.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <SectionRenderer section={section} theme={theme} />
                    </CardContent>
                  </Card>
                ))}
                {sections.length === 0 && (
                  <Card className="border border-border border-dashed">
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground mb-4">No sections added yet</p>
                      <p className="text-sm text-muted-foreground">
                        Add sections from the left sidebar to build your career page
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Properties Panel */}
          {!showPreview && (
            <div className="w-80 border-l border-border bg-card overflow-y-auto">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant={rightPanelMode === 'properties' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelMode('properties')}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={rightPanelMode === 'theme' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelMode('theme')}
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={rightPanelMode === 'seo' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelMode('seo')}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={rightPanelMode === 'media' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelMode('media')}
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                {rightPanelMode === 'properties' && selectedSectionData && (
                  <SectionProperties
                    section={selectedSectionData}
                    onUpdate={(updates) => {
                      updateSectionContent(selectedSectionData.id, updates);
                    }}
                  />
                )}
                {rightPanelMode === 'theme' && (
                  <ThemePanel theme={theme} onUpdate={(updates) => setTheme({ ...theme, ...updates })} />
                )}
                {rightPanelMode === 'seo' && (
                  <SEOPanel seo={seo} onUpdate={(updates) => setSeo({ ...seo, ...updates })} />
                )}
                {rightPanelMode === 'media' && (
                  <MediaUploader
                    onUpload={handleMediaUpload}
                    onSelect={(url) => {
                      // Handle media selection
                      console.log('Selected media:', url);
                    }}
                    mediaItems={mediaItems}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

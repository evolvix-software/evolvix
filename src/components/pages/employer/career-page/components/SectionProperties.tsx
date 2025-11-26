"use client";

import { PageSection, SectionContent } from '../types';
import { Input } from '@/components/common/forms/Input';
import { Button } from '@/components/common/forms/Button';
import { RichTextEditor } from '@/components/pages/employer/jobs/components/RichTextEditor';
import { Plus, X, GripVertical } from 'lucide-react';
import { cn } from '@/utils';

interface SectionPropertiesProps {
  section: PageSection;
  onUpdate: (content: Partial<SectionContent>) => void;
}

export function SectionProperties({ section, onUpdate }: SectionPropertiesProps) {
  const updateContent = (updates: Partial<SectionContent>) => {
    onUpdate(updates);
  };

  switch (section.type) {
    case 'hero':
      return <HeroProperties content={section.content} onUpdate={updateContent} />;
    case 'about':
      return <AboutProperties content={section.content} onUpdate={updateContent} />;
    case 'values':
      return <ValuesProperties content={section.content} onUpdate={updateContent} />;
    case 'benefits':
      return <BenefitsProperties content={section.content} onUpdate={updateContent} />;
    case 'team':
      return <TeamProperties content={section.content} onUpdate={updateContent} />;
    case 'testimonials':
      return <TestimonialsProperties content={section.content} onUpdate={updateContent} />;
    case 'jobs':
      return <JobsProperties content={section.content} onUpdate={updateContent} />;
    case 'cta':
      return <CTAProperties content={section.content} onUpdate={updateContent} />;
    case 'contact':
      return <ContactProperties content={section.content} onUpdate={updateContent} />;
    default:
      return <div className="text-sm text-muted-foreground">No properties available</div>;
  }
}

function HeroProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Headline</label>
        <Input
          value={content.headline || ''}
          onChange={(e) => onUpdate({ headline: e.target.value })}
          placeholder="Join Our Team"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Subheadline</label>
        <Input
          value={content.subheadline || ''}
          onChange={(e) => onUpdate({ subheadline: e.target.value })}
          placeholder="Build the future with us"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">CTA Button Text</label>
        <Input
          value={content.ctaText || ''}
          onChange={(e) => onUpdate({ ctaText: e.target.value })}
          placeholder="View Open Positions"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">CTA Link</label>
        <Input
          value={content.ctaLink || ''}
          onChange={(e) => onUpdate({ ctaLink: e.target.value })}
          placeholder="/jobs"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Background Image URL</label>
        <Input
          value={content.backgroundImage || ''}
          onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Overlay Opacity (0-1)</label>
        <Input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={content.overlayOpacity ?? 0.5}
          onChange={(e) => onUpdate({ overlayOpacity: parseFloat(e.target.value) })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Height</label>
        <select
          value={content.height || 'custom'}
          onChange={(e) => onUpdate({ height: e.target.value as 'full' | 'custom' })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="full">Full Screen</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {content.height === 'custom' && (
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Custom Height (px)</label>
          <Input
            type="number"
            value={content.customHeight || 600}
            onChange={(e) => onUpdate({ customHeight: parseInt(e.target.value) })}
          />
        </div>
      )}
    </div>
  );
}

function AboutProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
        <RichTextEditor
          value={content.description || ''}
          onChange={(value) => onUpdate({ description: value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Mission Statement</label>
        <textarea
          value={content.mission || ''}
          onChange={(e) => onUpdate({ mission: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Vision Statement</label>
        <textarea
          value={content.vision || ''}
          onChange={(e) => onUpdate({ vision: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Layout</label>
        <select
          value={content.layout || 'single'}
          onChange={(e) => onUpdate({ layout: e.target.value as 'single' | 'two-column' })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="single">Single Column</option>
          <option value="two-column">Two Column</option>
        </select>
      </div>
    </div>
  );
}

function ValuesProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  const values = content.values || [];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Number of Columns</label>
        <select
          value={content.columns || 3}
          onChange={(e) => onUpdate({ columns: parseInt(e.target.value) as 3 | 4 | 6 })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="3">3 Columns</option>
          <option value="4">4 Columns</option>
          <option value="6">6 Columns</option>
        </select>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">Values</label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newValues = [...values, { id: Date.now().toString(), title: '', description: '' }];
              onUpdate({ values: newValues });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Value
          </Button>
        </div>
        <div className="space-y-3">
          {values.map((value, idx) => (
            <div key={value.id} className="p-3 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Value {idx + 1}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newValues = values.filter(v => v.id !== value.id);
                    onUpdate({ values: newValues });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={value.title}
                onChange={(e) => {
                  const newValues = [...values];
                  newValues[idx] = { ...value, title: e.target.value };
                  onUpdate({ values: newValues });
                }}
                placeholder="Value Title"
              />
              <textarea
                value={value.description}
                onChange={(e) => {
                  const newValues = [...values];
                  newValues[idx] = { ...value, description: e.target.value };
                  onUpdate({ values: newValues });
                }}
                placeholder="Value Description"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm min-h-[80px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BenefitsProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  const benefits = content.benefits || [];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">Benefits</label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newBenefits = [...benefits, { id: Date.now().toString(), name: '', description: '' }];
              onUpdate({ benefits: newBenefits });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Benefit
          </Button>
        </div>
        <div className="space-y-3">
          {benefits.map((benefit, idx) => (
            <div key={benefit.id} className="p-3 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Benefit {idx + 1}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newBenefits = benefits.filter(b => b.id !== benefit.id);
                    onUpdate({ benefits: newBenefits });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={benefit.name}
                onChange={(e) => {
                  const newBenefits = [...benefits];
                  newBenefits[idx] = { ...benefit, name: e.target.value };
                  onUpdate({ benefits: newBenefits });
                }}
                placeholder="Benefit Name"
              />
              <textarea
                value={benefit.description}
                onChange={(e) => {
                  const newBenefits = [...benefits];
                  newBenefits[idx] = { ...benefit, description: e.target.value };
                  onUpdate({ benefits: newBenefits });
                }}
                placeholder="Benefit Description"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm min-h-[80px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  const members = content.members || [];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Layout</label>
        <select
          value={content.layout || 'grid'}
          onChange={(e) => onUpdate({ layout: e.target.value as 'grid' | 'carousel' })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="grid">Grid</option>
          <option value="carousel">Carousel</option>
        </select>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">Team Members</label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newMembers = [...members, { id: Date.now().toString(), name: '', role: '' }];
              onUpdate({ members: newMembers });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Member
          </Button>
        </div>
        <div className="space-y-3">
          {members.map((member, idx) => (
            <div key={member.id} className="p-3 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Member {idx + 1}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newMembers = members.filter(m => m.id !== member.id);
                    onUpdate({ members: newMembers });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={member.name}
                onChange={(e) => {
                  const newMembers = [...members];
                  newMembers[idx] = { ...member, name: e.target.value };
                  onUpdate({ members: newMembers });
                }}
                placeholder="Name"
              />
              <Input
                value={member.role}
                onChange={(e) => {
                  const newMembers = [...members];
                  newMembers[idx] = { ...member, role: e.target.value };
                  onUpdate({ members: newMembers });
                }}
                placeholder="Role"
              />
              <textarea
                value={member.bio || ''}
                onChange={(e) => {
                  const newMembers = [...members];
                  newMembers[idx] = { ...member, bio: e.target.value };
                  onUpdate({ members: newMembers });
                }}
                placeholder="Bio"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm min-h-[60px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialsProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  const testimonials = content.testimonials || [];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">Testimonials</label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newTestimonials = [...testimonials, { id: Date.now().toString(), name: '', role: '', text: '' }];
              onUpdate({ testimonials: newTestimonials });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Testimonial
          </Button>
        </div>
        <div className="space-y-3">
          {testimonials.map((testimonial, idx) => (
            <div key={testimonial.id} className="p-3 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Testimonial {idx + 1}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newTestimonials = testimonials.filter(t => t.id !== testimonial.id);
                    onUpdate({ testimonials: newTestimonials });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={testimonial.name}
                onChange={(e) => {
                  const newTestimonials = [...testimonials];
                  newTestimonials[idx] = { ...testimonial, name: e.target.value };
                  onUpdate({ testimonials: newTestimonials });
                }}
                placeholder="Name"
              />
              <Input
                value={testimonial.role}
                onChange={(e) => {
                  const newTestimonials = [...testimonials];
                  newTestimonials[idx] = { ...testimonial, role: e.target.value };
                  onUpdate({ testimonials: newTestimonials });
                }}
                placeholder="Role"
              />
              <textarea
                value={testimonial.text}
                onChange={(e) => {
                  const newTestimonials = [...testimonials];
                  newTestimonials[idx] = { ...testimonial, text: e.target.value };
                  onUpdate({ testimonials: newTestimonials });
                }}
                placeholder="Testimonial Text"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm min-h-[80px]"
              />
              <Input
                type="number"
                min="1"
                max="5"
                value={testimonial.rating || ''}
                onChange={(e) => {
                  const newTestimonials = [...testimonials];
                  newTestimonials[idx] = { ...testimonial, rating: parseInt(e.target.value) || undefined };
                  onUpdate({ testimonials: newTestimonials });
                }}
                placeholder="Rating (1-5)"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JobsProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Jobs to Show</label>
        <Input
          type="number"
          value={content.jobsToShow || 6}
          onChange={(e) => onUpdate({ jobsToShow: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Show Filters</label>
        <select
          value={content.showFilters ? 'true' : 'false'}
          onChange={(e) => onUpdate({ showFilters: e.target.value === 'true' })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
    </div>
  );
}

function CTAProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  const buttons = content.buttons || [];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">Buttons</label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newButtons = [...buttons, { id: Date.now().toString(), text: '', link: '', variant: 'primary' }];
              onUpdate({ buttons: newButtons });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Button
          </Button>
        </div>
        <div className="space-y-3">
          {buttons.map((button, idx) => (
            <div key={button.id} className="p-3 border border-border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Button {idx + 1}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newButtons = buttons.filter(b => b.id !== button.id);
                    onUpdate({ buttons: newButtons });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={button.text}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[idx] = { ...button, text: e.target.value };
                  onUpdate({ buttons: newButtons });
                }}
                placeholder="Button Text"
              />
              <Input
                value={button.link}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[idx] = { ...button, link: e.target.value };
                  onUpdate({ buttons: newButtons });
                }}
                placeholder="Button Link"
              />
              <select
                value={button.variant || 'primary'}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[idx] = { ...button, variant: e.target.value as 'primary' | 'secondary' | 'outline' };
                  onUpdate({ buttons: newButtons });
                }}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactProperties({ content, onUpdate }: { content: SectionContent; onUpdate: (updates: Partial<SectionContent>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Section Title</label>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Address</label>
        <textarea
          value={content.address || ''}
          onChange={(e) => onUpdate({ address: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[80px]"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
        <Input
          type="email"
          value={content.email || ''}
          onChange={(e) => onUpdate({ email: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
        <Input
          value={content.phone || ''}
          onChange={(e) => onUpdate({ phone: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Show Contact Form</label>
        <select
          value={content.showForm ? 'true' : 'false'}
          onChange={(e) => onUpdate({ showForm: e.target.value === 'true' })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
    </div>
  );
}


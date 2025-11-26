"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { 
  Image as ImageIcon, 
  FileText, 
  Heart, 
  Gift, 
  Users, 
  MessageSquare, 
  Briefcase, 
  Phone, 
  Target
} from 'lucide-react';
import { SectionType } from '../types';
import { cn } from '@/utils';

interface SectionItem {
  type: SectionType;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'content' | 'engagement' | 'information';
}

const sections: SectionItem[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'First impression with company branding',
    icon: <ImageIcon className="w-5 h-5" />,
    category: 'content',
  },
  {
    type: 'about',
    name: 'About Us',
    description: 'Company story and mission',
    icon: <FileText className="w-5 h-5" />,
    category: 'content',
  },
  {
    type: 'values',
    name: 'Values',
    description: 'Showcase company culture',
    icon: <Heart className="w-5 h-5" />,
    category: 'content',
  },
  {
    type: 'benefits',
    name: 'Benefits',
    description: 'Highlight perks and benefits',
    icon: <Gift className="w-5 h-5" />,
    category: 'engagement',
  },
  {
    type: 'team',
    name: 'Team',
    description: 'Show team members and culture',
    icon: <Users className="w-5 h-5" />,
    category: 'engagement',
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Employee testimonials',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'engagement',
  },
  {
    type: 'jobs',
    name: 'Open Jobs',
    description: 'Display open positions',
    icon: <Briefcase className="w-5 h-5" />,
    category: 'information',
  },
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Call-to-action for candidates',
    icon: <Target className="w-5 h-5" />,
    category: 'engagement',
  },
  {
    type: 'contact',
    name: 'Contact',
    description: 'Contact information',
    icon: <Phone className="w-5 h-5" />,
    category: 'information',
  },
];

interface SectionsLibraryProps {
  onAddSection: (type: SectionType) => void;
  className?: string;
}

export function SectionsLibrary({ onAddSection, className }: SectionsLibraryProps) {
  const categories = {
    content: sections.filter(s => s.category === 'content'),
    engagement: sections.filter(s => s.category === 'engagement'),
    information: sections.filter(s => s.category === 'information'),
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="font-semibold text-foreground mb-2">Content Sections</h3>
        <div className="space-y-2">
          {categories.content.map((section) => (
            <Card
              key={section.type}
              className="cursor-pointer hover:shadow-lg transition-all border border-border hover:border-primary"
              onClick={() => onAddSection(section.type)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{section.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">Engagement Sections</h3>
        <div className="space-y-2">
          {categories.engagement.map((section) => (
            <Card
              key={section.type}
              className="cursor-pointer hover:shadow-lg transition-all border border-border hover:border-primary"
              onClick={() => onAddSection(section.type)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{section.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-2">Information Sections</h3>
        <div className="space-y-2">
          {categories.information.map((section) => (
            <Card
              key={section.type}
              className="cursor-pointer hover:shadow-lg transition-all border border-border hover:border-primary"
              onClick={() => onAddSection(section.type)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{section.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


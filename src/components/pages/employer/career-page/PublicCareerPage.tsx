"use client";

import { useEffect, useState } from 'react';
import { SectionRenderer } from './components/SectionRenderer';
import { PageSection, CareerPageTheme } from './types';
import { Button } from '@/components/common/forms/Button';
import { Share2, ExternalLink } from 'lucide-react';

interface PublicCareerPageProps {
  companySlug: string;
}

export function PublicCareerPage({ companySlug }: PublicCareerPageProps) {
  const [sections, setSections] = useState<PageSection[]>([]);
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
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('Company Name');

  useEffect(() => {
    // TODO: Fetch career page data from API based on companySlug
    // For now, using mock data
    const fetchCareerPage = async () => {
      try {
        // const response = await fetch(`/api/careers/${companySlug}`);
        // const data = await response.json();
        // setSections(data.sections);
        // setTheme(data.theme);
        // setCompanyName(data.companyName);

        // Mock data for now
        setSections([
          {
            id: '1',
            type: 'hero',
            order: 0,
            visible: true,
            content: {
              headline: 'Join Our Team',
              subheadline: 'Build the future with us',
              ctaText: 'View Open Positions',
              ctaLink: '/jobs',
            },
          },
        ]);
        setCompanyName('Company Name');
        setLoading(false);
      } catch (error) {
        console.error('Failed to load career page:', error);
        setLoading(false);
      }
    };

    fetchCareerPage();
  }, [companySlug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${companyName} - Careers`,
        text: `Check out career opportunities at ${companyName}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: theme.fontFamily }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">{companyName}</h1>
            <span className="text-muted-foreground">Careers</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/jobs'}>
              View Jobs
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {sortedSections.filter(s => s.visible).map((section) => (
          <div key={section.id}>
            <SectionRenderer section={section} theme={theme} isPreview />
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


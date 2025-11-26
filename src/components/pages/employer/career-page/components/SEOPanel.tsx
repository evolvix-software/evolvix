"use client";

import { SEOSettings } from '../types';
import { Input } from '@/components/common/forms/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';

interface SEOPanelProps {
  seo: SEOSettings;
  onUpdate: (seo: Partial<SEOSettings>) => void;
}

export function SEOPanel({ seo, onUpdate }: SEOPanelProps) {
  const charCount = seo.pageTitle.length;
  const descCount = seo.metaDescription.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Meta Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Page Title (30-60 characters)
            </label>
            <Input
              value={seo.pageTitle}
              onChange={(e) => onUpdate({ pageTitle: e.target.value })}
              placeholder="Career Page - Company Name"
              maxLength={60}
            />
            <p className={cn(
              "text-xs mt-1",
              charCount < 30 ? "text-yellow-600" : charCount > 60 ? "text-red-600" : "text-muted-foreground"
            )}>
              {charCount} characters {charCount < 30 && "(too short)"} {charCount > 60 && "(too long)"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Meta Description (120-160 characters)
            </label>
            <textarea
              value={seo.metaDescription}
              onChange={(e) => onUpdate({ metaDescription: e.target.value })}
              placeholder="Join our team and build the future..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px]"
              maxLength={160}
            />
            <p className={cn(
              "text-xs mt-1",
              descCount < 120 ? "text-yellow-600" : descCount > 160 ? "text-red-600" : "text-muted-foreground"
            )}>
              {descCount} characters {descCount < 120 && "(too short)"} {descCount > 160 && "(too long)"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Keywords (comma-separated)</label>
            <Input
              value={seo.keywords || ''}
              onChange={(e) => onUpdate({ keywords: e.target.value })}
              placeholder="careers, jobs, hiring, company"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Social Media</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Open Graph Image URL</label>
            <Input
              value={seo.ogImage || ''}
              onChange={(e) => onUpdate({ ogImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Twitter Card Image URL</label>
            <Input
              value={seo.twitterCardImage || ''}
              onChange={(e) => onUpdate({ twitterCardImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">URL Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Custom Slug</label>
            <Input
              value={seo.customSlug || ''}
              onChange={(e) => onUpdate({ customSlug: e.target.value })}
              placeholder="company-name"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your page will be available at: /careers/{seo.customSlug || 'company-name'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Custom Domain (Premium)</label>
            <Input
              value={seo.customDomain || ''}
              onChange={(e) => onUpdate({ customDomain: e.target.value })}
              placeholder="careers.yourcompany.com"
              disabled
            />
            <p className="text-xs text-muted-foreground mt-1">Premium feature - Contact support to enable</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Analytics</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Google Analytics ID</label>
            <Input
              value={seo.googleAnalyticsId || ''}
              onChange={(e) => onUpdate({ googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Facebook Pixel ID</label>
            <Input
              value={seo.facebookPixelId || ''}
              onChange={(e) => onUpdate({ facebookPixelId: e.target.value })}
              placeholder="1234567890"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}


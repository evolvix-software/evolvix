"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { CompanyProfile } from '../types';
import Image from 'next/image';

interface CompanyProfileTabProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export function CompanyProfileTab({ onUnsavedChanges }: CompanyProfileTabProps) {
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: 'Tech Corp',
    companySlug: 'tech-corp',
    industry: 'Technology',
    companySize: '50-200',
    headquarters: 'San Francisco, CA',
    website: 'https://techcorp.com',
    description: 'We are a leading technology company...',
    linkedinUrl: 'https://linkedin.com/company/techcorp',
    twitterUrl: 'https://twitter.com/techcorp',
    facebookUrl: 'https://facebook.com/techcorp',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleChange = (field: keyof CompanyProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
    onUnsavedChanges?.(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setProfile({ ...profile, logo: reader.result as string });
        onUnsavedChanges?.(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
        setProfile({ ...profile, banner: reader.result as string });
        onUnsavedChanges?.(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // TODO: Save to API
    console.log('Saving profile:', profile);
    alert('Profile saved successfully!');
    onUnsavedChanges?.(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Company Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your company information and branding
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your company's basic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Company Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={profile.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Company Slug</label>
            <Input
              value={profile.companySlug}
              onChange={(e) => handleChange('companySlug', e.target.value)}
              placeholder="tech-corp"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used in URLs: /careers/{profile.companySlug || 'company-slug'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Industry <span className="text-destructive">*</span>
              </label>
              <select
                value={profile.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Company Size</label>
              <select
                value={profile.companySize}
                onChange={(e) => handleChange('companySize', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="50-200">50-200 employees</option>
                <option value="200-500">200-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Headquarters</label>
            <Input
              value={profile.headquarters}
              onChange={(e) => handleChange('headquarters', e.target.value)}
              placeholder="City, State, Country"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Website</label>
            <Input
              type="url"
              value={profile.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
            <textarea
              value={profile.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[120px]"
              placeholder="Tell us about your company..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Upload your company logo and banner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Company Logo</label>
            <div className="flex items-center gap-4">
              {(logoPreview || profile.logo) && (
                <div className="relative w-24 h-24 border border-border rounded-lg overflow-hidden">
                  <Image
                    src={logoPreview || profile.logo || ''}
                    alt="Logo"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <span className="inline-flex items-center justify-center rounded-lg font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 200x200px, PNG or JPG
                </p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Banner Image</label>
            <div className="flex items-center gap-4">
              {(bannerPreview || profile.banner) && (
                <div className="relative w-full h-32 border border-border rounded-lg overflow-hidden">
                  <Image
                    src={bannerPreview || profile.banner || ''}
                    alt="Banner"
                    width={800}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                  id="banner-upload"
                />
                <label htmlFor="banner-upload">
                  <span className="inline-flex items-center justify-center rounded-lg font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Banner
                  </span>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1200x300px, PNG or JPG
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Connect your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">LinkedIn URL</label>
            <Input
              type="url"
              value={profile.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Twitter URL</label>
            <Input
              type="url"
              value={profile.twitterUrl || ''}
              onChange={(e) => handleChange('twitterUrl', e.target.value)}
              placeholder="https://twitter.com/yourcompany"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Facebook URL</label>
            <Input
              type="url"
              value={profile.facebookUrl || ''}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              placeholder="https://facebook.com/yourcompany"
            />
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


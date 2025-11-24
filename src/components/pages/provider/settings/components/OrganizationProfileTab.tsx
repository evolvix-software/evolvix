"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Provider } from '@/data/mock/providerData';
import { providerService } from '@/data/mock/providerData';
import { User, Building2, Mail, Phone, Globe, MapPin, Upload, X, Save } from 'lucide-react';

interface OrganizationProfileTabProps {
  provider: Provider | null;
  onUpdate: (provider: Provider) => void;
}

export function OrganizationProfileTab({ provider, onUpdate }: OrganizationProfileTabProps) {
  const [formData, setFormData] = useState({
    organizationName: provider?.organizationName || '',
    organizationSlug: provider?.organizationSlug || '',
    contactEmail: provider?.contactEmail || '',
    contactPhone: provider?.contactPhone || '',
    website: provider?.website || '',
    address: provider?.address || '',
    description: '',
    focusAreas: [] as string[],
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(provider?.logo || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(provider?.banner || null);
  const [saving, setSaving] = useState(false);
  const [newFocusArea, setNewFocusArea] = useState('');

  const focusAreaOptions = [
    'Education',
    'Technology',
    'Healthcare',
    'Social Impact',
    'Women Empowerment',
    'Rural Development',
    'Skill Development',
    'Entrepreneurship',
  ];

  useEffect(() => {
    if (provider) {
      setFormData({
        organizationName: provider.organizationName || '',
        organizationSlug: provider.organizationSlug || '',
        contactEmail: provider.contactEmail || '',
        contactPhone: provider.contactPhone || '',
        website: provider.website || '',
        address: provider.address || '',
        description: '',
        focusAreas: [],
      });
      setLogoPreview(provider.logo || null);
      setBannerPreview(provider.banner || null);
    }
  }, [provider]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from organization name
    if (field === 'organizationName') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, organizationSlug: slug }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Banner file size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFocusArea = () => {
    if (newFocusArea && !formData.focusAreas.includes(newFocusArea)) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, newFocusArea],
      }));
      setNewFocusArea('');
    }
  };

  const handleRemoveFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter(a => a !== area),
    }));
  };

  const handleSave = async () => {
    if (!provider) return;

    setSaving(true);
    try {
      const updated = providerService.updateProvider({
        organizationName: formData.organizationName,
        organizationSlug: formData.organizationSlug,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || undefined,
        website: formData.website || undefined,
        address: formData.address || undefined,
        logo: logoPreview || undefined,
        banner: bannerPreview || undefined,
      });
      
      if (updated) {
        onUpdate(updated);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!provider) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Provider not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Organization Name *"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              icon={<Building2 className="w-4 h-4" />}
              required
            />
            <Input
              label="Organization Slug"
              value={formData.organizationSlug}
              onChange={(e) => handleInputChange('organizationSlug', e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label="Contact Email *"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Contact Phone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              icon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="Website URL"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              icon={<Globe className="w-4 h-4" />}
              placeholder="https://example.com"
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Branding</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Logo</label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-24 h-24 rounded-lg object-cover border border-border"
                  />
                  <button
                    onClick={() => setLogoPreview(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button variant="outline" type="button" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, SVG up to 2MB. Recommended: 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Banner</label>
            <div className="flex items-center gap-4">
              {bannerPreview && (
                <div className="relative">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-48 h-24 rounded-lg object-cover border border-border"
                  />
                  <button
                    onClick={() => setBannerPreview(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <Button variant="outline" type="button" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {bannerPreview ? 'Change Banner' : 'Upload Banner'}
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB. Recommended: 1200x300px
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Description */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Organization Description</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              About Organization
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              maxLength={2000}
              rows={6}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Mission statement, values, impact focus..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length} / 2000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Focus Areas</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.focusAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                >
                  {area}
                  <button
                    onClick={() => handleRemoveFocusArea(area)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newFocusArea}
                onChange={(e) => setNewFocusArea(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select focus area...</option>
                {focusAreaOptions
                  .filter(opt => !formData.focusAreas.includes(opt))
                  .map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
              </select>
              <Button
                variant="outline"
                onClick={handleAddFocusArea}
                disabled={!newFocusArea}
              >
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}


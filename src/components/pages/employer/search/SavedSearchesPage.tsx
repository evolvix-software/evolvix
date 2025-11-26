"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { SavedSearches } from './components/SavedSearches';
import { SavedSearch, SearchFilters } from './types';
import { Plus, ArrowLeft } from 'lucide-react';

// Mock data - replace with API calls
const mockSavedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'Senior React Developers',
    filters: {
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: { min: 5, max: 10 },
      location: 'San Francisco',
    },
    resultCount: 45,
    lastSearched: new Date().toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    alertsEnabled: true,
    alertFrequency: 'weekly',
  },
  {
    id: '2',
    name: 'Remote Python Engineers',
    filters: {
      skills: ['Python', 'Django', 'PostgreSQL'],
      remote: true,
      availability: ['immediate', '2weeks'],
    },
    resultCount: 32,
    lastSearched: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    alertsEnabled: false,
  },
];

export function SavedSearchesPage() {
  const router = useRouter();
  const [searches, setSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [searchName, setSearchName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleRunSearch = (search: SavedSearch) => {
    // Navigate to search page with filters applied
    const params = new URLSearchParams();
    if (search.filters.query) params.set('q', search.filters.query);
    if (search.filters.skills) params.set('skills', search.filters.skills.join(','));
    if (search.filters.location) params.set('location', search.filters.location);
    if (search.filters.experience) {
      params.set('exp_min', search.filters.experience.min.toString());
      params.set('exp_max', search.filters.experience.max.toString());
    }
    router.push(`/portal/employer/search?${params.toString()}`);
  };

  const handleEditSearch = (search: SavedSearch) => {
    // Navigate to search page with filters applied for editing
    handleRunSearch(search);
  };

  const handleDeleteSearch = (id: string) => {
    if (confirm('Are you sure you want to delete this saved search?')) {
      setSearches(searches.filter(s => s.id !== id));
      // TODO: Delete from API
    }
  };

  const handleToggleAlerts = (id: string) => {
    setSearches(searches.map(s => 
      s.id === id 
        ? { ...s, alertsEnabled: !s.alertsEnabled }
        : s
    ));
    // TODO: Update alerts in API
  };

  const handleCreateSearch = () => {
    if (!searchName.trim()) {
      alert('Please enter a search name');
      return;
    }
    // Navigate to search page to create new search
    router.push(`/portal/employer/search?save=true&name=${encodeURIComponent(searchName)}`);
  };

  return (
    <Layout noCard title="Saved Searches" role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground mt-4">Saved Searches</h1>
            <p className="text-muted-foreground mt-1">
              Manage your saved candidate searches
            </p>
          </div>
          <Button onClick={() => router.push('/portal/employer/search')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Search
          </Button>
        </div>

        {/* Saved Searches List */}
        <SavedSearches
          searches={searches}
          onRunSearch={handleRunSearch}
          onEditSearch={handleEditSearch}
          onDeleteSearch={handleDeleteSearch}
          onToggleAlerts={handleToggleAlerts}
        />
      </div>
    </Layout>
  );
}


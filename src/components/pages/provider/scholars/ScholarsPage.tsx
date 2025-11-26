"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { ScholarCard } from './components/ScholarCard';
import { ScholarFilters } from './components/ScholarFilters';
import { ScholarStats } from './components/ScholarStats';
import { Plus, Search, Filter, Grid3x3, List, Download, Users, Award, TrendingUp, GraduationCap, CheckSquare, Square, Trash2, Mail } from 'lucide-react';
import { providerService, scholarService, Scholar } from '@/data/mock/providerData';

type ViewMode = 'grid' | 'list';
type ScholarStatus = 'active' | 'completed' | 'paused' | 'revoked' | 'all';
type GraduationStatus = 'not-graduated' | 'graduated' | 'dropped-out' | 'all';
type JobStatus = 'not-placed' | 'placed' | 'all';

interface Filters {
  search: string;
  status: ScholarStatus;
  graduationStatus: GraduationStatus;
  jobStatus: JobStatus;
  campaign?: string;
  course?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'all';
}

export function ScholarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [filteredScholars, setFilteredScholars] = useState<Scholar[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: (searchParams.get('status') as ScholarStatus) || 'all',
    graduationStatus: 'all',
    jobStatus: 'all',
    campaign: searchParams.get('campaign') || undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedScholars, setSelectedScholars] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      console.log('[ScholarsPage] Starting data load...');
      let currentProvider = provider;
      
      if (!currentProvider) {
        console.log('[ScholarsPage] No provider found, checking registration data...');
        const registrationData = localStorage.getItem('evolvix_registration');
        if (registrationData) {
          const regData = JSON.parse(registrationData);
          console.log('[ScholarsPage] Creating provider from registration data:', regData);
          currentProvider = providerService.createProvider({
            organizationName: regData.fullName || 'My Organization',
            organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
            contactEmail: regData.email || '',
            userId: regData.email || '',
          });
          console.log('[ScholarsPage] Created provider:', currentProvider);
          setProvider(currentProvider);
        } else {
          console.log('[ScholarsPage] No registration data found, redirecting to signin');
          router.push('/auth/signin');
          return;
        }
      }

      if (currentProvider) {
        try {
          console.log('[ScholarsPage] Provider found:', currentProvider.id);
          
          // Ensure data is assigned to this provider
          console.log('[ScholarsPage] Ensuring data is assigned to provider...');
          providerService.ensureDataAssigned(currentProvider.id);
          
          // Get all scholars first to check what exists
          const allScholars = scholarService.getAll();
          console.log('[ScholarsPage] All scholars in storage:', allScholars.length, allScholars);
          
          // Get scholars for this provider
          const providerScholars = scholarService.getAll(currentProvider.id);
          console.log('[ScholarsPage] Provider scholars:', providerScholars.length, providerScholars);
          
          // If no scholars found, try to get all scholars and check if they need to be assigned
          if (providerScholars.length === 0) {
            console.log('[ScholarsPage] No provider scholars found, checking for unassigned scholars...');
            if (allScholars.length > 0) {
              console.log('[ScholarsPage] Found unassigned scholars, reassigning...');
              // Reassign any unassigned scholars
              providerService.ensureDataAssigned(currentProvider.id);
              const reassignedScholars = scholarService.getAll(currentProvider.id);
              console.log('[ScholarsPage] After reassignment:', reassignedScholars.length, reassignedScholars);
              setScholars(reassignedScholars);
              setFilteredScholars(reassignedScholars);
            } else {
              console.log('[ScholarsPage] No scholars found in storage at all');
              setScholars([]);
              setFilteredScholars([]);
            }
          } else {
            console.log('[ScholarsPage] Setting provider scholars:', providerScholars.length);
            setScholars(providerScholars);
            setFilteredScholars(providerScholars);
          }
        } catch (error) {
          console.error('[ScholarsPage] Error fetching scholars:', error);
          setScholars([]);
          setFilteredScholars([]);
        }
        setLoading(false);
      }
    };

    loadData();
  }, [provider, router]);

  useEffect(() => {
    let filtered = [...scholars];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.profile.name.toLowerCase().includes(searchLower) ||
          s.profile.email.toLowerCase().includes(searchLower) ||
          s.enrollments.some((e) => e.courseId.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((s) => s.awardStatus === filters.status);
    }

    // Graduation status filter
    if (filters.graduationStatus !== 'all') {
      filtered = filtered.filter((s) => s.graduationStatus === filters.graduationStatus);
    }

    // Job status filter
    if (filters.jobStatus !== 'all') {
      if (filters.jobStatus === 'placed') {
        filtered = filtered.filter((s) => s.jobPlacement && s.jobPlacement.status === 'started');
      } else {
        filtered = filtered.filter((s) => !s.jobPlacement || s.jobPlacement.status !== 'started');
      }
    }

    // Campaign filter
    if (filters.campaign) {
      filtered = filtered.filter((s) => s.campaignId === filters.campaign);
    }

    // Risk level filter
    if (filters.riskLevel && filters.riskLevel !== 'all') {
      filtered = filtered.filter((s) => {
        const risk = s.riskScore || 0;
        if (filters.riskLevel === 'high') return risk >= 70;
        if (filters.riskLevel === 'medium') return risk >= 40 && risk < 70;
        return risk < 40;
      });
    }

    setFilteredScholars(filtered);
  }, [filters, scholars]);

  const stats = {
    total: scholars.length || 0,
    active: scholars.filter((s) => s.awardStatus === 'active').length || 0,
    graduated: scholars.filter((s) => s.graduationStatus === 'graduated').length || 0,
    placed: scholars.filter((s) => s.jobPlacement?.status === 'started').length || 0,
    atRisk: scholars.filter((s) => (s.riskScore || 0) >= 70).length || 0,
  };

  if (loading) {
    return (
      <Layout title="Awarded Scholars" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Awarded Scholars" role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Awarded Scholars</h1>
            <p className="text-muted-foreground mt-1">
              Manage scholars and track their progress, job placements, and graduations
            </p>
          </div>
          <div className="flex gap-2">
            {bulkActionMode && selectedScholars.size > 0 && (
              <>
                <Button variant="outline" onClick={() => {
                  alert(`Exporting ${selectedScholars.size} scholars`);
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" onClick={() => {
                  alert(`Sending message to ${selectedScholars.size} scholars`);
                }}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" onClick={() => {
                  if (confirm(`Delete ${selectedScholars.size} scholars?`)) {
                    setSelectedScholars(new Set());
                    setBulkActionMode(false);
                  }
                }}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
                <Button variant="outline" onClick={() => {
                  setSelectedScholars(new Set());
                  setBulkActionMode(false);
                }}>
                  Cancel
                </Button>
              </>
            )}
            {!bulkActionMode && (
              <>
                <Button variant="outline" onClick={() => setBulkActionMode(true)}>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button variant="outline" onClick={() => {
                  alert('Export functionality will be implemented');
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <ScholarStats stats={stats} />

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 flex gap-2 items-center">
            <Input
              placeholder="Search scholars..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              icon={<Search className="w-4 h-4" />}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <ScholarFilters filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilters(false)} />
        )}

        {/* Quick Status Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'graduated', 'placed'] as const).map((status) => (
            <Button
              key={status}
              variant={filters.status === status || (status === 'all' && filters.status === 'all') ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (status === 'all') {
                  setFilters({ ...filters, status: 'all' });
                } else if (status === 'graduated') {
                  setFilters({ ...filters, graduationStatus: 'graduated' });
                } else if (status === 'placed') {
                  setFilters({ ...filters, jobStatus: 'placed' });
                } else {
                  setFilters({ ...filters, status: status as ScholarStatus });
                }
              }}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-background/50 text-xs">
                  {(() => {
                    const value = stats[status as keyof typeof stats];
                    return typeof value === 'number' && !isNaN(value) ? value : 0;
                  })()}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Scholars List/Grid */}
        {filteredScholars.length === 0 ? (
          <EmptyState
            title="No scholars found"
            description={
              filters.search || filters.status !== 'all'
                ? 'Try adjusting your filters to see more scholars.'
                : 'No scholars have been awarded yet.'
            }
            icon={<Users className="w-12 h-12 text-muted-foreground" />}
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredScholars.map((scholar) => (
              <div key={scholar.id} className="relative">
                {bulkActionMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newSelected = new Set(selectedScholars);
                        if (newSelected.has(scholar.id)) {
                          newSelected.delete(scholar.id);
                        } else {
                          newSelected.add(scholar.id);
                        }
                        setSelectedScholars(newSelected);
                      }}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedScholars.has(scholar.id)
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-background border-border'
                      }`}
                    >
                      {selectedScholars.has(scholar.id) && <CheckSquare className="w-4 h-4" />}
                    </button>
                  </div>
                )}
                <ScholarCard
                  scholar={scholar}
                  viewMode={viewMode}
                  onClick={() => {
                    if (!bulkActionMode) {
                      router.push(`/portal/provider/scholars/${scholar.id}`);
                    } else {
                      const newSelected = new Set(selectedScholars);
                      if (newSelected.has(scholar.id)) {
                        newSelected.delete(scholar.id);
                      } else {
                        newSelected.add(scholar.id);
                      }
                      setSelectedScholars(newSelected);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}


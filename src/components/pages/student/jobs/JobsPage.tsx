/**
 * LinkedIn-style Jobs & Opportunities Page
 * Two-pane layout: Job listings on left, details on right
 * Fully functional with search, filters, and actions
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Building2,
  Filter,
  X,
  Bookmark,
  BookmarkCheck,
  Share2,
  MoreVertical,
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronDown,
  Users,
  Globe,
  Copy,
  Mail,
  Linkedin,
  CheckCircle,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { mockJobs, Job, formatTimeAgo } from '@/data/mock/jobsData';
import { mockCompanyConnections } from '@/data/mock/connectionsData';
import { cn } from '@/utils';
import { ApplyModal } from './components/ApplyModal';
import { SimilarJobsSection } from './components/SimilarJobsSection';
import { JobRecommendationsSection } from './components/JobRecommendationsSection';
import { FilterBadges } from '@/components/common/ui/FilterBadges';
import { EmptyState } from '@/components/common/ui/EmptyState';
import { 
  initializeJobData, 
  fetchJobs, 
  saveJob, 
  unsaveJob, 
  isJobSaved,
  getApplicationByJobId,
  getSavedJobs,
  getApplications,
  followCompany,
  unfollowCompany,
  isCompanyFollowed,
  addSearchHistory,
  getSimilarJobs,
  getJobRecommendations
} from '@/services/jobService';
import { JobFilters, JobRecommendation } from '@/interfaces/jobs';

export function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('India');
  const [filters, setFilters] = useState({
    datePosted: 'all' as 'all' | '24h' | '7d' | '30d',
    experienceLevel: 'all' as 'all' | 'entry' | 'mid' | 'senior' | 'executive',
    company: 'all' as string,
    remote: false,
    easyApply: false,
  });
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectNote, setConnectNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'not-connected' | 'pending' | 'connected'>>({});

  // Initialize and load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Initialize localStorage
        initializeJobData();
        
        // Load jobs
        const filters: JobFilters = {};
        if (searchQuery) filters.search = searchQuery;
        if (locationQuery && locationQuery !== 'India') {
          filters.location = [locationQuery];
        }
        const jobsData = await fetchJobs(filters);
        setJobs(jobsData);
        
        // Load saved jobs
        const saved = await getSavedJobs();
        setSavedJobs(new Set(saved));
        
        // Load applied jobs
        const applications = await getApplicationByJobId(''); // Get all
        const appliedIds = new Set<string>();
        for (const job of jobsData) {
          const app = await getApplicationByJobId(job.id);
          if (app) appliedIds.add(job.id);
        }
        setAppliedJobs(appliedIds);
        
        // Set selected job
        if (jobsData.length > 0) {
          setSelectedJob(jobsData[0]);
        }
        
        // Initialize connection statuses
        const statuses: Record<string, 'not-connected' | 'pending' | 'connected'> = {};
        jobsData.forEach(job => {
          const connection = mockCompanyConnections.find(c => c.companyName === job.company);
          if (connection) {
            statuses[job.company] = connection.status === 'connected' ? 'connected' : connection.status === 'pending' ? 'pending' : 'not-connected';
          } else {
            statuses[job.company] = 'not-connected';
          }
        });
        setConnectionStatus(statuses);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Load jobs when filters change
  useEffect(() => {
    const loadFilteredJobs = async () => {
      const jobFilters: JobFilters = {};
      if (searchQuery) jobFilters.search = searchQuery;
      if (locationQuery && locationQuery !== 'India') {
        jobFilters.location = [locationQuery];
      }
      if (filters.datePosted && filters.datePosted !== 'all') {
        jobFilters.datePosted = filters.datePosted === '24h' ? '24h' : 
                           filters.datePosted === '7d' ? '7d' : '30d';
      }
      if (filters.experienceLevel && filters.experienceLevel !== 'all') {
        jobFilters.experienceLevel = [filters.experienceLevel];
      }
      if (filters.remote) jobFilters.remote = true;
      
      const jobsData = await fetchJobs(jobFilters);
      setJobs(jobsData);
      
      // Add to search history
      if (searchQuery) {
        await addSearchHistory(searchQuery, jobFilters, jobsData.length);
      }
      
      // Update selected job
      if (jobsData.length > 0) {
        const currentSelected = selectedJob ? jobsData.find(j => j.id === selectedJob.id) : null;
        setSelectedJob(currentSelected || jobsData[0]);
      } else {
        setSelectedJob(null);
      }
    };
    
    loadFilteredJobs();
  }, [searchQuery, locationQuery, filters]);

  // Close all dropdowns when clicking outside or navigating
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Close dropdowns if clicking outside - use setTimeout to allow dropdown clicks
      setTimeout(() => {
        if (!target.closest('[data-dropdown]') && !target.closest('[data-dropdown-trigger]')) {
          setShowDateDropdown(false);
          setShowExperienceDropdown(false);
          setShowCompanyDropdown(false);
          setShowShareMenu(false);
          setShowMoreMenu(false);
        }
      }, 0);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDateDropdown(false);
        setShowExperienceDropdown(false);
        setShowCompanyDropdown(false);
        setShowShareMenu(false);
        setShowMoreMenu(false);
      }
    };

    // Close dropdowns on browser back/forward
    const handlePopState = () => {
      setShowDateDropdown(false);
      setShowExperienceDropdown(false);
      setShowCompanyDropdown(false);
      setShowShareMenu(false);
      setShowMoreMenu(false);
    };

    // Use click event instead of mousedown for better compatibility
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Get unique companies for filter
  const companies = useMemo(() => {
    return Array.from(new Set(jobs.map(job => job.company))).sort();
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Location filter
      const matchesLocation =
        locationQuery === '' ||
        job.location.toLowerCase().includes(locationQuery.toLowerCase());

      // Date posted filter
      const matchesDate =
        filters.datePosted === 'all' ||
        (() => {
          const posted = new Date(job.postedAt);
          const now = new Date();
          const diffHours = (now.getTime() - posted.getTime()) / (1000 * 60 * 60);
          if (filters.datePosted === '24h') return diffHours <= 24;
          if (filters.datePosted === '7d') return diffHours <= 168;
          if (filters.datePosted === '30d') return diffHours <= 720;
          return true;
        })();

      // Experience level filter
      const matchesExperience =
        filters.experienceLevel === 'all' || job.experienceLevel === filters.experienceLevel;

      // Company filter
      const matchesCompany = filters.company === 'all' || job.company === filters.company;

      // Remote filter
      const matchesRemote = !filters.remote || job.remote;

      // Easy Apply filter
      const matchesEasyApply = !filters.easyApply || job.easyApply;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesDate &&
        matchesExperience &&
        matchesCompany &&
        matchesRemote &&
        matchesEasyApply
      );
    });
  }, [jobs, searchQuery, locationQuery, filters]);

  // Update selected job when filtered jobs change
  useEffect(() => {
    if (filteredJobs.length > 0 && (!selectedJob || !filteredJobs.find(j => j.id === selectedJob.id))) {
      setSelectedJob(filteredJobs[0]);
    } else if (filteredJobs.length === 0) {
      setSelectedJob(null);
    }
  }, [filteredJobs]);

  const toggleSaveJob = async (jobId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const isSaved = await isJobSaved(jobId);
    if (isSaved) {
      await unsaveJob(jobId);
      setSavedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    } else {
      await saveJob(jobId);
      setSavedJobs(prev => new Set(prev).add(jobId));
    }
  };

  const getCompanyInitials = (company: string) => {
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmitConnect = () => {
    if (!selectedJob) return;
    
    // Validate note is provided
    if (!connectNote.trim()) {
      setNoteError('Please add a note to your connection request');
      return;
    }

    if (connectNote.trim().length < 10) {
      setNoteError('Note must be at least 10 characters long');
      return;
    }

    // Create connection request
    const connectionRequest = {
      id: `comp-req-${Date.now()}`,
      fromUserId: 'current-student',
      fromUserName: 'John Doe',
      fromUserTitle: 'Student at Evolvix',
      toCompanyId: selectedJob.company.toLowerCase().replace(/\s+/g, '-'),
      toCompanyName: selectedJob.company,
      note: connectNote.trim(),
      sentAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    // Store in localStorage
    const existingRequests = JSON.parse(localStorage.getItem('companyConnectionRequests') || '[]');
    existingRequests.push(connectionRequest);
    localStorage.setItem('companyConnectionRequests', JSON.stringify(existingRequests));

    // Update connection status
    setConnectionStatus(prev => ({ ...prev, [selectedJob.company]: 'pending' }));

    // Close modal and reset
    setShowConnectModal(false);
    setConnectNote('');
    setNoteError('');

    // Show success message
    alert(`Connection request sent to ${selectedJob.company}! They will be notified and can accept your request.`);
  };

  const handleApply = (job: Job) => {
    if (appliedJobs.has(job.id)) {
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleApplicationSuccess = async () => {
    if (!selectedJob) return;
    
    // Reload applied jobs
    const app = await getApplicationByJobId(selectedJob.id);
    if (app) {
      setAppliedJobs(prev => new Set(prev).add(selectedJob.id));
    }
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleShare = (job: Job, method: 'link' | 'email' | 'linkedin') => {
    const jobUrl = `${window.location.origin}/portal/student/jobs?jobId=${job.id}`;
    
    switch (method) {
      case 'link':
        navigator.clipboard.writeText(jobUrl);
        alert('Job link copied to clipboard!');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(job.title)}&body=${encodeURIComponent(jobUrl)}`;
        break;
      case 'linkedin':
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        window.open(linkedInUrl, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filteredJobs
  };

  const dateOptions = [
    { value: 'all', label: 'All time' },
    { value: '24h', label: 'Past 24 hours' },
    { value: '7d', label: 'Past week' },
    { value: '30d', label: 'Past month' },
  ];

  const experienceOptions = [
    { value: 'all', label: 'All levels' },
    { value: 'entry', label: 'Entry level' },
    { value: 'mid', label: 'Mid level' },
    { value: 'senior', label: 'Senior level' },
    { value: 'executive', label: 'Executive' },
  ];

  return (
    <div className="h-full min-h-[calc(100vh-200px)] flex flex-col bg-card">
      {/* Search Bar */}
      <div className="border-b border-border bg-card px-4 py-3 sticky top-0 z-20">
        <form onSubmit={handleSearch} className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Title, skill or company"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationQuery}
                  onChange={e => setLocationQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="px-6"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.datePosted !== 'all' || filters.experienceLevel !== 'all' || filters.company !== 'all' || filters.remote || filters.easyApply) && (
            <div className="mt-3 px-4">
              <FilterBadges
                filters={{
                  datePosted: filters.datePosted !== 'all' ? filters.datePosted : undefined,
                  experienceLevel: filters.experienceLevel !== 'all' ? [filters.experienceLevel] : undefined,
                  company: filters.company !== 'all' ? [filters.company] : undefined,
                  remote: filters.remote || undefined,
                }}
                onRemoveFilter={(key, value) => {
                  if (key === 'datePosted') setFilters(prev => ({ ...prev, datePosted: 'all' }));
                  else if (key === 'experienceLevel') setFilters(prev => ({ ...prev, experienceLevel: 'all' }));
                  else if (key === 'company') setFilters(prev => ({ ...prev, company: 'all' }));
                  else if (key === 'remote') setFilters(prev => ({ ...prev, remote: false }));
                }}
                onClearAll={() => {
                  setFilters({
                    datePosted: 'all',
                    experienceLevel: 'all',
                    company: 'all',
                    remote: false,
                    easyApply: false,
                  });
                }}
              />
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 relative">
            <div className="relative" data-dropdown>
              <button
                data-dropdown-trigger
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1',
                  filters.datePosted !== 'all'
                    ? 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-muted dark:hover:bg-secondary'
                )}
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown);
                  setShowExperienceDropdown(false);
                  setShowCompanyDropdown(false);
                }}
              >
                Date posted <ChevronDown className={cn('w-3 h-3 transition-transform', showDateDropdown && 'rotate-180')} />
              </button>
              {showDateDropdown && (
                <>
                  <div className="fixed inset-0 z-[99]" onClick={() => setShowDateDropdown(false)} />
                  <div data-dropdown className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 z-[100] min-w-[180px]">
                    {dateOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, datePosted: option.value as any }));
                          setShowDateDropdown(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2 text-sm hover:bg-muted dark:hover:bg-secondary transition-colors text-foreground',
                          filters.datePosted === option.value && 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary font-medium'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative" data-dropdown>
              <button
                data-dropdown-trigger
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 text-muted-foreground hover:bg-muted dark:hover:bg-secondary',
                  filters.experienceLevel !== 'all' && 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary'
                )}
                onClick={() => {
                  setShowExperienceDropdown(!showExperienceDropdown);
                  setShowDateDropdown(false);
                  setShowCompanyDropdown(false);
                }}
              >
                Experience level <ChevronDown className={cn('w-3 h-3 transition-transform', showExperienceDropdown && 'rotate-180')} />
              </button>
              {showExperienceDropdown && (
                <>
                  <div className="fixed inset-0 z-[99]" onClick={() => setShowExperienceDropdown(false)} />
                  <div data-dropdown className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 z-[100] min-w-[180px]">
                    {experienceOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, experienceLevel: option.value as any }));
                          setShowExperienceDropdown(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2 text-sm hover:bg-muted dark:hover:bg-secondary transition-colors text-foreground',
                          filters.experienceLevel === option.value && 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary font-medium'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative" data-dropdown>
              <button
                data-dropdown-trigger
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 text-muted-foreground hover:bg-muted dark:hover:bg-secondary',
                  filters.company !== 'all' && 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary'
                )}
                onClick={() => {
                  setShowCompanyDropdown(!showCompanyDropdown);
                  setShowDateDropdown(false);
                  setShowExperienceDropdown(false);
                }}
              >
                Company <ChevronDown className={cn('w-3 h-3 transition-transform', showCompanyDropdown && 'rotate-180')} />
              </button>
              {showCompanyDropdown && (
                <>
                  <div className="fixed inset-0 z-[99]" onClick={() => setShowCompanyDropdown(false)} />
                  <div data-dropdown className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 z-[100] min-w-[200px] max-h-[300px] overflow-y-auto">
                    <button
                      onClick={() => {
                        setFilters(prev => ({ ...prev, company: 'all' }));
                        setShowCompanyDropdown(false);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm hover:bg-muted dark:hover:bg-secondary transition-colors text-foreground',
                        filters.company === 'all' && 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary font-medium'
                      )}
                    >
                      All Companies
                    </button>
                    {companies.map(company => (
                      <button
                        key={company}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, company }));
                          setShowCompanyDropdown(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2 text-sm hover:bg-muted dark:hover:bg-secondary transition-colors text-foreground',
                          filters.company === company && 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary font-medium'
                        )}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                filters.remote
                  ? 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-muted dark:hover:bg-secondary'
              )}
              onClick={() => setFilters(prev => ({ ...prev, remote: !prev.remote }))}
            >
              Remote
            </button>

            <button
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                filters.easyApply
                  ? 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-muted dark:hover:bg-secondary'
              )}
              onClick={() => setFilters(prev => ({ ...prev, easyApply: !prev.easyApply }))}
            >
              Easy Apply
            </button>

            <button className="px-3 py-1.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted dark:hover:bg-secondary whitespace-nowrap">
              All filters
            </button>
          </div>
        </form>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 bg-success text-success-foreground px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span>Application submitted successfully!</span>
        </div>
      )}

      {/* Main Content - Two Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Job Listings */}
        <div className="w-96 lg:w-[500px] border-r border-border overflow-y-auto bg-card">
          {/* Results Header */}
          <div className="sticky top-0 bg-card border-b border-border px-4 py-3 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {searchQuery || locationQuery !== 'India'
                    ? `${searchQuery || 'Jobs'} ${locationQuery !== 'India' ? `in ${locationQuery}` : ''}`
                    : 'All Jobs'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Set alert</span>
                <button
                  onClick={() => setAlertEnabled(!alertEnabled)}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors',
                    alertEnabled ? 'bg-gradient-to-r from-primary to-primary' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-1 w-4 h-4 bg-card rounded-full transition-transform',
                      alertEnabled && 'translate-x-5'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="divide-y divide-border">
            {filteredJobs.length === 0 ? (
              <div className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No jobs found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={cn(
                    'p-4 cursor-pointer hover:bg-muted transition-colors',
                    selectedJob?.id === job.id && 'bg-gradient-to-r from-primary/5 to-primary/5 dark:from-primary/10 dark:to-primary/10 border-l-4 border-primary'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Company Logo */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        getCompanyInitials(job.company)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-primary hover:underline cursor-pointer line-clamp-1">
                            {job.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/portal/student/jobs/company/${encodeURIComponent(job.company)}`);
                            }}
                            className="text-sm text-foreground mt-0.5 hover:text-primary hover:underline transition-colors"
                          >
                            {job.company}
                          </button>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                            {job.remote && (
                              <span className="text-primary">(Remote)</span>
                            )}
                          </p>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleSaveJob(job.id, e);
                          }}
                          className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                          title={savedJobs.has(job.id) ? 'Unsave job' : 'Save job'}
                        >
                          {savedJobs.has(job.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-primary" />
                          ) : (
                            <Bookmark className="w-5 h-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Job Meta */}
                      <div className="mt-2 space-y-1">
                        {job.reviewTime && (
                          <div className="flex items-center gap-1 text-xs text-success">
                            <CheckCircle2 className="w-3 h-3" />
                            {job.reviewTime}
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {job.viewed && (
                            <span className="text-xs text-muted-foreground">Viewed</span>
                          )}
                          {job.promoted && (
                            <span className="text-xs text-muted-foreground">Promoted</span>
                          )}
                          {job.easyApply && (
                            <span className="text-xs font-semibold text-primary">
                              Easy Apply
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Job Details */}
        <div className="flex-1 overflow-y-auto bg-card">
          {selectedJob ? (
            <div className="max-w-3xl mx-auto p-6">
              {/* Header Actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {selectedJob.companyLogo ? (
                        <img
                          src={selectedJob.companyLogo}
                          alt={selectedJob.company}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        getCompanyInitials(selectedJob.company)
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">
                        {selectedJob.title}
                      </h1>
                      <button
                        onClick={() => router.push(`/portal/student/jobs/company/${encodeURIComponent(selectedJob.company)}`)}
                        className="text-lg text-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {selectedJob.company}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground ml-20">
                    <span>{selectedJob.location}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(selectedJob.postedAt)}</span>
                    <span>•</span>
                    <span>
                      {selectedJob.applicants > 100
                        ? 'Over 100'
                        : selectedJob.applicants}{' '}
                      applicant{selectedJob.applicants !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative" data-dropdown>
                    <button
                      data-dropdown-trigger
                      onClick={() => {
                        setShowShareMenu(!showShareMenu);
                        setShowMoreMenu(false);
                      }}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="Share job"
                    >
                      <Share2 className="w-5 h-5 text-muted-foreground" />
                    </button>
                    {showShareMenu && (
                      <>
                        <div className="fixed inset-0 z-[99]" onClick={() => setShowShareMenu(false)} />
                        <div data-dropdown className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl py-1 z-[100] min-w-[180px]">
                        <button
                          onClick={() => handleShare(selectedJob, 'link')}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy link
                        </button>
                        <button
                          onClick={() => handleShare(selectedJob, 'email')}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Share via email
                        </button>
                        <button
                          onClick={() => handleShare(selectedJob, 'linkedin')}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          Share on LinkedIn
                        </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="relative" data-dropdown>
                    <button
                      data-dropdown-trigger
                      onClick={() => {
                        setShowMoreMenu(!showMoreMenu);
                        setShowShareMenu(false);
                      }}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </button>
                    {showMoreMenu && (
                      <>
                        <div className="fixed inset-0 z-[99]" onClick={() => setShowMoreMenu(false)} />
                        <div data-dropdown className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl py-1 z-[100] min-w-[200px]">
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, company: selectedJob.company }));
                            setShowMoreMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                          <Building2 className="w-4 h-4" />
                          View all jobs at {selectedJob.company}
                        </button>
                        <button
                          onClick={() => {
                            setLocationQuery(selectedJob.location.split(',')[0]);
                            setShowMoreMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          View jobs in {selectedJob.location.split(',')[0]}
                        </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mb-6">
                {appliedJobs.has(selectedJob.id) ? (
                  <Button
                    disabled
                    variant="success"
                    className="px-6 py-2.5 font-semibold cursor-not-allowed opacity-75"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Applied
                  </Button>
                ) : selectedJob.easyApply ? (
                  <Button
                    variant="primary"
                    className="px-6 py-2.5 font-semibold"
                    onClick={() => handleApply(selectedJob)}
                  >
                    Easy Apply
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="px-6 py-2.5 font-semibold"
                    onClick={() => handleApply(selectedJob)}
                  >
                    Apply
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="px-6 py-2.5"
                  onClick={() => toggleSaveJob(selectedJob.id)}
                >
                  {savedJobs.has(selectedJob.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>

              {/* Job Type Badges */}
              <div className="flex items-center gap-2 mb-6">
                {selectedJob.remote && (
                  <Badge className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    Remote
                  </Badge>
                )}
                {selectedJob.type === 'part-time' && (
                  <Badge variant="default">Part-time</Badge>
                )}
                {selectedJob.type === 'full-time' && (
                  <Badge variant="success">Full-time</Badge>
                )}
                {selectedJob.type === 'internship' && (
                  <Badge variant="warning">Internship</Badge>
                )}
                {selectedJob.type === 'contract' && (
                  <Badge variant="default">Contract</Badge>
                )}
                {selectedJob.type === 'freelance' && (
                  <Badge variant="default">Freelance</Badge>
                )}
              </div>

              {/* Profile Match Section */}
              {/* {selectedJob.matchScore && (
                <div className="bg-gradient-to-r from-[#635bff]/10 to-primary/10 dark:from-[#635bff]/20 dark:to-primary/20 border border-[#635bff]/20 dark:border-[#735fff]/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-foreground mb-2">
                        Your profile matches some required qualifications
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          Show match details
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          Tailor my resume
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          Help me update my profile
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        BETA • Is this information helpful?
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#635bff] to-primary flex items-center justify-center text-white font-bold text-sm">
                      {getCompanyInitials(selectedJob.company)}
                    </div>
                  </div>
                </div>
              )} */}

              {/* Job Description */}
              <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {selectedJob.fullDescription || selectedJob.description}
                </div>
              </div>

              {/* Similar Jobs */}
              {selectedJob && (
                <SimilarJobsSection jobId={selectedJob.id} onJobSelect={setSelectedJob} />
              )}

              {/* Company Info */}
              <div className="pt-8 border-t border-border">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#635bff] to-primary flex items-center justify-center text-white font-bold text-lg">
                    {getCompanyInitials(selectedJob.company)}
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={() => router.push(`/portal/student/jobs/company/${encodeURIComponent(selectedJob.company)}`)}
                      className="text-lg font-semibold text-foreground mb-1 hover:text-primary hover:underline transition-colors"
                    >
                      {selectedJob.company}
                    </button>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {selectedJob.companyInfo.followers.toLocaleString()} followers
                      </span>
                      <span>•</span>
                      <span>{selectedJob.companyInfo.employees}</span>
                      <span>•</span>
                      <span>{selectedJob.companyInfo.industry}</span>
                    </div>
                    <p className="text-sm text-foreground mb-3">
                      {selectedJob.companyInfo.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-primary text-primary hover:bg-primary/10"
                        onClick={() => setShowConnectModal(true)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                      {selectedJob.companyInfo.website && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => window.open(selectedJob.companyInfo.website, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit website
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Briefcase className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Select a job to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connect Modal */}
      {selectedJob && (
        <Modal
          isOpen={showConnectModal}
          onClose={() => {
            setShowConnectModal(false);
            setConnectNote('');
            setNoteError('');
          }}
          title="Connect with Company"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-secondary rounded-lg">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#635bff] to-primary flex items-center justify-center text-white font-bold text-xl">
                {getCompanyInitials(selectedJob.company)}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedJob.company}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedJob.companyInfo.industry}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Add a note <span className="text-red-500">*</span>
              </label>
              <textarea
                value={connectNote}
                onChange={e => {
                  setConnectNote(e.target.value);
                  if (noteError) setNoteError('');
                }}
                placeholder="Hi! I'm interested in learning more about your company and opportunities..."
                rows={4}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors",
                  noteError
                    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-300 dark:border-border focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
                )}
              />
              {noteError ? (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  {noteError}
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  A personalized note increases the chance of your request being accepted (minimum 10 characters)
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConnectModal(false);
                  setConnectNote('');
                  setNoteError('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitConnect}
                disabled={!connectNote.trim() || connectNote.trim().length < 10}
                className={cn(
                  "flex-1",
                  (!connectNote.trim() || connectNote.trim().length < 10) && "opacity-50 cursor-not-allowed"
                )}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Modal */}
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={selectedJob}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
}

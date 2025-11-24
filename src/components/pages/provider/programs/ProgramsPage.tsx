"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { CourseCard } from './components/CourseCard';
import { CourseFilters } from './components/CourseFilters';
import { ScholarshipSlotsWidget } from './components/ScholarshipSlotsWidget';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { providerService, courseService, Course } from '@/data/mock/providerData';

type ViewMode = 'grid' | 'list';
type CourseStatus = 'upcoming' | 'live' | 'completed' | 'all';
type ScholarshipFilter = 'with-slots' | 'without-slots' | 'all';

interface Filters {
  search: string;
  status: CourseStatus;
  scholarshipFilter: ScholarshipFilter;
  mentor?: string;
  duration?: string;
  mode?: 'recorded' | 'live' | 'hybrid' | 'all';
}

export function ProgramsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    scholarshipFilter: 'all',
    mode: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        const newProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(newProvider);
      } else {
        router.push('/auth/signin');
        return;
      }
    }

    const allCourses = courseService.getAll();
    setCourses(allCourses);
    setFilteredCourses(allCourses);
    setLoading(false);
  }, [provider, router]);

  useEffect(() => {
    let filtered = [...courses];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) => {
          const instructorName = typeof c.instructor === 'string' 
            ? c.instructor 
            : (c.instructor as any)?.name || '';
          return (
            c.title.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower) ||
            instructorName.toLowerCase().includes(searchLower)
          );
        }
      );
    }

    // Scholarship filter
    if (filters.scholarshipFilter === 'with-slots') {
      filtered = filtered.filter((c) => c.scholarshipSlotsAvailable > 0);
    } else if (filters.scholarshipFilter === 'without-slots') {
      filtered = filtered.filter((c) => c.scholarshipSlotsAvailable === 0);
    }

    setFilteredCourses(filtered);
  }, [filters, courses]);

  const totalSlots = courses.reduce((sum, c) => sum + c.scholarshipSlots, 0);
  const availableSlots = courses.reduce((sum, c) => sum + c.scholarshipSlotsAvailable, 0);
  const awardedSlots = totalSlots - availableSlots;

  if (loading) {
    return (
      <Layout title="Programs & Courses" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Programs & Courses" role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Programs & Courses</h1>
            <p className="text-muted-foreground mt-1">
              Browse courses with scholarship slots and manage program associations
            </p>
          </div>
        </div>

        {/* Scholarship Slots Widget */}
        <ScholarshipSlotsWidget
          total={totalSlots}
          available={availableSlots}
          awarded={awardedSlots}
        />

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 flex gap-2 items-center">
            <Input
              placeholder="Search courses..."
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
          <CourseFilters filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilters(false)} />
        )}

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'with-slots', 'without-slots'] as ScholarshipFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={filters.scholarshipFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, scholarshipFilter: filter })}
            >
              {filter === 'all' ? 'All Courses' : filter === 'with-slots' ? 'With Scholarships' : 'Without Scholarships'}
            </Button>
          ))}
        </div>

        {/* Courses List/Grid */}
        {filteredCourses.length === 0 ? (
          <EmptyState
            title="No courses found"
            description={
              filters.search || filters.scholarshipFilter !== 'all'
                ? 'Try adjusting your filters to see more courses.'
                : 'No courses available at the moment.'
            }
            icon={<BookOpen className="w-12 h-12 text-muted-foreground" />}
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                viewMode={viewMode}
                onClick={() => router.push(`/portal/provider/programs/${course.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}


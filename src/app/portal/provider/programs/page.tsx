"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { Input } from '@/components/common/forms/Input';
import {
  Search,
  GraduationCap,
  Users,
  Calendar,
  Eye,
  BookOpen,
} from 'lucide-react';
import { providerService, courseService, Course } from '@/data/mock/providerData';

export default function ProgramsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get or create provider
    let currentProvider = provider;
    
    if (!currentProvider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        currentProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(currentProvider);
      } else {
        router.push('/auth/signin');
        return;
      }
    }

    const allCourses = courseService.getAll();
    setCourses(allCourses);
  }, [provider, router]);

  // Helper function to safely get instructor name
  const getInstructorName = (instructor: string | any): string => {
    if (typeof instructor === 'string') {
      return instructor;
    }
    if (instructor && typeof instructor === 'object') {
      return instructor.name || instructor.title || 'Unknown';
    }
    return 'Unknown';
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Programs & Courses" role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Programs & Courses</h1>
            <p className="text-muted-foreground mt-1">
              Browse available courses and scholarship slots
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </Card>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="w-12 h-12 text-muted-foreground" />}
            title="No courses found"
            description="Try adjusting your search"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Instructor
                    </span>
                    <span className="font-medium text-foreground">
                      {getInstructorName(course.instructor)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Duration
                    </span>
                    <span className="font-medium text-foreground">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Scholarship Slots
                    </span>
                    <span className="font-medium text-primary">
                      {course.scholarshipSlotsAvailable} / {course.scholarshipSlots}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course Price</span>
                    <span className="font-medium text-foreground">
                      ₹{(course.price / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/portal/provider/programs/${course.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}


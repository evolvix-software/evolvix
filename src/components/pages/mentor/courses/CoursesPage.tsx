"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { addCourse, updateCourse, deleteCourse, setCourses } from '@/store/features/courses/coursesSlice';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Star,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Download,
  MoreVertical,
} from 'lucide-react';
import { Course, Instructor, coursesData } from '@/data/mock/coursesData';
import { CourseForm, CourseCard } from './components';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockVacancies } from '@/data/mock/vacanciesData';

export function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses.courses);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  
  // Check if creating bundle course from URL params
  const createBundle = searchParams?.get('createBundle') === 'true';
  const vacancyId = searchParams?.get('vacancyId') || undefined;
  const applicationId = searchParams?.get('applicationId') || undefined;

  // Get mentor info
  const [mentorInfo, setMentorInfo] = useState<Instructor | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorInfo({
        id: parsedData.email || 'mentor',
        name: parsedData.fullName || 'Mentor',
        title: 'Mentor',
        image: '/api/placeholder/100/100',
        rating: 0,
        studentsCount: 0,
        bio: parsedData.bio || 'Experienced mentor',
      });
    }
  }, []);

  // Load courses from coursesData.ts and merge with localStorage courses
  useEffect(() => {
    const storedCourses = localStorage.getItem('evolvix_courses');
    const mentorCourses = storedCourses ? JSON.parse(storedCourses) : [];
    
    // Merge coursesData with mentor-created courses, avoiding duplicates
    const allCourses = [...coursesData];
    mentorCourses.forEach((mentorCourse: Course) => {
      if (!allCourses.find(c => c.id === mentorCourse.id)) {
        allCourses.push(mentorCourse);
      }
    });
    
    dispatch(setCourses(allCourses));
  }, [dispatch]);

  // Check verification status
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const verificationKey = `evolvix_mentor_verification_${parsedData.email}`;
      const verificationData = localStorage.getItem(verificationKey);
      if (verificationData) {
        const verification = JSON.parse(verificationData);
        setIsVerified(verification.status === 'approved');
      }
    }
  }, []);

  // Get only courses created by this mentor
  const myCourses = courses.filter(c => c.instructor.id === mentorInfo?.id);
  
  // Filter and sort courses
  const filteredAndSortedCourses = myCourses
    .filter(course => {
      // Search filter
      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        course.courseCategory === selectedCategory ||
        (selectedCategory === 'bundle' && (course.courseCategory === 'bundle' || course.isBundleCourse));
      
      // Status filter
      const matchesStatus = selectedStatus === 'all' ||
        (selectedStatus === 'published' && (!course.courseStatus || course.courseStatus === 'published')) ||
        (selectedStatus === 'draft' && course.courseStatus === 'draft') ||
        (selectedStatus === 'pending' && course.courseStatus === 'pending-verification') ||
        (selectedStatus === 'verified' && course.courseStatus === 'verified') ||
        (selectedStatus === 'rejected' && course.courseStatus === 'rejected');
      
      // Type filter
      const matchesType = selectedType === 'all' || course.courseType === selectedType;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'enrollment':
          return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        case 'revenue':
          const aRevenue = (a.enrolledCount || 0) * (a.price || 0);
          const bRevenue = (b.enrolledCount || 0) * (b.price || 0);
          return bRevenue - aRevenue;
        case 'rating':
          return b.rating - a.rating;
        case 'completion':
          // Sort by enrollment count (higher enrollment = better completion potential)
          return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  
  // Auto-open form if creating bundle course
  useEffect(() => {
    if (createBundle && mentorInfo && !showCreateForm) {
      setShowCreateForm(true);
      setEditingCourse(null);
    }
  }, [createBundle, mentorInfo, showCreateForm]);
  
  // Get vacancy info if creating bundle course
  const vacancy = vacancyId ? mockVacancies.find(v => v.id === vacancyId) : null;

  // TODO: Re-enable verification check after UI is complete
  // if (!isVerified) {
  //   return (
  //     <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
  //       <CardContent className="p-6">
  //         <div className="flex items-center space-x-4">
  //           <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
  //           <div className="flex-1">
  //             <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-400 mb-2">
  //               Verification Required
  //             </h3>
  //             <p className="text-yellow-700 dark:text-yellow-300 mb-4">
  //               You must be verified to create courses. Please complete your verification in Settings.
  //             </p>
  //             <Button
  //               onClick={() => window.location.href = '/portal/mentor/settings?section=profile'}
  //               className="bg-yellow-600 hover:bg-yellow-700"
  //             >
  //               Go to Settings
  //             </Button>
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Courses</h2>
          <p className="text-slate-600 dark:text-slate-400">Create and manage courses for students</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedCourses.size > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                if (confirm(`Delete ${selectedCourses.size} course(s)?`)) {
                  selectedCourses.forEach(id => dispatch(deleteCourse(id)));
                  setSelectedCourses(new Set());
                }
              }}
              className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedCourses.size})
            </Button>
          )}
          <Button
            onClick={() => {
              setEditingCourse(null);
              setShowCreateForm(true);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              <option value="all">All Categories</option>
              <option value="crash">Crash Course</option>
              <option value="skill-focused">Skill-Focused</option>
              <option value="bootcamp">Bootcamp</option>
              <option value="bundle">Bundle</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          >
            <option value="all">All Types</option>
            <option value="live">Live</option>
            <option value="recorded">Recorded</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="enrollment">Sort by Enrollment</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="rating">Sort by Rating</option>
            <option value="completion">Sort by Completion</option>
          </select>

          {/* Results Count */}
          <div className="ml-auto text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredAndSortedCourses.length} of {myCourses.length} courses
          </div>
        </div>
      </div>

      {/* Bundle Course Info Banner */}
      {createBundle && vacancy && (
        <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Creating Course Gig for: {vacancy.title}
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Course Price: ${vacancy.adminPricing.toLocaleString()} • Your Commission: {vacancy.commissionSplit.mentor}% • Scholarship option available
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/portal/mentor/vacancies')}
                className="border-blue-300 dark:border-blue-700"
              >
                Back to Vacancies
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Creation/Edit Form */}
      {showCreateForm && mentorInfo && (
        <CourseForm
          mentorInfo={mentorInfo}
          editingCourse={editingCourse}
          isBundleCourse={createBundle}
          vacancyId={vacancyId}
          applicationId={applicationId}
          onSave={(course) => {
            if (editingCourse) {
              const { id, ...courseData } = course;
              dispatch(updateCourse({ id: editingCourse.id, ...courseData }));
            } else {
              // For bundle courses, set status to 'draft' initially
              const courseToSave = createBundle 
                ? { ...course, courseStatus: 'draft' as const }
                : course;
              dispatch(addCourse(courseToSave));
            }
            setShowCreateForm(false);
            setEditingCourse(null);
            // Clear URL params after saving
            if (createBundle) {
              router.push('/portal/mentor/courses');
            }
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingCourse(null);
            if (createBundle) {
              router.push('/portal/mentor/vacancies');
            }
          }}
        />
      )}

      {/* My Courses List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCourses.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card className="border border-slate-200 dark:border-slate-700/50">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {myCourses.length === 0 ? 'No courses yet' : 'No courses match your filters'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {myCourses.length === 0 
                    ? 'Create your first course to start teaching students'
                    : 'Try adjusting your search or filter criteria'}
                </p>
                {myCourses.length === 0 ? (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setSelectedType('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Bulk Selection Checkbox */}
            {filteredAndSortedCourses.length > 0 && (
              <div className="md:col-span-2 lg:col-span-3 flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedCourses.size === filteredAndSortedCourses.length && filteredAndSortedCourses.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCourses(new Set(filteredAndSortedCourses.map(c => c.id)));
                    } else {
                      setSelectedCourses(new Set());
                    }
                  }}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Select all ({selectedCourses.size} selected)
                </span>
              </div>
            )}
            
            {filteredAndSortedCourses.map((course) => (
              <div key={course.id} className="relative">
                <input
                  type="checkbox"
                  checked={selectedCourses.has(course.id)}
                  onChange={(e) => {
                    const newSelected = new Set(selectedCourses);
                    if (e.target.checked) {
                      newSelected.add(course.id);
                    } else {
                      newSelected.delete(course.id);
                    }
                    setSelectedCourses(newSelected);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 left-2 z-10 w-5 h-5 rounded border-slate-300 bg-white dark:bg-slate-800"
                />
                <CourseCard
                  course={course}
                  onEdit={() => {
                    setEditingCourse(course);
                    setShowCreateForm(true);
                  }}
                  onDelete={() => {
                    if (confirm('Are you sure you want to delete this course?')) {
                      dispatch(deleteCourse(course.id));
                    }
                  }}
                  onManageProjects={() => {
                    router.push(`/portal/mentor/courses/${course.id}`);
                  }}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

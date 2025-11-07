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
} from 'lucide-react';
import { Course, Instructor, coursesData } from '@/data/mock/coursesData';
import { CourseForm, CourseCard } from './components';
import { useRouter } from 'next/navigation';

export function CoursesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses.courses);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Courses</h2>
          <p className="text-slate-600 dark:text-slate-400">Create and manage courses for students</p>
        </div>
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

      {/* Course Creation/Edit Form */}
      {showCreateForm && mentorInfo && (
        <CourseForm
          mentorInfo={mentorInfo}
          editingCourse={editingCourse}
          onSave={(course) => {
            if (editingCourse) {
              const { id, ...courseData } = course;
              dispatch(updateCourse({ id: editingCourse.id, ...courseData }));
            } else {
              dispatch(addCourse(course));
            }
            setShowCreateForm(false);
            setEditingCourse(null);
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      {/* My Courses List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card className="border border-slate-200 dark:border-slate-700/50">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No courses yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Create your first course to start teaching students
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          myCourses.map((course) => (
            <CourseCard
              key={course.id}
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
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { useAppSelector } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { X, Save, Plus, Trash2, Upload, FileText, Video, FileQuestion, Clock, Calendar, ChevronLeft, ChevronRight, CheckCircle2, BookOpen, FolderTree, Settings as SettingsIcon, Eye, Image as ImageIcon } from 'lucide-react';
import { Course, Instructor, Module, CourseSchedule, Lesson, VideoTimestamp, LessonAssignment, LessonTest, CourseProject, Prerequisite } from '@/data/mock/coursesData';
import { ProjectsConfig } from '@/components/common/projects/ProjectsConfig';

interface CourseFormProps {
  mentorInfo: Instructor;
  editingCourse: Course | null;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const STEPS = [
  { id: 1, title: 'Basic Info', icon: BookOpen, description: 'Course details' },
  { id: 2, title: 'Schedule', icon: Calendar, description: 'Timing & preferences' },
  { id: 3, title: 'Content', icon: FolderTree, description: 'Modules & lessons' },
  { id: 4, title: 'Projects', icon: FileText, description: 'Project configuration' },
  { id: 5, title: 'Settings', icon: SettingsIcon, description: 'Additional settings' },
  { id: 6, title: 'Review', icon: Eye, description: 'Review & submit' },
];

export function CourseForm({ mentorInfo, editingCourse, onSave, onCancel }: CourseFormProps) {
  const allCourses = useAppSelector((state) => state.courses.courses);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [courseType, setCourseType] = useState<'live' | 'recorded'>(editingCourse?.courseType || 'recorded');
  
  const [formData, setFormData] = useState({
    title: editingCourse?.title || '',
    description: editingCourse?.description || '',
    shortDescription: editingCourse?.shortDescription || '',
    category: (editingCourse?.category || 'development') as 'development' | 'design' | 'business' | 'data-science' | 'other',
    level: (editingCourse?.level || 'beginner') as 'beginner' | 'intermediate' | 'advanced',
    skills: editingCourse?.skills.join(', ') || '',
    price: editingCourse?.price || 0,
    scholarshipAvailable: editingCourse?.scholarshipAvailable || false,
    language: editingCourse?.language || 'English',
    duration: editingCourse?.duration || '10 hours',
    requirements: editingCourse?.requirements.join('\n') || '',
    allowStudentPreferences: editingCourse?.allowStudentPreferences || false,
    image: editingCourse?.image || '',
    thumbnail: editingCourse?.thumbnail || '',
  });

  // Image file states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editingCourse?.image || '');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(editingCourse?.thumbnail || '');

  // Prerequisites state
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>(
    editingCourse?.prerequisites || []
  );

  // Schedule for live courses
  const [schedule, setSchedule] = useState<CourseSchedule>(editingCourse?.schedule || {
    frequency: 'weekly',
    days: [],
    time: '10:00',
    duration: 60,
    startDate: '',
    endDate: '',
    admissionDeadline: '',
  });

  // Projects state
  const [projects, setProjects] = useState<CourseProject[]>(editingCourse?.projects || []);
  const [enableSundayDoubtClearing, setEnableSundayDoubtClearing] = useState(editingCourse?.enableSundayDoubtClearing || false);

  const [modules, setModules] = useState<Array<{
    id: string;
    title: string;
    description: string;
    documentation: File | null;
    documentationUrl: string;
    lessons: Array<{
      id: string;
      title: string;
      videoFile: File | null;
      videoUrl: string;
      timestamps: VideoTimestamp[];
      assignment: LessonAssignment | null;
      test: LessonTest | null;
      liveSessionLink?: string;
      content?: string;
    }>;
  }>>(editingCourse?.modules.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    documentation: null,
    documentationUrl: '',
    lessons: m.lessons.map(l => ({
      id: l.id,
      title: l.title,
      videoFile: null,
      videoUrl: l.videoUrl || '',
      timestamps: l.timestamps || [],
      assignment: l.assignment || null,
      test: l.test || null,
      liveSessionLink: l.liveSessionLink || '',
      content: l.content || '',
    })),
  })) || []);

  const addModule = () => {
    setModules([...modules, {
      id: `module_${Date.now()}`,
      title: '',
      description: '',
      documentation: null,
      documentationUrl: '',
      lessons: [{
        id: `lesson_${Date.now()}`,
        title: '',
        videoFile: null,
        videoUrl: '',
        timestamps: [],
        assignment: null,
        test: null,
        liveSessionLink: '',
        content: '',
      }],
    }]);
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const updateModule = (moduleId: string, field: string, value: any) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, [field]: value };
      }
      return m;
    }));
  };

  const addLesson = (moduleId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, {
            id: `lesson_${Date.now()}`,
            title: '',
            videoFile: null,
            videoUrl: '',
            timestamps: [],
            assignment: null,
            test: null,
            liveSessionLink: '',
            content: '',
          }],
        };
      }
      return m;
    }));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    }));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: string, value: any) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lessonId) {
              return { ...l, [field]: value };
            }
            return l;
          }),
        };
      }
      return m;
    }));
  };

  const addTimestamp = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lessonId) {
              return {
                ...l,
                timestamps: [...l.timestamps, { id: `ts_${Date.now()}`, title: '', timestamp: 0 }],
              };
            }
            return l;
          }),
        };
      }
      return m;
    }));
  };

  const updateTimestamp = (moduleId: string, lessonId: string, timestampId: string, field: string, value: any) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lessonId) {
              return {
                ...l,
                timestamps: l.timestamps.map(ts => {
                  if (ts.id === timestampId) {
                    return { ...ts, [field]: value };
                  }
                  return ts;
                }),
              };
            }
            return l;
          }),
        };
      }
      return m;
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.shortDescription && formData.description && formData.category && formData.level);
      case 2:
        if (courseType === 'live') {
          return !!(schedule.frequency && schedule.time && schedule.duration && (schedule.frequency === 'daily' || (schedule.days && schedule.days.length > 0)));
        }
        return true;
      case 3:
        return modules.length > 0 && modules.every(m => m.title && m.description && m.lessons.length > 0 && m.lessons.every(l => l.title));
      case 4:
        return true; // Projects are optional
      case 5:
        return true; // Settings are optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Allow clicking on completed steps or next step
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step);
    }
  };

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle thumbnail file upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        setFormData({ ...formData, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding prerequisite
  const addPrerequisite = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course && !prerequisites.find(p => p.id === courseId)) {
      setPrerequisites([
        ...prerequisites,
        {
          id: course.id,
          title: course.title,
          description: course.shortDescription,
          completed: false,
        },
      ]);
    }
  };

  // Handle removing prerequisite
  const removePrerequisite = (prerequisiteId: string) => {
    setPrerequisites(prerequisites.filter(p => p.id !== prerequisiteId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newModules: Module[] = modules.map(m => ({
      id: m.id,
      courseId: editingCourse?.id || `course_${Date.now()}`,
      title: m.title,
      description: m.description,
      lessons: m.lessons.map(l => ({
        id: l.id,
        moduleId: m.id,
        title: l.title,
        duration: '0 min',
        type: courseType === 'recorded' ? 'video' as const : 'video' as const,
        videoUrl: courseType === 'recorded' ? l.videoUrl : undefined,
        videoFile: courseType === 'recorded' ? (l.videoFile || undefined) : undefined,
        timestamps: courseType === 'recorded' ? l.timestamps : undefined,
        assignment: l.assignment || undefined, // Available for both recorded and live courses
        test: courseType === 'recorded' ? (l.test || undefined) : undefined,
        liveSessionLink: courseType === 'live' ? (l.liveSessionLink || undefined) : undefined,
        content: courseType === 'live' ? (l.content || undefined) : undefined,
      })),
    }));

    const newCourse: Course = {
      id: editingCourse?.id || `course_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      instructor: mentorInfo,
      category: formData.category,
      level: formData.level,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      price: formData.price,
      scholarshipAvailable: formData.scholarshipAvailable,
      language: formData.language,
      duration: formData.duration,
      requirements: formData.requirements.split('\n').filter(Boolean),
      modules: newModules,
      rating: editingCourse?.rating || 0,
      image: formData.image || imagePreview || '',
      thumbnail: formData.thumbnail || thumbnailPreview || '',
      ratingCount: editingCourse?.ratingCount || 0,
      prerequisites: prerequisites,
      enrolledCount: editingCourse?.enrolledCount || 0,
      createdAt: editingCourse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      courseType,
      schedule: courseType === 'live' ? schedule : undefined,
      allowStudentPreferences: courseType === 'live' ? formData.allowStudentPreferences : undefined,
      projects: projects.length > 0 ? projects : undefined,
      enableSundayDoubtClearing: courseType === 'recorded' ? enableSundayDoubtClearing : undefined,
      doubtClearingSessions: courseType === 'recorded' ? (editingCourse?.doubtClearingSessions || []) : undefined,
    };

    onSave(newCourse);
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Course Basic Information</h3>
              <p className="text-slate-600 dark:text-slate-400">Let's start with the essential details about your course</p>
            </div>

            <div>
              <Label htmlFor="courseType" className="mb-2 block text-base font-semibold">Course Type *</Label>
              <select
                id="courseType"
                value={courseType}
                onChange={(e) => setCourseType(e.target.value as 'live' | 'recorded')}
                className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                required
              >
                <option value="recorded">Recorded Course (Pre-built with videos, assignments, tests)</option>
                <option value="live">Live Course (Daily/Weekly sessions, create classes after enrollment)</option>
              </select>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {courseType === 'recorded' 
                  ? 'Upload videos, add timestamps, assignments, and tests. Students purchase and complete at their pace.'
                  : 'Set schedule preferences. After students enroll, you can create classes based on their preferences.'}
              </p>
            </div>

            <div>
              <Label htmlFor="title" className="mb-2 block text-base font-semibold">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="e.g., Complete React Development Masterclass"
              />
            </div>

            <div>
              <Label htmlFor="shortDescription" className="mb-2 block text-base font-semibold">Short Description *</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Brief description (for course cards)"
                maxLength={150}
              />
              <p className="mt-1 text-xs text-slate-500">{formData.shortDescription.length}/150</p>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block text-base font-semibold">Full Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Detailed course description..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="mb-2 block text-base font-semibold">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  required
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="data-science">Data Science</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="level" className="mb-2 block text-base font-semibold">Level *</Label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <Label htmlFor="price" className="mb-2 block text-base font-semibold">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  min={0}
                  step={0.01}
                />
              </div>

              <div>
                <Label htmlFor="duration" className="mb-2 block text-base font-semibold">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="e.g., 10 hours"
                />
              </div>

              <div>
                <Label htmlFor="language" className="mb-2 block text-base font-semibold">Language *</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="e.g., English"
                />
              </div>

              <div>
                <Label htmlFor="skills" className="mb-2 block text-base font-semibold">Skills (comma-separated) *</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="e.g., React, JavaScript, Node.js"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="requirements" className="mb-2 block text-base font-semibold">Requirements (one per line)</Label>
              <textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Basic knowledge of JavaScript&#10;Familiarity with HTML/CSS"
              />
            </div>

            {/* Course Image Upload */}
            <div>
              <Label className="mb-2 block text-base font-semibold">Course Image</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-3 px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <Input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="Or enter image URL"
                    className="flex-1 px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                {(imagePreview || formData.image) && (
                  <div className="relative w-full h-48 border-2 border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={imagePreview || formData.image}
                      alt="Course preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData({ ...formData, image: '' });
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Course Thumbnail Upload */}
            <div>
              <Label className="mb-2 block text-base font-semibold">Course Thumbnail</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-3 px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload Thumbnail</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                  <Input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => {
                      setFormData({ ...formData, thumbnail: e.target.value });
                      setThumbnailPreview(e.target.value);
                    }}
                    placeholder="Or enter thumbnail URL"
                    className="flex-1 px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                {(thumbnailPreview || formData.thumbnail) && (
                  <div className="relative w-48 h-32 border-2 border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={thumbnailPreview || formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {thumbnailPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailPreview('');
                          setFormData({ ...formData, thumbnail: '' });
                          setThumbnailFile(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <Label className="mb-2 block text-base font-semibold">Prerequisites (Other Courses)</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Select courses that students should complete before enrolling in this course
              </p>
              <div className="space-y-3">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addPrerequisite(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                >
                  <option value="">Select a course to add as prerequisite...</option>
                  {allCourses
                    .filter(c => c.id !== editingCourse?.id && !prerequisites.find(p => p.id === c.id))
                    .map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.level})
                      </option>
                    ))}
                </select>
                {prerequisites.length > 0 && (
                  <div className="space-y-2">
                    {prerequisites.map((prereq) => (
                      <div
                        key={prereq.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">{prereq.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{prereq.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePrerequisite(prereq.id)}
                          className="ml-4 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {prerequisites.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    No prerequisites added. Students can enroll directly.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="scholarshipAvailable"
                checked={formData.scholarshipAvailable}
                onChange={(e) => setFormData({ ...formData, scholarshipAvailable: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <Label htmlFor="scholarshipAvailable" className="cursor-pointer text-base font-medium">
                Scholarship Available
              </Label>
            </div>
          </div>
        );

      case 2:
        if (courseType === 'live') {
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Schedule Configuration
                </h3>
                <p className="text-slate-600 dark:text-slate-400">Configure your live course schedule</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-frequency" className="mb-2 block text-base font-semibold">Frequency *</Label>
                  <select
                    id="schedule-frequency"
                    value={schedule.frequency}
                    onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value as any, days: e.target.value === 'daily' ? [] : schedule.days })}
                    className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="twice-weekly">Twice Weekly</option>
                  </select>
                </div>

                {schedule.frequency !== 'daily' && (
                  <div>
                    <Label className="mb-2 block text-base font-semibold">Select Days *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {DAYS_OF_WEEK.map(day => (
                        <label key={day.value} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <input
                            type="checkbox"
                            checked={schedule.days?.includes(day.value)}
                            onChange={(e) => {
                              const days = schedule.days || [];
                              if (e.target.checked) {
                                setSchedule({ ...schedule, days: [...days, day.value] });
                              } else {
                                setSchedule({ ...schedule, days: days.filter(d => d !== day.value) });
                              }
                            }}
                            className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="schedule-time" className="mb-2 block text-base font-semibold">Default Class Time *</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={schedule.time}
                    onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="schedule-duration" className="mb-2 block text-base font-semibold">Default Duration (minutes) *</Label>
                  <Input
                    id="schedule-duration"
                    type="number"
                    value={schedule.duration}
                    onChange={(e) => setSchedule({ ...schedule, duration: parseInt(e.target.value) || 60 })}
                    className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                    min={15}
                    step={15}
                    required
                  />
                </div>
              </div>

              {/* Course Dates Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Course Dates & Enrollment</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="admission-deadline" className="mb-2 block text-base font-semibold">
                      Admission Deadline *
                    </Label>
                    <Input
                      id="admission-deadline"
                      type="date"
                      value={schedule.admissionDeadline || ''}
                      onChange={(e) => setSchedule({ ...schedule, admissionDeadline: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Last date students can enroll
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="course-start-date" className="mb-2 block text-base font-semibold">
                      Course Start Date *
                    </Label>
                    <Input
                      id="course-start-date"
                      type="date"
                      value={schedule.startDate || ''}
                      onChange={(e) => setSchedule({ ...schedule, startDate: e.target.value })}
                      min={schedule.admissionDeadline || undefined}
                      className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      When the course begins
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="course-end-date" className="mb-2 block text-base font-semibold">
                      Course End Date *
                    </Label>
                    <Input
                      id="course-end-date"
                      type="date"
                      value={schedule.endDate || ''}
                      onChange={(e) => setSchedule({ ...schedule, endDate: e.target.value })}
                      min={schedule.startDate || undefined}
                      className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      When the course concludes
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-900 dark:text-amber-300">
                    <strong>Important:</strong> Make sure the admission deadline is before the course start date. 
                    Students cannot enroll after the admission deadline.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <input
                  type="checkbox"
                  id="allowStudentPreferences"
                  checked={formData.allowStudentPreferences}
                  onChange={(e) => setFormData({ ...formData, allowStudentPreferences: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <Label htmlFor="allowStudentPreferences" className="cursor-pointer text-base font-medium text-blue-900 dark:text-blue-300">
                  Allow students to choose their preferred schedule (Sat/Sun, etc.)
                </Label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  <strong>Note:</strong> After students enroll, you can create classes in the "Classes" section. 
                  Classes will be linked to this course and you can schedule them based on student preferences.
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Schedule Configuration</h3>
              <p className="text-slate-600 dark:text-slate-400">This step is optional for recorded courses</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">Recorded courses don't require schedule configuration. Students can access content at their own pace.</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Course Modules & Lessons</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {courseType === 'live' 
                    ? 'Structure your course content. Lessons can reference live sessions or include materials.'
                    : 'Add modules with video lessons, assignments, and tests.'}
                </p>
              </div>
              <Button type="button" onClick={addModule} size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400 mb-4 text-lg font-medium">No modules added yet</p>
                <Button type="button" onClick={addModule} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Module
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {modules.map((module, moduleIndex) => (
                  <Card key={module.id} className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Module {moduleIndex + 1}</h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => removeModule(module.id)}
                          className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`module-title-${module.id}`} className="mb-2 block text-base font-semibold">Module Title *</Label>
                          <Input
                            id={`module-title-${module.id}`}
                            value={module.title}
                            onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                            placeholder="e.g., Introduction to React"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`module-description-${module.id}`} className="mb-2 block text-base font-semibold">Module Description *</Label>
                          <textarea
                            id={`module-description-${module.id}`}
                            value={module.description}
                            onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                            required
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                            placeholder="Describe what students will learn in this module..."
                          />
                        </div>
                        <div>
                          <Label htmlFor={`module-doc-${module.id}`} className="mb-2 block text-base font-semibold">Module Documentation</Label>
                          <label
                            htmlFor={`module-doc-${module.id}`}
                            className="flex items-center space-x-3 px-4 py-3 border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors inline-block"
                          >
                            <Upload className="w-5 h-5" />
                            <span className="text-sm font-medium">Upload PDF/DOC</span>
                            <input
                              id={`module-doc-${module.id}`}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) updateModule(module.id, 'documentation', file);
                              }}
                              className="hidden"
                            />
                          </label>
                          {module.documentation && (
                            <span className="ml-3 text-sm text-slate-600 dark:text-slate-400 flex items-center mt-2">
                              <FileText className="w-4 h-4 mr-2" />
                              {module.documentation.name}
                            </span>
                          )}
                        </div>

                        {/* Lessons Section */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-base font-semibold">Lessons</Label>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addLesson(module.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Lesson
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <Card key={lesson.id} className="border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <h5 className="font-semibold text-slate-900 dark:text-white">
                                      Lesson {lessonIndex + 1}: {lesson.title || 'Untitled Lesson'}
                                    </h5>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeLesson(module.id, lesson.id)}
                                      className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="mb-2 block text-sm font-semibold">Lesson Title *</Label>
                                      <Input
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder={courseType === 'live' ? "e.g., Introduction to React (Live Session)" : "e.g., Getting Started with React"}
                                      />
                                    </div>
                                    
                                    {courseType === 'recorded' ? (
                                      <>
                                        <div>
                                          <Label className="mb-2 block text-sm font-semibold">Video Upload *</Label>
                                          <label className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors inline-block">
                                            <Video className="w-4 h-4" />
                                            <span className="text-sm">Upload Video</span>
                                            <input
                                              type="file"
                                              accept="video/*"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) updateLesson(module.id, lesson.id, 'videoFile', file);
                                              }}
                                              className="hidden"
                                            />
                                          </label>
                                          {lesson.videoUrl && (
                                            <span className="ml-3 text-sm text-slate-600 dark:text-slate-400">Video uploaded</span>
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          <Label className="mb-2 block text-sm font-semibold">Live Session Link (Optional)</Label>
                                          <Input
                                            value={lesson.liveSessionLink || ''}
                                            onChange={(e) => updateLesson(module.id, lesson.id, 'liveSessionLink', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            placeholder="Zoom/Jitsi link or reference to live session"
                                          />
                                        </div>
                                        <div>
                                          <Label className="mb-2 block text-sm font-semibold">Lesson Content/Materials</Label>
                                          <textarea
                                            value={lesson.content || ''}
                                            onChange={(e) => updateLesson(module.id, lesson.id, 'content', e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                                            placeholder="Add lesson description, materials, or notes for students..."
                                          />
                                        </div>
                                      </>
                                    )}
                                    {/* Video Timestamps (Recorded Only) */}
                                    {courseType === 'recorded' && (
                                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                          <Label className="text-sm font-medium">Video Timestamps</Label>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => addTimestamp(module.id, lesson.id)}
                                            className="text-xs"
                                          >
                                            <Clock className="w-3 h-3 mr-1" />
                                            Add Timestamp
                                          </Button>
                                        </div>
                                        <div className="space-y-2">
                                          {lesson.timestamps.map((ts) => (
                                            <div key={ts.id} className="flex items-center space-x-2 text-sm">
                                              <Input
                                                type="text"
                                                value={ts.title}
                                                onChange={(e) => updateTimestamp(module.id, lesson.id, ts.id, 'title', e.target.value)}
                                                placeholder="Timestamp title"
                                                className="flex-1 px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                              />
                                              <Input
                                                type="number"
                                                value={ts.timestamp}
                                                onChange={(e) => updateTimestamp(module.id, lesson.id, ts.id, 'timestamp', parseInt(e.target.value) || 0)}
                                                placeholder="Seconds"
                                                className="w-24 px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {/* Assignment/Task - Available for both Recorded and Live courses */}
                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                          <Label className="text-sm font-medium flex items-center">
                                            <FileQuestion className="w-4 h-4 mr-1" />
                                            Assignment / Task
                                          </Label>
                                          <div className="flex items-center space-x-2">
                                            {lesson.assignment && (
                                              <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                  updateLesson(module.id, lesson.id, 'assignment', null);
                                                }}
                                                className="text-xs text-red-600 dark:text-red-400"
                                              >
                                                <Trash2 className="w-3 h-3 mr-1" />
                                                Remove
                                              </Button>
                                            )}
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                updateLesson(module.id, lesson.id, 'assignment', {
                                                  id: `assignment_${Date.now()}`,
                                                  title: '',
                                                  description: '',
                                                  maxScore: 100,
                                                  dueDate: '',
                                                  files: [],
                                                });
                                              }}
                                              className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                                            >
                                              {lesson.assignment ? <FileQuestion className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                                              {lesson.assignment ? 'Edit Task' : 'Add Task'}
                                            </Button>
                                          </div>
                                        </div>
                                        {lesson.assignment && (
                                          <div className="space-y-3 mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="space-y-2">
                                              <div>
                                                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                                                  Task Title *
                                                </Label>
                                                <Input
                                                  value={lesson.assignment.title}
                                                  onChange={(e) => {
                                                    const assignment = { ...lesson.assignment!, title: e.target.value };
                                                    updateLesson(module.id, lesson.id, 'assignment', assignment);
                                                  }}
                                                  placeholder="e.g., Build a Todo App"
                                                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                                />
                                              </div>
                                              
                                              <div>
                                                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                                                  Task Description / Instructions *
                                                </Label>
                                                <textarea
                                                  value={lesson.assignment.description}
                                                  onChange={(e) => {
                                                    const assignment = { ...lesson.assignment!, description: e.target.value };
                                                    updateLesson(module.id, lesson.id, 'assignment', assignment);
                                                  }}
                                                  rows={4}
                                                  placeholder="Describe what students need to do. Include step-by-step instructions, requirements, and expected deliverables..."
                                                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                                                />
                                              </div>

                                              <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                                                    Due Date (Optional)
                                                  </Label>
                                                  <Input
                                                    type="date"
                                                    value={lesson.assignment.dueDate || ''}
                                                    onChange={(e) => {
                                                      const assignment = { ...lesson.assignment!, dueDate: e.target.value };
                                                      updateLesson(module.id, lesson.id, 'assignment', assignment);
                                                    }}
                                                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                                  />
                                                </div>
                                                
                                                <div>
                                                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                                                    Maximum Score *
                                                  </Label>
                                                  <Input
                                                    type="number"
                                                    value={lesson.assignment.maxScore}
                                                    onChange={(e) => {
                                                      const assignment = { ...lesson.assignment!, maxScore: parseInt(e.target.value) || 100 };
                                                      updateLesson(module.id, lesson.id, 'assignment', assignment);
                                                    }}
                                                    placeholder="100"
                                                    min={1}
                                                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                                  />
                                                </div>
                                              </div>

                                              <div>
                                                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                                                  Reference Files / Resources (Optional)
                                                </Label>
                                                <label className="flex items-center space-x-2 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                  <Upload className="w-4 h-4" />
                                                  <span className="text-xs font-medium">Upload Reference Files</span>
                                                  <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => {
                                                      const files = Array.from(e.target.files || []);
                                                      const assignment = { 
                                                        ...lesson.assignment!, 
                                                        files: [...(lesson.assignment?.files || []), ...files]
                                                      };
                                                      updateLesson(module.id, lesson.id, 'assignment', assignment);
                                                    }}
                                                    className="hidden"
                                                  />
                                                </label>
                                                {lesson.assignment.files && lesson.assignment.files.length > 0 && (
                                                  <div className="mt-2 space-y-1">
                                                    {lesson.assignment.files.map((file, idx) => (
                                                      <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                                        <div className="flex items-center space-x-2">
                                                          <FileText className="w-3 h-3 text-slate-500" />
                                                          <span className="text-xs text-slate-700 dark:text-slate-300">{file.name}</span>
                                                        </div>
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            const assignment = {
                                                              ...lesson.assignment!,
                                                              files: lesson.assignment!.files!.filter((_, i) => i !== idx)
                                                            };
                                                            updateLesson(module.id, lesson.id, 'assignment', assignment);
                                                          }}
                                                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                                        >
                                                          <X className="w-3 h-3" />
                                                        </button>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    {/* Test (Recorded Only) */}
                                    {courseType === 'recorded' && (
                                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                          <Label className="text-sm font-medium">Test/Quiz</Label>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                              updateLesson(module.id, lesson.id, 'test', {
                                                id: `test_${Date.now()}`,
                                                title: '',
                                                questions: [],
                                                passingScore: 70,
                                              });
                                            }}
                                            className="text-xs"
                                          >
                                            {lesson.test ? 'Edit' : 'Add'} Test
                                          </Button>
                                        </div>
                                        {lesson.test && (
                                          <div className="space-y-2 mt-2">
                                            <Input
                                              value={lesson.test.title}
                                              onChange={(e) => {
                                                const test = { ...lesson.test!, title: e.target.value };
                                                updateLesson(module.id, lesson.id, 'test', test);
                                              }}
                                              placeholder="Test title"
                                              className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            />
                                            <Input
                                              type="number"
                                              value={lesson.test.passingScore}
                                              onChange={(e) => {
                                                const test = { ...lesson.test!, passingScore: parseInt(e.target.value) || 70 };
                                                updateLesson(module.id, lesson.id, 'test', test);
                                              }}
                                              placeholder="Passing score (%)"
                                              className="w-32 px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Projects Configuration</h3>
              <p className="text-slate-600 dark:text-slate-400">Define projects that students will complete during the course</p>
            </div>
            <ProjectsConfig
              projects={projects}
              onProjectsChange={setProjects}
              courseDuration={formData.duration}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Additional Settings</h3>
              <p className="text-slate-600 dark:text-slate-400">Configure additional course features</p>
            </div>
            
            {courseType === 'recorded' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white flex items-center mb-1">
                      <Calendar className="w-5 h-5 mr-2" />
                      Sunday Doubt Clearing Sessions
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Enable weekly doubt clearing sessions on Sundays for enrolled students
                    </p>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableSundayDoubtClearing}
                      onChange={(e) => setEnableSundayDoubtClearing(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable</span>
                  </label>
                </div>
                {enableSundayDoubtClearing && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      <strong>Note:</strong> You can schedule Sunday doubt clearing sessions in the Classes section after students enroll in this course.
                      These sessions will be available to all enrolled students.
                    </p>
                  </div>
                )}
              </div>
            )}

            {courseType === 'live' && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
                <SettingsIcon className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">No additional settings required for live courses.</p>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review & Submit</h3>
              <p className="text-slate-600 dark:text-slate-400">Review your course details before submitting</p>
            </div>

            <div className="space-y-4">
              <Card className="border-2 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><strong>Title:</strong> {formData.title || 'Not set'}</div>
                    <div><strong>Type:</strong> {courseType === 'recorded' ? 'Recorded Course' : 'Live Course'}</div>
                    <div><strong>Category:</strong> {formData.category}</div>
                    <div><strong>Level:</strong> {formData.level}</div>
                    <div><strong>Price:</strong> ${formData.price}</div>
                    <div><strong>Duration:</strong> {formData.duration}</div>
                    <div><strong>Skills:</strong> {formData.skills}</div>
                    <div><strong>Language:</strong> {formData.language}</div>
                  </div>
                  
                  {(imagePreview || formData.image) && (
                    <div>
                      <strong>Course Image:</strong>
                      <div className="mt-2 w-full h-32 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview || formData.image}
                          alt="Course preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {(thumbnailPreview || formData.thumbnail) && (
                    <div>
                      <strong>Course Thumbnail:</strong>
                      <div className="mt-2 w-32 h-20 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                        <img
                          src={thumbnailPreview || formData.thumbnail}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {prerequisites.length > 0 && (
                    <div>
                      <strong>Prerequisites:</strong>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        {prerequisites.map((prereq) => (
                          <li key={prereq.id} className="text-slate-600 dark:text-slate-400">
                            {prereq.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {courseType === 'live' && schedule && (
                <Card className="border-2 border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Frequency:</strong> {schedule.frequency}</div>
                    {schedule.days && schedule.days.length > 0 && (
                      <div><strong>Days:</strong> {schedule.days.join(', ')}</div>
                    )}
                    <div><strong>Time:</strong> {schedule.time}</div>
                    <div><strong>Duration:</strong> {schedule.duration} minutes</div>
                    {schedule.admissionDeadline && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                        <div><strong>Admission Deadline:</strong> {schedule.admissionDeadline ? new Date(schedule.admissionDeadline).toLocaleDateString() : 'Not set'}</div>
                        <div><strong>Course Start Date:</strong> {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString() : 'Not set'}</div>
                        <div><strong>Course End Date:</strong> {schedule.endDate ? new Date(schedule.endDate).toLocaleDateString() : 'Not set'}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="border-2 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Modules:</strong> {modules.length}</div>
                  <div><strong>Total Lessons:</strong> {modules.reduce((acc, m) => acc + m.lessons.length, 0)}</div>
                  {projects.length > 0 && (
                    <div><strong>Projects:</strong> {projects.length}</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{editingCourse ? 'Edit Course' : 'Create New Course'}</CardTitle>
            <CardDescription className="mt-1">Complete all steps to create your course</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between overflow-x-auto pb-4 scrollbar-hide">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isClickable = step.id <= currentStep || completedSteps.includes(step.id - 1);

              return (
                <div key={step.id} className="flex flex-col items-center min-w-[100px] flex-1 relative z-10">
                  {/* Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div className={`hidden sm:block absolute top-6 left-1/2 h-0.5 transition-all duration-300 ${
                      isCompleted || currentStep > step.id
                        ? 'bg-green-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`} style={{ left: 'calc(50% + 24px)', width: 'calc(100% - 48px)', zIndex: 0 }} />
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isClickable}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 z-10 ${
                      isCompleted
                        ? 'bg-green-600 border-green-600 text-white shadow-lg scale-110'
                        : isActive
                        ? 'bg-green-600 border-green-600 text-white shadow-lg scale-110'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                    } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-semibold ${isActive || isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={currentStep === STEPS.length ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          <div className="min-h-[500px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handlePrevious}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            <div className="flex items-center space-x-2">
              {currentStep < STEPS.length && (
                <Button
                  type="button"
                  onClick={() => {
                    if (validateStep(currentStep)) {
                      handleNext();
                    } else {
                      alert('Please complete all required fields before proceeding.');
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 flex items-center"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {currentStep === STEPS.length && (
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


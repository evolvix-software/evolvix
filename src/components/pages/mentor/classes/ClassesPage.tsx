"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  addClass,
  updateClass,
  deleteClass,
  setCurrentLiveClass,
  updateClassStatus,
  addRecording,
  addFeedback,
  addChatMessage,
  updateAttendance,
  MentorClass,
  ChatMessage,
  Attendance,
} from '@/store/features/classes/classesSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  Plus,
  Clock,
  Users,
  Video,
  Edit,
  Trash2,
  Play,
  MessageSquare,
  Download,
  Star,
  X,
  UserCheck,
  Share2,
  Send,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { JitsiMeetComponent } from './components';

export function ClassesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { classes, chatMessages, attendance, currentLiveClass } = useAppSelector((state) => state.classes);
  
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingClass, setEditingClass] = useState<MentorClass | null>(null);
  const [showLiveClass, setShowLiveClass] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'attendance'>('video');
  
  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    category: 'programming',
    courseId: '',
    courseName: '',
    classType: 'live' as 'recorded' | 'live' | 'one-to-one',
    videoUrl: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    recurringPattern: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    recurringEndDate: '',
    maxCapacity: undefined as number | undefined,
    agenda: [] as string[],
    preparationChecklist: [] as string[],
    preClassAnnouncement: '',
  });

  const categories = [
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'career', label: 'Career Development' },
    { value: 'other', label: 'Other' },
  ];

  // Get courses from Redux
  const allCourses = useAppSelector((state) => state.courses.courses);
  const liveCoursesWithEnrollments = allCourses.filter(c => 
    c.courseType === 'live' && c.enrolledCount > 0
  );

  useEffect(() => {
    if (currentLiveClass) {
      setShowLiveClass(currentLiveClass);
    }
  }, [currentLiveClass]);


  const upcomingClasses = classes.filter(c => c.status === 'upcoming').sort((a, b) => 
    new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
  );
  const pastClasses = classes.filter(c => c.status === 'past').sort((a, b) => 
    new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
  );

  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseId) {
      alert('Please select a course to link this class to.');
      return;
    }

    const selectedCourse = allCourses.find(c => c.id === formData.courseId);
    if (!selectedCourse) {
      alert('Selected course not found.');
      return;
    }

    // Generate unique meeting ID and link for Jitsi
    // Using UUID-like format: evolvix-{courseId}-{timestamp}-{random}
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const classId = `class_${Date.now()}`;
    const meetingId = `evolvix-${formData.courseId}-${classId}-${randomString}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const meetingLink = `https://meet.jit.si/${meetingId}`;

    // Create mock enrolled students based on course enrollment
    const mockEnrolledStudents = Array.from({ length: Math.min(selectedCourse.enrolledCount, 10) }, (_, i) => ({
      id: `student_${i + 1}`,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@example.com`,
    }));

    const newClass: MentorClass = {
      id: `class_${Date.now()}`,
      topic: formData.topic,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      category: formData.category,
      courseId: formData.courseId,
      courseName: formData.courseName,
      classType: formData.classType,
      platform: 'jitsi',
      meetingId: meetingId,
      meetingLink: meetingLink,
      enrolledStudents: mockEnrolledStudents,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      feedback: [],
      recordings: [],
      timezone: formData.timezone,
      recurringPattern: formData.recurringPattern,
      recurringEndDate: formData.recurringEndDate || undefined,
      maxCapacity: formData.maxCapacity,
      agenda: formData.agenda,
      preparationChecklist: formData.preparationChecklist,
      preClassAnnouncement: formData.preClassAnnouncement || undefined,
    };

    if (editingClass) {
      dispatch(updateClass({ ...newClass, id: editingClass.id }));
    } else {
      dispatch(addClass(newClass));
      
      // Automatically send meeting link notification to all enrolled students
      const enrollments = localStorage.getItem('evolvix_enrollments');
      if (enrollments) {
        try {
          const enrollmentList = JSON.parse(enrollments);
          const courseEnrollments = enrollmentList.filter((e: any) => e.courseId === formData.courseId);
          
          // Get student notifications from localStorage
          const studentNotifications = localStorage.getItem('evolvix_student_notifications');
          const notifications = studentNotifications ? JSON.parse(studentNotifications) : [];
          
          // Create notification for each enrolled student
          courseEnrollments.forEach((enrollment: any) => {
            const notification = {
              id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
              type: 'class_link' as const,
              classId: newClass.id,
              courseId: formData.courseId,
              courseName: formData.courseName,
              classTopic: formData.topic,
              meetingLink: meetingLink,
              meetingId: meetingId,
              date: formData.date,
              time: formData.time,
              duration: formData.duration,
              message: `New live class scheduled: "${formData.topic}" on ${formData.date} at ${formData.time}. Click to join!`,
              read: false,
              createdAt: new Date().toISOString(),
            };
            notifications.push(notification);
          });
          
          // Save notifications
          localStorage.setItem('evolvix_student_notifications', JSON.stringify(notifications));
        } catch (e) {
          console.error('Failed to send notifications to enrolled students:', e);
        }
      }
    }

    // Reset form
    setFormData({
      topic: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      category: 'programming',
      courseId: '',
      courseName: '',
      classType: 'live',
      videoUrl: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      recurringPattern: 'none',
      recurringEndDate: '',
      maxCapacity: undefined,
      agenda: [],
      preparationChecklist: [],
      preClassAnnouncement: '',
    });
    setShowScheduleForm(false);
    setEditingClass(null);
  };

  const handleStartClass = (classId: string) => {
    dispatch(setCurrentLiveClass(classId));
    dispatch(updateClassStatus({ classId, status: 'live' }));
    
    // Open Jitsi Meet in a new fullscreen window
    const classItem = classes.find(c => c.id === classId);
    if (classItem && classItem.meetingLink) {
      // Open in new window with fullscreen-like dimensions
      const width = window.screen.width;
      const height = window.screen.height;
      const left = 0;
      const top = 0;
      
      const newWindow = window.open(
        `/portal/mentor/classes/live/${classId}`,
        `jitsi-${classId}`,
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no`
      );
      
      if (newWindow) {
        // Focus the new window
        newWindow.focus();
        // Try to make it fullscreen (may require user interaction)
        if (newWindow.document) {
          newWindow.document.addEventListener('DOMContentLoaded', () => {
            // Request fullscreen after a short delay
            setTimeout(() => {
              if (newWindow.document.documentElement.requestFullscreen) {
                newWindow.document.documentElement.requestFullscreen().catch(() => {
                  // Fullscreen request failed, but window is still open
                });
              }
            }, 500);
          });
        }
      }
    } else {
      // Fallback to modal if no meeting link
      setShowLiveClass(classId);
    }
  };

  const handleEndClass = (classId: string) => {
    dispatch(updateClassStatus({ classId, status: 'past' }));
    dispatch(setCurrentLiveClass(null));
    setShowLiveClass(null);
  };

  const handleAddRecording = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    if (classItem) {
      dispatch(addRecording({
        classId,
        recording: {
          id: `rec_${Date.now()}`,
          url: `/recordings/${classId}`,
          duration: `${classItem.duration} min`,
          createdAt: new Date().toISOString(),
        },
      }));
    }
  };

  const handleDeleteClass = (classId: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      dispatch(deleteClass(classId));
    }
  };

  const handleEditClass = (classItem: MentorClass) => {
    setEditingClass(classItem);
    setFormData({
      topic: classItem.topic,
      description: classItem.description,
      date: classItem.date,
      time: classItem.time,
      duration: classItem.duration,
      category: classItem.category,
      courseId: classItem.courseId || '',
      courseName: classItem.courseName || '',
      classType: classItem.classType,
      videoUrl: classItem.videoUrl || '',
      timezone: classItem.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      recurringPattern: classItem.recurringPattern || 'none',
      recurringEndDate: classItem.recurringEndDate || '',
      maxCapacity: classItem.maxCapacity,
      agenda: classItem.agenda || [],
      preparationChecklist: classItem.preparationChecklist || [],
      preClassAnnouncement: classItem.preClassAnnouncement || '',
    });
    setShowScheduleForm(true);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !showLiveClass) return;
    
    const storedData = localStorage.getItem('evolvix_registration');
    const userData = storedData ? JSON.parse(storedData) : { fullName: 'Mentor', email: 'mentor@example.com' };
    
    dispatch(addChatMessage({
      id: `msg_${Date.now()}`,
      classId: showLiveClass,
      senderId: 'mentor',
      senderName: userData.fullName || 'Mentor',
      message: chatInput,
      timestamp: new Date().toISOString(),
    }));
    setChatInput('');
  };

  const getClassChatMessages = (classId: string) => {
    return chatMessages.filter(m => m.classId === classId);
  };

  const getClassAttendance = (classId: string) => {
    return attendance.filter(a => a.classId === classId);
  };

  const getAverageRating = (feedbacks: typeof classes[0]['feedback']) => {
    if (feedbacks.length === 0) return 0;
    return feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Classes</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Schedule and manage live classes for your courses
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingClass(null);
            setFormData({
              topic: '',
              description: '',
              date: '',
              time: '',
              duration: 60,
              category: 'programming',
              courseId: '',
              courseName: '',
              classType: 'live',
              videoUrl: '',
            });
            setShowScheduleForm(true);
          }}
          className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule New Class
        </Button>
      </div>

      {/* Schedule New Class Form */}
      {showScheduleForm && (
        <Card className="border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {editingClass ? 'Edit Class' : 'Schedule New Class'}
            </CardTitle>
            <CardDescription>
              {editingClass ? 'Update class details' : 'Create a new live class session'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitClass} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Topic *</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Introduction to React Hooks"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    min={15}
                    max={240}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="courseId">Link to Course *</Label>
                  {liveCoursesWithEnrollments.length === 0 ? (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        No live courses with enrolled students available. Please create a live course first.
                      </p>
                    </div>
                  ) : (
                    <select
                      id="courseId"
                      value={formData.courseId}
                      onChange={(e) => {
                        const selectedCourse = allCourses.find(c => c.id === e.target.value);
                        setFormData({
                          ...formData,
                          courseId: e.target.value,
                          courseName: selectedCourse?.title || '',
                        });
                      }}
                      className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                      required
                    >
                      <option value="">Select a course...</option>
                      {liveCoursesWithEnrollments.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title} ({course.enrolledCount} students)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what will be covered in this class..."
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                />
              </div>

              {/* Advanced Scheduling Options */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-white">Advanced Options</h4>
                
                {/* Timezone */}
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                  >
                    {Intl.supportedValuesOf('timeZone').slice(0, 50).map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                {/* Recurring Pattern */}
                <div>
                  <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                  <select
                    id="recurringPattern"
                    value={formData.recurringPattern}
                    onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value as any })}
                    className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                  >
                    <option value="none">No Recurrence</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {formData.recurringPattern !== 'none' && (
                  <div>
                    <Label htmlFor="recurringEndDate">Recurring End Date</Label>
                    <Input
                      id="recurringEndDate"
                      type="date"
                      value={formData.recurringEndDate}
                      onChange={(e) => setFormData({ ...formData, recurringEndDate: e.target.value })}
                      min={formData.date}
                    />
                  </div>
                )}

                {/* Max Capacity */}
                <div>
                  <Label htmlFor="maxCapacity">Max Capacity (Optional)</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    value={formData.maxCapacity || ''}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Leave empty for unlimited"
                    min={1}
                  />
                </div>

                {/* Agenda Builder */}
                <div>
                  <Label htmlFor="agenda">Class Agenda (Optional)</Label>
                  <textarea
                    id="agenda"
                    value={formData.agenda.join('\n')}
                    onChange={(e) => setFormData({ ...formData, agenda: e.target.value.split('\n').filter(item => item.trim()) })}
                    placeholder="Enter agenda items, one per line..."
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                  />
                </div>

                {/* Preparation Checklist */}
                <div>
                  <Label htmlFor="preparationChecklist">Student Preparation Checklist (Optional)</Label>
                  <textarea
                    id="preparationChecklist"
                    value={formData.preparationChecklist.join('\n')}
                    onChange={(e) => setFormData({ ...formData, preparationChecklist: e.target.value.split('\n').filter(item => item.trim()) })}
                    placeholder="Enter checklist items, one per line..."
                    rows={3}
                    className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                  />
                </div>

                {/* Pre-Class Announcement */}
                <div>
                  <Label htmlFor="preClassAnnouncement">Pre-Class Announcement (Optional)</Label>
                  <textarea
                    id="preClassAnnouncement"
                    value={formData.preClassAnnouncement}
                    onChange={(e) => setFormData({ ...formData, preClassAnnouncement: e.target.value })}
                    placeholder="Announcement to send to students before class..."
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  type="submit"
                  className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold shadow-md border-0"
                >
                  {editingClass ? 'Update Class' : 'Schedule Class'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowScheduleForm(false);
                    setEditingClass(null);
                  }}
                  variant="outline"
                  className="border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Classes */}
      {upcomingClasses.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-slate-600 dark:text-slate-400" />
            Upcoming Classes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingClasses.map((classItem) => (
              <Card key={classItem.id} className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {classItem.topic}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {classItem.date} at {classItem.time}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        onClick={() => handleEditClass(classItem)}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteClass(classItem.id)}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{classItem.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Enrolled:</span>
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {classItem.enrolledStudents.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Course:</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate ml-2">{classItem.courseName}</span>
                    </div>
                    <Button
                      onClick={() => handleStartClass(classItem.id)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold mt-2"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Class
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Classes */}
      {pastClasses.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-slate-600 dark:text-slate-400" />
            Past Classes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastClasses.map((classItem) => (
              <Card key={classItem.id} className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    {classItem.topic}
                  </CardTitle>
                  <CardDescription>
                    {classItem.date} at {classItem.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                      <span className="font-semibold">{classItem.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Attended:</span>
                      <span className="font-semibold flex items-center">
                        <UserCheck className="w-4 h-4 mr-1" />
                        {getClassAttendance(classItem.id).length}/{classItem.enrolledStudents.length}
                      </span>
                    </div>
                    {classItem.recordings.length > 0 && (
                      <Button
                        onClick={() => window.open(classItem.recordings[0].url, '_blank')}
                        variant="outline"
                        className="w-full border-slate-300 dark:border-slate-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        View Recording
                      </Button>
                    )}
                    {classItem.feedback.length > 0 && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-400">Rating:</span>
                        <span className="font-semibold flex items-center">
                          <Star className="w-4 h-4 mr-1 text-slate-600 dark:text-slate-400 fill-slate-600 dark:fill-slate-400" />
                          {getAverageRating(classItem.feedback).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {upcomingClasses.length === 0 && pastClasses.length === 0 && !showScheduleForm && (
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No classes scheduled yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Schedule your first class to start teaching students
            </p>
            <Button
              onClick={() => setShowScheduleForm(true)}
              className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Class
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Jitsi Meet Component with Timer */}
      {showLiveClass && (() => {
        const classItem = classes.find(c => c.id === showLiveClass);
        if (!classItem) return null;
        
        return (
          <JitsiMeetComponent
            classItem={classItem}
            chatMessages={getClassChatMessages(showLiveClass)}
            attendance={getClassAttendance(showLiveClass)}
            onClose={() => setShowLiveClass(null)}
            onEndClass={() => handleEndClass(showLiveClass)}
            onSendChatMessage={(message) => {
              if (!showLiveClass) return;
              const storedData = localStorage.getItem('evolvix_registration');
              const userData = storedData ? JSON.parse(storedData) : { fullName: 'Mentor', email: 'mentor@example.com' };
              
              dispatch(addChatMessage({
                id: `msg_${Date.now()}`,
                classId: showLiveClass,
                senderId: 'mentor',
                senderName: userData.fullName || 'Mentor',
                message: message,
                timestamp: new Date().toISOString(),
              }));
            }}
            chatInput={chatInput}
            onChatInputChange={setChatInput}
          />
        );
      })()}
    </div>
  );
}


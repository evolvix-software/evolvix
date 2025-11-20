"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { 
  Calendar, Clock, Users, Video, Play, BookOpen, Download, 
  Search, Filter, ChevronLeft, ChevronRight, Star, MessageSquare,
  Hand, Share2, BarChart3, Award, AlertCircle, CheckCircle2,
  X, Plus, Minus, Bookmark, BookmarkCheck, ExternalLink,
  TrendingUp, Calendar as CalendarIcon, Bell, Zap, FileText,
  Edit2, Save, ChevronDown, ChevronUp
} from 'lucide-react';
import { StatsCard, STAT_CARD_COLORS } from '@/components/common/ui/StatsCard';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { MentorClass, Attendance, initializeClasses } from '@/store/features/classes/classesSlice';
import { JoinClassComponent } from './components';

type TabType = 'upcoming' | 'recordings' | 'attendance' | 'schedule';

export function StudentClassesPage() {
  const dispatch = useAppDispatch();
  const { classes, attendance } = useAppSelector((state) => state.classes);
  const { courses } = useAppSelector((state) => state.courses);
  const [selectedClass, setSelectedClass] = useState<MentorClass | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [scheduleView, setScheduleView] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookmarkedRecordings, setBookmarkedRecordings] = useState<Set<string>>(new Set());
  const [recordingPlaybackSpeed, setRecordingPlaybackSpeed] = useState<{ [key: string]: number }>({});
  const [recordingNotes, setRecordingNotes] = useState<{ [key: string]: string }>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [expandedRecordings, setExpandedRecordings] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize classes if empty
    if (classes.length === 0 && typeof window !== 'undefined') {
      const saved = localStorage.getItem('evolvix_mentor_classes');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.classes && parsed.classes.length > 0) {
            dispatch(initializeClasses(parsed.classes));
            return;
          }
        } catch (e) {
          console.error('Failed to load classes from localStorage:', e);
        }
      }
      // No classes in storage, initialize with mock data (lazy import)
      import('@/data/mock/classesData').then((module) => {
        const mockClasses = module.getMockClassesWithRecordings();
        dispatch(initializeClasses(mockClasses));
        localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
          classes: mockClasses,
          chatMessages: [],
          attendance: [],
        }));
      });
    }

    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    }

    // Load bookmarks
    const bookmarks = localStorage.getItem('evolvix_class_bookmarks');
    if (bookmarks) {
      setBookmarkedRecordings(new Set(JSON.parse(bookmarks)));
    }

    // Load recording notes
    const notes = localStorage.getItem('evolvix_recording_notes');
    if (notes) {
      setRecordingNotes(JSON.parse(notes));
    }
  }, [classes.length, dispatch]);

  // Get classes for courses the student is enrolled in
  const enrolledCourseIds = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const enrollments = localStorage.getItem('evolvix_enrollments');
    if (enrollments) {
      const enrollmentList = JSON.parse(enrollments);
      return courses
        .filter(c => enrollmentList.some((e: any) => e.courseId === c.id))
        .map(c => c.id);
    }
    return [];
  }, [courses]);

  // Filter classes for enrolled courses
  const myClasses = useMemo(() => {
    return classes.filter(c => 
      c.courseId && enrolledCourseIds.includes(c.courseId)
    );
  }, [classes, enrolledCourseIds]);

  // Get unique courses for filter
  const availableCourses = useMemo(() => {
    const courseSet = new Set(myClasses.map(c => c.courseId).filter(Boolean));
    return courses.filter(c => courseSet.has(c.id));
  }, [myClasses, courses]);

  // Sort and filter classes
  const upcomingClasses = useMemo(() => {
    return myClasses
      .filter(c => {
        if (c.status === 'past') return false;
        if (selectedCourseFilter !== 'all' && c.courseId !== selectedCourseFilter) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return c.topic.toLowerCase().includes(query) || 
                 c.courseName?.toLowerCase().includes(query) ||
                 c.description?.toLowerCase().includes(query);
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateA - dateB;
      });
  }, [myClasses, selectedCourseFilter, searchQuery]);

  const liveClasses = useMemo(() => {
    return upcomingClasses.filter(c => c.status === 'live');
  }, [upcomingClasses]);

  const scheduledClasses = useMemo(() => {
    return upcomingClasses.filter(c => c.status === 'upcoming');
  }, [upcomingClasses]);

  const recordedClasses = useMemo(() => {
    return myClasses
      .filter(c => {
        if (c.status !== 'past') return false;
        if (selectedCourseFilter !== 'all' && c.courseId !== selectedCourseFilter) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          // Search in class info
          const matchesClass = c.topic.toLowerCase().includes(query) || 
                 c.courseName?.toLowerCase().includes(query) ||
                 c.description?.toLowerCase().includes(query);
          
          // Search in recording notes
          const matchesNotes = c.recordings?.some(rec => {
            const note = recordingNotes[rec.id] || '';
            return note.toLowerCase().includes(query);
          });
          
          return matchesClass || matchesNotes;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateB - dateA;
      });
  }, [myClasses, selectedCourseFilter, searchQuery, recordingNotes]);

  // Calculate attendance stats
  const attendanceStats = useMemo(() => {
    const studentId = userData?.email || 'student';
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    const totalClasses = myClasses.filter(c => c.status === 'past').length;
    const attendedClasses = studentAttendance.length;
    const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
    
    const missedClasses = myClasses
      .filter(c => c.status === 'past')
      .filter(c => !studentAttendance.some(a => a.classId === c.id));

    return {
      total: totalClasses,
      attended: attendedClasses,
      missed: missedClasses.length,
      percentage: attendancePercentage,
      missedClassesList: missedClasses
    };
  }, [attendance, myClasses, userData]);

  const canJoinClass = (classItem: MentorClass) => {
    if (!classItem.date || !classItem.time) return true;
    
    const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
    const now = new Date();
    // Allow joining 15 minutes before start
    const joinTime = new Date(classDateTime.getTime() - 15 * 60 * 1000);
    
    return now >= joinTime;
  };

  const getTimeUntilClass = (classItem: MentorClass) => {
    if (!classItem.date || !classItem.time) return null;
    
    const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
    const now = new Date();
    const diff = classDateTime.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const addToCalendar = (classItem: MentorClass) => {
    if (!classItem.date || !classItem.time) return;
    
    const startDate = new Date(`${classItem.date}T${classItem.time}`);
    const endDate = new Date(startDate.getTime() + classItem.duration * 60 * 1000);
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(classItem.topic)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(classItem.description || '')}&location=${encodeURIComponent(classItem.meetingLink || '')}`;
    
    window.open(calendarUrl, '_blank');
  };

  const toggleBookmark = (recordingId: string) => {
    const newBookmarks = new Set(bookmarkedRecordings);
    if (newBookmarks.has(recordingId)) {
      newBookmarks.delete(recordingId);
    } else {
      newBookmarks.add(recordingId);
    }
    setBookmarkedRecordings(newBookmarks);
    localStorage.setItem('evolvix_class_bookmarks', JSON.stringify(Array.from(newBookmarks)));
  };

  const setPlaybackSpeed = (recordingId: string, speed: number) => {
    setRecordingPlaybackSpeed({ ...recordingPlaybackSpeed, [recordingId]: speed });
  };

  const saveRecordingNote = (recordingId: string, note: string) => {
    const updatedNotes = { ...recordingNotes, [recordingId]: note };
    setRecordingNotes(updatedNotes);
    localStorage.setItem('evolvix_recording_notes', JSON.stringify(updatedNotes));
    setEditingNoteId(null);
  };

  const toggleRecordingExpansion = (classId: string) => {
    const newExpanded = new Set(expandedRecordings);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedRecordings(newExpanded);
  };

  // Get classes for current week/month
  const getClassesForPeriod = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    if (scheduleView === 'week') {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      end.setDate(start.getDate() + 6);
    } else {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }
    
    return myClasses.filter(c => {
      if (!c.date || !c.time) return false;
      const classDate = new Date(`${c.date}T${c.time}`);
      return classDate >= start && classDate <= end;
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-foreground mb-3 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Live Classes
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Join live sessions and access recordings for your enrolled courses
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          icon={Video}
          label="Live Now"
          value={liveClasses.length}
          {...STAT_CARD_COLORS.red}
        />
        <StatsCard
          icon={Clock}
          label="Upcoming"
          value={scheduledClasses.length}
          {...STAT_CARD_COLORS.blue}
        />
        <StatsCard
          icon={Play}
          label="Recordings"
          value={recordedClasses.length}
          {...STAT_CARD_COLORS.purple}
        />
        <StatsCard
          icon={Award}
          label="Attendance"
          value={`${attendanceStats.percentage}%`}
          {...STAT_CARD_COLORS.green}
        />
      </div>

      {/* Tabs */}
      <Card className="border border-slate-200 dark:border-border shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-wrap border-b border-slate-200 dark:border-border">
            {[
              { id: 'upcoming' as TabType, label: 'Upcoming Sessions', icon: Clock, count: scheduledClasses.length + liveClasses.length },
              { id: 'recordings' as TabType, label: 'Recordings', icon: Play, count: recordedClasses.length },
              { id: 'attendance' as TabType, label: 'Attendance', icon: BarChart3, count: attendanceStats.total },
              { id: 'schedule' as TabType, label: 'Schedule', icon: CalendarIcon, count: getClassesForPeriod().length },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-[#635bff] dark:border-[#735fff] text-primary dark:text-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-card'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-primary dark:bg-primary text-white'
                        : 'bg-slate-200 dark:bg-border text-slate-700 dark:text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      {(activeTab === 'upcoming' || activeTab === 'recordings') && (
        <Card className="border border-slate-200 dark:border-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card dark:bg-card border-2 border-slate-200 dark:border-border rounded-xl text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
              {availableCourses.length > 0 && (
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="px-4 py-3 bg-card dark:bg-card border-2 border-slate-200 dark:border-border rounded-xl text-slate-900 dark:text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all duration-200"
                >
                  <option value="all">All Courses</option>
                  {availableCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {/* Live Classes */}
          {liveClasses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse" />
                Live Now
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {liveClasses.map((classItem) => (
                  <Card 
                    key={classItem.id} 
                    className="border-2 border-red-300 dark:border-red-800 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-foreground line-clamp-2">
                          {classItem.topic}
                        </CardTitle>
                        <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center space-x-1 flex-shrink-0 ml-2">
                          <div className="w-2 h-2 bg-card rounded-full animate-pulse" />
                          <span>LIVE</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{classItem.date} at {classItem.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{classItem.duration} min</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-card dark:bg-card rounded-lg border border-slate-200 dark:border-border">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Course</p>
                        <p className="font-semibold text-slate-900 dark:text-foreground truncate">
                          {classItem.courseName}
                        </p>
                      </div>
                      <Button
                        onClick={() => setSelectedClass(classItem)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Join Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Classes */}
          {scheduledClasses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                Upcoming Sessions
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {scheduledClasses.map((classItem) => {
                  const canJoin = canJoinClass(classItem);
                  const timeUntil = getTimeUntilClass(classItem);

                  return (
                    <Card 
                      key={classItem.id} 
                      className="border-2 border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-foreground mb-2 line-clamp-2">
                          {classItem.topic}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{classItem.date} at {classItem.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{classItem.duration} min</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-slate-50 dark:bg-card rounded-lg border border-slate-200 dark:border-border">
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Course</p>
                          <p className="font-semibold text-slate-900 dark:text-foreground truncate">
                            {classItem.courseName}
                          </p>
                        </div>
                        {classItem.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {classItem.description}
                          </p>
                        )}
                        {timeUntil && !canJoin && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-blue-700 dark:text-blue-300 font-medium">
                                Starts in {timeUntil.days > 0 && `${timeUntil.days}d `}
                                {timeUntil.hours > 0 && `${timeUntil.hours}h `}
                                {timeUntil.minutes}m
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          {canJoin ? (
                            <Button
                              onClick={() => setSelectedClass(classItem)}
                              className="flex-1 bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Join Class
                            </Button>
                          ) : (
                            <Button
                              disabled
                              className="flex-1 bg-slate-200 dark:bg-border text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Not Available Yet
                            </Button>
                          )}
                          <Button
                            onClick={() => addToCalendar(classItem)}
                            variant="outline"
                            className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card hover:border-[#635bff] dark:hover:border-[#735fff] transition-all"
                            title="Add to Calendar"
                          >
                            <CalendarIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {liveClasses.length === 0 && scheduledClasses.length === 0 && (
            <Card className="border-2 border-slate-200 dark:border-border">
              <CardContent className="p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2B2B32] dark:to-border rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Video className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-3">
                  No upcoming classes
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-md mx-auto">
                  {searchQuery || selectedCourseFilter !== 'all'
                    ? 'No classes match your filters. Try adjusting your search.'
                    : 'Enroll in courses to see upcoming live classes scheduled by mentors'}
                </p>
                {(searchQuery || selectedCourseFilter !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCourseFilter('all');
                    }}
                    className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recordings Tab */}
      {activeTab === 'recordings' && (
        <div className="space-y-6">
          {/* Search and Filter Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Recorded Classes Features
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Search works across class titles, course names, and your personal notes. Add notes to each recording for easy reference later.
                </p>
              </div>
            </div>
          </div>

          {recordedClasses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recordedClasses.map((classItem) => (
                <Card 
                  key={classItem.id} 
                  className="border-2 border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white opacity-80" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleBookmark(classItem.id)}
                        className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-colors"
                      >
                        {bookmarkedRecordings.has(classItem.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                    {classItem.recordings && classItem.recordings.length > 0 && (
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                        {classItem.recordings.length} recording{classItem.recordings.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-foreground mb-2 line-clamp-2">
                      {classItem.topic}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{classItem.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{classItem.duration} min</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-slate-50 dark:bg-card rounded-lg border border-slate-200 dark:border-border">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Course</p>
                      <p className="font-semibold text-slate-900 dark:text-foreground truncate">
                        {classItem.courseName}
                      </p>
                    </div>
                    {classItem.recordings && classItem.recordings.length > 0 ? (
                      <div className="space-y-3">
                        {classItem.recordings.map((recording, idx) => (
                          <div key={recording.id} className="p-4 bg-card dark:bg-card rounded-lg border-2 border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Play className="w-4 h-4 text-primary dark:text-primary" />
                                  <span className="text-sm font-semibold text-slate-900 dark:text-foreground">
                                    Recording {idx + 1}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mb-2">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Duration: {recording.duration}</span>
                                  </div>
                                  {recording.createdAt && (
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>Recorded: {new Date(recording.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <select
                                  value={recordingPlaybackSpeed[recording.id] || 1}
                                  onChange={(e) => setPlaybackSpeed(recording.id, parseFloat(e.target.value))}
                                  className="text-xs px-2 py-1 bg-slate-100 dark:bg-border border border-slate-300 dark:border-border rounded text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20"
                                  onClick={(e) => e.stopPropagation()}
                                  title="Playback Speed"
                                >
                                  <option value="0.5">0.5x</option>
                                  <option value="0.75">0.75x</option>
                                  <option value="1">1x</option>
                                  <option value="1.25">1.25x</option>
                                  <option value="1.5">1.5x</option>
                                  <option value="2">2x</option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Notes Section */}
                            <div className="mb-3 pt-3 border-t border-slate-200 dark:border-border">
                              {editingNoteId === recording.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={recordingNotes[recording.id] || ''}
                                    onChange={(e) => setRecordingNotes({ ...recordingNotes, [recording.id]: e.target.value })}
                                    placeholder="Add your notes about this recording..."
                                    className="w-full px-3 py-2 text-sm border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] resize-none"
                                    rows={3}
                                    autoFocus
                                  />
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingNoteId(null);
                                        setRecordingNotes({ ...recordingNotes, [recording.id]: recordingNotes[recording.id] || '' });
                                      }}
                                      className="border-slate-300 dark:border-border text-xs"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => saveRecordingNote(recording.id, recordingNotes[recording.id] || '')}
                                      className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white text-xs"
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <FileText className="w-4 h-4 text-primary dark:text-primary" />
                                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Notes</span>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingNoteId(recording.id)}
                                      className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card text-xs h-6 px-2"
                                    >
                                      <Edit2 className="w-3 h-3 mr-1" />
                                      {recordingNotes[recording.id] ? 'Edit' : 'Add'}
                                    </Button>
                                  </div>
                                  {recordingNotes[recording.id] ? (
                                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-secondary p-2 rounded border border-slate-200 dark:border-border whitespace-pre-wrap">
                                      {recordingNotes[recording.id]}
                                    </p>
                                  ) : (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                      No notes yet. Click "Add" to add notes about this recording.
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-border">
                              <Button
                                onClick={() => window.open(recording.url, '_blank')}
                                className="flex-1 bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white text-sm font-semibold"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Play Recording
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = recording.url;
                                  link.download = `${classItem.topic}_recording_${idx + 1}.mp4`;
                                  link.click();
                                }}
                                className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card"
                                title="Download Recording"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 dark:bg-card rounded-lg border border-slate-200 dark:border-border text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          No recordings available yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-slate-200 dark:border-border">
              <CardContent className="p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2B2B32] dark:to-border rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Play className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-3">
                  No recordings available
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-md mx-auto">
                  {searchQuery || selectedCourseFilter !== 'all'
                    ? 'No recordings match your filters'
                    : 'Recordings will appear here after classes are completed'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Attendance Overview */}
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  <span className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {attendanceStats.attended}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Classes Attended</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <X className="w-10 h-10 text-red-600 dark:text-red-400" />
                  <span className="text-3xl font-bold text-red-700 dark:text-red-300">
                    {attendanceStats.missed}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Classes Missed</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {attendanceStats.percentage}%
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Attendance Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance History */}
          <Card className="border-2 border-slate-200 dark:border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-foreground flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-primary dark:text-primary" />
                Attendance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceStats.total > 0 ? (
                <div className="space-y-3">
                  {myClasses
                    .filter(c => c.status === 'past')
                    .sort((a, b) => {
                      const dateA = new Date(`${a.date}T${a.time}`).getTime();
                      const dateB = new Date(`${b.date}T${b.time}`).getTime();
                      return dateB - dateA;
                    })
                    .map((classItem) => {
                      const studentId = userData?.email || 'student';
                      const wasAttended = attendance.some(
                        a => a.classId === classItem.id && a.studentId === studentId
                      );
                      const attendanceRecord = attendance.find(
                        a => a.classId === classItem.id && a.studentId === studentId
                      );

                      return (
                        <div
                          key={classItem.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            wasAttended
                              ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                              : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                {wasAttended ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                                )}
                                <h4 className="font-bold text-slate-900 dark:text-foreground">
                                  {classItem.topic}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  wasAttended
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                  {wasAttended ? 'Attended' : 'Missed'}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 ml-8">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{classItem.date} at {classItem.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="w-4 h-4" />
                                  <span>{classItem.courseName}</span>
                                </div>
                                {attendanceRecord?.joinedAt && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Joined: {new Date(attendanceRecord.joinedAt).toLocaleTimeString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No attendance records yet. Join live classes to track your attendance.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Schedule Controls */}
          <Card className="border-2 border-slate-200 dark:border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      if (scheduleView === 'week') {
                        newDate.setDate(newDate.getDate() - 7);
                      } else {
                        newDate.setMonth(newDate.getMonth() - 1);
                      }
                      setCurrentDate(newDate);
                    }}
                    variant="outline"
                    className="border-slate-300 dark:border-border"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-foreground">
                    {scheduleView === 'week'
                      ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                      : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <Button
                    onClick={() => {
                      const newDate = new Date(currentDate);
                      if (scheduleView === 'week') {
                        newDate.setDate(newDate.getDate() + 7);
                      } else {
                        newDate.setMonth(newDate.getMonth() + 1);
                      }
                      setCurrentDate(newDate);
                    }}
                    variant="outline"
                    className="border-slate-300 dark:border-border"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setCurrentDate(new Date())}
                    variant="outline"
                    className="border-slate-300 dark:border-border"
                  >
                    Today
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setScheduleView('week')}
                    variant={scheduleView === 'week' ? 'default' : 'outline'}
                    className={scheduleView === 'week' 
                      ? 'bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white'
                      : 'border-slate-300 dark:border-border'
                    }
                  >
                    Week
                  </Button>
                  <Button
                    onClick={() => setScheduleView('month')}
                    variant={scheduleView === 'month' ? 'default' : 'outline'}
                    className={scheduleView === 'month'
                      ? 'bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white'
                      : 'border-slate-300 dark:border-border'
                    }
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule View */}
          <Card className="border-2 border-slate-200 dark:border-border">
            <CardContent className="p-6">
              {getClassesForPeriod().length > 0 ? (
                <div className="space-y-4">
                  {getClassesForPeriod().map((classItem) => {
                    const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
                    const isPast = classDateTime < new Date();
                    const canJoin = canJoinClass(classItem);

                    return (
                      <div
                        key={classItem.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          classItem.status === 'live'
                            ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                            : isPast
                            ? 'border-slate-200 dark:border-border bg-slate-50 dark:bg-card'
                            : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              <span className="font-semibold text-slate-900 dark:text-foreground">
                                {classDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </span>
                              {classItem.status === 'live' && (
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-card rounded-full animate-pulse" />
                                  <span>LIVE</span>
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-lg text-slate-900 dark:text-foreground mb-1">
                              {classItem.topic}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                              <span>{classItem.courseName}</span>
                              <span>•</span>
                              <span>{classItem.duration} minutes</span>
                            </div>
                          </div>
                          {!isPast && (
                            <div className="flex items-center space-x-2">
                              {canJoin ? (
                                <Button
                                  onClick={() => setSelectedClass(classItem)}
                                  className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Join
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => addToCalendar(classItem)}
                                  variant="outline"
                                  className="border-slate-300 dark:border-border"
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  Add to Calendar
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No classes scheduled for this {scheduleView === 'week' ? 'week' : 'month'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Join Class Modal */}
      {selectedClass && userData && (
        <JoinClassComponent
          classItem={selectedClass}
          studentName={userData.fullName || 'Student'}
          studentEmail={userData.email || 'student@example.com'}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}

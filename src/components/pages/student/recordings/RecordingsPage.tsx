"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { 
  Play, Download, Bookmark, BookmarkCheck, FileText, Edit2, Save,
  Search, Filter, Clock, Calendar, Video, BookOpen, X, ChevronDown,
  ChevronUp, Star, Users, TrendingUp, Eye, FileVideo
} from 'lucide-react';
import { StatsCard, STAT_CARD_COLORS } from '@/components/common/ui/StatsCard';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { MentorClass, initializeClasses } from '@/store/features/classes/classesSlice';

type FilterType = 'all' | 'bookmarked' | 'with-notes';
type SortType = 'newest' | 'oldest' | 'duration' | 'course';

export function RecordingsPage() {
  const dispatch = useAppDispatch();
  const { classes } = useAppSelector((state) => state.classes);
  const { courses } = useAppSelector((state) => state.courses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [bookmarkedRecordings, setBookmarkedRecordings] = useState<Set<string>>(new Set());
  const [recordingNotes, setRecordingNotes] = useState<{ [key: string]: string }>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());
  const [playbackSpeeds, setPlaybackSpeeds] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize courses if empty
    if (courses.length === 0) {
      const storedCourses = localStorage.getItem('evolvix_courses');
      const mentorCourses = storedCourses ? JSON.parse(storedCourses) : [];
      
      // Import and merge with mock courses
      import('@/data/mock/coursesData').then((module) => {
        const { coursesData } = module;
        const allCourses = [...coursesData];
        mentorCourses.forEach((mentorCourse: any) => {
          if (!allCourses.find(c => c.id === mentorCourse.id)) {
            allCourses.push(mentorCourse);
          }
        });
        dispatch({ type: 'courses/setCourses', payload: allCourses });
      });
    }

    // Initialize enrollments for demo if none exist
    const enrollments = localStorage.getItem('evolvix_enrollments');
    if (!enrollments) {
      // Enroll student in course '1' (React - has recordings) and course '2' (Full-Stack - has recordings)
      const demoEnrollments = [
        {
          courseId: '1',
          enrolledAt: new Date().toISOString(),
          progress: 25,
          status: 'in-progress'
        },
        {
          courseId: '2',
          enrolledAt: new Date().toISOString(),
          progress: 15,
          status: 'in-progress'
        }
      ];
      localStorage.setItem('evolvix_enrollments', JSON.stringify(demoEnrollments));
      // Also update Redux store
      demoEnrollments.forEach((enrollment: any) => {
        dispatch({ type: 'courses/enrollCourse', payload: enrollment.courseId });
      });
    }

    // Initialize classes with recordings - ensure mock data is always available for recordings page
    const saved = localStorage.getItem('evolvix_mentor_classes');
    let existingClasses: MentorClass[] = [];
    let parsedData: any = null;
    
    if (saved) {
      try {
        parsedData = JSON.parse(saved);
        if (parsedData && parsedData.classes && parsedData.classes.length > 0) {
          existingClasses = parsedData.classes;
        }
      } catch (e) {
        console.error('Failed to load classes from localStorage:', e);
      }
    }

    // Always ensure mock recordings are available - load/merge if needed
    if (classes.length === 0) {
      // Always load and merge mock recordings to ensure they're available
      import('@/data/mock/classesData').then((module) => {
        const mockClasses = module.getMockClassesWithRecordings();
        const existingIds = new Set(existingClasses.map(c => c.id));
        
        // Add any mock classes that don't already exist
        const newClasses = mockClasses.filter(mc => !existingIds.has(mc.id));
        const mergedClasses = [...existingClasses, ...newClasses];
        
        dispatch(initializeClasses(mergedClasses));
        localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
          classes: mergedClasses,
          chatMessages: parsedData?.chatMessages || [],
          attendance: parsedData?.attendance || [],
        }));
      });
    } else {
      // Redux has classes - check if we need to add mock recordings
      const hasRecordings = classes.some(c => 
        c.status === 'past' && 
        c.courseId && 
        (c.courseId === '1' || c.courseId === '2') &&
        c.recordings && 
        c.recordings.length > 0
      );
      
      if (!hasRecordings) {
        import('@/data/mock/classesData').then((module) => {
          const mockClasses = module.getMockClassesWithRecordings();
          const existingIds = new Set(classes.map(c => c.id));
          const newClasses = mockClasses.filter(mc => !existingIds.has(mc.id));
          
          if (newClasses.length > 0) {
            const mergedClasses = [...classes, ...newClasses];
            dispatch(initializeClasses(mergedClasses));
            localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
              classes: mergedClasses,
              chatMessages: parsedData?.chatMessages || [],
              attendance: parsedData?.attendance || [],
            }));
          }
        });
      }
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

    // Load playback speeds
    const speeds = localStorage.getItem('evolvix_playback_speeds');
    if (speeds) {
      setPlaybackSpeeds(JSON.parse(speeds));
    }
  }, [classes.length, courses.length, dispatch]);

  // Get enrolled course IDs
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

  // Get classes with recordings
  const classesWithRecordings = useMemo(() => {
    if (typeof window === 'undefined' || enrolledCourseIds.length === 0) return [];
    return classes.filter(c => 
      c.status === 'past' && 
      c.courseId && 
      enrolledCourseIds.includes(c.courseId) &&
      c.recordings && 
      c.recordings.length > 0
    );
  }, [classes, enrolledCourseIds]);

  // Get all recordings flattened
  const allRecordings = useMemo(() => {
    const recordings: Array<{
      id: string;
      recording: any;
      classItem: MentorClass;
      recordingIndex: number;
    }> = [];

    classesWithRecordings.forEach(classItem => {
      classItem.recordings?.forEach((recording, idx) => {
        recordings.push({
          id: recording.id,
          recording,
          classItem,
          recordingIndex: idx + 1
        });
      });
    });

    return recordings;
  }, [classesWithRecordings]);

  // Filter and sort recordings
  const filteredRecordings = useMemo(() => {
    if (typeof window === 'undefined' || allRecordings.length === 0) return [];
    let filtered = allRecordings.filter(item => {
      // Course filter
      if (selectedCourseFilter !== 'all' && item.classItem.courseId !== selectedCourseFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesClass = item.classItem.topic.toLowerCase().includes(query) ||
                            item.classItem.courseName?.toLowerCase().includes(query) ||
                            item.classItem.description?.toLowerCase().includes(query);
        const matchesNote = (recordingNotes[item.recording.id] || '').toLowerCase().includes(query);
        if (!matchesClass && !matchesNote) return false;
      }

      // Filter type
      if (filterType === 'bookmarked' && !bookmarkedRecordings.has(item.classItem.id)) {
        return false;
      }
      if (filterType === 'with-notes' && !recordingNotes[item.recording.id]) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'newest':
          const dateA = new Date(a.recording.createdAt || a.classItem.date).getTime();
          const dateB = new Date(b.recording.createdAt || b.classItem.date).getTime();
          return dateB - dateA;
        case 'oldest':
          const dateA2 = new Date(a.recording.createdAt || a.classItem.date).getTime();
          const dateB2 = new Date(b.recording.createdAt || b.classItem.date).getTime();
          return dateA2 - dateB2;
        case 'duration':
          const durA = parseInt(a.recording.duration) || 0;
          const durB = parseInt(b.recording.duration) || 0;
          return durB - durA;
        case 'course':
          return (a.classItem.courseName || '').localeCompare(b.classItem.courseName || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [allRecordings, selectedCourseFilter, searchQuery, filterType, sortType, bookmarkedRecordings, recordingNotes]);

  // Get unique courses for filter
  const availableCourses = useMemo(() => {
    if (typeof window === 'undefined' || classesWithRecordings.length === 0) return [];
    const courseSet = new Set(classesWithRecordings.map(c => c.courseId).filter(Boolean));
    return courses.filter(c => courseSet.has(c.id));
  }, [classesWithRecordings, courses]);

  // Statistics
  const stats = useMemo(() => {
    if (typeof window === 'undefined' || allRecordings.length === 0) {
      return { total: 0, bookmarked: 0, withNotes: 0, totalDuration: 0 };
    }
    return {
      total: allRecordings.length,
      bookmarked: allRecordings.filter(r => bookmarkedRecordings.has(r.classItem.id)).length,
      withNotes: allRecordings.filter(r => recordingNotes[r.recording.id]).length,
      totalDuration: allRecordings.reduce((sum, r) => sum + (parseInt(r.recording.duration) || 0), 0)
    };
  }, [allRecordings, bookmarkedRecordings, recordingNotes]);

  const toggleBookmark = (classId: string) => {
    const newBookmarks = new Set(bookmarkedRecordings);
    if (newBookmarks.has(classId)) {
      newBookmarks.delete(classId);
    } else {
      newBookmarks.add(classId);
    }
    setBookmarkedRecordings(newBookmarks);
    localStorage.setItem('evolvix_class_bookmarks', JSON.stringify(Array.from(newBookmarks)));
  };

  const saveNote = (recordingId: string, note: string) => {
    const updatedNotes = { ...recordingNotes, [recordingId]: note };
    setRecordingNotes(updatedNotes);
    localStorage.setItem('evolvix_recording_notes', JSON.stringify(updatedNotes));
    setEditingNoteId(null);
  };

  const setPlaybackSpeed = (recordingId: string, speed: number) => {
    const updated = { ...playbackSpeeds, [recordingId]: speed };
    setPlaybackSpeeds(updated);
    localStorage.setItem('evolvix_playback_speeds', JSON.stringify(updated));
  };

  const toggleClassExpansion = (classId: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedClasses(newExpanded);
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-foreground mb-2">
            My Recordings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Access and manage all your recorded class sessions
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          icon={FileVideo}
          label="Total Recordings"
          value={stats.total}
          {...STAT_CARD_COLORS.blue}
        />
        <StatsCard
          icon={BookmarkCheck}
          label="Bookmarked"
          value={stats.bookmarked}
          {...STAT_CARD_COLORS.yellow}
        />
        <StatsCard
          icon={FileText}
          label="With Notes"
          value={stats.withNotes}
          {...STAT_CARD_COLORS.green}
        />
        <StatsCard
          icon={Clock}
          label="Total Duration"
          value={formatDuration(stats.totalDuration)}
          {...STAT_CARD_COLORS.purple}
        />
      </div>

      {/* Filters and Search */}
      <Card className="border-2 border-slate-200 dark:border-border">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search recordings, courses, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Course Filter */}
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="px-4 py-2.5 border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
            >
              <option value="all">All Courses</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>

            {/* Filter Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="px-4 py-2.5 border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
            >
              <option value="all">All Recordings</option>
              <option value="bookmarked">Bookmarked Only</option>
              <option value="with-notes">With Notes</option>
            </select>

            {/* Sort */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="px-4 py-2.5 border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="duration">Longest Duration</option>
              <option value="course">By Course</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Recordings List */}
      {filteredRecordings.length > 0 ? (
        <div className="space-y-4">
          {filteredRecordings.map((item) => {
            const isExpanded = expandedClasses.has(item.classItem.id);
            const isBookmarked = bookmarkedRecordings.has(item.classItem.id);
            const hasNote = !!recordingNotes[item.recording.id];
            const playbackSpeed = playbackSpeeds[item.recording.id] || 1;

            return (
              <Card 
                key={`${item.classItem.id}-${item.recording.id}`}
                className="border-2 border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="relative w-full lg:w-64 h-48 lg:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white opacity-80" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => toggleBookmark(item.classItem.id)}
                          className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-colors"
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          ) : (
                            <Bookmark className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                        {formatDuration(parseInt(item.recording.duration) || 0)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-1">
                              {item.classItem.topic}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-2">
                              <div className="flex items-center space-x-1">
                                <BookOpen className="w-4 h-4" />
                                <span className="font-medium">{item.classItem.courseName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{item.classItem.date}</span>
                              </div>
                              {item.recording.createdAt && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Recorded: {new Date(item.recording.createdAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {hasNote && (
                              <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>Has Notes</span>
                              </div>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleClassExpansion(item.classItem.id)}
                              className="border-slate-300 dark:border-border"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                  More
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Description */}
                        {item.classItem.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {item.classItem.description}
                          </p>
                        )}
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-200 dark:border-border space-y-4">
                          {/* Notes Section */}
                          <div>
                            {editingNoteId === item.recording.id ? (
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2 mb-2">
                                  <FileText className="w-4 h-4 text-primary dark:text-primary" />
                                  <span>Your Notes</span>
                                </label>
                                <textarea
                                  value={recordingNotes[item.recording.id] || ''}
                                  onChange={(e) => setRecordingNotes({ ...recordingNotes, [item.recording.id]: e.target.value })}
                                  placeholder="Add your notes about this recording..."
                                  className="w-full px-4 py-3 text-sm border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] resize-none"
                                  rows={4}
                                  autoFocus
                                />
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingNoteId(null);
                                      setRecordingNotes({ ...recordingNotes, [item.recording.id]: recordingNotes[item.recording.id] || '' });
                                    }}
                                    className="border-slate-300 dark:border-border"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => saveNote(item.recording.id, recordingNotes[item.recording.id] || '')}
                                    className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white"
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save Note
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-primary dark:text-primary" />
                                    <span>Your Notes</span>
                                  </label>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingNoteId(item.recording.id)}
                                    className="border-slate-300 dark:border-border text-xs"
                                  >
                                    <Edit2 className="w-3 h-3 mr-1" />
                                    {hasNote ? 'Edit' : 'Add Note'}
                                  </Button>
                                </div>
                                {hasNote ? (
                                  <div className="p-3 bg-slate-50 dark:bg-secondary rounded-lg border border-slate-200 dark:border-border">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                      {recordingNotes[item.recording.id]}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                    No notes yet. Click "Add Note" to add your thoughts about this recording.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Playback Speed */}
                          <div className="flex items-center space-x-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Playback Speed:
                            </label>
                            <select
                              value={playbackSpeed}
                              onChange={(e) => setPlaybackSpeed(item.recording.id, parseFloat(e.target.value))}
                              className="px-3 py-1.5 text-sm border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
                            >
                              <option value="0.5">0.5x</option>
                              <option value="0.75">0.75x</option>
                              <option value="1">1x (Normal)</option>
                              <option value="1.25">1.25x</option>
                              <option value="1.5">1.5x</option>
                              <option value="2">2x</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-border">
                        <Button
                          onClick={() => window.open(item.recording.url, '_blank')}
                          className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white font-semibold"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play Recording
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.recording.url;
                            link.download = `${item.classItem.topic}_recording_${item.recordingIndex}.mp4`;
                            link.click();
                          }}
                          className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        {!isExpanded && (
                          <Button
                            variant="outline"
                            onClick={() => toggleClassExpansion(item.classItem.id)}
                            className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {hasNote ? 'View Note' : 'Add Note'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-2 border-slate-200 dark:border-border">
          <CardContent className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2B2B32] dark:to-border rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileVideo className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-3">
              No recordings found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-md mx-auto">
              {searchQuery || selectedCourseFilter !== 'all' || filterType !== 'all'
                ? 'No recordings match your filters. Try adjusting your search criteria.'
                : 'Recordings will appear here after your enrolled classes are completed and recordings are uploaded.'}
            </p>
            {(searchQuery || selectedCourseFilter !== 'all' || filterType !== 'all') && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCourseFilter('all');
                  setFilterType('all');
                }}
                className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


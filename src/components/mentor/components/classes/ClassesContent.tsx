"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
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
} from 'lucide-react';
import { LiveClassModal } from './LiveClassModal';

export function ClassesContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { classes, chatMessages, attendance, currentLiveClass } = useAppSelector((state) => state.classes);
  
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingClass, setEditingClass] = useState<MentorClass | null>(null);
  const [showLiveClass, setShowLiveClass] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    category: '',
    courseId: '',
    courseName: '',
    classType: 'live' as 'recorded' | 'live' | 'one-to-one',
    platform: 'zoom' as 'zoom' | 'jitsi',
    videoUrl: '',
  });

  // Get courses from Redux
  const allCourses = useAppSelector((state) => state.courses.courses);
  // Filter to only live courses with enrollments
  const liveCoursesWithEnrollments = allCourses.filter(c => 
    c.courseType === 'live' && c.enrolledCount > 0
  );

  useEffect(() => {
    if (currentLiveClass) {
      setShowLiveClass(currentLiveClass);
    }
  }, [currentLiveClass]);

  const upcomingClasses = classes.filter(c => c.status === 'upcoming');
  const pastClasses = classes.filter(c => c.status === 'past');

  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClass) {
      dispatch(updateClass({
        id: editingClass.id,
        topic: formData.topic,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        category: formData.category,
        courseId: formData.courseId || undefined,
        courseName: formData.courseName || undefined,
        classType: formData.classType,
        platform: formData.classType !== 'recorded' ? formData.platform : undefined,
        videoUrl: formData.classType === 'recorded' ? formData.videoUrl : undefined,
      }));
      setEditingClass(null);
    } else {
      const newClass: MentorClass = {
        id: `class_${Date.now()}`,
        topic: formData.topic,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        category: formData.category,
        courseId: formData.courseId || undefined,
        courseName: formData.courseName || undefined,
        classType: formData.classType,
        platform: formData.classType !== 'recorded' ? formData.platform : undefined,
        meetingLink: formData.classType !== 'recorded' && formData.platform 
          ? (formData.platform === 'zoom' 
              ? `https://zoom.us/j/${Math.random().toString(36).substr(2, 9)}`
              : `https://meet.jit.si/${Math.random().toString(36).substr(2, 9)}`)
          : undefined,
        meetingId: formData.classType !== 'recorded' ? Math.random().toString(36).substr(2, 9) : undefined,
        videoUrl: formData.classType === 'recorded' ? formData.videoUrl : undefined,
        enrolledStudents: [],
        recordings: [],
        feedback: [],
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addClass(newClass));
    }
    
    setShowScheduleForm(false);
    setFormData({
      topic: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      category: '',
      courseId: '',
      courseName: '',
      classType: 'live',
      platform: 'zoom',
      videoUrl: '',
    });
  };

  const handleStartClass = (classId: string) => {
    dispatch(updateClassStatus({ classId, status: 'live' }));
    dispatch(setCurrentLiveClass(classId));
    setShowLiveClass(classId);
  };

  const handleEndClass = (classId: string) => {
    dispatch(updateClassStatus({ classId, status: 'past' }));
    dispatch(setCurrentLiveClass(null));
    setShowLiveClass(null);
    
    // Add a mock recording
    const classItem = classes.find(c => c.id === classId);
    if (classItem) {
      dispatch(addRecording({
        classId,
        recording: {
          id: `rec_${Date.now()}`,
          url: `https://example.com/recording/${classId}`,
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
      classType: classItem.classType || 'live',
      platform: classItem.platform || 'zoom',
      videoUrl: classItem.videoUrl || '',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Schedule & Manage Classes</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Create classes for live courses. Only courses with enrolled students can have classes scheduled.
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
              category: '',
              courseId: '',
              courseName: '',
              classType: 'live',
              platform: 'zoom',
              videoUrl: '',
            });
            setShowScheduleForm(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Class
        </Button>
      </div>

      {/* Schedule New Class Form */}
      {showScheduleForm && (
        <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingClass ? 'Edit Class' : 'Schedule New Class'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowScheduleForm(false);
                setEditingClass(null);
              }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitClass} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="classType" className="mb-2 block">Class Type *</Label>
                  <select
                    id="classType"
                    value={formData.classType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      classType: e.target.value as 'recorded' | 'live' | 'one-to-one',
                      platform: e.target.value === 'recorded' ? 'zoom' : formData.platform,
                      videoUrl: e.target.value === 'recorded' ? '' : formData.videoUrl,
                    })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  >
                    <option value="recorded">Recorded Class</option>
                    <option value="live">Live Class</option>
                    <option value="one-to-one">One-to-One Session</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="topic" className="mb-2 block">Topic *</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="e.g., React Development Session"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="mb-2 block">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="e.g., Programming, Career"
                  />
                </div>
                {formData.classType === 'recorded' ? (
                  <div>
                    <Label htmlFor="videoUrl" className="mb-2 block">Video URL *</Label>
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="https://youtube.com/... or upload video link"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="date" className="mb-2 block">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="mb-2 block">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="platform" className="mb-2 block">Platform *</Label>
                      <select
                        id="platform"
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value as 'zoom' | 'jitsi' })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      >
                        <option value="zoom">Zoom</option>
                        <option value="jitsi">Jitsi</option>
                      </select>
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="duration" className="mb-2 block">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    min={15}
                    step={15}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="courseId" className="mb-2 block">Link to Course (Optional)</Label>
                  <select
                    id="courseId"
                    value={formData.courseId}
                    onChange={(e) => {
                      const course = allCourses.find(c => c.id === e.target.value);
                      setFormData({
                        ...formData,
                        courseId: e.target.value,
                        courseName: course?.title || '',
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Select a course (optional)</option>
                    {liveCoursesWithEnrollments.map((course) => (
                      <option key={course.id} value={course.id}>{course.title} ({course.enrolledCount} enrolled)</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="mb-2 block">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                    placeholder="Class description..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowScheduleForm(false);
                    setEditingClass(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingClass ? 'Update Class' : 'Schedule Class'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Classes */}
      <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span>Upcoming Classes</span>
          </CardTitle>
          <CardDescription>Your scheduled sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingClasses.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">No upcoming classes scheduled</p>
          ) : (
            upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{classItem.topic}</h3>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs">
                        {classItem.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{classItem.date} at {classItem.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Video className="w-4 h-4" />
                        <span>{classItem.duration} min • {classItem.platform}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{classItem.enrolledStudents.length} enrolled</span>
                      </div>
                      {classItem.courseName && (
                        <span className="text-xs text-slate-500">Course: {classItem.courseName}</span>
                      )}
                    </div>
                    {classItem.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{classItem.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-slate-200 dark:border-slate-700"
                      onClick={() => handleEditClass(classItem)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStartClass(classItem.id)}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Start Class
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-slate-200 dark:border-slate-700"
                      onClick={() => handleDeleteClass(classItem.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Past Classes */}
      <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span>Past Classes</span>
          </CardTitle>
          <CardDescription>Recordings and feedback from previous sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastClasses.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">No past classes</p>
          ) : (
            pastClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{classItem.topic}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>{classItem.date} at {classItem.time}</span>
                      <span>{classItem.duration} min</span>
                      <span>{classItem.enrolledStudents.length} students</span>
                    </div>
                  </div>
                </div>

                {/* Recordings */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Recordings
                  </h4>
                  {classItem.recordings.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">No recordings available</p>
                  ) : (
                    <div className="space-y-2">
                      {classItem.recordings.map((recording) => (
                        <div key={recording.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                          <div className="flex items-center space-x-2">
                            <Play className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {recording.duration} • {new Date(recording.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feedback Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Feedback Summary
                  </h4>
                  {classItem.feedback.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">No feedback yet</p>
                  ) : (
                    <div className="space-y-2">
                      {classItem.feedback.map((feedback) => (
                        <div key={feedback.id} className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {feedback.studentName}
                            </span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < feedback.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-slate-300 dark:text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {feedback.comment && (
                            <p className="text-xs text-slate-600 dark:text-slate-400">{feedback.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Live Class Modal */}
      {showLiveClass && (
        <LiveClassModal
          classId={showLiveClass}
          classItem={classes.find(c => c.id === showLiveClass)!}
          dispatch={dispatch}
          onClose={() => {
            handleEndClass(showLiveClass);
          }}
          chatMessages={getClassChatMessages(showLiveClass)}
          attendance={getClassAttendance(showLiveClass)}
          chatInput={chatInput}
          onChatInputChange={setChatInput}
          onSendMessage={handleSendChatMessage}
        />
      )}
    </div>
  );
}


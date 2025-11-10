"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import {
  Bell,
  Plus,
  Search,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  FileText,
  Send,
  Clock,
} from 'lucide-react';
import { useAppSelector } from '@/hooks';

interface Announcement {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  targetAudience: 'all' | 'group';
  scheduledAt?: string;
  sentAt?: string;
  readCount: number;
  totalRecipients: number;
  attachments?: string[];
  createdAt: string;
}

export function AnnouncementsPage() {
  const { courses } = useAppSelector(state => state.courses);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const mentorCourses = useMemo(() => {
    return courses.filter(c => c.instructor.id === 'suhxil14@gmail.com'); // Mock mentor ID
  }, [courses]);

  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements;

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(a => a.courseId === selectedCourse);
    }

    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [announcements, selectedCourse, searchQuery]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Announcements
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Create and manage course announcements
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300 dark:border-slate-700"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
            >
              <option value="all">All Courses</option>
              {mentorCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Announcements Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Create your first announcement to communicate with students
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{announcement.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{announcement.courseName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {announcement.readCount} / {announcement.totalRecipients} read
                        </span>
                      </div>
                      {announcement.sentAt ? (
                        <div className="flex items-center space-x-1">
                          <Send className="w-4 h-4" />
                          <span>Sent {new Date(announcement.sentAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Scheduled for {announcement.scheduledAt ? new Date(announcement.scheduledAt).toLocaleDateString() : 'TBD'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
                      className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                  {announcement.content}
                </p>
                {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="mt-4 flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span>{announcement.attachments.length} attachment(s)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Announcement Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Create Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Announcement creation form will be implemented here
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


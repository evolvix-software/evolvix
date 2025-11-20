"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Bell, Calendar, Video, X, CheckCircle, ExternalLink, Clock } from 'lucide-react';
import { ClassNotification } from '@/store/features/notifications/notificationsSlice';

export function ClassNotifications() {
  const [notifications, setNotifications] = useState<ClassNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('evolvix_student_notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter to show only unread or recent notifications
        const recentNotifications = parsed
          .filter((n: ClassNotification) => {
            // Show notifications for upcoming or live classes
            const classDate = new Date(`${n.date}T${n.time}`);
            const now = new Date();
            // Show if class is upcoming (within 7 days) or is live
            return classDate >= now || (classDate.getTime() - now.getTime()) > -7 * 24 * 60 * 60 * 1000;
          })
          .sort((a: ClassNotification, b: ClassNotification) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5); // Show latest 5
        
        setNotifications(recentNotifications);
        setUnreadCount(parsed.filter((n: ClassNotification) => !n.read).length);
      } catch (e) {
        console.error('Failed to load notifications:', e);
      }
    }
  }, []);

  const markAsRead = (notificationId: string) => {
    const stored = localStorage.getItem('evolvix_student_notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((n: ClassNotification) => 
          n.id === notificationId ? { ...n, read: true } : n
        );
        localStorage.setItem('evolvix_student_notifications', JSON.stringify(updated));
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      } catch (e) {
        console.error('Failed to mark notification as read:', e);
      }
    }
  };

  const deleteNotification = (notificationId: string) => {
    const stored = localStorage.getItem('evolvix_student_notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updated = parsed.filter((n: ClassNotification) => n.id !== notificationId);
        localStorage.setItem('evolvix_student_notifications', JSON.stringify(updated));
        setNotifications(notifications.filter(n => n.id !== notificationId));
        const wasUnread = notifications.find(n => n.id === notificationId && !n.read);
        if (wasUnread) {
          setUnreadCount(Math.max(0, unreadCount - 1));
        }
      } catch (e) {
        console.error('Failed to delete notification:', e);
      }
    }
  };

  const handleJoinClass = (notification: ClassNotification) => {
    markAsRead(notification.id);
    if (notification.meetingLink) {
      window.open(notification.meetingLink, '_blank', 'width=1920,height=1080');
    } else {
      // Navigate to classes page
      window.location.href = '/portal/student/classes';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-foreground">
              Class Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                notification.read
                  ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                    <h4 className={`font-semibold ${
                      notification.read
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-blue-900 dark:text-blue-100'
                    }`}>
                      {notification.classTopic}
                    </h4>
                  </div>
                  <p className={`text-sm mb-2 ${
                    notification.read
                      ? 'text-slate-600 dark:text-slate-400'
                      : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{notification.date} at {notification.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{notification.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>{notification.courseName}</span>
                    </div>
                  </div>
                  {notification.meetingLink && (
                    <div className="mt-3 p-2 bg-card dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Meeting Link:</p>
                      <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                        {notification.meetingLink}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4">
                  {!notification.read && (
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      size="sm"
                      variant="outline"
                      className="border-slate-300 dark:border-slate-700 text-xs"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteNotification(notification.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-xs"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                {notification.meetingLink && (
                  <Button
                    onClick={() => handleJoinClass(notification)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs"
                    size="sm"
                  >
                    <Video className="w-3.5 h-3.5 mr-1" />
                    Join Class
                  </Button>
                )}
                <Button
                  onClick={() => {
                    window.location.href = '/portal/student/classes';
                  }}
                  variant="outline"
                  className="border-slate-300 dark:border-slate-700 text-xs"
                  size="sm"
                >
                  View All Classes
                </Button>
                {notification.meetingLink && (
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(notification.meetingLink || '');
                      alert('Meeting link copied to clipboard!');
                    }}
                    variant="outline"
                    className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-xs"
                    size="sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Copy Link
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {notifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              onClick={() => {
                window.location.href = '/portal/student/classes';
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              variant="outline"
            >
              View All Classes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


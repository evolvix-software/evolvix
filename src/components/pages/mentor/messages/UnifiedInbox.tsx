"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  Bell,
  FileText,
  Users,
  CheckCircle2,
  Star,
  Archive,
  Trash2,
} from 'lucide-react';
import { ChatConversation } from '@/interfaces/students';
import { mockChatConversations } from '@/data/mock/students';

type MessageType = 'all' | 'direct' | 'announcement' | 'feedback' | 'notification';
type FilterType = 'all' | 'unread' | 'starred' | 'archived';

interface UnifiedMessage extends ChatConversation {
  type: MessageType;
  priority?: 'high' | 'normal' | 'low';
  starred?: boolean;
  archived?: boolean;
  courseId?: string;
  courseName?: string;
}

export function UnifiedInbox() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Mock unified messages - combining different message types
  const unifiedMessages: UnifiedMessage[] = useMemo(() => {
    const directMessages: UnifiedMessage[] = mockChatConversations.map(conv => ({
      ...conv,
      type: 'direct' as MessageType,
      priority: 'normal' as const,
      starred: false,
      archived: false,
    }));

    const announcements: UnifiedMessage[] = [
      {
        studentId: 'announcement_1',
        studentName: 'Course Announcement',
        studentAvatar: undefined,
        lastMessage: 'New assignment posted for React Mastery course',
        lastMessageTime: '2h ago',
        unreadCount: 5,
        messages: [],
        type: 'announcement',
        priority: 'high',
        starred: false,
        archived: false,
        courseId: '1',
        courseName: 'React Mastery',
      },
      {
        studentId: 'announcement_2',
        studentName: 'Course Update',
        studentAvatar: undefined,
        lastMessage: 'Module 3 content has been updated',
        lastMessageTime: '1d ago',
        unreadCount: 0,
        messages: [],
        type: 'announcement',
        priority: 'normal',
        starred: true,
        archived: false,
        courseId: '2',
        courseName: 'Node.js Advanced',
      },
    ];

    const feedbackMessages: UnifiedMessage[] = [
      {
        studentId: 'feedback_1',
        studentName: 'Assignment Feedback',
        studentAvatar: undefined,
        lastMessage: 'Feedback on "Building REST APIs" assignment',
        lastMessageTime: '3h ago',
        unreadCount: 1,
        messages: [],
        type: 'feedback',
        priority: 'normal',
        starred: false,
        archived: false,
        courseId: '2',
        courseName: 'Node.js Advanced',
      },
    ];

    const notifications: UnifiedMessage[] = [
      {
        studentId: 'notification_1',
        studentName: 'System Notification',
        studentAvatar: undefined,
        lastMessage: 'New student enrolled in your course',
        lastMessageTime: '5h ago',
        unreadCount: 0,
        messages: [],
        type: 'notification',
        priority: 'low',
        starred: false,
        archived: false,
      },
    ];

    return [...directMessages, ...announcements, ...feedbackMessages, ...notifications];
  }, []);

  const filteredMessages = useMemo(() => {
    let filtered = unifiedMessages;

    // Filter by message type
    if (messageType !== 'all') {
      filtered = filtered.filter(msg => msg.type === messageType);
    }

    // Filter by filter type
    if (filterType === 'unread') {
      filtered = filtered.filter(msg => msg.unreadCount > 0);
    } else if (filterType === 'starred') {
      filtered = filtered.filter(msg => msg.starred);
    } else if (filterType === 'archived') {
      filtered = filtered.filter(msg => msg.archived);
    }

    // Filter by course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(msg => msg.courseId === selectedCourse);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(msg =>
        msg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [unifiedMessages, messageType, filterType, selectedCourse, searchQuery]);

  const totalUnread = useMemo(
    () => unifiedMessages.reduce((sum, msg) => sum + msg.unreadCount, 0),
    [unifiedMessages]
  );

  const currentMessage = filteredMessages.find(msg => msg.studentId === selectedMessage);

  const getMessageTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'direct':
        return <MessageSquare className="w-4 h-4" />;
      case 'announcement':
        return <Bell className="w-4 h-4" />;
      case 'feedback':
        return <FileText className="w-4 h-4" />;
      case 'notification':
        return <Mail className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getMessageTypeColor = (type: MessageType) => {
    switch (type) {
      case 'direct':
        return 'text-slate-600 dark:text-slate-400';
      case 'announcement':
        return 'text-slate-600 dark:text-slate-400';
      case 'feedback':
        return 'text-slate-600 dark:text-slate-400';
      case 'notification':
        return 'text-slate-600 dark:text-slate-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-2">
            Unified Inbox
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            All your messages, announcements, and notifications in one place
          </p>
        </div>
        {totalUnread > 0 && (
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-sm font-semibold text-slate-900 dark:text-foreground">
              {totalUnread} unread
            </span>
          </div>
        )}
      </div>

      <div className="flex h-[calc(100vh-250px)] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-card dark:bg-slate-800">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900/50">
          {/* Search & Filters */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300 dark:border-slate-700"
              />
            </div>

            {/* Message Type Filters */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'direct', 'announcement', 'feedback', 'notification'] as MessageType[]).map((type) => (
                <Button
                  key={type}
                  variant={messageType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMessageType(type)}
                  className={`text-xs ${
                    messageType === type
                      ? 'bg-slate-700 dark:bg-slate-600 text-white border-0'
                      : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'unread', 'starred', 'archived'] as FilterType[]).map((filter) => (
                <Button
                  key={filter}
                  variant={filterType === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(filter)}
                  className={`text-xs ${
                    filterType === filter
                      ? 'bg-slate-700 dark:bg-slate-600 text-white border-0'
                      : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">
                  {searchQuery ? 'No messages found' : 'No messages'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredMessages.map((message) => (
                  <button
                    key={message.studentId}
                    onClick={() => setSelectedMessage(message.studentId)}
                    className={`w-full p-4 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      selectedMessage === message.studentId
                        ? 'bg-slate-100 dark:bg-slate-800 border-l-4 border-slate-600 dark:border-slate-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-300 dark:border-slate-600 ${
                        message.priority === 'high' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {getMessageTypeIcon(message.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-slate-900 dark:text-foreground truncate text-sm">
                            {message.studentName}
                          </h4>
                          {message.starred && (
                            <Star className="w-4 h-4 text-slate-600 dark:text-slate-400 fill-slate-600 dark:fill-slate-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate mb-1">
                          {message.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {message.lastMessageTime}
                          </p>
                          {message.unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-slate-700 dark:bg-slate-600 text-white text-xs rounded-full flex-shrink-0">
                              {message.unreadCount}
                            </span>
                          )}
                        </div>
                        {message.courseName && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {message.courseName}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col">
          {currentMessage ? (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600 ${
                      currentMessage.priority === 'high' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {getMessageTypeIcon(currentMessage.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-foreground">
                        {currentMessage.studentName}
                      </h4>
                      {currentMessage.courseName && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {currentMessage.courseName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Star className={`w-4 h-4 ${currentMessage.starred ? 'fill-slate-600 dark:fill-slate-400' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/30">
                <div className="max-w-3xl mx-auto">
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-6">
                      <p className="text-slate-900 dark:text-foreground">
                        {currentMessage.lastMessage}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                        {currentMessage.lastMessageTime}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">
                  Select a message to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


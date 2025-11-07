"use client";

import { useState } from 'react';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Video, MessageSquare, UserCheck } from 'lucide-react';
import { MentorClass, ChatMessage, Attendance } from '@/store/features/classes/classesSlice';

interface LiveClassModalProps {
  classId: string;
  classItem: MentorClass;
  dispatch: any;
  onClose: () => void;
  chatMessages: ChatMessage[];
  attendance: Attendance[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export function LiveClassModal({
  classId,
  classItem,
  dispatch,
  onClose,
  chatMessages,
  attendance,
  chatInput,
  onChatInputChange,
  onSendMessage,
}: LiveClassModalProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'chat' | 'attendance'>('video');

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{classItem.topic}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {classItem.date} at {classItem.time} • {classItem.duration} min
            </p>
          </div>
          <Button onClick={onClose} variant="outline" className="border-slate-200 dark:border-slate-700">
            End Class
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'video'
                ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Live Video
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'chat'
                ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Chat ({chatMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'attendance'
                ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <UserCheck className="w-4 h-4 inline mr-2" />
            Attendance ({attendance.length}/{classItem.enrolledStudents.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Video/Platform Embed */}
          {activeTab === 'video' && (
            <div className="flex-1 p-4 bg-slate-900 flex items-center justify-center">
              {classItem.platform === 'zoom' ? (
                <div className="text-white text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Zoom Meeting Active</p>
                  <p className="text-sm opacity-75 mb-4">Meeting ID: {classItem.meetingId}</p>
                  <a
                    href={classItem.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Open in Zoom
                  </a>
                </div>
              ) : (
                <iframe
                  src={`https://meet.jit.si/${classItem.meetingId}`}
                  allow="camera; microphone; fullscreen; speaker; display-capture"
                  className="w-full h-full rounded"
                />
              )}
            </div>
          )}

          {/* Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatMessages.map((message) => (
                  <div key={message.id} className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {message.senderName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white">{message.message}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => onChatInputChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={onSendMessage} className="bg-green-600 hover:bg-green-700">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Attendance */}
          {activeTab === 'attendance' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {classItem.enrolledStudents.map((student) => {
                  const attendanceRecord = attendance.find(
                    a => a.studentId === student.id && a.classId === classId
                  );
                  return (
                    <div
                      key={student.id}
                      className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {attendanceRecord?.joinedAt ? (
                          <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                            <UserCheck className="w-4 h-4 mr-1" />
                            Present
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500 dark:text-slate-400">Not joined</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


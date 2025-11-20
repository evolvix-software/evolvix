"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  MessageSquare,
  Send,
  Search,
  User,
  ArrowLeft,
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react';
import { ChatConversation, ChatMessage } from '@/interfaces/students';

interface DirectMessagesProps {
  conversations: ChatConversation[];
  mentorId: string;
  onSendMessage: (studentId: string, message: string) => void;
  onBack?: () => void;
}

export function DirectMessages({
  conversations,
  mentorId,
  onSendMessage,
  onBack
}: DirectMessagesProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversations.length > 0 ? conversations[0].studentId : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(conv =>
    conv.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(
    conv => conv.studentId === selectedConversation
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    onSendMessage(selectedConversation, messageInput.trim());
    setMessageInput('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-200px)] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-card dark:bg-slate-800">
      {/* Conversations List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900/50">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </h3>
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-slate-600 dark:text-slate-400"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.studentId}
                  onClick={() => setSelectedConversation(conversation.studentId)}
                  className={`w-full p-4 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    selectedConversation === conversation.studentId
                      ? 'bg-slate-100 dark:bg-slate-800 border-l-4 border-slate-600 dark:border-slate-500'
                      : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {conversation.studentAvatar ? (
                      <img
                        src={conversation.studentAvatar}
                        alt={conversation.studentName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-300 dark:border-slate-600">
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">
                          {conversation.studentName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-900 dark:text-foreground truncate">
                          {conversation.studentName}
                        </h4>
                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-slate-700 dark:bg-slate-600 text-white text-xs rounded-full flex-shrink-0">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {conversation.lastMessageTime}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentConversation.studentAvatar ? (
                    <img
                      src={currentConversation.studentAvatar}
                      alt={currentConversation.studentName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">
                        {currentConversation.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-foreground">
                      {currentConversation.studentName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/30">
              {currentConversation.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {currentConversation.messages.map((message) => {
                    const isMentor = message.sender === 'mentor';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMentor ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isMentor
                              ? 'bg-slate-700 dark:bg-slate-600 text-white'
                              : 'bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <span className="text-xs text-slate-200 dark:text-slate-300">
                              {formatTime(message.timestamp)}
                            </span>
                            {isMentor && (
                              <span className="text-slate-200 dark:text-slate-300">
                                {message.read ? (
                                  <CheckCheck className="w-3 h-3" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


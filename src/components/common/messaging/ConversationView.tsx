"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Conversation, Message, Attachment } from '@/interfaces/messaging';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { 
  ArrowLeft, MoreVertical, Phone, Video, Info, 
  Search, Archive, Volume2, VolumeX, Trash2
} from 'lucide-react';
import { cn } from '@/utils';

export interface ConversationViewProps {
  conversation: Conversation | null;
  currentUserId: string;
  replyTo?: {
    messageId: string;
    senderName: string;
    content: string;
  };
  onBack?: () => void;
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  onReply?: (messageId: string) => void;
  onCancelReply?: () => void;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onArchive?: () => void;
  onMute?: () => void;
  onDeleteConversation?: () => void;
  className?: string;
}

export function ConversationView({
  conversation,
  currentUserId,
  replyTo,
  onBack,
  onSendMessage,
  onReply,
  onCancelReply,
  onReact,
  onEdit,
  onDelete,
  onArchive,
  onMute,
  onDeleteConversation,
  className,
}: ConversationViewProps) {
  const [messageInput, setMessageInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSend = (content: string, attachments?: Attachment[]) => {
    if (!content.trim() && !attachments?.length) return;
    onSendMessage(content, attachments);
    setMessageInput('');
  };

  if (!conversation) {
    return (
      <div className={cn('flex-1 flex items-center justify-center bg-card', className)}>
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Select a conversation
          </p>
          <p className="text-xs text-muted-foreground">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full bg-card', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-muted dark:hover:bg-secondary rounded-lg transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {conversation.participantAvatar ? (
              <img
                src={conversation.participantAvatar}
                alt={conversation.participantName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white font-semibold">
                {conversation.participantName.charAt(0).toUpperCase()}
              </div>
            )}
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card dark:border-slate-800 rounded-full" />
            )}
          </div>

          {/* Participant Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-foreground truncate">
              {conversation.participantName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {conversation.isOnline ? 'Online' : conversation.lastActive ? `Active ${conversation.lastActive}` : 'Offline'}
              {conversation.isTyping && ' • Typing...'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-20 min-w-[200px]">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Navigate to conversation info
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    Conversation Info
                  </button>
                  {onMute && (
                    <button
                      onClick={() => {
                        onMute();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      {conversation.isMuted ? (
                        <>
                          <Volume2 className="w-4 h-4" />
                          Unmute
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-4 h-4" />
                          Mute
                        </>
                      )}
                    </button>
                  )}
                  {onArchive && (
                    <button
                      onClick={() => {
                        onArchive();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" />
                      {conversation.isArchived ? 'Unarchive' : 'Archive'}
                    </button>
                  )}
                  {onDeleteConversation && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this conversation?')) {
                          onDeleteConversation();
                        }
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Conversation
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900"
      >
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              No messages yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          <div className="py-4">
            {conversation.messages.map((message, index) => {
              const prevMessage = index > 0 ? conversation.messages[index - 1] : null;
              const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
              const showTimestamp = !prevMessage || 
                (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) > 300000; // 5 minutes

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  showAvatar={showAvatar}
                  showTimestamp={showTimestamp}
                  onReply={onReply}
                  onReact={onReact}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput
        value={messageInput}
        onChange={setMessageInput}
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={onCancelReply}
        placeholder={`Message ${conversation.participantName}...`}
      />
    </div>
  );
}


"use client";

import React, { useState, useCallback } from 'react';
import { Conversation, Message, Attachment, MessagingFilters } from '@/interfaces/messaging';
import { MessageList } from './MessageList';
import { ConversationView } from './ConversationView';
import { X } from 'lucide-react';
import { cn } from '@/utils';

export interface MessagingProps {
  conversations: Conversation[];
  currentUserId: string;
  onSendMessage: (conversationId: string, content: string, attachments?: Attachment[]) => void;
  onReactToMessage?: (conversationId: string, messageId: string, emoji: string) => void;
  onEditMessage?: (conversationId: string, messageId: string, content: string) => void;
  onDeleteMessage?: (conversationId: string, messageId: string) => void;
  onPinConversation?: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
  onMuteConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onClose?: () => void;
  className?: string;
  defaultTab?: 'focused' | 'other' | 'archived';
  showCloseButton?: boolean;
  initialConversationId?: string | null; // For pre-selecting a conversation
}

export function Messaging({
  conversations,
  currentUserId,
  onSendMessage,
  onReactToMessage,
  onEditMessage,
  onDeleteMessage,
  onPinConversation,
  onArchiveConversation,
  onMuteConversation,
  onDeleteConversation,
  onClose,
  className,
  defaultTab = 'focused',
  showCloseButton = false,
  initialConversationId,
}: MessagingProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    initialConversationId !== undefined 
      ? initialConversationId 
      : conversations.length > 0 ? conversations[0].id : null
  );
  
  // Update selected conversation when initialConversationId changes
  React.useEffect(() => {
    if (initialConversationId !== undefined) {
      setSelectedConversationId(initialConversationId);
    }
  }, [initialConversationId]);
  const [filters, setFilters] = useState<MessagingFilters>({
    tab: defaultTab,
    search: '',
    unreadOnly: false,
  });
  const [replyTo, setReplyTo] = useState<{
    messageId: string;
    senderName: string;
    content: string;
  } | undefined>();

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  const handleSendMessage = useCallback((content: string, attachments?: Attachment[]) => {
    if (!selectedConversationId) return;
    onSendMessage(selectedConversationId, content, attachments);
    setReplyTo(undefined);
  }, [selectedConversationId, onSendMessage]);

  const handleReact = useCallback((messageId: string, emoji: string) => {
    if (!selectedConversationId || !onReactToMessage) return;
    onReactToMessage(selectedConversationId, messageId, emoji);
  }, [selectedConversationId, onReactToMessage]);

  const handleEdit = useCallback((messageId: string, content: string) => {
    if (!selectedConversationId || !onEditMessage) return;
    onEditMessage(selectedConversationId, messageId, content);
  }, [selectedConversationId, onEditMessage]);

  const handleDelete = useCallback((messageId: string) => {
    if (!selectedConversationId || !onDeleteMessage) return;
    if (confirm('Are you sure you want to delete this message?')) {
      onDeleteMessage(selectedConversationId, messageId);
    }
  }, [selectedConversationId, onDeleteMessage]);

  const handleReply = useCallback((messageId: string) => {
    if (!selectedConversation) return;
    const message = selectedConversation.messages.find(m => m.id === messageId);
    if (message) {
      setReplyTo({
        messageId: message.id,
        senderName: message.senderName,
        content: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
      });
    }
  }, [selectedConversation]);

  const handleArchive = useCallback(() => {
    if (!selectedConversationId || !onArchiveConversation) return;
    onArchiveConversation(selectedConversationId);
  }, [selectedConversationId, onArchiveConversation]);

  const handleMute = useCallback(() => {
    if (!selectedConversationId || !onMuteConversation) return;
    onMuteConversation(selectedConversationId);
  }, [selectedConversationId, onMuteConversation]);

  const handleDeleteConversation = useCallback(() => {
    if (!selectedConversationId || !onDeleteConversation) return;
    onDeleteConversation(selectedConversationId);
    setSelectedConversationId(null);
  }, [selectedConversationId, onDeleteConversation]);

  return (
    <div className={cn('flex h-full bg-card dark:bg-slate-800 rounded-lg overflow-hidden', className)}>
      {/* Close Button */}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      )}

      {/* Message List */}
      <div className="w-full md:w-96 lg:w-[400px] flex-shrink-0 border-r border-slate-200 dark:border-slate-700">
        <MessageList
          conversations={conversations}
          selectedConversationId={selectedConversationId || undefined}
          filters={filters}
          currentUserId={currentUserId}
          onSelectConversation={setSelectedConversationId}
          onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
          onTabChange={(tab) => setFilters(prev => ({ ...prev, tab }))}
          onPinConversation={onPinConversation}
          onArchiveConversation={onArchiveConversation}
          onMuteConversation={onMuteConversation}
        />
      </div>

      {/* Conversation View */}
      <div className="flex-1 min-w-0 hidden md:flex">
        <ConversationView
          conversation={selectedConversation}
          currentUserId={currentUserId}
          replyTo={replyTo}
          onBack={() => setSelectedConversationId(null)}
          onSendMessage={handleSendMessage}
          onReply={handleReply}
          onCancelReply={() => setReplyTo(undefined)}
          onReact={handleReact}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onMute={handleMute}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Mobile: Show conversation in full screen */}
      {selectedConversationId && (
        <div className="flex-1 md:hidden absolute inset-0 z-20 bg-card dark:bg-slate-800">
          <ConversationView
            conversation={selectedConversation}
            currentUserId={currentUserId}
            replyTo={replyTo}
            onBack={() => setSelectedConversationId(null)}
            onSendMessage={handleSendMessage}
            onReply={handleReply}
            onCancelReply={() => setReplyTo(undefined)}
            onReact={handleReact}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onMute={handleMute}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>
      )}
    </div>
  );
}


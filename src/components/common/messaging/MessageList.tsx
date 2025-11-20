"use client";

import React, { useState, useMemo } from 'react';
import { Conversation, MessagingFilters } from '@/interfaces/messaging';
import { 
  Search, MoreVertical, Pin, Archive, Volume2, VolumeX,
  CheckCircle2, Circle, Filter, X
} from 'lucide-react';
import { cn } from '@/utils';

export interface MessageListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  filters: MessagingFilters;
  currentUserId: string;
  onSelectConversation: (conversationId: string) => void;
  onSearchChange: (search: string) => void;
  onTabChange: (tab: 'focused' | 'other' | 'archived') => void;
  onPinConversation?: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
  onMuteConversation?: (conversationId: string) => void;
  className?: string;
}

export function MessageList({
  conversations,
  selectedConversationId,
  filters,
  currentUserId,
  onSelectConversation,
  onSearchChange,
  onTabChange,
  onPinConversation,
  onArchiveConversation,
  onMuteConversation,
  className,
}: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Filter by tab
    if (filters.tab === 'focused') {
      filtered = filtered.filter(c => !c.isArchived && c.isPinned);
    } else if (filters.tab === 'other') {
      filtered = filtered.filter(c => !c.isArchived && !c.isPinned);
    } else if (filters.tab === 'archived') {
      filtered = filtered.filter(c => c.isArchived);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.participantName.toLowerCase().includes(query) ||
        c.lastMessage?.content.toLowerCase().includes(query)
      );
    }

    // Filter by unread only
    if (filters.unreadOnly) {
      filtered = filtered.filter(c => c.unreadCount > 0);
    }

    // Sort: pinned first, then by last message time
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return bTime - aTime;
    });
  }, [conversations, filters, searchQuery]);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays < 7) return `${diffDays}d`;
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <div className={cn('flex flex-col h-full bg-card border-r border-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Messaging</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/20 focus:border-[#635bff] dark:focus:border-[#735fff]"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
            >
              <X className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={filters.unreadOnly}
                  onChange={(e) => onSearchChange(searchQuery)} // This should update filters
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary dark:text-primary focus:ring-[#635bff] dark:focus:ring-[#735fff]"
                />
                Unread only
              </label>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          <button
            onClick={() => onTabChange('focused')}
            className={cn(
              'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              filters.tab === 'focused'
                ? 'bg-gradient-to-r from-primary to-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted dark:hover:bg-secondary'
            )}
          >
            Focused
          </button>
          <button
            onClick={() => onTabChange('other')}
            className={cn(
              'flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              filters.tab === 'other'
                ? 'bg-gradient-to-r from-primary to-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted dark:hover:bg-secondary'
            )}
          >
            Other
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              No conversations found
            </p>
            <p className="text-xs text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  'w-full p-4 text-left hover:bg-muted dark:hover:bg-secondary/50 transition-colors relative',
                  selectedConversationId === conversation.id && 'bg-gradient-to-r from-primary/10 to-primary/10 dark:from-primary/20 dark:to-primary/20 border-l-4 border-primary'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {conversation.participantAvatar ? (
                      <img
                        src={conversation.participantAvatar}
                        alt={conversation.participantName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {conversation.participantName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                    )}
                    {conversation.isTyping && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {conversation.participantName}
                        </h3>
                        {conversation.isPinned && (
                          <Pin className="w-3 h-3 text-primary flex-shrink-0" />
                        )}
                        {conversation.isMuted && (
                          <VolumeX className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-primary to-primary text-primary-foreground text-xs font-semibold rounded-full flex-shrink-0">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


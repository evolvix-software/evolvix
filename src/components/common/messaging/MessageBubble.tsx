"use client";

import React, { useState } from 'react';
import { Message, MessageReaction } from '@/interfaces/messaging';
import { 
  Check, CheckCheck, MoreVertical, Reply, Trash2, Edit2,
  Smile, Image as ImageIcon, Download, X
} from 'lucide-react';
import { cn } from '@/utils';
// Date formatting utility
const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  currentUserId: string;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  onReply,
  onReact,
  onEdit,
  onDelete,
  currentUserId,
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp));
    } catch {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(false);
  };

  const handleReaction = (emoji: string) => {
    onReact?.(message.id, emoji);
    setShowReactions(false);
  };

  const hasUserReacted = (emoji: string) => {
    return message.reactions?.some(r => r.emoji === emoji && r.userId === currentUserId);
  };

  return (
    <div
      className={cn(
        'group flex items-start gap-3 px-4 py-2 hover:bg-muted/50 dark:hover:bg-secondary/30 transition-colors',
        isOwn && 'flex-row-reverse'
      )}
    >
      {/* Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {message.senderName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn('flex-1 min-w-0', isOwn && 'flex flex-col items-end')}>
        {/* Sender Name & Time */}
        {(showTimestamp || !isOwn) && (
          <div className={cn('flex items-center gap-2 mb-1', isOwn && 'flex-row-reverse')}>
            {!isOwn && (
              <span className="text-xs font-semibold text-foreground/90">
                {message.senderName}
              </span>
            )}
            {showTimestamp && (
              <span className="text-xs text-muted-foreground">
                {formatTime(message.timestamp)}
              </span>
            )}
            {message.edited && (
              <span className="text-xs text-muted-foreground/70 italic">
                (edited)
              </span>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div className="relative">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEdit();
                  if (e.key === 'Escape') {
                    setIsEditing(false);
                    setEditContent(message.content);
                  }
                }}
                className="flex-1 px-3 py-2 bg-card border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <button
                onClick={handleEdit}
                className="p-1.5 text-primary hover:bg-muted dark:hover:bg-secondary rounded"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
                className="p-1.5 text-muted-foreground hover:bg-muted dark:hover:bg-secondary rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className={cn(
                'relative inline-block max-w-[70%] rounded-2xl px-4 py-2.5',
                isOwn
                  ? 'bg-gradient-to-r from-primary to-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border shadow-sm'
              )}
            >
              {/* Message Content */}
              {message.type === 'text' && (
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              )}

              {message.type === 'image' && message.attachments && (
                <div className="space-y-2">
                  {message.content && (
                    <p className="text-sm whitespace-pre-wrap break-words mb-2">{message.content}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    {message.attachments.map((attachment) => (
                      <img
                        key={attachment.id}
                        src={attachment.url}
                        alt={attachment.name}
                        className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {message.type === 'file' && message.attachments && (
                <div className="space-y-2">
                  {message.content && (
                    <p className="text-sm whitespace-pre-wrap break-words mb-2">{message.content}</p>
                  )}
                  {message.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      download={attachment.name}
                      className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{attachment.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(
                    message.reactions.reduce((acc, r) => {
                      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border transition-colors',
                        hasUserReacted(emoji)
                          ? 'bg-primary/20 dark:bg-primary/20 border-[#635bff] dark:border-[#735fff]'
                          : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                      )}
                    >
                      <span>{emoji}</span>
                      <span>{count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Read Receipt */}
              {isOwn && (
                <div className="flex items-center justify-end gap-1 mt-1">
                  {message.read ? (
                    <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Message Actions Menu */}
          {!isEditing && (
            <div
              className={cn(
                'absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity',
                isOwn ? 'right-full mr-2' : 'left-full ml-2'
              )}
            >
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 bg-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute top-full mt-1 right-0 bg-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-20 min-w-[160px]">
                      {onReply && (
                        <button
                          onClick={() => {
                            onReply(message.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                      )}
                      {onReact && (
                        <button
                          onClick={() => {
                            setShowReactions(true);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                          <Smile className="w-4 h-4" />
                          React
                        </button>
                      )}
                      {isOwn && onEdit && (
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                      {isOwn && onDelete && (
                        <button
                          onClick={() => {
                            onDelete(message.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reactions Popup */}
        {showReactions && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowReactions(false)}
            />
            <div className="absolute top-full mt-1 bg-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-2 z-20 flex gap-1">
              {EMOJI_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


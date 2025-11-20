"use client";

import React, { useState, useRef, useCallback } from 'react';
import { 
  Send, Paperclip, Image as ImageIcon, Smile, 
  X, FileText, Video, Music, File
} from 'lucide-react';
import { cn } from '@/utils';
import { Attachment } from '@/interfaces/messaging';

export interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (content: string, attachments?: Attachment[]) => void;
  onAttachment?: (files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  replyTo?: {
    messageId: string;
    senderName: string;
    content: string;
  };
  onCancelReply?: () => void;
  className?: string;
}

const EMOJI_LIST = ['😀', '😂', '🥰', '😍', '🤔', '😎', '👍', '❤️', '🎉', '🔥', '💯', '✨'];

export function MessageInput({
  value,
  onChange,
  onSend,
  onAttachment,
  placeholder = 'Write a message...',
  disabled = false,
  replyTo,
  onCancelReply,
  className,
}: MessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if ((!value.trim() && attachments.length === 0) || disabled) return;

    const messageAttachments: Attachment[] = attachments.map((file, index) => ({
      id: `attachment-${Date.now()}-${index}`,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' :
            file.type.startsWith('audio/') ? 'audio' : 'file',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    onSend(value.trim(), messageAttachments);
    onChange('');
    setAttachments([]);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, attachments, disabled, onSend, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
      onAttachment?.(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const insertEmoji = (emoji: string) => {
    onChange(value + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className={cn('border-t border-border bg-card', className)}>
      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Replying to {replyTo.senderName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {replyTo.content}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="relative group flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"
              >
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => removeAttachment(index)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-muted dark:hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none max-h-[120px] overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '40px' }}
            />
          </div>

          {/* Emoji Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-muted dark:hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {showEmojiPicker && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 bg-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-3 z-20 grid grid-cols-4 gap-2">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => insertEmoji(emoji)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xl transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={disabled || (!value.trim() && attachments.length === 0)}
            className="p-2 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


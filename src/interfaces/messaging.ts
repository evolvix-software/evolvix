/**
 * Messaging System Types
 * LinkedIn-style messaging with enhanced features
 */

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  readAt?: string;
  type: 'text' | 'image' | 'file' | 'gif' | 'post' | 'system';
  attachments?: Attachment[];
  reactions?: MessageReaction[];
  replyTo?: string; // Message ID this is replying to
  edited?: boolean;
  editedAt?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  name: string;
  size: number;
  thumbnail?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole?: 'student' | 'mentor' | 'admin';
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  isTyping?: boolean;
  lastActive?: string;
  isOnline?: boolean;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface MessagingFilters {
  search?: string;
  tab: 'focused' | 'other' | 'archived';
  unreadOnly?: boolean;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
}


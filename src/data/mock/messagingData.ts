/**
 * Mock Messaging Data
 * Sample data for testing the messaging component
 */

import { Conversation, Message } from '@/interfaces/messaging';

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    senderName: 'Alex Thompson',
    senderAvatar: undefined,
    content: 'Hi! I wanted to discuss the project assignment.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: true,
    type: 'text',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'You',
    senderAvatar: undefined,
    content: 'Sure! What would you like to know?',
    timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
    read: true,
    type: 'text',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-2',
    senderName: 'Alex Thompson',
    senderAvatar: undefined,
    content: 'I need help with the React hooks implementation.',
    timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
    read: true,
    type: 'text',
    reactions: [
      { emoji: '👍', userId: 'user-1', userName: 'You' },
    ],
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'user-1',
    senderName: 'You',
    senderAvatar: undefined,
    content: 'I can help you with that! Let me share some resources.',
    timestamp: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
    read: true,
    type: 'text',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'user-2',
    participantName: 'Alex Thompson',
    participantAvatar: undefined,
    participantRole: 'student',
    lastMessage: mockMessages[mockMessages.length - 1],
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    isOnline: true,
    lastActive: '2m ago',
    messages: mockMessages,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'conv-2',
    participantId: 'user-3',
    participantName: 'Sarah Johnson',
    participantAvatar: undefined,
    participantRole: 'mentor',
    lastMessage: {
      id: 'msg-5',
      conversationId: 'conv-2',
      senderId: 'user-3',
      senderName: 'Sarah Johnson',
      content: 'Great work on the assignment!',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      read: false,
      type: 'text',
    },
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    isOnline: false,
    messages: [
      {
        id: 'msg-5',
        conversationId: 'conv-2',
        senderId: 'user-3',
        senderName: 'Sarah Johnson',
        content: 'Great work on the assignment!',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        type: 'text',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'conv-3',
    participantId: 'user-4',
    participantName: 'Mike Chen',
    participantAvatar: undefined,
    participantRole: 'student',
    lastMessage: {
      id: 'msg-6',
      conversationId: 'conv-3',
      senderId: 'user-1',
      senderName: 'You',
      content: 'Thanks for the help!',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      read: true,
      type: 'text',
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    isOnline: true,
    lastActive: '5m ago',
    messages: [
      {
        id: 'msg-6',
        conversationId: 'conv-3',
        senderId: 'user-1',
        senderName: 'You',
        content: 'Thanks for the help!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        type: 'text',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];


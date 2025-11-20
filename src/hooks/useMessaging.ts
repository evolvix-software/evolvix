"use client";

import { useState, useCallback, useEffect } from 'react';
import { Conversation, Message, Attachment } from '@/interfaces/messaging';
import { mockConversations } from '@/data/mock/messagingData';

export function useMessaging(currentUserId: string) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  // Load conversations from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem('evolvix_messaging_conversations');
    if (stored) {
      try {
        setConversations(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading conversations:', e);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('evolvix_messaging_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Send a message
  const handleSendMessage = useCallback((conversationId: string, content: string, attachments?: Attachment[]) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        conversationId,
        senderId: currentUserId,
        senderName: 'You',
        senderAvatar: undefined,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        type: attachments && attachments.length > 0 
          ? (attachments[0].type === 'image' ? 'image' : 'file')
          : 'text',
        attachments,
        reactions: [],
        edited: false,
      };

      return {
        ...conv,
        messages: [...conv.messages, newMessage],
        lastMessage: newMessage,
        updatedAt: new Date().toISOString(),
        unreadCount: conv.participantId === currentUserId ? conv.unreadCount : conv.unreadCount + 1,
      };
    }));
  }, [currentUserId]);

  // React to a message
  const handleReactToMessage = useCallback((conversationId: string, messageId: string, emoji: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      return {
        ...conv,
        messages: conv.messages.map(msg => {
          if (msg.id !== messageId) return msg;

          const existingReactionIndex = msg.reactions?.findIndex(
            r => r.emoji === emoji && r.userId === currentUserId
          ) ?? -1;

          let updatedReactions = [...(msg.reactions || [])];

          if (existingReactionIndex >= 0) {
            // Remove reaction if already exists
            updatedReactions = updatedReactions.filter(
              r => !(r.emoji === emoji && r.userId === currentUserId)
            );
          } else {
            // Add reaction
            updatedReactions.push({
              emoji,
              userId: currentUserId,
              userName: 'You',
            });
          }

          return {
            ...msg,
            reactions: updatedReactions,
          };
        }),
      };
    }));
  }, [currentUserId]);

  // Edit a message
  const handleEditMessage = useCallback((conversationId: string, messageId: string, content: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      return {
        ...conv,
        messages: conv.messages.map(msg => {
          if (msg.id !== messageId) return msg;
          return {
            ...msg,
            content,
            edited: true,
          };
        }),
      };
    }));
  }, []);

  // Delete a message
  const handleDeleteMessage = useCallback((conversationId: string, messageId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;

      const updatedMessages = conv.messages.filter(msg => msg.id !== messageId);
      const lastMessage = updatedMessages.length > 0 
        ? updatedMessages[updatedMessages.length - 1]
        : undefined;

      return {
        ...conv,
        messages: updatedMessages,
        lastMessage,
      };
    }));
  }, []);

  // Pin a conversation
  const handlePinConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        isPinned: !conv.isPinned,
      };
    }));
  }, []);

  // Archive a conversation
  const handleArchiveConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        isArchived: !conv.isArchived,
        isPinned: conv.isArchived ? conv.isPinned : false, // Unpin when archiving
      };
    }));
  }, []);

  // Mute a conversation
  const handleMuteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        isMuted: !conv.isMuted,
      };
    }));
  }, []);

  // Delete a conversation
  const handleDeleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
  }, []);

  // Mark messages as read
  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        unreadCount: 0,
        messages: conv.messages.map(msg => ({
          ...msg,
          read: true,
        })),
      };
    }));
  }, []);

  return {
    conversations,
    handleSendMessage,
    handleReactToMessage,
    handleEditMessage,
    handleDeleteMessage,
    handlePinConversation,
    handleArchiveConversation,
    handleMuteConversation,
    handleDeleteConversation,
    markAsRead,
  };
}


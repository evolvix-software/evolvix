# Messaging Component

A LinkedIn-style messaging UI component with enhanced features, built for the Evolvix portal.

## Features

- ✅ **LinkedIn-style UI** with modern design
- ✅ **Real-time messaging** with read receipts
- ✅ **Message reactions** (emoji)
- ✅ **Reply to messages**
- ✅ **Edit and delete** messages
- ✅ **File attachments** (images, videos, documents)
- ✅ **Emoji picker**
- ✅ **Search conversations**
- ✅ **Focused/Other tabs** (like LinkedIn)
- ✅ **Pin conversations**
- ✅ **Archive conversations**
- ✅ **Mute conversations**
- ✅ **Typing indicators**
- ✅ **Online/offline status**
- ✅ **Unread badges**
- ✅ **Dark mode support**
- ✅ **Responsive design** (mobile-friendly)

## Components

### FloatingMessaging (Recommended - LinkedIn Style)
A floating window version that appears as a popup, similar to LinkedIn's messaging.

**Features:**
- ✅ Floating button to open/close
- ✅ Draggable window
- ✅ Resizable window
- ✅ Minimize/maximize
- ✅ Position configurable (bottom-right, bottom-left, top-right, top-left)
- ✅ Unread badge on button
- ✅ Backdrop overlay

```tsx
import { FloatingMessaging } from '@/components/common/messaging';

<FloatingMessaging
  conversations={conversations}
  currentUserId="user-1"
  position="bottom-right"
  initialWidth={420}
  initialHeight={600}
  onSendMessage={(conversationId, content, attachments) => {
    // Handle sending message
  }}
/>
```

### Messaging (Full Page Component)
The main container component for full-page messaging views.

```tsx
import { Messaging } from '@/components/common/messaging';

<Messaging
  conversations={conversations}
  currentUserId="user-1"
  onSendMessage={(conversationId, content, attachments) => {
    // Handle sending message
  }}
  onReactToMessage={(conversationId, messageId, emoji) => {
    // Handle reaction
  }}
  onEditMessage={(conversationId, messageId, content) => {
    // Handle edit
  }}
  onDeleteMessage={(conversationId, messageId) => {
    // Handle delete
  }}
/>
```

### MessageList
Left sidebar showing list of conversations.

### ConversationView
Right side showing the active conversation.

### MessageBubble
Individual message bubble component.

### MessageInput
Input area with attachments, emoji picker, etc.

## Usage Examples

### Floating Messaging (Recommended - LinkedIn Style)

```tsx
"use client";

import { useState } from 'react';
import { FloatingMessaging, Conversation, Attachment } from '@/components/common/messaging';
import { mockConversations } from '@/data/mock/messagingData';

export function App() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  const handleSendMessage = (conversationId: string, content: string, attachments?: Attachment[]) => {
    // Add new message to conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId: 'current-user-id',
          senderName: 'You',
          content,
          timestamp: new Date().toISOString(),
          read: false,
          type: attachments?.length ? (attachments[0].type === 'image' ? 'image' : 'file') : 'text',
          attachments,
        };
        return {
          ...conv,
          lastMessage: newMessage,
          messages: [...conv.messages, newMessage],
          updatedAt: new Date().toISOString(),
        };
      }
      return conv;
    }));
  };

  return (
    <div>
      {/* Your app content */}
      
      {/* Floating Messaging Widget */}
      <FloatingMessaging
        conversations={conversations}
        currentUserId="current-user-id"
        onSendMessage={handleSendMessage}
        position="bottom-right" // or 'bottom-left', 'top-right', 'top-left'
        initialWidth={420}
        initialHeight={600}
        onReactToMessage={(convId, msgId, emoji) => {
          // Handle reactions
        }}
        onEditMessage={(convId, msgId, content) => {
          // Handle edit
        }}
        onDeleteMessage={(convId, msgId) => {
          // Handle delete
        }}
      />
    </div>
  );
}
```

### Full Page Messaging

```tsx
"use client";

import { useState } from 'react';
import { Messaging, Conversation, Attachment } from '@/components/common/messaging';
import { mockConversations } from '@/data/mock/messagingData';

export function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  const handleSendMessage = (conversationId: string, content: string, attachments?: Attachment[]) => {
    // Add new message to conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId: 'current-user-id',
          senderName: 'You',
          content,
          timestamp: new Date().toISOString(),
          read: false,
          type: attachments?.length ? (attachments[0].type === 'image' ? 'image' : 'file') : 'text',
          attachments,
        };
        return {
          ...conv,
          lastMessage: newMessage,
          messages: [...conv.messages, newMessage],
          updatedAt: new Date().toISOString(),
        };
      }
      return conv;
    }));
  };

  return (
    <div className="h-screen p-4">
      <Messaging
        conversations={conversations}
        currentUserId="current-user-id"
        onSendMessage={handleSendMessage}
        onReactToMessage={(convId, msgId, emoji) => {
          // Handle reactions
        }}
        onEditMessage={(convId, msgId, content) => {
          // Handle edit
        }}
        onDeleteMessage={(convId, msgId) => {
          // Handle delete
        }}
        onPinConversation={(convId) => {
          // Handle pin
        }}
        onArchiveConversation={(convId) => {
          // Handle archive
        }}
        onMuteConversation={(convId) => {
          // Handle mute
        }}
      />
    </div>
  );
}
```

## Props

### Messaging Props
- `conversations`: Array of conversation objects
- `currentUserId`: Current user's ID
- `onSendMessage`: Callback when sending a message
- `onReactToMessage`: Callback when reacting to a message
- `onEditMessage`: Callback when editing a message
- `onDeleteMessage`: Callback when deleting a message
- `onPinConversation`: Callback when pinning a conversation
- `onArchiveConversation`: Callback when archiving a conversation
- `onMuteConversation`: Callback when muting a conversation
- `onDeleteConversation`: Callback when deleting a conversation
- `onClose`: Callback when closing the messaging component
- `defaultTab`: Default tab ('focused' | 'other' | 'archived')
- `showCloseButton`: Show close button
- `className`: Additional CSS classes

## Styling

The component uses your theme colors:
- Primary: `#635bff` / `#735fff` (purple/indigo gradient)
- Backgrounds: White / Dark slate
- Borders: Slate colors
- Fully supports dark mode

## Responsive Design

- Desktop: Side-by-side layout (list + conversation)
- Mobile: Full-screen conversation view with back button
- Tablet: Adaptive layout

## Future Enhancements

- Voice messages
- Video messages
- Message forwarding
- Group conversations
- Message search within conversation
- Rich text formatting
- Code snippets
- Link previews


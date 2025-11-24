"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { User, MessageSquare } from 'lucide-react';

interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  selectedConversation: string | null;
}

export function ConversationList({ onSelectConversation, selectedConversation }: ConversationListProps) {
  // Mock conversations
  const conversations = [
    { id: '1', name: 'Rajesh Kumar', lastMessage: 'Thank you for the scholarship!', unread: 2 },
    { id: '2', name: 'Priya Sharma', lastMessage: 'I have a question about...', unread: 0 },
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                selectedConversation === conv.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-foreground truncate">{conv.name}</p>
                    {conv.unread > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


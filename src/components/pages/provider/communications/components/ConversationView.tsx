"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Send, User } from 'lucide-react';
import { useState } from 'react';

interface ConversationViewProps {
  conversationId: string;
}

export function ConversationView({ conversationId }: ConversationViewProps) {
  const [message, setMessage] = useState('');

  // Mock messages
  const messages = [
    { id: '1', sender: 'scholar', content: 'Thank you for the scholarship opportunity!', time: '10:30 AM' },
    { id: '2', sender: 'provider', content: 'You are welcome! We are excited to support your journey.', time: '10:35 AM' },
  ];

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Scholar Name</h3>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender === 'provider'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p>{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'provider' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setMessage('')}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}


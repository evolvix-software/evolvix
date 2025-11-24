"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Scholar } from '@/data/mock/providerData';
import { MessageSquare, Bell, FileText, Calendar, User } from 'lucide-react';

interface CommunicationsTabProps {
  scholar: Scholar;
}

export function CommunicationsTab({ scholar }: CommunicationsTabProps) {
  // Mock communication data - in real app, this would come from API
  const messages = [
    {
      id: '1',
      type: 'message',
      from: 'Provider',
      to: scholar.profile.name,
      subject: 'Welcome to the Scholarship Program',
      content: 'Congratulations on being awarded the scholarship!',
      date: scholar.awardDate,
    },
    {
      id: '2',
      type: 'message',
      from: scholar.profile.name,
      to: 'Provider',
      subject: 'Thank you',
      content: 'Thank you for this opportunity!',
      date: new Date(new Date(scholar.awardDate).getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const announcements = [
    {
      id: '1',
      title: 'New Course Module Available',
      content: 'A new module has been added to your course.',
      date: new Date().toISOString(),
    },
  ];

  const notes = [
    {
      id: '1',
      author: 'Provider',
      content: 'Scholar showing excellent progress. CGPA improvement noted.',
      date: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Message History */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Message History
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{message.from}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-foreground">{message.to}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground mb-1">{message.subject}</h4>
                  <p className="text-sm text-muted-foreground">{message.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No messages yet</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Send New Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Announcements
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 border border-border rounded-lg bg-primary/5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No announcements</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notes
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{note.author}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No notes yet</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


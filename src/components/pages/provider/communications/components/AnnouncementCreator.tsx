"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { X } from 'lucide-react';

interface AnnouncementCreatorProps {
  onClose: () => void;
}

export function AnnouncementCreator({ onClose }: AnnouncementCreatorProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipientType: 'all',
    deliveryMethod: 'both',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Create Announcement</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="Announcement title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Content</label>
              <textarea
                rows={6}
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                placeholder="Announcement content..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Recipients</label>
              <select
                value={formData.recipientType}
                onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="all">All Scholars</option>
                <option value="campaign">Campaign Specific</option>
                <option value="scholars">Selected Scholars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Delivery Method</label>
              <select
                value={formData.deliveryMethod}
                onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="both">In-app & Email</option>
                <option value="in-app">In-app Only</option>
                <option value="email">Email Only</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">Send Announcement</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


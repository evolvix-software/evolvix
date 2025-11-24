"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';

export function TemplateLibrary() {
  const templates = [
    { id: '1', name: 'Award Letter', category: 'Award Letters', usage: 45 },
    { id: '2', name: 'Congratulations', category: 'Congratulations', usage: 32 },
    { id: '3', name: 'Reminder', category: 'Reminders', usage: 28 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Message Templates</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{template.name}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{template.category}</p>
              <p className="text-xs text-muted-foreground">Used {template.usage} times</p>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


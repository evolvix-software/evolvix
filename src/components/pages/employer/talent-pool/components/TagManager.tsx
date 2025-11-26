"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { X, Plus, Edit2, Trash2, Tag as TagIcon, Palette } from 'lucide-react';

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
  usageCount: number;
}

const tagColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Orange', value: '#f97316' },
];

const tagCategories = ['Role', 'Skill', 'Status', 'Source', 'Custom'];

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onTagCreated: (tag: Tag) => void;
  onTagUpdated: (tag: Tag) => void;
  onTagDeleted: (tagId: string) => void;
  existingTags: Tag[];
}

export function TagManager({ 
  isOpen, 
  onClose, 
  onTagCreated, 
  onTagUpdated, 
  onTagDeleted,
  existingTags 
}: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>(existingTags);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: tagColors[0].value,
    category: tagCategories[0],
  });

  useEffect(() => {
    setTags(existingTags);
  }, [existingTags]);

  if (!isOpen) return null;

  const handleCreateTag = () => {
    if (!formData.name.trim()) {
      alert('Please enter a tag name');
      return;
    }

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: formData.name.trim(),
      color: formData.color,
      category: formData.category,
      usageCount: 0,
    };

    setTags([...tags, newTag]);
    onTagCreated(newTag);
    setFormData({ name: '', color: tagColors[0].value, category: tagCategories[0] });
    setShowCreateForm(false);
  };

  const handleUpdateTag = () => {
    if (!editingTag || !formData.name.trim()) {
      alert('Please enter a tag name');
      return;
    }

    const updatedTag: Tag = {
      ...editingTag,
      name: formData.name.trim(),
      color: formData.color,
      category: formData.category,
    };

    setTags(tags.map(t => t.id === editingTag.id ? updatedTag : t));
    onTagUpdated(updatedTag);
    setEditingTag(null);
    setFormData({ name: '', color: tagColors[0].value, category: tagCategories[0] });
  };

  const handleDeleteTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag && tag.usageCount > 0) {
      if (!confirm(`This tag is used ${tag.usageCount} times. Are you sure you want to delete it?`)) {
        return;
      }
    }
    setTags(tags.filter(t => t.id !== tagId));
    onTagDeleted(tagId);
  };

  const startEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      category: tag.category,
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setShowCreateForm(false);
    setFormData({ name: '', color: tagColors[0].value, category: tagCategories[0] });
  };

  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Tag Management
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create/Edit Form */}
          {(showCreateForm || editingTag) && (
            <Card className="border border-border bg-muted/30">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-foreground">
                  {editingTag ? 'Edit Tag' : 'Create New Tag'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tag Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      {tagCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tagColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={cn(
                          "w-10 h-10 rounded-lg border-2 transition-all",
                          formData.color === color.value ? "border-foreground scale-110" : "border-border"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelEdit} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={editingTag ? handleUpdateTag : handleCreateTag}
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                  >
                    {editingTag ? 'Update Tag' : 'Create Tag'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Button */}
          {!showCreateForm && !editingTag && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="w-full bg-gradient-to-r from-primary to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Tag
            </Button>
          )}

          {/* Tags List */}
          <div className="space-y-4">
            {Object.keys(groupedTags).map((category) => (
              <div key={category}>
                <h3 className="font-semibold text-foreground mb-3">{category}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {groupedTags[category].map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <Badge
                          variant="default"
                          style={{ borderColor: tag.color, color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ({tag.usageCount} uses)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(tag)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {tags.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <TagIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tags created yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}


"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { X, Plus, Upload } from 'lucide-react';

interface AddCandidateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: any) => void;
}

export function AddCandidateDialog({ isOpen, onClose, onSave }: AddCandidateDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPosition: '',
    location: '',
    skills: [] as string[],
    notes: '',
    tags: [] as string[],
    interestLevel: 'medium' as 'high' | 'medium' | 'low',
  });
  const [newSkill, setNewSkill] = useState('');
  const [newTag, setNewTag] = useState('');

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in required fields (Name and Email)');
      return;
    }
    onSave({
      ...formData,
      id: Date.now().toString(),
      candidateId: `c${Date.now()}`,
      headline: formData.currentPosition || 'Candidate',
      addedAt: new Date().toISOString(),
      matchedJobs: [],
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      currentPosition: '',
      location: '',
      skills: [],
      notes: '',
      tags: [],
      interestLevel: 'medium',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Candidate</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Current Position
              </label>
              <Input
                value={formData.currentPosition}
                onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
                placeholder="Job title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State, Country"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Interest Level
              </label>
              <select
                value={formData.interestLevel}
                onChange={(e) => setFormData({ ...formData, interestLevel: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add skill"
                className="flex-1"
              />
              <Button variant="outline" onClick={handleAddSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="default" className="cursor-pointer">
                  {skill}
                  <X className="w-3 h-3 ml-1" onClick={() => handleRemoveSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag"
                className="flex-1"
              />
              <Button variant="outline" onClick={handleAddTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="default" className="cursor-pointer">
                  {tag}
                  <X className="w-3 h-3 ml-1" onClick={() => handleRemoveTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes about this candidate..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-primary to-purple-600">
              Add Candidate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { CourseVacancy } from '@/data/mock/coursesData';
import { mockVacancies } from '@/data/mock/vacanciesData';
import { Plus, Edit, Trash2, Search, Calendar, DollarSign, Users, Clock, Save, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminVacanciesPage() {
  const [vacancies, setVacancies] = useState<CourseVacancy[]>(mockVacancies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<CourseVacancy | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'development' as CourseVacancy['category'],
    description: '',
    requirements: '',
    courseCategory: 'bundle' as 'bootcamp' | 'bundle',
    duration: '',
    adminPricing: 0,
    evolvixCommission: 30,
    mentorCommission: 70,
    deadline: '',
    skills: '',
    level: 'beginner' as CourseVacancy['level'],
  });

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacancy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vacancy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = () => {
    setEditingVacancy(null);
    setFormData({
      title: '',
      category: 'development',
      description: '',
      requirements: '',
      duration: '4-months',
      adminPricing: 0,
      evolvixCommission: 30,
      mentorCommission: 70,
      deadline: '',
      skills: '',
      level: 'beginner',
    });
    setShowCreateModal(true);
  };

  const handleEdit = (vacancy: CourseVacancy) => {
    setEditingVacancy(vacancy);
    setFormData({
      title: vacancy.title,
      category: vacancy.category,
      description: vacancy.description,
      requirements: vacancy.requirements.join('\n'),
      duration: vacancy.duration,
      adminPricing: vacancy.adminPricing,
      evolvixCommission: vacancy.commissionSplit.evolvix,
      mentorCommission: vacancy.commissionSplit.mentor,
      deadline: vacancy.deadline.split('T')[0],
      skills: vacancy.skills.join(', '),
      level: vacancy.level,
    });
    setShowCreateModal(true);
  };

  const handleSave = () => {
    const newVacancy: CourseVacancy = {
      id: editingVacancy?.id || `vacancy_${Date.now()}`,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      courseCategory: formData.courseCategory,
      duration: formData.duration || '', // Optional - can be blank
      adminPricing: formData.adminPricing,
      commissionSplit: {
        evolvix: formData.evolvixCommission,
        mentor: formData.mentorCommission,
      },
      status: editingVacancy?.status || 'open',
      createdAt: editingVacancy?.createdAt || new Date().toISOString(),
      deadline: new Date(formData.deadline).toISOString(),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      level: formData.level,
    };

    if (editingVacancy) {
      setVacancies(vacancies.map(v => v.id === editingVacancy.id ? newVacancy : v));
    } else {
      setVacancies([...vacancies, newVacancy]);
    }

    setShowCreateModal(false);
    setEditingVacancy(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vacancy?')) {
      setVacancies(vacancies.filter(v => v.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      case 'filled':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Course Vacancies</h1>
          <p className="text-muted-foreground">Create and manage course vacancies for mentors to apply</p>
        </div>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Vacancy
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vacancies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Categories</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="app-development">App Development</option>
              <option value="gaming">Gaming</option>
              <option value="jewelry-design">Jewelry Design</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Vacancies List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredVacancies.map((vacancy) => (
          <Card key={vacancy.id} className="border border-border bg-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{vacancy.title}</CardTitle>
                  <CardDescription>{vacancy.description}</CardDescription>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(vacancy.status)}`}>
                  {vacancy.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium text-foreground">{vacancy.duration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pricing:</span>
                    <p className="font-medium text-foreground">${vacancy.adminPricing.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Commission:</span>
                    <p className="font-medium text-foreground">
                      Evolvix {vacancy.commissionSplit.evolvix}% | Mentor {vacancy.commissionSplit.mentor}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Deadline:</span>
                    <p className="font-medium text-foreground">
                      {new Date(vacancy.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vacancy.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {vacancy.applications?.length || 0} applications
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(vacancy)}
                      className="border-border"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(vacancy.id)}
                      className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border border-border bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingVacancy ? 'Edit Vacancy' : 'Create Vacancy'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CourseVacancy['category'] })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="app-development">App Development</option>
                    <option value="gaming">Gaming</option>
                    <option value="jewelry-design">Jewelry Design</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <select
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value as CourseVacancy['duration'] })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="4-months">4 Months</option>
                    <option value="5-months">5 Months</option>
                    <option value="6-months">6 Months</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground resize-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (one per line) *</Label>
                <textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground resize-none"
                  rows={4}
                  placeholder="Minimum 5 years of experience&#10;Strong portfolio&#10;..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminPricing">Course Pricing ($) *</Label>
                  <Input
                    id="adminPricing"
                    type="number"
                    value={formData.adminPricing}
                    onChange={(e) => setFormData({ ...formData, adminPricing: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="evolvixCommission">Evolvix Commission (%) *</Label>
                  <Input
                    id="evolvixCommission"
                    type="number"
                    value={formData.evolvixCommission}
                    onChange={(e) => {
                      const evolvix = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, evolvixCommission: evolvix, mentorCommission: 100 - evolvix });
                    }}
                    className="mt-1"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="mentorCommission">Mentor Commission (%) *</Label>
                  <Input
                    id="mentorCommission"
                    type="number"
                    value={formData.mentorCommission}
                    onChange={(e) => {
                      const mentor = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, mentorCommission: mentor, evolvixCommission: 100 - mentor });
                    }}
                    className="mt-1"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skills">Skills (comma-separated) *</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="mt-1"
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="level">Level *</Label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseVacancy['level'] })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingVacancy ? 'Update' : 'Create'} Vacancy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


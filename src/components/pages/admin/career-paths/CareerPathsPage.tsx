"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { CareerPath } from '@/data/mock/coursesData';
import { Plus, Edit, Trash2, Search, BookOpen, Target, Users, Clock, Save, X, ArrowRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/hooks';

export function CareerPathsPage() {
  const courses = useAppSelector((state) => state.courses.courses);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPath, setEditingPath] = useState<CareerPath | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    outcome: '',
    category: 'development' as CareerPath['category'],
    level: 'beginner' as CareerPath['level'],
    price: 0,
    scholarshipAvailable: false,
    selectedCourses: [] as Array<{ courseId: string; order: number; required: boolean }>,
  });

  const filteredPaths = careerPaths.filter(path =>
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingPath(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      outcome: '',
      category: 'development',
      level: 'beginner',
      price: 0,
      scholarshipAvailable: false,
      selectedCourses: [],
    });
    setShowCreateModal(true);
  };

  const handleEdit = (path: CareerPath) => {
    setEditingPath(path);
    setFormData({
      title: path.title,
      description: path.description,
      duration: path.duration,
      outcome: path.outcome,
      category: path.category,
      level: path.level,
      price: path.price || 0,
      scholarshipAvailable: path.scholarshipAvailable,
      selectedCourses: path.courses,
    });
    setShowCreateModal(true);
  };

  const handleSave = () => {
    const newPath: CareerPath = {
      id: editingPath?.id || `career_path_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      outcome: formData.outcome,
      category: formData.category,
      level: formData.level,
      price: formData.price > 0 ? formData.price : undefined,
      scholarshipAvailable: formData.scholarshipAvailable,
      courses: formData.selectedCourses,
      createdAt: editingPath?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingPath) {
      setCareerPaths(careerPaths.map(p => p.id === editingPath.id ? newPath : p));
    } else {
      setCareerPaths([...careerPaths, newPath]);
    }

    setShowCreateModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this career path?')) {
      setCareerPaths(careerPaths.filter(p => p.id !== id));
    }
  };

  const addCourseToPath = (courseId: string) => {
    if (formData.selectedCourses.find(c => c.courseId === courseId)) return;
    
    setFormData({
      ...formData,
      selectedCourses: [
        ...formData.selectedCourses,
        {
          courseId,
          order: formData.selectedCourses.length + 1,
          required: true,
        },
      ],
    });
  };

  const removeCourseFromPath = (courseId: string) => {
    setFormData({
      ...formData,
      selectedCourses: formData.selectedCourses
        .filter(c => c.courseId !== courseId)
        .map((c, index) => ({ ...c, order: index + 1 })),
    });
  };

  const toggleCourseRequired = (courseId: string) => {
    setFormData({
      ...formData,
      selectedCourses: formData.selectedCourses.map(c =>
        c.courseId === courseId ? { ...c, required: !c.required } : c
      ),
    });
  };

  const reorderCourse = (courseId: string, direction: 'up' | 'down') => {
    const index = formData.selectedCourses.findIndex(c => c.courseId === courseId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.selectedCourses.length) return;

    const newCourses = [...formData.selectedCourses];
    [newCourses[index], newCourses[newIndex]] = [newCourses[newIndex], newCourses[index]];
    
    setFormData({
      ...formData,
      selectedCourses: newCourses.map((c, i) => ({ ...c, order: i + 1 })),
    });
  };

  // Filter courses that can be added to career paths (bootcamp/bundle)
  const availableCourses = courses.filter(
    c => c.courseCategory === 'bootcamp' || c.courseCategory === 'bundle'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Career Paths</h1>
          <p className="text-muted-foreground mt-1">
            Group multiple bootcamps and bundles into structured career paths
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Career Path
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search career paths..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Career Paths Grid */}
      {filteredPaths.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Career Paths Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first career path to help students follow structured learning paths
            </p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Career Path
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <Card key={path.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{path.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(path)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(path.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Target className="w-4 h-4 mr-2" />
                    <span>{path.outcome}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{path.courses.length} courses</span>
                  </div>
                  {path.price && (
                    <div className="flex items-center text-sm font-semibold text-green-600">
                      <span>${path.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border border-border bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingPath ? 'Edit Career Path' : 'Create Career Path'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="mt-1"
                    placeholder="e.g., 6 months"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="outcome">Career Outcome *</Label>
                <Input
                  id="outcome"
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  className="mt-1"
                  placeholder="e.g., Job-ready Full Stack Developer"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CareerPath['category'] })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="data-science">Data Science</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as CareerPath['level'] })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Add Courses */}
              <div>
                <Label>Add Courses to Path</Label>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border border-border rounded-md p-2">
                  {availableCourses.map((course) => {
                    const isAdded = formData.selectedCourses.find(c => c.courseId === course.id);
                    return (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded"
                      >
                        <span className="text-sm">{course.title}</span>
                        {isAdded ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCourseFromPath(course.id)}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addCourseToPath(course.id)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Courses Order */}
              {formData.selectedCourses.length > 0 && (
                <div>
                  <Label>Course Order</Label>
                  <div className="mt-2 space-y-2">
                    {formData.selectedCourses
                      .sort((a, b) => a.order - b.order)
                      .map((courseItem) => {
                        const course = courses.find(c => c.id === courseItem.courseId);
                        if (!course) return null;
                        return (
                          <div
                            key={courseItem.courseId}
                            className="flex items-center justify-between p-3 border border-border rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-semibold">{courseItem.order}.</span>
                              <span className="text-sm">{course.title}</span>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={courseItem.required}
                                  onChange={() => toggleCourseRequired(courseItem.courseId)}
                                />
                                <span className="text-xs text-muted-foreground">Required</span>
                              </label>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => reorderCourse(courseItem.courseId, 'up')}
                                disabled={courseItem.order === 1}
                              >
                                ↑
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => reorderCourse(courseItem.courseId, 'down')}
                                disabled={courseItem.order === formData.selectedCourses.length}
                              >
                                ↓
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCourseFromPath(courseItem.courseId)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingPath ? 'Update' : 'Create'} Career Path
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


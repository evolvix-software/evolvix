/**
 * Job Alerts Page - Create and manage job alerts
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Search,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  X,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { EmptyState } from '@/components/common/ui/EmptyState';
import { Skeleton } from '@/components/common/ui/SkeletonLoader';
import { JobAlert } from '@/interfaces/jobs';
import { 
  getJobAlerts, 
  createJobAlert, 
  updateJobAlert, 
  deleteJobAlert,
  checkAlertMatches
} from '@/services/jobService';
import { cn } from '@/utils';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    keywords: [] as string[],
    keywordInput: '',
    location: [] as string[],
    locationInput: '',
    company: [] as string[],
    companyInput: '',
    experienceLevel: [] as ('entry' | 'mid' | 'senior' | 'executive')[],
    jobType: [] as ('full-time' | 'part-time' | 'contract' | 'freelance' | 'internship')[],
    salaryMin: '',
    salaryMax: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'instant',
    active: true,
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const alertsData = await getJobAlerts();
      setAlerts(alertsData);
      
      // Check matches for active alerts
      await Promise.all(
        alertsData
          .filter(a => a.active)
          .map(alert => checkAlertMatches(alert.id))
      );
      
      // Reload to get updated matches
      const updatedAlerts = await getJobAlerts();
      setAlerts(updatedAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingAlert(null);
    setFormData({
      name: '',
      keywords: [],
      keywordInput: '',
      location: [],
      locationInput: '',
      company: [],
      companyInput: '',
      experienceLevel: [],
      jobType: [],
      salaryMin: '',
      salaryMax: '',
      frequency: 'daily',
      active: true,
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (alert: JobAlert) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      keywords: alert.keywords,
      keywordInput: '',
      location: alert.location,
      locationInput: '',
      company: alert.company,
      companyInput: '',
      experienceLevel: alert.experienceLevel,
      jobType: alert.jobType,
      salaryMin: alert.salaryRange?.min.toString() || '',
      salaryMax: alert.salaryRange?.max.toString() || '',
      frequency: alert.frequency,
      active: alert.active,
    });
    setShowCreateModal(true);
  };

  const handleAddKeyword = () => {
    if (formData.keywordInput.trim() && !formData.keywords.includes(formData.keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, prev.keywordInput.trim()],
        keywordInput: '',
      }));
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const handleAddLocation = () => {
    if (formData.locationInput.trim() && !formData.location.includes(formData.locationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        location: [...prev.location, prev.locationInput.trim()],
        locationInput: '',
      }));
    }
  };

  const handleRemoveLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location: prev.location.filter(l => l !== location),
    }));
  };

  const handleAddCompany = () => {
    if (formData.companyInput.trim() && !formData.company.includes(formData.companyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        company: [...prev.company, prev.companyInput.trim()],
        companyInput: '',
      }));
    }
  };

  const handleRemoveCompany = (company: string) => {
    setFormData(prev => ({
      ...prev,
      company: prev.company.filter(c => c !== company),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Please enter an alert name');
      return;
    }

    try {
      if (editingAlert) {
        await updateJobAlert(editingAlert.id, {
          name: formData.name,
          keywords: formData.keywords,
          location: formData.location,
          company: formData.company,
          experienceLevel: formData.experienceLevel,
          jobType: formData.jobType,
          salaryRange: formData.salaryMin && formData.salaryMax ? {
            min: parseInt(formData.salaryMin),
            max: parseInt(formData.salaryMax),
            currency: 'INR',
          } : undefined,
          frequency: formData.frequency,
          active: formData.active,
        });
      } else {
        await createJobAlert({
          name: formData.name,
          keywords: formData.keywords,
          location: formData.location,
          company: formData.company,
          experienceLevel: formData.experienceLevel,
          jobType: formData.jobType,
          salaryRange: formData.salaryMin && formData.salaryMax ? {
            min: parseInt(formData.salaryMin),
            max: parseInt(formData.salaryMax),
            currency: 'INR',
          } : undefined,
          frequency: formData.frequency,
          active: formData.active,
        });
      }
      
      await loadAlerts();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to save alert:', error);
      alert('Failed to save alert. Please try again.');
    }
  };

  const handleToggleActive = async (alertId: string, currentActive: boolean) => {
    try {
      await updateJobAlert(alertId, { active: !currentActive });
      await loadAlerts();
    } catch (error) {
      console.error('Failed to toggle alert:', error);
    }
  };

  const handleDelete = async () => {
    if (!alertToDelete) return;
    
    try {
      await deleteJobAlert(alertToDelete);
      await loadAlerts();
      setShowDeleteModal(false);
      setAlertToDelete(null);
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton variant="text" lines={3} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Alerts</h1>
          <p className="text-muted-foreground">
            Get notified when new jobs match your criteria
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Job Alerts"
          description="Create an alert to get notified about new job opportunities that match your criteria"
          action={{
            label: 'Create Alert',
            onClick: handleOpenCreate,
          }}
        />
      ) : (
        <div className="grid gap-4">
          {alerts.map(alert => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {alert.name}
                      </h3>
                      <Badge variant={alert.active ? 'success' : 'default'}>
                        {alert.active ? 'Active' : 'Inactive'}
                      </Badge>
                      {alert.matches.length > 0 && (
                        <Badge variant="primary">
                          {alert.matches.length} match{alert.matches.length !== 1 ? 'es' : ''}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {alert.keywords.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          <span>{alert.keywords.join(', ')}</span>
                        </div>
                      )}
                      {alert.location.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location.join(', ')}</span>
                        </div>
                      )}
                      {alert.company.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>{alert.company.join(', ')}</span>
                        </div>
                      )}
                      {alert.experienceLevel.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{alert.experienceLevel.join(', ')}</span>
                        </div>
                      )}
                      {alert.jobType.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{alert.jobType.join(', ')}</span>
                        </div>
                      )}
                      {alert.salaryRange && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            ₹{alert.salaryRange.min.toLocaleString()} - ₹{alert.salaryRange.max.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        Frequency: {alert.frequency} • Created {new Date(alert.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(alert.id, alert.active)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {alert.active ? (
                        <ToggleRight className="w-6 h-6 text-primary" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(alert)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAlertToDelete(alert.id);
                        setShowDeleteModal(true);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={editingAlert ? 'Edit Alert' : 'Create Job Alert'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Alert Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Alert Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Frontend Developer Jobs"
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={formData.keywordInput}
                onChange={(e) => setFormData(prev => ({ ...prev, keywordInput: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                placeholder="e.g., React, TypeScript"
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button variant="outline" onClick={handleAddKeyword}>Add</Button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map(keyword => (
                  <Badge key={keyword} variant="default" className="flex items-center gap-1">
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={formData.locationInput}
                onChange={(e) => setFormData(prev => ({ ...prev, locationInput: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                placeholder="e.g., Mumbai, Pune"
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button variant="outline" onClick={handleAddLocation}>Add</Button>
            </div>
            {formData.location.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.location.map(location => (
                  <Badge key={location} variant="default" className="flex items-center gap-1">
                    {location}
                    <button
                      onClick={() => handleRemoveLocation(location)}
                      className="hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={formData.companyInput}
                onChange={(e) => setFormData(prev => ({ ...prev, companyInput: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompany())}
                placeholder="e.g., Google, Microsoft"
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button variant="outline" onClick={handleAddCompany}>Add</Button>
            </div>
            {formData.company.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.company.map(company => (
                  <Badge key={company} variant="default" className="flex items-center gap-1">
                    {company}
                    <button
                      onClick={() => handleRemoveCompany(company)}
                      className="hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Experience Level
            </label>
            <div className="flex flex-wrap gap-2">
              {(['entry', 'mid', 'senior', 'executive'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      experienceLevel: prev.experienceLevel.includes(level)
                        ? prev.experienceLevel.filter(l => l !== level)
                        : [...prev.experienceLevel, level],
                    }));
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    formData.experienceLevel.includes(level)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-secondary'
                  )}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Job Type
            </label>
            <div className="flex flex-wrap gap-2">
              {(['full-time', 'part-time', 'contract', 'freelance', 'internship'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      jobType: prev.jobType.includes(type)
                        ? prev.jobType.filter(t => t !== type)
                        : [...prev.jobType, type],
                    }));
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    formData.jobType.includes(type)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-secondary'
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Min Salary (₹)
              </label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                placeholder="e.g., 500000"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Salary (₹)
              </label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                placeholder="e.g., 2000000"
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notification Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingAlert ? 'Update Alert' : 'Create Alert'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAlertToDelete(null);
        }}
        title="Delete Alert"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to delete this alert? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => {
              setShowDeleteModal(false);
              setAlertToDelete(null);
            }}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


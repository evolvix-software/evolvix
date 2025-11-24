"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Calendar, Plus, X, Edit, Play, Pause, Trash2, Clock, Mail, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  day?: number;
  time: string;
  recipients: string[];
  format: 'pdf' | 'csv' | 'excel';
  isActive: boolean;
  nextRunAt: string;
  lastRunAt?: string;
}

export function ScheduledReportsTab() {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    reportType: '',
    frequency: 'monthly' as ScheduledReport['frequency'],
    day: 1,
    time: '09:00',
    recipients: '',
    format: 'pdf' as ScheduledReport['format'],
    includeCharts: true,
  });

  // Load scheduled reports from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('scheduled_reports');
      if (stored) {
        setScheduledReports(JSON.parse(stored));
      } else {
        // Mock data
        const mockReports: ScheduledReport[] = [
          {
            id: '1',
            name: 'Monthly Campaign Summary',
            reportType: 'Campaign Summary Report',
            frequency: 'monthly',
            day: 1,
            time: '09:00',
            recipients: ['admin@example.com', 'stakeholder@example.com'],
            format: 'pdf',
            isActive: true,
            nextRunAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastRunAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            name: 'Weekly Scholar Progress',
            reportType: 'Scholar Progress Report',
            frequency: 'weekly',
            day: 1,
            time: '08:00',
            recipients: ['team@example.com'],
            format: 'csv',
            isActive: true,
            nextRunAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            lastRunAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        setScheduledReports(mockReports);
        localStorage.setItem('scheduled_reports', JSON.stringify(mockReports));
      }
    }
  }, []);

  const saveScheduledReports = (reports: ScheduledReport[]) => {
    localStorage.setItem('scheduled_reports', JSON.stringify(reports));
    setScheduledReports(reports);
  };

  const handleCreateSchedule = () => {
    setEditingReport(null);
    setFormData({
      name: '',
      reportType: '',
      frequency: 'monthly',
      day: 1,
      time: '09:00',
      recipients: '',
      format: 'pdf',
      includeCharts: true,
    });
    setShowScheduleForm(true);
  };

  const handleEditSchedule = (report: ScheduledReport) => {
    setEditingReport(report);
    setFormData({
      name: report.name,
      reportType: report.reportType,
      frequency: report.frequency,
      day: report.day || 1,
      time: report.time,
      recipients: report.recipients.join(', '),
      format: report.format,
      includeCharts: true,
    });
    setShowScheduleForm(true);
  };

  const handleSaveSchedule = () => {
    const recipients = formData.recipients.split(',').map(email => email.trim()).filter(Boolean);
    
    if (!formData.name || !formData.reportType || recipients.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const calculateNextRun = (frequency: ScheduledReport['frequency'], day: number, time: string): string => {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const nextRun = new Date();
      nextRun.setHours(hours, minutes, 0, 0);

      switch (frequency) {
        case 'daily':
          nextRun.setDate(now.getDate() + 1);
          break;
        case 'weekly':
          const daysUntilNext = (day - now.getDay() + 7) % 7 || 7;
          nextRun.setDate(now.getDate() + daysUntilNext);
          break;
        case 'monthly':
          nextRun.setDate(day);
          if (nextRun <= now) {
            nextRun.setMonth(nextRun.getMonth() + 1);
          }
          break;
        case 'quarterly':
          nextRun.setMonth(Math.floor(now.getMonth() / 3) * 3 + 3);
          nextRun.setDate(day);
          break;
        case 'yearly':
          nextRun.setMonth(0);
          nextRun.setDate(day);
          if (nextRun <= now) {
            nextRun.setFullYear(nextRun.getFullYear() + 1);
          }
          break;
      }

      return nextRun.toISOString();
    };

    if (editingReport) {
      const updated = scheduledReports.map(r =>
        r.id === editingReport.id
          ? {
              ...r,
              ...formData,
              recipients,
              nextRunAt: calculateNextRun(formData.frequency, formData.day, formData.time),
            }
          : r
      );
      saveScheduledReports(updated);
    } else {
      const newReport: ScheduledReport = {
        id: Date.now().toString(),
        name: formData.name,
        reportType: formData.reportType,
        frequency: formData.frequency,
        day: formData.day,
        time: formData.time,
        recipients,
        format: formData.format,
        isActive: true,
        nextRunAt: calculateNextRun(formData.frequency, formData.day, formData.time),
      };
      saveScheduledReports([...scheduledReports, newReport]);
    }

    setShowScheduleForm(false);
  };

  const handleToggleActive = (id: string) => {
    const updated = scheduledReports.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    saveScheduledReports(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
      const updated = scheduledReports.filter(r => r.id !== id);
      saveScheduledReports(updated);
    }
  };

  const handleRunNow = (id: string) => {
    alert(`Running scheduled report "${scheduledReports.find(r => r.id === id)?.name}" now...`);
    // Update last run time
    const updated = scheduledReports.map(r =>
      r.id === id ? { ...r, lastRunAt: new Date().toISOString() } : r
    );
    saveScheduledReports(updated);
  };

  const reportTypes = [
    'Campaign Summary Report',
    'Application Report',
    'Award Report',
    'Scholar Progress Report',
    'Scholar Growth Report',
    'Job Placement Report',
    'Graduation Report',
    'Balance Summary',
    'Transfer History',
    'Disbursement Report',
    'ROI Report',
    'Impact Summary',
    'Success Stories Report',
    'Stakeholder Report',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Scheduled Reports</h2>
          <p className="text-muted-foreground mt-1">Manage automated report deliveries</p>
        </div>
        <Button onClick={handleCreateSchedule}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Report
        </Button>
      </div>

      {/* Scheduled Reports List */}
      {scheduledReports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Scheduled Reports</h3>
            <p className="text-muted-foreground mb-4">Create your first scheduled report to get started</p>
            <Button onClick={handleCreateSchedule}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {scheduledReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{report.name}</h3>
                      {report.isActive ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded">
                          Paused
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{report.reportType}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium text-foreground capitalize">{report.frequency}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Run</p>
                        <p className="font-medium text-foreground">
                          {new Date(report.nextRunAt).toLocaleDateString()} at {report.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Run</p>
                        <p className="font-medium text-foreground">
                          {report.lastRunAt
                            ? new Date(report.lastRunAt).toLocaleDateString()
                            : 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Format</p>
                        <p className="font-medium text-foreground uppercase">{report.format}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Recipients</p>
                        <p className="font-medium text-foreground">{report.recipients.length} email(s)</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRunNow(report.id)}
                      disabled={!report.isActive}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run Now
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditSchedule(report)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(report.id)}
                    >
                      {report.isActive ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {editingReport ? 'Edit Scheduled Report' : 'Schedule New Report'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowScheduleForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Report Name *"
                placeholder="e.g., Monthly Campaign Summary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Report Type *</label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  required
                >
                  <option value="">Select Report Type</option>
                  {reportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Schedule Frequency *</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {formData.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Day of Week *</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                  </select>
                </div>
              )}

              {(formData.frequency === 'monthly' || formData.frequency === 'quarterly' || formData.frequency === 'yearly') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Day of Month *</label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Time *</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Recipients * (comma-separated emails)</label>
                <Input
                  placeholder="email1@example.com, email2@example.com"
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Format *</label>
                <div className="flex gap-3">
                  {(['pdf', 'csv', 'excel'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setFormData({ ...formData, format })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.format === format
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-charts"
                  checked={formData.includeCharts}
                  onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="include-charts" className="text-sm text-foreground">
                  Include Charts and Visualizations
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowScheduleForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveSchedule} className="flex-1">
                  {editingReport ? 'Update Schedule' : 'Create Schedule'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


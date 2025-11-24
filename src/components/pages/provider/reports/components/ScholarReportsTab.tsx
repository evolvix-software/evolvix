"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Award, TrendingUp, Briefcase, GraduationCap, Trophy, BarChart3, Download, Eye, X } from 'lucide-react';
import { campaignService, providerService } from '@/data/mock/providerData';

type ScholarReportType = 'progress' | 'growth' | 'job-placement' | 'graduation' | 'achievement' | 'engagement';

interface ScholarReportConfig {
  reportType: ScholarReportType;
  campaigns: string[];
  dateRange: { start: string; end: string };
  grouping: 'none' | 'campaign' | 'course' | 'status' | 'graduation' | 'job-placement';
  filters: {
    status?: string;
    progressRange?: { min: number; max: number };
  };
  format: 'pdf' | 'csv' | 'excel';
}

export function ScholarReportsTab() {
  const [selectedReport, setSelectedReport] = useState<ScholarReportType | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [config, setConfig] = useState<ScholarReportConfig>({
    reportType: 'progress',
    campaigns: [],
    dateRange: { start: '', end: '' },
    grouping: 'none',
    filters: {},
    format: 'pdf',
  });

  // Admin sees ALL campaigns (no provider filter)
  const campaigns = campaignService.getAll();

  const reportTypes = [
    {
      id: 'progress' as ScholarReportType,
      name: 'Scholar Progress Report',
      description: 'Track scholar progress, CGPA improvement, and course completion rates',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'growth' as ScholarReportType,
      name: 'Scholar Growth Report',
      description: 'CGPA trends, progress trends, and achievement milestones over time',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'job-placement' as ScholarReportType,
      name: 'Job Placement Report',
      description: 'Job placement statistics including placement rate, salaries, and top companies',
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: 'graduation' as ScholarReportType,
      name: 'Graduation Report',
      description: 'Graduation rates, final CGPA, and certificate issuance statistics',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'achievement' as ScholarReportType,
      name: 'Achievement Report',
      description: 'Scholar achievements, badges, and milestone completions',
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      id: 'engagement' as ScholarReportType,
      name: 'Engagement Report',
      description: 'Scholar engagement metrics including logins, video watch rates, and mentor sessions',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  const handleGenerateReport = () => {
    setShowPreview(true);
  };

  const handleExport = () => {
    alert(`Exporting ${reportTypes.find(r => r.id === config.reportType)?.name} as ${config.format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => {
              setConfig({ ...config, reportType: report.id });
              setSelectedReport(report.id);
              setShowConfig(true);
            }}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {report.icon}
                </div>
                <h3 className="font-semibold text-foreground">{report.name}</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                <Award className="w-4 h-4 mr-2" />
                Configure Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Configuration Modal */}
      {showConfig && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Configure {reportTypes.find(r => r.id === selectedReport)?.name}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowConfig(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Campaigns (Optional)
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-input rounded-lg p-3">
                  {campaigns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No campaigns available</p>
                  ) : (
                    campaigns.map((campaign) => (
                      <label
                        key={campaign.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={config.campaigns.includes(campaign.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig({ ...config, campaigns: [...config.campaigns, campaign.id] });
                            } else {
                              setConfig({
                                ...config,
                                campaigns: config.campaigns.filter(id => id !== campaign.id),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded border-input"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{campaign.title}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={config.dateRange.start}
                    onChange={(e) => setConfig({ ...config, dateRange: { ...config.dateRange, start: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                  <Input
                    type="date"
                    value={config.dateRange.end}
                    onChange={(e) => setConfig({ ...config, dateRange: { ...config.dateRange, end: e.target.value } })}
                  />
                </div>
              </div>

              {/* Grouping Options */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Group By</label>
                <select
                  value={config.grouping}
                  onChange={(e) => setConfig({ ...config, grouping: e.target.value as any })}
                  className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="none">No Grouping</option>
                  <option value="campaign">By Campaign</option>
                  <option value="course">By Course</option>
                  <option value="status">By Status</option>
                  <option value="graduation">By Graduation Status</option>
                  <option value="job-placement">By Job Placement Status</option>
                </select>
              </div>

              {/* Filters */}
              {selectedReport === 'progress' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Progress Range (%)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="100"
                      value={config.filters.progressRange?.min || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          filters: {
                            ...config.filters,
                            progressRange: {
                              min: parseFloat(e.target.value) || 0,
                              max: config.filters.progressRange?.max || 100,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max="100"
                      value={config.filters.progressRange?.max || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          filters: {
                            ...config.filters,
                            progressRange: {
                              min: config.filters.progressRange?.min || 0,
                              max: parseFloat(e.target.value) || 100,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Export Format</label>
                <div className="flex gap-3">
                  {(['pdf', 'csv', 'excel'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setConfig({ ...config, format })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        config.format === format
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowConfig(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleGenerateReport} className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleExport} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Generate & Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Report Preview</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    {reportTypes.find(r => r.id === config.reportType)?.name}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Grouping: {config.grouping === 'none' ? 'None' : `By ${config.grouping}`}</p>
                    <p>
                      Date Range: {config.dateRange.start || 'All time'} to {config.dateRange.end || 'Today'}
                    </p>
                    <p>Format: {config.format.toUpperCase()}</p>
                  </div>
                </div>

                {/* Mock Report Preview */}
                <div className="p-8 border border-border rounded-lg text-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Report preview would be displayed here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    (Report generation implementation would go here)
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
                    Close
                  </Button>
                  <Button onClick={handleExport} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export {config.format.toUpperCase()}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


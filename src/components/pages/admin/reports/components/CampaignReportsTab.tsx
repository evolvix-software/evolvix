"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { FileText, Download, Eye, X, Filter, Calendar, Users, Award, TrendingUp, DollarSign } from 'lucide-react';
import { campaignService } from '@/data/mock/providerData';

type CampaignReportType = 'summary' | 'application' | 'award' | 'scholar-progress' | 'financial' | 'impact';

interface ReportConfig {
  reportType: CampaignReportType;
  campaigns: string[];
  dateRange: { start: string; end: string };
  includeSections: {
    overview: boolean;
    applications: boolean;
    awards: boolean;
    scholars: boolean;
    financial: boolean;
    impact: boolean;
  };
  format: 'pdf' | 'csv' | 'excel';
}

export function CampaignReportsTab() {
  const [selectedReport, setSelectedReport] = useState<CampaignReportType | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    reportType: 'summary',
    campaigns: [],
    dateRange: { start: '', end: '' },
    includeSections: {
      overview: true,
      applications: true,
      awards: true,
      scholars: true,
      financial: true,
      impact: true,
    },
    format: 'pdf',
  });

  // Admin sees ALL campaigns (no provider filter)
  const campaigns = campaignService.getAll();

  const reportTypes = [
    {
      id: 'summary' as CampaignReportType,
      name: 'Campaign Summary Report',
      description: 'Comprehensive overview of campaign performance including applications, awards, scholars, and impact',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'application' as CampaignReportType,
      name: 'Application Report',
      description: 'Detailed application statistics with student information, scores, and status',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'award' as CampaignReportType,
      name: 'Award Report',
      description: 'Scholarship awards breakdown with scholar details and award amounts',
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 'scholar-progress' as CampaignReportType,
      name: 'Scholar Progress Report',
      description: 'Track scholar progress, CGPA improvement, and course completion',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'financial' as CampaignReportType,
      name: 'Campaign Financial Report',
      description: 'Financial details including funding, disbursements, and ROI',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 'impact' as CampaignReportType,
      name: 'Campaign Impact Report',
      description: 'Impact metrics including graduation rates, job placements, and success stories',
      icon: <TrendingUp className="w-5 h-5" />,
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
                <FileText className="w-4 h-4 mr-2" />
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
                  Select Campaigns * (All campaigns visible - Admin view)
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
                          <p className="text-xs text-muted-foreground">{campaign.status}</p>
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

              {/* Include Sections (for summary report) */}
              {selectedReport === 'summary' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Include Sections</label>
                  <div className="space-y-2 border border-input rounded-lg p-3">
                    {Object.entries(config.includeSections).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              includeSections: { ...config.includeSections, [key]: e.target.checked },
                            })
                          }
                          className="w-4 h-4 rounded border-input"
                        />
                        <span className="text-sm text-foreground capitalize">{key}</span>
                      </label>
                    ))}
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
                    <p>Campaigns: {config.campaigns.length} selected (System-wide view)</p>
                    <p>
                      Date Range: {config.dateRange.start || 'All time'} to {config.dateRange.end || 'Today'}
                    </p>
                    <p>Format: {config.format.toUpperCase()}</p>
                  </div>
                </div>

                {/* Mock Report Preview */}
                <div className="space-y-4">
                  {config.includeSections.overview && (
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Campaign Overview</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Slots</p>
                          <p className="font-semibold text-foreground">50</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Awarded</p>
                          <p className="font-semibold text-foreground">35</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Applications</p>
                          <p className="font-semibold text-foreground">120</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Funded</p>
                          <p className="font-semibold text-foreground">₹15L</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {config.includeSections.applications && (
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Application Statistics</h4>
                      <p className="text-sm text-muted-foreground">Application data would be displayed here</p>
                    </div>
                  )}

                  {config.includeSections.awards && (
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Award Statistics</h4>
                      <p className="text-sm text-muted-foreground">Award data would be displayed here</p>
                    </div>
                  )}

                  {config.includeSections.scholars && (
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Scholar Statistics</h4>
                      <p className="text-sm text-muted-foreground">Scholar data would be displayed here</p>
                    </div>
                  )}

                  {config.includeSections.financial && (
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Financial Summary</h4>
                      <p className="text-sm text-muted-foreground">Financial data would be displayed here</p>
                    </div>
                  )}

                  {config.includeSections.impact && (
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Impact Metrics</h4>
                      <p className="text-sm text-muted-foreground">Impact data would be displayed here</p>
                    </div>
                  )}
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


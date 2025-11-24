"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { BarChart3, Award, FileText, Users, TrendingUp, Download, Eye, X } from 'lucide-react';

type ImpactReportType = 'summary' | 'success-stories' | 'stakeholder';

interface ImpactReportConfig {
  reportType: ImpactReportType;
  dateRange: { start: string; end: string };
  includeSections: {
    livesChanged: boolean;
    academicImpact: boolean;
    careerImpact: boolean;
    financialImpact: boolean;
    successStories: boolean;
  };
  format: 'pdf' | 'csv' | 'excel' | 'presentation';
}

export function ImpactReportsTab() {
  const [selectedReport, setSelectedReport] = useState<ImpactReportType | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [config, setConfig] = useState<ImpactReportConfig>({
    reportType: 'summary',
    dateRange: { start: '', end: '' },
    includeSections: {
      livesChanged: true,
      academicImpact: true,
      careerImpact: true,
      financialImpact: true,
      successStories: true,
    },
    format: 'pdf',
  });

  const reportTypes = [
    {
      id: 'summary' as ImpactReportType,
      name: 'Impact Summary Report',
      description: 'Comprehensive impact metrics including lives changed, academic and career impact, and ROI',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'success-stories' as ImpactReportType,
      name: 'Success Stories Report',
      description: 'Featured success stories, scholar profiles, testimonials, and achievement highlights',
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 'stakeholder' as ImpactReportType,
      name: 'Stakeholder Report',
      description: 'Executive summary for stakeholders with key metrics, highlights, and future plans',
      icon: <FileText className="w-5 h-5" />,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <BarChart3 className="w-4 h-4 mr-2" />
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
                        <span className="text-sm text-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Export Format</label>
                <div className="flex gap-3 flex-wrap">
                  {(['pdf', 'csv', 'excel', 'presentation'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setConfig({ ...config, format })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        config.format === format
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {format === 'presentation' ? 'Presentation' : format.toUpperCase()}
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
                    <p>
                      Date Range: {config.dateRange.start || 'All time'} to {config.dateRange.end || 'Today'}
                    </p>
                    <p>Format: {config.format === 'presentation' ? 'Presentation' : config.format.toUpperCase()}</p>
                  </div>
                </div>

                {/* Mock Impact Report Preview */}
                {config.includeSections.livesChanged && (
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Lives Changed
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Scholars</p>
                        <p className="font-semibold text-foreground text-lg">150</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Scholars</p>
                        <p className="font-semibold text-foreground text-lg">120</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Graduated</p>
                        <p className="font-semibold text-foreground text-lg">30</p>
                      </div>
                    </div>
                  </div>
                )}

                {config.includeSections.academicImpact && (
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Academic Impact
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg CGPA Improvement</p>
                        <p className="font-semibold text-foreground text-lg">+1.2</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Graduation Rate</p>
                        <p className="font-semibold text-foreground text-lg">85%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Top Performers</p>
                        <p className="font-semibold text-foreground text-lg">45</p>
                      </div>
                    </div>
                  </div>
                )}

                {config.includeSections.careerImpact && (
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Career Impact
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Job Placement Rate</p>
                        <p className="font-semibold text-foreground text-lg">78%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Salary</p>
                        <p className="font-semibold text-foreground text-lg">₹8.5L</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Top Companies</p>
                        <p className="font-semibold text-foreground text-lg">25</p>
                      </div>
                    </div>
                  </div>
                )}

                {config.includeSections.financialImpact && (
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Financial Impact
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Investment</p>
                        <p className="font-semibold text-foreground text-lg">₹50L</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ROI Percentage</p>
                        <p className="font-semibold text-foreground text-lg">125%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost per Outcome</p>
                        <p className="font-semibold text-foreground text-lg">₹3.3L</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
                    Close
                  </Button>
                  <Button onClick={handleExport} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export {config.format === 'presentation' ? 'Presentation' : config.format.toUpperCase()}
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


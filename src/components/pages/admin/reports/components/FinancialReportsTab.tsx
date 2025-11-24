"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { DollarSign, TrendingUp, FileText, Download, Eye, X, Calendar } from 'lucide-react';
import { campaignService } from '@/data/mock/providerData';

type FinancialReportType = 'balance' | 'transfer' | 'disbursement' | 'campaign-financials' | 'roi' | 'payment-ledger';

interface FinancialReportConfig {
  reportType: FinancialReportType;
  campaigns: string[];
  dateRange: { start: string; end: string };
  periodComparison: 'none' | 'previous' | 'year-over-year';
  grouping: 'none' | 'scholar' | 'campaign' | 'date' | 'status';
  format: 'pdf' | 'csv' | 'excel';
}

export function FinancialReportsTab() {
  const [selectedReport, setSelectedReport] = useState<FinancialReportType | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [config, setConfig] = useState<FinancialReportConfig>({
    reportType: 'balance',
    campaigns: [],
    dateRange: { start: '', end: '' },
    periodComparison: 'none',
    grouping: 'none',
    format: 'pdf',
  });

  // Admin sees ALL campaigns (no provider filter)
  const campaigns = campaignService.getAll();

  const reportTypes = [
    {
      id: 'balance' as FinancialReportType,
      name: 'Balance Summary Report',
      description: 'Current balance, in-transit funds, reserved funds, and period comparisons',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 'transfer' as FinancialReportType,
      name: 'Transfer History Report',
      description: 'Complete history of all fund transfers with status and transaction details',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'disbursement' as FinancialReportType,
      name: 'Disbursement Report',
      description: 'Scholar disbursements grouped by scholar, campaign, date, or status',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'campaign-financials' as FinancialReportType,
      name: 'Campaign Financials',
      description: 'Financial details for specific campaigns including funding and disbursements',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: 'roi' as FinancialReportType,
      name: 'ROI Report',
      description: 'Return on investment metrics including cost per scholar, graduate, and job placement',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'payment-ledger' as FinancialReportType,
      name: 'Payment Ledger',
      description: 'Complete payment ledger with all transactions and balances',
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
                <DollarSign className="w-4 h-4 mr-2" />
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
              {selectedReport === 'campaign-financials' && (
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
              )}

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

              {/* Period Comparison (for balance report) */}
              {selectedReport === 'balance' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Period Comparison</label>
                  <select
                    value={config.periodComparison}
                    onChange={(e) => setConfig({ ...config, periodComparison: e.target.value as any })}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="none">No Comparison</option>
                    <option value="previous">Previous Period</option>
                    <option value="year-over-year">Year-over-Year</option>
                  </select>
                </div>
              )}

              {/* Grouping Options */}
              {(selectedReport === 'disbursement' || selectedReport === 'transfer') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Group By</label>
                  <select
                    value={config.grouping}
                    onChange={(e) => setConfig({ ...config, grouping: e.target.value as any })}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="none">No Grouping</option>
                    <option value="scholar">By Scholar</option>
                    <option value="campaign">By Campaign</option>
                    <option value="date">By Date</option>
                    <option value="status">By Status</option>
                  </select>
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
                    {config.campaigns.length > 0 && <p>Campaigns: {config.campaigns.length} selected (System-wide)</p>}
                    <p>
                      Date Range: {config.dateRange.start || 'All time'} to {config.dateRange.end || 'Today'}
                    </p>
                    {config.periodComparison !== 'none' && (
                      <p>Comparison: {config.periodComparison === 'previous' ? 'Previous Period' : 'Year-over-Year'}</p>
                    )}
                    {config.grouping !== 'none' && <p>Grouping: By {config.grouping}</p>}
                    <p>Format: {config.format.toUpperCase()}</p>
                  </div>
                </div>

                {/* Mock Financial Report Preview */}
                {selectedReport === 'balance' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Current Balance</p>
                        <p className="text-2xl font-semibold text-foreground">₹25,00,000</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">In-Transit</p>
                        <p className="text-2xl font-semibold text-foreground">₹5,00,000</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Reserved</p>
                        <p className="text-2xl font-semibold text-foreground">₹3,00,000</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Pledged</p>
                        <p className="text-2xl font-semibold text-foreground">₹50,00,000</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport === 'roi' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Investment</p>
                        <p className="text-2xl font-semibold text-foreground">₹50,00,000</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Cost per Scholar</p>
                        <p className="text-2xl font-semibold text-foreground">₹3,33,333</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Cost per Graduate</p>
                        <p className="text-2xl font-semibold text-foreground">₹1,66,667</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Cost per Job Placement</p>
                        <p className="text-2xl font-semibold text-foreground">₹2,13,333</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground">Overall ROI</p>
                        <p className="text-2xl font-semibold text-green-600">125%</p>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedReport === 'transfer' || selectedReport === 'disbursement' || selectedReport === 'payment-ledger') && (
                  <div className="p-8 border border-border rounded-lg text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Transaction data would be displayed here</p>
                  </div>
                )}

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


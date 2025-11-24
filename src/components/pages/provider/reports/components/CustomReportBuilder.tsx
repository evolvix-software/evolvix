"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Plus, X, Eye, Download, Search, Filter, FileText, Check } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  category: 'scholar' | 'campaign' | 'application' | 'financial' | 'achievement';
  type: 'text' | 'number' | 'date' | 'boolean';
  selected: boolean;
}

interface CustomReportConfig {
  name: string;
  dataSources: string[];
  selectedFields: string[];
  filters: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  grouping: {
    enabled: boolean;
    field: string;
  };
  format: 'pdf' | 'csv' | 'excel' | 'json' | 'html';
  includeCharts: boolean;
}

export function CustomReportBuilder() {
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [config, setConfig] = useState<CustomReportConfig>({
    name: '',
    dataSources: [],
    selectedFields: [],
    filters: [],
    grouping: { enabled: false, field: '' },
    format: 'pdf',
    includeCharts: true,
  });

  const availableFields: Field[] = [
    // Scholar fields
    { id: 'scholar_name', name: 'Scholar Name', category: 'scholar', type: 'text', selected: false },
    { id: 'scholar_email', name: 'Scholar Email', category: 'scholar', type: 'text', selected: false },
    { id: 'scholar_cgpa', name: 'Current CGPA', category: 'scholar', type: 'number', selected: false },
    { id: 'scholar_baseline_cgpa', name: 'Baseline CGPA', category: 'scholar', type: 'number', selected: false },
    { id: 'scholar_progress', name: 'Progress %', category: 'scholar', type: 'number', selected: false },
    { id: 'scholar_status', name: 'Status', category: 'scholar', type: 'text', selected: false },
    { id: 'scholar_graduation', name: 'Graduation Status', category: 'scholar', type: 'text', selected: false },
    { id: 'scholar_job', name: 'Job Placement', category: 'scholar', type: 'text', selected: false },
    // Campaign fields
    { id: 'campaign_title', name: 'Campaign Title', category: 'campaign', type: 'text', selected: false },
    { id: 'campaign_status', name: 'Campaign Status', category: 'campaign', type: 'text', selected: false },
    { id: 'campaign_slots', name: 'Total Slots', category: 'campaign', type: 'number', selected: false },
    { id: 'campaign_funded', name: 'Funded Amount', category: 'campaign', type: 'number', selected: false },
    // Application fields
    { id: 'application_status', name: 'Application Status', category: 'application', type: 'text', selected: false },
    { id: 'application_score', name: 'Application Score', category: 'application', type: 'number', selected: false },
    { id: 'application_date', name: 'Application Date', category: 'application', type: 'date', selected: false },
    // Financial fields
    { id: 'transfer_amount', name: 'Transfer Amount', category: 'financial', type: 'number', selected: false },
    { id: 'disbursement_amount', name: 'Disbursement Amount', category: 'financial', type: 'number', selected: false },
    { id: 'transfer_date', name: 'Transfer Date', category: 'financial', type: 'date', selected: false },
  ];

  const [fields, setFields] = useState<Field[]>(availableFields);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || field.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleField = (fieldId: string) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, selected: !f.selected } : f));
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      if (field.selected) {
        setConfig({ ...config, selectedFields: config.selectedFields.filter(id => id !== fieldId) });
      } else {
        setConfig({ ...config, selectedFields: [...config.selectedFields, fieldId] });
      }
    }
  };

  const addFilter = () => {
    setConfig({
      ...config,
      filters: [...config.filters, { field: '', operator: 'equals', value: '' }],
    });
  };

  const removeFilter = (index: number) => {
    setConfig({
      ...config,
      filters: config.filters.filter((_, i) => i !== index),
    });
  };

  const handleGenerateReport = () => {
    setShowPreview(true);
  };

  const handleExport = () => {
    alert(`Exporting custom report "${config.name}" as ${config.format.toUpperCase()}`);
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'scholar', label: 'Scholar Fields' },
    { id: 'campaign', label: 'Campaign Fields' },
    { id: 'application', label: 'Application Fields' },
    { id: 'financial', label: 'Financial Fields' },
    { id: 'achievement', label: 'Achievement Fields' },
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 8 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Select Type</span>
            <span>Data Sources</span>
            <span>Fields</span>
            <span>Filters</span>
            <span>Grouping</span>
            <span>Format</span>
            <span>Preview</span>
            <span>Generate</span>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Report Name */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Step 1: Report Name</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Report Name *"
              placeholder="Enter report name"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              required
            />
            <Button onClick={() => setStep(2)} disabled={!config.name} className="w-full">
              Next: Select Data Sources
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Data Sources */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Step 2: Choose Data Sources</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['scholars', 'campaigns', 'applications', 'transfers', 'disbursements'].map((source) => (
                <button
                  key={source}
                  onClick={() => {
                    if (config.dataSources.includes(source)) {
                      setConfig({
                        ...config,
                        dataSources: config.dataSources.filter(s => s !== source),
                      });
                    } else {
                      setConfig({ ...config, dataSources: [...config.dataSources, source] });
                    }
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    config.dataSources.includes(source)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground capitalize">{source}</span>
                    {config.dataSources.includes(source) && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={config.dataSources.length === 0} className="flex-1">
                Next: Select Fields
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Field Selection */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Step 3: Select Fields</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-input rounded-lg p-3">
              {filteredFields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={field.selected}
                    onChange={() => toggleField(field.id)}
                    className="w-4 h-4 rounded border-input"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{field.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{field.category} • {field.type}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(4)} disabled={config.selectedFields.length === 0} className="flex-1">
                Next: Configure Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Filters */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Step 4: Apply Filters</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {config.filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border border-border rounded-lg">
                  <select
                    value={filter.field}
                    onChange={(e) => {
                      const newFilters = [...config.filters];
                      newFilters[index].field = e.target.value;
                      setConfig({ ...config, filters: newFilters });
                    }}
                    className="flex-1 p-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="">Select Field</option>
                    {fields.filter(f => config.selectedFields.includes(f.id)).map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(e) => {
                      const newFilters = [...config.filters];
                      newFilters[index].operator = e.target.value;
                      setConfig({ ...config, filters: newFilters });
                    }}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="equals">Equals</option>
                    <option value="not-equals">Not Equals</option>
                    <option value="greater-than">Greater Than</option>
                    <option value="less-than">Less Than</option>
                    <option value="contains">Contains</option>
                  </select>
                  <Input
                    value={filter.value}
                    onChange={(e) => {
                      const newFilters = [...config.filters];
                      newFilters[index].value = e.target.value;
                      setConfig({ ...config, filters: newFilters });
                    }}
                    placeholder="Value"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeFilter(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addFilter} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Filter
              </Button>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(5)} className="flex-1">
                Next: Configure Grouping
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Grouping */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Step 5: Configure Grouping</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enable-grouping"
                checked={config.grouping.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    grouping: { ...config.grouping, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded border-input"
              />
              <label htmlFor="enable-grouping" className="text-sm text-foreground">
                Enable Grouping
              </label>
            </div>
            {config.grouping.enabled && (
              <select
                value={config.grouping.field}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    grouping: { ...config.grouping, field: e.target.value },
                  })
                }
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="">Select Field to Group By</option>
                {fields.filter(f => config.selectedFields.includes(f.id)).map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            )}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(6)} className="flex-1">
                Next: Choose Format
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Format */}
      {step === 6 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Step 6: Choose Format</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['pdf', 'csv', 'excel', 'json', 'html'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setConfig({ ...config, format })}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    config.format === format
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium text-foreground">{format.toUpperCase()}</p>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="include-charts"
                checked={config.includeCharts}
                onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
                className="w-4 h-4 rounded border-input"
              />
              <label htmlFor="include-charts" className="text-sm text-foreground">
                Include Charts and Visualizations
              </label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(5)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(7)} className="flex-1">
                Next: Preview Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 7: Preview */}
      {step === 7 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Step 7: Preview Report</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">{config.name}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Data Sources: {config.dataSources.join(', ')}</p>
                <p>Selected Fields: {config.selectedFields.length}</p>
                <p>Filters: {config.filters.length}</p>
                <p>Grouping: {config.grouping.enabled ? config.grouping.field : 'None'}</p>
                <p>Format: {config.format.toUpperCase()}</p>
              </div>
            </div>
            <div className="p-8 border border-border rounded-lg text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Report preview would be displayed here</p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(6)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(8)} className="flex-1">
                Next: Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 8: Generate */}
      {step === 8 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Step 8: Generate Report</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                Your custom report is ready to generate!
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep(7)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleExport} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Generate & Export
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


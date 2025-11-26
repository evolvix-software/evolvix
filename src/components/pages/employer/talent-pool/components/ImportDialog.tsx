"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

export function ImportDialog({ isOpen, onClose, onImport }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'complete'>('upload');

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      alert('Please select a CSV file');
    }
  };

  const parseCSV = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Set default column mapping
    const defaultMapping: Record<string, string> = {};
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('name')) defaultMapping[header] = 'name';
      else if (lowerHeader.includes('email')) defaultMapping[header] = 'email';
      else if (lowerHeader.includes('phone')) defaultMapping[header] = 'phone';
      else if (lowerHeader.includes('location')) defaultMapping[header] = 'location';
      else if (lowerHeader.includes('position') || lowerHeader.includes('title')) defaultMapping[header] = 'position';
      else if (lowerHeader.includes('skill')) defaultMapping[header] = 'skills';
      else if (lowerHeader.includes('tag')) defaultMapping[header] = 'tags';
    });
    
    setColumnMapping(defaultMapping);
    setStep('map');
  };

  const handleMapColumns = () => {
    if (!file) return;
    
    const text = file.text();
    text.then(csvText => {
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data: any[] = [];
      const newErrors: string[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row: any = {};
        
        headers.forEach((header, index) => {
          const mappedField = columnMapping[header];
          if (mappedField) {
            row[mappedField] = values[index]?.trim() || '';
          }
        });
        
        // Validate required fields
        if (!row.name || !row.email) {
          newErrors.push(`Row ${i + 1}: Missing required fields (name or email)`);
          continue;
        }
        
        // Process skills and tags
        if (row.skills) {
          row.skills = row.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        if (row.tags) {
          row.tags = row.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
        
        data.push({
          ...row,
          id: `import-${i}`,
          candidateId: `c${Date.now()}-${i}`,
          headline: row.position || 'Candidate',
          skills: row.skills || [],
          tags: row.tags || [],
          interestLevel: 'medium',
          addedAt: new Date().toISOString(),
          matchedJobs: [],
        });
      }
      
      setPreviewData(data);
      setErrors(newErrors);
      setStep('preview');
    });
  };

  const handleImport = () => {
    onImport(previewData);
    setStep('complete');
    setTimeout(() => {
      onClose();
      setStep('upload');
      setFile(null);
      setPreviewData([]);
      setColumnMapping({});
      setErrors([]);
    }, 2000);
  };

  const availableFields = ['name', 'email', 'phone', 'location', 'position', 'skills', 'tags', 'notes'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Import Candidates from CSV</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-foreground mb-2">Upload CSV file</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Required fields: Name, Email
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          )}

          {step === 'map' && file && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Map CSV columns to candidate fields
              </p>
              <div className="space-y-2">
                {Object.keys(columnMapping).map((csvColumn) => (
                  <div key={csvColumn} className="flex items-center gap-2">
                    <span className="text-sm text-foreground w-32">{csvColumn}:</span>
                    <select
                      value={columnMapping[csvColumn] || ''}
                      onChange={(e) => setColumnMapping({ ...columnMapping, [csvColumn]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="">-- Skip --</option>
                      {availableFields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Back
                </Button>
                <Button onClick={handleMapColumns} className="bg-gradient-to-r from-primary to-purple-600">
                  Preview Data
                </Button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              {errors.length > 0 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-600 mb-1">Validation Errors</p>
                      <ul className="text-sm text-yellow-600 list-disc list-inside">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Preview ({previewData.length} candidates)
                </p>
                <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Location</th>
                        <th className="p-2 text-left">Skills</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="border-t border-border">
                          <td className="p-2">{row.name}</td>
                          <td className="p-2">{row.email}</td>
                          <td className="p-2">{row.location || '-'}</td>
                          <td className="p-2">
                            {row.skills?.slice(0, 3).map((s: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs mr-1">{s}</Badge>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ... and {previewData.length - 10} more rows
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep('map')}>
                  Back
                </Button>
                <Button onClick={handleImport} className="bg-gradient-to-r from-primary to-purple-600">
                  Import {previewData.length} Candidates
                </Button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <p className="text-lg font-semibold text-foreground mb-2">
                Import Complete!
              </p>
              <p className="text-muted-foreground">
                Successfully imported {previewData.length} candidates
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


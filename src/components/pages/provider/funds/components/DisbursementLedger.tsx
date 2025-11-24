"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { FileText, Download, Filter, Calendar, Users, Award, Eye, X, Search } from 'lucide-react';
import { scholarService, Scholar, campaignService } from '@/data/mock/providerData';
import { useRouter } from 'next/navigation';

interface DisbursementLedgerProps {
  providerId: string;
}

interface Disbursement {
  id: string;
  scholarId: string;
  scholarName: string;
  amount: number;
  date: Date;
  status: 'scheduled' | 'disbursed' | 'cancelled' | 'refunded';
  campaignId?: string;
  campaignName?: string;
  receiptUrl?: string;
}

export function DisbursementLedger({ providerId }: DisbursementLedgerProps) {
  const router = useRouter();
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [filteredDisbursements, setFilteredDisbursements] = useState<Disbursement[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'scheduled' | 'disbursed' | 'cancelled' | 'refunded',
    scholar: 'all',
    campaign: 'all',
    dateRange: { start: '', end: '' },
  });
  const [groupBy, setGroupBy] = useState<'none' | 'scholar' | 'campaign' | 'status' | 'date'>('none');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Generate mock disbursements from scholars
    const scholars = scholarService.getAll(providerId);
    const campaigns = campaignService.getAll(providerId);
    const mockDisbursements: Disbursement[] = scholars.slice(0, 10).map((scholar, index) => ({
      id: `disbursement_${index + 1}`,
      scholarId: scholar.id,
      scholarName: scholar.profile.name || 'Unknown Scholar',
      amount: 50000 + Math.random() * 100000,
      date: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000),
      status: index % 4 === 0 ? 'scheduled' : index % 4 === 1 ? 'disbursed' : index % 4 === 2 ? 'cancelled' : 'refunded',
      campaignId: scholar.campaignId,
      campaignName: campaigns.find(c => c.id === scholar.campaignId)?.title,
      receiptUrl: index % 4 === 1 ? '#' : undefined,
    }));
    setDisbursements(mockDisbursements);
    setFilteredDisbursements(mockDisbursements);
  }, [providerId]);

  useEffect(() => {
    let filtered = [...disbursements];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(d => d.status === filters.status);
    }

    // Scholar filter
    if (filters.scholar !== 'all') {
      filtered = filtered.filter(d => d.scholarId === filters.scholar);
    }

    // Campaign filter
    if (filters.campaign !== 'all') {
      filtered = filtered.filter(d => d.campaignId === filters.campaign);
    }

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(d => new Date(d.date) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(d => new Date(d.date) <= new Date(filters.dateRange.end));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.scholarName.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query) ||
        d.campaignName?.toLowerCase().includes(query)
      );
    }

    // Grouping
    if (groupBy !== 'none') {
      // Grouping logic would go here
    }

    setFilteredDisbursements(filtered);
  }, [disbursements, filters, groupBy, searchQuery]);

  const scholars = scholarService.getAll(providerId);
  const campaigns = campaignService.getAll(providerId);
  const selectedDisbursement = disbursements.find(d => d.id === showDetails);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disbursed':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'refunded':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search disbursements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="none">No Grouping</option>
                <option value="scholar">Group by Scholar</option>
                <option value="campaign">Group by Campaign</option>
                <option value="status">Group by Status</option>
                <option value="date">Group by Date</option>
              </select>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Scholar</label>
                <select
                  value={filters.scholar}
                  onChange={(e) => setFilters({ ...filters, scholar: e.target.value })}
                  className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="all">All Scholars</option>
                  {scholars.map(s => (
                    <option key={s.id} value={s.id}>{s.profile.name || 'Unknown'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Campaign</label>
                <select
                  value={filters.campaign}
                  onChange={(e) => setFilters({ ...filters, campaign: e.target.value })}
                  className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="all">All Campaigns</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                <Input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                <Input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setFilters({
              status: 'all',
              scholar: 'all',
              campaign: 'all',
              dateRange: { start: '', end: '' },
            })}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Disbursement Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Upcoming Disbursements</h2>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
        </CardHeader>
        <CardContent>
          {filteredDisbursements.filter(d => d.status === 'scheduled').length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No upcoming disbursements scheduled</p>
          ) : (
            <div className="space-y-3">
              {filteredDisbursements.filter(d => d.status === 'scheduled').slice(0, 5).map((disbursement) => (
                <div
                  key={disbursement.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-foreground">{disbursement.scholarName}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{disbursement.amount.toLocaleString('en-IN')} • {disbursement.date.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(disbursement.status)}`}>
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disbursement List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Disbursement Ledger</h2>
        </CardHeader>
        <CardContent>
          {filteredDisbursements.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No disbursements found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDisbursements.map((disbursement) => (
                <div
                  key={disbursement.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setShowDetails(disbursement.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-foreground">{disbursement.scholarName}</p>
                        {disbursement.campaignName && (
                          <span className="text-xs text-muted-foreground">{disbursement.campaignName}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">₹{disbursement.amount.toLocaleString('en-IN')}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {disbursement.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(disbursement.status)}`}>
                      {disbursement.status}
                    </span>
                    {disbursement.receiptUrl && (
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                        <Download className="w-4 h-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setShowDetails(disbursement.id); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disbursement Details Modal */}
      {showDetails && selectedDisbursement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Disbursement Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Scholar</p>
                  <p className="font-semibold text-foreground">{selectedDisbursement.scholarName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-foreground">₹{selectedDisbursement.amount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDisbursement.status)}`}>
                    {selectedDisbursement.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground">{selectedDisbursement.date.toLocaleDateString()}</p>
                </div>
                {selectedDisbursement.campaignName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Campaign</p>
                    <p className="font-semibold text-foreground">{selectedDisbursement.campaignName}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                {selectedDisbursement.receiptUrl && (
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => router.push(`/portal/provider/scholars/${selectedDisbursement.scholarId}`)}>
                  <Users className="w-4 h-4 mr-2" />
                  View Scholar Profile
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowDetails(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


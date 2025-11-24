"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Transfer, transferService, campaignService } from '@/data/mock/providerData';
import { Calendar, FileText, CheckCircle, Clock, XCircle, Filter, Download, Eye, X } from 'lucide-react';

interface TransferHistoryProps {
  providerId: string;
}

type TransferStatus = 'all' | 'initiated' | 'in-transit' | 'confirmed' | 'failed' | 'cancelled';
type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'status';

export function TransferHistory({ providerId }: TransferHistoryProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all' as TransferStatus,
    campaign: 'all',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' },
  });
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const allTransfers = transferService.getAll(providerId);
      setTransfers(allTransfers);
      setFilteredTransfers(allTransfers);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      setTransfers([]);
      setFilteredTransfers([]);
    }
    setLoading(false);
  }, [providerId]);

  useEffect(() => {
    let filtered = [...transfers];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Campaign filter
    if (filters.campaign !== 'all') {
      filtered = filtered.filter(t => t.campaignId === filters.campaign);
    }

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(t => new Date(t.createdAt) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(t => new Date(t.createdAt) <= new Date(filters.dateRange.end));
    }

    // Amount range filter
    if (filters.amountRange.min) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.amountRange.min));
    }
    if (filters.amountRange.max) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.amountRange.max));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.transactionReference?.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredTransfers(filtered);
  }, [transfers, filters, sortBy, searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-transit':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'in-transit':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const campaigns = campaignService.getAll(providerId);
  const selectedTransfer = transfers.find(t => t.id === showDetails);

  if (loading) {
    return <div className="text-center py-8">Loading transfers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search transfers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<FileText className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
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
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as TransferStatus })}
                  className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="all">All Statuses</option>
                  <option value="initiated">Initiated</option>
                  <option value="in-transit">In Transit</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
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
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Min Amount</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.amountRange.min}
                  onChange={(e) => setFilters({ ...filters, amountRange: { ...filters.amountRange, min: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Max Amount</label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={filters.amountRange.max}
                  onChange={(e) => setFilters({ ...filters, amountRange: { ...filters.amountRange, max: e.target.value } })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setFilters({
                status: 'all',
                campaign: 'all',
                dateRange: { start: '', end: '' },
                amountRange: { min: '', max: '' },
              })}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTransfers.length} transfer(s) found
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
          <option value="status">By Status</option>
        </select>
      </div>

      {/* Transfer List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Transfer History</h2>
        </CardHeader>
        <CardContent>
          {filteredTransfers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transfers found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setShowDetails(transfer.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(transfer.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-foreground">
                          ₹{transfer.amount.toLocaleString('en-IN')}
                        </p>
                        {transfer.campaignId && (
                          <span className="text-xs text-muted-foreground">
                            {campaigns.find(c => c.id === transfer.campaignId)?.title || 'Unknown Campaign'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(transfer.createdAt).toLocaleDateString()}
                        </span>
                        {transfer.transactionReference && (
                          <span>Ref: {transfer.transactionReference}</span>
                        )}
                        <span className="capitalize">{transfer.transferMethod.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                      {transfer.status.replace('-', ' ')}
                    </span>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setShowDetails(transfer.id); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer Details Modal */}
      {showDetails && selectedTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Transfer Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transfer ID</p>
                  <p className="font-semibold text-foreground">{selectedTransfer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-foreground">₹{selectedTransfer.amount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransfer.status)}`}>
                    {selectedTransfer.status.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold text-foreground capitalize">{selectedTransfer.transferMethod.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Reference</p>
                  <p className="font-semibold text-foreground">{selectedTransfer.transactionReference || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-semibold text-foreground">{new Date(selectedTransfer.createdAt).toLocaleString()}</p>
                </div>
                {selectedTransfer.confirmedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmed Date</p>
                    <p className="font-semibold text-foreground">{new Date(selectedTransfer.confirmedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {selectedTransfer.proofFileUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Proof Document</p>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Proof
                  </Button>
                </div>
              )}
              {selectedTransfer.status === 'failed' && (
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">This transfer failed. Please retry or contact support.</p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {selectedTransfer.proofFileUrl && (
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                )}
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


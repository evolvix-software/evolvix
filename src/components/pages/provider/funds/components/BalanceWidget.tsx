"use client";

import { useState, useEffect } from 'react';
import { Provider, transferService, Transfer, scholarService, Scholar } from '@/data/mock/providerData';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Clock, Lock, TrendingUp, FileText, Users, Eye, Info, GraduationCap, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BalanceWidgetProps {
  provider: Provider | null;
}

export function BalanceWidget({ provider }: BalanceWidgetProps) {
  const router = useRouter();
  const [recentTransfers] = useState<Transfer[]>(() => {
    if (!provider) return [];
    return transferService.getAll(provider.id).slice(0, 5);
  });
  const [supportedScholars, setSupportedScholars] = useState<Scholar[]>([]);

  useEffect(() => {
    if (provider?.id) {
      // Get scholars supported by this provider
      const scholars = scholarService.getAll(provider.id);
      setSupportedScholars(scholars);
    }
  }, [provider]);

  if (!provider) return null;

  const fundStatus = {
    currentBalance: provider.balance,
    inTransit: recentTransfers.filter(t => t.status === 'in-transit').reduce((sum, t) => sum + t.amount, 0),
    reserved: provider.totalPledged - provider.totalTransferred - provider.balance,
    totalPledged: provider.totalPledged,
    totalTransferred: provider.totalTransferred,
    totalDisbursed: provider.totalDisbursed,
    pendingDisbursements: provider.totalDisbursed * 0.1, // Mock: 10% pending
  };

  const roiPercentage = fundStatus.totalPledged > 0 
    ? ((fundStatus.totalDisbursed / fundStatus.totalPledged) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              ₹{(fundStatus.currentBalance / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">Available for disbursement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">In Transit</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              ₹{(fundStatus.inTransit / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">Being transferred</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Reserved</span>
              <Lock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              ₹{(fundStatus.reserved / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">Reserved for awards</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total Transferred</span>
              <ArrowUpCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              ₹{(fundStatus.totalTransferred / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">All time transfers</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/portal/provider/funds?tab=transfers')}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Total Investment</h3>
            <p className="text-2xl font-bold text-foreground">
              ₹{(fundStatus.totalPledged / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">Total amount pledged</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/portal/provider/funds?tab=disbursements')}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Funds Disbursed</h3>
            <p className="text-2xl font-bold text-foreground">
              ₹{(fundStatus.totalDisbursed / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">Total disbursed to scholars</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              ROI Percentage
              <TrendingUp className="w-4 h-4 text-green-600" />
            </h3>
            <p className="text-2xl font-bold text-green-600">{roiPercentage}%</p>
            <p className="text-xs text-muted-foreground mt-2">Return on investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Funds Available</h3>
            <p className="text-2xl font-bold text-foreground">
              ₹{(fundStatus.currentBalance / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">Ready for disbursement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Funds Reserved</h3>
            <p className="text-2xl font-bold text-foreground">
              ₹{(fundStatus.reserved / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">Reserved for awards</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Funds Pending</h3>
            <p className="text-2xl font-bold text-foreground">
              ₹{(fundStatus.pendingDisbursements / 100000).toFixed(2)}L
            </p>
            <p className="text-xs text-muted-foreground mt-2">Scheduled disbursements</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/portal/provider/funds?tab=transfers')}>
              View All Transfers
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/portal/provider/funds?tab=disbursements')}>
              View All Disbursements
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recent Transfers */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ArrowUpCircle className="w-4 h-4" />
                Recent Transfers
              </h3>
              {recentTransfers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent transfers</p>
              ) : (
                <div className="space-y-2">
                  {recentTransfers.map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          transfer.status === 'confirmed' ? 'bg-green-600' :
                          transfer.status === 'in-transit' ? 'bg-orange-600' :
                          transfer.status === 'failed' ? 'bg-red-600' : 'bg-gray-600'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            ₹{transfer.amount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transfer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transfer.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        transfer.status === 'in-transit' ? 'bg-orange-100 text-orange-700' :
                        transfer.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {transfer.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Disbursements */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ArrowDownCircle className="w-4 h-4" />
                Upcoming Disbursements
              </h3>
              <p className="text-sm text-muted-foreground">No upcoming disbursements scheduled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evolvix Fund Distribution Transparency */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Evolvix Fund Distribution (Transparency)
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This section shows how Evolvix distributes funds to students that scholars transferred to Evolvix, 
                providing transparency into fund utilization.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-muted-foreground mb-1">Total Distributed to Students</p>
                <p className="text-2xl font-bold text-foreground">₹25,00,000</p>
                <p className="text-xs text-muted-foreground mt-1">From your transfers</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-muted-foreground mb-1">Students Supported</p>
                <p className="text-2xl font-bold text-foreground">150</p>
                <p className="text-xs text-muted-foreground mt-1">Active recipients</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-muted-foreground mb-1">Average per Student</p>
                <p className="text-2xl font-bold text-foreground">₹16,667</p>
                <p className="text-xs text-muted-foreground mt-1">Per student allocation</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-foreground mb-2">Recent Distributions:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 50 students received disbursements this month</li>
                <li>• Average disbursement: ₹15,000 per student</li>
                <li>• Funds distributed across 5 active campaigns</li>
                <li>• Distribution rate: 95% of transferred funds</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scholar Growth (if applicable) */}
      {supportedScholars.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Scholar Growth</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                View the growth and progress of scholars you've supported through your fund transfers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">Scholars Supported</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{supportedScholars.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active scholars</p>
                </div>
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-muted-foreground">Avg CGPA Improvement</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    +{supportedScholars.length > 0 
                      ? (supportedScholars.reduce((sum, s) => {
                          const improvement = s.cgpaImprovement || (s.currentCGPA ? s.currentCGPA - s.baselineCGPA : 0);
                          return sum + improvement;
                        }, 0) / supportedScholars.length).toFixed(1)
                      : '0.0'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">CGPA points</p>
                </div>
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-muted-foreground">Graduation Rate</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {supportedScholars.length > 0
                      ? Math.round((supportedScholars.filter(s => s.graduationStatus === 'graduated').length / supportedScholars.length) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {supportedScholars.filter(s => s.graduationStatus === 'graduated').length} graduated
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-muted-foreground">Job Placement Rate</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {supportedScholars.length > 0
                      ? Math.round((supportedScholars.filter(s => s.jobPlacement?.status === 'started').length / supportedScholars.length) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {supportedScholars.filter(s => s.jobPlacement?.status === 'started').length} placed
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/portal/provider/scholars')}
                  className="w-full sm:w-auto"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Supported Scholars
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex-1" onClick={() => router.push('/portal/provider/funds?tab=transfers')}>
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Transfer Funds
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => router.push('/portal/provider/funds?tab=transfers')}>
              <FileText className="w-4 h-4 mr-2" />
              View Transfer History
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => router.push('/portal/provider/funds?tab=disbursements')}>
              <Eye className="w-4 h-4 mr-2" />
              View Disbursements
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => router.push('/portal/provider/funds?tab=reports')}>
              <FileText className="w-4 h-4 mr-2" />
              View Transparency
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


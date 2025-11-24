"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Info, Eye, TrendingUp, DollarSign, Users, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import { transferService, providerService, scholarService, Scholar } from '@/data/mock/providerData';
import { useEffect, useState } from 'react';

interface ReportsTabProps {
  providerId: string;
}

/**
 * Fund Transparency Tab - Shows provider's own transactions and distributions
 * NOTE: Comprehensive financial reports are ADMIN-ONLY (see /admin/reports)
 */
export function ReportsTab({ providerId }: ReportsTabProps) {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [supportedScholars, setSupportedScholars] = useState<Scholar[]>([]);
  const provider = providerService.getCurrentProvider();

  useEffect(() => {
    if (provider?.id) {
      const providerTransfers = transferService.getAll(provider.id);
      setTransfers(providerTransfers);
      
      // Get scholars supported by this provider
      const scholars = scholarService.getAll(provider.id);
      setSupportedScholars(scholars);
    }
  }, [provider]);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Fund Transparency View
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This page shows transparency information about your fund transactions and distributions. 
                For comprehensive financial reports and analytics, please contact Evolvix administrators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Fund Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Your Fund Transactions</h2>
          </div>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transfers.slice(0, 5).map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Transfer #{transfer.id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transfer.transferDate).toLocaleDateString()} • {transfer.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₹{transfer.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground capitalize">{transfer.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evolvix Fund Distribution (Transparency) */}
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
            <div className="p-4 bg-background rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Distributed to Students</p>
                  <p className="text-2xl font-bold text-foreground">₹25,00,000</p>
                  <p className="text-xs text-muted-foreground mt-1">From your transfers</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Students Supported</p>
                  <p className="text-2xl font-bold text-foreground">150</p>
                  <p className="text-xs text-muted-foreground mt-1">Active recipients</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Average per Student</p>
                  <p className="text-2xl font-bold text-foreground">₹16,667</p>
                  <p className="text-xs text-muted-foreground mt-1">Per student allocation</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-background rounded-lg border border-blue-200 dark:border-blue-800">
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
                View the growth and progress of scholars you've supported through your fund transfers (if applicable).
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Note about Admin Reports */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                Need Comprehensive Reports?
              </h3>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                Comprehensive financial reports, analytics, and detailed breakdowns are available 
                to Evolvix administrators only. If you need detailed reports, please contact the admin team.
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                <span>Contact Admin</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

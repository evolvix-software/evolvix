"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Scholar } from '@/data/mock/providerData';
import { DollarSign, Calendar, FileText, Download } from 'lucide-react';

interface FinancialsTabProps {
  scholar: Scholar;
}

export function FinancialsTab({ scholar }: FinancialsTabProps) {
  // Mock disbursement data - in real app, this would come from API
  const disbursements = [
    {
      id: '1',
      amount: scholar.awardAmount * 0.5,
      date: scholar.awardDate,
      status: 'completed',
      receipt: '#',
    },
    {
      id: '2',
      amount: scholar.awardAmount * 0.3,
      date: new Date(new Date(scholar.awardDate).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      receipt: '#',
    },
    {
      id: '3',
      amount: scholar.awardAmount * 0.2,
      date: new Date(new Date(scholar.awardDate).getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      receipt: null,
    },
  ];

  const totalDisbursed = disbursements
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);
  const pendingDisbursements = disbursements.filter(d => d.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Summary
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Award Amount</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{scholar.awardAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Disbursed Amount</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{totalDisbursed.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Disbursements</p>
              <p className="text-2xl font-bold text-yellow-600">
                ₹{(scholar.awardAmount - totalDisbursed).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disbursement History */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Disbursement History</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {disbursements.map((disbursement) => (
              <div
                key={disbursement.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      ₹{disbursement.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(disbursement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      disbursement.status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                    }`}
                  >
                    {disbursement.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                  {disbursement.receipt && (
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disbursement Schedule */}
      {pendingDisbursements.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Upcoming Disbursements</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDisbursements.map((disbursement) => (
                <div
                  key={disbursement.id}
                  className="p-4 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        ₹{disbursement.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Scheduled: {new Date(disbursement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 text-xs font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


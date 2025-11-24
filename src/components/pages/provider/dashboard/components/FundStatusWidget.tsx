"use client";

import { Wallet, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { FundStatus } from '@/interfaces/providerDashboard';

interface FundStatusWidgetProps {
    status: FundStatus;
}

export function FundStatusWidget({ status }: FundStatusWidgetProps) {
    const formatCurrency = (amount: number) => {
        return `₹${(amount / 100000).toFixed(1)}L`;
    };

    const total = status.currentBalance + status.inTransit + status.reserved;
    const balancePercent = (status.currentBalance / total) * 100;
    const transitPercent = (status.inTransit / total) * 100;
    const reservedPercent = (status.reserved / total) * 100;

    return (
        <Card className="h-full border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-primary" />
                        Fund Status
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        View History <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-3xl font-bold text-foreground">
                                {formatCurrency(status.currentBalance)}
                            </h3>
                            <Button size="sm" className="bg-primary hover:bg-primary/90 w-full sm:w-auto py-4">
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                Transfer Funds
                            </Button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                            <div
                                className="h-full bg-green-500"
                                style={{ width: `${balancePercent}%` }}
                                title="Available"
                            />
                            <div
                                className="h-full bg-yellow-500"
                                style={{ width: `${transitPercent}%` }}
                                title="In Transit"
                            />
                            <div
                                className="h-full bg-blue-500"
                                style={{ width: `${reservedPercent}%` }}
                                title="Reserved"
                            />
                        </div>
                        <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                                Available ({formatCurrency(status.currentBalance)})
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1" />
                                In Transit ({formatCurrency(status.inTransit)})
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                                Reserved ({formatCurrency(status.reserved)})
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div>
                            <p className="text-xs text-muted-foreground">Total Pledged</p>
                            <p className="text-sm font-semibold text-foreground">{formatCurrency(status.totalPledged)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Disbursed</p>
                            <p className="text-sm font-semibold text-foreground">{formatCurrency(status.totalDisbursed)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

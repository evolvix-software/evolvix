"use client";

import { Wallet, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Disbursement } from '@/interfaces/providerDashboard';

interface RecentDisbursementsProps {
    disbursements: Disbursement[];
}

export function RecentDisbursements({ disbursements }: RecentDisbursementsProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'processing':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <Card className="h-full border-0 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-primary" />
                        Recent Disbursements
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {disbursements.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 font-bold text-xs">
                                    ₹
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{item.scholarName}</p>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        {getStatusIcon(item.status)}
                                        <span className="ml-1 capitalize">{item.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-foreground">₹{(item.amount / 1000).toFixed(0)}k</p>
                                <p className="text-xs text-muted-foreground">{formatDate(item.date)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

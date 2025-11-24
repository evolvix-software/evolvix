"use client";

import { FileText, Wallet, Users, Megaphone, FileBarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { useRouter } from 'next/navigation';

export function QuickActions() {
    const router = useRouter();

    const actions = [
        {
            label: 'View Campaigns',
            icon: Megaphone,
            onClick: () => router.push('/portal/provider/campaigns'),
            variant: 'default' as const,
        },
        {
            label: 'Review Applications',
            icon: FileText,
            onClick: () => router.push('/portal/provider/applications'),
            variant: 'outline' as const,
        },
        {
            label: 'Transfer Funds',
            icon: Wallet,
            onClick: () => router.push('/portal/provider/funds'),
            variant: 'outline' as const,
        },
        {
            label: 'View Scholars',
            icon: Users,
            onClick: () => router.push('/portal/provider/scholars'),
            variant: 'outline' as const,
        },
        {
            label: 'View Analytics',
            icon: FileBarChart,
            onClick: () => router.push('/portal/provider/analytics'),
            variant: 'outline' as const,
        },
    ];

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant}
                            onClick={action.onClick}
                            className={`h-auto flex-col items-center justify-center p-4 space-y-2 ${action.variant === 'default'
                                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                    : 'hover:bg-secondary border-dashed'
                                }`}
                        >
                            <action.icon className={`w-5 h-5 ${action.variant === 'default' ? '' : 'text-primary'}`} />
                            <span className="text-xs font-medium text-center whitespace-normal">
                                {action.label}
                            </span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

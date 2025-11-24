"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { ApplicationStats } from './components/ApplicationStats';
import { ApplicationFilters } from './components/ApplicationFilters';
import { ApplicationList } from './components/ApplicationList';
import { mockApplications, mockApplicationStats } from '@/data/mock/providerApplicationsData';
import { Button } from '@/components/common/forms/Button';
import { Plus } from 'lucide-react';

export function ApplicationsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<any>({});

    // Mock filtering logic
    const filteredApplications = mockApplications.filter(app => {
        const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !filters.status || filters.status === 'All' ||
            (filters.status === 'Verification' && app.status === 'under_verification') ||
            (filters.status === 'Review' && app.status === 'review_pending') ||
            app.status.toLowerCase() === filters.status.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const handleViewApplication = (id: string) => {
        router.push(`/portal/provider/applications/${id}`);
    };

    return (
        <Layout title="Applications Queue" role="provider" noCard>
            <div className="p-6 max-w-[1600px] mx-auto space-y-6">
                {/* Header Actions
                <div className="flex justify-end">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        New Application
                    </Button>
                </div> */}

                {/* Stats Overview */}
                <ApplicationStats stats={mockApplicationStats} />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <ApplicationFilters
                            onSearch={setSearchQuery}
                            onFilterChange={setFilters}
                            activeFilters={filters}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <ApplicationList
                            applications={filteredApplications}
                            onView={handleViewApplication}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

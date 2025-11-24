import { Application } from '@/interfaces/providerApplications';
import { ApplicationCard } from './ApplicationCard';
import { Button } from '@/components/common/forms/Button';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import { useState } from 'react';

interface ApplicationListProps {
    applications: Application[];
    onView: (id: string) => void;
}

export function ApplicationList({ applications, onView }: ApplicationListProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Applications ({applications.length})</h3>
                <div className="flex space-x-1 bg-secondary/50 p-1 rounded-lg">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setViewMode('list')}
                    >
                        <ListIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applications.map((app) => (
                        <ApplicationCard key={app.id} application={app} onView={onView} />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {/* List view implementation placeholder - reusing card for now but stacked */}
                    {applications.map((app) => (
                        <ApplicationCard key={app.id} application={app} onView={onView} />
                    ))}
                </div>
            )}
        </div>
    );
}

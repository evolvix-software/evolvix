import { Input } from '@/components/common/forms/Input';
import { Button } from '@/components/common/forms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Search, Filter, X } from 'lucide-react';

interface ApplicationFiltersProps {
    onSearch: (query: string) => void;
    onFilterChange: (filters: any) => void;
    activeFilters: any;
}

export function ApplicationFilters({ onSearch, onFilterChange, activeFilters }: ApplicationFiltersProps) {
    return (
        <Card className="border-0 shadow-sm h-fit">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => onFilterChange({})}>
                        Clear
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search student or ID..."
                        className="pl-9"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Submitted', 'Verification', 'Review', 'Shortlisted'].map((status) => (
                            <Button
                                key={status}
                                variant={activeFilters.status === status ? 'default' : 'outline'}
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => onFilterChange({ ...activeFilters, status })}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Priority</label>
                    <div className="flex flex-wrap gap-2">
                        {['High', 'Medium', 'Low'].map((priority) => (
                            <Button
                                key={priority}
                                variant={activeFilters.priority === priority ? 'default' : 'outline'}
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => onFilterChange({ ...activeFilters, priority })}
                            >
                                {priority}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Campaign Filter (Mock) */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Campaign</label>
                    <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        onChange={(e) => onFilterChange({ ...activeFilters, campaign: e.target.value })}
                    >
                        <option value="">All Campaigns</option>
                        <option value="CMP-2024-001">Tech Leaders 2024</option>
                        <option value="CMP-2024-002">Future Innovators</option>
                    </select>
                </div>
            </CardContent>
        </Card>
    );
}

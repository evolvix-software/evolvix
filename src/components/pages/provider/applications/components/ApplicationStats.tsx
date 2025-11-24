import { Card, CardContent } from '@/components/common/forms/Card';
import { ApplicationStats as StatsType } from '@/interfaces/providerApplications';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ApplicationStatsProps {
    stats: StatsType;
}

export function ApplicationStats({ stats }: ApplicationStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Applications</p>
                        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</h3>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-yellow-50 dark:bg-yellow-900/20">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Under Verification</p>
                        <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.underVerification}</h3>
                    </div>
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-purple-50 dark:bg-purple-900/20">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Review Pending</p>
                        <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.reviewPending}</h3>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Shortlisted</p>
                        <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.shortlisted}</h3>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Application } from '@/interfaces/providerApplications';
import { StatusBadge } from './StatusBadge';
import { MoreVertical, FileText, Award, AlertTriangle } from 'lucide-react';

interface ApplicationCardProps {
    application: Application;
    onView: (id: string) => void;
}

export function ApplicationCard({ application, onView }: ApplicationCardProps) {
    return (
        <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(application.id)}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {application.studentName.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">{application.studentName}</h4>
                            <p className="text-xs text-muted-foreground">{application.id}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Campaign:</span>
                        <span className="font-medium truncate max-w-[150px]" title={application.campaignName}>
                            {application.campaignName}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">CGPA:</span>
                        <span className="font-medium">{application.cgpa}</span>
                    </div>
                    {application.totalScore && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Score:</span>
                            <span className="font-bold text-primary">{application.totalScore}/100</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <StatusBadge status={application.status} />

                    <div className="flex space-x-2">
                        {application.flags.length > 0 && (
                            <div className="text-yellow-500" title="Has Flags">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        )}
                        {application.documents.length > 0 && (
                            <div className="text-blue-500" title="Documents Uploaded">
                                <FileText className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

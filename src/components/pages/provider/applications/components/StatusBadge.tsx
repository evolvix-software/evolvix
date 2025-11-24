import { Badge } from '@/components/common/ui/Badge';
import { ApplicationStatus, VerificationStatus, DocumentStatus } from '@/interfaces/providerApplications';

interface StatusBadgeProps {
    status: ApplicationStatus | VerificationStatus | DocumentStatus;
    type?: 'application' | 'verification' | 'document';
}

export function StatusBadge({ status, type = 'application' }: StatusBadgeProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            // Application Statuses
            case 'submitted':
                return { variant: 'secondary', label: 'Submitted' };
            case 'under_verification':
                return { variant: 'warning', label: 'Under Verification' };
            case 'review_pending':
                return { variant: 'info', label: 'Review Pending' };
            case 'shortlisted':
                return { variant: 'success', label: 'Shortlisted' };
            case 'awarded':
                return { variant: 'success', label: 'Awarded' };
            case 'rejected':
                return { variant: 'destructive', label: 'Rejected' };

            // Verification & Document Statuses
            case 'pending':
                return { variant: 'secondary', label: 'Pending' };
            case 'in_progress':
                return { variant: 'warning', label: 'In Progress' };
            case 'completed':
                return { variant: 'success', label: 'Verified' };
            case 'verified':
                return { variant: 'success', label: 'Verified' };
            case 'needs_info':
                return { variant: 'destructive', label: 'Needs Info' };

            default:
                return { variant: 'secondary', label: status };
        }
    };

    const config = getStatusConfig(status);

    return (
        <Badge variant={config.variant as any} className="capitalize">
            {config.label}
        </Badge>
    );
}

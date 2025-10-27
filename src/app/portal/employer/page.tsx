import GenericPortal from '../generic-portal';
import { Building2 } from 'lucide-react';

export default function EmployerPortal() {
  return (
    <GenericPortal
      role="employer"
      title="Employer Portal"
      icon={<Building2 className="w-5 h-5 text-white" />}
      color="from-orange-500 to-orange-600"
      description="Find and hire talented professionals for your organization. Post jobs, manage applications, and build your employer brand."
    />
  );
}

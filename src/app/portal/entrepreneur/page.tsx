import GenericPortal from '../generic-portal';
import { Lightbulb } from 'lucide-react';

export default function EntrepreneurPortal() {
  return (
    <GenericPortal
      role="entrepreneur"
      title="Entrepreneur Zone"
      icon={<Lightbulb className="w-5 h-5 text-white" />}
      color="from-yellow-500 to-yellow-600"
      description="Build, launch, and scale your innovative business ideas. Access startup tools, funding opportunities, and mentor networks."
    />
  );
}

import GenericPortal from '../generic-portal';
import { Heart } from 'lucide-react';

export default function SponsorPortal() {
  return (
    <GenericPortal
      role="sponsor"
      title="Sponsor Portal"
      icon={<Heart className="w-5 h-5 text-white" />}
      color="from-pink-500 to-pink-600"
      description="Support education and innovation through sponsorship programs. Track your impact, manage CSR initiatives, and build brand visibility."
    />
  );
}

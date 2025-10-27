import GenericPortal from '../generic-portal';
import { TrendingUp } from 'lucide-react';

export default function InvestorPortal() {
  return (
    <GenericPortal
      role="investor"
      title="Investor Portal"
      icon={<TrendingUp className="w-5 h-5 text-white" />}
      color="from-purple-500 to-purple-600"
      description="Discover and invest in promising startups and ventures. Access due diligence tools, portfolio management, and investment opportunities."
    />
  );
}

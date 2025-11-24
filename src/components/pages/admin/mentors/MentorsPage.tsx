"use client";

import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { Search, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { providerService } from '@/data/mock/providerData';

export function MentorsPage() {
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!provider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        const newProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(newProvider);
      }
    }
    setLoading(false);
  }, [provider]);

  // Mock mentor data
  const mentors: any[] = [];

  if (loading) {
    return (
      <Layout title="Mentors & Payroll" role="provider">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mentors & Payroll" role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mentors & Payroll</h1>
            <p className="text-muted-foreground mt-1">
              Manage mentors and track payroll costs
            </p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Payroll Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Total Mentors</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Total Sessions</span>
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Total Payroll</span>
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">₹0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Avg Session Cost</span>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">₹0</p>
            </CardContent>
          </Card>
        </div>

        {/* Mentors List */}
        {mentors.length === 0 ? (
          <EmptyState
            title="No mentors found"
            description="No mentors are currently associated with your organization."
            icon={<Users className="w-12 h-12 text-muted-foreground" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card key={mentor.id}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}


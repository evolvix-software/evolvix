"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Plug, CheckCircle2, XCircle, Settings, ExternalLink } from 'lucide-react';
import { Integration } from '../types';

interface IntegrationsTabProps {
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

const availableIntegrations: Omit<Integration, 'id' | 'connected' | 'lastSync' | 'config'>[] = [
  { name: 'Greenhouse', type: 'ats' },
  { name: 'Lever', type: 'ats' },
  { name: 'Workday', type: 'ats' },
  { name: 'Google Calendar', type: 'calendar' },
  { name: 'Outlook Calendar', type: 'calendar' },
  { name: 'Gmail', type: 'email' },
  { name: 'Outlook', type: 'email' },
  { name: 'Slack', type: 'slack' },
  { name: 'Zapier', type: 'zapier' },
  { name: 'Webhooks', type: 'webhook' },
];

export function IntegrationsTab({ onUnsavedChanges }: IntegrationsTabProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Slack',
      type: 'slack',
      connected: true,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Google Calendar',
      type: 'calendar',
      connected: true,
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const handleConnect = (integration: typeof availableIntegrations[0]) => {
    const newIntegration: Integration = {
      id: Date.now().toString(),
      name: integration.name,
      type: integration.type,
      connected: true,
      lastSync: new Date().toISOString(),
    };
    setIntegrations([...integrations, newIntegration]);
    onUnsavedChanges?.(true);
    alert(`${integration.name} connected successfully!`);
  };

  const handleDisconnect = (id: string) => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      setIntegrations(integrations.filter(i => i.id !== id));
      onUnsavedChanges?.(true);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ats: 'ATS System',
      calendar: 'Calendar',
      email: 'Email',
      slack: 'Communication',
      zapier: 'Automation',
      webhook: 'Webhook',
    };
    return labels[type] || type;
  };

  const connectedIntegrations = integrations.filter(i => i.connected);
  const availableToConnect = availableIntegrations.filter(
    ai => !integrations.some(i => i.name === ai.name && i.connected)
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Integrations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your favorite tools and services
        </p>
      </div>

      {/* Connected Integrations */}
      {connectedIntegrations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Connected</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {connectedIntegrations.map((integration) => (
              <Card key={integration.id} className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Plug className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground">{integration.name}</h4>
                        <Badge variant="primary" className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Connected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {getTypeLabel(integration.type)}
                      </p>
                      {integration.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          Last sync: {new Date(integration.lastSync).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Available Integrations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {availableToConnect.map((integration, index) => (
            <Card key={index} className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Plug className="w-5 h-5 text-muted-foreground" />
                      <h4 className="font-semibold text-foreground">{integration.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getTypeLabel(integration.type)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect(integration)}
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


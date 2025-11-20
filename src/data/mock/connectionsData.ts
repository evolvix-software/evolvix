/**
 * Mock Connections Data
 */

import { Connection, ConnectionRequest, CompanyConnection, CompanyConnectionRequest } from '@/interfaces/connections';

export const mockConnections: Connection[] = [
  {
    id: 'conn-1',
    userId: 'user-1',
    userName: 'Sarah Johnson',
    userTitle: 'Senior Frontend Developer',
    company: 'Google',
    connectionLevel: '1st',
    status: 'connected',
    connectedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'conn-2',
    userId: 'user-2',
    userName: 'Michael Chen',
    userTitle: 'Full Stack Engineer',
    company: 'Microsoft',
    connectionLevel: '1st',
    status: 'connected',
    connectedAt: '2024-11-01T14:30:00Z',
  },
  {
    id: 'conn-3',
    userId: 'user-3',
    userName: 'Emily Rodriguez',
    userTitle: 'UI/UX Designer',
    company: 'Meta',
    connectionLevel: '2nd',
    status: 'connected',
  },
];

export const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req-1',
    fromUserId: 'user-4',
    fromUserName: 'David Kim',
    fromUserTitle: 'Product Manager',
    fromCompany: 'Amazon',
    toUserId: 'current-user',
    note: 'Hi! I saw your work on React projects. Would love to connect and learn more.',
    sentAt: '2024-12-18T09:00:00Z',
    status: 'pending',
  },
  {
    id: 'req-2',
    fromUserId: 'user-5',
    fromUserName: 'Lisa Wang',
    fromUserTitle: 'Data Scientist',
    fromCompany: 'Netflix',
    toUserId: 'current-user',
    sentAt: '2024-12-17T15:20:00Z',
    status: 'pending',
  },
];

export const mockCompanyConnections: CompanyConnection[] = [
  {
    companyId: 'comp-1',
    companyName: 'Tecosys',
    status: 'connected',
    connectedAt: '2024-12-10T10:00:00Z',
  },
  {
    companyId: 'comp-2',
    companyName: 'Quik Hire',
    status: 'pending',
  },
];

// Mock company connection requests - these would be sent to company owners
export const mockCompanyConnectionRequests: CompanyConnectionRequest[] = [
  {
    id: 'comp-req-1',
    fromUserId: 'student-1',
    fromUserName: 'John Doe',
    fromUserTitle: 'Student at Evolvix',
    toCompanyId: 'comp-1',
    toCompanyName: 'Tecosys',
    note: 'Hi! I\'m interested in learning more about your company and opportunities. I\'m currently studying frontend development and would love to connect.',
    sentAt: '2024-12-19T10:00:00Z',
    status: 'pending',
  },
];


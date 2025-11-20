/**
 * Connection types for LinkedIn-style networking
 */

export interface Connection {
  id: string;
  userId: string;
  userName: string;
  userTitle: string;
  userAvatar?: string;
  company?: string;
  connectionLevel: '1st' | '2nd' | '3rd' | 'outside';
  status: 'connected' | 'pending' | 'ignored' | 'withdrawn';
  connectedAt?: string;
  note?: string; // Note sent with connection request
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserTitle: string;
  fromUserAvatar?: string;
  fromCompany?: string;
  toUserId: string;
  note?: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'ignored' | 'withdrawn';
}

export interface CompanyConnection {
  companyId: string;
  companyName: string;
  status: 'connected' | 'pending' | 'not-connected';
  connectedAt?: string;
  note?: string;
}

export interface CompanyConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserTitle?: string;
  fromUserAvatar?: string;
  toCompanyId: string;
  toCompanyName: string;
  note: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'ignored' | 'withdrawn';
}


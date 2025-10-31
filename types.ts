
export interface ScopeItem {
  customerCode: string;
  customerName: string;
  allowedEndpoints: string[];
}

export interface ApiToken {
  id: string;
  appId: number;
  appName: string;
  category: string;
  categoryName: string;
  email: string;
  hashedToken: string;
  allowedIps: string[];
  allowedEmails: string[];
  allowedDomains: string[];
  expiryTs: Date | null;
  revoked: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  scope: ScopeItem[];
}

export interface TokenGenerationRequest {
  appId: number;
  category: string;
  email: string;
  expiry: number | string | 'never';
  allowedIps: string[];
  allowedEmails: string[];
  allowedDomains: string[];
  scope: ScopeItem[];
}

export interface Customer {
    code: string;
    name: string;
    endpoints: string[];
}

import type { Customer } from './types';

export const APPLICATIONS = [
  { id: 1, name: 'NutraACS' },
  { id: 2, name: 'NuCEM' },
  { id: 3, name: 'NuHive' },
];

export const CATEGORIES = [
  { id: 'airline', name: 'Airline' },
  { id: 'consultant', name: 'Consultant' },
  { id: 'other', name: 'Other' },
];

export const EXPIRY_OPTIONS = [
    { value: 30, label: '30 Days' },
    { value: 60, label: '60 Days' },
    { value: 90, label: '90 Days' },
    { value: 'custom', label: 'Custom' },
    { value: 'never', label: 'Never' },
];

export const MOCK_CUSTOMERS: Customer[] = [
    { 
        code: 'CUST001', 
        name: 'ABA Air', 
        endpoints: ['/save_vouchers', '/save_dn_cn', '/save_payment', '/get_balance'] 
    },
    { 
        code: 'CUST002', 
        name: 'AL-MATAR Flights', 
        endpoints: ['/save_vouchers', '/save_dn_cn'] 
    },
    { 
        code: 'CUST003', 
        name: 'Sky Consultants Inc.', 
        endpoints: ['/get_reports', '/get_balance'] 
    },
     { 
        code: 'CUST004', 
        name: 'Global Travel Co', 
        endpoints: ['/save_vouchers', '/save_payment', '/issue_refund'] 
    },
];

// A common list of all available endpoints, derived from all customers.
export const COMMON_ENDPOINTS = Array.from(
    new Set(MOCK_CUSTOMERS.flatMap(c => c.endpoints))
).sort();

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { TokenGenerationRequest, ScopeItem } from '../types';
import { APPLICATIONS, CATEGORIES, EXPIRY_OPTIONS, MOCK_CUSTOMERS, COMMON_ENDPOINTS } from '../constants';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface TokenGeneratorFormProps {
  onGenerate: (request: TokenGenerationRequest) => void;
  onCancel: () => void;
}

enum Tab {
    Security = 'security',
    Scope = 'scope',
}

const parseStringList = (value: string): string[] => {
    if (!value.trim()) return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
};

export const TokenGeneratorForm: React.FC<TokenGeneratorFormProps> = ({ onGenerate, onCancel }) => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Security);
    
    // Form state
    const [appId, setAppId] = useState<number>(APPLICATIONS[0].id);
    const [category, setCategory] = useState<string>(CATEGORIES[0].id);
    const [email, setEmail] = useState<string>('');
    const [expiry, setExpiry] = useState<number | string>(30);
    const [customExpiry, setCustomExpiry] = useState<string>('');
    
    const [allowedIps, setAllowedIps] = useState<string>('');
    const [allowedEmails, setAllowedEmails] = useState<string>('');
    const [allowedDomains, setAllowedDomains] = useState<string>('');
    
    const [selectedCustomerCodes, setSelectedCustomerCodes] = useState<string[]>([]);
    const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([]);
    
    const customerSelectAllRef = useRef<HTMLInputElement>(null);
    const endpointSelectAllRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (customerSelectAllRef.current) {
            const allSelected = selectedCustomerCodes.length === MOCK_CUSTOMERS.length;
            const someSelected = selectedCustomerCodes.length > 0 && !allSelected;
            customerSelectAllRef.current.indeterminate = someSelected;
            customerSelectAllRef.current.checked = allSelected;
        }
    }, [selectedCustomerCodes]);

    useEffect(() => {
        if (endpointSelectAllRef.current) {
            const allSelected = selectedEndpoints.length === COMMON_ENDPOINTS.length;
            const someSelected = selectedEndpoints.length > 0 && !allSelected;
            endpointSelectAllRef.current.indeterminate = someSelected;
            endpointSelectAllRef.current.checked = allSelected;
        }
    }, [selectedEndpoints]);


    const isFormValid = useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;
        if (expiry === 'custom' && !customExpiry) return false;
        if (selectedCustomerCodes.length === 0 || selectedEndpoints.length === 0) return false;
        return true;
    }, [email, expiry, customExpiry, selectedCustomerCodes, selectedEndpoints]);

    const handleCustomerToggle = useCallback((customerCode: string, isChecked: boolean) => {
        setSelectedCustomerCodes(prev =>
            isChecked
                ? [...prev, customerCode]
                : prev.filter(code => code !== customerCode)
        );
    }, []);
    
    const handleSelectAllCustomers = useCallback(() => {
        if (selectedCustomerCodes.length < MOCK_CUSTOMERS.length) {
            setSelectedCustomerCodes(MOCK_CUSTOMERS.map(c => c.code));
        } else {
            setSelectedCustomerCodes([]);
        }
    }, [selectedCustomerCodes]);

    const handleEndpointToggle = useCallback((endpoint: string, isChecked: boolean) => {
        setSelectedEndpoints(prev => 
            isChecked
                ? [...prev, endpoint]
                : prev.filter(e => e !== endpoint)
        );
    }, []);

    const handleSelectAllEndpoints = useCallback(() => {
        if (selectedEndpoints.length < COMMON_ENDPOINTS.length) {
            setSelectedEndpoints([...COMMON_ENDPOINTS]);
        } else {
            setSelectedEndpoints([]);
        }
    }, [selectedEndpoints]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const scope: ScopeItem[] = selectedCustomerCodes.map((customerCode) => {
            const customer = MOCK_CUSTOMERS.find(c => c.code === customerCode)!;
            return {
                customerCode,
                customerName: customer.name,
                allowedEndpoints: selectedEndpoints,
            };
        });
        
        const request: TokenGenerationRequest = {
            appId,
            category,
            email,
            expiry: expiry === 'custom' ? customExpiry : (expiry === 'never' ? 'never' : Number(expiry)),
            allowedIps: parseStringList(allowedIps),
            allowedEmails: parseStringList(allowedEmails),
            allowedDomains: parseStringList(allowedDomains),
            scope,
        };
        onGenerate(request);
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg animate-fadeIn">
            <div className="p-4 sm:p-6 border-b border-gray-700 flex items-center gap-4">
                <button onClick={onCancel} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Back to token list">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-white">Create New API Token</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-8">
                     <section>
                        <h3 className="text-lg font-medium text-white">Details</h3>
                        <p className="mt-1 text-sm text-gray-400">Basic information for the new token.</p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="appId" className="block text-sm font-medium text-gray-300">Application</label>
                                <select id="appId" value={appId} onChange={e => setAppId(Number(e.target.value))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2">
                                    {APPLICATIONS.map(app => <option key={app.id} value={app.id}>{app.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2">
                                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Customer Email (Mandatory)</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2" placeholder="user@example.com"/>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="expiry" className="block text-sm font-medium text-gray-300">Expiry</label>
                                <select id="expiry" value={expiry} onChange={e => setExpiry(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2">
                                    {EXPIRY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                {expiry === 'custom' && (
                                    <input type="date" value={customExpiry} onChange={e => setCustomExpiry(e.target.value)} required className="mt-2 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2" />
                                )}
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h3 className="text-lg font-medium text-white">Configuration</h3>
                        <p className="mt-1 text-sm text-gray-400">Set security restrictions and API access scope.</p>
                        <div className="mt-4">
                            <div className="border-b border-gray-700">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    <button type="button" onClick={() => setActiveTab(Tab.Security)} className={`${activeTab === Tab.Security ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                        Security
                                    </button>
                                    <button type="button" onClick={() => setActiveTab(Tab.Scope)} className={`${activeTab === Tab.Scope ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                        Scope
                                    </button>
                                </nav>
                            </div>
                            <div className="mt-6">
                                {activeTab === Tab.Security && (
                                    <div className="space-y-4 animate-fadeIn">
                                        <p className="text-sm text-gray-400">Define access restrictions. Use comma-separated values for multiple entries.</p>
                                        <div>
                                            <label htmlFor="allowedIps" className="block text-sm font-medium text-gray-300">Allowed IPs / CIDR</label>
                                            <input type="text" id="allowedIps" value={allowedIps} onChange={e => setAllowedIps(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2" placeholder="192.168.1.1, 10.0.0.0/24"/>
                                        </div>
                                        <div>
                                            <label htmlFor="allowedEmails" className="block text-sm font-medium text-gray-300">Allowed Emails</label>
                                            <input type="text" id="allowedEmails" value={allowedEmails} onChange={e => setAllowedEmails(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2" placeholder="ops@airline.com, support@airline.com"/>
                                        </div>
                                        <div>
                                            <label htmlFor="allowedDomains" className="block text-sm font-medium text-gray-300">Allowed Domains</label>
                                            <input type="text" id="allowedDomains" value={allowedDomains} onChange={e => setAllowedDomains(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2" placeholder="example.com, api.example.com"/>
                                        </div>
                                    </div>
                                )}
                                
                                {activeTab === Tab.Scope && (
                                    <div className="animate-fadeIn">
                                        <p className="text-sm text-gray-400">Select customers and the common API endpoints this token can access for them.</p>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold text-white mb-2">Customers</h4>
                                                <div className="bg-gray-700/50 rounded-md max-h-80 overflow-y-auto">
                                                    <label className="flex items-center text-sm text-gray-300 p-3 border-b border-gray-600 sticky top-0 bg-gray-700/80 backdrop-blur-sm">
                                                        <input 
                                                            type="checkbox" 
                                                            ref={customerSelectAllRef}
                                                            className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-indigo-600 focus:ring-indigo-500" 
                                                            onChange={handleSelectAllCustomers}
                                                        />
                                                        <span className="ml-3 font-semibold">Select All Customers</span>
                                                    </label>
                                                    <div className="p-2 pr-1 space-y-1">
                                                        {MOCK_CUSTOMERS.map(customer => (
                                                            <label key={customer.code} className="flex items-center text-sm text-gray-300 p-2 rounded-md hover:bg-gray-600/50 transition-colors">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-indigo-600 focus:ring-indigo-500" 
                                                                    checked={selectedCustomerCodes.includes(customer.code)}
                                                                    onChange={(e) => handleCustomerToggle(customer.code, e.target.checked)}
                                                                />
                                                                <span className="ml-3">{customer.name} <span className="text-xs text-gray-400">({customer.code})</span></span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                 <h4 className="font-semibold text-white mb-2">Allowed Endpoints</h4>
                                                 <div className="bg-gray-700/50 rounded-md max-h-80 overflow-y-auto">
                                                    <label className="flex items-center text-sm text-gray-300 p-3 border-b border-gray-600 sticky top-0 bg-gray-700/80 backdrop-blur-sm">
                                                        <input 
                                                            type="checkbox" 
                                                            ref={endpointSelectAllRef}
                                                            className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-indigo-600 focus:ring-indigo-500" 
                                                            onChange={handleSelectAllEndpoints}
                                                        />
                                                        <span className="ml-3 font-semibold">Select All Endpoints</span>
                                                    </label>
                                                     <div className="p-2 pr-1 space-y-1">
                                                        {COMMON_ENDPOINTS.map(endpoint => (
                                                            <label key={endpoint} className="flex items-center text-sm text-gray-300 p-2 rounded-md hover:bg-gray-600/50 transition-colors">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-indigo-600 focus:ring-indigo-500" 
                                                                    checked={selectedEndpoints.includes(endpoint)}
                                                                    onChange={(e) => handleEndpointToggle(endpoint, e.target.checked)}
                                                                />
                                                                <span className="ml-3 font-mono text-sm">{endpoint}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
                <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end gap-4">
                     <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={!isFormValid} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                        Generate Token
                    </button>
                </div>
            </form>
        </div>
    );
};
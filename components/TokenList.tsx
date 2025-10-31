import React from 'react';
import type { ApiToken } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface TokenListProps {
  tokens: ApiToken[];
  onRevoke: (tokenId: string) => void;
  onGoToCreate: () => void;
}

const TokenListItem: React.FC<{ token: ApiToken; onRevoke: (id: string) => void }> = ({ token, onRevoke }) => {
    const isExpired = token.expiryTs && new Date(token.expiryTs) < new Date();
    const status = token.revoked ? 'Revoked' : isExpired ? 'Expired' : 'Active';
    
    const statusClasses: { [key: string]: string } = {
        Active: 'bg-green-500/10 text-green-400',
        Revoked: 'bg-red-500/10 text-red-400',
        Expired: 'bg-yellow-500/10 text-yellow-400',
    };

    const rowClasses = token.revoked || isExpired ? 'bg-gray-800/50 text-gray-500' : 'hover:bg-gray-700/50';

    return (
        <tr className={`border-b border-gray-700 transition-colors ${rowClasses}`}>
            <td className="p-4 text-sm font-mono whitespace-nowrap">{token.hashedToken.substring(0, 8)}...{token.hashedToken.slice(-8)}</td>
            <td className="p-4 text-sm whitespace-nowrap">{token.email}</td>
            <td className="p-4 text-sm whitespace-nowrap">{token.appName}</td>
            <td className="p-4 text-sm whitespace-nowrap">
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
                    {status}
                </span>
            </td>
            <td className="p-4 text-sm whitespace-nowrap">{token.expiryTs ? new Date(token.expiryTs).toLocaleDateString() : 'Never'}</td>
            <td className="p-4 text-sm whitespace-nowrap">{new Date(token.createdAt).toLocaleDateString()}</td>
            <td className="p-4 text-sm whitespace-nowrap">
                {!token.revoked && !isExpired && (
                    <button 
                        onClick={() => onRevoke(token.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-colors"
                        title="Revoke Token"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}
            </td>
        </tr>
    );
};


export const TokenList: React.FC<TokenListProps> = ({ tokens, onRevoke, onGoToCreate }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-white">API Tokens</h2>
            <div className="mt-4 sm:mt-0 relative">
              <input 
                type="text" 
                placeholder="Search tokens..."
                className="w-full sm:w-64 bg-gray-700 border-gray-600 rounded-md py-2 pl-10 pr-4 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
        </div>
      </div>
      
      {tokens.length === 0 ? (
        <div className="text-center py-16 px-6">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-white">No Tokens Found</h3>
          <p className="mt-2 text-sm text-gray-400">Get started by generating your first API token.</p>
          <div className="mt-6">
            <button
              onClick={onGoToCreate}
              className="flex items-center mx-auto gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Token</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left">
                <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                    <tr>
                        <th className="p-4 font-semibold">Token Preview</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Application</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Expires</th>
                        <th className="p-4 font-semibold">Created</th>
                        <th className="p-4 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {tokens.map(token => (
                        <TokenListItem key={token.id} token={token} onRevoke={onRevoke} />
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};
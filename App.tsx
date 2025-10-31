import React, { useState, useCallback } from 'react';
import { TokenGeneratorForm } from './components/TokenGeneratorForm';
import { TokenList } from './components/TokenList';
import { GeneratedTokenModal } from './components/GeneratedTokenModal';
import type { ApiToken, TokenGenerationRequest } from './types';
import { APPLICATIONS, CATEGORIES } from './constants';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateToken = useCallback((request: TokenGenerationRequest) => {
    // In a real app, this would be a backend call.
    // Here we simulate the token generation process.
    const rawToken = `nut_live_${btoa(Math.random().toString()).substring(10, 40)}`;
    const hashedToken = `hashed_${rawToken.substring(0, 15)}...`; // Simulate hashing

    let expiryDate: Date | null = null;
    if (request.expiry !== 'never') {
      if (typeof request.expiry === 'number') {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + request.expiry);
      } else {
        expiryDate = new Date(request.expiry);
      }
    }

    const newToken: ApiToken = {
      id: crypto.randomUUID(),
      appId: request.appId,
      appName: APPLICATIONS.find(app => app.id === request.appId)?.name || 'Unknown App',
      category: request.category,
      categoryName: CATEGORIES.find(cat => cat.id === request.category)?.name || 'Unknown Category',
      email: request.email,
      hashedToken: hashedToken,
      allowedIps: request.allowedIps,
      allowedEmails: request.allowedEmails,
      allowedDomains: request.allowedDomains,
      expiryTs: expiryDate,
      revoked: false,
      createdBy: 'admin@nutraacs.com', // Mocked user
      createdAt: new Date(),
      updatedAt: new Date(),
      scope: request.scope,
    };

    setTokens(prevTokens => [newToken, ...prevTokens]);
    setGeneratedToken(rawToken);
    setIsModalOpen(true);
    setView('list'); // Switch back to the list view after generation
  }, []);

  const handleRevokeToken = useCallback((tokenId: string) => {
    setTokens(prevTokens =>
      prevTokens.map(token =>
        token.id === tokenId ? { ...token, revoked: true, updatedAt: new Date() } : token
      )
    );
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setGeneratedToken(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Token Management</h1>
            <p className="text-gray-400 mt-1">Create, manage, and revoke API tokens for third-party applications.</p>
          </div>
          {view === 'list' && (
            <button
              onClick={() => setView('form')}
              className="mt-4 md:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Token</span>
            </button>
          )}
        </header>
        
        {view === 'list' ? (
          <TokenList tokens={tokens} onRevoke={handleRevokeToken} onGoToCreate={() => setView('form')} />
        ) : (
          <TokenGeneratorForm onGenerate={handleGenerateToken} onCancel={() => setView('list')} />
        )}
      </main>

      {isModalOpen && generatedToken && (
        <GeneratedTokenModal token={generatedToken} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;

import React, { useState, useCallback } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface GeneratedTokenModalProps {
  token: string;
  onClose: () => void;
}

export const GeneratedTokenModal: React.FC<GeneratedTokenModalProps> = ({ token, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(token).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [token]);

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg w-full transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white">Token Generated Successfully</h2>
        
        <div className="my-4 p-4 bg-yellow-900/50 border border-yellow-700 rounded-md">
            <p className="text-yellow-300 font-semibold">Important: This token will only be shown once.</p>
            <p className="text-yellow-400 text-sm">Please copy it and store it in a secure location. If you lose it, you will need to revoke it and generate a new one.</p>
        </div>

        <div className="relative bg-gray-900 p-4 rounded-md font-mono text-green-400 break-all">
            <span>{token}</span>
            <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
                {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5 text-gray-300" />}
            </button>
        </div>

        <div className="mt-6 flex justify-end">
            <button 
                onClick={onClose}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

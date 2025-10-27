'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { useCountdown } from '@/hooks/useCountdown';

interface PasteData {
  content: string;
  createdAt: string;
}

export default function PastePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Use countdown hook when paste is loaded
  const countdown = useCountdown(paste?.createdAt || new Date().toISOString());

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await fetch(`/api/paste/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPaste(data);
        } else if (response.status === 404) {
          setError('Paste not found');
        } else {
          setError('Failed to load paste');
        }
      } catch (err) {
        setError('An error occurred while loading the paste');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPaste();
    }
  }, [slug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading paste...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || (paste && countdown.isExpired)) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {countdown.isExpired ? 'Paste Expired' : 'Paste Not Found'}
            </h1>
            <p className="text-gray-600 mb-6">
              {countdown.isExpired 
                ? 'This paste has expired and is no longer available.' 
                : error
              }
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create New Paste
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Create New Paste
          </Link>
          <div className="flex flex-col items-end gap-1">
            <div className="text-sm text-gray-500">
              Created: {new Date(paste!.createdAt).toLocaleDateString()}
            </div>
            <div className={`text-sm font-medium ${
              countdown.timeRemaining < 300000 // Less than 5 minutes
                ? 'text-red-600' 
                : countdown.timeRemaining < 600000 // Less than 10 minutes
                ? 'text-orange-600'
                : 'text-green-600'
            }`}>
              {countdown.isExpired 
                ? 'Expired' 
                : `Expires in: ${countdown.formattedTime}`
              }
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Content</h2>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border text-sm font-mono overflow-x-auto">
              {paste!.content}
            </pre>
          </div>
        </div>

        {/* Sharing Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* URL Sharing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Share URL</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code</h3>
            <div className="flex justify-center">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <QRCode
                  size={150}
                  value={currentUrl}
                  viewBox="0 0 256 256"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              Scan to open this paste
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
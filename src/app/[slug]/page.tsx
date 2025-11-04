'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import Image from 'next/image';
import { useCountdown } from '@/hooks/useCountdown';
import SimplyPasteLogo from '../../assets/icons/simply-paste.svg';
import LinkIcon from '../../assets/icons/link.svg';
import ShareIcon from '../../assets/icons/share.svg';

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
    <main className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex flex-row mb-8">
          <Image
            src={SimplyPasteLogo}
            alt="Simply Paste Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <div className='flex flex-col'>
            <h1 className="text-[20px] font-bold text-gray-900">Simply Paste</h1>
            <p className="text-gray-600">Share text snippets quickly</p>
          </div>
        </div>

        <div className='flex flex-col-reverse md:flex-row w-full gap-4 md:gap-8'>
          <div className="flex flex-col gap-2 flex-1">
            {/* Content */}
            <div className="flex items-center justify-between mb-2 ml-auto">
              <Link
                href="/"
                className="text-sm w-[200px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-md transition-colors h-fit"
              >
                + Create a new paste
              </Link>
            </div>

            <pre className="whitespace-pre-wrap bg-white p-4 rounded-lg border text-sm font-mono overflow-x-auto shadow-sm border-gray-300">
              {paste!.content}
            </pre>
          </div>

          {/* Features */}
          <div className="shrink-0 flex flex-col items-center gap-4 text-center w-[200px]">
            <div className="flex flex-col items-center gap-1">
              <div className="text-sm text-gray-500">
                Created: {new Date(paste!.createdAt).toLocaleDateString()}
              </div>
              <div className={`text-sm font-medium ${countdown.timeRemaining < 300000 // Less than 5 minutes
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
            <div className="p-2">
              <Image
                src={LinkIcon}
                alt="Icon representing Share URL"
                width={20}
                height={20}
                className="mx-auto mb-2"
              />
              <h3 className="font-medium text-gray-900 mb-1">Share URL</h3>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={currentUrl}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors text-xs ${copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="p-2">
              <Image
                src={ShareIcon}
                alt="Icon representing QR Code"
                width={20}
                height={20}
                className="mx-auto mb-2"
              />
              <h3 className="font-medium text-gray-900 mb-1">QR Code</h3>
              <div className="flex justify-center">
                <div className="p-2 bg-white border border-gray-200 rounded-lg">
                  <QRCode
                    size={120}
                    value={currentUrl}
                    viewBox="0 0 256 256"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Scan to open this paste
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
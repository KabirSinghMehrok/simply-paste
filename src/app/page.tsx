'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SimplyPasteLogo from '../assets/icons/simply-paste.svg';
import LinkIcon from '../assets/icons/link.svg';
import ShareIcon from '../assets/icons/share.svg';
import LockIcon from '../assets/icons/lock-alt.svg';

import Image from 'next/image';

const MAX_CHARACTERS = 50000;

export default function Home() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const { slug } = await response.json();
        router.push(`/${slug}`);
      } else {
        alert('Failed to create paste. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOverLimit = content.length > MAX_CHARACTERS;
  const charactersLeft = MAX_CHARACTERS - content.length;

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
            <div className='flex flex-row items-center gap-4 ml-auto'>
              {/* Character Counter */}
              <div className="flex justify-between items-center">
                <div className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                  {content.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters
                  {charactersLeft < 0 && (
                    <span className="ml-2 font-medium">
                      ({Math.abs(charactersLeft).toLocaleString()} over limit)
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isOverLimit || isLoading}
                className="text-sm w-[200px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-md transition-colors h-fit"
              >
                {isLoading ? 'Creating...' : 'Save & Share'}
              </button>
            </div>
            {/* Main Form */}
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text here..."
              className={`w-full min-h-96 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm ${isOverLimit ? 'border-red-500' : 'border-gray-300'
                }`}
            />
          </div>

          {/* Features */}
          <div className="shrink-0 flex flex-col items-center gap-4 text-center w-[200px]">
            <div className="p-2">
              <Image
                src={LinkIcon}
                alt="Icon representing Readable URLS"
                width={20}
                height={20}
                className="mx-auto mb-2"
              />
              <h3 className="font-medium text-gray-900 mb-1">Readable URLs</h3>
              <p className="text-sm text-gray-600">Get memorable links like /wise-fox-82</p>
            </div>
            <div className="p-2">
              <Image
                src={ShareIcon}
                alt="Icon representing QR Codes"
                width={20}
                height={20}
                className="mx-auto mb-2"
              />
              <h3 className="font-medium text-gray-900 mb-1">QR Codes</h3>
              <p className="text-sm text-gray-600">Share easily with generated QR codes</p>
            </div>
            <div className="p-2">
              <Image
                src={LockIcon}
                alt="Icon representing Anonymous Sharing"
                width={20}
                height={20}
                className="mx-auto mb-2"
              />
              <h3 className="font-medium text-gray-900 mb-1">Anonymous</h3>
              <p className="text-sm text-gray-600">No registration required</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

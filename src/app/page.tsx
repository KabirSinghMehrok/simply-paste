'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">QuickShare</h1>
          <p className="text-gray-600">Share text snippets quickly and anonymously</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Paste your content here
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text here..."
              className={`w-full h-96 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isOverLimit ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Character Counter */}
          <div className="flex justify-between items-center mb-4">
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? 'Creating...' : 'Save & Share'}
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-medium text-gray-900 mb-1">Readable URLs</h3>
            <p className="text-sm text-gray-600">Get memorable links like /wise-fox-82</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-medium text-gray-900 mb-1">QR Codes</h3>
            <p className="text-sm text-gray-600">Share easily with generated QR codes</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-medium text-gray-900 mb-1">Anonymous</h3>
            <p className="text-sm text-gray-600">No registration required</p>
          </div>
        </div>
      </div>
    </main>
  );
}

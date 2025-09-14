'use client';

import { useState } from 'react';
import { batchUploadMultilingualQuestions } from '@/lib/firestore';
import { hundredQuestions } from '@/lib/hundred-questions';

// Using comprehensive question database - note: this is a working demo with 5 questions
// For the full 100-question upload, use the admin interface with scripts/100-questions-database.js
const sampleQuestions = hundredQuestions;

export default function DebugUploadPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setLoading(true);
    try {
      console.log('🚀 Starting question upload...');
      const result = await batchUploadMultilingualQuestions(sampleQuestions as any);
      setMessage(`✅ Success: ${result.message}`);
      console.log('✅ Upload completed successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Error: ${errorMsg}`);
      console.error('❌ Upload failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6">🔧 Debug: Upload Questions</h1>
        <p className="text-white/90 mb-8">
          This page will upload 5 sample multilingual questions to the General Knowledge database.
          <br />
          Demo version - For the complete 100-question upload, use the admin interface.
        </p>
        
        {message && (
          <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
            <p className="text-white">{message}</p>
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-8 py-4 bg-green-500/80 hover:bg-green-600 disabled:bg-green-500/40 text-white rounded-lg transition-all duration-200 text-lg font-semibold"
        >
          {loading ? '⏳ Uploading Questions...' : '📤 Upload 5 Sample Questions'}
        </button>
        
        <div className="mt-8 text-sm text-white/70">
          <p>Questions to upload (Demo Version):</p>
          <ul className="mt-2 text-left max-w-md mx-auto">
            <li>• 5 Science questions with multilingual support</li>
            <li>• English and Korean translations</li>
            <li>• Complete 100-question dataset available in scripts/</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
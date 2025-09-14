'use client';

import { useState } from 'react';
import { batchUploadMultilingualQuestions } from '@/lib/firestore';

// We'll provide a simple message explaining how to upload the full dataset
const sampleQuestions = [];

export default function DebugUploadPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setLoading(true);
    setMessage('🚀 Loading 100-question dataset...');
    
    try {
      // Import the complete 100 questions dynamically
      const response = await fetch('/scripts/100-questions-database.js');
      const scriptText = await response.text();
      
      // Extract the questions array from the script (simple regex approach)
      const match = scriptText.match(/export const hundredQuestions = (\[[\s\S]*?\]);/);
      
      if (!match) {
        throw new Error('Could not extract questions from script file');
      }
      
      // Parse the questions (this is a simple approach - in production you'd want more robust parsing)
      const questionsStr = match[1];
      const questions = eval(`(${questionsStr})`);
      
      console.log(`📊 Loaded ${questions.length} questions from script file`);
      setMessage(`📊 Loaded ${questions.length} questions, uploading to database...`);
      
      // Upload to database
      const result = await batchUploadMultilingualQuestions(questions as any);
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
        <h1 className="text-3xl font-bold text-white mb-6">📤 Upload 100 General Knowledge Questions</h1>
        <p className="text-white/90 mb-8">
          To upload the complete 100-question database, use the console method below.
          <br />
          The questions are ready in <code>scripts/100-questions-database.js</code>
        </p>
        
        {message && (
          <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
            <p className="text-white">{message}</p>
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-8 py-4 bg-green-500/80 hover:bg-green-600 disabled:bg-green-500/40 text-white rounded-lg transition-all duration-200 text-lg font-semibold mb-6"
        >
          {loading ? '⏳ Uploading 100 Questions...' : '📤 Upload 100 Questions Database'}
        </button>
        
        <div className="bg-blue-900/30 p-4 rounded-lg mb-6">
          <p className="text-blue-200 text-sm">
            💡 This will fetch the complete 100-question dataset from scripts/100-questions-database.js and upload it to your Firebase database.
          </p>
        </div>
        
        <div className="mt-8 text-sm text-white/70">
          <p>Complete 100-Question Database Available:</p>
          <div className="mt-4 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div>
              <p className="font-semibold text-white/90 mb-2">Categories:</p>
              <ul className="text-left">
                <li>• Science: 25 questions</li>
                <li>• History: 25 questions</li>
                <li>• Geography: 25 questions</li>
                <li>• Arts & Literature: 15 questions</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white/90 mb-2">Additional:</p>
              <ul className="text-left">
                <li>• Sports: 5 questions</li>
                <li>• Technology: 3 questions</li>
                <li>• Mathematics: 2 questions</li>
                <li>• All multilingual (EN/KO)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
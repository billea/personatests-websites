"use client";

import { getTestById, testDefinitions } from "@/lib/test-definitions";

export default function DebugTestsPage() {
  const newTestIds = [
    'general-knowledge',
    'math-speed', 
    'memory-power',
    'country-match',
    'mental-age',
    'spirit-animal'
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Debug Information</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">All Test Definitions ({testDefinitions.length})</h2>
          <div className="space-y-2">
            {testDefinitions.map(test => (
              <div key={test.id} className="p-3 bg-white rounded shadow">
                <strong>{test.id}</strong> - {test.category} - {test.title_key}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">New Test Lookup Results</h2>
          <div className="space-y-2">
            {newTestIds.map(testId => {
              const test = getTestById(testId);
              return (
                <div key={testId} className={`p-3 rounded shadow ${test ? 'bg-green-100' : 'bg-red-100'}`}>
                  <strong>{testId}</strong>: {test ? `✅ Found - ${test.title_key}` : '❌ Not Found'}
                  {test && (
                    <div className="text-sm text-gray-600 mt-1">
                      Category: {test.category} | Questions: {test.questions.length}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
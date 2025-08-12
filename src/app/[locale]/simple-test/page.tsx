"use client";

import { useEffect, useState } from 'react';

export default function SimpleTestPage() {
  const [koreanData, setKoreanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Direct fetch of Korean translations
    fetch('/translations/ko.json')
      .then(response => response.json())
      .then(data => {
        console.log('Korean translations loaded:', data);
        setKoreanData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading Korean translations:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8">Loading Korean translations...</div>;
  }

  if (!koreanData) {
    return <div className="p-8">Failed to load Korean translations</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {koreanData.tests?.page_title || 'Korean Translation Test'}
      </h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {koreanData.tests?.categories?.know_yourself || 'Know Yourself'}
          </h2>
          <p className="text-gray-600">
            {koreanData.tests?.categories?.know_yourself_desc || 'Description'}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            {koreanData.tests?.categories?.how_others_see_me || 'How Others See Me'}
          </h2>
          <p className="text-gray-600">
            {koreanData.tests?.categories?.how_others_see_me_desc || 'Description'}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            {koreanData.tests?.categories?.couple_compatibility || 'Couple Compatibility'}
          </h2>
          <p className="text-gray-600">
            {koreanData.tests?.categories?.couple_compatibility_desc || 'Description'}
          </p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">MBTI Test</h3>
          <h4 className="text-lg">{koreanData.tests?.mbti?.title}</h4>
          <p className="text-sm text-gray-600">{koreanData.tests?.mbti?.description}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">360° Feedback Test</h3>
          <h4 className="text-lg">{koreanData.tests?.['360feedback']?.title}</h4>
          <p className="text-sm text-gray-600">{koreanData.tests?.['360feedback']?.description}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Relationship Test</h3>
          <h4 className="text-lg">{koreanData.tests?.relationship?.title}</h4>
          <p className="text-sm text-gray-600">{koreanData.tests?.relationship?.description}</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-100 rounded">
        <h3 className="font-bold text-green-800">✅ Translation System Working!</h3>
        <p className="text-green-700">
          Korean translations are loading properly. You can see the Korean text above.
        </p>
      </div>
    </div>
  );
}
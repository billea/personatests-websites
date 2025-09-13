'use client';

import { useState } from 'react';
import { batchUploadMultilingualQuestions } from '@/lib/firestore';

// The same 15 sample questions from admin interface
const sampleQuestions = [
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the chemical symbol for gold?',
        options: { a: 'Au', b: 'Ag', c: 'Pt', d: 'Cu' },
        explanation: 'Au comes from the Latin word "aurum" meaning gold.',
        tags: ['chemistry', 'elements']
      },
      ko: {
        question: '금의 화학 기호는 무엇입니까?',
        options: { a: 'Au', b: 'Ag', c: 'Pt', d: 'Cu' },
        explanation: 'Au는 금을 의미하는 라틴어 "aurum"에서 유래되었습니다.',
        tags: ['화학', '원소']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'How many bones are in an adult human body?',
        options: { a: '206', b: '196', c: '216', d: '186' },
        explanation: 'An adult human skeleton has 206 bones.',
        tags: ['biology', 'anatomy']
      },
      ko: {
        question: '성인 인간의 몸에는 몇 개의 뼈가 있습니까?',
        options: { a: '206개', b: '196개', c: '216개', d: '186개' },
        explanation: '성인 인간의 골격에는 206개의 뼈가 있습니다.',
        tags: ['생물학', '해부학']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the fastest land animal?',
        options: { a: 'Cheetah', b: 'Lion', c: 'Leopard', d: 'Tiger' },
        explanation: 'Cheetahs can reach speeds up to 70 mph.',
        tags: ['biology', 'animals']
      },
      ko: {
        question: '가장 빠른 육상 동물은 무엇입니까?',
        options: { a: '치타', b: '사자', c: '표범', d: '호랑이' },
        explanation: '치타는 시속 112km까지 달릴 수 있습니다.',
        tags: ['생물학', '동물']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who was the first person to walk on the moon?',
        options: { a: 'Neil Armstrong', b: 'Buzz Aldrin', c: 'John Glenn', d: 'Yuri Gagarin' },
        explanation: 'Neil Armstrong was the first person to set foot on the Moon on July 20, 1969.',
        tags: ['space exploration', 'apollo']
      },
      ko: {
        question: '달에 처음 발을 딛은 사람은 누구입니까?',
        options: { a: '닐 암스트롱', b: '버즈 올드린', c: '존 글렌', d: '유리 가가린' },
        explanation: '닐 암스트롱은 1969년 7월 20일 달에 첫 발을 딛은 사람입니다.',
        tags: ['우주 탐사', '아폴로']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which continent is the largest by area?',
        options: { a: 'Asia', b: 'Africa', c: 'North America', d: 'South America' },
        explanation: 'Asia covers about 30% of Earth\'s total land area.',
        tags: ['continents', 'world geography']
      },
      ko: {
        question: '면적상 가장 큰 대륙은 어디입니까?',
        options: { a: '아시아', b: '아프리카', c: '북아메리카', d: '남아메리카' },
        explanation: '아시아는 지구 전체 육지 면적의 약 30%를 차지합니다.',
        tags: ['대륙', '세계 지리']
      }
    },
    isActive: true
  }
];

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
          This page will upload 5 sample questions to the General Knowledge database.
          <br />
          Use this to fix the empty database issue.
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
          <p>Questions to upload:</p>
          <ul className="mt-2 text-left max-w-md mx-auto">
            <li>• Gold chemical symbol (Science)</li>
            <li>• Human bones count (Science)</li>
            <li>• Fastest land animal (Science)</li>
            <li>• First moon walker (History)</li>
            <li>• Largest continent (Geography)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
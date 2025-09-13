'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  addGeneralKnowledgeQuestion, 
  getGeneralKnowledgeStats, 
  batchUploadMultilingualQuestions,
  getQuestionsNeedingTranslation,
  addQuestionTranslation,
  GeneralKnowledgeQuestion 
} from '@/lib/firestore';

// Sample multilingual question data for populating the database
const sampleQuestions: Omit<GeneralKnowledgeQuestion, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: '金の化学記号は何ですか？',
        options: { a: 'Au', b: 'Ag', c: 'Pt', d: 'Cu' },
        explanation: 'Auは金を意味するラテン語「aurum」に由来しています。',
        tags: ['化学', '元素']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: '月に初めて足を踏み入れた人は誰ですか？',
        options: { a: 'ニール・アームストロング', b: 'バズ・オルドリン', c: 'ジョン・グレン', d: 'ユーリイ・ガガーリン' },
        explanation: 'ニール・アームストロングは1969年7月20日に月に足を踏み入れた最初の人物です。',
        tags: ['宇宙探査', 'アポロ']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: '面積で最も大きな大陸はどこですか？',
        options: { a: 'アジア', b: 'アフリカ', c: '北アメリカ', d: '南アメリカ' },
        explanation: 'アジアは地球の陸地面積の約30%を占めています。',
        tags: ['大陸', '世界地理']
      }
    },
    isActive: true
  }
];

export default function QuestionsAdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    category: 'science',
    difficulty: 'easy' as const,
    question: '',
    options: { a: '', b: '', c: '', d: '' },
    correctAnswer: 'a' as const,
    explanation: '',
    tags: '',
    isActive: true
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await getGeneralKnowledgeStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const questionData = {
        category: newQuestion.category,
        difficulty: newQuestion.difficulty,
        correctAnswer: newQuestion.correctAnswer,
        defaultLanguage: 'en',
        availableLanguages: ['en'],
        translations: {
          en: {
            question: newQuestion.question,
            options: newQuestion.options,
            explanation: newQuestion.explanation,
            tags: newQuestion.tags.split(',').map(tag => tag.trim())
          }
        },
        isActive: newQuestion.isActive
      };
      
      const result = await addGeneralKnowledgeQuestion(questionData);
      
      if (result.success) {
        setMessage(`✅ Question added successfully! ID: ${result.id}`);
        setNewQuestion({
          category: 'science',
          difficulty: 'easy',
          question: '',
          options: { a: '', b: '', c: '', d: '' },
          correctAnswer: 'a',
          explanation: '',
          tags: '',
          isActive: true
        });
        loadStats();
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error adding question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleBatchUpload = async () => {
    setLoading(true);
    try {
      const result = await batchUploadMultilingualQuestions(sampleQuestions);
      setMessage(`📦 Batch upload: ${result.message}`);
      loadStats();
    } catch (error) {
      setMessage(`❌ Batch upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  // Simple admin check - you might want to implement proper admin roles
  if (!user || !user.email?.includes('admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
        <div className="text-center p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-white/90">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">General Knowledge Questions Admin</h1>
        
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white">Total Questions</h3>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white">Active Questions</h3>
              <p className="text-3xl font-bold text-green-300">{stats.active}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white">Categories</h3>
              <p className="text-3xl font-bold text-blue-300">{Object.keys(stats.byCategory).length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white">Ready for 500+</h3>
              <p className="text-3xl font-bold text-yellow-300">🎯</p>
            </div>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
            <p className="text-white">{message}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Batch Upload */}
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Setup</h2>
            <p className="text-white/90 mb-4">Upload 3 sample multilingual questions to get started:</p>
            <button
              onClick={handleBatchUpload}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-500/80 hover:bg-green-600 disabled:bg-green-500/40 text-white rounded-lg transition-all duration-200"
            >
              {loading ? 'Uploading...' : '📦 Upload Sample Questions'}
            </button>
            <div className="mt-4 text-xs text-white/70">
              Languages supported: English, Korean, Japanese
            </div>
          </div>

          {/* Add Individual Question */}
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Question</h2>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg"
                >
                  <option value="science">Science</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                  <option value="arts">Arts</option>
                  <option value="sports">Sports</option>
                </select>
                
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <input
                type="text"
                placeholder="Question text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
                required
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Option A"
                  value={newQuestion.options.a}
                  onChange={(e) => setNewQuestion({ ...newQuestion, options: { ...newQuestion.options, a: e.target.value } })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Option B"
                  value={newQuestion.options.b}
                  onChange={(e) => setNewQuestion({ ...newQuestion, options: { ...newQuestion.options, b: e.target.value } })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Option C"
                  value={newQuestion.options.c}
                  onChange={(e) => setNewQuestion({ ...newQuestion, options: { ...newQuestion.options, c: e.target.value } })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Option D"
                  value={newQuestion.options.d}
                  onChange={(e) => setNewQuestion({ ...newQuestion, options: { ...newQuestion.options, d: e.target.value } })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
                  required
                />
              </div>
              
              <select
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value as any })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg"
              >
                <option value="a">A is correct</option>
                <option value="b">B is correct</option>
                <option value="c">C is correct</option>
                <option value="d">D is correct</option>
              </select>
              
              <input
                type="text"
                placeholder="Explanation (optional)"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
              />
              
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={newQuestion.tags}
                onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
              />
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-500/80 hover:bg-blue-600 disabled:bg-blue-500/40 text-white rounded-lg transition-all duration-200"
              >
                {loading ? 'Adding...' : '➕ Add Question'}
              </button>
            </form>
          </div>
        </div>

        {/* Category Breakdown */}
        {stats && Object.keys(stats.byCategory).length > 0 && (
          <div className="mt-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Questions by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold capitalize">{category}</h3>
                  <p className="text-2xl font-bold text-white">{count as number}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
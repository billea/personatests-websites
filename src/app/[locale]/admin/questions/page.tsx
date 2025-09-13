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

// Sample multilingual question data for populating the database (15 questions)
const sampleQuestions: Omit<GeneralKnowledgeQuestion, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Science Questions
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
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the hardest natural substance?',
        options: { a: 'Iron', b: 'Diamond', c: 'Quartz', d: 'Granite' },
        explanation: 'Diamond is the hardest naturally occurring substance on Earth.',
        tags: ['chemistry', 'materials']
      },
      ko: {
        question: '가장 단단한 천연 물질은 무엇입니까?',
        options: { a: '철', b: '다이아몬드', c: '석영', d: '화강암' },
        explanation: '다이아몬드는 지구에서 자연적으로 발생하는 가장 단단한 물질입니다.',
        tags: ['화학', '재료']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What gas do plants absorb from the atmosphere?',
        options: { a: 'Oxygen', b: 'Nitrogen', c: 'Carbon dioxide', d: 'Hydrogen' },
        explanation: 'Plants absorb carbon dioxide during photosynthesis.',
        tags: ['biology', 'photosynthesis']
      },
      ko: {
        question: '식물이 대기에서 흡수하는 기체는 무엇입니까?',
        options: { a: '산소', b: '질소', c: '이산화탄소', d: '수소' },
        explanation: '식물은 광합성 과정에서 이산화탄소를 흡수합니다.',
        tags: ['생물학', '광합성']
      }
    },
    isActive: true
  },
  
  // History Questions
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
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'In what year did World War II end?',
        options: { a: '1945', b: '1944', c: '1946', d: '1943' },
        explanation: 'World War II ended in 1945 with Japan\'s surrender.',
        tags: ['world war', '20th century']
      },
      ko: {
        question: '제2차 세계대전이 끝난 해는 언제입니까?',
        options: { a: '1945년', b: '1944년', c: '1946년', d: '1943년' },
        explanation: '제2차 세계대전은 일본의 항복으로 1945년에 끝났습니다.',
        tags: ['세계대전', '20세기']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which ancient wonder was located in Egypt?',
        options: { a: 'Hanging Gardens', b: 'Great Pyramid', c: 'Colossus', d: 'Lighthouse' },
        explanation: 'The Great Pyramid of Giza is the only ancient wonder still standing today.',
        tags: ['ancient egypt', 'wonders']
      },
      ko: {
        question: '이집트에 위치했던 고대 세계 7대 불가사의는 무엇입니까?',
        options: { a: '공중정원', b: '대피라미드', c: '거상', d: '등대' },
        explanation: '기자의 대피라미드는 오늘날까지 남아있는 유일한 고대 불가사의입니다.',
        tags: ['고대 이집트', '불가사의']
      }
    },
    isActive: true
  },

  // Geography Questions
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
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the capital of Australia?',
        options: { a: 'Canberra', b: 'Sydney', c: 'Melbourne', d: 'Brisbane' },
        explanation: 'Canberra is the capital city of Australia.',
        tags: ['capitals', 'australia']
      },
      ko: {
        question: '호주의 수도는 어디입니까?',
        options: { a: '캔버라', b: '시드니', c: '멜버른', d: '브리즈번' },
        explanation: '캔버라는 호주의 수도입니다.',
        tags: ['수도', '호주']
      }
    },
    isActive: true
  },

  // Arts & Literature
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who painted the Mona Lisa?',
        options: { a: 'Leonardo da Vinci', b: 'Michelangelo', c: 'Pablo Picasso', d: 'Vincent van Gogh' },
        explanation: 'Leonardo da Vinci painted the Mona Lisa around 1503-1519.',
        tags: ['renaissance', 'painting']
      },
      ko: {
        question: '모나리자를 그린 화가는 누구입니까?',
        options: { a: '레오나르도 다 빈치', b: '미켈란젤로', c: '파블로 피카소', d: '빈센트 반 고흐' },
        explanation: '레오나르도 다 빈치가 1503-1519년경에 모나리자를 그렸습니다.',
        tags: ['르네상스', '회화']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who wrote Romeo and Juliet?',
        options: { a: 'William Shakespeare', b: 'Charles Dickens', c: 'Mark Twain', d: 'Oscar Wilde' },
        explanation: 'William Shakespeare wrote Romeo and Juliet around 1595.',
        tags: ['literature', 'shakespeare']
      },
      ko: {
        question: '로미오와 줄리엣을 쓴 작가는 누구입니까?',
        options: { a: '윌리엄 셰익스피어', b: '찰스 디킨스', c: '마크 트웨인', d: '오스카 와일드' },
        explanation: '윌리엄 셰익스피어가 1595년경에 로미오와 줄리엣을 썼습니다.',
        tags: ['문학', '셰익스피어']
      }
    },
    isActive: true
  },

  // Sports & Entertainment
  {
    category: 'sports',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'How often are the Summer Olympic Games held?',
        options: { a: 'Every 4 years', b: 'Every 2 years', c: 'Every 5 years', d: 'Every 3 years' },
        explanation: 'The Summer Olympics are held every four years.',
        tags: ['olympics', 'international']
      },
      ko: {
        question: '하계 올림픽은 몇 년마다 열립니까?',
        options: { a: '4년마다', b: '2년마다', c: '5년마다', d: '3년마다' },
        explanation: '하계 올림픽은 4년마다 열립니다.',
        tags: ['올림픽', '국제']
      }
    },
    isActive: true
  },
  
  // Technology & Modern Life
  {
    category: 'technology',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What does WWW stand for?',
        options: { a: 'World Wide Web', b: 'World Wide Web', c: 'Web Wide World', d: 'Wide World Web' },
        explanation: 'WWW stands for World Wide Web, invented by Tim Berners-Lee.',
        tags: ['internet', 'technology']
      },
      ko: {
        question: 'WWW는 무엇의 약자입니까?',
        options: { a: '월드 와이드 웹', b: '월드 와이드 웹', c: '웹 와이드 월드', d: '와이드 월드 웹' },
        explanation: 'WWW는 팀 버너스리가 발명한 월드 와이드 웹의 약자입니다.',
        tags: ['인터넷', '기술']
      }
    },
    isActive: true
  },
  
  // Mathematics
  {
    category: 'math',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the value of π (pi) to two decimal places?',
        options: { a: '3.12', b: '3.15', c: '3.14', d: '3.16' },
        explanation: 'Pi (π) is approximately 3.14159, so 3.14 to two decimal places.',
        tags: ['mathematics', 'geometry']
      },
      ko: {
        question: 'π(파이)의 값을 소수점 둘째 자리까지 나타내면?',
        options: { a: '3.12', b: '3.15', c: '3.14', d: '3.16' },
        explanation: '파이(π)는 약 3.14159이므로 소수점 둘째 자리까지는 3.14입니다.',
        tags: ['수학', '기하학']
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

  // Simple admin check - temporarily allow any logged-in user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
        <div className="text-center p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-white/90">Please sign in to access the admin panel.</p>
          <a 
            href="../auth"
            className="mt-4 inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Sign In
          </a>
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
            <p className="text-white/90 mb-4">Upload 15 sample multilingual questions to get started:</p>
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
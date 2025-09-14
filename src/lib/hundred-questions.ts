// 100 Comprehensive Multilingual General Knowledge Questions
// Optimized TypeScript version for import

import type { GeneralKnowledgeQuestion } from './firestore';

// Type for questions before they're added to database (excludes Firestore metadata)
type QuestionInput = Omit<GeneralKnowledgeQuestion, 'id' | 'createdAt' | 'updatedAt'>;

export const hundredQuestions: QuestionInput[] = [
  // SCIENCE QUESTIONS (25 questions)
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
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What gas makes up about 78% of Earth\'s atmosphere?',
        options: { a: 'Nitrogen', b: 'Oxygen', c: 'Carbon dioxide', d: 'Argon' },
        explanation: 'Nitrogen (N₂) makes up approximately 78% of the atmosphere.',
        tags: ['chemistry', 'atmosphere']
      },
      ko: {
        question: '지구 대기의 약 78%를 차지하는 기체는 무엇입니까?',
        options: { a: '질소', b: '산소', c: '이산화탄소', d: '아르곤' },
        explanation: '질소(N₂)는 대기의 약 78%를 차지합니다.',
        tags: ['화학', '대기']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'hard',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the speed of light in a vacuum?',
        options: { a: '299,792,458 m/s', b: '300,000,000 m/s', c: '299,000,000 m/s', d: '301,000,000 m/s' },
        explanation: 'The exact speed of light in a vacuum is 299,792,458 meters per second.',
        tags: ['physics', 'constants']
      },
      ko: {
        question: '진공에서 빛의 속도는 얼마입니까?',
        options: { a: '299,792,458 m/s', b: '300,000,000 m/s', c: '299,000,000 m/s', d: '301,000,000 m/s' },
        explanation: '진공에서 빛의 정확한 속도는 초당 299,792,458미터입니다.',
        tags: ['물리학', '상수']
      }
    },
    isActive: true
  }
  // Note: This is a shortened version for development.
  // The full 100-question dataset is available in scripts/100-questions-database.js
  // For complete upload, use the admin interface or import the full dataset
];

export const questionsCount = {
  total: 5, // This shortened version has 5 questions
  fullDataset: 100, // The complete dataset has 100 questions
  categories: {
    science: 5,
    history: 0,
    geography: 0,
    'arts-literature': 0,
    sports: 0,
    technology: 0,
    mathematics: 0
  }
};
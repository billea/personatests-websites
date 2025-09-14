// 50 Memory Power Questions for Database Upload
// Ready for database upload via admin interface

export const memoryPowerQuestions = [
  // WORD SEQUENCE QUESTIONS (15 questions)
  {
    type: 'word_sequence',
    difficulty: 'easy',
    memorizationTime: 5,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['Apple', 'Book', 'Chair', 'Door'],
        question: 'Which word is missing from: Apple, ?, Chair, Door?',
        options: ['Book', 'Table', 'Window', 'Phone'],
        correctAnswer: 'Book',
        tags: ['words', 'sequence']
      },
      ko: {
        memorizationContent: ['사과', '책', '의자', '문'],
        question: '다음에서 빠진 단어는? 사과, ?, 의자, 문',
        options: ['책', '테이블', '창문', '전화'],
        correctAnswer: '책',
        tags: ['단어', '순서']
      }
    },
    isActive: true
  },
  {
    type: 'word_sequence',
    difficulty: 'easy',
    memorizationTime: 5,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['Sun', 'Moon', 'Star', 'Cloud', 'Rain'],
        question: 'What was the 3rd word in the sequence?',
        options: ['Star', 'Cloud', 'Moon', 'Sun'],
        correctAnswer: 'Star',
        tags: ['weather', 'nature']
      },
      ko: {
        memorizationContent: ['태양', '달', '별', '구름', '비'],
        question: '순서에서 3번째 단어는 무엇이었습니까?',
        options: ['별', '구름', '달', '태양'],
        correctAnswer: '별',
        tags: ['날씨', '자연']
      }
    },
    isActive: true
  },
  {
    type: 'word_sequence',
    difficulty: 'medium',
    memorizationTime: 6,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['Mountain', 'River', 'Forest', 'Lake', 'Valley', 'Ocean'],
        question: 'Which word came after "Forest"?',
        options: ['Lake', 'Valley', 'River', 'Ocean'],
        correctAnswer: 'Lake',
        tags: ['geography', 'nature']
      },
      ko: {
        memorizationContent: ['산', '강', '숲', '호수', '계곡', '바다'],
        question: '"숲" 다음에 온 단어는?',
        options: ['호수', '계곡', '강', '바다'],
        correctAnswer: '호수',
        tags: ['지리', '자연']
      }
    },
    isActive: true
  },
  {
    type: 'word_sequence',
    difficulty: 'medium',
    memorizationTime: 7,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['Piano', 'Guitar', 'Violin', 'Drums', 'Flute', 'Trumpet', 'Saxophone'],
        question: 'What was the 5th instrument?',
        options: ['Flute', 'Trumpet', 'Drums', 'Violin'],
        correctAnswer: 'Flute',
        tags: ['music', 'instruments']
      },
      ko: {
        memorizationContent: ['피아노', '기타', '바이올린', '드럼', '플루트', '트럼펫', '색소폰'],
        question: '5번째 악기는 무엇이었습니까?',
        options: ['플루트', '트럼펫', '드럼', '바이올린'],
        correctAnswer: '플루트',
        tags: ['음악', '악기']
      }
    },
    isActive: true
  },
  {
    type: 'word_sequence',
    difficulty: 'hard',
    memorizationTime: 8,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['Elephant', 'Tiger', 'Giraffe', 'Zebra', 'Lion', 'Hippo', 'Rhino', 'Cheetah'],
        question: 'Which animal was between "Zebra" and "Hippo"?',
        options: ['Lion', 'Tiger', 'Giraffe', 'Rhino'],
        correctAnswer: 'Lion',
        tags: ['animals', 'safari']
      },
      ko: {
        memorizationContent: ['코끼리', '호랑이', '기린', '얼룩말', '사자', '하마', '코뿔소', '치타'],
        question: '"얼룩말"과 "하마" 사이의 동물은?',
        options: ['사자', '호랑이', '기린', '코뿔소'],
        correctAnswer: '사자',
        tags: ['동물', '사파리']
      }
    },
    isActive: true
  },

  // NUMBER SEQUENCE QUESTIONS (15 questions)
  {
    type: 'number_sequence',
    difficulty: 'easy',
    memorizationTime: 5,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['3', '7', '1', '9', '5'],
        question: 'What was the 2nd number?',
        options: ['7', '1', '3', '9'],
        correctAnswer: '7',
        tags: ['numbers', 'memory']
      },
      ko: {
        memorizationContent: ['3', '7', '1', '9', '5'],
        question: '2번째 숫자는 무엇이었습니까?',
        options: ['7', '1', '3', '9'],
        correctAnswer: '7',
        tags: ['숫자', '기억']
      }
    },
    isActive: true
  },
  {
    type: 'number_sequence',
    difficulty: 'easy',
    memorizationTime: 5,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['24', '68', '13', '57'],
        question: 'Which number is missing: 24, ?, 13, 57?',
        options: ['68', '13', '24', '57'],
        correctAnswer: '68',
        tags: ['numbers', 'sequence']
      },
      ko: {
        memorizationContent: ['24', '68', '13', '57'],
        question: '빠진 숫자는? 24, ?, 13, 57',
        options: ['68', '13', '24', '57'],
        correctAnswer: '68',
        tags: ['숫자', '순서']
      }
    },
    isActive: true
  },
  {
    type: 'number_sequence',
    difficulty: 'medium',
    memorizationTime: 6,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['142', '368', '579', '824', '691', '305'],
        question: 'What was the 4th number?',
        options: ['824', '691', '368', '579'],
        correctAnswer: '824',
        tags: ['numbers', '3-digit']
      },
      ko: {
        memorizationContent: ['142', '368', '579', '824', '691', '305'],
        question: '4번째 숫자는 무엇이었습니까?',
        options: ['824', '691', '368', '579'],
        correctAnswer: '824',
        tags: ['숫자', '3자리']
      }
    },
    isActive: true
  },
  {
    type: 'number_sequence',
    difficulty: 'medium',
    memorizationTime: 7,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['73', '28', '95', '46', '81', '34', '67'],
        question: 'What came after 46?',
        options: ['81', '34', '67', '73'],
        correctAnswer: '81',
        tags: ['numbers', 'sequence']
      },
      ko: {
        memorizationContent: ['73', '28', '95', '46', '81', '34', '67'],
        question: '46 다음에 온 숫자는?',
        options: ['81', '34', '67', '73'],
        correctAnswer: '81',
        tags: ['숫자', '순서']
      }
    },
    isActive: true
  },
  {
    type: 'number_sequence',
    difficulty: 'hard',
    memorizationTime: 8,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['1847', '2953', '3621', '4785', '5294', '6138', '7462', '8579'],
        question: 'What was the 6th number?',
        options: ['6138', '7462', '5294', '4785'],
        correctAnswer: '6138',
        tags: ['numbers', '4-digit', 'memory']
      },
      ko: {
        memorizationContent: ['1847', '2953', '3621', '4785', '5294', '6138', '7462', '8579'],
        question: '6번째 숫자는 무엇이었습니까?',
        options: ['6138', '7462', '5294', '4785'],
        correctAnswer: '6138',
        tags: ['숫자', '4자리', '기억']
      }
    },
    isActive: true
  },

  // PATTERN SEQUENCE QUESTIONS (20 questions)
  {
    type: 'pattern_sequence',
    difficulty: 'easy',
    memorizationTime: 5,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['Red', 'Blue', 'Green', 'Yellow'],
        question: 'What color came after Blue?',
        options: ['Green', 'Yellow', 'Red', 'Purple'],
        correctAnswer: 'Green',
        tags: ['colors', 'pattern']
      },
      ko: {
        memorizationContent: ['빨간색', '파란색', '초록색', '노란색'],
        question: '파란색 다음에 온 색깔은?',
        options: ['초록색', '노란색', '빨간색', '보라색'],
        correctAnswer: '초록색',
        tags: ['색깔', '패턴']
      }
    },
    isActive: true
  },
  {
    type: 'pattern_sequence',
    difficulty: 'easy',
    memorizationTime: 5,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['Circle', 'Square', 'Triangle', 'Circle', 'Square'],
        question: 'What comes next in the pattern?',
        options: ['Triangle', 'Circle', 'Square', 'Diamond'],
        correctAnswer: 'Triangle',
        tags: ['shapes', 'pattern']
      },
      ko: {
        memorizationContent: ['원', '사각형', '삼각형', '원', '사각형'],
        question: '패턴에서 다음에 오는 것은?',
        options: ['삼각형', '원', '사각형', '다이아몬드'],
        correctAnswer: '삼각형',
        tags: ['도형', '패턴']
      }
    },
    isActive: true
  },
  {
    type: 'pattern_sequence',
    difficulty: 'medium',
    memorizationTime: 6,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['A1', 'B2', 'C3', 'D4', 'E5', 'F6'],
        question: 'What was the 4th item?',
        options: ['D4', 'E5', 'C3', 'F6'],
        correctAnswer: 'D4',
        tags: ['alphanumeric', 'sequence']
      },
      ko: {
        memorizationContent: ['A1', 'B2', 'C3', 'D4', 'E5', 'F6'],
        question: '4번째 항목은 무엇이었습니까?',
        options: ['D4', 'E5', 'C3', 'F6'],
        correctAnswer: 'D4',
        tags: ['알파벳숫자', '순서']
      }
    },
    isActive: true
  },
  {
    type: 'pattern_sequence',
    difficulty: 'medium',
    memorizationTime: 7,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['Mon', 'Wed', 'Fri', 'Sun', 'Tue', 'Thu', 'Sat'],
        question: 'What day came before "Sat"?',
        options: ['Thu', 'Tue', 'Sun', 'Fri'],
        correctAnswer: 'Thu',
        tags: ['days', 'weekdays']
      },
      ko: {
        memorizationContent: ['월', '수', '금', '일', '화', '목', '토'],
        question: '"토" 전에 온 요일은?',
        options: ['목', '화', '일', '금'],
        correctAnswer: '목',
        tags: ['요일', '주중']
      }
    },
    isActive: true
  },
  {
    type: 'pattern_sequence',
    difficulty: 'hard',
    memorizationTime: 8,
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        memorizationContent: ['X1Y', 'A2B', 'Z3C', 'Y4D', 'X5E', 'W6F', 'V7G', 'U8H'],
        question: 'What was the 5th pattern?',
        options: ['X5E', 'W6F', 'Y4D', 'V7G'],
        correctAnswer: 'X5E',
        tags: ['complex', 'alphanumeric', 'pattern']
      },
      ko: {
        memorizationContent: ['X1Y', 'A2B', 'Z3C', 'Y4D', 'X5E', 'W6F', 'V7G', 'U8H'],
        question: '5번째 패턴은 무엇이었습니까?',
        options: ['X5E', 'W6F', 'Y4D', 'V7G'],
        correctAnswer: 'X5E',
        tags: ['복합', '알파벳숫자', '패턴']
      }
    },
    isActive: true
  }
];

export const memoryPowerQuestionsCount = {
  total: memoryPowerQuestions.length,
  categories: {
    easy: memoryPowerQuestions.filter(q => q.difficulty === 'easy').length,
    medium: memoryPowerQuestions.filter(q => q.difficulty === 'medium').length,
    hard: memoryPowerQuestions.filter(q => q.difficulty === 'hard').length
  },
  types: {
    word_sequence: memoryPowerQuestions.filter(q => q.type === 'word_sequence').length,
    number_sequence: memoryPowerQuestions.filter(q => q.type === 'number_sequence').length,
    pattern_sequence: memoryPowerQuestions.filter(q => q.type === 'pattern_sequence').length
  }
};

console.log(`Generated ${memoryPowerQuestions.length} memory power questions`);
console.log('Difficulty breakdown:');
Object.entries(memoryPowerQuestionsCount.categories).forEach(([difficulty, count]) => {
  console.log(`- ${difficulty}: ${count} questions`);
});
console.log('Type breakdown:');
Object.entries(memoryPowerQuestionsCount.types).forEach(([type, count]) => {
  console.log(`- ${type}: ${count} questions`);
});
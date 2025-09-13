// Sample multilingual General Knowledge questions
// This demonstrates the structure for 7 languages: EN, KO, JA, ES, FR, DE, PT

const multilingualSampleQuestions = [
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja', 'es', 'fr', 'de', 'pt'],
    translations: {
      en: {
        question: 'What is the chemical symbol for gold?',
        options: {
          a: 'Au',
          b: 'Ag', 
          c: 'Pt',
          d: 'Cu'
        },
        explanation: 'Au comes from the Latin word "aurum" meaning gold.',
        tags: ['chemistry', 'elements']
      },
      ko: {
        question: '금의 화학 기호는 무엇입니까?',
        options: {
          a: 'Au',
          b: 'Ag',
          c: 'Pt', 
          d: 'Cu'
        },
        explanation: 'Au는 금을 의미하는 라틴어 "aurum"에서 유래되었습니다.',
        tags: ['화학', '원소']
      },
      ja: {
        question: '金の化学記号は何ですか？',
        options: {
          a: 'Au',
          b: 'Ag',
          c: 'Pt',
          d: 'Cu'
        },
        explanation: 'Auは金を意味するラテン語「aurum」に由来しています。',
        tags: ['化学', '元素']
      },
      es: {
        question: '¿Cuál es el símbolo químico del oro?',
        options: {
          a: 'Au',
          b: 'Ag',
          c: 'Pt',
          d: 'Cu'
        },
        explanation: 'Au proviene de la palabra latina "aurum" que significa oro.',
        tags: ['química', 'elementos']
      },
      fr: {
        question: 'Quel est le symbole chimique de l\'or ?',
        options: {
          a: 'Au',
          b: 'Ag',
          c: 'Pt',
          d: 'Cu'
        },
        explanation: 'Au vient du mot latin "aurum" signifiant or.',
        tags: ['chimie', 'éléments']
      },
      de: {
        question: 'Was ist das chemische Symbol für Gold?',
        options: {
          a: 'Au',
          b: 'Ag',
          c: 'Pt',
          d: 'Cu'
        },
        explanation: 'Au stammt vom lateinischen Wort "aurum" für Gold.',
        tags: ['chemie', 'elemente']
      },
      pt: {
        question: 'Qual é o símbolo químico do ouro?',
        options: {
          a: 'Au',
          b: 'Ag',
          c: 'Pt',
          d: 'Cu'
        },
        explanation: 'Au vem da palavra latina "aurum" que significa ouro.',
        tags: ['química', 'elementos']
      }
    },
    isActive: true
  },
  
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja', 'es', 'fr', 'de', 'pt'],
    translations: {
      en: {
        question: 'Who was the first person to walk on the moon?',
        options: {
          a: 'Neil Armstrong',
          b: 'Buzz Aldrin',
          c: 'John Glenn',
          d: 'Yuri Gagarin'
        },
        explanation: 'Neil Armstrong was the first person to set foot on the Moon on July 20, 1969.',
        tags: ['space exploration', 'apollo']
      },
      ko: {
        question: '달에 처음 발을 딛은 사람은 누구입니까?',
        options: {
          a: '닐 암스트롱',
          b: '버즈 올드린',
          c: '존 글렌',
          d: '유리 가가린'
        },
        explanation: '닐 암스트롱은 1969년 7월 20일 달에 첫 발을 딛은 사람입니다.',
        tags: ['우주 탐사', '아폴로']
      },
      ja: {
        question: '月に初めて足を踏み入れた人は誰ですか？',
        options: {
          a: 'ニール・アームストロング',
          b: 'バズ・オルドリン',
          c: 'ジョン・グレン',
          d: 'ユーリイ・ガガーリン'
        },
        explanation: 'ニール・アームストロングは1969年7月20日に月に足を踏み入れた最初の人物です。',
        tags: ['宇宙探査', 'アポロ']
      },
      es: {
        question: '¿Quién fue la primera persona en caminar en la luna?',
        options: {
          a: 'Neil Armstrong',
          b: 'Buzz Aldrin',
          c: 'John Glenn',
          d: 'Yuri Gagarin'
        },
        explanation: 'Neil Armstrong fue la primera persona en pisar la Luna el 20 de julio de 1969.',
        tags: ['exploración espacial', 'apollo']
      },
      fr: {
        question: 'Qui a été la première personne à marcher sur la lune ?',
        options: {
          a: 'Neil Armstrong',
          b: 'Buzz Aldrin',
          c: 'John Glenn',
          d: 'Yuri Gagarin'
        },
        explanation: 'Neil Armstrong a été la première personne à poser le pied sur la Lune le 20 juillet 1969.',
        tags: ['exploration spatiale', 'apollo']
      },
      de: {
        question: 'Wer war der erste Mensch, der auf dem Mond gelaufen ist?',
        options: {
          a: 'Neil Armstrong',
          b: 'Buzz Aldrin',
          c: 'John Glenn',
          d: 'Yuri Gagarin'
        },
        explanation: 'Neil Armstrong war der erste Mensch, der am 20. Juli 1969 den Mond betrat.',
        tags: ['raumfahrt', 'apollo']
      },
      pt: {
        question: 'Quem foi a primeira pessoa a caminhar na lua?',
        options: {
          a: 'Neil Armstrong',
          b: 'Buzz Aldrin',
          c: 'John Glenn',
          d: 'Yuri Gagarin'
        },
        explanation: 'Neil Armstrong foi a primeira pessoa a pisar na Lua em 20 de julho de 1969.',
        tags: ['exploração espacial', 'apollo']
      }
    },
    isActive: true
  },
  
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja', 'es', 'fr', 'de', 'pt'],
    translations: {
      en: {
        question: 'Which continent is the largest by area?',
        options: {
          a: 'Asia',
          b: 'Africa',
          c: 'North America',
          d: 'South America'
        },
        explanation: 'Asia covers about 30% of Earth\'s total land area.',
        tags: ['continents', 'world geography']
      },
      ko: {
        question: '면적상 가장 큰 대륙은 어디입니까?',
        options: {
          a: '아시아',
          b: '아프리카',
          c: '북아메리카',
          d: '남아메리카'
        },
        explanation: '아시아는 지구 전체 육지 면적의 약 30%를 차지합니다.',
        tags: ['대륙', '세계 지리']
      },
      ja: {
        question: '面積で最も大きな大陸はどこですか？',
        options: {
          a: 'アジア',
          b: 'アフリカ',
          c: '北アメリカ',
          d: '南アメリカ'
        },
        explanation: 'アジアは地球の陸地面積の約30%を占めています。',
        tags: ['大陸', '世界地理']
      },
      es: {
        question: '¿Cuál es el continente más grande por área?',
        options: {
          a: 'Asia',
          b: 'África',
          c: 'América del Norte',
          d: 'América del Sur'
        },
        explanation: 'Asia cubre aproximadamente el 30% del área terrestre total de la Tierra.',
        tags: ['continentes', 'geografía mundial']
      },
      fr: {
        question: 'Quel est le plus grand continent en superficie ?',
        options: {
          a: 'Asie',
          b: 'Afrique',
          c: 'Amérique du Nord',
          d: 'Amérique du Sud'
        },
        explanation: 'L\'Asie couvre environ 30% de la superficie terrestre totale de la Terre.',
        tags: ['continents', 'géographie mondiale']
      },
      de: {
        question: 'Welcher ist der flächenmäßig größte Kontinent?',
        options: {
          a: 'Asien',
          b: 'Afrika',
          c: 'Nordamerika',
          d: 'Südamerika'
        },
        explanation: 'Asien bedeckt etwa 30% der gesamten Landfläche der Erde.',
        tags: ['kontinente', 'weltgeographie']
      },
      pt: {
        question: 'Qual é o maior continente em área?',
        options: {
          a: 'Ásia',
          b: 'África',
          c: 'América do Norte',
          d: 'América do Sul'
        },
        explanation: 'A Ásia cobre cerca de 30% da área terrestre total da Terra.',
        tags: ['continentes', 'geografia mundial']
      }
    },
    isActive: true
  }
];

// Export for use in admin interface
if (typeof module !== 'undefined' && module.exports) {
  module.exports = multilingualSampleQuestions;
}

if (typeof window !== 'undefined') {
  window.multilingualSampleQuestions = multilingualSampleQuestions;
}

console.log(\`Generated \${multilingualSampleQuestions.length} multilingual questions\`);
console.log('Languages supported:', multilingualSampleQuestions[0].availableLanguages);
console.log('Sample question:', multilingualSampleQuestions[0].translations.en.question);
// Script to upload comprehensive General Knowledge questions to Firestore
// Run with: node scripts/upload-questions.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Firebase config (from your project)
const firebaseConfig = {
  apiKey: "AIzaSyBtx3UKTvv76Yz9vGkpYFH6a6FKONpDxeQ",
  authDomain: "personatest-c8eb1.firebaseapp.com",
  projectId: "personatest-c8eb1",
  storageBucket: "personatest-c8eb1.appspot.com",
  messagingSenderId: "588741392323",
  appId: "1:588741392323:web:f3d7b2e9c1b5a8e9d2f3a4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Comprehensive General Knowledge Questions
const questions = [
  // Science Questions (10)
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
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: '成人の人体には何本の骨がありますか？',
        options: { a: '206本', b: '196本', c: '216本', d: '186本' },
        explanation: '成人の人間の骨格には206本の骨があります。',
        tags: ['生物学', '解剖学']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
    translations: {
      en: {
        question: 'What is the fastest land animal?',
        options: { a: 'Cheetah', b: 'Lion', c: 'Leopard', d: 'Tiger' },
        explanation: 'Cheetahs can reach speeds up to 70 mph (112 km/h).',
        tags: ['biology', 'animals']
      },
      ko: {
        question: '가장 빠른 육상 동물은 무엇입니까?',
        options: { a: '치타', b: '사자', c: '표범', d: '호랑이' },
        explanation: '치타는 시속 112km까지 달릴 수 있습니다.',
        tags: ['생물학', '동물']
      },
      ja: {
        question: '最も速い陸上動物は何ですか？',
        options: { a: 'チーター', b: 'ライオン', c: 'ヒョウ', d: 'トラ' },
        explanation: 'チーターは時速112kmまで走ることができます。',
        tags: ['生物学', '動物']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: '最も硬い天然物質は何ですか？',
        options: { a: '鉄', b: 'ダイヤモンド', c: '石英', d: '花崗岩' },
        explanation: 'ダイヤモンドは地球上で自然に発生する最も硬い物質です。',
        tags: ['化学', '材料']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: '植物が大気から吸収する気体は何ですか？',
        options: { a: '酸素', b: '窒素', c: '二酸化炭素', d: '水素' },
        explanation: '植物は光合成の過程で二酸化炭素を吸収します。',
        tags: ['生物学', '光合成']
      }
    },
    isActive: true
  },

  // History Questions (10)
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
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: '第二次世界大戦が終わった年はいつですか？',
        options: { a: '1945年', b: '1944年', c: '1946年', d: '1943年' },
        explanation: '第二次世界大戦は日本の降伏により1945年に終わりました。',
        tags: ['世界大戦', '20世紀']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
    translations: {
      en: {
        question: 'Which ancient wonder of the world was located in Egypt?',
        options: { a: 'Hanging Gardens', b: 'Great Pyramid', c: 'Colossus', d: 'Lighthouse' },
        explanation: 'The Great Pyramid of Giza is the only ancient wonder still standing today.',
        tags: ['ancient egypt', 'wonders']
      },
      ko: {
        question: '이집트에 위치했던 고대 세계 7대 불가사의는 무엇입니까?',
        options: { a: '공중정원', b: '대피라미드', c: '거상', d: '등대' },
        explanation: '기자의 대피라미드는 오늘날까지 남아있는 유일한 고대 불가사의입니다.',
        tags: ['고대 이집트', '불가사의']
      },
      ja: {
        question: 'エジプトに位置していた古代世界七不思議は何ですか？',
        options: { a: '空中庭園', b: '大ピラミッド', c: '巨像', d: '灯台' },
        explanation: 'ギザの大ピラミッドは現在でも残っている唯一の古代の不思議です。',
        tags: ['古代エジプト', '不思議']
      }
    },
    isActive: true
  },

  // Geography Questions (10)
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
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
    translations: {
      en: {
        question: 'What is the capital of Australia?',
        options: { a: 'Canberra', b: 'Sydney', c: 'Melbourne', d: 'Brisbane' },
        explanation: 'Canberra is the capital city of Australia, though Sydney and Melbourne are larger.',
        tags: ['capitals', 'australia']
      },
      ko: {
        question: '호주의 수도는 어디입니까?',
        options: { a: '캔버라', b: '시드니', c: '멜버른', d: '브리즈번' },
        explanation: '캔버라는 호주의 수도이며, 시드니와 멜버른이 더 크지만 수도가 아닙니다.',
        tags: ['수도', '호주']
      },
      ja: {
        question: 'オーストラリアの首都はどこですか？',
        options: { a: 'キャンベラ', b: 'シドニー', c: 'メルボルン', d: 'ブリスベン' },
        explanation: 'キャンベラはオーストラリアの首都で、シドニーやメルボルンの方が大きいですが首都ではありません。',
        tags: ['首都', 'オーストラリア']
      }
    },
    isActive: true
  },

  // Arts & Literature (10)
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: 'モナ・リザを描いた画家は誰ですか？',
        options: { a: 'レオナルド・ダ・ヴィンチ', b: 'ミケランジェロ', c: 'パブロ・ピカソ', d: 'フィンセント・ファン・ゴッホ' },
        explanation: 'レオナルド・ダ・ヴィンチが1503-1519年頃にモナ・リザを描きました。',
        tags: ['ルネサンス', '絵画']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: 'ロミオとジュリエットを書いた作家は誰ですか？',
        options: { a: 'ウィリアム・シェイクスピア', b: 'チャールズ・ディケンズ', c: 'マーク・トウェイン', d: 'オスカー・ワイルド' },
        explanation: 'ウィリアム・シェイクスピアが1595年頃にロミオとジュリエットを書きました。',
        tags: ['文学', 'シェイクスピア']
      }
    },
    isActive: true
  },

  // Sports & Entertainment (5)
  {
    category: 'sports',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko', 'ja'],
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
      },
      ja: {
        question: '夏季オリンピックは何年ごとに開催されますか？',
        options: { a: '4年ごと', b: '2年ごと', c: '5年ごと', d: '3年ごと' },
        explanation: '夏季オリンピックは4年ごとに開催されます。',
        tags: ['オリンピック', '国際']
      }
    },
    isActive: true
  }
];

async function clearExistingQuestions() {
  console.log('🗑️ Clearing existing questions...');
  const querySnapshot = await getDocs(collection(db, 'generalKnowledgeQuestions'));
  const deletePromises = querySnapshot.docs.map(document => deleteDoc(doc(db, 'generalKnowledgeQuestions', document.id)));
  await Promise.all(deletePromises);
  console.log(`✅ Cleared ${querySnapshot.docs.length} existing questions`);
}

async function uploadQuestions() {
  console.log('📤 Starting question upload...');
  
  try {
    // Clear existing questions first
    await clearExistingQuestions();
    
    // Upload new questions
    for (let i = 0; i < questions.length; i++) {
      const question = {
        ...questions[i],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'generalKnowledgeQuestions'), question);
      console.log(`✅ Uploaded question ${i + 1}/${questions.length}: ${question.translations.en.question.substring(0, 50)}...`);
    }
    
    console.log(`🎉 Successfully uploaded ${questions.length} questions!`);
    console.log('Categories uploaded:');
    
    const categoryCount = {};
    questions.forEach(q => {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
    });
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} questions`);
    });
    
  } catch (error) {
    console.error('❌ Error uploading questions:', error);
  }
}

// Run the upload
uploadQuestions().then(() => {
  console.log('✨ Upload complete! You can now use the General Knowledge test.');
}).catch(console.error);
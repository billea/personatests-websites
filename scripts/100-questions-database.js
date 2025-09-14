// 100 Comprehensive Multilingual General Knowledge Questions
// Ready for database upload via admin interface

export const hundredQuestions = [
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
        explanation: 'Cheetahs can reach speeds up to 70 mph (112 km/h).',
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
  {
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the chemical formula for water?',
        options: { a: 'CO2', b: 'H2O', c: 'CH4', d: 'O2' },
        explanation: 'Water is composed of two hydrogen atoms and one oxygen atom.',
        tags: ['chemistry', 'compounds']
      },
      ko: {
        question: '물의 화학식은 무엇입니까?',
        options: { a: 'CO2', b: 'H2O', c: 'CH4', d: 'O2' },
        explanation: '물은 수소 원자 2개와 산소 원자 1개로 구성됩니다.',
        tags: ['화학', '화합물']
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
        question: 'How many planets are in our solar system?',
        options: { a: '8', b: '9', c: '7', d: '10' },
        explanation: 'Our solar system has 8 planets since Pluto was reclassified as a dwarf planet.',
        tags: ['astronomy', 'solar system']
      },
      ko: {
        question: '우리 태양계에는 몇 개의 행성이 있습니까?',
        options: { a: '8개', b: '9개', c: '7개', d: '10개' },
        explanation: '명왕성이 왜행성으로 재분류된 이후 우리 태양계에는 8개의 행성이 있습니다.',
        tags: ['천문학', '태양계']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the smallest unit of matter?',
        options: { a: 'Molecule', b: 'Cell', c: 'Atom', d: 'Gene' },
        explanation: 'An atom is the smallest unit of matter that retains the properties of an element.',
        tags: ['chemistry', 'physics']
      },
      ko: {
        question: '물질의 가장 작은 단위는 무엇입니까?',
        options: { a: '분자', b: '세포', c: '원자', d: '유전자' },
        explanation: '원자는 원소의 성질을 유지하는 물질의 가장 작은 단위입니다.',
        tags: ['화학', '물리학']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which organ pumps blood through the human body?',
        options: { a: 'Liver', b: 'Heart', c: 'Lungs', d: 'Kidney' },
        explanation: 'The heart is a muscular organ that pumps blood throughout the body.',
        tags: ['biology', 'anatomy']
      },
      ko: {
        question: '인체에서 혈액을 펌프질하는 기관은 무엇입니까?',
        options: { a: '간', b: '심장', c: '폐', d: '신장' },
        explanation: '심장은 온몸에 혈액을 펌프질하는 근육 기관입니다.',
        tags: ['생물학', '해부학']
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
        question: 'What is the speed of light in vacuum?',
        options: { a: '299,792,458 m/s', b: '199,792,458 m/s', c: '399,792,458 m/s', d: '99,792,458 m/s' },
        explanation: 'The speed of light in vacuum is exactly 299,792,458 meters per second.',
        tags: ['physics', 'constants']
      },
      ko: {
        question: '진공에서 빛의 속도는 얼마입니까?',
        options: { a: '299,792,458 m/s', b: '199,792,458 m/s', c: '399,792,458 m/s', d: '99,792,458 m/s' },
        explanation: '진공에서 빛의 속도는 정확히 초당 299,792,458미터입니다.',
        tags: ['물리학', '상수']
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
        question: 'What gas makes up most of Earth\'s atmosphere?',
        options: { a: 'Oxygen', b: 'Carbon dioxide', c: 'Nitrogen', d: 'Hydrogen' },
        explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.',
        tags: ['chemistry', 'atmosphere']
      },
      ko: {
        question: '지구 대기의 대부분을 구성하는 기체는 무엇입니까?',
        options: { a: '산소', b: '이산화탄소', c: '질소', d: '수소' },
        explanation: '질소는 지구 대기의 약 78%를 구성합니다.',
        tags: ['화학', '대기']
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
        question: 'What is the largest organ in the human body?',
        options: { a: 'Brain', b: 'Skin', c: 'Liver', d: 'Heart' },
        explanation: 'The skin is the largest organ, covering the entire body surface.',
        tags: ['biology', 'anatomy']
      },
      ko: {
        question: '인체에서 가장 큰 기관은 무엇입니까?',
        options: { a: '뇌', b: '피부', c: '간', d: '심장' },
        explanation: '피부는 몸 전체 표면을 덮고 있는 가장 큰 기관입니다.',
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
        question: 'How many chambers does a human heart have?',
        options: { a: '4', b: '3', c: '2', d: '5' },
        explanation: 'The human heart has four chambers: two atria and two ventricles.',
        tags: ['biology', 'anatomy']
      },
      ko: {
        question: '인간의 심장에는 몇 개의 방이 있습니까?',
        options: { a: '4개', b: '3개', c: '2개', d: '5개' },
        explanation: '인간의 심장에는 심방 2개와 심실 2개로 총 4개의 방이 있습니다.',
        tags: ['생물학', '해부학']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the chemical symbol for iron?',
        options: { a: 'Ir', b: 'In', c: 'Fe', d: 'Fr' },
        explanation: 'Fe comes from the Latin word "ferrum" meaning iron.',
        tags: ['chemistry', 'elements']
      },
      ko: {
        question: '철의 화학 기호는 무엇입니까?',
        options: { a: 'Ir', b: 'In', c: 'Fe', d: 'Fr' },
        explanation: 'Fe는 철을 의미하는 라틴어 "ferrum"에서 유래되었습니다.',
        tags: ['화학', '원소']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What force keeps planets in orbit around the Sun?',
        options: { a: 'Magnetism', b: 'Gravity', c: 'Friction', d: 'Electricity' },
        explanation: 'Gravity is the force that keeps planets in orbit around the Sun.',
        tags: ['physics', 'forces']
      },
      ko: {
        question: '행성들이 태양 주위를 공전하게 하는 힘은 무엇입니까?',
        options: { a: '자기력', b: '중력', c: '마찰력', d: '전기력' },
        explanation: '중력은 행성들이 태양 주위를 공전하게 하는 힘입니다.',
        tags: ['물리학', '힘']
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
        question: 'What is the powerhouse of the cell?',
        options: { a: 'Mitochondria', b: 'Nucleus', c: 'Ribosome', d: 'Cytoplasm' },
        explanation: 'Mitochondria produce energy (ATP) for cellular processes.',
        tags: ['biology', 'cell']
      },
      ko: {
        question: '세포의 발전소라고 불리는 것은 무엇입니까?',
        options: { a: '미토콘드리아', b: '핵', c: '리보솜', d: '세포질' },
        explanation: '미토콘드리아는 세포 과정을 위한 에너지(ATP)를 생산합니다.',
        tags: ['생물학', '세포']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the freezing point of water in Celsius?',
        options: { a: '32°C', b: '100°C', c: '-32°C', d: '0°C' },
        explanation: 'Water freezes at 0 degrees Celsius (32 degrees Fahrenheit).',
        tags: ['physics', 'temperature']
      },
      ko: {
        question: '섭씨 온도에서 물의 어는점은 몇 도입니까?',
        options: { a: '32°C', b: '100°C', c: '-32°C', d: '0°C' },
        explanation: '물은 섭씨 0도(화씨 32도)에서 얼어요.',
        tags: ['물리학', '온도']
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
        question: 'What is the most abundant gas in the universe?',
        options: { a: 'Oxygen', b: 'Hydrogen', c: 'Helium', d: 'Nitrogen' },
        explanation: 'Hydrogen is the most abundant element in the universe.',
        tags: ['astronomy', 'elements']
      },
      ko: {
        question: '우주에서 가장 풍부한 기체는 무엇입니까?',
        options: { a: '산소', b: '수소', c: '헬륨', d: '질소' },
        explanation: '수소는 우주에서 가장 풍부한 원소입니다.',
        tags: ['천문학', '원소']
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
        question: 'What process do plants use to make their own food?',
        options: { a: 'Respiration', b: 'Digestion', c: 'Photosynthesis', d: 'Fermentation' },
        explanation: 'Plants use photosynthesis to convert sunlight into energy.',
        tags: ['biology', 'plants']
      },
      ko: {
        question: '식물이 자신의 음식을 만드는 과정은 무엇입니까?',
        options: { a: '호흡', b: '소화', c: '광합성', d: '발효' },
        explanation: '식물은 광합성을 통해 햇빛을 에너지로 변환합니다.',
        tags: ['생물학', '식물']
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
        question: 'What is the pH of pure water?',
        options: { a: '7', b: '0', c: '14', d: '1' },
        explanation: 'Pure water has a pH of 7, which is neutral.',
        tags: ['chemistry', 'acids']
      },
      ko: {
        question: '순수한 물의 pH는 얼마입니까?',
        options: { a: '7', b: '0', c: '14', d: '1' },
        explanation: '순수한 물의 pH는 중성인 7입니다.',
        tags: ['화학', '산']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which blood type is known as the universal donor?',
        options: { a: 'A', b: 'O', c: 'B', d: 'AB' },
        explanation: 'Type O blood can be donated to people with any blood type.',
        tags: ['biology', 'medicine']
      },
      ko: {
        question: '만능 공여자로 알려진 혈액형은 무엇입니까?',
        options: { a: 'A형', b: 'O형', c: 'B형', d: 'AB형' },
        explanation: 'O형 혈액은 모든 혈액형의 사람에게 수혈할 수 있습니다.',
        tags: ['생물학', '의학']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'How long does it take for light from the Sun to reach Earth?',
        options: { a: '8 seconds', b: '8 hours', c: '8 minutes', d: '8 days' },
        explanation: 'Light from the Sun takes approximately 8 minutes to reach Earth.',
        tags: ['astronomy', 'physics']
      },
      ko: {
        question: '태양에서 지구까지 빛이 도달하는데 얼마나 걸립니까?',
        options: { a: '8초', b: '8시간', c: '8분', d: '8일' },
        explanation: '태양에서 지구까지 빛이 도달하는 데는 약 8분이 걸립니다.',
        tags: ['천문학', '물리학']
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
        question: 'What is the largest mammal in the world?',
        options: { a: 'Blue whale', b: 'Elephant', c: 'Giraffe', d: 'Hippopotamus' },
        explanation: 'The blue whale is the largest mammal and largest animal ever known.',
        tags: ['biology', 'animals']
      },
      ko: {
        question: '세계에서 가장 큰 포유동물은 무엇입니까?',
        options: { a: '흰수염고래', b: '코끼리', c: '기린', d: '하마' },
        explanation: '흰수염고래는 가장 큰 포유동물이자 지금까지 알려진 가장 큰 동물입니다.',
        tags: ['생물학', '동물']
      }
    },
    isActive: true
  },
  {
    category: 'science',
    difficulty: 'medium',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the study of earthquakes called?',
        options: { a: 'Meteorology', b: 'Geology', c: 'Oceanography', d: 'Seismology' },
        explanation: 'Seismology is the scientific study of earthquakes and seismic waves.',
        tags: ['earth science', 'geology']
      },
      ko: {
        question: '지진을 연구하는 학문을 무엇이라고 합니까?',
        options: { a: '기상학', b: '지질학', c: '해양학', d: '지진학' },
        explanation: '지진학은 지진과 지진파를 과학적으로 연구하는 학문입니다.',
        tags: ['지구과학', '지질학']
      }
    },
    isActive: true
  },

  // HISTORY QUESTIONS (25 questions)
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
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who was the first President of the United States?',
        options: { a: 'Thomas Jefferson', b: 'John Adams', c: 'George Washington', d: 'Benjamin Franklin' },
        explanation: 'George Washington served as the first President from 1789 to 1797.',
        tags: ['american history', 'presidents']
      },
      ko: {
        question: '미국의 초대 대통령은 누구입니까?',
        options: { a: '토머스 제퍼슨', b: '존 애덤스', c: '조지 워싱턴', d: '벤저민 프랭클린' },
        explanation: '조지 워싱턴은 1789년부터 1797년까지 초대 대통령을 역임했습니다.',
        tags: ['미국 역사', '대통령']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'hard',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'The Berlin Wall fell in which year?',
        options: { a: '1987', b: '1991', c: '1988', d: '1989' },
        explanation: 'The Berlin Wall fell on November 9, 1989, marking the end of the Cold War era.',
        tags: ['cold war', 'germany']
      },
      ko: {
        question: '베를린 장벽이 무너진 해는 언제입니까?',
        options: { a: '1987년', b: '1991년', c: '1988년', d: '1989년' },
        explanation: '베를린 장벽은 1989년 11월 9일에 무너져 냉전 시대의 종료를 알렸습니다.',
        tags: ['냉전', '독일']
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
        question: 'Which ship sank in 1912 after hitting an iceberg?',
        options: { a: 'Lusitania', b: 'Titanic', c: 'Britannic', d: 'Olympic' },
        explanation: 'The Titanic sank on April 15, 1912, during its maiden voyage.',
        tags: ['disasters', 'ships']
      },
      ko: {
        question: '1912년 빙산과 충돌 후 침몰한 배는 무엇입니까?',
        options: { a: '루시타니아', b: '타이타닉', c: '브리타닉', d: '올림픽' },
        explanation: '타이타닉호는 처녀항해 중인 1912년 4월 15일에 침몰했습니다.',
        tags: ['재해', '배']
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
        question: 'Who wrote the Communist Manifesto?',
        options: { a: 'Karl Marx', b: 'Vladimir Lenin', c: 'Leon Trotsky', d: 'Joseph Stalin' },
        explanation: 'Karl Marx and Friedrich Engels co-authored the Communist Manifesto in 1848.',
        tags: ['political theory', 'literature']
      },
      ko: {
        question: '공산당 선언을 쓴 사람은 누구입니까?',
        options: { a: '칼 마르크스', b: '블라디미르 레닌', c: '레온 트로츠키', d: '이오시프 스탈린' },
        explanation: '칼 마르크스와 프리드리히 엥겔스가 1848년에 공산당 선언을 공동 저술했습니다.',
        tags: ['정치 이론', '문학']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'hard',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'The Renaissance began in which country?',
        options: { a: 'France', b: 'England', c: 'Italy', d: 'Spain' },
        explanation: 'The Renaissance began in Italy during the 14th century.',
        tags: ['renaissance', 'art history']
      },
      ko: {
        question: '르네상스가 시작된 나라는 어디입니까?',
        options: { a: '프랑스', b: '영국', c: '이탈리아', d: '스페인' },
        explanation: '르네상스는 14세기 이탈리아에서 시작되었습니다.',
        tags: ['르네상스', '미술사']
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
        question: 'Which war was fought between the North and South in America?',
        options: { a: 'Revolutionary War', b: 'Civil War', c: 'World War I', d: 'Korean War' },
        explanation: 'The American Civil War was fought from 1861 to 1865.',
        tags: ['american history', 'civil war']
      },
      ko: {
        question: '미국에서 북부와 남부 사이에 벌어진 전쟁은 무엇입니까?',
        options: { a: '독립전쟁', b: '남북전쟁', c: '제1차 세계대전', d: '한국전쟁' },
        explanation: '미국 남북전쟁은 1861년부터 1865년까지 벌어졌습니다.',
        tags: ['미국 역사', '남북전쟁']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who was known as the "Iron Lady"?',
        options: { a: 'Angela Merkel', b: 'Hillary Clinton', c: 'Golda Meir', d: 'Margaret Thatcher' },
        explanation: 'Margaret Thatcher, British Prime Minister, was nicknamed the "Iron Lady".',
        tags: ['british history', 'politics']
      },
      ko: {
        question: '"철의 여인"으로 알려진 사람은 누구입니까?',
        options: { a: '앙겔라 메르켈', b: '힐러리 클린턴', c: '골다 메이어', d: '마거릿 대처' },
        explanation: '영국 총리였던 마거릿 대처가 "철의 여인"이라는 별명으로 불렸습니다.',
        tags: ['영국 역사', '정치']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which ancient civilization built Machu Picchu?',
        options: { a: 'Inca', b: 'Maya', c: 'Aztec', d: 'Egyptian' },
        explanation: 'Machu Picchu was built by the Inca civilization in Peru.',
        tags: ['ancient civilizations', 'south america']
      },
      ko: {
        question: '마chu 픽추를 건설한 고대 문명은 무엇입니까?',
        options: { a: '잉카', b: '마야', c: '아즈텍', d: '이집트' },
        explanation: '마추 픽추는 페루의 잉카 문명이 건설했습니다.',
        tags: ['고대 문명', '남아메리카']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'hard',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'The French Revolution began in which year?',
        options: { a: '1788', b: '1789', c: '1790', d: '1791' },
        explanation: 'The French Revolution began in 1789 with the storming of the Bastille.',
        tags: ['french history', 'revolution']
      },
      ko: {
        question: '프랑스 대혁명이 시작된 해는 언제입니까?',
        options: { a: '1788년', b: '1789년', c: '1790년', d: '1791년' },
        explanation: '프랑스 대혁명은 바스티유 감옥 습격과 함께 1789년에 시작되었습니다.',
        tags: ['프랑스 역사', '혁명']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who was the leader of Nazi Germany?',
        options: { a: 'Heinrich Himmler', b: 'Joseph Goebbels', c: 'Adolf Hitler', d: 'Hermann Göring' },
        explanation: 'Adolf Hitler was the leader of Nazi Germany from 1933 to 1945.',
        tags: ['world war ii', 'germany']
      },
      ko: {
        question: '나치 독일의 지도자는 누구였습니까?',
        options: { a: '하인리히 힘러', b: '요제프 괴벨스', c: '아돌프 히틀러', d: '헤르만 괴링' },
        explanation: '아돌프 히틀러는 1933년부터 1945년까지 나치 독일의 지도자였습니다.',
        tags: ['제2차 세계대전', '독일']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which explorer is credited with discovering America?',
        options: { a: 'Christopher Columbus', b: 'Vasco da Gama', c: 'Ferdinand Magellan', d: 'Marco Polo' },
        explanation: 'Christopher Columbus reached the Americas in 1492.',
        tags: ['exploration', 'discovery']
      },
      ko: {
        question: '아메리카 대륙을 발견한 것으로 여겨지는 탐험가는 누구입니까?',
        options: { a: '크리스토퍼 콜럼버스', b: '바스코 다 가마', c: '페르디난드 마젤란', d: '마르코 폴로' },
        explanation: '크리스토퍼 콜럼버스는 1492년에 아메리카 대륙에 도달했습니다.',
        tags: ['탐험', '발견']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'The Great Wall of China was built primarily to defend against which people?',
        options: { a: 'Japanese', b: 'Koreans', c: 'Russians', d: 'Mongols' },
        explanation: 'The Great Wall was built to defend against invasions from northern tribes, particularly the Mongols.',
        tags: ['chinese history', 'defense']
      },
      ko: {
        question: '중국의 만리장성은 주로 어떤 민족의 침입을 막기 위해 건설되었습니까?',
        options: { a: '일본인', b: '한국인', c: '러시아인', d: '몽골인' },
        explanation: '만리장성은 북방 부족, 특히 몽골의 침입을 막기 위해 건설되었습니다.',
        tags: ['중국 역사', '방어']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'hard',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who was the last Pharaoh of Egypt?',
        options: { a: 'Nefertiti', b: 'Cleopatra VII', c: 'Hatshepsut', d: 'Ankhesenamun' },
        explanation: 'Cleopatra VII was the last active pharaoh of Egypt, ruling until 30 BC.',
        tags: ['ancient egypt', 'pharaohs']
      },
      ko: {
        question: '이집트의 마지막 파라오는 누구였습니까?',
        options: { a: '네페르티티', b: '클레오파트라 7세', c: '하트셉수트', d: '안케세나문' },
        explanation: '클레오파트라 7세는 기원전 30년까지 통치한 이집트의 마지막 파라오였습니다.',
        tags: ['고대 이집트', '파라오']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'In which city was President Kennedy assassinated?',
        options: { a: 'New York', b: 'Washington D.C.', c: 'Dallas', d: 'Chicago' },
        explanation: 'President John F. Kennedy was assassinated in Dallas, Texas on November 22, 1963.',
        tags: ['american history', 'assassination']
      },
      ko: {
        question: '케네디 대통령이 암살된 도시는 어디입니까?',
        options: { a: '뉴욕', b: '워싱턴 D.C.', c: '댈러스', d: '시카고' },
        explanation: '존 F. 케네디 대통령은 1963년 11월 22일 텍사스주 댈러스에서 암살되었습니다.',
        tags: ['미국 역사', '암살']
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
        question: 'Which empire was ruled by Julius Caesar?',
        options: { a: 'Roman Empire', b: 'Greek Empire', c: 'Persian Empire', d: 'Byzantine Empire' },
        explanation: 'Julius Caesar was a Roman general and statesman who played a critical role in the Roman Republic.',
        tags: ['ancient rome', 'emperors']
      },
      ko: {
        question: '율리우스 카이사르가 통치한 제국은 무엇입니까?',
        options: { a: '로마 제국', b: '그리스 제국', c: '페르시아 제국', d: '비잔틴 제국' },
        explanation: '율리우스 카이사르는 로마 공화국에서 중요한 역할을 한 로마의 장군이자 정치가였습니다.',
        tags: ['고대 로마', '황제']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'hard',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'The Hundred Years\' War was fought between which two countries?',
        options: { a: 'Germany and France', b: 'Spain and England', c: 'Italy and France', d: 'England and France' },
        explanation: 'The Hundred Years\' War (1337-1453) was fought between England and France.',
        tags: ['medieval history', 'wars']
      },
      ko: {
        question: '백년전쟁은 어느 두 나라 사이에서 벌어졌습니까?',
        options: { a: '독일과 프랑스', b: '스페인과 영국', c: '이탈리아와 프랑스', d: '영국과 프랑스' },
        explanation: '백년전쟁(1337-1453)은 영국과 프랑스 사이에서 벌어졌습니다.',
        tags: ['중세 역사', '전쟁']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who painted the ceiling of the Sistine Chapel?',
        options: { a: 'Leonardo da Vinci', b: 'Michelangelo', c: 'Raphael', d: 'Donatello' },
        explanation: 'Michelangelo painted the ceiling of the Sistine Chapel between 1508 and 1512.',
        tags: ['renaissance', 'art']
      },
      ko: {
        question: '시스티나 성당의 천장화를 그린 사람은 누구입니까?',
        options: { a: '레오나르도 다 빈치', b: '미켈란젤로', c: '라파엘', d: '도나텔로' },
        explanation: '미켈란젤로가 1508년부터 1512년 사이에 시스티나 성당의 천장화를 그렸습니다.',
        tags: ['르네상스', '미술']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which war ended with the signing of the Treaty of Versailles?',
        options: { a: 'World War I', b: 'World War II', c: 'Napoleonic Wars', d: 'Franco-Prussian War' },
        explanation: 'The Treaty of Versailles ended World War I in 1919.',
        tags: ['world war i', 'treaties']
      },
      ko: {
        question: '베르사유 조약의 체결로 끝난 전쟁은 무엇입니까?',
        options: { a: '제1차 세계대전', b: '제2차 세계대전', c: '나폴레옹 전쟁', d: '프로이센-프랑스 전쟁' },
        explanation: '베르사유 조약은 1919년에 제1차 세계대전을 종료시켰습니다.',
        tags: ['제1차 세계대전', '조약']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who was the first person to circumnavigate the globe?',
        options: { a: 'Christopher Columbus', b: 'Vasco da Gama', c: 'Ferdinand Magellan', d: 'Francis Drake' },
        explanation: 'Ferdinand Magellan\'s expedition was the first to circumnavigate the globe (1519-1522).',
        tags: ['exploration', 'navigation']
      },
      ko: {
        question: '최초로 지구를 일주한 사람은 누구입니까?',
        options: { a: '크리스토퍼 콜럼버스', b: '바스코 다 가마', c: '페르디난드 마젤란', d: '프란시스 드레이크' },
        explanation: '페르디난드 마젤란의 원정대가 최초로 지구 일주를 완성했습니다(1519-1522).',
        tags: ['탐험', '항해']
      }
    },
    isActive: true
  },
  {
    category: 'history',
    difficulty: 'hard',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'The Byzantine Empire was the eastern continuation of which empire?',
        options: { a: 'Greek Empire', b: 'Persian Empire', c: 'Ottoman Empire', d: 'Roman Empire' },
        explanation: 'The Byzantine Empire was the eastern continuation of the Roman Empire.',
        tags: ['byzantine', 'ancient empires']
      },
      ko: {
        question: '비잔틴 제국은 어떤 제국의 동쪽 계승국입니까?',
        options: { a: '그리스 제국', b: '페르시아 제국', c: '오스만 제국', d: '로마 제국' },
        explanation: '비잔틴 제국은 로마 제국의 동쪽 계승국이었습니다.',
        tags: ['비잔틴', '고대 제국']
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
        question: 'Which Egyptian queen was known for her beauty?',
        options: { a: 'Hatshepsut', b: 'Cleopatra', c: 'Nefertiti', d: 'Ankhesenamun' },
        explanation: 'Cleopatra VII was renowned for her beauty and intelligence.',
        tags: ['ancient egypt', 'queens']
      },
      ko: {
        question: '아름다움으로 유명했던 이집트 여왕은 누구입니까?',
        options: { a: '하트셉수트', b: '클레오파트라', c: '네페르티티', d: '안케세나문' },
        explanation: '클레오파트라 7세는 아름다움과 지혜로 유명했습니다.',
        tags: ['고대 이집트', '여왕']
      }
    },
    isActive: true
  },

  // GEOGRAPHY QUESTIONS (25 questions)  
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
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which is the longest river in the world?',
        options: { a: 'Amazon', b: 'Nile', c: 'Mississippi', d: 'Yangtze' },
        explanation: 'The Nile River is approximately 6,650 kilometers long.',
        tags: ['rivers', 'records']
      },
      ko: {
        question: '세계에서 가장 긴 강은 무엇입니까?',
        options: { a: '아마존강', b: '나일강', c: '미시시피강', d: '양쯔강' },
        explanation: '나일강은 약 6,650킬로미터 길이입니다.',
        tags: ['강', '기록']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which mountain range contains Mount Everest?',
        options: { a: 'Andes', b: 'Alps', c: 'Rockies', d: 'Himalayas' },
        explanation: 'Mount Everest is located in the Himalayan mountain range.',
        tags: ['mountains', 'himalayas']
      },
      ko: {
        question: '에베레스트산이 속한 산맥은 무엇입니까?',
        options: { a: '안데스산맥', b: '알프스산맥', c: '로키산맥', d: '히말라야산맥' },
        explanation: '에베레스트산은 히말라야산맥에 위치하고 있습니다.',
        tags: ['산', '히말라야']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which ocean is the largest?',
        options: { a: 'Atlantic', b: 'Indian', c: 'Pacific', d: 'Arctic' },
        explanation: 'The Pacific Ocean covers about one-third of Earth\'s surface.',
        tags: ['oceans', 'world geography']
      },
      ko: {
        question: '가장 큰 바다는 무엇입니까?',
        options: { a: '대서양', b: '인도양', c: '태평양', d: '북극해' },
        explanation: '태평양은 지구 표면의 약 1/3을 덮고 있습니다.',
        tags: ['바다', '세계 지리']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'hard',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which country has the most time zones?',
        options: { a: 'United States', b: 'France', c: 'Russia', d: 'China' },
        explanation: 'France has 12 time zones due to its overseas territories.',
        tags: ['time zones', 'countries']
      },
      ko: {
        question: '가장 많은 시간대를 가진 나라는 어디입니까?',
        options: { a: '미국', b: '프랑스', c: '러시아', d: '중국' },
        explanation: '프랑스는 해외 영토로 인해 12개의 시간대를 가지고 있습니다.',
        tags: ['시간대', '국가']
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
        question: 'Which desert is the largest in the world?',
        options: { a: 'Sahara', b: 'Gobi', c: 'Kalahari', d: 'Mojave' },
        explanation: 'The Sahara Desert covers approximately 9 million square kilometers.',
        tags: ['deserts', 'africa']
      },
      ko: {
        question: '세계에서 가장 큰 사막은 무엇입니까?',
        options: { a: '사하라 사막', b: '고비 사막', c: '칼라하리 사막', d: '모하비 사막' },
        explanation: '사하라 사막은 약 900만 평방킬로미터를 덮고 있습니다.',
        tags: ['사막', '아프리카']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which country is known as the Land of the Rising Sun?',
        options: { a: 'China', b: 'Korea', c: 'Japan', d: 'Thailand' },
        explanation: 'Japan is known as the Land of the Rising Sun due to its eastern location.',
        tags: ['countries', 'nicknames']
      },
      ko: {
        question: '"떠오르는 태양의 나라"로 알려진 나라는 어디입니까?',
        options: { a: '중국', b: '한국', c: '일본', d: '태국' },
        explanation: '일본은 동쪽에 위치해 있어 "떠오르는 태양의 나라"로 알려져 있습니다.',
        tags: ['국가', '별명']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which African country is completely surrounded by South Africa?',
        options: { a: 'Botswana', b: 'Swaziland', c: 'Zimbabwe', d: 'Lesotho' },
        explanation: 'Lesotho is entirely surrounded by South Africa.',
        tags: ['africa', 'enclaves']
      },
      ko: {
        question: '남아프리카공화국에 완전히 둘러싸인 아프리카 국가는 어디입니까?',
        options: { a: '보츠와나', b: '에스와티니', c: '짐바브웨', d: '레소토' },
        explanation: '레소토는 남아프리카공화국에 완전히 둘러싸여 있습니다.',
        tags: ['아프리카', '내륙국']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is the smallest country in the world?',
        options: { a: 'Monaco', b: 'Vatican City', c: 'San Marino', d: 'Liechtenstein' },
        explanation: 'Vatican City has an area of only 0.17 square miles.',
        tags: ['countries', 'records']
      },
      ko: {
        question: '세계에서 가장 작은 나라는 어디입니까?',
        options: { a: '모나코', b: '바티칸 시국', c: '산마리노', d: '리히텐슈타인' },
        explanation: '바티칸 시국의 면적은 단지 0.17평방마일입니다.',
        tags: ['국가', '기록']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'hard',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which strait separates Europe and Asia?',
        options: { a: 'Bosphorus', b: 'Gibraltar', c: 'Hormuz', d: 'Malacca' },
        explanation: 'The Bosphorus Strait in Turkey separates Europe and Asia.',
        tags: ['straits', 'continents']
      },
      ko: {
        question: '유럽과 아시아를 분리하는 해협은 무엇입니까?',
        options: { a: '보스포루스 해협', b: '지브롤터 해협', c: '호르무즈 해협', d: '말라카 해협' },
        explanation: '터키의 보스포루스 해협이 유럽과 아시아를 분리합니다.',
        tags: ['해협', '대륙']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which is the deepest point on Earth?',
        options: { a: 'Puerto Rico Trench', b: 'Java Trench', c: 'Mariana Trench', d: 'Peru-Chile Trench' },
        explanation: 'The Mariana Trench reaches depths of about 36,000 feet.',
        tags: ['ocean trenches', 'records']
      },
      ko: {
        question: '지구에서 가장 깊은 곳은 어디입니까?',
        options: { a: '푸에르토리코 해구', b: '자바 해구', c: '마리아나 해구', d: '페루-칠레 해구' },
        explanation: '마리아나 해구는 약 36,000피트(11,000미터)의 깊이에 달합니다.',
        tags: ['해구', '기록']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which city is known as the Big Apple?',
        options: { a: 'Los Angeles', b: 'Chicago', c: 'Boston', d: 'New York' },
        explanation: 'New York City is commonly referred to as the Big Apple.',
        tags: ['cities', 'nicknames']
      },
      ko: {
        question: '"빅 애플"로 알려진 도시는 어디입니까?',
        options: { a: '로스앤젤레스', b: '시카고', c: '보스턴', d: '뉴욕' },
        explanation: '뉴욕시는 일반적으로 "빅 애플"이라고 불립니다.',
        tags: ['도시', '별명']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which country has the longest coastline?',
        options: { a: 'Australia', b: 'Canada', c: 'Russia', d: 'Norway' },
        explanation: 'Canada has the longest coastline in the world at over 200,000 kilometers.',
        tags: ['coastlines', 'records']
      },
      ko: {
        question: '가장 긴 해안선을 가진 나라는 어디입니까?',
        options: { a: '호주', b: '캐나다', c: '러시아', d: '노르웨이' },
        explanation: '캐나다는 20만 킬로미터가 넘는 세계에서 가장 긴 해안선을 가지고 있습니다.',
        tags: ['해안선', '기록']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'hard',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which is the highest waterfall in the world?',
        options: { a: 'Angel Falls', b: 'Niagara Falls', c: 'Victoria Falls', d: 'Iguazu Falls' },
        explanation: 'Angel Falls in Venezuela has a height of 979 meters.',
        tags: ['waterfalls', 'records']
      },
      ko: {
        question: '세계에서 가장 높은 폭포는 무엇입니까?',
        options: { a: '엔젤 폭포', b: '나이아가라 폭포', c: '빅토리아 폭포', d: '이과수 폭포' },
        explanation: '베네수엘라의 엔젤 폭포는 높이가 979미터입니다.',
        tags: ['폭포', '기록']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which continent has no countries?',
        options: { a: 'Asia', b: 'Australia', c: 'Antarctica', d: 'Europe' },
        explanation: 'Antarctica has no permanent residents or countries.',
        tags: ['continents', 'antarctica']
      },
      ko: {
        question: '어떤 대륙에는 국가가 없습니까?',
        options: { a: '아시아', b: '호주', c: '남극대륙', d: '유럽' },
        explanation: '남극대륙에는 영구 거주민이나 국가가 없습니다.',
        tags: ['대륙', '남극']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which European capital is known as the City of Light?',
        options: { a: 'London', b: 'Rome', c: 'Madrid', d: 'Paris' },
        explanation: 'Paris is known as the City of Light due to its early adoption of street lighting.',
        tags: ['capitals', 'nicknames']
      },
      ko: {
        question: '"빛의 도시"로 알려진 유럽의 수도는 어디입니까?',
        options: { a: '런던', b: '로마', c: '마드리드', d: '파리' },
        explanation: '파리는 가로등을 일찍 도입해서 "빛의 도시"로 알려져 있습니다.',
        tags: ['수도', '별명']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which country is shaped like a boot?',
        options: { a: 'Spain', b: 'Italy', c: 'Greece', d: 'Portugal' },
        explanation: 'Italy is famously shaped like a boot extending into the Mediterranean Sea.',
        tags: ['countries', 'shapes']
      },
      ko: {
        question: '부츠 모양을 한 나라는 어디입니까?',
        options: { a: '스페인', b: '이탈리아', c: '그리스', d: '포르투갈' },
        explanation: '이탈리아는 지중해로 뻗어있는 부츠 모양으로 유명합니다.',
        tags: ['국가', '모양']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'hard',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which lake is the largest by surface area?',
        options: { a: 'Caspian Sea', b: 'Lake Superior', c: 'Lake Victoria', d: 'Lake Baikal' },
        explanation: 'The Caspian Sea, technically a lake, is the largest enclosed body of water.',
        tags: ['lakes', 'records']
      },
      ko: {
        question: '표면적이 가장 큰 호수는 무엇입니까?',
        options: { a: '카스피해', b: '슈피리어호', c: '빅토리아호', d: '바이칼호' },
        explanation: '엄밀히 말해 호수인 카스피해가 가장 큰 내수면입니다.',
        tags: ['호수', '기록']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which U.S. state is closest to Africa?',
        options: { a: 'Florida', b: 'New York', c: 'Maine', d: 'California' },
        explanation: 'Maine is the U.S. state closest to Africa.',
        tags: ['united states', 'distances']
      },
      ko: {
        question: '아프리카와 가장 가까운 미국 주는 어디입니까?',
        options: { a: '플로리다', b: '뉴욕', c: '메인', d: '캘리포니아' },
        explanation: '메인주가 아프리카와 가장 가까운 미국 주입니다.',
        tags: ['미국', '거리']
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
        question: 'What is the longest mountain range in the world?',
        options: { a: 'Andes', b: 'Himalayas', c: 'Rocky Mountains', d: 'Alps' },
        explanation: 'The Andes mountain range extends about 7,000 kilometers along South America.',
        tags: ['mountains', 'records']
      },
      ko: {
        question: '세계에서 가장 긴 산맥은 무엇입니까?',
        options: { a: '안데스산맥', b: '히말라야산맥', c: '로키산맥', d: '알프스산맥' },
        explanation: '안데스산맥은 남아메리카를 따라 약 7,000킬로미터 뻗어있습니다.',
        tags: ['산', '기록']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which country has both Atlantic and Pacific coastlines?',
        options: { a: 'Mexico', b: 'Colombia', c: 'Chile', d: 'Brazil' },
        explanation: 'Colombia has coastlines on both the Atlantic (Caribbean) and Pacific oceans.',
        tags: ['coastlines', 'south america']
      },
      ko: {
        question: '대서양과 태평양 해안선을 모두 가진 나라는 어디입니까?',
        options: { a: '멕시코', b: '콜롬비아', c: '칠레', d: '브라질' },
        explanation: '콜롬비아는 대서양(카리브해)과 태평양 해안선을 모두 가지고 있습니다.',
        tags: ['해안선', '남아메리카']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'hard',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which is the most linguistically diverse country?',
        options: { a: 'India', b: 'Indonesia', c: 'Nigeria', d: 'Papua New Guinea' },
        explanation: 'Papua New Guinea has over 800 languages, the most in the world.',
        tags: ['languages', 'diversity']
      },
      ko: {
        question: '언어적으로 가장 다양한 나라는 어디입니까?',
        options: { a: '인도', b: '인도네시아', c: '나이지리아', d: '파푸아뉴기니' },
        explanation: '파푸아뉴기니는 800개가 넘는 언어를 사용하는 세계에서 가장 언어가 다양한 나라입니다.',
        tags: ['언어', '다양성']
      }
    },
    isActive: true
  },
  {
    category: 'geography',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which sea is the saltiest?',
        options: { a: 'Mediterranean Sea', b: 'Black Sea', c: 'Dead Sea', d: 'Red Sea' },
        explanation: 'The Dead Sea has a salinity of about 34%, making it the saltiest body of water.',
        tags: ['seas', 'salinity']
      },
      ko: {
        question: '가장 짠 바다는 어디입니까?',
        options: { a: '지중해', b: '흑해', c: '사해', d: '홍해' },
        explanation: '사해는 약 34%의 염도를 가져 가장 짠 수역입니다.',
        tags: ['바다', '염도']
      }
    },
    isActive: true
  },

  // ARTS & LITERATURE QUESTIONS (15 questions)
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
  {
    category: 'arts',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which artist cut off his ear?',
        options: { a: 'Pablo Picasso', b: 'Claude Monet', c: 'Vincent van Gogh', d: 'Salvador Dalí' },
        explanation: 'Vincent van Gogh cut off part of his ear in 1888.',
        tags: ['post-impressionism', 'biography']
      },
      ko: {
        question: '자신의 귀를 자른 화가는 누구입니까?',
        options: { a: '파블로 피카소', b: '클로드 모네', c: '빈센트 반 고흐', d: '살바도르 달리' },
        explanation: '빈센트 반 고흐가 1888년에 자신의 귀 일부를 잘랐습니다.',
        tags: ['후기인상파', '전기']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which novel begins with "It was the best of times, it was the worst of times"?',
        options: { a: 'Great Expectations', b: 'A Tale of Two Cities', c: 'Oliver Twist', d: 'David Copperfield' },
        explanation: 'A Tale of Two Cities by Charles Dickens begins with this famous line.',
        tags: ['literature', 'dickens']
      },
      ko: {
        question: '"최고의 시대였고, 최악의 시대였다"로 시작하는 소설은 무엇입니까?',
        options: { a: '위대한 유산', b: '두 도시 이야기', c: '올리버 트위스트', d: '데이비드 코퍼필드' },
        explanation: '찰스 디킨스의 "두 도시 이야기"가 이 유명한 문구로 시작합니다.',
        tags: ['문학', '디킨스']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'medium',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who composed "The Four Seasons"?',
        options: { a: 'Wolfgang Amadeus Mozart', b: 'Johann Sebastian Bach', c: 'Ludwig van Beethoven', d: 'Antonio Vivaldi' },
        explanation: 'Antonio Vivaldi composed "The Four Seasons" around 1720.',
        tags: ['classical music', 'baroque']
      },
      ko: {
        question: '"사계"를 작곡한 사람은 누구입니까?',
        options: { a: '볼프강 아마데우스 모차르트', b: '요한 제바스티안 바흐', c: '루트비히 반 베토벤', d: '안토니오 비발디' },
        explanation: '안토니오 비발디가 1720년경에 "사계"를 작곡했습니다.',
        tags: ['클래식 음악', '바로크']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'hard',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which artist painted "Guernica"?',
        options: { a: 'Pablo Picasso', b: 'Henri Matisse', c: 'Georges Braque', d: 'Juan Miró' },
        explanation: 'Pablo Picasso painted "Guernica" in 1937 as a response to the bombing of Guernica.',
        tags: ['cubism', 'modern art']
      },
      ko: {
        question: '"게르니카"를 그린 화가는 누구입니까?',
        options: { a: '파블로 피카소', b: '앙리 마티스', c: '조르주 브라크', d: '후안 미로' },
        explanation: '파블로 피카소가 게르니카 폭격에 대한 응답으로 1937년에 "게르니카"를 그렸습니다.',
        tags: ['큐비즘', '현대 미술']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who wrote "Pride and Prejudice"?',
        options: { a: 'Charlotte Brontë', b: 'Emily Brontë', c: 'Jane Austen', d: 'George Eliot' },
        explanation: 'Jane Austen wrote "Pride and Prejudice" in 1813.',
        tags: ['literature', 'british']
      },
      ko: {
        question: '"오만과 편견"을 쓴 작가는 누구입니까?',
        options: { a: '샬럿 브론테', b: '에밀리 브론테', c: '제인 오스틴', d: '조지 엘리엇' },
        explanation: '제인 오스틴이 1813년에 "오만과 편견"을 썼습니다.',
        tags: ['문학', '영국']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which symphony is known as Beethoven\'s "Choral" symphony?',
        options: { a: 'Symphony No. 5', b: 'Symphony No. 9', c: 'Symphony No. 3', d: 'Symphony No. 7' },
        explanation: 'Beethoven\'s Symphony No. 9 includes the famous "Ode to Joy" choral movement.',
        tags: ['classical music', 'beethoven']
      },
      ko: {
        question: '베토벤의 "합창" 교향곡으로 알려진 것은 무엇입니까?',
        options: { a: '교향곡 5번', b: '교향곡 9번', c: '교향곡 3번', d: '교향곡 7번' },
        explanation: '베토벤의 교향곡 9번에는 유명한 "환희의 송가" 합창 악장이 포함되어 있습니다.',
        tags: ['클래식 음악', '베토벤']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who sculpted "David"?',
        options: { a: 'Leonardo da Vinci', b: 'Raphael', c: 'Donatello', d: 'Michelangelo' },
        explanation: 'Michelangelo sculpted the famous statue of David between 1501 and 1504.',
        tags: ['sculpture', 'renaissance']
      },
      ko: {
        question: '"다비드"상을 조각한 사람은 누구입니까?',
        options: { a: '레오나르도 다 빈치', b: '라파엘', c: '도나텔로', d: '미켈란젤로' },
        explanation: '미켈란젤로가 1501년부터 1504년 사이에 유명한 다비드상을 조각했습니다.',
        tags: ['조각', '르네상스']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'hard',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who wrote "One Hundred Years of Solitude"?',
        options: { a: 'Gabriel García Márquez', b: 'Jorge Luis Borges', c: 'Mario Vargas Llosa', d: 'Pablo Neruda' },
        explanation: 'Gabriel García Márquez wrote this masterpiece of magical realism in 1967.',
        tags: ['literature', 'latin american']
      },
      ko: {
        question: '"백년간의 고독"을 쓴 작가는 누구입니까?',
        options: { a: '가브리엘 가르시아 마르케스', b: '호르헤 루이스 보르헤스', c: '마리오 바르가스 요사', d: '파블로 네루다' },
        explanation: '가브리엘 가르시아 마르케스가 1967년에 이 마술적 사실주의 걸작을 썼습니다.',
        tags: ['문학', '라틴 아메리카']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'medium',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which painting technique uses dots of color?',
        options: { a: 'Impressionism', b: 'Cubism', c: 'Pointillism', d: 'Surrealism' },
        explanation: 'Pointillism uses small dots of color that blend in the viewer\'s eye.',
        tags: ['art techniques', 'post-impressionism']
      },
      ko: {
        question: '색깔의 점들을 사용하는 회화 기법은 무엇입니까?',
        options: { a: '인상주의', b: '큐비즘', c: '점묘법', d: '초현실주의' },
        explanation: '점묘법은 보는 사람의 눈에서 혼합되는 작은 색점들을 사용합니다.',
        tags: ['미술 기법', '후기인상파']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who wrote "1984"?',
        options: { a: 'Aldous Huxley', b: 'George Orwell', c: 'Ray Bradbury', d: 'H.G. Wells' },
        explanation: 'George Orwell wrote the dystopian novel "1984" in 1948.',
        tags: ['literature', 'dystopian']
      },
      ko: {
        question: '"1984"를 쓴 작가는 누구입니까?',
        options: { a: '올더스 헉슬리', b: '조지 오웰', c: '레이 브래드버리', d: 'H.G. 웰스' },
        explanation: '조지 오웰이 1948년에 디스토피아 소설 "1984"를 썼습니다.',
        tags: ['문학', '디스토피아']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'hard',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which architect designed the Guggenheim Museum in New York?',
        options: { a: 'Le Corbusier', b: 'Mies van der Rohe', c: 'Walter Gropius', d: 'Frank Lloyd Wright' },
        explanation: 'Frank Lloyd Wright designed the distinctive spiral-shaped Guggenheim Museum.',
        tags: ['architecture', 'museums']
      },
      ko: {
        question: '뉴욕의 구겐하임 미술관을 설계한 건축가는 누구입니까?',
        options: { a: '르 코르뷔지에', b: '미스 반 데어 로에', c: '발터 그로피우스', d: '프랭크 로이드 라이트' },
        explanation: '프랭크 로이드 라이트가 특징적인 나선형 구겐하임 미술관을 설계했습니다.',
        tags: ['건축', '미술관']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who composed "The Magic Flute"?',
        options: { a: 'Wolfgang Amadeus Mozart', b: 'Ludwig van Beethoven', c: 'Franz Schubert', d: 'Joseph Haydn' },
        explanation: 'Mozart composed "The Magic Flute" in 1791, shortly before his death.',
        tags: ['opera', 'classical music']
      },
      ko: {
        question: '"마술 피리"를 작곡한 사람은 누구입니까?',
        options: { a: '볼프강 아마데우스 모차르트', b: '루트비히 반 베토벤', c: '프란츠 슈베르트', d: '요제프 하이든' },
        explanation: '모차르트가 죽기 얼마 전인 1791년에 "마술 피리"를 작곡했습니다.',
        tags: ['오페라', '클래식 음악']
      }
    },
    isActive: true
  },
  {
    category: 'arts',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who wrote "To Kill a Mockingbird"?',
        options: { a: 'Truman Capote', b: 'Flannery O\'Connor', c: 'Harper Lee', d: 'Tennessee Williams' },
        explanation: 'Harper Lee wrote "To Kill a Mockingbird" in 1960.',
        tags: ['literature', 'american']
      },
      ko: {
        question: '"앵무새 죽이기"를 쓴 작가는 누구입니까?',
        options: { a: '트루먼 카포티', b: '플래너리 오코너', c: '하퍼 리', d: '테네시 윌리엄스' },
        explanation: '하퍼 리가 1960년에 "앵무새 죽이기"를 썼습니다.',
        tags: ['문학', '미국']
      }
    },
    isActive: true
  },

  // SPORTS & ENTERTAINMENT QUESTIONS (5 questions)
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
  {
    category: 'sports',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which sport is known as "the beautiful game"?',
        options: { a: 'Basketball', b: 'Soccer/Football', c: 'Tennis', d: 'Baseball' },
        explanation: 'Soccer (football) is often called "the beautiful game".',
        tags: ['soccer', 'nicknames']
      },
      ko: {
        question: '"아름다운 게임"으로 알려진 스포츠는 무엇입니까?',
        options: { a: '농구', b: '축구', c: '테니스', d: '야구' },
        explanation: '축구는 종종 "아름다운 게임"이라고 불립니다.',
        tags: ['축구', '별명']
      }
    },
    isActive: true
  },
  {
    category: 'sports',
    difficulty: 'easy',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'How many players are on a basketball team on the court?',
        options: { a: '6', b: '4', c: '5', d: '7' },
        explanation: 'Each basketball team has 5 players on the court at a time.',
        tags: ['basketball', 'rules']
      },
      ko: {
        question: '농구 경기에서 코트에 있는 한 팀의 선수는 몇 명입니까?',
        options: { a: '6명', b: '4명', c: '5명', d: '7명' },
        explanation: '각 농구팀은 한 번에 코트에 5명의 선수가 있습니다.',
        tags: ['농구', '규칙']
      }
    },
    isActive: true
  },
  {
    category: 'sports',
    difficulty: 'hard',
    correctAnswer: 'd',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which country has won the most FIFA World Cups?',
        options: { a: 'Germany', b: 'Argentina', c: 'Italy', d: 'Brazil' },
        explanation: 'Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).',
        tags: ['soccer', 'world cup']
      },
      ko: {
        question: 'FIFA 월드컵을 가장 많이 우승한 나라는 어디입니까?',
        options: { a: '독일', b: '아르헨티나', c: '이탈리아', d: '브라질' },
        explanation: '브라질이 FIFA 월드컵을 5회 우승했습니다(1958, 1962, 1970, 1994, 2002).',
        tags: ['축구', '월드컵']
      }
    },
    isActive: true
  },
  {
    category: 'sports',
    difficulty: 'medium',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Which tennis tournament is played on grass courts?',
        options: { a: 'Wimbledon', b: 'French Open', c: 'US Open', d: 'Australian Open' },
        explanation: 'Wimbledon is the only Grand Slam tennis tournament played on grass courts.',
        tags: ['tennis', 'grand slam']
      },
      ko: {
        question: '잔디 코트에서 열리는 테니스 대회는 무엇입니까?',
        options: { a: '윔블던', b: '프랑스 오픈', c: 'US 오픈', d: '호주 오픈' },
        explanation: '윔블던은 잔디 코트에서 열리는 유일한 그랜드 슬램 테니스 대회입니다.',
        tags: ['테니스', '그랜드 슬램']
      }
    },
    isActive: true
  },

  // TECHNOLOGY & MODERN LIFE QUESTIONS (3 questions)
  {
    category: 'technology',
    difficulty: 'easy',
    correctAnswer: 'a',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What does WWW stand for?',
        options: { a: 'World Wide Web', b: 'World Wide Wire', c: 'Web Wide World', d: 'Wide World Web' },
        explanation: 'WWW stands for World Wide Web, invented by Tim Berners-Lee.',
        tags: ['internet', 'technology']
      },
      ko: {
        question: 'WWW는 무엇의 약자입니까?',
        options: { a: '월드 와이드 웹', b: '월드 와이드 와이어', c: '웹 와이드 월드', d: '와이드 월드 웹' },
        explanation: 'WWW는 팀 버너스리가 발명한 월드 와이드 웹의 약자입니다.',
        tags: ['인터넷', '기술']
      }
    },
    isActive: true
  },
  {
    category: 'technology',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'Who founded Microsoft?',
        options: { a: 'Steve Jobs', b: 'Bill Gates', c: 'Mark Zuckerberg', d: 'Larry Page' },
        explanation: 'Bill Gates co-founded Microsoft with Paul Allen in 1975.',
        tags: ['companies', 'founders']
      },
      ko: {
        question: '마이크로소프트를 창립한 사람은 누구입니까?',
        options: { a: '스티브 잡스', b: '빌 게이츠', c: '마크 저커버그', d: '래리 페이지' },
        explanation: '빌 게이츠가 폴 앨런과 함께 1975년에 마이크로소프트를 공동 창립했습니다.',
        tags: ['회사', '창립자']
      }
    },
    isActive: true
  },
  {
    category: 'technology',
    difficulty: 'hard',
    correctAnswer: 'c',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What does "AI" stand for in technology?',
        options: { a: 'Automatic Intelligence', b: 'Advanced Internet', c: 'Artificial Intelligence', d: 'Applied Innovation' },
        explanation: 'AI stands for Artificial Intelligence, the simulation of human intelligence in machines.',
        tags: ['artificial intelligence', 'computing']
      },
      ko: {
        question: '기술에서 "AI"는 무엇의 약자입니까?',
        options: { a: 'Automatic Intelligence', b: 'Advanced Internet', c: 'Artificial Intelligence', d: 'Applied Innovation' },
        explanation: 'AI는 기계에서 인간 지능을 시뮬레이션하는 인공지능(Artificial Intelligence)의 약자입니다.',
        tags: ['인공지능', '컴퓨팅']
      }
    },
    isActive: true
  },

  // MATHEMATICS QUESTIONS (2 questions)
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
  },
  {
    category: 'math',
    difficulty: 'medium',
    correctAnswer: 'b',
    defaultLanguage: 'en',
    availableLanguages: ['en', 'ko'],
    translations: {
      en: {
        question: 'What is 15% of 200?',
        options: { a: '25', b: '30', c: '35', d: '40' },
        explanation: '15% of 200 = 0.15 × 200 = 30.',
        tags: ['mathematics', 'percentages']
      },
      ko: {
        question: '200의 15%는 얼마입니까?',
        options: { a: '25', b: '30', c: '35', d: '40' },
        explanation: '200의 15% = 0.15 × 200 = 30입니다.',
        tags: ['수학', '백분율']
      }
    },
    isActive: true
  }
];

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = hundredQuestions;
}

if (typeof window !== 'undefined') {
  window.hundredQuestions = hundredQuestions;
}

console.log(`Generated ${hundredQuestions.length} comprehensive multilingual questions`);
console.log('Categories breakdown:');
const categoryCount = {};
hundredQuestions.forEach(q => {
  categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
});
Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`- ${category}: ${count} questions`);
});
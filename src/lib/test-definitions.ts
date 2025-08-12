// Test definitions and question structures
export interface TestQuestion {
  id: string;
  text_key: string;
  type: 'multiple_choice' | 'scale' | 'text';
  options?: TestOption[];
  scale?: {
    min: number;
    max: number;
    minLabel_key: string;
    maxLabel_key: string;
  };
}

export interface TestOption {
  value: string | number;
  text_key: string;
  points?: { [trait: string]: number };
}

export interface TestDefinition {
  id: string;
  category: 'know-yourself' | 'how-others-see-me' | 'couple-compatibility';
  title_key: string;
  description_key: string;
  questions: TestQuestion[];
  scoring: ScoringFunction;
  requiresFeedback?: boolean;
  isCompatibilityTest?: boolean;
}

export type ScoringFunction = (answers: { [questionId: string]: any }) => TestResult;

export interface TestResult {
  scores: { [trait: string]: number | any };
  type?: string;
  description_key?: string;
  traits?: string[];
  recommendations?: string[];
  dimensions?: { [key: string]: { preference: string; strength: number } };
}

// 20-question MBTI test with forced-choice pairs (5 questions per dimension)
const fullMbtiQuestions: TestQuestion[] = [
  // Extroversion vs Introversion (E/I)
  {
    id: 'mbti_1',
    text_key: 'tests.mbti.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 'E', text_key: 'tests.mbti.options.q1_a', points: { E: 1 } },
      { value: 'I', text_key: 'tests.mbti.options.q1_b', points: { I: 1 } }
    ]
  },
  {
    id: 'mbti_5',
    text_key: 'tests.mbti.questions.q5',
    type: 'multiple_choice',
    options: [
      { value: 'E', text_key: 'tests.mbti.options.q5_a', points: { E: 1 } },
      { value: 'I', text_key: 'tests.mbti.options.q5_b', points: { I: 1 } }
    ]
  },
  {
    id: 'mbti_9',
    text_key: 'tests.mbti.questions.q9',
    type: 'multiple_choice',
    options: [
      { value: 'E', text_key: 'tests.mbti.options.q9_a', points: { E: 1 } },
      { value: 'I', text_key: 'tests.mbti.options.q9_b', points: { I: 1 } }
    ]
  },
  {
    id: 'mbti_13',
    text_key: 'tests.mbti.questions.q13',
    type: 'multiple_choice',
    options: [
      { value: 'E', text_key: 'tests.mbti.options.q13_a', points: { E: 1 } },
      { value: 'I', text_key: 'tests.mbti.options.q13_b', points: { I: 1 } }
    ]
  },
  {
    id: 'mbti_17',
    text_key: 'tests.mbti.questions.q17',
    type: 'multiple_choice',
    options: [
      { value: 'E', text_key: 'tests.mbti.options.q17_a', points: { E: 1 } },
      { value: 'I', text_key: 'tests.mbti.options.q17_b', points: { I: 1 } }
    ]
  },
  // Sensing vs Intuition (S/N)
  {
    id: 'mbti_2',
    text_key: 'tests.mbti.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: 'S', text_key: 'tests.mbti.options.q2_a', points: { S: 1 } },
      { value: 'N', text_key: 'tests.mbti.options.q2_b', points: { N: 1 } }
    ]
  },
  {
    id: 'mbti_6',
    text_key: 'tests.mbti.questions.q6',
    type: 'multiple_choice',
    options: [
      { value: 'S', text_key: 'tests.mbti.options.q6_a', points: { S: 1 } },
      { value: 'N', text_key: 'tests.mbti.options.q6_b', points: { N: 1 } }
    ]
  },
  {
    id: 'mbti_10',
    text_key: 'tests.mbti.questions.q10',
    type: 'multiple_choice',
    options: [
      { value: 'S', text_key: 'tests.mbti.options.q10_a', points: { S: 1 } },
      { value: 'N', text_key: 'tests.mbti.options.q10_b', points: { N: 1 } }
    ]
  },
  {
    id: 'mbti_14',
    text_key: 'tests.mbti.questions.q14',
    type: 'multiple_choice',
    options: [
      { value: 'S', text_key: 'tests.mbti.options.q14_a', points: { S: 1 } },
      { value: 'N', text_key: 'tests.mbti.options.q14_b', points: { N: 1 } }
    ]
  },
  {
    id: 'mbti_18',
    text_key: 'tests.mbti.questions.q18',
    type: 'multiple_choice',
    options: [
      { value: 'S', text_key: 'tests.mbti.options.q18_a', points: { S: 1 } },
      { value: 'N', text_key: 'tests.mbti.options.q18_b', points: { N: 1 } }
    ]
  },
  // Thinking vs Feeling (T/F)
  {
    id: 'mbti_3',
    text_key: 'tests.mbti.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: 'T', text_key: 'tests.mbti.options.q3_a', points: { T: 1 } },
      { value: 'F', text_key: 'tests.mbti.options.q3_b', points: { F: 1 } }
    ]
  },
  {
    id: 'mbti_7',
    text_key: 'tests.mbti.questions.q7',
    type: 'multiple_choice',
    options: [
      { value: 'T', text_key: 'tests.mbti.options.q7_a', points: { T: 1 } },
      { value: 'F', text_key: 'tests.mbti.options.q7_b', points: { F: 1 } }
    ]
  },
  {
    id: 'mbti_11',
    text_key: 'tests.mbti.questions.q11',
    type: 'multiple_choice',
    options: [
      { value: 'T', text_key: 'tests.mbti.options.q11_a', points: { T: 1 } },
      { value: 'F', text_key: 'tests.mbti.options.q11_b', points: { F: 1 } }
    ]
  },
  {
    id: 'mbti_15',
    text_key: 'tests.mbti.questions.q15',
    type: 'multiple_choice',
    options: [
      { value: 'T', text_key: 'tests.mbti.options.q15_a', points: { T: 1 } },
      { value: 'F', text_key: 'tests.mbti.options.q15_b', points: { F: 1 } }
    ]
  },
  {
    id: 'mbti_19',
    text_key: 'tests.mbti.questions.q19',
    type: 'multiple_choice',
    options: [
      { value: 'T', text_key: 'tests.mbti.options.q19_a', points: { T: 1 } },
      { value: 'F', text_key: 'tests.mbti.options.q19_b', points: { F: 1 } }
    ]
  },
  // Judging vs Perceiving (J/P)
  {
    id: 'mbti_4',
    text_key: 'tests.mbti.questions.q4',
    type: 'multiple_choice',
    options: [
      { value: 'J', text_key: 'tests.mbti.options.q4_a', points: { J: 1 } },
      { value: 'P', text_key: 'tests.mbti.options.q4_b', points: { P: 1 } }
    ]
  },
  {
    id: 'mbti_8',
    text_key: 'tests.mbti.questions.q8',
    type: 'multiple_choice',
    options: [
      { value: 'J', text_key: 'tests.mbti.options.q8_a', points: { J: 1 } },
      { value: 'P', text_key: 'tests.mbti.options.q8_b', points: { P: 1 } }
    ]
  },
  {
    id: 'mbti_12',
    text_key: 'tests.mbti.questions.q12',
    type: 'multiple_choice',
    options: [
      { value: 'J', text_key: 'tests.mbti.options.q12_a', points: { J: 1 } },
      { value: 'P', text_key: 'tests.mbti.options.q12_b', points: { P: 1 } }
    ]
  },
  {
    id: 'mbti_16',
    text_key: 'tests.mbti.questions.q16',
    type: 'multiple_choice',
    options: [
      { value: 'J', text_key: 'tests.mbti.options.q16_a', points: { J: 1 } },
      { value: 'P', text_key: 'tests.mbti.options.q16_b', points: { P: 1 } }
    ]
  },
  {
    id: 'mbti_20',
    text_key: 'tests.mbti.questions.q20',
    type: 'multiple_choice',
    options: [
      { value: 'J', text_key: 'tests.mbti.options.q20_a', points: { J: 1 } },
      { value: 'P', text_key: 'tests.mbti.options.q20_b', points: { P: 1 } }
    ]
  }
];

const mbtiScoring: ScoringFunction = (answers) => {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const totalQuestions = Object.keys(answers).length;

  // Count the responses for each dimension
  Object.values(answers).forEach((answer) => {
    if (typeof answer === 'string' && scores.hasOwnProperty(answer)) {
      scores[answer as keyof typeof scores]++;
    }
  });

  // Calculate percentages (ensuring at least 50% for the chosen preference)
  const percentages = {
    E: Math.max(50, Math.round((scores.E / (scores.E + scores.I)) * 100)) || 50,
    I: Math.max(50, Math.round((scores.I / (scores.E + scores.I)) * 100)) || 50,
    S: Math.max(50, Math.round((scores.S / (scores.S + scores.N)) * 100)) || 50,
    N: Math.max(50, Math.round((scores.N / (scores.S + scores.N)) * 100)) || 50,
    T: Math.max(50, Math.round((scores.T / (scores.T + scores.F)) * 100)) || 50,
    F: Math.max(50, Math.round((scores.F / (scores.T + scores.F)) * 100)) || 50,
    J: Math.max(50, Math.round((scores.J / (scores.J + scores.P)) * 100)) || 50,
    P: Math.max(50, Math.round((scores.P / (scores.J + scores.P)) * 100)) || 50
  };

  // Determine personality type (highest preference in each dimension)
  const type = 
    (percentages.E >= percentages.I ? 'E' : 'I') +
    (percentages.S >= percentages.N ? 'S' : 'N') +
    (percentages.T >= percentages.F ? 'T' : 'F') +
    (percentages.J >= percentages.P ? 'J' : 'P');

  return {
    scores: percentages,
    type: type,
    description_key: `You are an ${type} personality type!`,
    traits: ['Unique', 'Complex', 'Individual'],
    dimensions: {
      'E/I': { preference: percentages.E >= percentages.I ? 'E' : 'I', strength: Math.max(percentages.E, percentages.I) },
      'S/N': { preference: percentages.S >= percentages.N ? 'S' : 'N', strength: Math.max(percentages.S, percentages.N) },
      'T/F': { preference: percentages.T >= percentages.F ? 'T' : 'F', strength: Math.max(percentages.T, percentages.F) },
      'J/P': { preference: percentages.J >= percentages.P ? 'J' : 'P', strength: Math.max(percentages.J, percentages.P) }
    }
  };
};

// Big Five Personality Test Questions
const bigFiveQuestions: TestQuestion[] = [
  {
    id: 'bigfive_1',
    text_key: 'tests.bigfive.questions.q1',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_2',
    text_key: 'tests.bigfive.questions.q2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_3',
    text_key: 'tests.bigfive.questions.q3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_4',
    text_key: 'tests.bigfive.questions.q4',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_5',
    text_key: 'tests.bigfive.questions.q5',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  }
];

const bigFiveScoring: ScoringFunction = (answers) => {
  const traits = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  // Simple scoring logic for demonstration
  Object.values(answers).forEach((score, index) => {
    const traitNames = Object.keys(traits);
    const trait = traitNames[index % traitNames.length];
    traits[trait as keyof typeof traits] += (score as number);
  });

  return {
    scores: traits,
    type: 'Big Five Profile',
    description_key: 'Your Big Five personality profile',
    traits: Object.keys(traits)
  };
};

// Enneagram Type Test Questions
const enneagramQuestions: TestQuestion[] = [
  {
    id: 'enneagram_1',
    text_key: 'tests.enneagram.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 1, text_key: 'tests.enneagram.options.q1_a' },
      { value: 2, text_key: 'tests.enneagram.options.q1_b' },
      { value: 3, text_key: 'tests.enneagram.options.q1_c' }
    ]
  },
  {
    id: 'enneagram_2',
    text_key: 'tests.enneagram.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: 4, text_key: 'tests.enneagram.options.q2_a' },
      { value: 5, text_key: 'tests.enneagram.options.q2_b' },
      { value: 6, text_key: 'tests.enneagram.options.q2_c' }
    ]
  },
  {
    id: 'enneagram_3',
    text_key: 'tests.enneagram.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: 7, text_key: 'tests.enneagram.options.q3_a' },
      { value: 8, text_key: 'tests.enneagram.options.q3_b' },
      { value: 9, text_key: 'tests.enneagram.options.q3_c' }
    ]
  }
];

const enneagramScoring: ScoringFunction = (answers) => {
  const types = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  
  Object.values(answers).forEach((answer) => {
    if (typeof answer === 'number' && answer >= 1 && answer <= 9) {
      types[answer as keyof typeof types]++;
    }
  });

  const dominantType = Object.entries(types).reduce((max, [type, count]) => 
    count > max.count ? { type: parseInt(type), count } : max, 
    { type: 1, count: 0 }
  );

  return {
    scores: types,
    type: `Type ${dominantType.type}`,
    description_key: `You are Enneagram Type ${dominantType.type}`,
    traits: [`Type ${dominantType.type}`]
  };
};

// 360 Feedback Test Questions
const feedback360Questions: TestQuestion[] = [
  {
    id: 'feedback_1',
    text_key: 'tests.feedback360.questions.q1',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.never',
      maxLabel_key: 'tests.feedback360.scale.always'
    }
  },
  {
    id: 'feedback_2',
    text_key: 'tests.feedback360.questions.q2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.never',
      maxLabel_key: 'tests.feedback360.scale.always'
    }
  },
  {
    id: 'feedback_3',
    text_key: 'tests.feedback360.questions.q3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.never',
      maxLabel_key: 'tests.feedback360.scale.always'
    }
  }
];

const feedback360Scoring: ScoringFunction = (answers) => {
  const areas = {
    leadership: 0,
    communication: 0,
    teamwork: 0
  };

  Object.values(answers).forEach((score, index) => {
    const areaNames = Object.keys(areas);
    const area = areaNames[index % areaNames.length];
    areas[area as keyof typeof areas] += (score as number);
  });

  return {
    scores: areas,
    type: '360 Feedback Profile',
    description_key: 'Your 360-degree feedback results',
    traits: Object.keys(areas)
  };
};

// Couple Compatibility Test Questions
const coupleCompatibilityQuestions: TestQuestion[] = [
  {
    id: 'couple_1',
    text_key: 'tests.couple.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 'quality_time', text_key: 'tests.couple.options.q1_a' },
      { value: 'physical_touch', text_key: 'tests.couple.options.q1_b' },
      { value: 'words_affirmation', text_key: 'tests.couple.options.q1_c' },
      { value: 'acts_service', text_key: 'tests.couple.options.q1_d' },
      { value: 'gifts', text_key: 'tests.couple.options.q1_e' }
    ]
  },
  {
    id: 'couple_2',
    text_key: 'tests.couple.questions.q2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.couple.scale.not_important',
      maxLabel_key: 'tests.couple.scale.very_important'
    }
  },
  {
    id: 'couple_3',
    text_key: 'tests.couple.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: 'adventure', text_key: 'tests.couple.options.q3_a' },
      { value: 'stability', text_key: 'tests.couple.options.q3_b' },
      { value: 'growth', text_key: 'tests.couple.options.q3_c' },
      { value: 'harmony', text_key: 'tests.couple.options.q3_d' }
    ]
  }
];

const coupleCompatibilityScoring: ScoringFunction = (answers) => {
  const compatibility = {
    love_language: '',
    communication_style: 0,
    relationship_values: ''
  };

  // Extract love language from first question
  if (answers['couple_1']) {
    compatibility.love_language = answers['couple_1'];
  }

  // Communication importance from second question
  if (answers['couple_2']) {
    compatibility.communication_style = answers['couple_2'];
  }

  // Relationship values from third question
  if (answers['couple_3']) {
    compatibility.relationship_values = answers['couple_3'];
  }

  return {
    scores: compatibility,
    type: 'Compatibility Profile',
    description_key: 'Your relationship compatibility profile',
    traits: [compatibility.love_language, compatibility.relationship_values]
  };
};

export const testDefinitions: TestDefinition[] = [
  {
    id: 'mbti-classic',
    category: 'know-yourself',
    title_key: 'tests.mbti.title',
    description_key: 'tests.mbti.description',
    questions: fullMbtiQuestions,
    scoring: mbtiScoring
  },
  {
    id: 'big-five',
    category: 'know-yourself',
    title_key: 'tests.bigfive.title',
    description_key: 'tests.bigfive.description',
    questions: bigFiveQuestions,
    scoring: bigFiveScoring
  },
  {
    id: 'enneagram',
    category: 'know-yourself',
    title_key: 'tests.enneagram.title',
    description_key: 'tests.enneagram.description',
    questions: enneagramQuestions,
    scoring: enneagramScoring
  },
  {
    id: 'feedback-360',
    category: 'how-others-see-me',
    title_key: 'tests.feedback360.title',
    description_key: 'tests.feedback360.description',
    questions: feedback360Questions,
    scoring: feedback360Scoring,
    requiresFeedback: true
  },
  {
    id: 'couple-compatibility',
    category: 'couple-compatibility',
    title_key: 'tests.couple.title',
    description_key: 'tests.couple.description',
    questions: coupleCompatibilityQuestions,
    scoring: coupleCompatibilityScoring,
    isCompatibilityTest: true
  }
];

// Helper functions
export const getTestById = (id: string): TestDefinition | undefined => {
  return testDefinitions.find(test => test.id === id);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(testDefinitions.map(test => test.category)));
};
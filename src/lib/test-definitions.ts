// Test definitions and question structures - Force rebuild for Korean (는) fix
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

export type ScoringFunction = (answers: { [questionId: string]: any }, partnerAnswers?: { [questionId: string]: any }) => TestResult;

// Utility function to personalize questions with user's name
export const personalizeQuestions = (questions: TestQuestion[], userName: string): TestQuestion[] => {
  return questions.map(question => ({
    ...question,
    text_key: question.text_key.replace(/\[NAME\]/g, userName)
  }));
};

export interface TestResult {
  scores: { [trait: string]: number | any };
  type?: string;
  description_key?: string;
  traits?: string[];
  recommendations?: string[];
  dimensions?: { [key: string]: { preference: string; strength: number } };
  compatibilityData?: {
    percentage: number;
    tier: string;
    emoji: string;
    description: string;
    exactMatches: number;
    partialMatches: number;
    totalQuestions: number;
    areaScores: { [area: string]: number };
    isShareable: boolean;
    shareTitle: string;
    shareDescription: string;
    shareHashtags: string[];
    testStatus: string;
  };
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

  // Enhanced personality type descriptions
  const typeDescriptions: { [key: string]: { traits: string[], description: string, strengths: string[], recommendations: string[] } } = {
    'INTJ': {
      traits: ['Strategic', 'Independent', 'Visionary', 'Determined'],
      description: 'The Architect - You are a natural-born strategist with a unique combination of creativity and rationality.',
      strengths: ['Strategic thinking', 'Independence', 'Long-term planning', 'Innovation'],
      recommendations: ['Practice patience with others', 'Share your vision clearly', 'Consider emotional impacts', 'Take breaks to recharge']
    },
    'INTP': {
      traits: ['Analytical', 'Creative', 'Theoretical', 'Independent'],
      description: 'The Thinker - You love exploring ideas and finding logical solutions to complex problems.',
      strengths: ['Abstract thinking', 'Problem-solving', 'Adaptability', 'Objectivity'],
      recommendations: ['Focus on completing projects', 'Practice social skills', 'Set realistic deadlines', 'Share your insights']
    },
    'ENTJ': {
      traits: ['Leadership', 'Strategic', 'Efficient', 'Confident'],
      description: 'The Commander - You are a natural leader who inspires others to achieve ambitious goals.',
      strengths: ['Strategic planning', 'Leadership', 'Efficiency', 'Goal achievement'],
      recommendations: ['Listen to others\' input', 'Show appreciation', 'Consider work-life balance', 'Be patient with slower processes']
    },
    'ENTP': {
      traits: ['Innovative', 'Enthusiastic', 'Strategic', 'Flexible'],
      description: 'The Debater - You thrive on exploring new ideas and inspiring others with your enthusiasm.',
      strengths: ['Innovation', 'Adaptability', 'Communication', 'Strategic thinking'],
      recommendations: ['Follow through on commitments', 'Focus on priorities', 'Consider details', 'Build routine habits']
    },
    'INFJ': {
      traits: ['Insightful', 'Empathetic', 'Idealistic', 'Organized'],
      description: 'The Advocate - You have a unique ability to understand others and inspire positive change.',
      strengths: ['Empathy', 'Vision', 'Organization', 'Creativity'],
      recommendations: ['Set boundaries', 'Take care of yourself', 'Be realistic about timelines', 'Celebrate small wins']
    },
    'INFP': {
      traits: ['Authentic', 'Empathetic', 'Creative', 'Flexible'],
      description: 'The Mediator - You are driven by your values and have a natural talent for understanding people.',
      strengths: ['Authenticity', 'Creativity', 'Empathy', 'Adaptability'],
      recommendations: ['Practice assertiveness', 'Set clear goals', 'Build confidence', 'Share your ideas more']
    },
    'ENFJ': {
      traits: ['Inspirational', 'Empathetic', 'Organized', 'Charismatic'],
      description: 'The Protagonist - You naturally inspire and guide others toward their potential.',
      strengths: ['Leadership', 'Communication', 'Empathy', 'Organization'],
      recommendations: ['Take time for yourself', 'Set personal boundaries', 'Focus on your own needs', 'Accept imperfection']
    },
    'ENFP': {
      traits: ['Enthusiastic', 'Creative', 'Empathetic', 'Flexible'],
      description: 'The Campaigner - You bring energy and creativity to everything you do, inspiring others along the way.',
      strengths: ['Enthusiasm', 'Creativity', 'Communication', 'Adaptability'],
      recommendations: ['Finish what you start', 'Focus on priorities', 'Build consistent habits', 'Pay attention to details']
    },
    'ISTJ': {
      traits: ['Reliable', 'Practical', 'Organized', 'Loyal'],
      description: 'The Logistician - You are the backbone of any organization, bringing stability and reliability.',
      strengths: ['Reliability', 'Organization', 'Attention to detail', 'Loyalty'],
      recommendations: ['Embrace new approaches', 'Express appreciation', 'Take calculated risks', 'Share your expertise']
    },
    'ISFJ': {
      traits: ['Caring', 'Reliable', 'Practical', 'Supportive'],
      description: 'The Protector - You have a natural desire to help others and create harmony in your environment.',
      strengths: ['Empathy', 'Reliability', 'Attention to detail', 'Supportiveness'],
      recommendations: ['Advocate for yourself', 'Set boundaries', 'Take credit for achievements', 'Express your needs']
    },
    'ESTJ': {
      traits: ['Organized', 'Practical', 'Leader', 'Responsible'],
      description: 'The Executive - You excel at organizing people and processes to achieve concrete results.',
      strengths: ['Leadership', 'Organization', 'Efficiency', 'Responsibility'],
      recommendations: ['Listen to different perspectives', 'Show flexibility', 'Appreciate others\' contributions', 'Consider emotional aspects']
    },
    'ESFJ': {
      traits: ['Caring', 'Organized', 'Cooperative', 'Supportive'],
      description: 'The Consul - You bring people together and create supportive, harmonious environments.',
      strengths: ['Cooperation', 'Organization', 'Empathy', 'Supportiveness'],
      recommendations: ['Express your own needs', 'Accept constructive criticism', 'Take time for self-care', 'Embrace change gradually']
    },
    'ISTP': {
      traits: ['Practical', 'Adaptable', 'Analytical', 'Independent'],
      description: 'The Virtuoso - You are a master of tools and techniques, solving problems with quiet efficiency.',
      strengths: ['Problem-solving', 'Adaptability', 'Practical skills', 'Independence'],
      recommendations: ['Communicate your thoughts', 'Plan for the future', 'Consider others\' feelings', 'Share your knowledge']
    },
    'ISFP': {
      traits: ['Artistic', 'Gentle', 'Flexible', 'Authentic'],
      description: 'The Adventurer - You approach life with quiet creativity and a strong sense of personal values.',
      strengths: ['Creativity', 'Adaptability', 'Authenticity', 'Empathy'],
      recommendations: ['Speak up for your ideas', 'Set long-term goals', 'Build confidence', 'Take on leadership roles']
    },
    'ESTP': {
      traits: ['Energetic', 'Practical', 'Spontaneous', 'Friendly'],
      description: 'The Entrepreneur - You live in the moment and excel at adapting to new situations.',
      strengths: ['Adaptability', 'Practicality', 'Social skills', 'Problem-solving'],
      recommendations: ['Think before acting', 'Plan for the future', 'Develop patience', 'Consider long-term consequences']
    },
    'ESFP': {
      traits: ['Enthusiastic', 'Friendly', 'Spontaneous', 'Creative'],
      description: 'The Entertainer - You bring joy and spontaneity to any situation, making life more enjoyable for everyone.',
      strengths: ['Enthusiasm', 'Social skills', 'Creativity', 'Adaptability'],
      recommendations: ['Focus on long-term planning', 'Handle criticism constructively', 'Develop organizational skills', 'Think before speaking']
    }
  };

  const typeInfo = typeDescriptions[type] || {
    traits: ['Unique', 'Individual', 'Complex'],
    description: `You are an ${type} personality type with your own unique strengths and perspectives.`,
    strengths: ['Problem-solving', 'Adaptability', 'Communication'],
    recommendations: ['Continue learning', 'Practice self-awareness', 'Build on your strengths']
  };

  return {
    scores: percentages,
    type: type,
    description_key: typeInfo.description,
    traits: typeInfo.traits,
    strengths: typeInfo.strengths,
    recommendations: typeInfo.recommendations,
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

  // Map each question to specific trait (improved scoring)
  const questionTraitMapping = [
    'extraversion',      // q1: outgoing and sociable
    'conscientiousness', // q2: always prepared and organized  
    'openness',         // q3: open to new experiences
    'agreeableness',    // q4: compassionate and understanding
    'neuroticism'       // q5: remain calm under pressure (reverse scored)
  ];

  // Calculate scores based on answers (1-5 scale)
  Object.entries(answers).forEach(([questionId, score], index) => {
    const trait = questionTraitMapping[index % questionTraitMapping.length];
    let adjustedScore = score as number;
    
    // Reverse score for neuroticism (calm under pressure = low neuroticism)
    if (trait === 'neuroticism') {
      adjustedScore = 6 - adjustedScore; // Reverse 1-5 scale
    }
    
    traits[trait as keyof typeof traits] += adjustedScore;
  });

  // Convert raw scores to percentages (1-5 scale becomes 0-100%)
  const maxScore = 5; // Maximum possible score per question
  const questionsPerTrait = Math.ceil(Object.keys(answers).length / 5);
  const maxPossible = maxScore * questionsPerTrait;
  
  const percentageScores = Object.fromEntries(
    Object.entries(traits).map(([trait, score]) => [
      trait,
      Math.round((score / maxPossible) * 100)
    ])
  );

  return {
    scores: percentageScores,
    type: 'Big Five Profile',
    description_key: 'tests.bigfive.description',
    traits: Object.keys(traits).map(trait => `results.dimensions.${trait}`)
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

// 360 Feedback Test Questions - Personalized & Casual for Friends/Family/Colleagues
// Universal questions for all 360 feedback categories (Questions 1-10)
const universalQuestions: TestQuestion[] = [
  // Big Five Core Dimensions (Q1-5)
  {
    id: 'universal_1',
    text_key: 'tests.feedback360.universal.q1',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'universal_2',
    text_key: 'tests.feedback360.universal.q2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'universal_3',
    text_key: 'tests.feedback360.universal.q3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'universal_4',
    text_key: 'tests.feedback360.universal.q4',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'universal_5',
    text_key: 'tests.feedback360.universal.q5',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  // Core Interpersonal Competencies (Q6-10)
  {
    id: 'universal_6',
    text_key: 'tests.feedback360.universal.q6',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'universal_7',
    text_key: 'tests.feedback360.universal.q7',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'universal_8',
    text_key: 'tests.feedback360.universal.q8',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'universal_9',
    text_key: 'tests.feedback360.universal.q9',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'universal_10',
    text_key: 'tests.feedback360.universal.q10',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  }
];

// Category-specific questions (Questions 11-20 for each category)
const workSpecificQuestions: TestQuestion[] = [
  {
    id: 'work_11',
    text_key: 'tests.feedback360.work.q11',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_12',
    text_key: 'tests.feedback360.work.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_13',
    text_key: 'tests.feedback360.work.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_14',
    text_key: 'tests.feedback360.work.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_15',
    text_key: 'tests.feedback360.work.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_16',
    text_key: 'tests.feedback360.work.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_17',
    text_key: 'tests.feedback360.work.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_18',
    text_key: 'tests.feedback360.work.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_19',
    text_key: 'tests.feedback360.work.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'work_20',
    text_key: 'tests.feedback360.work.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  }
];

// Additional category-specific questions
const friendsSpecificQuestions: TestQuestion[] = [
  {
    id: 'friends_11',
    text_key: 'tests.feedback360.friends.q11',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_12',
    text_key: 'tests.feedback360.friends.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_13',
    text_key: 'tests.feedback360.friends.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_14',
    text_key: 'tests.feedback360.friends.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_15',
    text_key: 'tests.feedback360.friends.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_16',
    text_key: 'tests.feedback360.friends.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_17',
    text_key: 'tests.feedback360.friends.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_18',
    text_key: 'tests.feedback360.friends.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_19',
    text_key: 'tests.feedback360.friends.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'friends_20',
    text_key: 'tests.feedback360.friends.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  }
];

const familySpecificQuestions: TestQuestion[] = [
  {
    id: 'family_11',
    text_key: 'tests.feedback360.family.q11',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_12',
    text_key: 'tests.feedback360.family.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_13',
    text_key: 'tests.feedback360.family.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_14',
    text_key: 'tests.feedback360.family.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_15',
    text_key: 'tests.feedback360.family.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_16',
    text_key: 'tests.feedback360.family.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_17',
    text_key: 'tests.feedback360.family.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_18',
    text_key: 'tests.feedback360.family.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_19',
    text_key: 'tests.feedback360.family.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'family_20',
    text_key: 'tests.feedback360.family.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  }
];

const academicSpecificQuestions: TestQuestion[] = [
  {
    id: 'academic_11',
    text_key: 'tests.feedback360.academic.q11',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_12',
    text_key: 'tests.feedback360.academic.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_13',
    text_key: 'tests.feedback360.academic.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_14',
    text_key: 'tests.feedback360.academic.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_15',
    text_key: 'tests.feedback360.academic.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_16',
    text_key: 'tests.feedback360.academic.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_17',
    text_key: 'tests.feedback360.academic.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_18',
    text_key: 'tests.feedback360.academic.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_19',
    text_key: 'tests.feedback360.academic.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'academic_20',
    text_key: 'tests.feedback360.academic.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  }
];

const generalSpecificQuestions: TestQuestion[] = [
  {
    id: 'general_11',
    text_key: 'tests.feedback360.general.q11',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_12',
    text_key: 'tests.feedback360.general.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_13',
    text_key: 'tests.feedback360.general.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_14',
    text_key: 'tests.feedback360.general.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_15',
    text_key: 'tests.feedback360.general.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_16',
    text_key: 'tests.feedback360.general.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_17',
    text_key: 'tests.feedback360.general.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_18',
    text_key: 'tests.feedback360.general.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_19',
    text_key: 'tests.feedback360.general.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  },
  {
    id: 'general_20',
    text_key: 'tests.feedback360.general.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.feedback360.scale.1',
      maxLabel_key: 'tests.feedback360.scale.5'
    }
  }
];

// Function to get questions based on category
const getFeedback360Questions = (category: string): TestQuestion[] => {
  const categoryQuestions = {
    'work': workSpecificQuestions,
    'friends': friendsSpecificQuestions,
    'family': familySpecificQuestions,
    'academic': academicSpecificQuestions,
    'general': generalSpecificQuestions
  };

  const specificQuestions = categoryQuestions[category as keyof typeof categoryQuestions] || generalSpecificQuestions;
  
  return [...universalQuestions, ...specificQuestions];
};

// Dynamic function to get feedback360 test definition for any category
export const getFeedback360TestDefinition = (category: string): TestDefinition => {
  const questions = getFeedback360Questions(category);
  
  return {
    id: `feedback-360-${category}`,
    category: 'how-others-see-me',
    title_key: 'tests.feedback360.title',
    description_key: 'tests.feedback360.description',
    questions: questions,
    scoring: feedback360Scoring,
    requiresFeedback: true
  };
};

// Default questions for backward compatibility (uses general category)
const feedback360Questions: TestQuestion[] = getFeedback360Questions('general');

const feedback360Scoring: ScoringFunction = (answers) => {
  // Big Five Core Dimensions (Questions 1-5)
  const bigFiveScores = {
    'Emotional Stability': 0, // Q1
    'Extraversion': 0, // Q2  
    'Agreeableness': 0, // Q3
    'Conscientiousness': 0, // Q4
    'Openness': 0 // Q5
  };

  // Core Interpersonal Competencies (Questions 6-10)
  const interpersonalScores = {
    'Communication': 0, // Q6
    'Self-Awareness': 0, // Q7
    'Social Awareness': 0, // Q8
    'Conflict Resolution': 0, // Q9
    'Growth Mindset': 0 // Q10
  };

  // Category-specific competencies (Questions 11-20) - meaningful labels by category
  const categoryScores = {
    'Leadership & Initiative': 0,        // Q11, Q12 - Leadership roles and decision-making  
    'Collaboration & Support': 0,       // Q13, Q14 - Working with others and feedback
    'Innovation & Adaptability': 0,     // Q15, Q16 - New approaches and stress management
    'Communication & Helping': 0,       // Q17, Q18 - Communication and helping others
    'Reliability & Growth': 0           // Q19, Q20 - Completing tasks and personal development
  };

  // Map universal questions (1-10) to Big Five and interpersonal scores
  Object.entries(answers).forEach(([questionId, score]) => {
    const numericScore = score as number;
    
    // Universal questions mapping
    if (questionId === 'universal_1') {
      bigFiveScores['Emotional Stability'] = numericScore;
    } else if (questionId === 'universal_2') {
      bigFiveScores['Extraversion'] = numericScore;
    } else if (questionId === 'universal_3') {
      bigFiveScores['Agreeableness'] = numericScore;
    } else if (questionId === 'universal_4') {
      bigFiveScores['Conscientiousness'] = numericScore;
    } else if (questionId === 'universal_5') {
      bigFiveScores['Openness'] = numericScore;
    } else if (questionId === 'universal_6') {
      interpersonalScores['Communication'] = numericScore;
    } else if (questionId === 'universal_7') {
      interpersonalScores['Self-Awareness'] = numericScore;
    } else if (questionId === 'universal_8') {
      interpersonalScores['Social Awareness'] = numericScore;
    } else if (questionId === 'universal_9') {
      interpersonalScores['Conflict Resolution'] = numericScore;
    } else if (questionId === 'universal_10') {
      interpersonalScores['Growth Mindset'] = numericScore;
    }
    
    // Category-specific questions (11-20) - aggregate for overall category performance
    if (questionId.includes('_11') || questionId.includes('_12') || questionId.includes('_13') || questionId.includes('_14') || questionId.includes('_15') || 
        questionId.includes('_16') || questionId.includes('_17') || questionId.includes('_18') || questionId.includes('_19') || questionId.includes('_20')) {
      
      if (questionId.includes('_11') || questionId.includes('_12')) {
        categoryScores['Leadership & Initiative'] += numericScore;
      } else if (questionId.includes('_13') || questionId.includes('_14')) {
        categoryScores['Collaboration & Support'] += numericScore;
      } else if (questionId.includes('_15') || questionId.includes('_16')) {
        categoryScores['Innovation & Adaptability'] += numericScore;
      } else if (questionId.includes('_17') || questionId.includes('_18')) {
        categoryScores['Communication & Helping'] += numericScore;
      } else if (questionId.includes('_19') || questionId.includes('_20')) {
        categoryScores['Reliability & Growth'] += numericScore;
      }
    }
  });

  // Calculate percentage scores
  const percentageScores: { [key: string]: number } = {};
  
  // Big Five percentages (single question each)
  Object.entries(bigFiveScores).forEach(([trait, score]) => {
    percentageScores[trait] = Math.round((score / 5) * 100);
  });
  
  // Interpersonal percentages (single question each)
  Object.entries(interpersonalScores).forEach(([skill, score]) => {
    percentageScores[skill] = Math.round((score / 5) * 100);
  });
  
  // Category percentages (2 questions each)
  Object.entries(categoryScores).forEach(([area, totalScore]) => {
    const averageScore = totalScore / 2; // 2 questions per category area
    percentageScores[area] = Math.round((averageScore / 5) * 100);
  });

  // Identify strengths and development areas
  const sortedAreas = Object.entries(percentageScores).sort(([,a], [,b]) => b - a);
  const strengths = sortedAreas.slice(0, 5).map(([area]) => area);
  const developmentAreas = sortedAreas.slice(-3).map(([area]) => area);

  return {
    scores: percentageScores,
    type: 'tests.feedback360.title',
    description_key: 'A comprehensive 360-degree assessment evaluating leadership, communication, teamwork, emotional intelligence, problem-solving, adaptability, interpersonal skills, and work style from multiple perspectives.',
    traits: strengths,
    strengths: strengths.map(area => `${area}`),
    recommendations: developmentAreas.map(area => `${area}`)
  };
};

// 💕 Couple Compatibility Test - Updated Questions (15 Questions)
const coupleCompatibilityQuestions: TestQuestion[] = [
  // Lifestyle & Fun (Q1-Q5)
  {
    id: 'couple_1',
    text_key: 'tests.couple.questions.q1', // Ideal Friday night?
    type: 'multiple_choice',
    options: [
      { value: 'movie_chill', text_key: 'tests.couple.options.q1_a' }, // Movie & chill
      { value: 'party_out', text_key: 'tests.couple.options.q1_b' }, // Party out
      { value: 'dinner_date', text_key: 'tests.couple.options.q1_c' }, // Dinner date
      { value: 'gaming', text_key: 'tests.couple.options.q1_d' } // Gaming
    ]
  },
  {
    id: 'couple_2',
    text_key: 'tests.couple.questions.q2', // Dream vacation together?
    type: 'multiple_choice',
    options: [
      { value: 'beach', text_key: 'tests.couple.options.q2_a' }, // Beach
      { value: 'mountains', text_key: 'tests.couple.options.q2_b' }, // Mountains
      { value: 'city_tour', text_key: 'tests.couple.options.q2_c' }, // City tour
      { value: 'staycation', text_key: 'tests.couple.options.q2_d' } // Staycation
    ]
  },
  {
    id: 'couple_3',
    text_key: 'tests.couple.questions.q3', // Favorite way to spend a weekend?
    type: 'multiple_choice',
    options: [
      { value: 'adventure', text_key: 'tests.couple.options.q3_a' }, // Outdoor adventure
      { value: 'culture', text_key: 'tests.couple.options.q3_b' }, // Museums/culture
      { value: 'relax_home', text_key: 'tests.couple.options.q3_c' }, // Relax at home
      { value: 'social', text_key: 'tests.couple.options.q3_d' } // Social events
    ]
  },
  {
    id: 'couple_4',
    text_key: 'tests.couple.questions.q4', // Morning or night person?
    type: 'multiple_choice',
    options: [
      { value: 'early_bird', text_key: 'tests.couple.options.q4_a' }, // Early bird
      { value: 'night_owl', text_key: 'tests.couple.options.q4_b' }, // Night owl
      { value: 'flexible', text_key: 'tests.couple.options.q4_c' } // Flexible
    ]
  },
  {
    id: 'couple_5',
    text_key: 'tests.couple.questions.q5', // How do you like to celebrate special occasions?
    type: 'multiple_choice',
    options: [
      { value: 'big_party', text_key: 'tests.couple.options.q5_a' }, // Big party
      { value: 'intimate', text_key: 'tests.couple.options.q5_b' }, // Intimate dinner
      { value: 'adventure_trip', text_key: 'tests.couple.options.q5_c' }, // Adventure trip
      { value: 'simple_home', text_key: 'tests.couple.options.q5_d' } // Simple at home
    ]
  },

  // Values & Relationships (Q6-Q10)
  {
    id: 'couple_6',
    text_key: 'tests.couple.questions.q6', // What matters most in a relationship?
    type: 'multiple_choice',
    options: [
      { value: 'trust', text_key: 'tests.couple.options.q6_a' }, // Trust
      { value: 'fun', text_key: 'tests.couple.options.q6_b' }, // Fun
      { value: 'communication', text_key: 'tests.couple.options.q6_c' }, // Communication
      { value: 'support', text_key: 'tests.couple.options.q6_d' } // Support
    ]
  },
  {
    id: 'couple_7',
    text_key: 'tests.couple.questions.q7', // How do you handle conflicts?
    type: 'multiple_choice',
    options: [
      { value: 'talk_immediately', text_key: 'tests.couple.options.q7_a' }, // Talk immediately
      { value: 'cool_down_first', text_key: 'tests.couple.options.q7_b' }, // Cool down first
      { value: 'compromise', text_key: 'tests.couple.options.q7_c' }, // Find compromise
      { value: 'avoid', text_key: 'tests.couple.options.q7_d' } // Avoid conflict
    ]
  },
  {
    id: 'couple_8',
    text_key: 'tests.couple.questions.q8', // Your biggest love language?
    type: 'multiple_choice',
    options: [
      { value: 'words', text_key: 'tests.couple.options.q8_a' }, // Words of affirmation
      { value: 'quality_time', text_key: 'tests.couple.options.q8_b' }, // Quality time
      { value: 'physical_touch', text_key: 'tests.couple.options.q8_c' }, // Physical touch
      { value: 'acts_service', text_key: 'tests.couple.options.q8_d' }, // Acts of service
      { value: 'gifts', text_key: 'tests.couple.options.q8_e' } // Gifts
    ]
  },
  {
    id: 'couple_9',
    text_key: 'tests.couple.questions.q9', // How much time together vs apart?
    type: 'multiple_choice',
    options: [
      { value: 'lots_together', text_key: 'tests.couple.options.q9_a' }, // Lots of time together
      { value: 'balanced', text_key: 'tests.couple.options.q9_b' }, // Balanced time
      { value: 'independent', text_key: 'tests.couple.options.q9_c' }, // Need independence
      { value: 'depends_mood', text_key: 'tests.couple.options.q9_d' } // Depends on mood
    ]
  },
  {
    id: 'couple_10',
    text_key: 'tests.couple.questions.q10', // What do you value most in a partner?
    type: 'multiple_choice',
    options: [
      { value: 'humor', text_key: 'tests.couple.options.q10_a' }, // Sense of humor
      { value: 'intelligence', text_key: 'tests.couple.options.q10_b' }, // Intelligence
      { value: 'kindness', text_key: 'tests.couple.options.q10_c' }, // Kindness
      { value: 'ambition', text_key: 'tests.couple.options.q10_d' } // Ambition
    ]
  },

  // Lifestyle Compatibility (Q11-Q15)
  {
    id: 'couple_11',
    text_key: 'tests.couple.questions.q11', // Money philosophy?
    type: 'multiple_choice',
    options: [
      { value: 'save_future', text_key: 'tests.couple.options.q11_a' }, // Save for future
      { value: 'spend_experiences', text_key: 'tests.couple.options.q11_b' }, // Spend on experiences
      { value: 'balanced', text_key: 'tests.couple.options.q11_c' }, // Balanced approach
      { value: 'live_moment', text_key: 'tests.couple.options.q11_d' } // Live in the moment
    ]
  },
  {
    id: 'couple_12',
    text_key: 'tests.couple.questions.q12', // Food preferences?
    type: 'multiple_choice',
    options: [
      { value: 'home_cooking', text_key: 'tests.couple.options.q12_a' }, // Love home cooking
      { value: 'try_restaurants', text_key: 'tests.couple.options.q12_b' }, // Try new restaurants
      { value: 'comfort_food', text_key: 'tests.couple.options.q12_c' }, // Comfort food
      { value: 'healthy_eating', text_key: 'tests.couple.options.q12_d' } // Healthy eating
    ]
  },
  {
    id: 'couple_13',
    text_key: 'tests.couple.questions.q13', // Planning style?
    type: 'multiple_choice',
    options: [
      { value: 'detailed_plans', text_key: 'tests.couple.options.q13_a' }, // Detailed plans
      { value: 'flexible_plans', text_key: 'tests.couple.options.q13_b' }, // Flexible plans
      { value: 'spontaneous', text_key: 'tests.couple.options.q13_c' }, // Spontaneous
      { value: 'go_with_flow', text_key: 'tests.couple.options.q13_d' } // Go with flow
    ]
  },
  {
    id: 'couple_14',
    text_key: 'tests.couple.questions.q14', // Social preferences?
    type: 'multiple_choice',
    options: [
      { value: 'big_groups', text_key: 'tests.couple.options.q14_a' }, // Love big groups
      { value: 'small_circle', text_key: 'tests.couple.options.q14_b' }, // Small circle of friends
      { value: 'just_us_two', text_key: 'tests.couple.options.q14_c' }, // Just us two
      { value: 'varies', text_key: 'tests.couple.options.q14_d' } // Varies by mood
    ]
  },
  {
    id: 'couple_15',
    text_key: 'tests.couple.questions.q15', // Communication style?
    type: 'multiple_choice',
    options: [
      { value: 'direct_honest', text_key: 'tests.couple.options.q15_a' }, // Direct and honest
      { value: 'gentle_supportive', text_key: 'tests.couple.options.q15_b' }, // Gentle and supportive
      { value: 'playful_teasing', text_key: 'tests.couple.options.q15_c' }, // Playful teasing
      { value: 'thoughtful_careful', text_key: 'tests.couple.options.q15_d' } // Thoughtful and careful
    ]
  }
];

// Generate individual personality insights for couple compatibility test
const generatePersonalityInsights = (userPreferences: any) => {
  console.log('🎯 COUPLE COMPATIBILITY DEBUG: generatePersonalityInsights called with:', userPreferences);
  const { lifestyle_fun, values_relationships, lifestyle_compatibility } = userPreferences;
  
  // Analyze lifestyle preferences
  let lifestyleScore = 0;
  let personalityTraits = [];
  let personalityType = '';
  
  // Fun & Lifestyle Analysis
  if (lifestyle_fun.friday_night === 'party_out' || lifestyle_fun.vacation_type === 'city_tour') {
    lifestyleScore += 20;
    personalityTraits.push('Social & Adventurous');
  }
  if (lifestyle_fun.friday_night === 'movie_chill' || lifestyle_fun.weekend_style === 'relax_home') {
    lifestyleScore += 15;
    personalityTraits.push('Comfort-Loving');
  }
  if (lifestyle_fun.weekend_style === 'adventure' || lifestyle_fun.vacation_type === 'mountains') {
    lifestyleScore += 25;
    personalityTraits.push('Adventure Seeker');
  }
  
  // Values Analysis
  if (values_relationships.relationship_priority === 'trust' || values_relationships.conflict_style === 'talk_immediately') {
    lifestyleScore += 20;
    personalityTraits.push('Communicator');
  }
  if (values_relationships.love_language === 'quality_time' || values_relationships.time_together === 'lots_together') {
    lifestyleScore += 15;
    personalityTraits.push('Quality Time Lover');
  }
  if (values_relationships.partner_values === 'humor') {
    personalityTraits.push('Fun-Loving');
  }
  
  // Lifestyle Compatibility Analysis
  if (lifestyle_compatibility.planning_style === 'detailed_plans') {
    personalityTraits.push('Planner');
  }
  if (lifestyle_compatibility.planning_style === 'spontaneous') {
    personalityTraits.push('Spontaneous');
  }
  if (lifestyle_compatibility.money_philosophy === 'save_future') {
    personalityTraits.push('Future-Focused');
  }
  if (lifestyle_compatibility.money_philosophy === 'spend_experiences') {
    personalityTraits.push('Experience-Driven');
  }
  
  // Determine personality type based on dominant traits
  if (personalityTraits.includes('Adventure Seeker') && personalityTraits.includes('Social & Adventurous')) {
    personalityType = 'The Adventurous Partner 🌟';
  } else if (personalityTraits.includes('Communicator') && personalityTraits.includes('Quality Time Lover')) {
    personalityType = 'The Devoted Partner 💕';
  } else if (personalityTraits.includes('Comfort-Loving') && personalityTraits.includes('Planner')) {
    personalityType = 'The Steady Partner 🏠';
  } else if (personalityTraits.includes('Fun-Loving') && personalityTraits.includes('Spontaneous')) {
    personalityType = 'The Spontaneous Partner 🎉';
  } else if (personalityTraits.includes('Future-Focused') && personalityTraits.includes('Planner')) {
    personalityType = 'The Thoughtful Partner 🎯';
  } else {
    personalityType = 'The Balanced Partner ⚖️';
  }
  
  // Calculate compatibility readiness score (how ready they are for a relationship)
  const compatibilityReadiness = Math.min(Math.max(lifestyleScore, 45), 85);
  
  console.log('🎯 PERSONALITY ANALYSIS RESULTS:');
  console.log('   Personality Type:', personalityType);
  console.log('   Compatibility Readiness:', compatibilityReadiness);
  console.log('   Lifestyle Score:', lifestyleScore);
  console.log('   Personality Traits:', personalityTraits);
  
  const result = {
    personalityType,
    personalityScore: compatibilityReadiness,
    compatibilityReadiness,
    traits: personalityTraits.slice(0, 3), // Top 3 traits
    dimensions: {
      adventure: personalityTraits.includes('Adventure Seeker') ? 85 : 45,
      communication: personalityTraits.includes('Communicator') ? 90 : 50,
      planning: personalityTraits.includes('Planner') ? 80 : 40,
      social: personalityTraits.includes('Social & Adventurous') ? 85 : 45,
      stability: personalityTraits.includes('Comfort-Loving') ? 85 : 50 // Fixed bug: was checking wrong trait
    }
  };
  
  console.log('🎯 FINAL RESULT OBJECT:', result);
  return result;
};

const coupleCompatibilityScoring: ScoringFunction = (answers, partnerAnswers?: { [questionId: string]: any }) => {
  console.error('🚨🚨🚨 COUPLE COMPATIBILITY SCORING FUNCTION CALLED! 🚨🚨🚨');
  console.error('Answers received:', answers);
  console.error('Partner answers:', partnerAnswers);
  
  // If no partner answers yet, store user's answers for later comparison
  if (!partnerAnswers) {
    // Single user's answers - store for later comparison with partner
    const userPreferences = {
      lifestyle_fun: {
        friday_night: answers['couple_1'],
        vacation_type: answers['couple_2'],
        weekend_style: answers['couple_3'],
        schedule: answers['couple_4'],
        celebrations: answers['couple_5']
      },
      values_relationships: {
        relationship_priority: answers['couple_6'],
        conflict_style: answers['couple_7'],
        love_language: answers['couple_8'],
        time_together: answers['couple_9'],
        partner_values: answers['couple_10']
      },
      lifestyle_compatibility: {
        money_philosophy: answers['couple_11'],
        food_preferences: answers['couple_12'],
        planning_style: answers['couple_13'],
        social_preferences: answers['couple_14'],
        communication_style: answers['couple_15']
      }
    };

    // Generate individual personality insights based on user's answers
    console.log('🎯 CALLING generatePersonalityInsights with userPreferences:', userPreferences);
    const personalityInsights = generatePersonalityInsights(userPreferences);
    console.log('🎯 RECEIVED personalityInsights:', personalityInsights);
    
    const finalResult = {
      type: personalityInsights.personalityType, // Use translation key: couple.personalityTypes.${personalityType}
      description: `You are ${personalityInsights.personalityType} with ${personalityInsights.compatibilityReadiness}% compatibility readiness. Your key traits: ${personalityInsights.traits.join(', ')}.`,
      scores: {
        'compatibility': personalityInsights.compatibilityReadiness,
        'personality': personalityInsights.personalityScore
      },
      traits: personalityInsights.traits,
      dimensions: {
        'Adventure': { preference: personalityInsights.dimensions.adventure > 65 ? 'High' : 'Moderate', strength: personalityInsights.dimensions.adventure },
        'Communication': { preference: personalityInsights.dimensions.communication > 75 ? 'Strong' : 'Developing', strength: personalityInsights.dimensions.communication },
        'Planning': { preference: personalityInsights.dimensions.planning > 70 ? 'Structured' : 'Flexible', strength: personalityInsights.dimensions.planning },
        'Social': { preference: personalityInsights.dimensions.social > 70 ? 'Outgoing' : 'Reserved', strength: personalityInsights.dimensions.social },
        'Stability': { preference: personalityInsights.dimensions.stability > 70 ? 'Consistent' : 'Adaptable', strength: personalityInsights.dimensions.stability }
      },
      userPreferences,
      awaitingPartner: true, // Flag to show invitation interface
      testStatus: 'awaiting_partner'
    };
    
    console.log('🎯 FINAL COUPLE COMPATIBILITY RESULT:', finalResult);
    return finalResult;
  }

  // Both answers available - calculate compatibility percentage
  let exactMatches = 0;
  let partialMatches = 0;
  const totalQuestions = 15;

  // Enhanced compatibility matrix for partial matches
  const compatibilityMatrix: { [key: string]: { [value: string]: string[] } } = {
    // Lifestyle & Fun - some flexibility in preferences
    couple_1: { // Friday night
      movie_chill: ['dinner_date'],
      party_out: [],
      dinner_date: ['movie_chill'],
      gaming: ['movie_chill']
    },
    couple_2: { // Vacation dreams
      beach: ['staycation'],
      mountains: ['city_tour'],
      city_tour: ['mountains'],
      staycation: ['beach']
    },
    couple_3: { // Weekend activities
      adventure: ['social'],
      culture: ['relax_home'],
      relax_home: ['culture'],
      social: ['adventure']
    },
    couple_4: { // Schedule compatibility
      early_bird: ['flexible'],
      night_owl: ['flexible'],
      flexible: ['early_bird', 'night_owl']
    },
    couple_5: { // Celebrations
      big_party: ['social'],
      intimate: ['simple_home'],
      adventure_trip: [],
      simple_home: ['intimate']
    },
    
    // Values - more important, fewer partial matches
    couple_6: { // Relationship priorities
      trust: ['support'],
      fun: [],
      communication: ['support'],
      support: ['trust', 'communication']
    },
    couple_7: { // Conflict handling
      talk_immediately: ['compromise'],
      cool_down_first: ['compromise'],
      compromise: ['talk_immediately', 'cool_down_first'],
      avoid: []
    },
    couple_8: { // Love languages
      words: [],
      quality_time: [],
      physical_touch: [],
      acts_service: [],
      gifts: []
    },
    couple_9: { // Time together
      lots_together: ['balanced'],
      balanced: ['lots_together', 'depends_mood'],
      independent: [],
      depends_mood: ['balanced']
    },
    couple_10: { // Partner values
      humor: ['kindness'],
      intelligence: ['ambition'],
      kindness: ['humor'],
      ambition: ['intelligence']
    },
    
    // Lifestyle - moderate flexibility
    couple_11: { // Money philosophy
      save_future: ['balanced'],
      spend_experiences: ['live_moment'],
      balanced: ['save_future'],
      live_moment: ['spend_experiences']
    },
    couple_12: { // Food preferences
      home_cooking: ['healthy_eating'],
      try_restaurants: [],
      comfort_food: ['home_cooking'],
      healthy_eating: ['home_cooking']
    },
    couple_13: { // Planning style
      detailed_plans: ['flexible_plans'],
      flexible_plans: ['detailed_plans', 'go_with_flow'],
      spontaneous: ['go_with_flow'],
      go_with_flow: ['flexible_plans', 'spontaneous']
    },
    couple_14: { // Social preferences
      big_groups: [],
      small_circle: ['varies'],
      just_us_two: [],
      varies: ['small_circle']
    },
    couple_15: { // Communication style
      direct_honest: ['thoughtful_careful'],
      gentle_supportive: ['thoughtful_careful'],
      playful_teasing: [],
      thoughtful_careful: ['direct_honest', 'gentle_supportive']
    }
  };

  // Calculate matches with weighted importance
  const questionWeights = {
    // Values questions are more important (weight 1.5)
    couple_6: 1.5, couple_7: 1.5, couple_8: 1.5, couple_9: 1.2, couple_10: 1.2,
    // Lifestyle questions (weight 1.0)
    couple_1: 1.0, couple_2: 1.0, couple_3: 1.0, couple_4: 1.0, couple_5: 1.0,
    couple_11: 1.0, couple_12: 1.0, couple_13: 1.0, couple_14: 1.0, couple_15: 1.0
  };

  let weightedExactScore = 0;
  let weightedPartialScore = 0;
  let totalWeight = 0;

  // Compare each answer with weights
  for (let i = 1; i <= totalQuestions; i++) {
    const questionId = `couple_${i}`;
    const weight = questionWeights[questionId as keyof typeof questionWeights] || 1.0;
    const userAnswer = answers[questionId];
    const partnerAnswer = partnerAnswers[questionId];

    totalWeight += weight;

    if (userAnswer === partnerAnswer) {
      exactMatches++;
      weightedExactScore += weight;
    } else if (compatibilityMatrix[questionId]?.[userAnswer]?.includes(partnerAnswer)) {
      partialMatches++;
      weightedPartialScore += weight * 0.5; // Partial matches worth 50% of weight
    }
  }

  // Calculate weighted compatibility percentage
  const compatibilityPercentage = Math.min(Math.round(((weightedExactScore + weightedPartialScore) / totalWeight) * 100), 100);

  // Fun result tiers with personality combo descriptions
  let compatibilityTier = '';
  let compatibilityDescription = '';
  let compatibilityEmoji = '';
  
  if (compatibilityPercentage >= 95) {
    compatibilityTier = 'Soulmates';
    compatibilityEmoji = '💍';
    compatibilityDescription = 'You two are a perfect balance of fun, trust, and love. Destined to be together!';
  } else if (compatibilityPercentage >= 85) {
    compatibilityTier = 'Power Couple';
    compatibilityEmoji = '⚡';
    compatibilityDescription = 'You complement each other beautifully and tackle life as an amazing team.';
  } else if (compatibilityPercentage >= 75) {
    compatibilityTier = 'Adventurous Duo';
    compatibilityEmoji = '🌍';
    compatibilityDescription = 'Sometimes different, but always exciting. Your differences spark adventure!';
  } else if (compatibilityPercentage >= 65) {
    compatibilityTier = 'Sweet Match';
    compatibilityEmoji = '💕';
    compatibilityDescription = 'You have wonderful chemistry with some beautiful differences to explore.';
  } else if (compatibilityPercentage >= 50) {
    compatibilityTier = 'Work in Progress';
    compatibilityEmoji = '🔨';
    compatibilityDescription = 'You balance each other in some ways, but need to align more on key values.';
  } else if (compatibilityPercentage >= 35) {
    compatibilityTier = 'Learning Together';
    compatibilityEmoji = '📚';
    compatibilityDescription = 'Lots of growth opportunities ahead. Communication will be key!';
  } else {
    compatibilityTier = 'Opposites Attract';
    compatibilityEmoji = '🤔';
    compatibilityDescription = 'You\'re very different — could be fun chaos or a beautiful challenge!';
  }

  // Calculate area scores for radar chart
  const areaScores = {
    'Fun & Lifestyle': 0,
    'Values & Trust': 0,
    'Communication': 0,
    'Lifestyle Habits': 0,
    'Romance & Love': 0
  };

  // Calculate area-specific compatibility
  const areaQuestions = {
    'Fun & Lifestyle': ['couple_1', 'couple_2', 'couple_3'],
    'Values & Trust': ['couple_6', 'couple_7', 'couple_10'],
    'Communication': ['couple_7', 'couple_9', 'couple_15'],
    'Lifestyle Habits': ['couple_11', 'couple_12', 'couple_13', 'couple_14'],
    'Romance & Love': ['couple_5', 'couple_8', 'couple_9']
  };

  Object.entries(areaQuestions).forEach(([area, questions]) => {
    let areaMatches = 0;
    questions.forEach(questionId => {
      const userAnswer = answers[questionId];
      const partnerAnswer = partnerAnswers[questionId];
      if (userAnswer === partnerAnswer) {
        areaMatches++;
      } else if (compatibilityMatrix[questionId]?.[userAnswer]?.includes(partnerAnswer)) {
        areaMatches += 0.5;
      }
    });
    areaScores[area as keyof typeof areaScores] = Math.round((areaMatches / questions.length) * 100);
  });

  return {
    scores: { 
      compatibility: compatibilityPercentage,
      exact_matches: exactMatches,
      partial_matches: partialMatches,
      areas: areaScores
    },
    type: `${compatibilityPercentage}% Compatible - ${compatibilityTier} ${compatibilityEmoji}`,
    description_key: compatibilityDescription,
    traits: [
      `${compatibilityPercentage}% Overall Compatibility`,
      `${exactMatches}/${totalQuestions} Perfect Matches`,
      `${partialMatches} Partial Matches`
    ],
    userAnswers: answers, // Store user answers for comparison
    partnerAnswers: partnerAnswers, // Store partner answers for comparison
    compatibilityData: {
      percentage: compatibilityPercentage,
      tier: compatibilityTier,
      emoji: compatibilityEmoji,
      description: compatibilityDescription,
      exactMatches: exactMatches,
      partialMatches: partialMatches,
      totalQuestions: totalQuestions,
      areaScores: areaScores,
      areaBreakdown: areaScores, // Add this for the results page compatibility areas
      isShareable: true, // Enable SNS sharing features
      shareTitle: `We're ${compatibilityPercentage}% Compatible! ${compatibilityEmoji}`,
      shareDescription: `${compatibilityTier}: ${compatibilityDescription}`,
      shareHashtags: ['#CoupleCompatibility', '#LoveTest', '#RelationshipGoals'],
      testStatus: 'completed'
    }
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
    questions: getFeedback360Questions('general'), // Use dynamic system with general as default
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
    isCompatibilityTest: true,
    requiresFeedback: true // Requires partner participation like 360° feedback
  }
];

// Helper functions
export const getTestById = (id: string): TestDefinition | undefined => {
  return testDefinitions.find(test => test.id === id);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(testDefinitions.map(test => test.category)));
};
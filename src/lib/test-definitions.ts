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
  memoryPhase?: {
    text_key?: string; // For backwards compatibility
    content?: string[]; // For new array-based content
    duration: number; // milliseconds
  };
}

export interface TestOption {
  value: string | number;
  text_key: string;
  points?: { [trait: string]: number };
}

export interface TestDefinition {
  id: string;
  category: 'know-yourself' | 'how-others-see-me' | 'couple-compatibility' | 'knowledge-and-skill' | 'just-for-fun';
  title_key: string;
  description_key: string;
  questions: TestQuestion[];
  scoring: ScoringFunction;
  requiresFeedback?: boolean;
  isCompatibilityTest?: boolean;
  features?: {
    popularity: number; // 1-5 stars
    scientificValidity: number; // 1-5 stars
    resultType: string;
    testLength: string;
    engagement: string;
    popularityNote?: string;
  };
}

export type ScoringFunction = (
  answers: { [questionId: string]: any },
  partnerAnswers?: { [questionId: string]: any },
  questionsData?: Array<{id: string, correctAnswer: string}> | { [questionId: string]: string },
  questions?: TestQuestion[]
) => TestResult;

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
    scores: {
      percentages: percentages
    },
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
  // Extraversion (E) - 5 questions
  {
    id: 'bigfive_e1',
    text_key: 'tests.bigfive.questions.e1',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_e2',
    text_key: 'tests.bigfive.questions.e2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_e3',
    text_key: 'tests.bigfive.questions.e3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_e4',
    text_key: 'tests.bigfive.questions.e4',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_e5',
    text_key: 'tests.bigfive.questions.e5',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  
  // Agreeableness (A) - 5 questions
  {
    id: 'bigfive_a1',
    text_key: 'tests.bigfive.questions.a1',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_a2',
    text_key: 'tests.bigfive.questions.a2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_a3',
    text_key: 'tests.bigfive.questions.a3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_a4',
    text_key: 'tests.bigfive.questions.a4',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_a5',
    text_key: 'tests.bigfive.questions.a5',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  
  // Conscientiousness (C) - 5 questions
  {
    id: 'bigfive_c1',
    text_key: 'tests.bigfive.questions.c1',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_c2',
    text_key: 'tests.bigfive.questions.c2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_c3',
    text_key: 'tests.bigfive.questions.c3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_c4',
    text_key: 'tests.bigfive.questions.c4',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_c5',
    text_key: 'tests.bigfive.questions.c5',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  
  // Neuroticism (N) - 5 questions
  {
    id: 'bigfive_n1',
    text_key: 'tests.bigfive.questions.n1',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_n2',
    text_key: 'tests.bigfive.questions.n2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_n3',
    text_key: 'tests.bigfive.questions.n3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_n4',
    text_key: 'tests.bigfive.questions.n4',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_n5',
    text_key: 'tests.bigfive.questions.n5',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  
  // Openness (O) - 5 questions
  {
    id: 'bigfive_o1',
    text_key: 'tests.bigfive.questions.o1',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_o2',
    text_key: 'tests.bigfive.questions.o2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_o3',
    text_key: 'tests.bigfive.questions.o3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_o4',
    text_key: 'tests.bigfive.questions.o4',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'tests.bigfive.scale.strongly_disagree',
      maxLabel_key: 'tests.bigfive.scale.strongly_agree'
    }
  },
  {
    id: 'bigfive_o5',
    text_key: 'tests.bigfive.questions.o5',
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
    extraversion: 0,
    agreeableness: 0,
    conscientiousness: 0,
    neuroticism: 0,
    openness: 0
  };

  // Define which questions belong to each trait and their scoring direction
  const questionMappings = {
    // Extraversion (E) - outgoing, energetic, sociable
    'bigfive_e1': { trait: 'extraversion', reverse: false },
    'bigfive_e2': { trait: 'extraversion', reverse: false },
    'bigfive_e3': { trait: 'extraversion', reverse: true },  // reverse: quiet/reserved
    'bigfive_e4': { trait: 'extraversion', reverse: false },
    'bigfive_e5': { trait: 'extraversion', reverse: false },
    
    // Agreeableness (A) - cooperative, trusting, helpful
    'bigfive_a1': { trait: 'agreeableness', reverse: false },
    'bigfive_a2': { trait: 'agreeableness', reverse: true }, // reverse: critical/harsh
    'bigfive_a3': { trait: 'agreeableness', reverse: false },
    'bigfive_a4': { trait: 'agreeableness', reverse: false },
    'bigfive_a5': { trait: 'agreeableness', reverse: true }, // reverse: competitive
    
    // Conscientiousness (C) - organized, responsible, dependable
    'bigfive_c1': { trait: 'conscientiousness', reverse: false },
    'bigfive_c2': { trait: 'conscientiousness', reverse: true }, // reverse: disorganized
    'bigfive_c3': { trait: 'conscientiousness', reverse: false },
    'bigfive_c4': { trait: 'conscientiousness', reverse: true }, // reverse: procrastinate
    'bigfive_c5': { trait: 'conscientiousness', reverse: false },
    
    // Neuroticism (N) - emotional instability, anxiety, moodiness
    'bigfive_n1': { trait: 'neuroticism', reverse: false },
    'bigfive_n2': { trait: 'neuroticism', reverse: true },  // reverse: calm/relaxed
    'bigfive_n3': { trait: 'neuroticism', reverse: false },
    'bigfive_n4': { trait: 'neuroticism', reverse: false },
    'bigfive_n5': { trait: 'neuroticism', reverse: true },  // reverse: handle stress well
    
    // Openness (O) - creative, curious, open to new experiences
    'bigfive_o1': { trait: 'openness', reverse: false },
    'bigfive_o2': { trait: 'openness', reverse: true },     // reverse: prefer routine
    'bigfive_o3': { trait: 'openness', reverse: false },
    'bigfive_o4': { trait: 'openness', reverse: false },
    'bigfive_o5': { trait: 'openness', reverse: true }      // reverse: practical vs abstract
  };

  // Calculate trait scores
  Object.entries(answers).forEach(([questionId, score]) => {
    const mapping = questionMappings[questionId as keyof typeof questionMappings];
    if (mapping) {
      let adjustedScore = score as number;
      
      // Reverse score if needed (convert 1-5 to 5-1)
      if (mapping.reverse) {
        adjustedScore = 6 - adjustedScore;
      }
      
      traits[mapping.trait as keyof typeof traits] += adjustedScore;
    }
  });

  // Convert to percentages (5 questions per trait, max score 5 each = 25 total)
  const maxScorePerTrait = 5 * 5; // 5 questions × max score of 5
  const percentageScores = Object.fromEntries(
    Object.entries(traits).map(([trait, rawScore]) => [
      trait,
      Math.round((rawScore / maxScorePerTrait) * 100)
    ])
  );

  // Determine dominant traits (top 2)
  const sortedTraits = Object.entries(percentageScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([trait]) => trait);

  return {
    scores: {
      percentages: percentageScores
    },
    type: 'results.bigfive.profile',
    description_key: 'tests.bigfive.results.description',
    primaryTrait: sortedTraits[0],
    secondaryTrait: sortedTraits[1],
    traits: sortedTraits,
    summary_key: `tests.bigfive.results.${sortedTraits[0]}_${sortedTraits[1]}`
  };
};

// Enneagram Type Test Questions - Comprehensive 18-question assessment
const enneagramQuestions: TestQuestion[] = [
  {
    id: 'enneagram_1',
    text_key: 'tests.enneagram.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 1, text_key: 'tests.enneagram.options.q1_a', points: { 1: 3 } },
      { value: 8, text_key: 'tests.enneagram.options.q1_b', points: { 8: 3 } },
      { value: 3, text_key: 'tests.enneagram.options.q1_c', points: { 3: 3 } }
    ]
  },
  {
    id: 'enneagram_2',
    text_key: 'tests.enneagram.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: 2, text_key: 'tests.enneagram.options.q2_a', points: { 2: 3 } },
      { value: 9, text_key: 'tests.enneagram.options.q2_b', points: { 9: 3 } },
      { value: 6, text_key: 'tests.enneagram.options.q2_c', points: { 6: 3 } }
    ]
  },
  {
    id: 'enneagram_3',
    text_key: 'tests.enneagram.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: 7, text_key: 'tests.enneagram.options.q3_a', points: { 7: 3 } },
      { value: 4, text_key: 'tests.enneagram.options.q3_b', points: { 4: 3 } },
      { value: 5, text_key: 'tests.enneagram.options.q3_c', points: { 5: 3 } }
    ]
  },
  {
    id: 'enneagram_4',
    text_key: 'tests.enneagram.questions.q4',
    type: 'multiple_choice',
    options: [
      { value: 1, text_key: 'tests.enneagram.options.q4_a', points: { 1: 2 } },
      { value: 2, text_key: 'tests.enneagram.options.q4_b', points: { 2: 2 } },
      { value: 3, text_key: 'tests.enneagram.options.q4_c', points: { 3: 2 } }
    ]
  },
  {
    id: 'enneagram_5',
    text_key: 'tests.enneagram.questions.q5',
    type: 'multiple_choice',
    options: [
      { value: 4, text_key: 'tests.enneagram.options.q5_a', points: { 4: 2 } },
      { value: 5, text_key: 'tests.enneagram.options.q5_b', points: { 5: 2 } },
      { value: 6, text_key: 'tests.enneagram.options.q5_c', points: { 6: 2 } }
    ]
  },
  {
    id: 'enneagram_6',
    text_key: 'tests.enneagram.questions.q6',
    type: 'multiple_choice',
    options: [
      { value: 7, text_key: 'tests.enneagram.options.q6_a', points: { 7: 2 } },
      { value: 8, text_key: 'tests.enneagram.options.q6_b', points: { 8: 2 } },
      { value: 9, text_key: 'tests.enneagram.options.q6_c', points: { 9: 2 } }
    ]
  },
  {
    id: 'enneagram_7',
    text_key: 'tests.enneagram.questions.q7',
    type: 'multiple_choice',
    options: [
      { value: 1, text_key: 'tests.enneagram.options.q7_a', points: { 1: 2 } },
      { value: 4, text_key: 'tests.enneagram.options.q7_b', points: { 4: 2 } },
      { value: 7, text_key: 'tests.enneagram.options.q7_c', points: { 7: 2 } }
    ]
  },
  {
    id: 'enneagram_8',
    text_key: 'tests.enneagram.questions.q8',
    type: 'multiple_choice',
    options: [
      { value: 2, text_key: 'tests.enneagram.options.q8_a', points: { 2: 2 } },
      { value: 5, text_key: 'tests.enneagram.options.q8_b', points: { 5: 2 } },
      { value: 8, text_key: 'tests.enneagram.options.q8_c', points: { 8: 2 } }
    ]
  },
  {
    id: 'enneagram_9',
    text_key: 'tests.enneagram.questions.q9',
    type: 'multiple_choice',
    options: [
      { value: 3, text_key: 'tests.enneagram.options.q9_a', points: { 3: 2 } },
      { value: 6, text_key: 'tests.enneagram.options.q9_b', points: { 6: 2 } },
      { value: 9, text_key: 'tests.enneagram.options.q9_c', points: { 9: 2 } }
    ]
  },
  {
    id: 'enneagram_10',
    text_key: 'tests.enneagram.questions.q10',
    type: 'multiple_choice',
    options: [
      { value: 1, text_key: 'tests.enneagram.options.q10_a', points: { 1: 1, 8: 1 } },
      { value: 2, text_key: 'tests.enneagram.options.q10_b', points: { 2: 1, 9: 1 } },
      { value: 3, text_key: 'tests.enneagram.options.q10_c', points: { 3: 1, 6: 1 } }
    ]
  },
  {
    id: 'enneagram_11',
    text_key: 'tests.enneagram.questions.q11',
    type: 'multiple_choice',
    options: [
      { value: 4, text_key: 'tests.enneagram.options.q11_a', points: { 4: 1, 7: 1 } },
      { value: 5, text_key: 'tests.enneagram.options.q11_b', points: { 5: 1, 8: 1 } },
      { value: 6, text_key: 'tests.enneagram.options.q11_c', points: { 6: 1, 9: 1 } }
    ]
  },
  {
    id: 'enneagram_12',
    text_key: 'tests.enneagram.questions.q12',
    type: 'multiple_choice',
    options: [
      { value: 7, text_key: 'tests.enneagram.options.q12_a', points: { 7: 1, 1: 1 } },
      { value: 8, text_key: 'tests.enneagram.options.q12_b', points: { 8: 1, 2: 1 } },
      { value: 9, text_key: 'tests.enneagram.options.q12_c', points: { 9: 1, 3: 1 } }
    ]
  },
  {
    id: 'enneagram_13',
    text_key: 'tests.enneagram.questions.q13',
    type: 'multiple_choice',
    options: [
      { value: 1, text_key: 'tests.enneagram.options.q13_a', points: { 1: 1 } },
      { value: 4, text_key: 'tests.enneagram.options.q13_b', points: { 4: 1 } },
      { value: 5, text_key: 'tests.enneagram.options.q13_c', points: { 5: 1 } }
    ]
  },
  {
    id: 'enneagram_14',
    text_key: 'tests.enneagram.questions.q14',
    type: 'multiple_choice',
    options: [
      { value: 2, text_key: 'tests.enneagram.options.q14_a', points: { 2: 1 } },
      { value: 6, text_key: 'tests.enneagram.options.q14_b', points: { 6: 1 } },
      { value: 7, text_key: 'tests.enneagram.options.q14_c', points: { 7: 1 } }
    ]
  },
  {
    id: 'enneagram_15',
    text_key: 'tests.enneagram.questions.q15',
    type: 'multiple_choice',
    options: [
      { value: 3, text_key: 'tests.enneagram.options.q15_a', points: { 3: 1 } },
      { value: 8, text_key: 'tests.enneagram.options.q15_b', points: { 8: 1 } },
      { value: 9, text_key: 'tests.enneagram.options.q15_c', points: { 9: 1 } }
    ]
  },
  {
    id: 'enneagram_16',
    text_key: 'tests.enneagram.questions.q16',
    type: 'multiple_choice',
    options: [
      { value: 1, text_key: 'tests.enneagram.options.q16_a', points: { 1: 1 } },
      { value: 2, text_key: 'tests.enneagram.options.q16_b', points: { 2: 1 } },
      { value: 9, text_key: 'tests.enneagram.options.q16_c', points: { 9: 1 } }
    ]
  },
  {
    id: 'enneagram_17',
    text_key: 'tests.enneagram.questions.q17',
    type: 'multiple_choice',
    options: [
      { value: 3, text_key: 'tests.enneagram.options.q17_a', points: { 3: 1 } },
      { value: 4, text_key: 'tests.enneagram.options.q17_b', points: { 4: 1 } },
      { value: 5, text_key: 'tests.enneagram.options.q17_c', points: { 5: 1 } }
    ]
  },
  {
    id: 'enneagram_18',
    text_key: 'tests.enneagram.questions.q18',
    type: 'multiple_choice',
    options: [
      { value: 6, text_key: 'tests.enneagram.options.q18_a', points: { 6: 1 } },
      { value: 7, text_key: 'tests.enneagram.options.q18_b', points: { 7: 1 } },
      { value: 8, text_key: 'tests.enneagram.options.q18_c', points: { 8: 1 } }
    ]
  }
];

const enneagramScoring: ScoringFunction = (answers) => {
  const types = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  
  // Process answers with point-based scoring
  enneagramQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      const selectedOption = question.options?.find(opt => opt.value === answer);
      if (selectedOption?.points) {
        Object.entries(selectedOption.points).forEach(([type, points]) => {
          const typeNum = parseInt(type);
          if (typeNum >= 1 && typeNum <= 9) {
            types[typeNum as keyof typeof types] += points;
          }
        });
      }
    }
  });

  // Find dominant type and calculate percentages
  const totalPoints = Object.values(types).reduce((sum, points) => sum + points, 0);
  const percentages = Object.fromEntries(
    Object.entries(types).map(([type, points]) => [
      type, 
      totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0
    ])
  );

  const dominantType = Object.entries(types).reduce((max, [type, points]) => 
    points > max.points ? { type: parseInt(type), points } : max, 
    { type: 1, points: 0 }
  );

  // Get secondary type (second highest score)
  const sortedTypes = Object.entries(types)
    .sort(([,a], [,b]) => b - a)
    .map(([type, points]) => ({ type: parseInt(type), points }));
  
  const secondaryType = sortedTypes[1];

  const traits = [`Type ${dominantType.type}`];
  if (secondaryType.points > 0) {
    traits.push(`Wing ${secondaryType.type}`);
  }

  return {
    scores: types,
    percentages,
    type: `Type ${dominantType.type}`,
    description_key: `tests.enneagram.results.type${dominantType.type}`,
    traits,
    dominantType: dominantType.type,
    secondaryType: secondaryType.points > 0 ? secondaryType.type : null,
    totalPoints
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

// 🧠 Knowledge and Skill Tests
// Expanded question pool - starting with enhanced 10 base questions, can expand to 500+ later
const allGeneralKnowledgeQuestions: TestQuestion[] = [
  // Original 10 questions that work perfectly
  {
    id: 'gk_1',
    text_key: 'tests.general_knowledge.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 'egypt', text_key: 'tests.general_knowledge.options.q1_a' },
      { value: 'china', text_key: 'tests.general_knowledge.options.q1_b' },
      { value: 'peru', text_key: 'tests.general_knowledge.options.q1_c' },
      { value: 'jordan', text_key: 'tests.general_knowledge.options.q1_d' }
    ]
  },
  {
    id: 'gk_2',
    text_key: 'tests.general_knowledge.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: 'mercury', text_key: 'tests.general_knowledge.options.q2_a' },
      { value: 'venus', text_key: 'tests.general_knowledge.options.q2_b' },
      { value: 'mars', text_key: 'tests.general_knowledge.options.q2_c' },
      { value: 'jupiter', text_key: 'tests.general_knowledge.options.q2_d' }
    ]
  },
  {
    id: 'gk_3',
    text_key: 'tests.general_knowledge.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: 'da_vinci', text_key: 'tests.general_knowledge.options.q3_a' },
      { value: 'michelangelo', text_key: 'tests.general_knowledge.options.q3_b' },
      { value: 'picasso', text_key: 'tests.general_knowledge.options.q3_c' },
      { value: 'van_gogh', text_key: 'tests.general_knowledge.options.q3_d' }
    ]
  },
  {
    id: 'gk_4',
    text_key: 'tests.general_knowledge.questions.q4',
    type: 'multiple_choice',
    options: [
      { value: 'pacific', text_key: 'tests.general_knowledge.options.q4_a' },
      { value: 'atlantic', text_key: 'tests.general_knowledge.options.q4_b' },
      { value: 'indian', text_key: 'tests.general_knowledge.options.q4_c' },
      { value: 'arctic', text_key: 'tests.general_knowledge.options.q4_d' }
    ]
  },
  {
    id: 'gk_5',
    text_key: 'tests.general_knowledge.questions.q5',
    type: 'multiple_choice',
    options: [
      { value: 'shakespeare', text_key: 'tests.general_knowledge.options.q5_a' },
      { value: 'dickens', text_key: 'tests.general_knowledge.options.q5_b' },
      { value: 'austen', text_key: 'tests.general_knowledge.options.q5_c' },
      { value: 'tolkien', text_key: 'tests.general_knowledge.options.q5_d' }
    ]
  },
  {
    id: 'gk_6',
    text_key: 'tests.general_knowledge.questions.q6',
    type: 'multiple_choice',
    options: [
      { value: 'hydrogen', text_key: 'tests.general_knowledge.options.q6_a' },
      { value: 'helium', text_key: 'tests.general_knowledge.options.q6_b' },
      { value: 'oxygen', text_key: 'tests.general_knowledge.options.q6_c' },
      { value: 'carbon', text_key: 'tests.general_knowledge.options.q6_d' }
    ]
  },
  {
    id: 'gk_7',
    text_key: 'tests.general_knowledge.questions.q7',
    type: 'multiple_choice',
    options: [
      { value: '1912', text_key: 'tests.general_knowledge.options.q7_a' },
      { value: '1914', text_key: 'tests.general_knowledge.options.q7_b' },
      { value: '1916', text_key: 'tests.general_knowledge.options.q7_c' },
      { value: '1918', text_key: 'tests.general_knowledge.options.q7_d' }
    ]
  },
  {
    id: 'gk_8',
    text_key: 'tests.general_knowledge.questions.q8',
    type: 'multiple_choice',
    options: [
      { value: 'nile', text_key: 'tests.general_knowledge.options.q8_a' },
      { value: 'amazon', text_key: 'tests.general_knowledge.options.q8_b' },
      { value: 'yangtze', text_key: 'tests.general_knowledge.options.q8_c' },
      { value: 'mississippi', text_key: 'tests.general_knowledge.options.q8_d' }
    ]
  },
  {
    id: 'gk_9',
    text_key: 'tests.general_knowledge.questions.q9',
    type: 'multiple_choice',
    options: [
      { value: 'einstein', text_key: 'tests.general_knowledge.options.q9_a' },
      { value: 'newton', text_key: 'tests.general_knowledge.options.q9_b' },
      { value: 'darwin', text_key: 'tests.general_knowledge.options.q9_c' },
      { value: 'galileo', text_key: 'tests.general_knowledge.options.q9_d' }
    ]
  },
  {
    id: 'gk_10',
    text_key: 'tests.general_knowledge.questions.q10',
    type: 'multiple_choice',
    options: [
      { value: 'asia', text_key: 'tests.general_knowledge.options.q10_a' },
      { value: 'africa', text_key: 'tests.general_knowledge.options.q10_b' },
      { value: 'north_america', text_key: 'tests.general_knowledge.options.q10_c' },
      { value: 'south_america', text_key: 'tests.general_knowledge.options.q10_d' }
    ]
  },
  
  // Additional questions for better randomization (gk_11 to gk_50)
  {
    id: 'gk_11',
    text_key: 'tests.general_knowledge.questions.q11',
    type: 'multiple_choice',
    options: [
      { value: 'Au', text_key: 'tests.general_knowledge.options.q11_a' },
      { value: 'Ag', text_key: 'tests.general_knowledge.options.q11_b' },
      { value: 'Pt', text_key: 'tests.general_knowledge.options.q11_c' },
      { value: 'Cu', text_key: 'tests.general_knowledge.options.q11_d' }
    ]
  },
  {
    id: 'gk_12',
    text_key: 'tests.general_knowledge.questions.q12',
    type: 'multiple_choice',
    options: [
      { value: '206', text_key: 'tests.general_knowledge.options.q12_a' },
      { value: '196', text_key: 'tests.general_knowledge.options.q12_b' },
      { value: '216', text_key: 'tests.general_knowledge.options.q12_c' },
      { value: '186', text_key: 'tests.general_knowledge.options.q12_d' }
    ]
  },
  {
    id: 'gk_13',
    text_key: 'tests.general_knowledge.questions.q13',
    type: 'multiple_choice',
    options: [
      { value: 'cheetah', text_key: 'tests.general_knowledge.options.q13_a' },
      { value: 'lion', text_key: 'tests.general_knowledge.options.q13_b' },
      { value: 'leopard', text_key: 'tests.general_knowledge.options.q13_c' },
      { value: 'tiger', text_key: 'tests.general_knowledge.options.q13_d' }
    ]
  },
  {
    id: 'gk_14',
    text_key: 'tests.general_knowledge.questions.q14',
    type: 'multiple_choice',
    options: [
      { value: 'nitrogen', text_key: 'tests.general_knowledge.options.q14_a' },
      { value: 'oxygen', text_key: 'tests.general_knowledge.options.q14_b' },
      { value: 'carbon_dioxide', text_key: 'tests.general_knowledge.options.q14_c' },
      { value: 'hydrogen', text_key: 'tests.general_knowledge.options.q14_d' }
    ]
  },
  {
    id: 'gk_15',
    text_key: 'tests.general_knowledge.questions.q15',
    type: 'multiple_choice',
    options: [
      { value: '3', text_key: 'tests.general_knowledge.options.q15_a' },
      { value: '2', text_key: 'tests.general_knowledge.options.q15_b' },
      { value: '4', text_key: 'tests.general_knowledge.options.q15_c' },
      { value: '5', text_key: 'tests.general_knowledge.options.q15_d' }
    ]
  },
  {
    id: 'gk_16',
    text_key: 'tests.general_knowledge.questions.q16',
    type: 'multiple_choice',
    options: [
      { value: '1945', text_key: 'tests.general_knowledge.options.q16_a' },
      { value: '1944', text_key: 'tests.general_knowledge.options.q16_b' },
      { value: '1946', text_key: 'tests.general_knowledge.options.q16_c' },
      { value: '1943', text_key: 'tests.general_knowledge.options.q16_d' }
    ]
  },
  {
    id: 'gk_17',
    text_key: 'tests.general_knowledge.questions.q17',
    type: 'multiple_choice',
    options: [
      { value: 'neil_armstrong', text_key: 'tests.general_knowledge.options.q17_a' },
      { value: 'buzz_aldrin', text_key: 'tests.general_knowledge.options.q17_b' },
      { value: 'john_glenn', text_key: 'tests.general_knowledge.options.q17_c' },
      { value: 'yuri_gagarin', text_key: 'tests.general_knowledge.options.q17_d' }
    ]
  },
  {
    id: 'gk_18',
    text_key: 'tests.general_knowledge.questions.q18',
    type: 'multiple_choice',
    options: [
      { value: 'lighthouse', text_key: 'tests.general_knowledge.options.q18_a' },
      { value: 'colossus', text_key: 'tests.general_knowledge.options.q18_b' },
      { value: 'hanging_gardens', text_key: 'tests.general_knowledge.options.q18_c' },
      { value: 'mausoleum', text_key: 'tests.general_knowledge.options.q18_d' }
    ]
  },
  {
    id: 'gk_19',
    text_key: 'tests.general_knowledge.questions.q19',
    type: 'multiple_choice',
    options: [
      { value: '1989', text_key: 'tests.general_knowledge.options.q19_a' },
      { value: '1988', text_key: 'tests.general_knowledge.options.q19_b' },
      { value: '1990', text_key: 'tests.general_knowledge.options.q19_c' },
      { value: '1987', text_key: 'tests.general_knowledge.options.q19_d' }
    ]
  },
  {
    id: 'gk_20',
    text_key: 'tests.general_knowledge.questions.q20',
    type: 'multiple_choice',
    options: [
      { value: 'augustus', text_key: 'tests.general_knowledge.options.q20_a' },
      { value: 'julius_caesar', text_key: 'tests.general_knowledge.options.q20_b' },
      { value: 'nero', text_key: 'tests.general_knowledge.options.q20_c' },
      { value: 'marcus_aurelius', text_key: 'tests.general_knowledge.options.q20_d' }
    ]
  }
  
  // Expanded from 10 to 20 questions for better variety - can add more as needed
];

// Function to randomly select questions from the pool
const getRandomQuestions = (questionPool: TestQuestion[], count: number = 10): TestQuestion[] => {
  const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Dynamic function to get fresh random questions from database
export const getGeneralKnowledgeQuestions = async (language: string = 'en'): Promise<TestQuestion[]> => {
  // Import the database function dynamically to avoid circular imports
  const { getRandomGeneralKnowledgeQuestions } = await import('./firestore');
  return await getRandomGeneralKnowledgeQuestions(10, language);
};

// Function to get questions with their correct answers for scoring
export const getGeneralKnowledgeQuestionsWithAnswers = async (
  count: number = 10,
  language: string = 'en'
): Promise<{questions: TestQuestion[], correctAnswers: Array<{id: string, correctAnswer: string}>}> => {
  // Import the database function dynamically to avoid circular imports
  const { getRandomGeneralKnowledgeQuestionsWithAnswers } = await import('./firestore');
  return await getRandomGeneralKnowledgeQuestionsWithAnswers(count, language);
};

// Math Speed Test - Database-driven questions
export const getMathSpeedQuestions = async (): Promise<TestQuestion[]> => {
  try {
    // Import the database function dynamically to avoid circular imports
    const { getRandomMathSpeedQuestions } = await import('./firestore');
    const mathQuestions = await getRandomMathSpeedQuestions(10, 'en');

    // The function already returns TestQuestion format, so return directly
    return mathQuestions;
  } catch (error) {
    console.error('❌ Error getting math speed questions from database:', error);
    // Fallback to static questions
    return mathSpeedQuestions;
  }
};

// Updated function to get questions and their correct answers together
export const getMathSpeedQuestionsWithAnswers = async (): Promise<{
  questions: TestQuestion[],
  correctAnswers: { [questionId: string]: string }
}> => {
  try {
    // Import the database function and types dynamically to avoid circular imports
    const { firestore } = await import('./firebase');
    const { collection, getDocs, where, query } = await import('firebase/firestore');

    console.log('🔍 Loading Math Speed questions directly with correct answers...');

    // Get questions directly from database to preserve correct answers
    const questionsRef = collection(firestore, 'mathSpeedQuestions');
    const q = query(
      questionsRef,
      where('isActive', '==', true),
      where('availableLanguages', 'array-contains', 'en')
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('⚠️ No math speed questions found in database, falling back...');
      throw new Error('No questions found in database');
    }

    const questions: TestQuestion[] = [];
    const correctAnswers: { [questionId: string]: string } = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      const translation = data.translations['en'] || data.translations[data.defaultLanguage];

      if (!translation) {
        return; // Skip this question
      }

      // Create TestQuestion
      const testQuestion: TestQuestion = {
        id: doc.id,
        text_key: translation.question,
        type: 'multiple_choice',
        options: [
          { value: 'a', text_key: translation.options.a },
          { value: 'b', text_key: translation.options.b },
          { value: 'c', text_key: translation.options.c },
          { value: 'd', text_key: translation.options.d }
        ]
      };

      // Extract correct answer from original database data
      correctAnswers[doc.id] = data.correctAnswer;

      questions.push(testQuestion);
    });

    // Randomly select 10 questions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 10);

    // Filter correct answers to only include selected questions
    const selectedCorrectAnswers: { [questionId: string]: string } = {};
    selectedQuestions.forEach(q => {
      selectedCorrectAnswers[q.id] = correctAnswers[q.id];
    });

    console.log('🔍 Synchronized questions and answers:', {
      questionCount: selectedQuestions.length,
      answerCount: Object.keys(selectedCorrectAnswers).length,
      questionIds: selectedQuestions.map(q => q.id),
      correctAnswers: selectedCorrectAnswers
    });

    return {
      questions: selectedQuestions,
      correctAnswers: selectedCorrectAnswers
    };
  } catch (error) {
    console.error('❌ Error getting math speed questions from database:', error);
    console.log('🔄 Falling back to static Math Speed questions and answers for anonymous user');

    // Fallback to static questions and answers
    const staticCorrectAnswers = {
      'math_1': '17', 'math_2': '72', 'math_3': '13', 'math_4': '154', 'math_5': '8',
      'math_6': '144', 'math_7': '72', 'math_8': '15', 'math_9': '36', 'math_10': '125'
    };

    console.log('🔍 Static fallback - Questions and answers:', {
      questionCount: mathSpeedQuestions.length,
      answerCount: Object.keys(staticCorrectAnswers).length,
      staticCorrectAnswers
    });

    return {
      questions: mathSpeedQuestions,
      correctAnswers: staticCorrectAnswers
    };
  }
};

// Function to get correct answers for database-driven Math Speed questions
export const getMathSpeedCorrectAnswers = async (): Promise<{ [questionId: string]: string }> => {
  try {
    const { getRandomMathSpeedQuestions } = await import('./firestore');
    const { firestore } = await import('./firebase');
    const { collection, getDocs, where, query } = await import('firebase/firestore');

    // Get the same questions that were loaded for the test
    const questionsRef = collection(firestore, 'mathSpeedQuestions');
    const q = query(
      questionsRef,
      where('isActive', '==', true),
      where('availableLanguages', 'array-contains', 'en')
    );

    const snapshot = await getDocs(q);
    const correctAnswers: { [questionId: string]: string } = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      correctAnswers[doc.id] = data.correctAnswer; // This will be 'a', 'b', 'c', or 'd'
    });

    console.log('🔍 Math Speed correct answers from database:', correctAnswers);
    return correctAnswers;
  } catch (error) {
    console.error('❌ Error getting Math Speed correct answers:', error);
    return {};
  }
};

// Memory Power Test - Database-driven questions
export const getMemoryPowerQuestions = async (language: string = 'en'): Promise<TestQuestion[]> => {
  try {
    // Import the database function dynamically to avoid circular imports
    const { getRandomMemoryPowerQuestions } = await import('./firestore');
    const memoryQuestions = await getRandomMemoryPowerQuestions(10, language);

    // The function already returns TestQuestion format, so return directly
    return memoryQuestions;
  } catch (error) {
    console.error('❌ Error getting memory power questions from database:', error);
    // Fallback to static questions
    return memoryPowerQuestions;
  }
};

export const getMemoryPowerQuestionsWithAnswers = async (
  count: number = 10,
  language: string = 'en'
): Promise<{questions: TestQuestion[], correctAnswers: Array<{id: string, correctAnswer: string}>}> => {
  // Import the database function dynamically to avoid circular imports
  const { getRandomMemoryPowerQuestionsWithAnswers } = await import('./firestore');
  return await getRandomMemoryPowerQuestionsWithAnswers(count, language);
};

// Static fallback for initial load (using hardcoded questions for synchronous initialization)
const generalKnowledgeQuestions: TestQuestion[] = getRandomQuestions(allGeneralKnowledgeQuestions, 10);

const mathSpeedQuestions: TestQuestion[] = [
  {
    id: 'math_1',
    text_key: 'tests.math_speed.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: '15', text_key: 'tests.math_speed.options.q1_a' },
      { value: '17', text_key: 'tests.math_speed.options.q1_b' },
      { value: '19', text_key: 'tests.math_speed.options.q1_c' },
      { value: '21', text_key: 'tests.math_speed.options.q1_d' }
    ]
  },
  {
    id: 'math_2',
    text_key: 'tests.math_speed.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: '56', text_key: 'tests.math_speed.options.q2_a' },
      { value: '64', text_key: 'tests.math_speed.options.q2_b' },
      { value: '72', text_key: 'tests.math_speed.options.q2_c' },
      { value: '81', text_key: 'tests.math_speed.options.q2_d' }
    ]
  },
  {
    id: 'math_3',
    text_key: 'tests.math_speed.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: '12', text_key: 'tests.math_speed.options.q3_a' },
      { value: '13', text_key: 'tests.math_speed.options.q3_b' },
      { value: '14', text_key: 'tests.math_speed.options.q3_c' },
      { value: '15', text_key: 'tests.math_speed.options.q3_d' }
    ]
  },
  {
    id: 'math_4',
    text_key: 'tests.math_speed.questions.q4',
    type: 'multiple_choice',
    options: [
      { value: '144', text_key: 'tests.math_speed.options.q4_a' },
      { value: '154', text_key: 'tests.math_speed.options.q4_b' },
      { value: '164', text_key: 'tests.math_speed.options.q4_c' },
      { value: '174', text_key: 'tests.math_speed.options.q4_d' }
    ]
  },
  {
    id: 'math_5',
    text_key: 'tests.math_speed.questions.q5',
    type: 'multiple_choice',
    options: [
      { value: '7', text_key: 'tests.math_speed.options.q5_a' },
      { value: '8', text_key: 'tests.math_speed.options.q5_b' },
      { value: '9', text_key: 'tests.math_speed.options.q5_c' },
      { value: '10', text_key: 'tests.math_speed.options.q5_d' }
    ]
  },
  {
    id: 'math_6',
    text_key: 'tests.math_speed.questions.q6',
    type: 'multiple_choice',
    options: [
      { value: '144', text_key: 'tests.math_speed.options.q6_a' },
      { value: '169', text_key: 'tests.math_speed.options.q6_b' },
      { value: '196', text_key: 'tests.math_speed.options.q6_c' },
      { value: '225', text_key: 'tests.math_speed.options.q6_d' }
    ]
  },
  {
    id: 'math_7',
    text_key: 'tests.math_speed.questions.q7',
    type: 'multiple_choice',
    options: [
      { value: '60', text_key: 'tests.math_speed.options.q7_a' },
      { value: '72', text_key: 'tests.math_speed.options.q7_b' },
      { value: '84', text_key: 'tests.math_speed.options.q7_c' },
      { value: '96', text_key: 'tests.math_speed.options.q7_d' }
    ]
  },
  {
    id: 'math_8',
    text_key: 'tests.math_speed.questions.q8',
    type: 'multiple_choice',
    options: [
      { value: '15', text_key: 'tests.math_speed.options.q8_a' },
      { value: '18', text_key: 'tests.math_speed.options.q8_b' },
      { value: '21', text_key: 'tests.math_speed.options.q8_c' },
      { value: '24', text_key: 'tests.math_speed.options.q8_d' }
    ]
  },
  {
    id: 'math_9',
    text_key: 'tests.math_speed.questions.q9',
    type: 'multiple_choice',
    options: [
      { value: '27', text_key: 'tests.math_speed.options.q9_a' },
      { value: '32', text_key: 'tests.math_speed.options.q9_b' },
      { value: '36', text_key: 'tests.math_speed.options.q9_c' },
      { value: '45', text_key: 'tests.math_speed.options.q9_d' }
    ]
  },
  {
    id: 'math_10',
    text_key: 'tests.math_speed.questions.q10',
    type: 'multiple_choice',
    options: [
      { value: '120', text_key: 'tests.math_speed.options.q10_a' },
      { value: '125', text_key: 'tests.math_speed.options.q10_b' },
      { value: '130', text_key: 'tests.math_speed.options.q10_c' },
      { value: '135', text_key: 'tests.math_speed.options.q10_d' }
    ]
  }
];

const memoryPowerQuestions: TestQuestion[] = [
  {
    id: 'memory_1',
    text_key: 'tests.memory_power.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 'sequence_1', text_key: 'tests.memory_power.options.q1_a' },
      { value: 'sequence_2', text_key: 'tests.memory_power.options.q1_b' },
      { value: 'sequence_3', text_key: 'tests.memory_power.options.q1_c' },
      { value: 'sequence_4', text_key: 'tests.memory_power.options.q1_d' }
    ]
  },
  {
    id: 'memory_2',
    text_key: 'tests.memory_power.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: 'pattern_1', text_key: 'tests.memory_power.options.q2_a' },
      { value: 'pattern_2', text_key: 'tests.memory_power.options.q2_b' },
      { value: 'pattern_3', text_key: 'tests.memory_power.options.q2_c' },
      { value: 'pattern_4', text_key: 'tests.memory_power.options.q2_d' }
    ]
  },
  {
    id: 'memory_3',
    text_key: 'tests.memory_power.questions.q3',
    type: 'multiple_choice',
    memoryPhase: {
      text_key: 'tests.memory_power.questions.q3_memorize',
      duration: 7000 // 7 seconds to memorize
    },
    options: [
      { value: 'word_list_1', text_key: 'tests.memory_power.options.q3_a' },
      { value: 'word_list_2', text_key: 'tests.memory_power.options.q3_b' },
      { value: 'word_list_3', text_key: 'tests.memory_power.options.q3_c' },
      { value: 'word_list_4', text_key: 'tests.memory_power.options.q3_d' }
    ]
  }
];

// 🎉 Just for Fun Tests
const countryMatchQuestions: TestQuestion[] = [
  {
    id: 'country_1',
    text_key: 'tests.country_match.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 'early_riser', text_key: 'tests.country_match.options.q1_a' },
      { value: 'night_owl', text_key: 'tests.country_match.options.q1_b' },
      { value: 'afternoon_person', text_key: 'tests.country_match.options.q1_c' },
      { value: 'whenever', text_key: 'tests.country_match.options.q1_d' }
    ]
  },
  {
    id: 'country_2',
    text_key: 'tests.country_match.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: 'pasta_pizza', text_key: 'tests.country_match.options.q2_a' },
      { value: 'sushi_ramen', text_key: 'tests.country_match.options.q2_b' },
      { value: 'tacos_burritos', text_key: 'tests.country_match.options.q2_c' },
      { value: 'croissant_cheese', text_key: 'tests.country_match.options.q2_d' }
    ]
  },
  {
    id: 'country_3',
    text_key: 'tests.country_match.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: 'beach_sun', text_key: 'tests.country_match.options.q3_a' },
      { value: 'mountains_hiking', text_key: 'tests.country_match.options.q3_b' },
      { value: 'city_culture', text_key: 'tests.country_match.options.q3_c' },
      { value: 'countryside_peace', text_key: 'tests.country_match.options.q3_d' }
    ]
  },
  {
    id: 'country_4',
    text_key: 'tests.country_match.questions.q4',
    type: 'multiple_choice',
    options: [
      { value: 'very_social', text_key: 'tests.country_match.options.q4_a' },
      { value: 'somewhat_social', text_key: 'tests.country_match.options.q4_b' },
      { value: 'prefer_small_groups', text_key: 'tests.country_match.options.q4_c' },
      { value: 'love_solitude', text_key: 'tests.country_match.options.q4_d' }
    ]
  },
  {
    id: 'country_5',
    text_key: 'tests.country_match.questions.q5',
    type: 'multiple_choice',
    options: [
      { value: 'warm_tropical', text_key: 'tests.country_match.options.q5_a' },
      { value: 'mild_pleasant', text_key: 'tests.country_match.options.q5_b' },
      { value: 'four_seasons', text_key: 'tests.country_match.options.q5_c' },
      { value: 'cool_crisp', text_key: 'tests.country_match.options.q5_d' }
    ]
  },
  {
    id: 'country_6',
    text_key: 'tests.country_match.questions.q6',
    type: 'multiple_choice',
    options: [
      { value: 'spicy_bold', text_key: 'tests.country_match.options.q6_a' },
      { value: 'sweet_comforting', text_key: 'tests.country_match.options.q6_b' },
      { value: 'fresh_healthy', text_key: 'tests.country_match.options.q6_c' },
      { value: 'rich_indulgent', text_key: 'tests.country_match.options.q6_d' }
    ]
  },
  {
    id: 'country_7',
    text_key: 'tests.country_match.questions.q7',
    type: 'multiple_choice',
    options: [
      { value: 'dancing_music', text_key: 'tests.country_match.options.q7_a' },
      { value: 'reading_learning', text_key: 'tests.country_match.options.q7_b' },
      { value: 'sports_games', text_key: 'tests.country_match.options.q7_c' },
      { value: 'art_crafts', text_key: 'tests.country_match.options.q7_d' }
    ]
  },
  {
    id: 'country_8',
    text_key: 'tests.country_match.questions.q8',
    type: 'multiple_choice',
    options: [
      { value: 'adventure_travel', text_key: 'tests.country_match.options.q8_a' },
      { value: 'luxury_comfort', text_key: 'tests.country_match.options.q8_b' },
      { value: 'cultural_history', text_key: 'tests.country_match.options.q8_c' },
      { value: 'nature_wildlife', text_key: 'tests.country_match.options.q8_d' }
    ]
  },
  {
    id: 'country_9',
    text_key: 'tests.country_match.questions.q9',
    type: 'multiple_choice',
    options: [
      { value: 'family_traditions', text_key: 'tests.country_match.options.q9_a' },
      { value: 'innovation_technology', text_key: 'tests.country_match.options.q9_b' },
      { value: 'work_life_balance', text_key: 'tests.country_match.options.q9_c' },
      { value: 'community_helping', text_key: 'tests.country_match.options.q9_d' }
    ]
  },
  {
    id: 'country_10',
    text_key: 'tests.country_match.questions.q10',
    type: 'multiple_choice',
    options: [
      { value: 'fast_paced', text_key: 'tests.country_match.options.q10_a' },
      { value: 'relaxed_slow', text_key: 'tests.country_match.options.q10_b' },
      { value: 'structured_organized', text_key: 'tests.country_match.options.q10_c' },
      { value: 'spontaneous_flexible', text_key: 'tests.country_match.options.q10_d' }
    ]
  }
];

const mentalAgeQuestions: TestQuestion[] = [
  {
    id: 'age_1',
    text_key: 'tests.mental_age.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 'video_games', text_key: 'tests.mental_age.options.q1_a' },
      { value: 'reading_book', text_key: 'tests.mental_age.options.q1_b' },
      { value: 'social_media', text_key: 'tests.mental_age.options.q1_c' },
      { value: 'gardening', text_key: 'tests.mental_age.options.q1_d' }
    ]
  },
  {
    id: 'age_2',
    text_key: 'tests.mental_age.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: 'memes_jokes', text_key: 'tests.mental_age.options.q2_a' },
      { value: 'witty_wordplay', text_key: 'tests.mental_age.options.q2_b' },
      { value: 'slapstick_physical', text_key: 'tests.mental_age.options.q2_c' },
      { value: 'dry_sarcastic', text_key: 'tests.mental_age.options.q2_d' }
    ]
  },
  {
    id: 'age_3',
    text_key: 'tests.mental_age.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: 'text_immediately', text_key: 'tests.mental_age.options.q3_a' },
      { value: 'call_right_away', text_key: 'tests.mental_age.options.q3_b' },
      { value: 'think_then_respond', text_key: 'tests.mental_age.options.q3_c' },
      { value: 'write_letter', text_key: 'tests.mental_age.options.q3_d' }
    ]
  },
  {
    id: 'age_4',
    text_key: 'tests.mental_age.questions.q4',
    type: 'multiple_choice',
    options: [
      { value: 'latest_trends', text_key: 'tests.mental_age.options.q4_a' },
      { value: 'comfortable_classic', text_key: 'tests.mental_age.options.q4_b' },
      { value: 'practical_functional', text_key: 'tests.mental_age.options.q4_c' },
      { value: 'whatever_clean', text_key: 'tests.mental_age.options.q4_d' }
    ]
  },
  {
    id: 'age_5',
    text_key: 'tests.mental_age.questions.q5',
    type: 'multiple_choice',
    options: [
      { value: 'party_friends', text_key: 'tests.mental_age.options.q5_a' },
      { value: 'dinner_partner', text_key: 'tests.mental_age.options.q5_b' },
      { value: 'movie_home', text_key: 'tests.mental_age.options.q5_c' },
      { value: 'early_bed', text_key: 'tests.mental_age.options.q5_d' }
    ]
  },
  {
    id: 'age_6',
    text_key: 'tests.mental_age.questions.q6',
    type: 'multiple_choice',
    options: [
      { value: 'latest_gadgets', text_key: 'tests.mental_age.options.q6_a' },
      { value: 'reliable_proven', text_key: 'tests.mental_age.options.q6_b' },
      { value: 'simple_basic', text_key: 'tests.mental_age.options.q6_c' },
      { value: 'dont_need_much', text_key: 'tests.mental_age.options.q6_d' }
    ]
  },
  {
    id: 'age_7',
    text_key: 'tests.mental_age.questions.q7',
    type: 'multiple_choice',
    options: [
      { value: 'adventure_excitement', text_key: 'tests.mental_age.options.q7_a' },
      { value: 'comfort_familiar', text_key: 'tests.mental_age.options.q7_b' },
      { value: 'learning_growth', text_key: 'tests.mental_age.options.q7_c' },
      { value: 'peace_quiet', text_key: 'tests.mental_age.options.q7_d' }
    ]
  },
  {
    id: 'age_8',
    text_key: 'tests.mental_age.questions.q8',
    type: 'multiple_choice',
    options: [
      { value: 'spend_enjoy', text_key: 'tests.mental_age.options.q8_a' },
      { value: 'save_some_spend', text_key: 'tests.mental_age.options.q8_b' },
      { value: 'invest_future', text_key: 'tests.mental_age.options.q8_c' },
      { value: 'save_everything', text_key: 'tests.mental_age.options.q8_d' }
    ]
  },
  {
    id: 'age_9',
    text_key: 'tests.mental_age.questions.q9',
    type: 'multiple_choice',
    options: [
      { value: 'avoid_stress', text_key: 'tests.mental_age.options.q9_a' },
      { value: 'complain_vent', text_key: 'tests.mental_age.options.q9_b' },
      { value: 'solve_directly', text_key: 'tests.mental_age.options.q9_c' },
      { value: 'accept_adapt', text_key: 'tests.mental_age.options.q9_d' }
    ]
  },
  {
    id: 'age_10',
    text_key: 'tests.mental_age.questions.q10',
    type: 'multiple_choice',
    options: [
      { value: 'viral_trending', text_key: 'tests.mental_age.options.q10_a' },
      { value: 'friends_recommendations', text_key: 'tests.mental_age.options.q10_b' },
      { value: 'critic_reviews', text_key: 'tests.mental_age.options.q10_c' },
      { value: 'classic_timeless', text_key: 'tests.mental_age.options.q10_d' }
    ]
  }
];

const spiritAnimalQuestions: TestQuestion[] = [
  {
    id: 'animal_1',
    text_key: 'tests.spirit_animal.questions.q1',
    type: 'multiple_choice',
    options: [
      { value: 'lead_group', text_key: 'tests.spirit_animal.options.q1_a' },
      { value: 'support_others', text_key: 'tests.spirit_animal.options.q1_b' },
      { value: 'work_independently', text_key: 'tests.spirit_animal.options.q1_c' },
      { value: 'observe_analyze', text_key: 'tests.spirit_animal.options.q1_d' }
    ]
  },
  {
    id: 'animal_2',
    text_key: 'tests.spirit_animal.questions.q2',
    type: 'multiple_choice',
    options: [
      { value: 'ocean_depths', text_key: 'tests.spirit_animal.options.q2_a' },
      { value: 'forest_trees', text_key: 'tests.spirit_animal.options.q2_b' },
      { value: 'mountain_peaks', text_key: 'tests.spirit_animal.options.q2_c' },
      { value: 'open_plains', text_key: 'tests.spirit_animal.options.q2_d' }
    ]
  },
  {
    id: 'animal_3',
    text_key: 'tests.spirit_animal.questions.q3',
    type: 'multiple_choice',
    options: [
      { value: 'strength_courage', text_key: 'tests.spirit_animal.options.q3_a' },
      { value: 'wisdom_intelligence', text_key: 'tests.spirit_animal.options.q3_b' },
      { value: 'loyalty_friendship', text_key: 'tests.spirit_animal.options.q3_c' },
      { value: 'freedom_independence', text_key: 'tests.spirit_animal.options.q3_d' }
    ]
  },
  {
    id: 'animal_4',
    text_key: 'tests.spirit_animal.questions.q4',
    type: 'multiple_choice',
    options: [
      { value: 'face_directly', text_key: 'tests.spirit_animal.options.q4_a' },
      { value: 'think_strategize', text_key: 'tests.spirit_animal.options.q4_b' },
      { value: 'seek_help', text_key: 'tests.spirit_animal.options.q4_c' },
      { value: 'wait_observe', text_key: 'tests.spirit_animal.options.q4_d' }
    ]
  },
  {
    id: 'animal_5',
    text_key: 'tests.spirit_animal.questions.q5',
    type: 'multiple_choice',
    options: [
      { value: 'day_active', text_key: 'tests.spirit_animal.options.q5_a' },
      { value: 'night_mysterious', text_key: 'tests.spirit_animal.options.q5_b' },
      { value: 'dawn_fresh_start', text_key: 'tests.spirit_animal.options.q5_c' },
      { value: 'sunset_reflection', text_key: 'tests.spirit_animal.options.q5_d' }
    ]
  },
  {
    id: 'animal_6',
    text_key: 'tests.spirit_animal.questions.q6',
    type: 'multiple_choice',
    options: [
      { value: 'competitive_winning', text_key: 'tests.spirit_animal.options.q6_a' },
      { value: 'creative_artistic', text_key: 'tests.spirit_animal.options.q6_b' },
      { value: 'social_connecting', text_key: 'tests.spirit_animal.options.q6_c' },
      { value: 'peaceful_meditating', text_key: 'tests.spirit_animal.options.q6_d' }
    ]
  },
  {
    id: 'animal_7',
    text_key: 'tests.spirit_animal.questions.q7',
    type: 'multiple_choice',
    options: [
      { value: 'fast_decisive', text_key: 'tests.spirit_animal.options.q7_a' },
      { value: 'careful_methodical', text_key: 'tests.spirit_animal.options.q7_b' },
      { value: 'intuitive_feeling', text_key: 'tests.spirit_animal.options.q7_c' },
      { value: 'patient_waiting', text_key: 'tests.spirit_animal.options.q7_d' }
    ]
  },
  {
    id: 'animal_8',
    text_key: 'tests.spirit_animal.questions.q8',
    type: 'multiple_choice',
    options: [
      { value: 'protect_defend', text_key: 'tests.spirit_animal.options.q8_a' },
      { value: 'teach_guide', text_key: 'tests.spirit_animal.options.q8_b' },
      { value: 'play_entertain', text_key: 'tests.spirit_animal.options.q8_c' },
      { value: 'explore_discover', text_key: 'tests.spirit_animal.options.q8_d' }
    ]
  },
  {
    id: 'animal_9',
    text_key: 'tests.spirit_animal.questions.q9',
    type: 'multiple_choice',
    options: [
      { value: 'physical_strength', text_key: 'tests.spirit_animal.options.q9_a' },
      { value: 'mental_intelligence', text_key: 'tests.spirit_animal.options.q9_b' },
      { value: 'emotional_empathy', text_key: 'tests.spirit_animal.options.q9_c' },
      { value: 'spiritual_intuition', text_key: 'tests.spirit_animal.options.q9_d' }
    ]
  },
  {
    id: 'animal_10',
    text_key: 'tests.spirit_animal.questions.q10',
    type: 'multiple_choice',
    options: [
      { value: 'adventure_risk', text_key: 'tests.spirit_animal.options.q10_a' },
      { value: 'knowledge_learning', text_key: 'tests.spirit_animal.options.q10_b' },
      { value: 'harmony_peace', text_key: 'tests.spirit_animal.options.q10_c' },
      { value: 'transformation_growth', text_key: 'tests.spirit_animal.options.q10_d' }
    ]
  }
];

// Scoring functions for new tests
const generalKnowledgeScoring = (
  answers: Record<string, string>,
  partnerAnswers?: Record<string, string>,
  questionsData?: Array<{id: string, correctAnswer: string}> | { [questionId: string]: string },
  questions?: TestQuestion[]
) => {
  // Process correct answers data - handle both array and object formats
  let correctAnswers: Record<string, string> = {};

  if (questionsData) {
    if (Array.isArray(questionsData) && questionsData.length > 0) {
      // Use the correct answers from the database questions (array format)
      questionsData.forEach(q => {
        correctAnswers[q.id] = q.correctAnswer;
      });
    } else if (!Array.isArray(questionsData)) {
      // Use the correct answers in object format
      correctAnswers = questionsData;
    }
  } else {
    // Fallback to hardcoded answers for legacy questions
    correctAnswers = {
      // Original 10 questions
      'gk_1': 'jordan', // Petra
      'gk_2': 'venus', // Brightest planet
      'gk_3': 'da_vinci', // Mona Lisa
      'gk_4': 'pacific', // Largest ocean
      'gk_5': 'shakespeare', // Romeo and Juliet
      'gk_6': 'hydrogen', // Most abundant element
      'gk_7': '1912', // Titanic sank
      'gk_8': 'nile', // Longest river
      'gk_9': 'einstein', // Theory of Relativity
      'gk_10': 'asia', // Largest continent

      // Additional hardcoded questions...
      'gk_11': 'Au', 'gk_12': '206', 'gk_13': 'cheetah', 'gk_14': 'nitrogen', 'gk_15': '3',
      'gk_16': '1945', 'gk_17': 'neil_armstrong', 'gk_18': 'lighthouse', 'gk_19': '1989', 'gk_20': 'augustus',
      'gk_21': 'shakespeare', 'gk_22': 'van_gogh', 'gk_23': 'mockingbird', 'gk_24': 'vivaldi', 'gk_25': 'louvre',
      'gk_26': '4_years', 'gk_27': 'football', 'gk_28': 'spielberg', 'gk_29': 'french_open', 'gk_30': 'world_wide_web',
      'gk_31': 'italy', 'gk_32': 'avocado', 'gk_33': 'mandarin', 'gk_34': 'peru', 'gk_35': 'vatican',
      'gk_36': 'diamond', 'gk_37': '4', 'gk_38': 'skin', 'gk_39': 'o_negative', 'gk_40': 'deoxyribonucleic_acid',
      'gk_41': '3.14', 'gk_42': '30', 'gk_43': '6', 'gk_44': '12', 'gk_45': '50',
      'gk_46': 'bill_gates', 'gk_47': 'central_processing_unit', 'gk_48': 'apple', 'gk_49': '2007', 'gk_50': 'javascript'
    };
  }

  // Only score the questions that were actually answered
  console.log('🔍 General Knowledge Scoring Debug:', {
    answers,
    questionsData: questionsData ? 'present' : 'missing',
    questions: questions ? `${questions.length} questions` : 'no questions',
    correctAnswersProcessed: correctAnswers,
    correctAnswersKeys: Object.keys(correctAnswers)
  });

  const answeredQuestions = Object.keys(answers);
  const validCorrectAnswers = Object.fromEntries(
    Object.entries(correctAnswers).filter(([questionId]) =>
      answeredQuestions.includes(questionId)
    )
  );

  let score = 0;
  const total = Object.keys(validCorrectAnswers).length;

  Object.entries(validCorrectAnswers).forEach(([questionId, correctAnswer]) => {
    if (answers[questionId] === correctAnswer) {
      score++;
    }
  });

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  let level = '';
  let description = '';

  if (percentage >= 90) {
    level = 'Genius Level 🧠';
    description = 'Outstanding! You have exceptional general knowledge.';
  } else if (percentage >= 70) {
    level = 'Knowledge Master 📚';
    description = 'Excellent! You have strong general knowledge.';
  } else if (percentage >= 50) {
    level = 'Well-Informed 🎯';
    description = 'Good job! You have solid general knowledge.';
  } else if (percentage >= 30) {
    level = 'Learning Enthusiast 🌱';
    description = 'Keep learning! There\'s always room to grow.';
  } else {
    level = 'Curious Beginner 🔍';
    description = 'Everyone starts somewhere. Keep exploring!';
  }

  const finalResult = {
    scores: {
      score,
      total,
      percentage,
      level,
      description,
      correctAnswers: Object.entries(validCorrectAnswers).map(([id, answer]) => {
        // Find the question data to include text and options
        const questionData = questions?.find(q => q.id === id);
        console.log('🔍 General Knowledge - Processing question:', {
          id,
          answer,
          questionData: questionData ? 'found' : 'not found',
          questionText: questionData?.text_key,
          optionsCount: questionData?.options ? questionData.options.length : 0
        });

        // Convert options array to object format for display
        let optionsObject: { [key: string]: string } = {};
        if (questionData?.options) {
          if (Array.isArray(questionData.options)) {
            // Convert array format [{ value: 'a', text_key: 'Option A' }] to { a: 'Option A' }
            questionData.options.forEach(option => {
              if (option.value) {
                // For database questions, text_key contains the actual text, not a translation key
                const optionText = option.text_key || String(option);
                optionsObject[option.value] = optionText;
              }
            });
          } else {
            // Already in object format
            // Handle case where options might be objects themselves
            Object.entries(questionData.options).forEach(([key, value]) => {
              optionsObject[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            });
          }
        }

        return {
          questionId: id,
          correctAnswer: answer,
          userAnswer: answers[id],
          isCorrect: answers[id] === answer,
          questionText: questionData?.text_key || `Question ${id}`,
          options: optionsObject
        };
      })
    },
    type: level,
    description_key: description,
    traits: [`${score}/${total} correct`, `${percentage}% accuracy`]
  };

  console.log('🔍 General Knowledge Final Result:', finalResult);
  console.log('🔍 General Knowledge - Correct answers array length:', finalResult.scores.correctAnswers.length);
  if (finalResult.scores.correctAnswers.length > 0) {
    console.log('🔍 General Knowledge - First answer details:', finalResult.scores.correctAnswers[0]);
  }
  return finalResult;
};

const mathSpeedScoring = (answers: Record<string, string>, partnerAnswers?: Record<string, string>, correctAnswersData?: Array<{id: string, correctAnswer: string}> | { [questionId: string]: string }, questions?: TestQuestion[]) => {
  console.log('🔍 Math Speed Scoring Debug:', {
    answers,
    answerKeys: Object.keys(answers),
    answerValues: Object.values(answers),
    correctAnswersData
  });

  // TEMPORARY DEBUG: Log each individual answer
  Object.entries(answers).forEach(([key, value]) => {
    console.log(`🔍 ANSWER ${key}: "${value}" (type: ${typeof value})`);
  });

  // Process correct answers data - handle both array and object formats
  let correctAnswers: { [questionId: string]: string };

  if (correctAnswersData) {
    if (Array.isArray(correctAnswersData)) {
      // Convert array format to object format for consistent processing
      correctAnswers = {};
      correctAnswersData.forEach(item => {
        correctAnswers[item.id] = item.correctAnswer;
      });
    } else {
      // Already in object format
      correctAnswers = correctAnswersData;
    }
  } else {
    // Fall back to static answers
    correctAnswers = {
      'math_1': '17', // 8 + 9 = 17
      'math_2': '72', // 8 × 9 = 72
      'math_3': '13', // 91 ÷ 7 = 13
      'math_4': '154', // 77 × 2 = 154
      'math_5': '8', // √64 = 8
      'math_6': '144', // 12² = 144
      'math_7': '72', // 12 × 6 = 72
      'math_8': '15', // 63 ÷ 3 - 6 = 21 - 6 = 15
      'math_9': '36', // 6³ ÷ 6 = 216 ÷ 6 = 36
      'math_10': '125' // 25 × 5 = 125
    };
  }

  let score = 0;
  // Use the number of questions the user actually answered, not the total in database
  const total = Object.keys(answers).length;

  console.log('🔍 QUESTION ID DEBUG: Looking for answers with these IDs:', Object.keys(correctAnswers));
  console.log('🔍 ACTUAL ANSWER IDs received:', Object.keys(answers));

  // If we have database correct answers, use direct question ID matching
  if (correctAnswersData) {
    console.log('🔍 Using DATABASE scoring with direct question ID matching');
    Object.entries(answers).forEach(([questionId, userAnswer]) => {
      const correctAnswer = correctAnswers[questionId];
      console.log(`Question ${questionId}: user="${userAnswer}" correct="${correctAnswer}"`);

      if (userAnswer === correctAnswer) {
        score++;
        console.log(`✅ MATCH! Question ${questionId} correct`);
      } else {
        console.log(`❌ NO MATCH: Question ${questionId} - "${userAnswer}" ≠ "${correctAnswer}"`);
      }
    });
  } else {
    console.log('🔍 Using STATIC scoring with index-based matching');
    // For static questions, use index-based matching
    const questionOrder = ['math_1', 'math_2', 'math_3', 'math_4', 'math_5', 'math_6', 'math_7', 'math_8', 'math_9', 'math_10'];
    const answerKeys = Object.keys(answers);

    questionOrder.forEach((expectedId, index) => {
      const actualQuestionId = answerKeys[index];
      const userAnswer = answers[actualQuestionId];
      const correctAnswer = correctAnswers[expectedId as keyof typeof correctAnswers];

      console.log(`Question ${index + 1} (${expectedId}): user="${userAnswer}" correct="${correctAnswer}" actualId="${actualQuestionId}"`);

      if (userAnswer === correctAnswer) {
        score++;
        console.log(`✅ MATCH! Question ${index + 1} correct`);
      } else {
        console.log(`❌ NO MATCH: Question ${index + 1} - "${userAnswer}" ≠ "${correctAnswer}"`);
      }
    });
  }
  
  const percentage = Math.round((score / total) * 100);

  console.log(`🔍 FINAL SCORE: ${score}/${total} (${percentage}%)`);

  let level = '';
  let description = '';

  if (percentage >= 90) {
    level = 'Math Wizard ⚡';
    description = 'Lightning fast! You\'re a mathematical genius.';
  } else if (percentage >= 70) {
    level = 'Quick Calculator 🧮';
    description = 'Impressive speed! You have strong math skills.';
  } else if (percentage >= 50) {
    level = 'Steady Solver 📊';
    description = 'Good work! You handle math problems well.';
  } else {
    level = 'Math Explorer 🔢';
    description = 'Keep practicing! Speed comes with experience.';
  }

  const result = {
    scores: {
      score,
      total,
      percentage,
      level,
      description,
      correctAnswers: Object.entries(correctAnswers).map(([id, answer]) => {
        // Find the question data to include text and options
        const questionData = questions?.find(q => q.id === id);
        console.log('🔍 MATH SPEED - Processing question:', id, 'questionData:', questionData);
        console.log('🔍 MATH SPEED - Options structure:', {
          hasOptions: !!questionData?.options,
          optionsType: typeof questionData?.options,
          isArray: Array.isArray(questionData?.options),
          optionsRaw: questionData?.options,
          optionsKeys: questionData?.options ? Object.keys(questionData.options) : 'none'
        });

        // Convert options array to object format for display
        let optionsObject: { [key: string]: string } = {};
        if (questionData?.options) {
          console.log('🔍 MATH SPEED - Raw options:', questionData.options);
          console.log('🔍 MATH SPEED - Is array?', Array.isArray(questionData.options));

          if (Array.isArray(questionData.options)) {
            // Convert array format [{ value: 'a', text_key: 'Option A' }] to { a: 'Option A' }
            console.log('🔍 MATH SPEED - Processing array format options');
            questionData.options.forEach((option, index) => {
              console.log('🔍 MATH SPEED - Option', index, ':', option, 'type:', typeof option);
              if (option && typeof option === 'object' && option.value) {
                // For database questions, text_key contains the actual text, not a translation key
                const optionText = option.text_key || String(option);
                optionsObject[option.value] = optionText;
                console.log('🔍 MATH SPEED - Added option:', option.value, '=', optionText);
              } else {
                console.log('🔍 MATH SPEED - Skipping invalid option:', option);
              }
            });
          } else {
            // Already in object format - but check if it's actually an options array incorrectly assigned
            console.log('🔍 MATH SPEED - Processing object format options');
            console.log('🔍 MATH SPEED - Object keys:', Object.keys(questionData.options));
            Object.entries(questionData.options).forEach(([key, value]) => {
              console.log('🔍 MATH SPEED - Object entry:', key, '=', value, 'type:', typeof value);
              optionsObject[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            });
          }
        } else {
          console.log('🔍 MATH SPEED - No options found for question:', id);
        }

        console.log('🔍 MATH SPEED - Final optionsObject:', optionsObject);

        return {
          questionId: id,
          correctAnswer: answer,
          userAnswer: answers[id],
          isCorrect: answers[id] === answer,
          questionText: questionData?.text_key || `Question ${id}`,
          options: optionsObject
        };
      })
    },
    type: level,
    description_key: description,
    traits: [`${score}/${total} correct`, `${percentage}% accuracy`]
  };

  console.log('🔍 Math Speed Final Result:', result);
  return result;
};

const memoryPowerScoring = (
  answers: Record<string, string>,
  partnerAnswers?: Record<string, string>,
  questionsData?: Array<{id: string, correctAnswer: string}> | { [questionId: string]: string },
  questions?: TestQuestion[]
) => {
  console.log('🔍 MEMORY POWER SCORING - Starting scoring with:', {
    answers,
    questionsData,
    hasQuestions: !!questions
  });
  // Process correct answers data - handle both array and object formats
  let correctAnswers: Record<string, string> = {};

  if (questionsData) {
    if (Array.isArray(questionsData) && questionsData.length > 0) {
      // Use the correct answers from the database questions (array format)
      questionsData.forEach(q => {
        correctAnswers[q.id] = q.correctAnswer;
      });
    } else if (!Array.isArray(questionsData)) {
      // Use the correct answers in object format
      correctAnswers = questionsData;
    }
  } else {
    // Fallback to hardcoded answers for legacy questions
    correctAnswers = {
      'memory_1': 'sequence_2',
      'memory_2': 'pattern_3',
      'memory_3': 'word_list_1'
    };
  }

  // Calculate score based on actual answers
  let score = 0;
  const questionIds = Object.keys(answers);
  const total = questionIds.length;

  questionIds.forEach(questionId => {
    if (correctAnswers[questionId] && answers[questionId] === correctAnswers[questionId]) {
      score++;
    }
  });

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  let level = '';
  let description = '';

  if (percentage >= 90) {
    level = 'Memory Master 🧠';
    description = 'Exceptional! You have outstanding memory power.';
  } else if (percentage >= 70) {
    level = 'Sharp Mind 💡';
    description = 'Great! You have strong memory abilities.';
  } else if (percentage >= 50) {
    level = 'Good Recall 🎯';
    description = 'Well done! You have solid memory skills.';
  } else {
    level = 'Memory Builder 🏗️';
    description = 'Keep training! Memory improves with practice.';
  }

  const finalResult = {
    scores: {
      score,
      total,
      percentage,
      level,
      description,
      correctAnswers: Object.entries(correctAnswers).map(([id, answer]) => {
        // Find the question data to include text and options
        // For database questions, try to find from questionsData first, then fallback to static questions
        let questionData = questions?.find(q => q.id === id);

        // If not found in static questions and we have database questionsData, look there
        if (!questionData && Array.isArray(questionsData)) {
          const dbQuestion = questionsData.find(q => q.id === id);
          if (dbQuestion) {
            console.log('🔍 MEMORY POWER - Using database question for', id);
            // Convert database question format to our expected format
            questionData = {
              id: dbQuestion.id,
              text_key: (dbQuestion as any).question || `Question ${id}`,
              type: 'multiple_choice',
              options: (dbQuestion as any).options || []
            };
          }
        }

        // Convert options array to object format for display
        let optionsObject: { [key: string]: string } = {};
        if (questionData?.options) {
          if (Array.isArray(questionData.options)) {
            // Convert array format [{ value: 'a', text_key: 'Option A' }] to { a: 'Option A' }
            questionData.options.forEach(option => {
              if (option.value) {
                // For database questions, text_key contains the actual text, not a translation key
                const optionText = option.text_key || String(option);
                optionsObject[option.value] = optionText;
              }
            });
          } else {
            // Already in object format
            // Handle case where options might be objects themselves
            Object.entries(questionData.options).forEach(([key, value]) => {
              optionsObject[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            });
          }
        }

        return {
          questionId: id,
          correctAnswer: answer,
          userAnswer: answers[id],
          isCorrect: answers[id] === answer,
          questionText: questionData?.text_key || `Question ${id}`,
          options: optionsObject
        };
      })
    },
    type: level,
    description_key: description,
    traits: [`${score}/${total} correct`, `${percentage}% accuracy`]
  };

  console.log('🔍 MEMORY POWER SCORING - Final result:', finalResult);
  console.log('🔍 MEMORY POWER SCORING - Correct answers array length:', finalResult.scores.correctAnswers.length);
  console.log('🔍 MEMORY POWER SCORING - First answer details:', finalResult.scores.correctAnswers[0]);
  return finalResult;
};

const countryMatchScoring = (answers: Record<string, string>) => {
  let countryScores: Record<string, number> = {
    italy: 0,
    japan: 0,
    mexico: 0,
    france: 0,
    norway: 0,
    brazil: 0,
    spain: 0,
    australia: 0,
    south_korea: 0,
    netherlands: 0,
    canada: 0,
    thailand: 0
  };

  // Question 1: Daily rhythm
  if (answers['country_1'] === 'afternoon_person') countryScores.italy += 2;
  if (answers['country_1'] === 'early_riser') countryScores.japan += 2;
  if (answers['country_1'] === 'night_owl') countryScores.spain += 2;
  if (answers['country_1'] === 'whenever') countryScores.australia += 1;

  // Question 2: Food preferences
  if (answers['country_2'] === 'pasta_pizza') countryScores.italy += 3;
  if (answers['country_2'] === 'sushi_ramen') countryScores.japan += 3;
  if (answers['country_2'] === 'tacos_burritos') countryScores.mexico += 3;
  if (answers['country_2'] === 'croissant_cheese') countryScores.france += 3;

  // Question 3: Environment preference
  if (answers['country_3'] === 'beach_sun') {
    countryScores.italy += 2;
    countryScores.brazil += 2;
    countryScores.spain += 2;
    countryScores.australia += 2;
  }
  if (answers['country_3'] === 'mountains_hiking') {
    countryScores.norway += 2;
    countryScores.canada += 2;
  }
  if (answers['country_3'] === 'city_culture') {
    countryScores.france += 2;
    countryScores.south_korea += 2;
  }
  if (answers['country_3'] === 'countryside_peace') {
    countryScores.netherlands += 2;
    countryScores.norway += 1;
  }

  // Question 4: Social preferences
  if (answers['country_4'] === 'very_social') {
    countryScores.brazil += 2;
    countryScores.spain += 2;
    countryScores.mexico += 2;
  }
  if (answers['country_4'] === 'love_solitude') {
    countryScores.norway += 2;
    countryScores.canada += 1;
  }
  if (answers['country_4'] === 'prefer_small_groups') {
    countryScores.netherlands += 2;
    countryScores.japan += 1;
  }

  // Question 5: Climate preference
  if (answers['country_5'] === 'warm_tropical') {
    countryScores.brazil += 2;
    countryScores.thailand += 3;
    countryScores.australia += 2;
  }
  if (answers['country_5'] === 'cool_crisp') {
    countryScores.norway += 2;
    countryScores.canada += 2;
  }
  if (answers['country_5'] === 'mild_pleasant') {
    countryScores.france += 1;
    countryScores.netherlands += 2;
  }
  if (answers['country_5'] === 'four_seasons') {
    countryScores.south_korea += 2;
    countryScores.japan += 1;
  }

  // Question 6: Food flavor preferences
  if (answers['country_6'] === 'spicy_bold') {
    countryScores.mexico += 2;
    countryScores.thailand += 3;
    countryScores.south_korea += 2;
  }
  if (answers['country_6'] === 'sweet_comforting') {
    countryScores.netherlands += 2;
    countryScores.japan += 1;
  }
  if (answers['country_6'] === 'fresh_healthy') {
    countryScores.japan += 2;
    countryScores.norway += 1;
  }
  if (answers['country_6'] === 'rich_indulgent') {
    countryScores.france += 2;
    countryScores.italy += 2;
  }

  // Question 7: Hobbies
  if (answers['country_7'] === 'dancing_music') {
    countryScores.brazil += 3;
    countryScores.spain += 2;
  }
  if (answers['country_7'] === 'reading_learning') {
    countryScores.japan += 2;
    countryScores.norway += 1;
  }
  if (answers['country_7'] === 'sports_games') {
    countryScores.australia += 2;
    countryScores.canada += 1;
  }
  if (answers['country_7'] === 'art_crafts') {
    countryScores.italy += 2;
    countryScores.france += 2;
  }

  // Question 8: Travel style
  if (answers['country_8'] === 'adventure_travel') {
    countryScores.australia += 3;
    countryScores.norway += 2;
  }
  if (answers['country_8'] === 'luxury_comfort') {
    countryScores.france += 2;
    countryScores.italy += 1;
  }
  if (answers['country_8'] === 'cultural_history') {
    countryScores.japan += 2;
    countryScores.south_korea += 2;
  }
  if (answers['country_8'] === 'nature_wildlife') {
    countryScores.canada += 3;
    countryScores.australia += 2;
  }

  // Question 9: Values
  if (answers['country_9'] === 'family_traditions') {
    countryScores.mexico += 3;
    countryScores.south_korea += 2;
  }
  if (answers['country_9'] === 'innovation_technology') {
    countryScores.japan += 3;
    countryScores.south_korea += 2;
  }
  if (answers['country_9'] === 'work_life_balance') {
    countryScores.norway += 3;
    countryScores.netherlands += 2;
  }
  if (answers['country_9'] === 'community_helping') {
    countryScores.canada += 2;
    countryScores.thailand += 2;
  }

  // Question 10: Lifestyle pace
  if (answers['country_10'] === 'fast_paced') {
    countryScores.japan += 2;
    countryScores.south_korea += 2;
  }
  if (answers['country_10'] === 'relaxed_slow') {
    countryScores.thailand += 3;
    countryScores.spain += 2;
  }
  if (answers['country_10'] === 'structured_organized') {
    countryScores.japan += 2;
    countryScores.netherlands += 2;
  }
  if (answers['country_10'] === 'spontaneous_flexible') {
    countryScores.brazil += 2;
    countryScores.australia += 2;
  }

  // Find the country with highest score
  const topCountry = Object.entries(countryScores).reduce((a, b) =>
    countryScores[a[0]] > countryScores[b[0]] ? a : b
  );

  const countryInfo = {
    italy: { flag: '🇮🇹', name: 'Italy', description: 'You\'re passionate, artistic, and love the good life! La dolce vita suits you perfectly. You appreciate beauty, family, and taking time to savor life\'s pleasures.' },
    japan: { flag: '🇯🇵', name: 'Japan', description: 'You\'re disciplined, thoughtful, and appreciate beauty in simplicity. Zen is your way! You value tradition, harmony, and continuous improvement in all aspects of life.' },
    mexico: { flag: '🇲🇽', name: 'Mexico', description: 'You\'re vibrant, warm, and love celebrating life with family and friends. ¡Viva la vida! You bring joy and energy wherever you go, and family means everything to you.' },
    france: { flag: '🇫🇷', name: 'France', description: 'You\'re sophisticated, cultured, and have an appreciation for the finer things. Très chic! You love art, excellent food, and intellectual conversations.' },
    norway: { flag: '🇳🇴', name: 'Norway', description: 'You\'re independent, nature-loving, and find peace in simplicity. Hygge is your lifestyle! You value equality, outdoor adventures, and cozy moments.' },
    brazil: { flag: '🇧🇷', name: 'Brazil', description: 'You\'re energetic, social, and bring sunshine wherever you go. Vida boa! You love music, dancing, and making connections with people from all walks of life.' },
    spain: { flag: '🇪🇸', name: 'Spain', description: 'You\'re passionate, lively, and know how to enjoy life! Siesta and fiesta perfectly capture your spirit. You love late nights, good food, and vibrant celebrations.' },
    australia: { flag: '🇦🇺', name: 'Australia', description: 'You\'re laid-back, adventurous, and have a great sense of humor! No worries, mate! You love the outdoors, trying new things, and living life with an easy-going attitude.' },
    south_korea: { flag: '🇰🇷', name: 'South Korea', description: 'You\'re dynamic, tech-savvy, and appreciate both tradition and innovation! You love learning, connecting with others, and experiencing the perfect blend of old and new.' },
    netherlands: { flag: '🇳🇱', name: 'Netherlands', description: 'You\'re practical, open-minded, and value balance in life! You appreciate efficiency, cycling everywhere, and creating cozy, comfortable spaces for yourself and others.' },
    canada: { flag: '🇨🇦', name: 'Canada', description: 'You\'re friendly, polite, and love the great outdoors! Eh? You value kindness, diversity, and endless natural beauty. You\'re the person everyone wants as a neighbor!' },
    thailand: { flag: '🇹🇭', name: 'Thailand', description: 'You\'re peaceful, spiritual, and love life\'s simple pleasures! Sabai sabai is your motto. You appreciate spicy food, warm hearts, and finding inner tranquility.'  }
  };
  
  return {
    scores: {
      country: topCountry[0],
      countryData: countryInfo[topCountry[0] as keyof typeof countryInfo].description,
      score: topCountry[1],
      allScores: Object.entries(countryScores).map(([country, score]) => `${country}: ${score}`).join(', ')
    },
    type: `${countryInfo[topCountry[0] as keyof typeof countryInfo].flag} ${countryInfo[topCountry[0] as keyof typeof countryInfo].name}`,
    description_key: countryInfo[topCountry[0] as keyof typeof countryInfo].description,
    traits: [`Matched: ${countryInfo[topCountry[0] as keyof typeof countryInfo].name}`, `Score: ${topCountry[1]} points`]
  };
};

const mentalAgeScoring = (answers: Record<string, string>) => {
  let agePoints = 25; // Start at 25

  // Question 1: Free time activity
  if (answers['age_1'] === 'video_games') agePoints -= 5;
  if (answers['age_1'] === 'reading_book') agePoints += 10;
  if (answers['age_1'] === 'social_media') agePoints -= 3;
  if (answers['age_1'] === 'gardening') agePoints += 15;

  // Question 2: Humor style
  if (answers['age_2'] === 'memes_jokes') agePoints -= 3;
  if (answers['age_2'] === 'witty_wordplay') agePoints += 5;
  if (answers['age_2'] === 'slapstick_physical') agePoints -= 2;
  if (answers['age_2'] === 'dry_sarcastic') agePoints += 10;

  // Question 3: Communication style
  if (answers['age_3'] === 'text_immediately') agePoints -= 5;
  if (answers['age_3'] === 'call_right_away') agePoints -= 2;
  if (answers['age_3'] === 'think_then_respond') agePoints += 5;
  if (answers['age_3'] === 'write_letter') agePoints += 20;

  // Question 4: Fashion style
  if (answers['age_4'] === 'latest_trends') agePoints -= 5;
  if (answers['age_4'] === 'comfortable_classic') agePoints += 5;
  if (answers['age_4'] === 'practical_functional') agePoints += 10;
  if (answers['age_4'] === 'whatever_clean') agePoints += 3;

  // Question 5: Night preference
  if (answers['age_5'] === 'party_friends') agePoints -= 5;
  if (answers['age_5'] === 'dinner_partner') agePoints += 8;
  if (answers['age_5'] === 'movie_home') agePoints += 5;
  if (answers['age_5'] === 'early_bed') agePoints += 15;

  // Question 6: Technology approach
  if (answers['age_6'] === 'latest_gadgets') agePoints -= 4;
  if (answers['age_6'] === 'reliable_proven') agePoints += 8;
  if (answers['age_6'] === 'simple_basic') agePoints += 12;
  if (answers['age_6'] === 'dont_need_much') agePoints += 18;

  // Question 7: Life priorities
  if (answers['age_7'] === 'adventure_excitement') agePoints -= 3;
  if (answers['age_7'] === 'comfort_familiar') agePoints += 8;
  if (answers['age_7'] === 'learning_growth') agePoints += 5;
  if (answers['age_7'] === 'peace_quiet') agePoints += 15;

  // Question 8: Money approach
  if (answers['age_8'] === 'spend_enjoy') agePoints -= 6;
  if (answers['age_8'] === 'save_some_spend') agePoints += 3;
  if (answers['age_8'] === 'invest_future') agePoints += 10;
  if (answers['age_8'] === 'save_everything') agePoints += 20;

  // Question 9: Problem handling
  if (answers['age_9'] === 'avoid_stress') agePoints -= 2;
  if (answers['age_9'] === 'complain_vent') agePoints -= 1;
  if (answers['age_9'] === 'solve_directly') agePoints += 5;
  if (answers['age_9'] === 'accept_adapt') agePoints += 12;

  // Question 10: Entertainment choice
  if (answers['age_10'] === 'viral_trending') agePoints -= 4;
  if (answers['age_10'] === 'friends_recommendations') agePoints += 2;
  if (answers['age_10'] === 'critic_reviews') agePoints += 8;
  if (answers['age_10'] === 'classic_timeless') agePoints += 15;

  // Ensure reasonable bounds with more variety
  const mentalAge = Math.max(14, Math.min(85, agePoints));

  let description = '';
  let category = '';
  let emoji = '';

  if (mentalAge < 18) {
    category = 'Teen Spirit 🌟';
    emoji = '🌟';
    description = 'You have an incredibly youthful, energetic spirit! You see the world with fresh eyes and endless possibilities. Life is your playground!';
  } else if (mentalAge < 23) {
    category = 'Young Explorer 🚀';
    emoji = '🚀';
    description = 'You\'re young at heart with a thirst for adventure! You balance spontaneity with some wisdom, making you fun and exciting to be around.';
  } else if (mentalAge < 30) {
    category = 'Balanced Adventurer ⚖️';
    emoji = '⚖️';
    description = 'You beautifully balance fun and responsibility! You know when to let loose and when to be serious, making you incredibly well-rounded.';
  } else if (mentalAge < 40) {
    category = 'Thoughtful Achiever 🎯';
    emoji = '🎯';
    description = 'You\'re mature and thoughtful with great life perspective. You make decisions carefully and appreciate both simple and complex pleasures.';
  } else if (mentalAge < 50) {
    category = 'Wise Counselor 🧠';
    emoji = '🧠';
    description = 'You have the wisdom of experience and appreciate life\'s subtleties. People come to you for advice because of your deep understanding.';
  } else if (mentalAge < 65) {
    category = 'Sage Philosopher 📚';
    emoji = '📚';
    description = 'You\'re a wise soul with profound insights into life. You value depth over superficiality and have developed a rich inner world.';
  } else {
    category = 'Ancient Soul 🌸';
    emoji = '🌸';
    description = 'You\'re an old soul with transcendent wisdom and infinite patience. You see the bigger picture and understand life\'s deeper meanings.';
  }

  return {
    scores: {
      mentalAge,
      description,
      category,
      emoji,
      ageRange: mentalAge < 25 ? '14-24: Young & Free' :
                mentalAge < 40 ? '25-39: Balanced & Wise' :
                mentalAge < 60 ? '40-59: Experienced & Deep' : '60+: Ancient & Sage'
    },
    type: `${emoji} Mental Age: ${mentalAge}`,
    description_key: description,
    traits: [`Age: ${mentalAge}`, category, `Personality: ${mentalAge < 30 ? 'Energetic' : mentalAge < 50 ? 'Balanced' : 'Wise'}`]
  };
};

const spiritAnimalScoring = (answers: Record<string, string>) => {
  let animalScores: Record<string, number> = {
    lion: 0,
    owl: 0,
    wolf: 0,
    eagle: 0,
    dolphin: 0,
    bear: 0,
    fox: 0,
    turtle: 0,
    butterfly: 0,
    tiger: 0,
    elephant: 0,
    deer: 0
  };
  
  // Question 1: Leadership style
  if (answers['animal_1'] === 'lead_group') {
    animalScores.lion += 3;
    animalScores.tiger += 2;
  }
  if (answers['animal_1'] === 'work_independently') {
    animalScores.eagle += 2;
    animalScores.fox += 2;
  }
  if (answers['animal_1'] === 'observe_analyze') {
    animalScores.owl += 3;
    animalScores.turtle += 2;
  }
  if (answers['animal_1'] === 'support_others') {
    animalScores.wolf += 2;
    animalScores.elephant += 3;
  }

  // Question 2: Environment preference
  if (answers['animal_2'] === 'ocean_depths') {
    animalScores.dolphin += 3;
    animalScores.turtle += 2;
  }
  if (answers['animal_2'] === 'forest_trees') {
    animalScores.bear += 2;
    animalScores.deer += 3;
    animalScores.fox += 2;
  }
  if (answers['animal_2'] === 'mountain_peaks') {
    animalScores.eagle += 3;
    animalScores.tiger += 2;
  }
  if (answers['animal_2'] === 'open_plains') {
    animalScores.lion += 2;
    animalScores.elephant += 2;
  }

  // Question 3: Core values
  if (answers['animal_3'] === 'strength_courage') {
    animalScores.lion += 2;
    animalScores.tiger += 3;
    animalScores.bear += 2;
  }
  if (answers['animal_3'] === 'wisdom_intelligence') {
    animalScores.owl += 3;
    animalScores.elephant += 2;
  }
  if (answers['animal_3'] === 'loyalty_friendship') {
    animalScores.wolf += 3;
    animalScores.dolphin += 2;
  }
  if (answers['animal_3'] === 'freedom_independence') {
    animalScores.eagle += 2;
    animalScores.butterfly += 3;
  }

  // Question 4: Problem-solving approach
  if (answers['animal_4'] === 'face_directly') {
    animalScores.lion += 2;
    animalScores.tiger += 2;
  }
  if (answers['animal_4'] === 'think_strategize') {
    animalScores.owl += 2;
    animalScores.fox += 3;
  }
  if (answers['animal_4'] === 'seek_help') {
    animalScores.wolf += 2;
    animalScores.elephant += 2;
  }
  if (answers['animal_4'] === 'wait_observe') {
    animalScores.bear += 2;
    animalScores.deer += 2;
    animalScores.turtle += 3;
  }

  // Question 5: Time preference
  if (answers['animal_5'] === 'day_active') {
    animalScores.lion += 1;
    animalScores.butterfly += 2;
  }
  if (answers['animal_5'] === 'night_mysterious') {
    animalScores.owl += 2;
    animalScores.fox += 2;
  }
  if (answers['animal_5'] === 'dawn_fresh_start') {
    animalScores.deer += 2;
    animalScores.eagle += 1;
  }
  if (answers['animal_5'] === 'sunset_reflection') {
    animalScores.turtle += 2;
    animalScores.elephant += 1;
  }

  // Question 6: Activity preference
  if (answers['animal_6'] === 'competitive_winning') {
    animalScores.tiger += 3;
    animalScores.lion += 2;
  }
  if (answers['animal_6'] === 'creative_artistic') {
    animalScores.butterfly += 3;
    animalScores.fox += 2;
  }
  if (answers['animal_6'] === 'social_connecting') {
    animalScores.dolphin += 3;
    animalScores.wolf += 2;
  }
  if (answers['animal_6'] === 'peaceful_meditating') {
    animalScores.turtle += 3;
    animalScores.deer += 2;
  }

  // Question 7: Decision-making style
  if (answers['animal_7'] === 'fast_decisive') {
    animalScores.tiger += 2;
    animalScores.eagle += 2;
  }
  if (answers['animal_7'] === 'careful_methodical') {
    animalScores.owl += 2;
    animalScores.elephant += 2;
  }
  if (answers['animal_7'] === 'intuitive_feeling') {
    animalScores.deer += 3;
    animalScores.butterfly += 2;
  }
  if (answers['animal_7'] === 'patient_waiting') {
    animalScores.turtle += 3;
    animalScores.bear += 2;
  }

  // Question 8: How you help others
  if (answers['animal_8'] === 'protect_defend') {
    animalScores.bear += 3;
    animalScores.wolf += 2;
  }
  if (answers['animal_8'] === 'teach_guide') {
    animalScores.owl += 3;
    animalScores.elephant += 2;
  }
  if (answers['animal_8'] === 'play_entertain') {
    animalScores.dolphin += 3;
    animalScores.butterfly += 2;
  }
  if (answers['animal_8'] === 'explore_discover') {
    animalScores.fox += 3;
    animalScores.eagle += 2;
  }

  // Question 9: Greatest strength
  if (answers['animal_9'] === 'physical_strength') {
    animalScores.bear += 3;
    animalScores.tiger += 2;
  }
  if (answers['animal_9'] === 'mental_intelligence') {
    animalScores.owl += 3;
    animalScores.fox += 2;
  }
  if (answers['animal_9'] === 'emotional_empathy') {
    animalScores.deer += 3;
    animalScores.dolphin += 2;
  }
  if (answers['animal_9'] === 'spiritual_intuition') {
    animalScores.butterfly += 3;
    animalScores.turtle += 2;
  }

  // Question 10: Life philosophy
  if (answers['animal_10'] === 'adventure_risk') {
    animalScores.tiger += 2;
    animalScores.eagle += 2;
  }
  if (answers['animal_10'] === 'knowledge_learning') {
    animalScores.owl += 3;
    animalScores.elephant += 2;
  }
  if (answers['animal_10'] === 'harmony_peace') {
    animalScores.deer += 3;
    animalScores.turtle += 2;
  }
  if (answers['animal_10'] === 'transformation_growth') {
    animalScores.butterfly += 3;
    animalScores.fox += 2;
  }
  
  const topAnimal = Object.entries(animalScores).reduce((a, b) => 
    animalScores[a[0]] > animalScores[b[0]] ? a : b
  );
  
  const animalInfo = {
    lion: { emoji: '🦁', name: 'Lion', description: 'You\'re a natural born leader with courage and strength. You protect those you love and inspire others to greatness. Your presence commands respect, and your roar can rally troops to action.' },
    owl: { emoji: '🦉', name: 'Owl', description: 'You\'re wise, intuitive, and see what others miss. Your insight and intelligence guide you through life. You possess ancient wisdom and can navigate both light and shadow with grace.' },
    wolf: { emoji: '🐺', name: 'Wolf', description: 'You\'re loyal, protective, and thrive in community. Family and friendship mean everything to you. Your pack is your strength, and you\'d do anything to protect those you love.' },
    eagle: { emoji: '🦅', name: 'Eagle', description: 'You\'re independent, visionary, and soar above the ordinary. Freedom and perspective are your gifts. You see the big picture and inspire others to reach new heights.' },
    dolphin: { emoji: '🐬', name: 'Dolphin', description: 'You\'re playful, intelligent, and deeply social. Joy and connection flow naturally from you. Your emotional intelligence and ability to communicate make you a natural healer.' },
    bear: { emoji: '🐻', name: 'Bear', description: 'You\'re strong, grounded, and protective. You have great inner power and nurturing instincts. Your presence brings comfort and security to those around you.' },
    fox: { emoji: '🦊', name: 'Fox', description: 'You\'re clever, adaptable, and resourceful. Your wit and cunning help you navigate any situation. You possess the perfect balance of intelligence and playfulness.' },
    turtle: { emoji: '🐢', name: 'Turtle', description: 'You\'re patient, wise, and deeply connected to ancient knowledge. You understand that slow and steady wins the race. Your calm presence brings peace to chaotic situations.' },
    butterfly: { emoji: '🦋', name: 'Butterfly', description: 'You\'re transformative, graceful, and represent rebirth. Your journey of growth inspires others to embrace change. You bring beauty and magic wherever you go.' },
    tiger: { emoji: '🐅', name: 'Tiger', description: 'You\'re powerful, independent, and fiercely determined. Your strength and courage are legendary. You walk your own path with confidence and face challenges head-on.' },
    elephant: { emoji: '🐘', name: 'Elephant', description: 'You\'re wise, compassionate, and have an incredible memory. Your gentle strength and family bonds are unbreakable. You carry the wisdom of generations within you.' },
    deer: { emoji: '🦌', name: 'Deer', description: 'You\'re gentle, intuitive, and deeply sensitive to your surroundings. Your grace and alertness help you navigate life with elegance. You bring peace and natural beauty to the world.' }
  };
  
  return {
    scores: {
      animal: topAnimal[0],
      animalData: animalInfo[topAnimal[0] as keyof typeof animalInfo].description,
      score: topAnimal[1],
      allScores: Object.entries(animalScores).map(([animal, score]) => `${animal}: ${score}`).join(', ')
    },
    type: `${animalInfo[topAnimal[0] as keyof typeof animalInfo].emoji} ${animalInfo[topAnimal[0] as keyof typeof animalInfo].name}`,
    description_key: animalInfo[topAnimal[0] as keyof typeof animalInfo].description,
    traits: [`Spirit Animal: ${animalInfo[topAnimal[0] as keyof typeof animalInfo].name}`, `Score: ${topAnimal[1]} points`]
  };
};

export const testDefinitions: TestDefinition[] = [
  {
    id: 'mbti-classic',
    category: 'know-yourself',
    title_key: 'tests.mbti.title',
    description_key: 'tests.mbti.description',
    questions: fullMbtiQuestions,
    scoring: mbtiScoring,
    features: {
      popularity: 4,
      scientificValidity: 1,
      resultType: '16 "types"',
      testLength: 'Short (20-40 Qs)',
      engagement: 'Fun nicknames, memes',
      popularityNote: '(viral, shareable)'
    }
  },
  {
    id: 'big-five',
    category: 'know-yourself',
    title_key: 'tests.bigfive.title',
    description_key: 'tests.bigfive.description',
    questions: bigFiveQuestions,
    scoring: bigFiveScoring,
    features: {
      popularity: 2,
      scientificValidity: 5,
      resultType: '5 continuous trait scores',
      testLength: 'Medium (30-44 Qs recommended)',
      engagement: 'Charts, detailed personality profiles',
      popularityNote: '(less viral, more serious)'
    }
  },
  {
    id: 'enneagram',
    category: 'know-yourself',
    title_key: 'tests.enneagram.title',
    description_key: 'tests.enneagram.description',
    questions: enneagramQuestions,
    scoring: enneagramScoring,
    features: {
      popularity: 3,
      scientificValidity: 2,
      resultType: '9 personality types',
      testLength: 'Medium (18 Qs)',
      engagement: 'Core motivations, growth paths',
      popularityNote: '(spiritual, transformative)'
    }
  },
  {
    id: 'feedback-360',
    category: 'how-others-see-me',
    title_key: 'tests.feedback360.title',
    description_key: 'tests.feedback360.description',
    questions: getFeedback360Questions('general'), // Use dynamic system with general as default
    scoring: feedback360Scoring,
    requiresFeedback: true,
    features: {
      popularity: 3,
      scientificValidity: 4,
      resultType: 'Multi-perspective analysis',
      testLength: 'Long (20+ Qs per person)',
      engagement: 'Social insights, blind spots',
      popularityNote: '(professional, insightful)'
    }
  },
  {
    id: 'couple-compatibility',
    category: 'couple-compatibility',
    title_key: 'tests.couple.title',
    description_key: 'tests.couple.description',
    questions: coupleCompatibilityQuestions,
    scoring: coupleCompatibilityScoring,
    isCompatibilityTest: true,
    requiresFeedback: true, // Requires partner participation like 360° feedback
    features: {
      popularity: 4,
      scientificValidity: 3,
      resultType: 'Compatibility percentage',
      testLength: 'Medium (15 Qs each)',
      engagement: 'Relationship dynamics, tips',
      popularityNote: '(romantic, shareable)'
    }
  },

  // 🧠 Knowledge and Skill Tests
  {
    id: 'general-knowledge',
    category: 'knowledge-and-skill',
    title_key: 'tests.general_knowledge.title',
    description_key: 'tests.general_knowledge.description',
    questions: generalKnowledgeQuestions, // Will be replaced with dynamic questions in component
    scoring: generalKnowledgeScoring,
    features: {
      popularity: 4,
      scientificValidity: 3,
      resultType: 'Score & Level',
      testLength: 'Medium (10 Qs)',
      engagement: 'Trivia challenge, leaderboard potential',
      popularityNote: '(competitive, educational)'
    }
  },
  {
    id: 'math-speed',
    category: 'knowledge-and-skill',
    title_key: 'tests.math_speed.title',
    description_key: 'tests.math_speed.description',
    questions: mathSpeedQuestions,
    scoring: mathSpeedScoring,
    features: {
      popularity: 3,
      scientificValidity: 2,
      resultType: 'Speed & Accuracy',
      testLength: 'Medium (10 Qs)',
      engagement: 'Time pressure, gamified',
      popularityNote: '(addictive, competitive)'
    }
  },
  {
    id: 'memory-power',
    category: 'knowledge-and-skill',
    title_key: 'tests.memory_power.title',
    description_key: 'tests.memory_power.description',
    questions: memoryPowerQuestions,
    scoring: memoryPowerScoring,
    features: {
      popularity: 3,
      scientificValidity: 3,
      resultType: 'Memory Capacity',
      testLength: 'Short (3 challenges)',
      engagement: 'Pattern recognition, brain training',
      popularityNote: '(cognitive, challenging)'
    }
  },

  // 🎉 Just for Fun Tests
  {
    id: 'country-match',
    category: 'just-for-fun',
    title_key: 'tests.country_match.title',
    description_key: 'tests.country_match.description',
    questions: countryMatchQuestions,
    scoring: countryMatchScoring,
    features: {
      popularity: 5,
      scientificValidity: 1,
      resultType: 'Country match with flag',
      testLength: 'Medium (10 Qs)',
      engagement: 'Highly viral, shareable results',
      popularityNote: '(viral, meme-worthy)'
    }
  },
  {
    id: 'mental-age',
    category: 'just-for-fun',
    title_key: 'tests.mental_age.title',
    description_key: 'tests.mental_age.description',
    questions: mentalAgeQuestions,
    scoring: mentalAgeScoring,
    features: {
      popularity: 5,
      scientificValidity: 1,
      resultType: 'Mental age number',
      testLength: 'Medium (10 Qs)',
      engagement: 'Fun comparison, social sharing',
      popularityNote: '(relatable, surprising)'
    }
  },
  {
    id: 'spirit-animal',
    category: 'just-for-fun',
    title_key: 'tests.spirit_animal.title',
    description_key: 'tests.spirit_animal.description',
    questions: spiritAnimalQuestions,
    scoring: spiritAnimalScoring,
    features: {
      popularity: 5,
      scientificValidity: 1,
      resultType: 'Animal match with traits',
      testLength: 'Medium (10 Qs)',
      engagement: 'Beautiful graphics potential, spiritual',
      popularityNote: '(mystical, personal)'
    }
  }
];

// Helper functions
export const getTestById = (id: string): TestDefinition | undefined => {
  return testDefinitions.find(test => test.id === id);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(testDefinitions.map(test => test.category)));
};
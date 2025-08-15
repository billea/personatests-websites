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

export type ScoringFunction = (answers: { [questionId: string]: any }) => TestResult;

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
      minLabel_key: 'scale.getsOverwhelmed',
      maxLabel_key: 'scale.staysCalm'
    }
  },
  {
    id: 'universal_2',
    text_key: 'tests.feedback360.universal.q2',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.strugglesWithChange',
      maxLabel_key: 'scale.adaptsWellToChange'
    }
  },
  {
    id: 'universal_3',
    text_key: 'tests.feedback360.universal.q3',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorSelfDiscipline',
      maxLabel_key: 'scale.excellentSelfDiscipline'
    }
  },
  {
    id: 'universal_4',
    text_key: 'tests.feedback360.universal.q4',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.quietReserved',
      maxLabel_key: 'scale.outgoingEnergetic'
    }
  },
  {
    id: 'universal_5',
    text_key: 'tests.feedback360.universal.q5',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.closedToChange',
      maxLabel_key: 'scale.embracesNewIdeas'
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
      minLabel_key: 'scale.poorListener',
      maxLabel_key: 'scale.deeplyEmpathetic'
    }
  },
  {
    id: 'universal_7',
    text_key: 'tests.feedback360.universal.q7',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorCommunicator',
      maxLabel_key: 'scale.excellentCommunicator'
    }
  },
  {
    id: 'universal_8',
    text_key: 'tests.feedback360.universal.q8',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.avoidsConflict',
      maxLabel_key: 'scale.resolvesConstructively'
    }
  },
  {
    id: 'universal_9',
    text_key: 'tests.feedback360.universal.q9',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.unreliable',
      maxLabel_key: 'scale.dependable'
    }
  },
  {
    id: 'universal_10',
    text_key: 'tests.feedback360.universal.q10',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.notSupportive',
      maxLabel_key: 'scale.incrediblySupportive'
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
      minLabel_key: 'scale.waitsDirection',
      maxLabel_key: 'scale.proactiveLeader'
    }
  },
  {
    id: 'work_12',
    text_key: 'tests.feedback360.work.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorDecisions',
      maxLabel_key: 'scale.greatDecisions'
    }
  },
  {
    id: 'work_13',
    text_key: 'tests.feedback360.work.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.worksIsolation',
      maxLabel_key: 'scale.excellentTeamPlayer'
    }
  },
  {
    id: 'work_14',
    text_key: 'tests.feedback360.work.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.defensiveResistant',
      maxLabel_key: 'scale.welcomesGrowth'
    }
  },
  {
    id: 'work_15',
    text_key: 'tests.feedback360.work.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.conventionalThinking',
      maxLabel_key: 'scale.highlyInnovative'
    }
  },
  {
    id: 'work_16',
    text_key: 'tests.feedback360.work.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.performanceDrops',
      maxLabel_key: 'scale.thrivesUnderPressure'
    }
  },
  {
    id: 'work_17',
    text_key: 'tests.feedback360.work.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.notSupportive',
      maxLabel_key: 'scale.incrediblySupportive'
    }
  },
  {
    id: 'work_18',
    text_key: 'tests.feedback360.work.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorCommunicator',
      maxLabel_key: 'scale.excellentCommunicator'
    }
  },
  {
    id: 'work_19',
    text_key: 'tests.feedback360.work.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.unreliable',
      maxLabel_key: 'scale.dependable'
    }
  },
  {
    id: 'work_20',
    text_key: 'tests.feedback360.work.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.avoidsLearning',
      maxLabel_key: 'scale.continuousLearner'
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
      minLabel_key: 'scale.waitsDirection',
      maxLabel_key: 'scale.proactiveLeader'
    }
  },
  {
    id: 'friends_12',
    text_key: 'tests.feedback360.friends.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorListener',
      maxLabel_key: 'scale.deeplyEmpathetic'
    }
  },
  {
    id: 'friends_13',
    text_key: 'tests.feedback360.friends.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.cannotTrust',
      maxLabel_key: 'scale.completelyTrustworthy'
    }
  },
  {
    id: 'friends_14',
    text_key: 'tests.feedback360.friends.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.dampensMood',
      maxLabel_key: 'scale.bringsJoy'
    }
  },
  {
    id: 'friends_15',
    text_key: 'tests.feedback360.friends.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.exclusive',
      maxLabel_key: 'scale.highlyInclusive'
    }
  },
  {
    id: 'friends_16',
    text_key: 'tests.feedback360.friends.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.notSupportive',
      maxLabel_key: 'scale.incrediblySupportive'
    }
  },
  {
    id: 'friends_17',
    text_key: 'tests.feedback360.friends.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.makesConflictsWorse',
      maxLabel_key: 'scale.resolvesGracefully'
    }
  },
  {
    id: 'friends_18',
    text_key: 'tests.feedback360.friends.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.overstepsBoundaries',
      maxLabel_key: 'scale.perfectlyRespectful'
    }
  },
  {
    id: 'friends_19',
    text_key: 'tests.feedback360.friends.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorListener',
      maxLabel_key: 'scale.deeplyEmpathetic'
    }
  },
  {
    id: 'friends_20',
    text_key: 'tests.feedback360.friends.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.fairWeatherFriend',
      maxLabel_key: 'scale.deeplyLoyal'
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
      minLabel_key: 'scale.waitsDirection',
      maxLabel_key: 'scale.proactiveLeader'
    }
  },
  {
    id: 'family_12',
    text_key: 'tests.feedback360.family.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorListener',
      maxLabel_key: 'scale.deeplyEmpathetic'
    }
  },
  {
    id: 'family_13',
    text_key: 'tests.feedback360.family.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.worksIsolation',
      maxLabel_key: 'scale.excellentTeamPlayer'
    }
  },
  {
    id: 'family_14',
    text_key: 'tests.feedback360.family.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.createsMoreConflict',
      maxLabel_key: 'scale.helpsResolvePeacefully'
    }
  },
  {
    id: 'family_15',
    text_key: 'tests.feedback360.family.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorFamilyCommunicator',
      maxLabel_key: 'scale.excellentFamilyCommunicator'
    }
  },
  {
    id: 'family_16',
    text_key: 'tests.feedback360.family.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.disregardsTraditions',
      maxLabel_key: 'scale.upholdsFamilyValues'
    }
  },
  {
    id: 'family_17',
    text_key: 'tests.feedback360.family.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.becomesUnavailable',
      maxLabel_key: 'scale.stepsUpStrongly'
    }
  },
  {
    id: 'family_18',
    text_key: 'tests.feedback360.family.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.emotionallyDistant',
      maxLabel_key: 'scale.deeplySupportive'
    }
  },
  {
    id: 'family_19',
    text_key: 'tests.feedback360.family.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.selfFocused',
      maxLabel_key: 'scale.deeplyCaring'
    }
  },
  {
    id: 'family_20',
    text_key: 'tests.feedback360.family.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.avoidsResponsibility',
      maxLabel_key: 'scale.takesFullResponsibility'
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
      minLabel_key: 'scale.hindersGroupWork',
      maxLabel_key: 'scale.enhancesTeamLearning'
    }
  },
  {
    id: 'academic_12',
    text_key: 'tests.feedback360.academic.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.givesUpEasily',
      maxLabel_key: 'scale.perseveresChallenges'
    }
  },
  {
    id: 'academic_13',
    text_key: 'tests.feedback360.academic.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.keepsKnowledgePrivate',
      maxLabel_key: 'scale.freelySharesHelps'
    }
  },
  {
    id: 'academic_14',
    text_key: 'tests.feedback360.academic.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.acceptsWithoutQuestion',
      maxLabel_key: 'scale.strongCriticalThinker'
    }
  },
  {
    id: 'academic_15',
    text_key: 'tests.feedback360.academic.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.lowMotivation',
      maxLabel_key: 'scale.highlyMotivatedLearn'
    }
  },
  {
    id: 'academic_16',
    text_key: 'tests.feedback360.academic.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.questionableIntegrity',
      maxLabel_key: 'scale.strongAcademicIntegrity'
    }
  },
  {
    id: 'academic_17',
    text_key: 'tests.feedback360.academic.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorFeedbackSkills',
      maxLabel_key: 'scale.excellentFeedbackSkills'
    }
  },
  {
    id: 'academic_18',
    text_key: 'tests.feedback360.academic.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.limitedCuriosity',
      maxLabel_key: 'scale.intellectuallyCurious'
    }
  },
  {
    id: 'academic_19',
    text_key: 'tests.feedback360.academic.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.ineffectivePartner',
      maxLabel_key: 'scale.excellentStudyPartner'
    }
  },
  {
    id: 'academic_20',
    text_key: 'tests.feedback360.academic.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.repeatsMistakes',
      maxLabel_key: 'scale.learnsQuicklyErrors'
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
      minLabel_key: 'scale.actionsContradictValues',
      maxLabel_key: 'scale.valueActionAlignment'
    }
  },
  {
    id: 'general_12',
    text_key: 'tests.feedback360.general.q12',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.strugglesRecover',
      maxLabel_key: 'scale.highlyResilient'
    }
  },
  {
    id: 'general_13',
    text_key: 'tests.feedback360.general.q13',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorSelfControl',
      maxLabel_key: 'scale.excellentSelfDiscipline'
    }
  },
  {
    id: 'general_14',
    text_key: 'tests.feedback360.general.q14',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.pessimistic',
      maxLabel_key: 'scale.highlyOptimistic'
    }
  },
  {
    id: 'general_15',
    text_key: 'tests.feedback360.general.q15',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.arrogant',
      maxLabel_key: 'scale.genuinelyHumble'
    }
  },
  {
    id: 'general_16',
    text_key: 'tests.feedback360.general.q16',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.lacksCompassion',
      maxLabel_key: 'scale.deeplyCompassionate'
    }
  },
  {
    id: 'general_17',
    text_key: 'tests.feedback360.general.q17',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.avoidsDifficultStands',
      maxLabel_key: 'scale.courageouslyPrincipled'
    }
  },
  {
    id: 'general_18',
    text_key: 'tests.feedback360.general.q18',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.takesForGranted',
      maxLabel_key: 'scale.deeplyGrateful'
    }
  },
  {
    id: 'general_19',
    text_key: 'tests.feedback360.general.q19',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.poorLifeBalance',
      maxLabel_key: 'scale.excellentWorkLifeBalance'
    }
  },
  {
    id: 'general_20',
    text_key: 'tests.feedback360.general.q20',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'scale.stagnant',
      maxLabel_key: 'scale.constantlyGrowing'
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

  // Category-specific competencies (Questions 11-20) - varies by category
  const categoryScores = {
    'Category Strength 1': 0,
    'Category Strength 2': 0, 
    'Category Strength 3': 0,
    'Category Strength 4': 0,
    'Category Strength 5': 0
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
        categoryScores['Category Strength 1'] += numericScore;
      } else if (questionId.includes('_13') || questionId.includes('_14')) {
        categoryScores['Category Strength 2'] += numericScore;
      } else if (questionId.includes('_15') || questionId.includes('_16')) {
        categoryScores['Category Strength 3'] += numericScore;
      } else if (questionId.includes('_17') || questionId.includes('_18')) {
        categoryScores['Category Strength 4'] += numericScore;
      } else if (questionId.includes('_19') || questionId.includes('_20')) {
        categoryScores['Category Strength 5'] += numericScore;
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
    type: 'results.feedback360Profile',
    description_key: 'A comprehensive 360-degree assessment evaluating leadership, communication, teamwork, emotional intelligence, problem-solving, adaptability, interpersonal skills, and work style from multiple perspectives.',
    traits: strengths,
    strengths: strengths.map(area => `${area}`),
    recommendations: developmentAreas.map(area => `${area}`)
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
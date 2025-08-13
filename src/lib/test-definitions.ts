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

// 360 Feedback Test Questions - Casual & Friendly for Friends/Family/Colleagues
const feedback360Questions: TestQuestion[] = [
  // Leadership & Initiative (4 questions)
  {
    id: 'leadership_1',
    text_key: 'Are they good at getting people excited about stuff they want to do?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Totally!'
    }
  },
  {
    id: 'leadership_2', 
    text_key: 'When stuff gets crazy, do they make smart choices?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Totally!'
    }
  },
  {
    id: 'leadership_3',
    text_key: 'Do they motivate people and get them pumped up?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Totally!'
    }
  },
  {
    id: 'leadership_4',
    text_key: 'Are they a planner who thinks ahead?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Totally!'
    }
  },

  // Communication & Social Skills (4 questions)
  {
    id: 'communication_1',
    text_key: 'Are they good at explaining stuff so you actually get it?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Totally!'
    }
  },
  {
    id: 'communication_2',
    text_key: 'Do they actually listen when you\'re talking to them?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Totally!'
    }
  },
  {
    id: 'communication_3',
    text_key: 'How are they at speaking in front of people?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Pretty awkward',
      maxLabel_key: 'Super confident!'
    }
  },
  {
    id: 'communication_4',
    text_key: 'Are their texts and messages easy to understand?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Confusing',
      maxLabel_key: 'Crystal clear!'
    }
  },

  // Teamwork & Collaboration (4 questions)
  {
    id: 'teamwork_1',
    text_key: 'Are they fun to work with on group projects?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Totally!'
    }
  },
  {
    id: 'teamwork_2',
    text_key: 'Do they help others and cheer people on?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Always!'
    }
  },
  {
    id: 'teamwork_3',
    text_key: 'When there\'s group drama, how do they deal with it?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Makes it worse',
      maxLabel_key: 'Helps solve it!'
    }
  },
  {
    id: 'teamwork_4',
    text_key: 'Do they bring good vibes to the group?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Definitely!'
    }
  },

  // Emotional Intelligence & Empathy (4 questions)
  {
    id: 'emotional_1',
    text_key: 'Do they know how their mood affects other people?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Very aware!'
    }
  },
  {
    id: 'emotional_2',
    text_key: 'Do they actually care about how you\'re feeling?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not much',
      maxLabel_key: 'Super caring!'
    }
  },
  {
    id: 'emotional_3',
    text_key: 'When things get stressful, do they stay cool?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Gets overwhelmed',
      maxLabel_key: 'Stays calm!'
    }
  },
  {
    id: 'emotional_4',
    text_key: 'Are they good at reading the vibe in a room?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Totally clueless',
      maxLabel_key: 'Super intuitive!'
    }
  },

  // Problem Solving & Creativity (4 questions)  
  {
    id: 'problem_1',
    text_key: 'Are they good at figuring out complicated stuff?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Gets stuck easily',
      maxLabel_key: 'Problem solver!'
    }
  },
  {
    id: 'problem_2',
    text_key: 'Do they come up with creative solutions?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Pretty basic',
      maxLabel_key: 'Super creative!'
    }
  },
  {
    id: 'problem_3',
    text_key: 'Are they innovative when trying new things?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Sticks to basics',
      maxLabel_key: 'Always innovating!'
    }
  },
  {
    id: 'problem_4',
    text_key: 'Do they make good decisions when it matters?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Questionable choices',
      maxLabel_key: 'Great judgment!'
    }
  },

  // Adaptability & Flexibility (4 questions)
  {
    id: 'adaptability_1',
    text_key: 'When plans change last minute, do they roll with it?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Gets upset/stressed',
      maxLabel_key: 'Totally flexible!'
    }
  },
  {
    id: 'adaptability_2',
    text_key: 'Are they chill when things don\'t go as planned?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Pretty rigid',
      maxLabel_key: 'Super adaptable!'
    }
  },
  {
    id: 'adaptability_3',
    text_key: 'How fast do they pick up new things?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Takes forever',
      maxLabel_key: 'Super quick!'
    }
  },
  {
    id: 'adaptability_4',
    text_key: 'When stuff doesn\'t work out, do they bounce back?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Stays down',
      maxLabel_key: 'Bounces back fast!'
    }
  },

  // Social & Relationship Skills (4 questions)
  {
    id: 'interpersonal_1',
    text_key: 'Are they good at making real friendships?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Struggles with this',
      maxLabel_key: 'Natural at it!'
    }
  },
  {
    id: 'interpersonal_2',
    text_key: 'Do you trust them? Are they there when you need them?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Completely!'
    }
  },
  {
    id: 'interpersonal_3',
    text_key: 'Are they good at meeting new people?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Pretty shy/awkward',
      maxLabel_key: 'Social butterfly!'
    }
  },
  {
    id: 'interpersonal_4',
    text_key: 'Do they make people around them feel good?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not really',
      maxLabel_key: 'Definitely!'
    }
  },

  // Organization & Reliability (4 questions)
  {
    id: 'work_style_1',
    text_key: 'Do they have their stuff together?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Total mess',
      maxLabel_key: 'Super organized!'
    }
  },
  {
    id: 'work_style_2',
    text_key: 'Are they usually on time for stuff?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Always late',
      maxLabel_key: 'Always on time!'
    }
  },
  {
    id: 'work_style_3',
    text_key: 'Can you count on them to do what they say they\'ll do?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Not reliable',
      maxLabel_key: 'Super reliable!'
    }
  },
  {
    id: 'work_style_4',
    text_key: 'Do they pay attention to details?',
    type: 'scale',
    scale: {
      min: 1,
      max: 5,
      minLabel_key: 'Pretty careless',
      maxLabel_key: 'Detail-oriented!'
    }
  }
];

const feedback360Scoring: ScoringFunction = (answers) => {
  const areas = {
    'Leadership & Initiative': 0,
    'Communication & Social Skills': 0,
    'Teamwork & Collaboration': 0,
    'Emotional Intelligence & Empathy': 0,
    'Problem Solving & Creativity': 0,
    'Adaptability & Flexibility': 0,
    'Social & Relationship Skills': 0,
    'Organization & Reliability': 0
  };

  // Map question IDs to their respective areas and calculate average scores
  Object.entries(answers).forEach(([questionId, score]) => {
    const numericScore = score as number;
    
    if (questionId.startsWith('leadership_')) {
      areas['Leadership & Initiative'] += numericScore;
    } else if (questionId.startsWith('communication_')) {
      areas['Communication & Social Skills'] += numericScore;
    } else if (questionId.startsWith('teamwork_')) {
      areas['Teamwork & Collaboration'] += numericScore;
    } else if (questionId.startsWith('emotional_')) {
      areas['Emotional Intelligence & Empathy'] += numericScore;
    } else if (questionId.startsWith('problem_')) {
      areas['Problem Solving & Creativity'] += numericScore;
    } else if (questionId.startsWith('adaptability_')) {
      areas['Adaptability & Flexibility'] += numericScore;
    } else if (questionId.startsWith('interpersonal_')) {
      areas['Social & Relationship Skills'] += numericScore;
    } else if (questionId.startsWith('work_style_')) {
      areas['Organization & Reliability'] += numericScore;
    }
  });

  // Calculate average scores (4 questions per area, convert to percentages)
  const percentageScores: { [key: string]: number } = {};
  Object.entries(areas).forEach(([area, totalScore]) => {
    const averageScore = totalScore / 4; // 4 questions per area
    percentageScores[area] = Math.round((averageScore / 5) * 100); // Convert to percentage (5-point scale)
  });

  // Identify strengths and development areas
  const sortedAreas = Object.entries(percentageScores).sort(([,a], [,b]) => b - a);
  const strengths = sortedAreas.slice(0, 3).map(([area]) => area);
  const developmentAreas = sortedAreas.slice(-2).map(([area]) => area);

  return {
    scores: percentageScores,
    type: '360 Feedback Profile',
    description_key: 'A comprehensive 360-degree assessment evaluating leadership, communication, teamwork, emotional intelligence, problem-solving, adaptability, interpersonal skills, and work style from multiple perspectives.',
    traits: strengths,
    strengths: strengths.map(area => `Strong in ${area}`),
    recommendations: developmentAreas.map(area => `Focus on developing ${area} skills`)
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
    title_key: 'How Do People See Me? 360° Feedback',
    description_key: 'Find out how your friends, family, classmates, and colleagues really see you! This fun 32-question assessment covers leadership, communication, teamwork, emotional intelligence, problem-solving, adaptability, social skills, and organization. Get honest, anonymous feedback from people who know you well.',
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
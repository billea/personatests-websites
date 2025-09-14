'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import {
  // General Knowledge functions
  addGeneralKnowledgeQuestion,
  getGeneralKnowledgeStats,
  batchUploadMultilingualQuestions,
  getAllGeneralKnowledgeQuestions,
  updateGeneralKnowledgeQuestion,
  deleteGeneralKnowledgeQuestion,
  bulkDeleteGeneralKnowledgeQuestions,
  GeneralKnowledgeQuestion,

  // Math Speed functions
  addMathSpeedQuestion,
  getMathSpeedQuestionStats,
  batchUploadMathSpeedQuestions,
  getAllMathSpeedQuestions,
  updateMathSpeedQuestion,
  deleteMathSpeedQuestion,
  bulkDeleteMathSpeedQuestions,
  MathSpeedQuestion,

  // Memory Power functions
  addMemoryPowerQuestion,
  getMemoryPowerQuestionStats,
  batchUploadMemoryPowerQuestions,
  getAllMemoryPowerQuestions,
  updateMemoryPowerQuestion,
  deleteMemoryPowerQuestion,
  bulkDeleteMemoryPowerQuestions,
  MemoryPowerQuestion
} from '@/lib/firestore';

type QuestionType = 'general-knowledge' | 'math-speed' | 'memory-power';

interface ExtendedGeneralQuestion extends GeneralKnowledgeQuestion {
  id: string;
}

interface ExtendedMathQuestion extends MathSpeedQuestion {
  id: string;
}

interface ExtendedMemoryQuestion extends MemoryPowerQuestion {
  id: string;
}

type AnyQuestion = ExtendedGeneralQuestion | ExtendedMathQuestion | ExtendedMemoryQuestion;

const QUESTION_TYPE_CONFIG = {
  'general-knowledge': {
    title: 'General Knowledge',
    uploadFileName: '100-questions.json',
    categories: ['science', 'history', 'geography', 'arts', 'sports', 'technology', 'mathematics']
  },
  'math-speed': {
    title: 'Math Speed',
    uploadFileName: 'math-speed-questions.json',
    categories: ['arithmetic', 'word_problem', 'sequence', 'geometry', 'algebra']
  },
  'memory-power': {
    title: 'Memory Power',
    uploadFileName: 'memory-power-questions.json',
    categories: ['word_sequence', 'number_sequence', 'image_sequence', 'pattern_sequence']
  }
} as const;

export default function QuestionsAdminPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType>('general-knowledge');
  const [stats, setStats] = useState<any>(null);
  const [questions, setQuestions] = useState<AnyQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'add'>('upload');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<AnyQuestion | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
  });

  // Load data when component mounts or question type changes
  useEffect(() => {
    loadStats();
    loadQuestions();
    setSelectedQuestions(new Set()); // Clear selections when switching types
    setEditingQuestion(null);
  }, [currentQuestionType]);

  // Stats loading function
  const loadStats = async () => {
    try {
      let statsData;
      switch (currentQuestionType) {
        case 'general-knowledge':
          statsData = await getGeneralKnowledgeStats();
          break;
        case 'math-speed':
          statsData = await getMathSpeedQuestionStats();
          break;
        case 'memory-power':
          statsData = await getMemoryPowerQuestionStats();
          break;
      }
      setStats(statsData);
    } catch (error) {
      console.error(`Error loading ${currentQuestionType} stats:`, error);
    }
  };

  // Questions loading function
  const loadQuestions = async () => {
    try {
      setLoading(true);
      let loadedQuestions;

      switch (currentQuestionType) {
        case 'general-knowledge':
          const generalResult = await getAllGeneralKnowledgeQuestions(100, null, filters.category, filters.difficulty);
          loadedQuestions = generalResult.questions;
          break;
        case 'math-speed':
          const mathResult = await getAllMathSpeedQuestions(100, null, filters.category, filters.difficulty);
          loadedQuestions = mathResult.questions;
          break;
        case 'memory-power':
          const memoryResult = await getAllMemoryPowerQuestions(100, null, filters.category, filters.difficulty);
          loadedQuestions = memoryResult.questions;
          break;
      }

      setQuestions(loadedQuestions);
    } catch (error) {
      console.error(`Error loading ${currentQuestionType} questions:`, error);
      setMessage(`❌ Error loading ${currentQuestionType} questions`);
    } finally {
      setLoading(false);
    }
  };

  // File upload handler for JSON files
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage('📤 Processing file upload...');

    try {
      const text = await file.text();
      const questionsData = JSON.parse(text);

      if (!Array.isArray(questionsData)) {
        throw new Error('File must contain an array of questions');
      }

      setMessage(`📊 Loaded ${questionsData.length} questions from file, uploading to database...`);

      let result;
      switch (currentQuestionType) {
        case 'general-knowledge':
          result = await batchUploadMultilingualQuestions(questionsData);
          break;
        case 'math-speed':
          result = await batchUploadMathSpeedQuestions(questionsData);
          break;
        case 'memory-power':
          result = await batchUploadMemoryPowerQuestions(questionsData);
          break;
      }

      setMessage(`✅ Upload complete: ${result.message}`);
      loadStats();
      loadQuestions();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ File upload error: ${errorMsg}`);
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Predefined file upload handler
  const handlePredefinedUpload = async () => {
    const fileName = QUESTION_TYPE_CONFIG[currentQuestionType].uploadFileName;
    setLoading(true);
    setMessage(`🚀 Loading ${fileName}...`);

    try {
      const response = await fetch(`/${fileName}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}: ${response.status} ${response.statusText}`);
      }

      const questions = await response.json();

      console.log(`📊 Loaded ${questions.length} questions from ${fileName}`);
      setMessage(`📊 Loaded ${questions.length} questions, uploading to database...`);

      let result;
      switch (currentQuestionType) {
        case 'general-knowledge':
          result = await batchUploadMultilingualQuestions(questions);
          break;
        case 'math-speed':
          result = await batchUploadMathSpeedQuestions(questions);
          break;
        case 'memory-power':
          result = await batchUploadMemoryPowerQuestions(questions);
          break;
      }

      setMessage(`✅ Success: ${result.message}`);
      loadStats();
      loadQuestions();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Error uploading ${fileName}: ${errorMsg}`);
    }

    setLoading(false);
  };

  // Delete questions handler
  const handleDeleteSelected = async () => {
    if (selectedQuestions.size === 0) return;

    const confirmed = confirm(`Delete ${selectedQuestions.size} selected questions?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      const questionIds = Array.from(selectedQuestions);
      let result;

      switch (currentQuestionType) {
        case 'general-knowledge':
          result = await bulkDeleteGeneralKnowledgeQuestions(questionIds);
          break;
        case 'math-speed':
          result = await bulkDeleteMathSpeedQuestions(questionIds);
          break;
        case 'memory-power':
          result = await bulkDeleteMemoryPowerQuestions(questionIds);
          break;
      }

      setMessage(`✅ ${result.message}`);
      setSelectedQuestions(new Set());
      loadStats();
      loadQuestions();
    } catch (error) {
      setMessage(`❌ Error deleting questions: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle question selection
  const toggleQuestionSelection = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const currentConfig = QUESTION_TYPE_CONFIG[currentQuestionType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          🔧 Questions Admin Panel
        </h1>

        {/* Question Type Selector */}
        <div className="mb-6">
          <div className="flex space-x-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2">
            {Object.entries(QUESTION_TYPE_CONFIG).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setCurrentQuestionType(type as QuestionType)}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  currentQuestionType === type
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {config.title}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h3 className="text-white/80 text-sm font-medium">Total Questions</h3>
            <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h3 className="text-white/80 text-sm font-medium">Active Questions</h3>
            <p className="text-2xl font-bold text-white">{stats?.active || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h3 className="text-white/80 text-sm font-medium">Categories</h3>
            <p className="text-2xl font-bold text-white">{Object.keys(stats?.byCategory || {}).length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h3 className="text-white/80 text-sm font-medium">Selected Type</h3>
            <p className="text-lg font-semibold text-white">{currentConfig.title}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2">
            {['upload', 'manage', 'add'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {tab} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
            <p className="text-white">{message}</p>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">📤 Upload {currentConfig.title} Questions</h2>

            {/* Predefined Upload */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Predefined Questions Database</h3>
              <button
                onClick={handlePredefinedUpload}
                disabled={loading}
                className="px-6 py-3 bg-green-500/80 hover:bg-green-600 disabled:bg-green-500/40 text-white rounded-lg transition-all duration-200 font-semibold mr-4"
              >
                {loading ? '⏳ Uploading...' : `📤 Upload ${currentConfig.uploadFileName}`}
              </button>
              <p className="text-white/80 text-sm mt-2">
                Upload the predefined {currentConfig.title.toLowerCase()} questions from the public directory
              </p>
            </div>

            {/* Custom File Upload */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Custom JSON File Upload</h3>
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 file:disabled:bg-white/10"
                />
              </div>
              <p className="text-white/80 text-sm mt-2">
                Upload a JSON file containing {currentConfig.title.toLowerCase()} questions with proper structure
              </p>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">📋 Manage {currentConfig.title} Questions</h2>

            {/* Filters */}
            <div className="mb-6 flex space-x-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
              >
                <option value="">All Categories</option>
                {currentConfig.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button
                onClick={loadQuestions}
                className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg"
              >
                Apply Filters
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedQuestions.size > 0 && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                <p className="text-white mb-2">{selectedQuestions.size} questions selected</p>
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg"
                >
                  🗑️ Delete Selected
                </button>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-white text-center">Loading questions...</p>
              ) : questions.length === 0 ? (
                <p className="text-white text-center">No questions found</p>
              ) : (
                questions.map((question) => (
                  <div
                    key={question.id}
                    className="p-4 bg-white/10 border border-white/20 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(question.id!)}
                            onChange={() => toggleQuestionSelection(question.id!)}
                            className="rounded"
                          />
                          <span className="text-xs bg-blue-500/50 px-2 py-1 rounded text-white">
                            {question.category}
                          </span>
                          <span className="text-xs bg-green-500/50 px-2 py-1 rounded text-white">
                            {question.difficulty}
                          </span>
                        </div>
                        <p className="text-white font-medium mb-2">
                          {question.translations?.en?.question || question.translations?.[question.defaultLanguage]?.question || 'No question text'}
                        </p>
                        <div className="text-sm text-white/70">
                          Answer: {question.correctAnswer} | Languages: {question.availableLanguages?.join(', ') || 'Unknown'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingQuestion(question)}
                          className="px-3 py-1 bg-blue-500/80 hover:bg-blue-600 text-white text-sm rounded"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">➕ Add New {currentConfig.title} Question</h2>
            <p className="text-white/80 mb-4">
              Individual question creation coming soon. Use the upload feature to add questions in bulk.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import {
  addGeneralKnowledgeQuestion,
  getGeneralKnowledgeStats,
  batchUploadMultilingualQuestions,
  getAllGeneralKnowledgeQuestions,
  updateGeneralKnowledgeQuestion,
  deleteGeneralKnowledgeQuestion,
  bulkDeleteGeneralKnowledgeQuestions,
  GeneralKnowledgeQuestion
} from '@/lib/firestore';

interface ExtendedQuestion extends GeneralKnowledgeQuestion {
  id: string;
}

export default function QuestionsAdminPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<any>(null);
  const [questions, setQuestions] = useState<ExtendedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'add'>('upload');
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<ExtendedQuestion | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
  });

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    category: 'science',
    difficulty: 'easy' as const,
    question: '',
    options: { a: '', b: '', c: '', d: '' },
    correctAnswer: 'a' as const,
    explanation: '',
    tags: '',
    isActive: true
  });

  useEffect(() => {
    loadStats();
    loadQuestions();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await getGeneralKnowledgeStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const { questions: loadedQuestions } = await getAllGeneralKnowledgeQuestions(100, null, filters.category, filters.difficulty);
      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      setMessage('❌ Error loading questions');
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

      const result = await batchUploadMultilingualQuestions(questionsData);
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

  // Predefined file upload options
  const handlePredefinedUpload = async (fileName: string) => {
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

      const result = await batchUploadMultilingualQuestions(questions as any);
      setMessage(`✅ Success: ${result.message}`);

      loadStats();
      loadQuestions();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Error uploading ${fileName}: ${errorMsg}`);
    }

    setLoading(false);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const questionData = {
        category: newQuestion.category,
        difficulty: newQuestion.difficulty,
        correctAnswer: newQuestion.correctAnswer,
        defaultLanguage: 'en',
        availableLanguages: ['en'],
        translations: {
          en: {
            question: newQuestion.question,
            options: newQuestion.options,
            explanation: newQuestion.explanation,
            tags: newQuestion.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          }
        },
        isActive: newQuestion.isActive
      };

      const result = await addGeneralKnowledgeQuestion(questionData);

      if (result.success) {
        setMessage(`✅ Question added successfully! ID: ${result.id}`);
        setNewQuestion({
          category: 'science',
          difficulty: 'easy',
          question: '',
          options: { a: '', b: '', c: '', d: '' },
          correctAnswer: 'a',
          explanation: '',
          tags: '',
          isActive: true
        });
        loadStats();
        loadQuestions();
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error adding question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedQuestions.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedQuestions.size} selected questions?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await bulkDeleteGeneralKnowledgeQuestions(Array.from(selectedQuestions));
      setMessage(`🗑️ ${result.message}`);
      setSelectedQuestions(new Set());
      loadStats();
      loadQuestions();
    } catch (error) {
      setMessage(`❌ Error deleting questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: ExtendedQuestion) => {
    setEditingQuestion(question);
  };

  const handleSaveEdit = async () => {
    if (!editingQuestion) return;

    setLoading(true);
    try {
      const result = await updateGeneralKnowledgeQuestion(editingQuestion.id, editingQuestion);
      if (result.success) {
        setMessage(`✅ Question updated successfully!`);
        setEditingQuestion(null);
        loadQuestions();
      } else {
        setMessage(`❌ Error updating question: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error updating question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionSelection = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const selectAllQuestions = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map(q => q.id)));
    }
  };

  // Simple admin check
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
        <div className="text-center p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-white/90">Please sign in to access the admin panel.</p>
          <a
            href="../auth"
            className="mt-4 inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Question Database Management</h1>

        {/* Statistics Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white">Total Questions</h3>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white">Active Questions</h3>
              <p className="text-3xl font-bold text-green-300">{stats.active}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white">Categories</h3>
              <p className="text-3xl font-bold text-blue-300">{Object.keys(stats.byCategory || {}).length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white">Selected</h3>
              <p className="text-3xl font-bold text-yellow-300">{selectedQuestions.size}</p>
            </div>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
            <p className="text-white">{message}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'upload', label: '📤 Upload Questions' },
            { key: 'manage', label: '🗂️ Manage Questions' },
            { key: 'add', label: '➕ Add Question' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-white/30 text-white font-semibold'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">📤 Upload Question Files</h2>

              {/* Predefined Files */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handlePredefinedUpload('100-questions.json')}
                  disabled={loading}
                  className="p-4 bg-green-500/80 hover:bg-green-600 disabled:bg-green-500/40 text-white rounded-lg transition-all"
                >
                  📊 Upload 100-Questions.json
                  <div className="text-sm opacity-75">Complete General Knowledge Database</div>
                </button>

                <div className="p-4 bg-blue-500/80 text-white rounded-lg">
                  📁 Custom File Upload
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    disabled={loading}
                    className="mt-2 w-full text-sm text-white/90 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-white/20 file:text-white"
                  />
                  <div className="text-sm opacity-75 mt-1">Upload any JSON question file</div>
                </div>
              </div>

              <div className="text-sm text-white/70 bg-white/10 rounded p-3">
                <strong>Supported formats:</strong> JSON files with question arrays containing category, difficulty, translations, etc.
              </div>
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">🗂️ Question Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={loadQuestions}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded transition-all"
                  >
                    🔄 Refresh
                  </button>
                  {selectedQuestions.size > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded transition-all"
                    >
                      🗑️ Delete Selected ({selectedQuestions.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex space-x-4 mb-4">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded"
                >
                  <option value="">All Categories</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                  <option value="arts">Arts</option>
                  <option value="sports">Sports</option>
                  <option value="math">Math</option>
                  <option value="technology">Technology</option>
                </select>

                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <button
                  onClick={loadQuestions}
                  className="px-4 py-2 bg-purple-500/80 hover:bg-purple-600 text-white rounded transition-all"
                >
                  Apply Filters
                </button>
              </div>

              {/* Select All Checkbox */}
              <div className="mb-4">
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.size === questions.length && questions.length > 0}
                    onChange={selectAllQuestions}
                    className="mr-2"
                  />
                  Select All ({questions.length} questions)
                </label>
              </div>

              {/* Questions List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white/10 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.has(question.id)}
                        onChange={() => toggleQuestionSelection(question.id)}
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {question.translations.en?.question || question.translations[question.defaultLanguage]?.question}
                        </div>
                        <div className="text-white/70 text-sm">
                          {question.category} • {question.difficulty} • {question.availableLanguages.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="px-3 py-1 bg-blue-500/80 hover:bg-blue-600 text-white rounded text-sm transition-all"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {questions.length === 0 && !loading && (
                <div className="text-center text-white/70 py-8">
                  No questions found. Try adjusting your filters or upload some questions.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Question Tab */}
        {activeTab === 'add' && (
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">➕ Add New Question</h2>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg"
                >
                  <option value="science">Science</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                  <option value="arts">Arts</option>
                  <option value="sports">Sports</option>
                  <option value="math">Math</option>
                  <option value="technology">Technology</option>
                </select>

                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                  className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Question text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                {['a', 'b', 'c', 'd'].map((option) => (
                  <input
                    key={option}
                    type="text"
                    placeholder={`Option ${option.toUpperCase()}`}
                    value={newQuestion.options[option as keyof typeof newQuestion.options]}
                    onChange={(e) => setNewQuestion({
                      ...newQuestion,
                      options: { ...newQuestion.options, [option]: e.target.value }
                    })}
                    className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
                    required
                  />
                ))}
              </div>

              <select
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value as any })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg"
              >
                <option value="a">A is correct</option>
                <option value="b">B is correct</option>
                <option value="c">C is correct</option>
                <option value="d">D is correct</option>
              </select>

              <input
                type="text"
                placeholder="Explanation (optional)"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
              />

              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={newQuestion.tags}
                onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-lg"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-500/80 hover:bg-blue-600 disabled:bg-blue-500/40 text-white rounded-lg transition-all duration-200"
              >
                {loading ? 'Adding...' : '➕ Add Question'}
              </button>
            </form>
          </div>
        )}

        {/* Edit Question Modal */}
        {editingQuestion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Edit Question</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingQuestion.translations.en?.question || ''}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    translations: {
                      ...editingQuestion.translations,
                      en: {
                        ...editingQuestion.translations.en!,
                        question: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Question text"
                />

                <div className="grid grid-cols-2 gap-2">
                  {['a', 'b', 'c', 'd'].map((option) => (
                    <input
                      key={option}
                      type="text"
                      value={editingQuestion.translations.en?.options[option as keyof typeof editingQuestion.translations.en.options] || ''}
                      onChange={(e) => setEditingQuestion({
                        ...editingQuestion,
                        translations: {
                          ...editingQuestion.translations,
                          en: {
                            ...editingQuestion.translations.en!,
                            options: {
                              ...editingQuestion.translations.en!.options,
                              [option]: e.target.value
                            }
                          }
                        }
                      })}
                      className="px-3 py-2 border rounded"
                      placeholder={`Option ${option.toUpperCase()}`}
                    />
                  ))}
                </div>

                <select
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="a">A is correct</option>
                  <option value="b">B is correct</option>
                  <option value="c">C is correct</option>
                  <option value="d">D is correct</option>
                </select>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {stats && Object.keys(stats.byCategory || {}).length > 0 && (
          <div className="mt-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Questions by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-semibold capitalize">{category}</h3>
                  <p className="text-2xl font-bold text-white">{count as number}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/components/providers/translation-provider';
import { getTestById, TestDefinition } from '@/lib/test-definitions';
import { AnonymousCode, CodeFeedbackResponse } from '@/lib/invitation-types';

export default function CodeFeedbackPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  
  const [enteredCode, setEnteredCode] = useState(searchParams.get('code') || '');
  const [codeData, setCodeData] = useState<AnonymousCode | null>(null);
  const [testDefinition, setTestDefinition] = useState<TestDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateCode = async () => {
    if (!enteredCode || enteredCode.length !== 8) {
      setError('Please enter a valid 8-character code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get codes from localStorage
      const storedCodes = JSON.parse(localStorage.getItem('anonymous_codes') || '[]');
      const foundCode = storedCodes.find((code: AnonymousCode) => 
        code.code === enteredCode.toUpperCase() && 
        code.status === 'active' &&
        new Date(code.expiresAt) > new Date()
      );

      if (!foundCode) {
        setError('Invalid or expired code. Please check the code and try again.');
        return;
      }

      // Check if already used this code (prevent multiple submissions from same device)
      const submittedFeedback = JSON.parse(localStorage.getItem('submitted_code_feedback') || '[]');
      const alreadyUsed = submittedFeedback.some((fb: any) => fb.codeUsed === foundCode.code);
      
      if (alreadyUsed) {
        setError('You have already provided feedback using this code.');
        return;
      }

      setCodeData(foundCode);

      // Load test definition
      const testDef = getTestById(foundCode.testId);
      if (!testDef) {
        setError('Test not found');
        return;
      }

      setTestDefinition(testDef);
    } catch (err) {
      setError('Failed to validate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: any) => {
    if (!testDefinition) return;
    
    const currentQuestion = testDefinition.questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < testDefinition.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitFeedback(newAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitFeedback = async (finalAnswers: { [questionId: string]: any }) => {
    if (!codeData || !testDefinition) return;
    
    setSubmitting(true);
    try {
      // Calculate result
      const result = testDefinition.scoring(finalAnswers);
      
      // Create feedback response
      const feedbackResponse: CodeFeedbackResponse = {
        id: `code_feedback_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        testResultId: codeData.testResultId,
        testId: codeData.testId,
        testOwnerId: codeData.userId,
        answers: finalAnswers,
        result,
        submittedAt: new Date().toISOString(),
        method: 'codes',
        codeUsed: codeData.code,
        codeId: codeData.id
      };

      // Store feedback response
      const existingResponses = JSON.parse(localStorage.getItem('feedback_responses') || '[]');
      existingResponses.push(feedbackResponse);
      localStorage.setItem('feedback_responses', JSON.stringify(existingResponses));

      // Track that this code was used by this device
      const submittedFeedback = JSON.parse(localStorage.getItem('submitted_code_feedback') || '[]');
      submittedFeedback.push({
        codeUsed: codeData.code,
        codeId: codeData.id,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('submitted_code_feedback', JSON.stringify(submittedFeedback));

      // Update code usage count
      const storedCodes = JSON.parse(localStorage.getItem('anonymous_codes') || '[]');
      const updatedCodes = storedCodes.map((code: AnonymousCode) => {
        if (code.id === codeData.id) {
          return {
            ...code,
            usageCount: code.usageCount + 1,
            lastUsedAt: new Date().toISOString()
          };
        }
        return code;
      });
      localStorage.setItem('anonymous_codes', JSON.stringify(updatedCodes));

      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-validate if code is in URL
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode && urlCode.length === 8) {
      setEnteredCode(urlCode.toUpperCase());
      validateCode();
    }
  }, []);

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-4">Feedback Submitted!</h1>
          <p className="text-white/80 mb-6">
            Thank you for providing anonymous feedback. Your insights will help with personal and professional growth.
          </p>
          <div className="text-white/60 text-sm">
            <p>• Your response is completely anonymous</p>
            <p>• Results will be shared as aggregated insights</p>
            <p>• No individual responses can be traced back</p>
          </div>
        </div>
      </main>
    );
  }

  if (!codeData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">🔑 Enter Feedback Code</h1>
            <p className="text-white/80 text-sm">
              Enter the 8-character code you received to provide anonymous feedback
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Feedback Code
              </label>
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g. AB123XYZ)"
                maxLength={8}
                className="w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-center text-lg font-mono placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && enteredCode.length === 8) {
                    validateCode();
                  }
                }}
              />
              <p className="text-white/60 text-xs mt-2">
                Code should be exactly 8 characters (letters and numbers)
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-400 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={validateCode}
              disabled={loading || enteredCode.length !== 8}
              className="w-full p-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Validating...
                </>
              ) : (
                <>
                  🔍 Validate Code & Start Feedback
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400 rounded-lg">
            <h3 className="font-bold text-white mb-2">📱 Privacy Notice</h3>
            <div className="text-white/80 text-sm space-y-1">
              <p>• Your feedback is completely anonymous</p>
              <p>• No email or personal information required</p>
              <p>• Responses are aggregated with others</p>
              <p>• Individual answers cannot be traced back to you</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Rest of the feedback form (similar to existing feedback page)
  if (!testDefinition) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading feedback form...</p>
        </div>
      </main>
    );
  }

  const currentQuestion = testDefinition.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / testDefinition.questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-white/80 text-sm mb-2">
            <span>Question {currentQuestionIndex + 1} of {testDefinition.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <div className="p-8 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg">
          <div className="text-center mb-6">
            <p className="text-white/60 text-sm mb-2">
              Anonymous feedback for {codeData.userName}
            </p>
            <h2 className="text-xl font-bold text-white mb-4">
              {t(currentQuestion.text_key)}
            </h2>
          </div>

          {/* Question content - same as existing feedback form */}
          {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value.toString()}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 text-left bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white transition-all duration-300"
                >
                  {t(option.text_key)}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'scale' && currentQuestion.scale && (
            <div className="space-y-4">
              <div className="flex justify-between text-white/80 text-sm">
                <span>{t(currentQuestion.scale.minLabel_key)}</span>
                <span>{t(currentQuestion.scale.maxLabel_key)}</span>
              </div>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: currentQuestion.scale.max - currentQuestion.scale.min + 1 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(currentQuestion.scale!.min + i)}
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white font-bold transition-all duration-300"
                  >
                    {currentQuestion.scale!.min + i}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/50 text-white rounded-lg transition-all duration-300"
            >
              ← Previous
            </button>
            
            <div className="flex items-center text-white/60 text-sm">
              Code: <code className="ml-2 bg-white/20 px-2 py-1 rounded font-mono">{codeData.code}</code>
            </div>
          </div>
        </div>

        {submitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Submitting your anonymous feedback...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
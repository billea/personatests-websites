"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/components/providers/translation-provider';
import { getTestById, TestDefinition } from '@/lib/test-definitions';
import { ShareableLink, LinkFeedbackResponse } from '@/lib/invitation-types';

export default function ShareLinkFeedbackPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const linkId = searchParams.get('linkId');
  
  const [linkData, setLinkData] = useState<ShareableLink | null>(null);
  const [testDefinition, setTestDefinition] = useState<TestDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    validateLink();
  }, [linkId]);

  const validateLink = async () => {
    if (!linkId) {
      setError('Invalid feedback link');
      setLoading(false);
      return;
    }

    try {
      // Get links from localStorage
      const storedLinks = JSON.parse(localStorage.getItem('shareable_links') || '[]');
      const foundLink = storedLinks.find((link: ShareableLink) => 
        link.linkId === linkId && 
        link.status === 'active' &&
        new Date(link.expiresAt) > new Date()
      );

      if (!foundLink) {
        setError('This feedback link is invalid or has expired.');
        setLoading(false);
        return;
      }

      // Check response limits
      if (foundLink.maxResponses && foundLink.responseCount >= foundLink.maxResponses) {
        setError('This feedback link has reached its maximum response limit.');
        setLoading(false);
        return;
      }

      // Check if already submitted from this device (prevent spam)
      const submittedFeedback = JSON.parse(localStorage.getItem('submitted_link_feedback') || '[]');
      const alreadySubmitted = submittedFeedback.some((fb: any) => fb.linkId === linkId);
      
      if (alreadySubmitted) {
        setError('You have already provided feedback using this link.');
        setLoading(false);
        return;
      }

      setLinkData(foundLink);

      // Load test definition
      const testDef = getTestById(foundLink.testId);
      if (!testDef) {
        setError('Test not found');
        setLoading(false);
        return;
      }

      setTestDefinition(testDef);
    } catch (err) {
      setError('Failed to load feedback form. Please try again.');
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
    if (!linkData || !testDefinition) return;
    
    setSubmitting(true);
    try {
      // Calculate result
      const result = testDefinition.scoring(finalAnswers);
      
      // Create feedback response
      const feedbackResponse: LinkFeedbackResponse = {
        id: `link_feedback_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        testResultId: linkData.testResultId,
        testId: linkData.testId,
        testOwnerId: linkData.userId,
        answers: finalAnswers,
        result,
        submittedAt: new Date().toISOString(),
        method: 'link',
        linkId: linkData.linkId,
        shareableLink: linkData.link
      };

      // Store feedback response
      const existingResponses = JSON.parse(localStorage.getItem('feedback_responses') || '[]');
      existingResponses.push(feedbackResponse);
      localStorage.setItem('feedback_responses', JSON.stringify(existingResponses));

      // Track that this link was used by this device
      const submittedFeedback = JSON.parse(localStorage.getItem('submitted_link_feedback') || '[]');
      submittedFeedback.push({
        linkId: linkData.linkId,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('submitted_link_feedback', JSON.stringify(submittedFeedback));

      // Update link response count
      const storedLinks = JSON.parse(localStorage.getItem('shareable_links') || '[]');
      const updatedLinks = storedLinks.map((link: ShareableLink) => {
        if (link.linkId === linkId) {
          return {
            ...link,
            responseCount: link.responseCount + 1
          };
        }
        return link;
      });
      localStorage.setItem('shareable_links', JSON.stringify(updatedLinks));

      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading feedback form...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Unable to Load Feedback</h1>
          <p className="text-white/80 mb-6">{error}</p>
          <div className="text-white/60 text-sm">
            <p>Please check the link and try again, or contact the person who shared it.</p>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-4">Feedback Submitted!</h1>
          <p className="text-white/80 mb-6">
            Thank you for providing anonymous feedback for {linkData?.userName}. Your insights will help with their personal and professional growth.
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

  if (!testDefinition || !linkData) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  const currentQuestion = testDefinition.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / testDefinition.questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white/80 text-sm mb-4">
            <span>🔗 Shared Feedback Link</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Anonymous Feedback for {linkData.userName}
          </h1>
          <p className="text-white/80">
            Your honest feedback will help with personal and professional growth
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-white/80 text-sm mb-2">
            <span>Question {currentQuestionIndex + 1} of {testDefinition.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <div className="p-8 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {t(currentQuestion.text_key)}
          </h2>

          {/* Question content */}
          {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value.toString()}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 text-left bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white transition-all duration-300 hover:scale-[1.02]"
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
                    className="w-12 h-12 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white font-bold transition-all duration-300 hover:scale-110"
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
              Anonymous Response
            </div>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="mt-6 p-4 bg-green-500/20 border border-green-400 rounded-lg">
          <h3 className="font-bold text-white mb-2">🔒 Your Privacy is Protected</h3>
          <div className="text-white/80 text-sm space-y-1">
            <p>• Your responses are completely anonymous</p>
            <p>• No personal information is collected or stored</p>
            <p>• Results are aggregated with other feedback</p>
            <p>• Individual responses cannot be traced back to you</p>
          </div>
        </div>

        {submitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
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
"use client";

import { useState } from 'react';
import { useTranslation } from '@/components/providers/translation-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';

interface EmailSignupProps {
  testType: string;
  personalityType?: string;
}

export default function EmailSignup({ testType, personalityType }: EmailSignupProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Determine if this is a knowledge/skill test vs personality test
  const isKnowledgeTest = ['math-speed', 'general-knowledge', 'memory-power'].includes(testType);

  // Handle login/signup redirect for knowledge tests
  const handleLoginSignup = () => {
    const currentPath = window.location.pathname;

    // Store test result information for preservation after auth
    const testResultInfo = {
      testType,
      preserveResult: true,
      timestamp: Date.now()
    };
    localStorage.setItem('preserve_test_result', JSON.stringify(testResultInfo));

    const returnUrl = `${currentPath}?access=detailed&preserve=true`;
    router.push(`/en/auth?returnUrl=${encodeURIComponent(returnUrl)}&context=detailed-results`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Here you would integrate with your email service (Mailchimp, ConvertKit, etc.)
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in local storage for development
      const signups = JSON.parse(localStorage.getItem('email_signups') || '[]');
      signups.push({
        email,
        testType,
        personalityType,
        signedUpAt: new Date().toISOString()
      });
      localStorage.setItem('email_signups', JSON.stringify(signups));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // For knowledge tests, show login/signup prompt instead of email signup
  if (isKnowledgeTest) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-3">
            Want to See More Details About Your Results?
          </h3>
          <p className="text-white/90 mb-4">
            {user
              ? 'Access your detailed performance analysis, question breakdowns, and improvement recommendations in your dashboard.'
              : 'Sign in or create an account to access detailed performance analysis, question breakdowns, and improvement recommendations.'
            }
          </p>
          {user ? (
            <button
              onClick={() => router.push('/en/results')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              📊 View Detailed Analysis
            </button>
          ) : (
            <button
              onClick={handleLoginSignup}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              🔐 Sign In / Sign Up
            </button>
          )}
          <p className="text-white/70 text-sm mt-2">
            {user
              ? '✓ Detailed analysis ✓ Performance tracking ✓ Progress history'
              : '✓ Free account ✓ Detailed analysis ✓ Performance tracking'
            }
          </p>
        </div>
      </div>
    );
  }

  // For personality tests, continue with email signup flow
  if (!showSignup) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-3">
            {t('emailSignup.title') || `Want More Insights About Your ${personalityType || 'Personality'}?`}
          </h3>
          <p className="text-white/90 mb-4">
            {t('emailSignup.description') || 'Get personalized tips, detailed analysis, and exclusive personality insights delivered to your inbox.'}
          </p>
          <button
            onClick={() => setShowSignup(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            ✨ {t('emailSignup.buttonText') || 'Get Free Personality Insights'}
          </button>
          <p className="text-white/70 text-sm mt-2">
            {t('emailSignup.freeText') || '100% free'} • {t('emailSignup.unsubscribeText') || 'Unsubscribe anytime'} • {t('emailSignup.noSpamText') || 'No spam'}
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/30 rounded-lg text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-white/90">
          {isKnowledgeTest
            ? 'Check your email for your detailed performance report and analysis!'
            : `Check your email for personalized ${personalityType} insights and tips!`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">
          {isKnowledgeTest
            ? 'Get Your Detailed Performance Report'
            : `Get Your Complete ${personalityType || 'Personality'} Guide`
          }
        </h3>
        <p className="text-white/90">
          {isKnowledgeTest
            ? 'Access in-depth analysis of your performance, question-by-question breakdown, and personalized improvement insights.'
            : 'Receive detailed insights, career advice, and relationship tips tailored for your personality type.'
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : (isKnowledgeTest ? 'Get Report' : 'Get Insights')}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-white/70 text-sm">
            {isKnowledgeTest
              ? '✓ Performance analysis ✓ Question breakdown ✓ Improvement tips'
              : '✓ Free personality guide ✓ Career recommendations ✓ Relationship tips'
            }
          </p>
          <p className="text-white/60 text-xs mt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
          <button
            type="button"
            onClick={() => setShowSignup(false)}
            className="text-white/60 hover:text-white/80 text-sm underline mt-2"
          >
            No thanks, skip this
          </button>
        </div>
      </form>
    </div>
  );
}
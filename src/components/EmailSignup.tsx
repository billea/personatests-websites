"use client";

import { useState } from 'react';
import { useTranslation } from '@/components/providers/translation-provider';

interface EmailSignupProps {
  testType: string;
  personalityType?: string;
}

export default function EmailSignup({ testType, personalityType }: EmailSignupProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

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
          Check your email for personalized {personalityType} insights and tips!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">
          Get Your Complete {personalityType || 'Personality'} Guide
        </h3>
        <p className="text-white/90">
          Receive detailed insights, career advice, and relationship tips tailored for your personality type.
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
            {isLoading ? '...' : 'Get Insights'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-white/70 text-sm">
            ✓ Free personality guide ✓ Career recommendations ✓ Relationship tips
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
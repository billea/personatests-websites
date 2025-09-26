"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/translation-provider';
import { AnonymousCode } from '@/lib/invitation-types';

interface AnonymousCodeGeneratorProps {
  testResultId: string;
  testId: string;
  userName: string;
  onCodesGenerated: (codes: AnonymousCode[]) => void;
}

export default function AnonymousCodeGenerator({ 
  testResultId, 
  testId, 
  userName, 
  onCodesGenerated 
}: AnonymousCodeGeneratorProps) {
  const { t } = useTranslation();
  const [codeCount, setCodeCount] = useState(5);
  const [generatedCodes, setGeneratedCodes] = useState<AnonymousCode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expiryDays, setExpiryDays] = useState(14);

  const generateRandomCode = (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  };

  const generateCodes = async () => {
    setIsGenerating(true);
    
    try {
      const now = new Date();
      const expiry = new Date(now.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
      
      const newCodes: AnonymousCode[] = Array.from({ length: codeCount }, (_, index) => ({
        id: `code_${testResultId}_${index}_${Date.now()}`,
        code: generateRandomCode(8),
        testResultId,
        testId,
        userId: 'current_user', // In real app, get from auth context
        userName,
        method: 'codes' as const,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        status: 'active' as const,
        usageCount: 0,
        lastUsedAt: undefined
      }));

      // Store codes in localStorage for static deployment
      const existingCodes = JSON.parse(localStorage.getItem('anonymous_codes') || '[]');
      const allCodes = [...existingCodes, ...newCodes];
      localStorage.setItem('anonymous_codes', JSON.stringify(allCodes));

      setGeneratedCodes(newCodes);
      onCodesGenerated(newCodes);
    } catch (error) {
      console.error('Error generating codes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const copyAllCodes = async () => {
    const codesList = generatedCodes.map(c => c.code).join('\\n');
    try {
      await navigator.clipboard.writeText(codesList);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy codes:', error);
    }
  };

  const getFeedbackUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/en/feedback/code`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          {t('invitation.codes.generate.title') || 'Generate Anonymous Feedback Codes'}
        </h3>
        <p className="text-white/80 text-sm">
          {t('invitation.codes.generate.subtitle') || 'Create codes you can share via text, chat, or in-person for maximum privacy'}
        </p>
      </div>

      {!generatedCodes.length ? (
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-2">
                {t('invitation.codes.count.label') || 'Number of codes to generate'}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={codeCount}
                onChange={(e) => setCodeCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-2">
                {t('invitation.codes.expiry.label') || 'Expires in (days)'}
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                className="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value={7} className="bg-gray-800">7 days</option>
                <option value={14} className="bg-gray-800">14 days</option>
                <option value={30} className="bg-gray-800">30 days</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateCodes}
            disabled={isGenerating}
            className="w-full p-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t('invitation.codes.generating') || 'Generating codes...'}
              </>
            ) : (
              <>
                🔑 {t('invitation.codes.generate.button') || 'Generate Anonymous Codes'}
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold text-white">
              {t('invitation.codes.generated.title') || 'Your Anonymous Feedback Codes'}
            </h4>
            <button
              onClick={copyAllCodes}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors duration-300"
            >
              📋 {t('invitation.codes.copyall') || 'Copy All'}
            </button>
          </div>

          <div className="grid gap-2">
            {generatedCodes.map((codeObj, index) => (
              <div
                key={codeObj.id}
                className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm">#{index + 1}</span>
                  <code className="text-lg font-mono text-white bg-white/20 px-3 py-1 rounded">
                    {codeObj.code}
                  </code>
                </div>
                <button
                  onClick={() => copyCode(codeObj.code)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded transition-colors duration-300"
                >
                  📋
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-500/20 border border-blue-400 rounded-lg">
            <h5 className="font-bold text-white mb-2">
              📱 {t('invitation.codes.sharing.title') || 'How to Share These Codes'}
            </h5>
            <div className="text-white/80 text-sm space-y-2">
              <p>
                <strong>{t('invitation.codes.sharing.url') || 'Feedback URL:'}:</strong>
                <br />
                <code className="text-xs bg-white/20 px-2 py-1 rounded">{getFeedbackUrl()}</code>
              </p>
              <p>
                <strong>{t('invitation.codes.sharing.message') || 'Sample message:'}:</strong>
                <br />
                <em className="text-xs">
                  "{t('invitation.codes.sharing.sample') || `Hi! I'm collecting anonymous feedback for personal growth. Please go to ${getFeedbackUrl()} and use code: [CODE]. Takes 5-10 minutes. Thanks!`}"
                </em>
              </p>
              <div className="text-xs text-white/60 mt-3">
                <p>• {t('invitation.codes.sharing.tip1') || 'Share via text, WhatsApp, Discord, or in-person'}</p>
                <p>• {t('invitation.codes.sharing.tip2') || 'Each code can be used multiple times'}</p>
                <p>• {t('invitation.codes.sharing.tip3') || `Codes expire on ${new Date(generatedCodes[0]?.expiresAt).toLocaleDateString()}`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from 'react';
import { useTranslation } from '@/components/providers/translation-provider';

interface ShareButtonProps {
  testId: string;
  testName: string;
  result?: any;
  className?: string;
  variant?: 'button' | 'dropdown' | 'grid';
  showLabel?: boolean;
}

export default function ShareButton({
  testId,
  testName,
  result,
  className = '',
  variant = 'dropdown',
  showLabel = true
}: ShareButtonProps) {
  const { t, currentLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const generateShareText = () => {
    let shareText = `🧠 I just completed the ${testName}!`;

    if (result?.type) {
      shareText += ` My result: ${result.type}`;
    }
    if (result?.compatibility) {
      shareText += ` (${result.compatibility}% compatibility)`;
    }
    if (result?.traits && result.traits.length > 0) {
      shareText += ` Traits: ${result.traits.slice(0, 2).join(', ')}${result.traits.length > 2 ? '...' : ''}`;
    }

    shareText += ` ✨`;
    return shareText;
  };

  const getTestUrl = () => {
    return `https://korean-mbti-platform.netlify.app/${currentLanguage}/tests/${testId}`;
  };

  const shareToSNS = (platform: string) => {
    const shareText = generateShareText();
    const testUrl = getTestUrl();

    switch (platform) {
      case 'copy':
        const textToCopy = `${shareText}\n\nTake the test yourself: ${testUrl}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          alert(t('share.copied') || 'Result link copied to clipboard!');
        }).catch(() => {
          // Fallback for browsers that don't support clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert(t('share.copied') || 'Result link copied to clipboard!');
        });
        break;

      case 'twitter':
        const twitterText = encodeURIComponent(`${shareText}\n\nTake the test: ${testUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, '_blank');
        break;

      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(testUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;

      case 'linkedin':
        const linkedinText = encodeURIComponent(shareText);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(testUrl)}&summary=${linkedinText}`, '_blank');
        break;

      case 'whatsapp':
        const whatsappText = encodeURIComponent(`${shareText}\n\nTake the test: ${testUrl}`);
        window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
        break;

      case 'kakao':
        // KakaoTalk sharing (popular in Korea)
        const kakaoText = encodeURIComponent(`${shareText}\n\n테스트 해보기: ${testUrl}`);
        window.open(`https://story.kakao.com/share?url=${encodeURIComponent(testUrl)}&text=${kakaoText}`, '_blank');
        break;

      case 'line':
        // LINE sharing (popular in Asia)
        const lineText = encodeURIComponent(`${shareText}\n\nTake the test: ${testUrl}`);
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(testUrl)}&text=${lineText}`, '_blank');
        break;

      case 'telegram':
        const telegramText = encodeURIComponent(`${shareText}\n\nTake the test: ${testUrl}`);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(testUrl)}&text=${telegramText}`, '_blank');
        break;

      case 'reddit':
        window.open(`https://reddit.com/submit?url=${encodeURIComponent(testUrl)}&title=${encodeURIComponent(shareText)}`, '_blank');
        break;

      case 'email':
        const emailSubject = encodeURIComponent(`Check out my ${testName} results!`);
        const emailBody = encodeURIComponent(`${shareText}\n\nTake the test yourself: ${testUrl}`);
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
        break;
    }

    setIsOpen(false);
  };

  const shareOptions = [
    { id: 'copy', label: t('share.copy_link') || 'Copy Link', icon: '📋', color: 'gray' },
    { id: 'whatsapp', label: t('share.whatsapp') || 'WhatsApp', icon: '💬', color: 'green' },
    { id: 'kakao', label: t('share.kakao') || 'KakaoTalk', icon: '💛', color: 'yellow' },
    { id: 'line', label: t('share.line') || 'LINE', icon: '💚', color: 'green' },
    { id: 'twitter', label: t('share.twitter') || 'Twitter', icon: '🐦', color: 'blue' },
    { id: 'facebook', label: t('share.facebook') || 'Facebook', icon: '📘', color: 'blue' },
    { id: 'linkedin', label: t('share.linkedin') || 'LinkedIn', icon: '💼', color: 'blue' },
    { id: 'telegram', label: t('share.telegram') || 'Telegram', icon: '✈️', color: 'blue' },
    { id: 'reddit', label: t('share.reddit') || 'Reddit', icon: '🔴', color: 'orange' },
    { id: 'email', label: t('share.email') || 'Email', icon: '📧', color: 'gray' }
  ];

  if (variant === 'button') {
    return (
      <button
        onClick={() => shareToSNS('copy')}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 ${className}`}
      >
        <span className="text-lg">📤</span>
        {showLabel && (t('share.share_result') || 'Share Result')}
      </button>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📤</span>
          {t('share.share_result') || 'Share Your Result'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => shareToSNS(option.id)}
              className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {option.icon}
              </span>
              <span className="text-xs text-white/80 text-center">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
      >
        <span className="text-lg">📤</span>
        {showLabel && (t('share.share_result') || 'Share')}
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg shadow-xl z-20 animate-fadeInScale">
            <div className="p-2 space-y-1">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => shareToSNS(option.id)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded flex items-center gap-3 transition-colors"
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="flex-1">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
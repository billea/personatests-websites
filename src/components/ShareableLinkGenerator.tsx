"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/translation-provider';
import { ShareableLink } from '@/lib/invitation-types';

interface ShareableLinkGeneratorProps {
  testResultId: string;
  testId: string;
  userName: string;
  onLinkGenerated: (linkData: ShareableLink) => void;
}

export default function ShareableLinkGenerator({ 
  testResultId, 
  testId, 
  userName, 
  onLinkGenerated 
}: ShareableLinkGeneratorProps) {
  const { t } = useTranslation();
  const [generatedLink, setGeneratedLink] = useState<ShareableLink | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expiryDays, setExpiryDays] = useState(14);
  const [maxResponses, setMaxResponses] = useState<number | undefined>(undefined);
  const [enableLimit, setEnableLimit] = useState(false);

  const generateShareableLink = async () => {
    setIsGenerating(true);
    
    try {
      const now = new Date();
      const expiry = new Date(now.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
      const linkId = `link_${testResultId}_${Date.now()}`;
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const shareableUrl = `${baseUrl}/en/feedback/share?linkId=${linkId}`;
      
      const linkData: ShareableLink = {
        id: linkId,
        testResultId,
        testId,
        userId: 'current_user', // In real app, get from auth context
        userName,
        method: 'link' as const,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        status: 'active' as const,
        link: shareableUrl,
        linkId,
        responseCount: 0,
        maxResponses: enableLimit ? maxResponses : undefined,
        isPublic: true
      };

      // Store link data in localStorage for static deployment
      const existingLinks = JSON.parse(localStorage.getItem('shareable_links') || '[]');
      const allLinks = [...existingLinks, linkData];
      localStorage.setItem('shareable_links', JSON.stringify(allLinks));

      setGeneratedLink(linkData);
      onLinkGenerated(linkData);
    } catch (error) {
      console.error('Error generating shareable link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink.link);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const generateQRCode = () => {
    if (!generatedLink) return '';
    
    // Using a simple QR code service - in production, you might want to use a proper QR library
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedLink.link)}`;
    return qrUrl;
  };

  const getSocialShareUrls = () => {
    if (!generatedLink) return {};
    
    const message = encodeURIComponent(
      `Help me grow with anonymous feedback! Share your honest thoughts - takes 5-10 minutes. ${generatedLink.link}`
    );
    
    return {
      twitter: `https://twitter.com/intent/tweet?text=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedLink.link)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generatedLink.link)}`,
      whatsapp: `https://wa.me/?text=${message}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(generatedLink.link)}&text=${encodeURIComponent('Help me grow with anonymous feedback!')}`
    };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          {t('invitation.link.generate.title') || 'Create Shareable Feedback Link'}
        </h3>
        <p className="text-white/80 text-sm">
          {t('invitation.link.generate.subtitle') || 'Generate one link to share on social media, group chats, or anywhere online'}
        </p>
      </div>

      {!generatedLink ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('invitation.link.expiry.label') || 'Link expires in'}
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                className="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value={7} className="bg-gray-800">7 days</option>
                <option value={14} className="bg-gray-800">14 days</option>
                <option value={30} className="bg-gray-800">30 days</option>
                <option value={90} className="bg-gray-800">90 days</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {t('invitation.link.limit.label') || 'Response limit (optional)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="enableLimit"
                  checked={enableLimit}
                  onChange={(e) => setEnableLimit(e.target.checked)}
                  className="mt-3"
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxResponses || 20}
                  onChange={(e) => setMaxResponses(parseInt(e.target.value) || undefined)}
                  disabled={!enableLimit}
                  className="flex-1 p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                  placeholder="Max responses"
                />
              </div>
            </div>
          </div>

          <button
            onClick={generateShareableLink}
            disabled={isGenerating}
            className="w-full p-4 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t('invitation.link.generating') || 'Generating link...'}
              </>
            ) : (
              <>
                🔗 {t('invitation.link.generate.button') || 'Generate Shareable Link'}
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-green-500/20 border border-green-400 rounded-lg">
            <h4 className="text-lg font-bold text-white mb-3">
              ✅ {t('invitation.link.generated.title') || 'Your Shareable Feedback Link is Ready!'}
            </h4>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={generatedLink.link}
                readOnly
                className="flex-1 p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm"
              />
              <button
                onClick={copyLink}
                className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-300"
                title="Copy link"
              >
                📋
              </button>
            </div>

            <div className="text-white/80 text-sm">
              <p>• {t('invitation.link.info.expires') || `Expires: ${new Date(generatedLink.expiresAt).toLocaleDateString()}`}</p>
              {generatedLink.maxResponses && (
                <p>• {t('invitation.link.info.limit') || `Max responses: ${generatedLink.maxResponses}`}</p>
              )}
              <p>• {t('invitation.link.info.responses') || `Current responses: ${generatedLink.responseCount}`}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Social Media Sharing */}
            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
              <h5 className="font-bold text-white mb-3">
                📱 {t('invitation.link.social.title') || 'Share on Social Media'}
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(getSocialShareUrls()).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded transition-colors duration-300 text-center capitalize"
                  >
                    {platform === 'whatsapp' ? 'WhatsApp' : platform}
                  </a>
                ))}
              </div>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-center">
              <h5 className="font-bold text-white mb-3">
                📱 {t('invitation.link.qr.title') || 'QR Code'}
              </h5>
              <img
                src={generateQRCode()}
                alt="Feedback QR Code"
                className="mx-auto mb-2 bg-white p-2 rounded"
                width={120}
                height={120}
              />
              <p className="text-white/70 text-xs">
                {t('invitation.link.qr.description') || 'Scan to access feedback form'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-500/20 border border-blue-400 rounded-lg">
            <h5 className="font-bold text-white mb-2">
              💡 {t('invitation.link.tips.title') || 'Sharing Tips'}
            </h5>
            <div className="text-white/80 text-sm space-y-1">
              <p>• {t('invitation.link.tips.tip1') || 'Perfect for social media posts and group chats'}</p>
              <p>• {t('invitation.link.tips.tip2') || 'Anyone with the link can provide feedback'}</p>
              <p>• {t('invitation.link.tips.tip3') || 'Responses are completely anonymous'}</p>
              <p>• {t('invitation.link.tips.tip4') || 'Consider posting in multiple places for diverse feedback'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
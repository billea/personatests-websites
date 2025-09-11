"use client";

import { useState } from 'react';
import { useTranslation } from '@/components/providers/translation-provider';

export type InvitationMethod = 'email' | 'codes' | 'link' | 'mixed';

interface InvitationMethodOption {
  id: InvitationMethod;
  icon: string;
  title: string;
  description: string;
  privacy: string;
  effort: string;
  pros: string[];
  cons: string[];
}

interface InvitationMethodSelectorProps {
  onMethodSelect: (method: InvitationMethod) => void;
  testId: string;
}

export default function InvitationMethodSelector({ onMethodSelect, testId }: InvitationMethodSelectorProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<InvitationMethod | null>(null);

  const invitationOptions: InvitationMethodOption[] = [
    {
      id: 'email',
      icon: '📧',
      title: t('invitation.email.title') || 'Email Invitations',
      description: t('invitation.email.description') || 'Send direct email invites to specific people',
      privacy: t('invitation.privacy.standard') || 'Standard Privacy',
      effort: t('invitation.effort.easy') || 'Easy Setup',
      pros: [
        t('invitation.email.pro1') || 'Higher response rate',
        t('invitation.email.pro2') || 'Direct delivery to inbox',
        t('invitation.email.pro3') || 'Familiar process'
      ],
      cons: [
        t('invitation.email.con1') || 'Email addresses are recorded',
        t('invitation.email.con2') || 'Requires recipients to have email accounts'
      ]
    },
    {
      id: 'codes',
      icon: '🔑',
      title: t('invitation.codes.title') || 'Anonymous Codes',
      description: t('invitation.codes.description') || 'Generate codes to share manually via text, chat, or in-person',
      privacy: t('invitation.privacy.maximum') || 'Maximum Privacy',
      effort: t('invitation.effort.manual') || 'Manual Sharing',
      pros: [
        t('invitation.codes.pro1') || 'Complete anonymity',
        t('invitation.codes.pro2') || 'No email tracking',
        t('invitation.codes.pro3') || 'Flexible sharing methods'
      ],
      cons: [
        t('invitation.codes.con1') || 'Lower response rate',
        t('invitation.codes.con2') || 'Codes might get lost'
      ]
    },
    {
      id: 'link',
      icon: '🔗',
      title: t('invitation.link.title') || 'Shareable Link',
      description: t('invitation.link.description') || 'Create one link to share on social media or with groups',
      privacy: t('invitation.privacy.high') || 'High Privacy',
      effort: t('invitation.effort.veryeasy') || 'Very Easy',
      pros: [
        t('invitation.link.pro1') || 'Easy to share widely',
        t('invitation.link.pro2') || 'Great for social media',
        t('invitation.link.pro3') || 'No individual tracking'
      ],
      cons: [
        t('invitation.link.con1') || 'Can\'t control who responds',
        t('invitation.link.con2') || 'Potential for random responses'
      ]
    },
    {
      id: 'mixed',
      icon: '🎯',
      title: t('invitation.mixed.title') || 'Multiple Methods',
      description: t('invitation.mixed.description') || 'Use different invitation methods for different situations',
      privacy: t('invitation.privacy.flexible') || 'Flexible Privacy',
      effort: t('invitation.effort.custom') || 'Custom Setup',
      pros: [
        t('invitation.mixed.pro1') || 'Best of all methods',
        t('invitation.mixed.pro2') || 'Adapt to different relationships',
        t('invitation.mixed.pro3') || 'Maximum flexibility'
      ],
      cons: [
        t('invitation.mixed.con1') || 'More complex setup',
        t('invitation.mixed.con2') || 'Need to manage multiple methods'
      ]
    }
  ];

  const handleMethodSelect = (method: InvitationMethod) => {
    setSelectedMethod(method);
    onMethodSelect(method);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          {t('invitation.selector.title') || 'How would you like to collect feedback?'}
        </h2>
        <p className="text-white/80">
          {t('invitation.selector.subtitle') || 'Choose the method that works best for your situation and privacy preferences.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {invitationOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleMethodSelect(option.id)}
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-300 ${
              selectedMethod === option.id
                ? 'border-blue-400 bg-blue-500/20 backdrop-blur-sm'
                : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{option.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                <p className="text-white/80 text-sm mb-3">{option.description}</p>
                
                <div className="flex gap-4 text-xs mb-3">
                  <span className="px-2 py-1 bg-white/20 rounded-full text-white">
                    {option.privacy}
                  </span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-white">
                    {option.effort}
                  </span>
                </div>

                <div className="text-xs text-white/70">
                  <div className="mb-2">
                    <strong className="text-green-400">✓ Pros:</strong>
                    <ul className="ml-4 mt-1">
                      {option.pros.map((pro, index) => (
                        <li key={index}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-yellow-400">⚠ Cons:</strong>
                    <ul className="ml-4 mt-1">
                      {option.cons.map((con, index) => (
                        <li key={index}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400 rounded-lg">
          <p className="text-white text-center">
            {t('invitation.selector.selected') || 'Selected:'} <strong>{invitationOptions.find(o => o.id === selectedMethod)?.title}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
// Types for the hybrid invitation system

export type InvitationMethod = 'email' | 'codes' | 'link' | 'mixed';

export interface BaseInvitation {
  id: string;
  testResultId: string;
  testId: string;
  userId: string;
  userName: string;
  method: InvitationMethod;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'completed';
}

export interface EmailInvitation extends BaseInvitation {
  method: 'email';
  participantEmail: string;
  invitationToken: string;
  emailSentAt?: string;
  completedAt?: string;
}

export interface AnonymousCode extends BaseInvitation {
  method: 'codes';
  code: string;
  usageCount: number;
  maxUsages?: number;
  lastUsedAt?: string;
}

export interface ShareableLink extends BaseInvitation {
  method: 'link';
  link: string;
  linkId: string;
  responseCount: number;
  maxResponses?: number;
  isPublic: boolean;
}

export type AnyInvitation = EmailInvitation | AnonymousCode | ShareableLink;

// Feedback response types for different access methods
export interface BaseFeedbackResponse {
  id: string;
  testResultId: string;
  testId: string;
  testOwnerId: string;
  answers: { [questionId: string]: any };
  result: any;
  submittedAt: string;
  method: InvitationMethod;
}

export interface EmailFeedbackResponse extends BaseFeedbackResponse {
  method: 'email';
  invitationId: string;
  invitationToken: string;
  participantEmail: string;
}

export interface CodeFeedbackResponse extends BaseFeedbackResponse {
  method: 'codes';
  codeUsed: string;
  codeId: string;
}

export interface LinkFeedbackResponse extends BaseFeedbackResponse {
  method: 'link';
  linkId: string;
  shareableLink: string;
}

export type AnyFeedbackResponse = EmailFeedbackResponse | CodeFeedbackResponse | LinkFeedbackResponse;

// Analytics and tracking
export interface InvitationAnalytics {
  testResultId: string;
  totalInvitations: number;
  totalResponses: number;
  responseRate: number;
  methodBreakdown: {
    email: { sent: number; responses: number };
    codes: { generated: number; used: number; responses: number };
    link: { created: number; clicks: number; responses: number };
  };
  averageResponseTime: number; // in hours
  lastResponseAt: string;
}

// Storage interfaces for localStorage/Firestore
export interface InvitationStorage {
  emailInvitations: EmailInvitation[];
  anonymousCodes: AnonymousCode[];
  shareableLinks: ShareableLink[];
  feedbackResponses: AnyFeedbackResponse[];
  analytics: { [testResultId: string]: InvitationAnalytics };
}

// Helper functions for invitation management
export const createInvitationId = (method: InvitationMethod, testResultId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${method}_${testResultId}_${timestamp}_${random}`;
};

export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

export const generateAnonymousCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

export const isInvitationExpired = (invitation: BaseInvitation): boolean => {
  return new Date(invitation.expiresAt) < new Date();
};

export const getInvitationAnalytics = (
  invitations: AnyInvitation[],
  responses: AnyFeedbackResponse[]
): InvitationAnalytics => {
  const testResultId = invitations[0]?.testResultId || '';
  
  const emailInvitations = invitations.filter(i => i.method === 'email') as EmailInvitation[];
  const codes = invitations.filter(i => i.method === 'codes') as AnonymousCode[];
  const links = invitations.filter(i => i.method === 'link') as ShareableLink[];
  
  const emailResponses = responses.filter(r => r.method === 'email');
  const codeResponses = responses.filter(r => r.method === 'codes');
  const linkResponses = responses.filter(r => r.method === 'link');
  
  const totalResponses = responses.length;
  const totalInvitations = invitations.length;
  
  // Calculate average response time
  const responseTimes = responses
    .map(response => {
      const invitation = invitations.find(inv => 
        (inv.method === 'email' && (inv as EmailInvitation).invitationToken === (response as EmailFeedbackResponse).invitationToken) ||
        (inv.method === 'codes' && inv.id === (response as CodeFeedbackResponse).codeId) ||
        (inv.method === 'link' && (inv as ShareableLink).linkId === (response as LinkFeedbackResponse).linkId)
      );
      if (!invitation) return 0;
      
      const invitedAt = new Date(invitation.createdAt);
      const respondedAt = new Date(response.submittedAt);
      return (respondedAt.getTime() - invitedAt.getTime()) / (1000 * 60 * 60); // hours
    })
    .filter(time => time > 0);
  
  const averageResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
    : 0;
  
  const lastResponseAt = responses.length > 0
    ? responses.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0].submittedAt
    : new Date().toISOString();
  
  return {
    testResultId,
    totalInvitations,
    totalResponses,
    responseRate: totalInvitations > 0 ? (totalResponses / totalInvitations) * 100 : 0,
    methodBreakdown: {
      email: { 
        sent: emailInvitations.length, 
        responses: emailResponses.length 
      },
      codes: { 
        generated: codes.length, 
        used: codes.reduce((sum, code) => sum + code.usageCount, 0),
        responses: codeResponses.length 
      },
      link: { 
        created: links.length, 
        clicks: links.reduce((sum, link) => sum + (link.responseCount || 0), 0),
        responses: linkResponses.length 
      }
    },
    averageResponseTime,
    lastResponseAt
  };
};
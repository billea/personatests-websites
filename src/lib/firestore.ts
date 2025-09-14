import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { firestore } from "./firebase";
import { User } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions";
import type { TestQuestion } from './test-definitions';

const functions = getFunctions();

// Test-related interfaces
export interface TestResult {
  id?: string;
  userId: string;
  testId: string;
  resultPayload: any;
  isPublic: boolean;
  createdAt: Timestamp;
}

export interface TestInvitation {
  id?: string;
  inviterUid: string;
  inviterName: string;
  testId: string;
  testResultId: string;
  participantEmail: string;
  status: 'pending' | 'completed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
  invitationToken?: string;
  feedbackCategory: 'work' | 'friends' | 'family' | 'academic' | 'general'; // NEW: Group tracking
}

export interface FeedbackSubmission {
  invitationId: string;
  testResultId: string;
  testOwnerId: string; // User ID who owns the test result
  feedbackPayload: any;
  submittedAt: Timestamp;
  reviewerEmail?: string;
  feedbackCategory: 'work' | 'friends' | 'family' | 'academic' | 'general'; // NEW: Group tracking
}

export interface FeedbackProgress {
  userId: string;
  testResultId: string;
  testId: string;
  totalInvitationsSent: number;
  feedbackReceived: number;
  pendingInvitations: string[]; // Array of invitation IDs
  completedInvitations: string[]; // Array of invitation IDs
  lastUpdated: Timestamp;
  // NEW: Group breakdown tracking
  categoryBreakdown: {
    work: { sent: number; received: number; pending: string[]; completed: string[]; };
    friends: { sent: number; received: number; pending: string[]; completed: string[]; };
    family: { sent: number; received: number; pending: string[]; completed: string[]; };
    academic: { sent: number; received: number; pending: string[]; completed: string[]; };
    general: { sent: number; received: number; pending: string[]; completed: string[]; };
  };
}

/**
 * Creates a user profile document in Firestore if one doesn't already exist.
 * This is typically called right after a user signs up or logs in for the first time.
 * @param user The user object from Firebase Authentication.
 */
export const createUserProfileDocument = async (user: User) => {
  if (!user) return;

  try {
    const userRef = doc(firestore, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const { email, displayName, uid } = user;
      const createdAt = serverTimestamp();

      try {
        await setDoc(userRef, {
          uid,
          email,
          displayName,
          createdAt,
          preferredLanguage: navigator.language.split('-')[0] || 'en',
        });
        console.log("User profile created successfully");
      } catch (error) {
        console.error("Error creating user profile:", error);
        throw error; // Re-throw so calling code can handle it
      }
    }
  } catch (error) {
    console.error("Error accessing user profile:", error);
    throw error; // Re-throw so calling code can handle it
  }
};

/**
 * Saves a test result to Firestore
 * @param userId - The user's UID
 * @param testId - The ID of the test taken
 * @param resultPayload - The test result data
 * @param isPublic - Whether the result can be shared publicly
 * @returns The document ID of the saved result
 */
export const saveTestResult = async (
  userId: string, 
  testId: string, 
  resultPayload: any, 
  isPublic: boolean = false
): Promise<string> => {
  try {
    const resultData: Omit<TestResult, 'id'> = {
      userId,
      testId,
      resultPayload,
      isPublic,
      createdAt: serverTimestamp() as Timestamp
    };

    const docRef = await addDoc(collection(firestore, "testResults"), resultData);
    console.log("Test result saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Firebase permissions error - test result not saved to Firestore:", error);
    // Return a local ID so the app can continue working
    const localId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    console.log("Using local storage fallback with ID:", localId);
    return localId;
  }
};

/**
 * Gets all test results for a specific user
 * @param userId - The user's UID
 * @returns Array of test results
 */
export const getUserTestResults = async (userId: string): Promise<TestResult[]> => {
  try {
    const q = query(
      collection(firestore, "testResults"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const results: TestResult[] = [];
    
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as TestResult);
    });
    
    return results;
  } catch (error: any) {
    console.error("Error getting user test results:", error);
    
    // Handle missing Firestore index gracefully to prevent infinite loops
    if (error?.code === 'failed-precondition' && error?.message?.includes('index')) {
      console.warn("Firestore index missing for getUserTestResults - returning empty results to prevent infinite loops");
      return [];
    }
    
    // For other errors, return empty array instead of throwing to prevent crashes
    return [];
  }
};

/**
 * Gets a specific test result by ID
 * @param resultId - The test result document ID
 * @returns The test result or null if not found
 */
export const getTestResult = async (resultId: string): Promise<TestResult | null> => {
  try {
    const docRef = doc(firestore, "testResults", resultId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as TestResult;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting test result:", error);
    throw error;
  }
};

// Type for feedback invitation response
interface FeedbackInvitationResponse {
  success: boolean;
  invitationsSent: number;
  invitations: Array<{
    email: string;
    link: string;
  }>;
  message: string;
}

/**
 * Sends feedback invitations for authenticated users with proper Firestore tracking
 * @param userId - The authenticated user's ID
 * @param testId - The ID of the test
 * @param testResultId - The ID of the saved test result
 * @param participantEmails - Array of email addresses to invite
 * @param userName - The user's name to personalize questions
 * @param feedbackCategory - The relationship category (work, friends, family, etc.)
 * @param language - Language for the feedback form
 * @returns Success status and invitation details
 */
// Couple Compatibility Invitation Function
export const sendCoupleCompatibilityInvitation = async (
  userId: string,
  testResultId: string, 
  partnerEmail: string,
  userName: string,
  language: string = 'en',
  ownerEmail?: string,
  partnerName?: string
): Promise<FeedbackInvitationResponse> => {
  try {
    const callId = Math.random().toString(36).substring(2, 15);
    console.log(`🚀 [${callId}] sendCoupleCompatibilityInvitation called with:`, {
      userId,
      testResultId,
      partnerEmail,
      userName,
      language,
      ownerEmail,
      partnerName,
      timestamp: new Date().toISOString()
    });

    // Create invitation record in Firestore or use fallback
    const invitationToken = generateInvitationToken();
    const invitationId = `couple_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const invitationData = {
      inviterUserId: userId,
      participantEmail: partnerEmail,
      testId: 'couple-compatibility',
      testResultId: testResultId,
      token: invitationToken,
      status: 'pending',
      inviterName: userName,
      feedbackCategory: 'couple', // Special category for compatibility tests
      createdAt: serverTimestamp() as Timestamp,
      language: language
    };

    try {
      const docRef = await addDoc(collection(firestore, "invitations"), invitationData);
      console.log("Couple compatibility invitation created with ID:", docRef.id);
    } catch (error) {
      console.warn("Firebase permissions - storing invitation in localStorage:", error);
      // Store in localStorage as fallback when Firebase permissions fail
      localStorage.setItem(`invitation_${invitationId}`, JSON.stringify({
        ...invitationData,
        createdAt: new Date().toISOString()
      }));
    }

    // Create invitation URL - point directly to the couple compatibility test
    const baseUrl = 'https://korean-mbti-platform.netlify.app';
    const invitationUrl = `${baseUrl}/${language}/tests/couple-compatibility?invitation=${invitationId}&token=${encodeURIComponent(invitationToken)}&partner=${encodeURIComponent(userName)}&testResultId=${encodeURIComponent(testResultId)}&email=${encodeURIComponent(partnerEmail)}&inviterEmail=${encodeURIComponent(ownerEmail || 'unknown@example.com')}`;

    console.log('Generated couple compatibility invitation URL:', invitationUrl);

    // Send email invitation using EmailJS
    try {
      const emailjs = (await import('@emailjs/browser')).default;
      
      // Use provided partner name or fall back to email prefix
      const recipientName = partnerName?.trim() || partnerEmail.split('@')[0];
      
      const emailParams = {
        // Try multiple common EmailJS variable names
        to_email: partnerEmail,
        email: partnerEmail,           // Alternative name
        recipient_email: partnerEmail, // Another common name
        to_name: recipientName,
        name: recipientName,           // Alternative name
        recipient_name: recipientName, // Another common name
        from_name: userName,
        sender_name: userName,         // Alternative name
        invitation_link: invitationUrl,
        link: invitationUrl,           // Alternative name
        message: `${userName} has invited you to take a Couple Compatibility Test together. Discover how compatible you are as a couple! This fun test analyzes your relationship compatibility across key areas like communication, lifestyle, and values.`,
        time_estimate: '5-10 minutes',
        additional_info: 'Your answers will be combined with your partner\'s to create a compatibility report for both of you.'
      };

      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      // Use dedicated couple compatibility template
      const templateId = 'template_m5atn39'; // Couple compatibility specific template
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
      
      console.log(`=== [${callId}] COUPLE COMPATIBILITY EMAILJS DEBUG ===`);
      console.log('Service ID:', serviceId);
      console.log('Template ID:', templateId);
      console.log('Public Key:', publicKey ? `${publicKey.substring(0, 8)}...` : 'MISSING');
      console.log('EmailJS parameters:', emailParams);
      console.log('Full invitation link being sent:', invitationUrl);
      console.log('Link length:', invitationUrl.length);
      console.log('Partner email:', partnerEmail);
      console.log('User name:', userName);
      console.log('Partner name (input):', partnerName);
      console.log('Recipient name (computed):', recipientName);
      console.log(`=== [${callId}] ATTEMPTING EMAILJS SEND ===`);

      const emailResponse = await emailjs.send(
        serviceId,
        templateId, 
        emailParams,
        publicKey
      );

      console.log(`✅ [${callId}] EMAIL SENT SUCCESSFULLY:`, emailResponse);
      console.log('Response status:', emailResponse.status);
      console.log('Response text:', emailResponse.text);

      // NOTE: Owner notification should be sent when partner COMPLETES test, not when invitation is sent
      // Removing this to prevent duplicate emails during invitation phase
      // if (ownerEmail) {
      //   await sendCompatibilityNotification(ownerEmail, userName, language);
      // }

    } catch (emailError: any) {
      console.warn('Email sending failed - invitation link can be shared manually:', emailError);
      // Continue even if email fails - user can share the link manually
    }

    return {
      success: true,
      invitationsSent: 1,
      invitations: [{
        email: partnerEmail,
        link: invitationUrl
      }],
      message: 'Couple compatibility invitation sent successfully!'
    };

  } catch (error) {
    console.error("❌ ERROR SENDING COUPLE COMPATIBILITY INVITATION:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    
    // Always return a success response with fallback manual sharing
    const fallbackUrl = `https://korean-mbti-platform.netlify.app/${language}/tests/couple-compatibility?partner=${encodeURIComponent(userName)}`;
    
    return {
      success: true,
      invitationsSent: 1,
      invitations: [{
        email: partnerEmail,
        link: fallbackUrl
      }],
      message: 'Link generated for manual sharing (email service unavailable)'
    };
  }
};

export const sendFeedbackInvitations = async (
  userId: string,
  testId: string,
  testResultId: string,
  participants: {name: string, email: string}[],
  userName: string,
  feedbackCategory: 'work' | 'friends' | 'family' | 'academic' | 'general',
  language: string = 'en',
  ownerEmail?: string
): Promise<FeedbackInvitationResponse> => {
  try {
    // Debug: Log all parameters received
    console.log('sendFeedbackInvitations called with:', {
      userId,
      testId,
      testResultId,
      participants,
      userName,
      feedbackCategory,
      language,
      ownerEmail
    });
    
    // Generate unique invitation tokens for each participant
    const invitations = participants.map(participant => ({
      id: `invite_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      email: participant.email,
      name: participant.name,
      testId,
      testResultId,
      userName,
      ownerEmail: ownerEmail || 'durha2000@gmail.com', // Include owner email for notifications
      invitationToken: generateInvitationToken(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    }));

    // Store invitations in Firestore for authenticated users with fallback handling
    let savedInvitations = [];
    try {
      const invitationPromises = invitations.map(async (invitation) => {
        const invitationData: Omit<TestInvitation, 'id' | 'createdAt'> = {
          inviterUid: userId,
          inviterName: userName,
          testId,
          testResultId,
          participantEmail: invitation.email,
          status: 'pending',
          invitationToken: invitation.invitationToken,
          feedbackCategory: feedbackCategory // NEW: Include category tracking
        };
        
        const docRef = await addDoc(collection(firestore, 'testInvitations'), {
          ...invitationData,
          createdAt: serverTimestamp()
        });
        
        return { ...invitation, firestoreId: docRef.id };
      });
      
      savedInvitations = await Promise.all(invitationPromises);
      console.log('Invitations saved to Firestore successfully:', savedInvitations.length);
      
      // Create or update feedback progress tracking
      try {
        await updateFeedbackProgress(userId, testResultId, testId, participants.length, savedInvitations.map(inv => inv.id), feedbackCategory);
      } catch (progressError) {
        console.warn('Failed to update feedback progress, but continuing with invitation generation:', progressError);
      }
      
    } catch (firestoreError) {
      console.warn('Firebase permissions error - using fallback invitation storage:', firestoreError);
      // Use local invitations array as fallback when Firestore fails
      savedInvitations = invitations;
    }

    // Store invitations in localStorage for static deployment
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('feedback_invitations', JSON.stringify(invitations));
        console.log('Invitations stored in localStorage:', invitations.length);
      } catch (error) {
        console.error('Failed to store invitations in localStorage:', error);
      }
    }

    // Create shareable feedback links for each participant
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://korean-mbti-platform.netlify.app';
    
    // Debug: Log the language being used
    console.log('Creating feedback links with language:', language);
    
    const feedbackLinks = invitations.map(invitation => {
      // Create URL with proper encoding and validation
      const params = new URLSearchParams({
        token: invitation.invitationToken,
        name: userName, // Let URLSearchParams handle encoding
        testId: testId,
        testResultId: testResultId,
        email: invitation.email // Let URLSearchParams handle encoding
      });
      
      const fullUrl = `${baseUrl}/${language}/feedback?invitationId=${invitation.id}&${params.toString()}`;
      
      // Log for debugging
      console.log(`Generated URL for ${invitation.email}:`);
      console.log(`Length: ${fullUrl.length} characters`);
      console.log(`URL: ${fullUrl}`);
      
      return {
        email: invitation.email,
        link: fullUrl
      };
    });

    // For development purposes, log the invitation links
    console.log('Feedback invitation links generated:');
    feedbackLinks.forEach(link => {
      console.log(`${link.email}: ${link.link}`);
    });

    // Send styled email invitations using EmailJS (matching couple compatibility design)
    try {
      const emailjs = (await import('@emailjs/browser')).default;
      
      const emailPromises = feedbackLinks.map(async (link, index) => {
        const participant = invitations[index];
        const recipientName = participant.name || link.email.split('@')[0];
        const friendlyCategory = {
          work: language === 'ko' ? '직장 동료' : 'Work Colleagues',
          friends: language === 'ko' ? '친구' : 'Friends', 
          family: language === 'ko' ? '가족' : 'Family',
          academic: language === 'ko' ? '학업 파트너' : 'Academic Partners',
          general: language === 'ko' ? '일반 관계' : 'General Relationships'
        }[feedbackCategory] || (language === 'ko' ? '360도 피드백' : '360° Feedback');
        
        const emailParams = {
          // Standard EmailJS parameters
          to_email: link.email,
          email: link.email,
          recipient_email: link.email,
          to_name: recipientName,
          name: recipientName,
          recipient_name: recipientName,
          from_name: userName,
          sender_name: userName,
          invitation_link: link.link,
          link: link.link,
          
          // Template-specific parameters with gradient design matching couple compatibility template
          test_title: language === 'ko' ? '🎯 360도 피드백 평가' : '🎯 360° Feedback Assessment',
          header_title: language === 'ko' ? '360도 피드백 평가' : '360° Feedback Assessment', 
          header_subtitle: language === 'ko' ? '다각도 성격 통찰력 제공하기' : 'Help Provide Multi-Perspective Personality Insights',
          greeting: language === 'ko' ? `안녕하세요 ${recipientName}님!` : `Hello ${recipientName}!`,
          invitation_message: language === 'ko' ? 
            `${userName}님이 360도 피드백 평가에 참여해 달라고 요청했습니다.` :
            `${userName} has requested your participation in a 360° feedback assessment.`,
          description: language === 'ko' ?
            `이 흥미롭고 통찰력 있는 평가는 ${userName}님이 다음을 발견할 수 있도록 도와줍니다:` :
            `This insightful and valuable assessment will help ${userName} discover:`,
          
          // Rich bullet points with emojis (similar to couple compatibility format)
          benefits: language === 'ko' ?
            `🎯 리더십과 의사소통 능력에 대한 피드백\n💬 팀워크와 협업 스타일 평가\n🧠 감정 지능과 대인관계 기술 분석\n⭐ 개인적, 전문적 성장을 위한 통찰력` :
            `🎯 Your valuable insights into ${userName}'s leadership and communication\n💬 Assessment of teamwork and collaboration style\n🧠 Analysis of emotional intelligence and interpersonal skills\n⭐ Professional growth insights from multiple perspectives`,
          
          // Enhanced description for professional context
          detailed_description: language === 'ko' ?
            `${userName}님이 전문적으로 성장하는 데 필요한 360도 피드백 평가에 참여해 달라는 요청을 받았습니다. 여러분의 응답은 완전히 익명으로 처리되며 ${userName}님의 성장에 도움이 될 것입니다.` :
            `${userName} has requested your participation in a 360° feedback assessment. You'll evaluate areas like leadership, communication, teamwork, and emotional intelligence. Your responses are completely anonymous and will help ${userName} grow professionally.`,
          
          cta_text: language === 'ko' ? '피드백 제공하기' : 'Provide Feedback',
          time_estimate: language === 'ko' ? '소요 시간: 5-10분' : 'Time Required: 5-10 minutes',
          footer_message: language === 'ko' ? 
            `${friendlyCategory} 관점에서 ${userName}님에 대한 질문에 답해주세요.` :
            `Please answer questions about ${userName} from your perspective as ${friendlyCategory.toLowerCase()}.`,
          privacy_note: language === 'ko' ? 
            '개인정보 보호: 귀하의 개별 답변은 비공개로 유지되며 결합된 피드백 결과만 공유됩니다.' :
            'Privacy: Your individual answers remain private - only the combined feedback results are shared.',
          
          // Additional styling parameters for gradient design
          template_type: 'gradient_design',
          primary_color: '#6366f1', // Purple-blue gradient start
          secondary_color: '#8b5cf6', // Purple gradient end
          emoji_icon: '🎯'
        };

        console.log(`Sending 360 feedback invitation email to: ${link.email}`);
        console.log('Email parameters:', emailParams);
        
        // Use the dedicated 360° feedback template
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
        const templateId = 'template_ftlg4we'; // Dedicated 360° feedback template
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
        
        console.log(`Using EmailJS template: ${templateId} for 360 feedback invitation`);
        
        try {
          const emailResponse = await emailjs.send(serviceId, templateId, emailParams, publicKey);
          console.log(`✅ 360 feedback invitation sent to ${link.email}:`, emailResponse);
          return { email: link.email, status: 'sent', response: emailResponse };
        } catch (emailError) {
          console.warn(`⚠️ Email failed for ${link.email}, but link still available:`, emailError);
          return { email: link.email, status: 'link_only', error: emailError };
        }
      });
      
      const emailResults = await Promise.all(emailPromises);
      const sentCount = emailResults.filter(r => r.status === 'sent').length;
      
      console.log(`📧 360 Feedback email invitations: ${sentCount}/${emailResults.length} sent successfully`);
      
    } catch (emailError) {
      console.warn('EmailJS not available for 360 feedback invitations, using link sharing only:', emailError);
    }
    
    return {
      success: true,
      invitationsSent: invitations.length,
      invitations: feedbackLinks,
      message: '360° Feedback invitations sent via email! Recipients will receive beautifully designed invitations with direct links to provide their feedback.'
    };
  } catch (error) {
    console.error("Error generating feedback invitations:", error);
    
    // Provide fallback response even when Firebase permissions fail
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://korean-mbti-platform.netlify.app';
    const fallbackLinks = participants.map(participant => {
      const fallbackUrl = `${baseUrl}/${language}/feedback?email=${encodeURIComponent(participant.email)}&name=${encodeURIComponent(userName)}&testId=${encodeURIComponent(testId)}`;
      return {
        email: participant.email,
        link: fallbackUrl
      };
    });
    
    return {
      success: true,
      invitationsSent: participants.length,
      invitations: fallbackLinks,
      message: 'Feedback invitations ready! If emails failed to send automatically, you can share these links manually with your reviewers.'
    };
  }
};

// Function to send couple compatibility results to both partners
export const sendCoupleCompatibilityResults = async (
  coupleCompatibility: any,
  partner1Email: string,
  partner2Email: string,
  partner1Name: string,
  partner2Name: string,
  language: string = 'en'
) => {
  try {
    const emailjs = (await import('@emailjs/browser')).default;
    
    const compatibilityPercentage = coupleCompatibility.compatibilityPercentage || 75;
    const resultTier = getCompatibilityTier(compatibilityPercentage);
    
    // Email parameters for both partners
    const baseUrl = 'https://korean-mbti-platform.netlify.app';
    const signupUrl1 = `${baseUrl}/${language}/auth?action=signup&redirect=${encodeURIComponent(`/${language}/results`)}&partner=${encodeURIComponent(partner2Name)}&source=couple-email`;
    const signupUrl2 = `${baseUrl}/${language}/auth?action=signup&redirect=${encodeURIComponent(`/${language}/results`)}&partner=${encodeURIComponent(partner1Name)}&source=couple-email`;
    
    // Extract area breakdown for detailed results
    const areaBreakdown = coupleCompatibility.areaBreakdown || 
                         coupleCompatibility.areaScores || 
                         coupleCompatibility.compatibilityData?.areaScores || 
                         {};
    
    // Format area breakdown for email display
    const formatAreaBreakdown = (areas: any) => {
      const areaNames = language === 'ko' ? {
        'Fun & Lifestyle': '재미 & 라이프스타일',
        'Values & Trust': '가치관 & 신뢰',
        'Communication': '의사소통',
        'Lifestyle Habits': '생활 습관',
        'Romance & Love': '로맨스 & 사랑'
      } : {
        'Fun & Lifestyle': 'Fun & Lifestyle',
        'Values & Trust': 'Values & Trust', 
        'Communication': 'Communication',
        'Lifestyle Habits': 'Lifestyle Habits',
        'Romance & Love': 'Romance & Love'
      };
      
      return Object.entries(areas).map(([area, score]) => {
        const areaName = areaNames[area as keyof typeof areaNames] || area;
        return `${areaName}: ${score}%`;
      }).join('\n');
    };

    const areaBreakdownText = formatAreaBreakdown(areaBreakdown);
    
    // Fallback if no area breakdown data is available
    const hasAreaData = Object.keys(areaBreakdown).length > 0;
    const finalAreaBreakdownText = hasAreaData ? areaBreakdownText : 
      (language === 'ko' ? '상세한 영역별 분석을 보려면 가입하세요!' : 'Sign up to see detailed area analysis!');

    const emailParams1 = {
      to_email: partner1Email,
      email: partner1Email, // Fallback email field
      recipient_email: partner1Email, // Another fallback
      to_name: partner1Name,
      partner_name: partner2Name,
      compatibility_percentage: compatibilityPercentage + '%',
      compatibility_tier: resultTier,
      partner1_type: coupleCompatibility.partner1?.type || 'Your Personality Type',
      partner2_type: coupleCompatibility.partner2?.type || 'Partner Personality Type',
      description: coupleCompatibility.description || 'Great compatibility potential!',
      subject: `💕 Your Couple Compatibility Results with ${partner2Name}`,
      test_name: 'Couple Compatibility Test',
      invitation_link: `${baseUrl}/${language}/results`, // Basic results page link
      // Add detailed results for email display
      area_breakdown: finalAreaBreakdownText,
      detailed_results: `💕 Couple Compatibility Results\n${compatibilityPercentage}%\n${coupleCompatibility.description || 'You complement each other beautifully!'}\n\n${partner1Name}\n${coupleCompatibility.partner1?.type || 'The Devoted Partner 💕'}\n\n${partner2Name}\n${coupleCompatibility.partner2?.type || 'The Devoted Partner 💕'}\n\nCompatibility Areas:\n${finalAreaBreakdownText}`,
      signup_cta: language === 'ko' ? 
        `${partner2Name}님과의 상세 호환성 분석을 확인하려면 무료 가입하세요!` :
        `Sign up free to unlock detailed compatibility analysis with ${partner2Name}!`,
      signup_url: signupUrl1,
      signup_button_text: language === 'ko' ? '🔍 상세 비교 보기 (무료)' : '🔍 View Detailed Comparison (Free)',
      button_explanation: language === 'ko' ? 
        '질문별 답변 비교, 심화 분석 및 관계 개선 팁을 확인하세요' :
        'See question-by-question answers, in-depth analysis, and relationship tips',
      comparison_features: language === 'ko' ? 
        '• 15개 질문별 답변 비교\n• 상세 호환성 분석 보고서\n• 관계 개선 제안사항\n• 결과 저장 및 재열람' :
        '• Question-by-question answer comparison\n• Detailed compatibility report\n• Relationship improvement suggestions\n• Save results for future access'
    };
    
    const emailParams2 = {
      to_email: partner2Email,
      email: partner2Email, // Fallback email field
      recipient_email: partner2Email, // Another fallback
      to_name: partner2Name,
      partner_name: partner1Name,
      compatibility_percentage: compatibilityPercentage + '%',
      compatibility_tier: resultTier,
      partner1_type: coupleCompatibility.partner1?.type || 'Partner Personality Type',
      partner2_type: coupleCompatibility.partner2?.type || 'Your Personality Type',
      description: coupleCompatibility.description || 'Great compatibility potential!',
      subject: `💕 Your Couple Compatibility Results with ${partner1Name}`,
      test_name: 'Couple Compatibility Test',
      invitation_link: `${baseUrl}/${language}/results`, // Basic results page link
      // Add detailed results for email display
      area_breakdown: finalAreaBreakdownText,
      detailed_results: `💕 Couple Compatibility Results\n${compatibilityPercentage}%\n${coupleCompatibility.description || 'You complement each other beautifully!'}\n\n${partner2Name}\n${coupleCompatibility.partner2?.type || 'The Devoted Partner 💕'}\n\n${partner1Name}\n${coupleCompatibility.partner1?.type || 'The Devoted Partner 💕'}\n\nCompatibility Areas:\n${finalAreaBreakdownText}`,
      signup_cta: language === 'ko' ? 
        `${partner1Name}님과의 상세 호환성 분석을 확인하려면 무료 가입하세요!` :
        `Sign up free to unlock detailed compatibility analysis with ${partner1Name}!`,
      signup_url: signupUrl2,
      signup_button_text: language === 'ko' ? '🔍 상세 비교 보기 (무료)' : '🔍 View Detailed Comparison (Free)',
      button_explanation: language === 'ko' ? 
        '질문별 답변 비교, 심화 분석 및 관계 개선 팁을 확인하세요' :
        'See question-by-question answers, in-depth analysis, and relationship tips',
      comparison_features: language === 'ko' ? 
        '• 15개 질문별 답변 비교\n• 상세 호환성 분석 보고서\n• 관계 개선 제안사항\n• 결과 저장 및 재열람' :
        '• Question-by-question answer comparison\n• Detailed compatibility report\n• Relationship improvement suggestions\n• Save results for future access'
    };
    
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = 'template_cqvgidu'; // Use dedicated couple compatibility results template
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
    
    console.log('🔍 COUPLE RESULTS EMAIL DEBUG:');
    console.log('- Service ID:', serviceId);
    console.log('- Template ID (hardcoded):', templateId);
    console.log('- Sending to partner1:', partner1Email, '- partner2:', partner2Email);
    console.log('- Couple compatibility data structure:', coupleCompatibility);
    console.log('- Area breakdown extracted:', areaBreakdown);
    console.log('- Area breakdown formatted:', formatAreaBreakdown(areaBreakdown));
    
    // Send emails to both partners
    await Promise.all([
      emailjs.send(serviceId, templateId, emailParams1, publicKey),
      emailjs.send(serviceId, templateId, emailParams2, publicKey)
    ]);
    
    console.log('Couple compatibility results sent to both partners successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Error sending couple compatibility results:', error);
    return { success: false, error };
  }
};

const getCompatibilityTier = (percentage: number): string => {
  if (percentage >= 95) return 'Soulmates 💍';
  if (percentage >= 85) return 'Power Couple ⚡';
  if (percentage >= 75) return 'Adventurous Duo 🌍';
  if (percentage >= 65) return 'Sweet Match 💕';
  if (percentage >= 50) return 'Work in Progress 🔨';
  if (percentage >= 35) return 'Learning Together 📚';
  return 'Opposites Attract 🤔';
};

// Helper function for couple compatibility notifications
const sendCompatibilityNotification = async (ownerEmail: string, partnerName: string, language: string) => {
  try {
    const emailParams = {
      to_email: ownerEmail,
      reviewer_name: 'Korean MBTI Platform',
      subject_name: ownerEmail.split('@')[0],
      relationship: 'notification',
      feedback_url: `https://korean-mbti-platform.netlify.app/${language}/results`,
      assessment_areas: language === 'ko' 
        ? `${partnerName}님이 커플 호환성 테스트를 완료했습니다. 결과를 확인하세요!`
        : `${partnerName} has completed your Couple Compatibility Test. Check your results!`,
      site_name: 'Korean MBTI Platform'
    };

    const emailjs = (await import('@emailjs/browser')).default;
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
      emailParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
    );

    console.log('Couple compatibility notification sent successfully');
  } catch (error) {
    console.error('Error sending couple compatibility notification:', error);
  }
};

// Function to save couple compatibility results to database
export const saveCoupleCompatibilityResult = async (coupleResultData: any) => {
  try {
    // Save to a dedicated couple_results collection with email-based lookup
    const docRef = doc(firestore, 'couple_results', coupleResultData.searchKey);
    await setDoc(docRef, {
      ...coupleResultData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Couple compatibility result saved to couple_results collection');
    return { success: true, id: coupleResultData.searchKey };
  } catch (error) {
    console.error('❌ Error saving couple compatibility result:', error);
    throw error;
  }
};

// Function to get couple compatibility results by email (for either partner)
export const getCoupleCompatibilityResultsByEmail = async (email: string) => {
  try {
    
    // Query for partner1Email
    const q = query(
      collection(firestore, 'couple_results'),
      where('partner1Email', '==', email)
    );
    
    // Query for partner2Email  
    const q2 = query(
      collection(firestore, 'couple_results'),
      where('partner2Email', '==', email)
    );
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q),
      getDocs(q2)
    ]);
    
    const results: any[] = [];
    
    snapshot1.forEach(doc => {
      const data = doc.data();
      results.push({ id: doc.id, ...data });
    });
    
    snapshot2.forEach(doc => {
      const data = doc.data();
      results.push({ id: doc.id, ...data });
    });
    
    // Remove duplicates based on searchKey
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.searchKey === result.searchKey)
    );
    
    return uniqueResults;
  } catch (error) {
    return [];
  }
};

// Helper function to generate invitation tokens
function generateInvitationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Updates feedback progress tracking for a user
 * @param userId - The user's ID
 * @param testResultId - The test result ID
 * @param testId - The test ID
 * @param newInvitationsCount - Number of new invitations sent
 * @param newInvitationIds - Array of new invitation IDs
 * @param category - The feedback category (work, friends, family, etc.)
 */
async function updateFeedbackProgress(
  userId: string,
  testResultId: string,
  testId: string,
  newInvitationsCount: number,
  newInvitationIds: string[],
  category: 'work' | 'friends' | 'family' | 'academic' | 'general'
): Promise<void> {
  try {
    const progressRef = doc(firestore, 'feedbackProgress', `${userId}_${testResultId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      // Update existing progress
      const currentData = progressDoc.data() as FeedbackProgress;
      const updatedCategoryBreakdown = { ...currentData.categoryBreakdown };
      
      // Initialize category if it doesn't exist
      if (!updatedCategoryBreakdown[category]) {
        updatedCategoryBreakdown[category] = {
          sent: 0,
          received: 0,
          pending: [],
          completed: []
        };
      }
      
      // Update category-specific tracking
      updatedCategoryBreakdown[category].sent += newInvitationsCount;
      updatedCategoryBreakdown[category].pending.push(...newInvitationIds);
      
      await setDoc(progressRef, {
        ...currentData,
        totalInvitationsSent: currentData.totalInvitationsSent + newInvitationsCount,
        pendingInvitations: [...currentData.pendingInvitations, ...newInvitationIds],
        categoryBreakdown: updatedCategoryBreakdown,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } else {
      // Create new progress tracking with category breakdown
      const categoryBreakdown: FeedbackProgress['categoryBreakdown'] = {
        work: { sent: 0, received: 0, pending: [], completed: [] },
        friends: { sent: 0, received: 0, pending: [], completed: [] },
        family: { sent: 0, received: 0, pending: [], completed: [] },
        academic: { sent: 0, received: 0, pending: [], completed: [] },
        general: { sent: 0, received: 0, pending: [], completed: [] }
      };
      
      // Set the specific category data
      categoryBreakdown[category] = {
        sent: newInvitationsCount,
        received: 0,
        pending: newInvitationIds,
        completed: []
      };
      
      const progressData: Omit<FeedbackProgress, 'lastUpdated'> = {
        userId,
        testResultId,
        testId,
        totalInvitationsSent: newInvitationsCount,
        feedbackReceived: 0,
        pendingInvitations: newInvitationIds,
        completedInvitations: [],
        categoryBreakdown
      };
      
      await setDoc(progressRef, {
        ...progressData,
        lastUpdated: serverTimestamp()
      });
    }
    
    console.log('Feedback progress updated successfully');
  } catch (error) {
    console.error('Error updating feedback progress:', error);
    throw error;
  }
}

/**
 * Saves feedback submission and updates progress tracking
 * @param invitationId - The invitation ID
 * @param testResultId - The test result ID  
 * @param testOwnerId - The user ID who owns the test
 * @param feedbackData - The feedback submission data
 * @param reviewerEmail - Email of the person providing feedback
 * @param feedbackCategory - The feedback category (work, friends, family, etc.)
 */
export const saveFeedbackSubmission = async (
  invitationId: string,
  testResultId: string,
  testOwnerId: string,
  feedbackData: any,
  reviewerEmail: string,
  feedbackCategory: 'work' | 'friends' | 'family' | 'academic' | 'general'
): Promise<void> => {
  try {
    // Save the feedback submission
    const feedbackSubmission: Omit<FeedbackSubmission, 'submittedAt'> = {
      invitationId,
      testResultId,
      testOwnerId,
      feedbackPayload: feedbackData,
      reviewerEmail,
      feedbackCategory
    };
    
    await addDoc(collection(firestore, 'feedbackSubmissions'), {
      ...feedbackSubmission,
      submittedAt: serverTimestamp()
    });
    
    // Update invitation status
    const invitationsQuery = query(
      collection(firestore, 'testInvitations'),
      where('invitationToken', '==', invitationId) // Assuming invitation ID is the token
    );
    
    const invitationDocs = await getDocs(invitationsQuery);
    if (!invitationDocs.empty) {
      const invitationDoc = invitationDocs.docs[0];
      await setDoc(invitationDoc.ref, {
        status: 'completed',
        completedAt: serverTimestamp()
      }, { merge: true });
    }
    
    // Update feedback progress
    const progressRef = doc(firestore, 'feedbackProgress', `${testOwnerId}_${testResultId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      const currentData = progressDoc.data() as FeedbackProgress;
      const updatedPendingInvitations = currentData.pendingInvitations.filter(id => id !== invitationId);
      const updatedCompletedInvitations = [...currentData.completedInvitations, invitationId];
      
      await setDoc(progressRef, {
        feedbackReceived: currentData.feedbackReceived + 1,
        pendingInvitations: updatedPendingInvitations,
        completedInvitations: updatedCompletedInvitations,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    }
    
    console.log('Feedback submission saved and progress updated');
  } catch (error) {
    console.error('Error saving feedback submission:', error);
    throw error;
  }
}

/**
 * Gets feedback progress for a user's test result
 * @param userId - The user's ID
 * @param testResultId - The test result ID
 * @returns Feedback progress data
 */
export const getFeedbackProgress = async (
  userId: string,
  testResultId: string
): Promise<FeedbackProgress | null> => {
  try {
    const progressRef = doc(firestore, 'feedbackProgress', `${userId}_${testResultId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      return progressDoc.data() as FeedbackProgress;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting feedback progress:', error);
    throw error;
  }
}

/**
 * Gets all feedback submissions for a user's test result
 * @param userId - The user's ID
 * @param testResultId - The test result ID
 * @returns Array of feedback submissions
 */
export const getUserFeedbackSubmissions = async (
  userId: string,
  testResultId: string
): Promise<FeedbackSubmission[]> => {
  try {
    const feedbackQuery = query(
      collection(firestore, 'feedbackSubmissions'),
      where('testOwnerId', '==', userId),
      where('testResultId', '==', testResultId),
      orderBy('submittedAt', 'desc')
    );
    
    const feedbackDocs = await getDocs(feedbackQuery);
    return feedbackDocs.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as FeedbackSubmission & { id: string }));
  } catch (error) {
    console.error('Error getting user feedback submissions:', error);
    throw error;
  }
}

/**
 * Gets feedback submissions grouped by category for a user's test result
 * @param userId - The user's ID
 * @param testResultId - The test result ID
 * @returns Object with feedback submissions grouped by category
 */
export const getUserFeedbackByCategory = async (
  userId: string,
  testResultId: string
): Promise<{
  [key in 'work' | 'friends' | 'family' | 'academic' | 'general']: FeedbackSubmission[]
}> => {
  try {
    const allFeedback = await getUserFeedbackSubmissions(userId, testResultId);
    
    const feedbackByCategory = {
      work: [] as FeedbackSubmission[],
      friends: [] as FeedbackSubmission[],
      family: [] as FeedbackSubmission[],
      academic: [] as FeedbackSubmission[],
      general: [] as FeedbackSubmission[]
    };
    
    allFeedback.forEach(feedback => {
      if (feedback.feedbackCategory) {
        feedbackByCategory[feedback.feedbackCategory].push(feedback);
      }
    });
    
    return feedbackByCategory;
  } catch (error) {
    console.error('Error getting user feedback by category:', error);
    throw error;
  }
}

/**
 * Gets pending invitations for a user (as inviter)
 * @param userId - The user's UID
 * @returns Array of pending invitations
 */
export const getPendingInvitations = async (userId: string): Promise<TestInvitation[]> => {
  try {
    const q = query(
      collection(firestore, "invitations"),
      where("inviterUid", "==", userId),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const invitations: TestInvitation[] = [];
    
    querySnapshot.forEach((doc) => {
      invitations.push({ id: doc.id, ...doc.data() } as TestInvitation);
    });
    
    return invitations;
  } catch (error: any) {
    console.error("Error getting pending invitations:", error);
    
    // Handle missing Firestore index gracefully to prevent infinite loops
    if (error?.code === 'failed-precondition' && error?.message?.includes('index')) {
      console.warn("Firestore index missing for getPendingInvitations - returning empty results to prevent infinite loops");
      return [];
    }
    
    // For other errors, return empty array instead of throwing to prevent crashes
    return [];
  }
};

/**
 * Submits feedback for an invitation
 * @param invitationId - The invitation ID
 * @param feedbackPayload - The feedback data
 * @param invitationToken - The invitation token for verification
 * @returns Success status
 */
export const submitFeedback = async (
  invitationId: string,
  feedbackPayload: any,
  invitationToken: string
) => {
  try {
    const processFeedback = httpsCallable(functions, 'processFeedback');
    const result = await processFeedback({
      invitationId,
      feedbackPayload,
      invitationToken
    });
    
    return result.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

/**
 * Generates a compatibility report for two test results
 * @param result1Id - First test result ID
 * @param result2Id - Second test result ID
 * @returns Compatibility report data
 */
export const generateCompatibilityReport = async (
  result1Id: string,
  result2Id: string
) => {
  try {
    const generateReport = httpsCallable(functions, 'generateCompatibilityReport');
    const result = await generateReport({
      result1Id,
      result2Id
    });
    
    return result.data;
  } catch (error) {
    console.error("Error generating compatibility report:", error);
    throw error;
  }
};

/**
 * Gets feedback submissions for a test result
 * @param testResultId - The test result ID
 * @returns Array of feedback submissions
 */
export const getFeedbackForResult = async (testResultId: string) => {
  try {
    // First, get invitations for this test result
    const invitationsQuery = query(
      collection(firestore, "invitations"),
      where("testResultId", "==", testResultId),
      where("status", "==", "completed")
    );
    
    const invitationsSnap = await getDocs(invitationsQuery);
    const invitationIds = invitationsSnap.docs.map(doc => doc.id);
    
    if (invitationIds.length === 0) {
      return [];
    }
    
    // Get feedback for these invitations
    const feedbackQuery = query(
      collection(firestore, "anonymousFeedback"),
      where("invitationId", "in", invitationIds),
      orderBy("submittedAt", "desc")
    );
    
    const feedbackSnap = await getDocs(feedbackQuery);
    const feedback: FeedbackSubmission[] = [];
    
    feedbackSnap.forEach((doc) => {
      feedback.push(doc.data() as FeedbackSubmission);
    });
    
    return feedback;
  } catch (error) {
    console.error("Error getting feedback for result:", error);
    throw error;
  }
};

/**
 * Sends notification email to test owner when feedback is received
 * @param ownerEmail - Email of the person who owns the test
 * @param ownerName - Name of the person who owns the test
 * @param reviewerEmail - Email of the person who provided feedback (for anonymity, we might not include this)
 * @param testId - The test ID
 * @param language - Language for the notification
 * @returns Success status
 */
export const sendFeedbackNotification = async (
  ownerEmail: string,
  ownerName: string,
  reviewerEmail: string,
  testId: string,
  language: string = 'ko'
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Sending feedback notification to:', ownerEmail);
    
    // Dynamic import of EmailJS for client-side usage
    if (typeof window === 'undefined') {
      console.log('Server-side detected, skipping EmailJS notification');
      return { success: false, message: 'EmailJS only available on client-side' };
    }
    
    const emailjs = (await import('@emailjs/browser')).default;
    
    // Initialize EmailJS
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
    
    // Prepare email parameters for notification - different content based on test type
    const isCoupleCompatibility = testId === 'couple-compatibility';
    
    console.log('🔍 TEMPLATE SELECTION DEBUG - FORCE DEPLOY:');
    console.log('- testId received:', testId);
    console.log('- testId type:', typeof testId);
    console.log('- isCoupleCompatibility:', isCoupleCompatibility);
    console.log('- Comparison result:', testId === 'couple-compatibility');
    console.log('- Expected template:', isCoupleCompatibility ? 'template_cqvgidu' : 'default template');
    
    const emailParams = {
      to_email: ownerEmail,
      to_name: ownerName,
      from_name: 'Korean MBTI Platform',
      subject: isCoupleCompatibility ? 
        (language === 'ko' ? 
          `💕 커플 호환성 결과가 준비되었습니다!` : 
          `💕 Your Couple Compatibility Results Are Ready!`) :
        (language === 'ko' ? 
          `새로운 360° 피드백이 도착했습니다!` : 
          `New 360° Feedback Received!`),
      message: isCoupleCompatibility ? 
        (language === 'ko' ? 
          `안녕하세요 ${ownerName}님,\n\n파트너가 커플 호환성 테스트를 완료했습니다! 이제 두 분의 호환성 결과를 확인하실 수 있습니다.\n\n결과를 확인하려면 플랫폼에 로그인하세요:\nhttps://korean-mbti-platform.netlify.app/${language}/results\n\n감사합니다!\nKorean MBTI Platform` :
          `Hello ${ownerName},\n\nYour partner has completed the Couple Compatibility Test! Your compatibility results are now ready to view.\n\nLog in to your platform to see your results:\nhttps://korean-mbti-platform.netlify.app/${language}/results\n\nThank you!\nKorean MBTI Platform`) :
        (language === 'ko' ? 
          `안녕하세요 ${ownerName}님,\n\n360° 피드백 평가에 새로운 응답이 제출되었습니다.\n\n결과를 확인하려면 플랫폼에 로그인하세요:\nhttps://korean-mbti-platform.netlify.app/${language}/results\n\n감사합니다!\nKorean MBTI Platform` :
          `Hello ${ownerName},\n\nA new response has been submitted for your 360° Feedback Assessment.\n\nLog in to your platform to view the results:\nhttps://korean-mbti-platform.netlify.app/${language}/results\n\nThank you!\nKorean MBTI Platform`),
      reviewer_anonymous: isCoupleCompatibility ?
        (language === 'ko' ? '커플 호환성 결과 준비됨' : 'Couple compatibility results ready') :
        (language === 'ko' ? '새로운 익명 피드백' : 'New anonymous feedback')
    };
    
    console.log('=== FEEDBACK NOTIFICATION DEBUG ===');
    console.log('Notification email parameters:', {
      to_email: emailParams.to_email,
      to_name: emailParams.to_name,
      subject: emailParams.subject,
      language: language
    });
    console.log('=== END NOTIFICATION DEBUG ===');
    
    // Send notification email using appropriate template based on test type
    const templateId = isCoupleCompatibility ? 
      'template_cqvgidu' : // Couple compatibility completion notification template
      (process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''); // Default 360 feedback template
      
    console.log(`Using EmailJS template: ${templateId} for ${isCoupleCompatibility ? 'couple compatibility' : '360 feedback'} notification`);
    
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      templateId,
      {
        to_email: emailParams.to_email,
        email: emailParams.to_email, // Add fallback email field
        recipient_email: emailParams.to_email, // Add another fallback
        to_name: emailParams.to_name,
        from_name: emailParams.from_name,
        invitation_link: `https://korean-mbti-platform.netlify.app/${language}/results`, // Direct link to results page
        subject: emailParams.subject,
        message: emailParams.message,
        // Add couple-specific parameters for template compatibility
        partner_name: isCoupleCompatibility ? 'Your Partner' : '',
        test_type: isCoupleCompatibility ? 'Couple Compatibility' : '360 Feedback'
      }
    );
    
    console.log('✅ Feedback notification sent successfully:', result);
    
    return { 
      success: true, 
      message: 'Notification sent successfully' 
    };
    
  } catch (error) {
    console.error('❌ Failed to send feedback notification:', error);
    return { 
      success: false, 
      message: `Failed to send notification: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

/**
 * Deletes a specific test result from the database
 * @param resultId - The ID of the test result to delete
 * @param userId - The user's UID for authorization
 * @returns Promise indicating success/failure
 */
export const deleteTestResult = async (resultId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`🗑️ Attempting to delete test result: ${resultId} for user: ${userId}`);
    
    // First verify that the test result exists and belongs to the user
    const resultRef = doc(firestore, "testResults", resultId);
    const resultDoc = await getDoc(resultRef);
    
    if (!resultDoc.exists()) {
      console.log(`❌ Test result ${resultId} does not exist`);
      return {
        success: false,
        message: 'Test result not found'
      };
    }
    
    const resultData = resultDoc.data();
    if (resultData.userId !== userId) {
      console.log(`❌ User ${userId} is not authorized to delete test result ${resultId}`);
      return {
        success: false,
        message: 'Not authorized to delete this test result'
      };
    }
    
    // Delete the test result
    await deleteDoc(resultRef);
    
    console.log(`✅ Successfully deleted test result: ${resultId}`);
    return {
      success: true,
      message: 'Test result deleted successfully'
    };
    
  } catch (error) {
    console.error(`❌ Failed to delete test result ${resultId}:`, error);
    return {
      success: false,
      message: `Failed to delete test result: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// ===== GENERAL KNOWLEDGE QUESTIONS DATABASE =====

export interface GeneralKnowledgeQuestion {
  id: string;
  category: string; // e.g., "science", "history", "geography", "arts", "sports"
  difficulty: "easy" | "medium" | "hard";
  
  // Multilingual content - each language has its own version
  translations: {
    [languageCode: string]: {
      question: string;
      options: {
        a: string;
        b: string;
        c: string;
        d: string;
      };
      explanation?: string;
      tags?: string[]; // Language-specific tags if needed
    };
  };
  
  correctAnswer: "a" | "b" | "c" | "d"; // Same across all languages
  defaultLanguage: string; // Fallback language (e.g., 'en')
  availableLanguages: string[]; // ['en', 'ko', 'ja', 'es', 'fr', 'de', 'pt']
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


// Fetch random General Knowledge questions from database for a specific language
export const getRandomGeneralKnowledgeQuestions = async (
  count: number = 10, 
  language: string = 'en'
): Promise<TestQuestion[]> => {
  try {
    console.log(`🔍 Fetching ${count} random General Knowledge questions in ${language} from database...`);
    
    // Get all active questions that have the requested language
    const questionsRef = collection(firestore, 'generalKnowledgeQuestions');
    const activeQuestionsQuery = query(
      questionsRef, 
      where('isActive', '==', true),
      where('availableLanguages', 'array-contains', language)
    );
    const snapshot = await getDocs(activeQuestionsQuery);
    
    if (snapshot.empty) {
      console.warn(`⚠️ No questions found in database for language ${language}, falling back...`);
      return getHardcodedFallbackQuestions(count, language);
    }
    
    // Convert Firestore questions to TestQuestion format
    const allQuestions: TestQuestion[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as GeneralKnowledgeQuestion;
      
      // Get the translation for the requested language, fallback to default language
      const translation = data.translations[language] || data.translations[data.defaultLanguage];
      
      if (!translation) {
        console.warn(`⚠️ No translation found for question ${doc.id} in language ${language}`);
        return; // Skip this question
      }
      
      const testQuestion: TestQuestion = {
        id: doc.id,
        text_key: translation.question, // Use actual question text directly
        type: 'multiple_choice',
        options: [
          { value: 'a', text_key: translation.options.a },
          { value: 'b', text_key: translation.options.b },
          { value: 'c', text_key: translation.options.c },
          { value: 'd', text_key: translation.options.d }
        ]
      };

      allQuestions.push(testQuestion);
    });
    
    // Randomly select the requested number of questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, count);
    
    console.log(`✅ Successfully fetched ${selectedQuestions.length} random questions in ${language} from database`);
    return selectedQuestions;
    
  } catch (error) {
    console.error(`❌ Error fetching questions from database in ${language}:`, error);
    console.log('🔄 Falling back to hardcoded questions...');
    return getHardcodedFallbackQuestions(count, language);
  }
};

// Enhanced version that returns both questions and their correct answers
export const getRandomGeneralKnowledgeQuestionsWithAnswers = async (
  count: number = 10,
  language: string = 'en'
): Promise<{questions: TestQuestion[], correctAnswers: Array<{id: string, correctAnswer: string}>}> => {
  try {
    console.log(`🔍 Fetching ${count} random General Knowledge questions with answers in ${language} from database...`);

    // Get all active questions that have the requested language
    const questionsRef = collection(firestore, 'generalKnowledgeQuestions');
    const activeQuestionsQuery = query(
      questionsRef,
      where('isActive', '==', true),
      where('availableLanguages', 'array-contains', language)
    );
    const snapshot = await getDocs(activeQuestionsQuery);

    if (snapshot.empty) {
      console.warn(`⚠️ No questions found in database for language ${language}, falling back...`);
      const fallbackQuestions = getHardcodedFallbackQuestions(count, language);
      return {
        questions: fallbackQuestions,
        correctAnswers: [] // No correct answers available for fallback
      };
    }

    // Convert Firestore questions to TestQuestion format and collect correct answers
    const allQuestions: TestQuestion[] = [];
    const allCorrectAnswers: Array<{id: string, correctAnswer: string}> = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as GeneralKnowledgeQuestion;

      // Get the translation for the requested language, fallback to default language
      const translation = data.translations[language] || data.translations[data.defaultLanguage];

      if (!translation) {
        console.warn(`⚠️ No translation found for question ${doc.id} in language ${language}`);
        return; // Skip this question
      }

      const testQuestion: TestQuestion = {
        id: doc.id,
        text_key: translation.question, // Use actual question text directly
        type: 'multiple_choice',
        options: [
          { value: 'a', text_key: translation.options.a },
          { value: 'b', text_key: translation.options.b },
          { value: 'c', text_key: translation.options.c },
          { value: 'd', text_key: translation.options.d }
        ]
      };

      allQuestions.push(testQuestion);
      allCorrectAnswers.push({
        id: doc.id,
        correctAnswer: data.correctAnswer
      });
    });

    // Randomly select the requested number of questions (ensure same selection for both arrays)
    const shuffledIndices = [...Array(allQuestions.length).keys()].sort(() => 0.5 - Math.random());
    const selectedIndices = shuffledIndices.slice(0, count);

    const selectedQuestions = selectedIndices.map(i => allQuestions[i]);
    const selectedCorrectAnswers = selectedIndices.map(i => allCorrectAnswers[i]);

    console.log(`✅ Successfully fetched ${selectedQuestions.length} general knowledge questions with answers`);
    return {
      questions: selectedQuestions,
      correctAnswers: selectedCorrectAnswers
    };

  } catch (error) {
    console.error('❌ Error fetching general knowledge questions with answers:', error);
    const fallbackQuestions = getHardcodedFallbackQuestions(count, language);
    return {
      questions: fallbackQuestions,
      correctAnswers: [] // No correct answers available for fallback
    };
  }
};

// Fallback to hardcoded questions if database is unavailable
const getHardcodedFallbackQuestions = (count: number, language: string = 'en'): TestQuestion[] => {
  const fallbackQuestions: TestQuestion[] = [
    {
      id: 'gk_fallback_1',
      text_key: 'tests.general_knowledge.questions.q1',
      type: 'multiple_choice',
      options: [
        { value: 'jordan', text_key: 'tests.general_knowledge.options.q1_d' },
        { value: 'egypt', text_key: 'tests.general_knowledge.options.q1_a' },
        { value: 'china', text_key: 'tests.general_knowledge.options.q1_b' },
        { value: 'peru', text_key: 'tests.general_knowledge.options.q1_c' }
      ]
    },
    {
      id: 'gk_fallback_2',
      text_key: 'tests.general_knowledge.questions.q2',
      type: 'multiple_choice',
      options: [
        { value: 'venus', text_key: 'tests.general_knowledge.options.q2_b' },
        { value: 'mercury', text_key: 'tests.general_knowledge.options.q2_a' },
        { value: 'mars', text_key: 'tests.general_knowledge.options.q2_c' },
        { value: 'jupiter', text_key: 'tests.general_knowledge.options.q2_d' }
      ]
    }
  ];
  
  return fallbackQuestions.slice(0, count);
};

// Add a new General Knowledge question to the database
export const addGeneralKnowledgeQuestion = async (question: Omit<GeneralKnowledgeQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; message: string }> => {
  try {
    const questionsRef = collection(firestore, 'generalKnowledgeQuestions');
    const docRef = await addDoc(questionsRef, {
      ...question,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Added new General Knowledge question: ${docRef.id}`);
    return {
      success: true,
      id: docRef.id,
      message: 'Question added successfully'
    };
    
  } catch (error) {
    console.error('❌ Error adding question:', error);
    return {
      success: false,
      message: `Failed to add question: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Get question statistics
export const getGeneralKnowledgeStats = async (): Promise<{
  total: number;
  active: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
}> => {
  try {
    const questionsRef = collection(firestore, 'generalKnowledgeQuestions');
    const snapshot = await getDocs(questionsRef);
    
    let total = 0;
    let active = 0;
    const byCategory: Record<string, number> = {};
    const byDifficulty: Record<string, number> = {};
    
    snapshot.forEach((doc) => {
      const data = doc.data() as GeneralKnowledgeQuestion;
      total++;
      
      if (data.isActive) {
        active++;
      }
      
      byCategory[data.category] = (byCategory[data.category] || 0) + 1;
      byDifficulty[data.difficulty] = (byDifficulty[data.difficulty] || 0) + 1;
    });
    
    return { total, active, byCategory, byDifficulty };
    
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    return { total: 0, active: 0, byCategory: {}, byDifficulty: {} };
  }
};

// Add translation for an existing question
export const addQuestionTranslation = async (
  questionId: string, 
  language: string,
  translation: {
    question: string;
    options: { a: string; b: string; c: string; d: string };
    explanation?: string;
    tags?: string[];
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const questionRef = doc(firestore, 'generalKnowledgeQuestions', questionId);
    const questionDoc = await getDoc(questionRef);
    
    if (!questionDoc.exists()) {
      return { success: false, message: 'Question not found' };
    }
    
    const currentData = questionDoc.data() as GeneralKnowledgeQuestion;
    const updatedTranslations = {
      ...currentData.translations,
      [language]: translation
    };
    
    const updatedLanguages = [...new Set([...currentData.availableLanguages, language])];
    
    await setDoc(questionRef, {
      ...currentData,
      translations: updatedTranslations,
      availableLanguages: updatedLanguages,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Added ${language} translation for question ${questionId}`);
    return {
      success: true,
      message: `Translation added successfully for ${language}`
    };
    
  } catch (error) {
    console.error(`❌ Error adding translation for ${questionId}:`, error);
    return {
      success: false,
      message: `Failed to add translation: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Get questions that need translation for a specific language
export const getQuestionsNeedingTranslation = async (language: string): Promise<{
  questions: Array<GeneralKnowledgeQuestion & { id: string }>;
  total: number;
}> => {
  try {
    const questionsRef = collection(firestore, 'generalKnowledgeQuestions');
    const snapshot = await getDocs(query(
      questionsRef,
      where('isActive', '==', true)
    ));
    
    const needsTranslation: Array<GeneralKnowledgeQuestion & { id: string }> = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as GeneralKnowledgeQuestion;
      if (!data.availableLanguages.includes(language)) {
        needsTranslation.push({ ...data, id: doc.id });
      }
    });
    
    return {
      questions: needsTranslation,
      total: needsTranslation.length
    };
    
  } catch (error) {
    console.error(`❌ Error getting questions needing translation:`, error);
    return { questions: [], total: 0 };
  }
};

// Batch upload multilingual questions
export const batchUploadMultilingualQuestions = async (questions: Omit<GeneralKnowledgeQuestion, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ success: boolean; added: number; errors: number; message: string }> => {
  try {
    let added = 0;
    let errors = 0;
    const questionsRef = collection(firestore, 'generalKnowledgeQuestions');
    
    for (const question of questions) {
      try {
        await addDoc(questionsRef, {
          ...question,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        added++;
        console.log(`✅ Added multilingual question ${added}/${questions.length}`);
      } catch (error) {
        errors++;
        console.error(`❌ Error adding question ${added + errors}:`, error);
      }
    }
    
    return {
      success: added > 0,
      added,
      errors,
      message: `Successfully added ${added} multilingual questions. ${errors} errors.`
    };
    
  } catch (error) {
    console.error('❌ Batch upload error:', error);
    return {
      success: false,
      added: 0,
      errors: questions.length,
      message: `Batch upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Legacy function for backward compatibility
export const batchUploadGeneralKnowledgeQuestions = batchUploadMultilingualQuestions;

// ============================================
// MATH SPEED TEST DATABASE FUNCTIONS
// ============================================

export interface MathSpeedQuestion {
  id?: string;
  category: 'arithmetic' | 'word_problem' | 'sequence' | 'geometry' | 'algebra';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // seconds for this question
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  defaultLanguage: string;
  availableLanguages: string[];
  translations: {
    [language: string]: {
      question: string;
      options: { a: string; b: string; c: string; d: string };
      explanation?: string;
      tags?: string[];
    };
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Fetch random Math Speed questions from database
export const getRandomMathSpeedQuestions = async (
  count: number = 10,
  language: string = 'en',
  difficulty?: "easy" | "medium" | "hard"
): Promise<TestQuestion[]> => {
  try {
    console.log(`🔍 Fetching ${count} random Math Speed questions in ${language} from database...`);

    const questionsRef = collection(firestore, 'mathSpeedQuestions');
    let q = query(
      questionsRef,
      where('isActive', '==', true),
      where('availableLanguages', 'array-contains', language)
    );

    if (difficulty) {
      q = query(q, where('difficulty', '==', difficulty));
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`⚠️ No math speed questions found in database for language ${language}, falling back...`);
      return [];
    }

    const allQuestions: TestQuestion[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as MathSpeedQuestion;
      const translation = data.translations[language] || data.translations[data.defaultLanguage];

      if (!translation) {
        console.warn(`⚠️ No translation found for math question ${doc.id} in language ${language}`);
        return;
      }

      const testQuestion: TestQuestion = {
        id: doc.id,
        text_key: translation.question, // Use actual question text directly
        type: 'multiple_choice',
        options: [
          { value: 'a', text_key: translation.options.a },
          { value: 'b', text_key: translation.options.b },
          { value: 'c', text_key: translation.options.c },
          { value: 'd', text_key: translation.options.d }
        ]
      };

      allQuestions.push(testQuestion);
    });

    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    console.log(`✅ Successfully fetched ${selected.length} math speed questions`);
    return selected;

  } catch (error) {
    console.error('❌ Error fetching math speed questions:', error);
    return [];
  }
};

// Add new Math Speed question to database
export const addMathSpeedQuestion = async (questionData: Omit<MathSpeedQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
  try {
    const questionsRef = collection(firestore, 'mathSpeedQuestions');
    const docRef = await addDoc(questionsRef, {
      ...questionData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding math speed question:', error);
    return null;
  }
};

// ============================================
// MEMORY POWER TEST DATABASE FUNCTIONS  
// ============================================

export interface MemoryPowerQuestion {
  id?: string;
  category: "word_sequence" | "number_sequence" | "image_sequence" | "pattern_sequence";
  difficulty: "easy" | "medium" | "hard";
  memorizationTime: number; // seconds to memorize
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  defaultLanguage: string;
  availableLanguages: string[];
  translations: {
    [language: string]: {
      memorizationContent: string[]; // Items to memorize (words, numbers, etc.)
      question: string; // "Which item was missing?" or "What was the 3rd item?"
      options: { a: string; b: string; c: string; d: string };
      explanation?: string;
      tags?: string[];
    };
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Fetch random Memory Power questions from database
export const getRandomMemoryPowerQuestions = async (
  count: number = 10,
  language: string = 'en',
  difficulty?: "easy" | "medium" | "hard"
): Promise<TestQuestion[]> => {
  try {
    console.log(`📊 Fetching ${count} memory power questions for language: ${language}`);

    const questionsRef = collection(firestore, 'memoryPowerQuestions');
    let q = query(
      questionsRef,
      where('isActive', '==', true),
      where('availableLanguages', 'array-contains', language)
    );

    if (difficulty) {
      q = query(q, where('difficulty', '==', difficulty));
    }

    const snapshot = await getDocs(q);
    console.log(`📊 Found ${snapshot.docs.length} memory power questions in database`);

    const allQuestions: TestQuestion[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as MemoryPowerQuestion;
      const translation = data.translations[language] || data.translations[data.defaultLanguage];

      if (!translation) {
        console.warn(`⚠️ No translation found for memory power question ${doc.id} in language ${language}`);
        return;
      }

      const testQuestion: TestQuestion = {
        id: doc.id,
        text_key: translation.question, // Use actual question text directly
        type: 'multiple_choice',
        options: [
          { value: 'a', text_key: translation.options.a },
          { value: 'b', text_key: translation.options.b },
          { value: 'c', text_key: translation.options.c },
          { value: 'd', text_key: translation.options.d }
        ],
        memoryPhase: {
          text_key: translation.memorizationContent.join(', '), // Use actual memorization content
          duration: data.memorizationTime * 1000 // Convert seconds to milliseconds
        }
      };

      allQuestions.push(testQuestion);
    });

    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    console.log(`✅ Successfully fetched ${selected.length} memory power questions`);
    return selected;

  } catch (error) {
    console.error('❌ Error fetching memory power questions:', error);
    return [];
  }
};

// Add new Memory Power question to database
export const addMemoryPowerQuestion = async (questionData: Omit<MemoryPowerQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
  try {
    const questionsRef = collection(firestore, 'memoryPowerQuestions');
    const docRef = await addDoc(questionsRef, {
      ...questionData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding memory power question:', error);
    return null;
  }
};

// Batch upload Math Speed questions
export const batchUploadMathSpeedQuestions = async (questions: Omit<MathSpeedQuestion, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{success: boolean, added: number, errors: number, message: string}> => {
  try {
    let added = 0;
    let errors = 0;

    for (const question of questions) {
      console.log(`📊 Adding math question ${added + 1}: ${question.translations.en?.question || question.category}`);
      const questionId = await addMathSpeedQuestion(question);

      if (questionId) {
        added++;
        console.log(`✅ Added math question ${added}`);
      } else {
        errors++;
        console.log(`❌ Error adding math question`);
      }
    }

    return {
      success: added > 0,
      added,
      errors,
      message: `Successfully added ${added} math speed questions. ${errors} errors.`
    };
  } catch (error) {
    console.error('❌ Batch upload math questions error:', error);
    return {
      success: false,
      added: 0,
      errors: questions.length,
      message: `Batch upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Math Speed Questions Stats
export const getMathSpeedQuestionStats = async (): Promise<{
  total: number;
  active: number;
  byCategory: { [category: string]: number };
  byDifficulty: { [difficulty: string]: number };
}> => {
  try {
    const questionsRef = collection(firestore, 'mathSpeedQuestions');
    const snapshot = await getDocs(questionsRef);

    let total = 0;
    let active = 0;
    const byCategory: { [category: string]: number } = {};
    const byDifficulty: { [difficulty: string]: number } = {};

    snapshot.forEach((doc) => {
      const data = doc.data() as MathSpeedQuestion;
      total++;

      if (data.isActive) {
        active++;
      }

      byCategory[data.category] = (byCategory[data.category] || 0) + 1;
      byDifficulty[data.difficulty] = (byDifficulty[data.difficulty] || 0) + 1;
    });

    return { total, active, byCategory, byDifficulty };
  } catch (error) {
    console.error('❌ Error getting math speed question stats:', error);
    return { total: 0, active: 0, byCategory: {}, byDifficulty: {} };
  }
};

// Get all Math Speed questions with pagination
export const getAllMathSpeedQuestions = async (
  limitCount: number = 50,
  lastDoc?: any,
  category?: string,
  difficulty?: string
): Promise<{ questions: (MathSpeedQuestion & { id: string })[]; lastDoc: any }> => {
  try {
    const questionsRef = collection(firestore, 'mathSpeedQuestions');
    let q = query(questionsRef, orderBy('createdAt', 'desc'), limit(limitCount));

    if (category) {
      q = query(questionsRef, where('category', '==', category), orderBy('createdAt', 'desc'), limit(limitCount));
    }
    if (difficulty) {
      q = query(questionsRef, where('difficulty', '==', difficulty), orderBy('createdAt', 'desc'), limit(limitCount));
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const questions: (MathSpeedQuestion & { id: string })[] = [];

    snapshot.forEach((doc) => {
      questions.push({
        ...doc.data() as MathSpeedQuestion,
        id: doc.id
      });
    });

    const lastDocument = snapshot.docs[snapshot.docs.length - 1];

    return { questions, lastDoc: lastDocument };
  } catch (error) {
    console.error('❌ Error getting math speed questions:', error);
    return { questions: [], lastDoc: null };
  }
};

// Update a Math Speed question
export const updateMathSpeedQuestion = async (
  questionId: string,
  updates: Partial<Omit<MathSpeedQuestion, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; message: string }> => {
  try {
    const questionRef = doc(firestore, 'mathSpeedQuestions', questionId);

    await setDoc(questionRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log(`✅ Updated math speed question ${questionId}`);
    return {
      success: true,
      message: 'Math Speed question updated successfully'
    };
  } catch (error) {
    console.error(`❌ Error updating math speed question ${questionId}:`, error);
    return {
      success: false,
      message: `Failed to update question: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Delete a Math Speed question
export const deleteMathSpeedQuestion = async (
  questionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const questionRef = doc(firestore, 'mathSpeedQuestions', questionId);
    await deleteDoc(questionRef);

    console.log(`✅ Deleted math speed question ${questionId}`);
    return {
      success: true,
      message: 'Math Speed question deleted successfully'
    };
  } catch (error) {
    console.error(`❌ Error deleting math speed question ${questionId}:`, error);
    return {
      success: false,
      message: `Failed to delete question: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Bulk delete Math Speed questions
export const bulkDeleteMathSpeedQuestions = async (
  questionIds: string[]
): Promise<{ success: boolean; deleted: number; errors: number; message: string }> => {
  try {
    let deleted = 0;
    let errors = 0;

    for (const questionId of questionIds) {
      const result = await deleteMathSpeedQuestion(questionId);
      if (result.success) {
        deleted++;
      } else {
        errors++;
      }
    }

    return {
      success: deleted > 0,
      deleted,
      errors,
      message: `Deleted ${deleted} math speed questions. ${errors} errors.`
    };
  } catch (error) {
    console.error('❌ Error in bulk delete math speed questions:', error);
    return {
      success: false,
      deleted: 0,
      errors: questionIds.length,
      message: `Bulk delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// ============================================
// MEMORY POWER TEST DATABASE FUNCTIONS
// ============================================

// Batch upload Memory Power questions
export const batchUploadMemoryPowerQuestions = async (questions: Omit<MemoryPowerQuestion, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{success: boolean, added: number, errors: number, message: string}> => {
  try {
    let added = 0;
    let errors = 0;

    for (const question of questions) {
      console.log(`🧠 Adding memory question ${added + 1}: ${question.translations.en?.question || question.category}`);
      const questionId = await addMemoryPowerQuestion(question);

      if (questionId) {
        added++;
        console.log(`✅ Added memory question ${added}`);
      } else {
        errors++;
        console.log(`❌ Error adding memory question`);
      }
    }

    return {
      success: added > 0,
      added,
      errors,
      message: `Successfully added ${added} memory power questions. ${errors} errors.`
    };
  } catch (error) {
    console.error('❌ Batch upload memory questions error:', error);
    return {
      success: false,
      added: 0,
      errors: questions.length,
      message: `Batch upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Memory Power Questions Stats
export const getMemoryPowerQuestionStats = async (): Promise<{
  total: number;
  active: number;
  byCategory: { [category: string]: number };
  byDifficulty: { [difficulty: string]: number };
}> => {
  try {
    const questionsRef = collection(firestore, 'memoryPowerQuestions');
    const snapshot = await getDocs(questionsRef);

    let total = 0;
    let active = 0;
    const byCategory: { [category: string]: number } = {};
    const byDifficulty: { [difficulty: string]: number } = {};

    snapshot.forEach((doc) => {
      const data = doc.data() as MemoryPowerQuestion;
      total++;

      if (data.isActive) {
        active++;
      }

      byCategory[data.category] = (byCategory[data.category] || 0) + 1;
      byDifficulty[data.difficulty] = (byDifficulty[data.difficulty] || 0) + 1;
    });

    return { total, active, byCategory, byDifficulty };
  } catch (error) {
    console.error('❌ Error getting memory power question stats:', error);
    return { total: 0, active: 0, byCategory: {}, byDifficulty: {} };
  }
};

// Get all Memory Power questions with pagination
export const getAllMemoryPowerQuestions = async (
  limitCount: number = 50,
  lastDoc?: any,
  category?: string,
  difficulty?: string
): Promise<{ questions: (MemoryPowerQuestion & { id: string })[]; lastDoc: any }> => {
  try {
    const questionsRef = collection(firestore, 'memoryPowerQuestions');
    let q = query(questionsRef, orderBy('createdAt', 'desc'), limit(limitCount));

    if (category) {
      q = query(questionsRef, where('category', '==', category), orderBy('createdAt', 'desc'), limit(limitCount));
    }
    if (difficulty) {
      q = query(questionsRef, where('difficulty', '==', difficulty), orderBy('createdAt', 'desc'), limit(limitCount));
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const questions: (MemoryPowerQuestion & { id: string })[] = [];

    snapshot.forEach((doc) => {
      questions.push({
        ...doc.data() as MemoryPowerQuestion,
        id: doc.id
      });
    });

    const lastDocument = snapshot.docs[snapshot.docs.length - 1];

    return { questions, lastDoc: lastDocument };
  } catch (error) {
    console.error('❌ Error getting memory power questions:', error);
    return { questions: [], lastDoc: null };
  }
};

// Update a Memory Power question
export const updateMemoryPowerQuestion = async (
  questionId: string,
  updates: Partial<Omit<MemoryPowerQuestion, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; message: string }> => {
  try {
    const questionRef = doc(firestore, 'memoryPowerQuestions', questionId);

    await setDoc(questionRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log(`✅ Updated memory power question ${questionId}`);
    return {
      success: true,
      message: 'Memory Power question updated successfully'
    };
  } catch (error) {
    console.error(`❌ Error updating memory power question ${questionId}:`, error);
    return {
      success: false,
      message: `Failed to update question: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Delete a Memory Power question
export const deleteMemoryPowerQuestion = async (
  questionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const questionRef = doc(firestore, 'memoryPowerQuestions', questionId);
    await deleteDoc(questionRef);

    console.log(`✅ Deleted memory power question ${questionId}`);
    return {
      success: true,
      message: 'Memory Power question deleted successfully'
    };
  } catch (error) {
    console.error(`❌ Error deleting memory power question ${questionId}:`, error);
    return {
      success: false,
      message: `Failed to delete question: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Bulk delete Memory Power questions
export const bulkDeleteMemoryPowerQuestions = async (
  questionIds: string[]
): Promise<{ success: boolean; deleted: number; errors: number; message: string }> => {
  try {
    let deleted = 0;
    let errors = 0;

    for (const questionId of questionIds) {
      const result = await deleteMemoryPowerQuestion(questionId);
      if (result.success) {
        deleted++;
      } else {
        errors++;
      }
    }

    return {
      success: deleted > 0,
      deleted,
      errors,
      message: `Deleted ${deleted} memory power questions. ${errors} errors.`
    };
  } catch (error) {
    console.error('❌ Error in bulk delete memory power questions:', error);
    return {
      success: false,
      deleted: 0,
      errors: questionIds.length,
      message: `Bulk delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Get all general knowledge questions with pagination for admin management
export const getAllGeneralKnowledgeQuestions = async (
  limitCount: number = 50,
  lastDoc?: any,
  category?: string,
  difficulty?: string
): Promise<{ questions: (GeneralKnowledgeQuestion & { id: string })[]; lastDoc: any }> => {
  try {
    const questionsRef = collection(firestore, 'generalKnowledgeQuestions');
    let q = query(questionsRef, orderBy('createdAt', 'desc'), limit(limitCount));

    // Add filters if provided
    if (category) {
      q = query(questionsRef, where('category', '==', category), orderBy('createdAt', 'desc'), limit(limitCount));
    }
    if (difficulty) {
      q = query(questionsRef, where('difficulty', '==', difficulty), orderBy('createdAt', 'desc'), limit(limitCount));
    }

    // Add pagination if lastDoc is provided
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const questions: (GeneralKnowledgeQuestion & { id: string })[] = [];

    snapshot.forEach((doc) => {
      questions.push({
        ...doc.data() as GeneralKnowledgeQuestion,
        id: doc.id
      });
    });

    const lastDocument = snapshot.docs[snapshot.docs.length - 1];

    return { questions, lastDoc: lastDocument };
  } catch (error) {
    console.error('❌ Error getting general knowledge questions:', error);
    return { questions: [], lastDoc: null };
  }
};

// Update a general knowledge question
export const updateGeneralKnowledgeQuestion = async (
  questionId: string,
  updates: Partial<Omit<GeneralKnowledgeQuestion, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; message: string }> => {
  try {
    const questionRef = doc(firestore, 'generalKnowledgeQuestions', questionId);

    await setDoc(questionRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log(`✅ Updated question ${questionId}`);
    return {
      success: true,
      message: 'Question updated successfully'
    };
  } catch (error) {
    console.error(`❌ Error updating question ${questionId}:`, error);
    return {
      success: false,
      message: `Failed to update question: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Delete a general knowledge question
export const deleteGeneralKnowledgeQuestion = async (
  questionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const questionRef = doc(firestore, 'generalKnowledgeQuestions', questionId);
    await deleteDoc(questionRef);

    console.log(`✅ Deleted question ${questionId}`);
    return {
      success: true,
      message: 'Question deleted successfully'
    };
  } catch (error) {
    console.error(`❌ Error deleting question ${questionId}:`, error);
    return {
      success: false,
      message: `Failed to delete question: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Bulk delete questions
export const bulkDeleteGeneralKnowledgeQuestions = async (
  questionIds: string[]
): Promise<{ success: boolean; deleted: number; errors: number; message: string }> => {
  try {
    let deleted = 0;
    let errors = 0;

    for (const questionId of questionIds) {
      const result = await deleteGeneralKnowledgeQuestion(questionId);
      if (result.success) {
        deleted++;
      } else {
        errors++;
      }
    }

    return {
      success: deleted > 0,
      deleted,
      errors,
      message: `Deleted ${deleted} questions. ${errors} errors.`
    };
  } catch (error) {
    console.error('❌ Error in bulk delete:', error);
    return {
      success: false,
      deleted: 0,
      errors: questionIds.length,
      message: `Bulk delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

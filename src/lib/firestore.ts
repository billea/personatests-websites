import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { firestore } from "./firebase";
import { User } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions";

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
      
      const fullUrl = `${baseUrl}/${language}/feedback/${invitation.id}?${params.toString()}`;
      
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
          // Use same simple parameter structure as couple compatibility
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
          message: language === 'ko' ?
            `${userName}님이 360도 피드백 평가에 참여해 달라고 요청했습니다. 리더십, 소통, 팀워크, 감정 지능 등을 평가해 주세요. 귀하의 응답은 완전히 익명으로 처리되며, ${userName}님의 성장에 도움이 됩니다.` :
            `${userName} has requested your participation in a 360° feedback assessment. You'll evaluate areas like leadership, communication, teamwork, and emotional intelligence. Your responses are completely anonymous and will help ${userName} grow professionally.`,
          time_estimate: language === 'ko' ? '소요 시간: 5-10분' : 'Time Required: 5-10 minutes',
          additional_info: language === 'ko' ?
            '개인정보 보호: 귀하의 개별 답변은 비공개로 유지되며 결합된 피드백 결과만 공유됩니다.' :
            'Privacy: Your individual answers remain private - only the combined feedback results are shared.'
        };

        console.log(`Sending 360 feedback invitation email to: ${link.email}`);
        console.log('Email parameters:', emailParams);
        
        // Use the same service and working template as couple compatibility
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
        const templateId = 'template_m5atn39'; // Use same working template as couple compatibility
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

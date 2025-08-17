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
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
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
    console.error("Error saving test result:", error);
    throw error;
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
  } catch (error) {
    console.error("Error getting user test results:", error);
    throw error;
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
export const sendFeedbackInvitations = async (
  userId: string,
  testId: string,
  testResultId: string,
  participantEmails: string[],
  userName: string,
  feedbackCategory: 'work' | 'friends' | 'family' | 'academic' | 'general',
  language: string = 'en'
): Promise<FeedbackInvitationResponse> => {
  try {
    // Debug: Log all parameters received
    console.log('sendFeedbackInvitations called with:', {
      userId,
      testId,
      testResultId,
      participantEmails,
      userName,
      feedbackCategory,
      language
    });
    
    // Generate unique invitation tokens for each participant
    const invitations = participantEmails.map(email => ({
      id: `invite_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      email,
      testId,
      testResultId,
      userName,
      invitationToken: generateInvitationToken(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    }));

    // Store invitations in Firestore for authenticated users
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
    
    const savedInvitations = await Promise.all(invitationPromises);
    
    // Create or update feedback progress tracking
    await updateFeedbackProgress(userId, testResultId, testId, participantEmails.length, savedInvitations.map(inv => inv.id), feedbackCategory);

    // Create shareable feedback links for each participant
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://korean-mbti-platform.netlify.app';
    
    // Debug: Log the language being used
    console.log('Creating feedback links with language:', language);
    
    const feedbackLinks = invitations.map(invitation => ({
      email: invitation.email,
      link: `${baseUrl}/${language}/feedback/${invitation.id}?token=${invitation.invitationToken}&name=${encodeURIComponent(userName)}&testId=${testId}&testResultId=${testResultId}&email=${encodeURIComponent(invitation.email)}`
    }));

    // For development purposes, log the invitation links
    console.log('Feedback invitation links generated:');
    feedbackLinks.forEach(link => {
      console.log(`${link.email}: ${link.link}`);
    });

    // In a real implementation, you would integrate with an email service here
    // For now, we'll show the links to the user for manual sharing
    
    return {
      success: true,
      invitationsSent: invitations.length,
      invitations: feedbackLinks,
      message: 'Feedback links generated successfully. You can share these links with your reviewers.'
    };
  } catch (error) {
    console.error("Error generating feedback invitations:", error);
    throw error;
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
  } catch (error) {
    console.error("Error getting pending invitations:", error);
    throw error;
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
    
    // Prepare email parameters for notification
    const emailParams = {
      to_email: ownerEmail,
      to_name: ownerName,
      from_name: 'Korean MBTI Platform',
      subject: language === 'ko' ? 
        `새로운 360° 피드백이 도착했습니다!` : 
        `New 360° Feedback Received!`,
      message: language === 'ko' ? 
        `안녕하세요 ${ownerName}님,\n\n360° 피드백 평가에 새로운 응답이 제출되었습니다.\n\n결과를 확인하려면 플랫폼에 로그인하세요:\nhttps://korean-mbti-platform.netlify.app/${language}/results\n\n감사합니다!\nKorean MBTI Platform` :
        `Hello ${ownerName},\n\nA new response has been submitted for your 360° Feedback Assessment.\n\nLog in to your platform to view the results:\nhttps://korean-mbti-platform.netlify.app/${language}/results\n\nThank you!\nKorean MBTI Platform`,
      reviewer_anonymous: language === 'ko' ? 
        '새로운 익명 피드백' : 
        'New anonymous feedback'
    };
    
    console.log('=== FEEDBACK NOTIFICATION DEBUG ===');
    console.log('Notification email parameters:', {
      to_email: emailParams.to_email,
      to_name: emailParams.to_name,
      subject: emailParams.subject,
      language: language
    });
    console.log('=== END NOTIFICATION DEBUG ===');
    
    // Send notification email
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '', // We might need a separate template for notifications
      emailParams
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

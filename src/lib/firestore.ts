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
}

export interface FeedbackSubmission {
  invitationId: string;
  feedbackPayload: any;
  submittedAt: Timestamp;
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
 * Sends feedback invitations via client-side solution for static deployment
 * @param testId - The ID of the test
 * @param testResultId - The ID of the saved test result
 * @param participantEmails - Array of email addresses to invite
 * @param userName - The user's name to personalize questions
 * @returns Success status and invitation details
 */
export const sendFeedbackInvitations = async (
  testId: string,
  testResultId: string,
  participantEmails: string[],
  userName: string,
  language: string = 'en'
): Promise<FeedbackInvitationResponse> => {
  try {
    // Debug: Log all parameters received
    console.log('sendFeedbackInvitations called with:', {
      testId,
      testResultId,
      participantEmails,
      userName,
      language
    });
    
    // For static deployment, we'll use a client-side approach
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

    // Store invitations in localStorage for static deployment
    const existingInvitations = JSON.parse(localStorage.getItem('feedback_invitations') || '[]');
    const updatedInvitations = [...existingInvitations, ...invitations];
    localStorage.setItem('feedback_invitations', JSON.stringify(updatedInvitations));

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

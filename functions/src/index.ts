import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

/**
 * Sends feedback invitations via EmailJS for 360-degree feedback tests
 * Triggered when a user completes a test that requires external feedback
 */
export const sendFeedbackInvitations = functions.https.onCall(async (request) => {
  const { data, auth } = request;
  
  if (!auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { testId, testResultId, participantEmails } = data;

  if (!testId || !testResultId || !participantEmails || !Array.isArray(participantEmails)) {
    throw new functions.https.HttpsError(
      'invalid-argument', 
      'Missing required parameters: testId, testResultId, or participantEmails'
    );
  }

  try {
    // Get user info
    const userRecord = await admin.auth().getUser(auth.uid);
    const inviterName = userRecord.displayName || userRecord.email || 'Someone';

    // Create invitations in Firestore
    const invitations = [];
    for (const email of participantEmails) {
      const invitationData = {
        inviterUid: auth.uid,
        inviterName,
        testId,
        testResultId,
        participantEmail: email,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        invitationToken: generateInvitationToken()
      };

      const docRef = await db.collection('invitations').add(invitationData);
      invitations.push({ id: docRef.id, ...invitationData });
    }

    // Send emails via EmailJS REST API
    const emailPromises = invitations.map(invitation => 
      sendFeedbackEmail(invitation, testId)
    );

    await Promise.all(emailPromises);

    return {
      success: true,
      invitationsSent: invitations.length,
      invitations: invitations.map(inv => ({ id: inv.id, email: inv.participantEmail }))
    };

  } catch (error) {
    console.error('Error sending feedback invitations:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send feedback invitations',
      error
    );
  }
});

/**
 * Processes feedback submissions from external participants
 * Creates anonymous feedback records and updates invitation status
 */
export const processFeedback = functions.https.onCall(async (request) => {
  const { data } = request;
  const { invitationId, feedbackPayload, invitationToken } = data;

  if (!invitationId || !feedbackPayload || !invitationToken) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required parameters: invitationId, feedbackPayload, or invitationToken'
    );
  }

  try {
    // Verify invitation exists and token matches
    const invitationDoc = await db.collection('invitations').doc(invitationId).get();
    
    if (!invitationDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Invitation not found');
    }

    const invitationData = invitationDoc.data()!;

    if (invitationData.invitationToken !== invitationToken) {
      throw new functions.https.HttpsError('permission-denied', 'Invalid invitation token');
    }

    if (invitationData.status === 'completed') {
      throw new functions.https.HttpsError('already-exists', 'Feedback already submitted');
    }

    // Create anonymous feedback record
    const feedbackData = {
      invitationId,
      feedbackPayload,
      submittedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('anonymousFeedback').add(feedbackData);

    // Update invitation status
    await db.collection('invitations').doc(invitationId).update({
      status: 'completed',
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Notify the test taker that feedback was received
    await sendFeedbackReceivedNotification(invitationData.inviterUid, invitationData.testId);

    return {
      success: true,
      message: 'Feedback submitted successfully'
    };

  } catch (error) {
    console.error('Error processing feedback:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to process feedback',
      error
    );
  }
});

/**
 * Generates compatibility reports for couple tests
 * Compares two test results and creates a compatibility analysis
 */
export const generateCompatibilityReport = functions.https.onCall(async (request) => {
  const { data, auth } = request;
  
  if (!auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { result1Id, result2Id } = data;

  if (!result1Id || !result2Id) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required parameters: result1Id, result2Id'
    );
  }

  try {
    // Get both test results
    const [result1Doc, result2Doc] = await Promise.all([
      db.collection('testResults').doc(result1Id).get(),
      db.collection('testResults').doc(result2Id).get()
    ]);

    if (!result1Doc.exists || !result2Doc.exists) {
      throw new functions.https.HttpsError('not-found', 'One or both test results not found');
    }

    const result1 = result1Doc.data()!;
    const result2 = result2Doc.data()!;

    // Ensure user has access to at least one result
    if (result1.userId !== auth.uid && result2.userId !== auth.uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Access denied to test results'
      );
    }

    // Generate compatibility analysis based on test type
    const compatibilityAnalysis = generateCompatibilityAnalysis(result1, result2);

    // Save the compatibility report
    const reportData = {
      result1_id: result1Id,
      result2_id: result2Id,
      reportPayload: compatibilityAnalysis,
      generatedBy: auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const reportRef = await db.collection('compatibilityReports').add(reportData);

    return {
      success: true,
      reportId: reportRef.id,
      compatibility: compatibilityAnalysis
    };

  } catch (error) {
    console.error('Error generating compatibility report:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate compatibility report',
      error
    );
  }
});

// Helper Functions

function generateInvitationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

async function sendFeedbackEmail(invitation: any, testId: string) {
  const emailjsServiceId = functions.config().emailjs?.service_id;
  const emailjsTemplateId = functions.config().emailjs?.feedback_template_id;
  const emailjsUserId = functions.config().emailjs?.user_id;
  const emailjsPrivateKey = functions.config().emailjs?.private_key;

  if (!emailjsServiceId || !emailjsTemplateId || !emailjsUserId || !emailjsPrivateKey) {
    console.error('EmailJS configuration missing');
    throw new Error('Email service not configured');
  }

  const feedbackUrl = `${functions.config().app?.base_url || 'https://localhost:3000'}/feedback/${invitation.id}?token=${invitation.invitationToken}`;

  const recipientName = invitation.participantEmail.split('@')[0];
  
  const emailData = {
    service_id: emailjsServiceId,
    template_id: emailjsTemplateId,
    user_id: emailjsUserId,
    accessToken: emailjsPrivateKey,
    template_params: {
      // Standard EmailJS parameters
      to_email: invitation.participantEmail,
      email: invitation.participantEmail,
      recipient_email: invitation.participantEmail,
      to_name: recipientName,
      name: recipientName,
      recipient_name: recipientName,
      from_name: invitation.inviterName,
      sender_name: invitation.inviterName,
      invitation_link: feedbackUrl,
      link: feedbackUrl,
      
      // 360 Feedback specific parameters
      test_title: '🎯 360° Feedback Assessment',
      emoji_icon: '🎯',
      header_title: '360° Feedback Assessment', 
      header_subtitle: 'Help Provide Multi-Perspective Personality Insights',
      greeting: `Hello ${recipientName}!`,
      invitation_message: `${invitation.inviterName} has requested your participation in a 360° feedback assessment.`,
      description: `This assessment helps ${invitation.inviterName} gain comprehensive insights into their personality and behavior. You'll evaluate areas like leadership, communication, teamwork, and emotional intelligence.`,
      
      // Benefits list
      benefits: [
        `🎯 Provide valuable insights into ${invitation.inviterName}'s personality`,
        '💬 Evaluate key areas like leadership, communication, and teamwork',
        '🔒 Complete anonymity - individual responses never shared',
        `🎁 Opportunity to contribute to ${invitation.inviterName}'s growth and development`
      ].join('\n'),
      
      // Detailed description
      detailed_description: `${invitation.inviterName} has requested your participation in a 360° feedback assessment. You'll evaluate areas like leadership, communication, teamwork, and emotional intelligence. Your responses are completely anonymous and will help ${invitation.inviterName} grow professionally.`,
      
      // Call to action
      cta_text: 'Provide Feedback',
      time_estimate: 'Time Required: 5-10 minutes',
      privacy_note: 'Privacy: Your individual answers remain private - only the combined feedback results are shared.',
      
      // Footer
      footer_message: `Please answer questions about ${invitation.inviterName} from your perspective as their contact.`,
      category_context: `Please answer questions about ${invitation.inviterName} from your perspective as their contact.`
    }
  };

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    throw new Error(`EmailJS API error: ${response.statusText}`);
  }
}

async function sendFeedbackReceivedNotification(userId: string, testId: string) {
  // Get user email
  const userRecord = await admin.auth().getUser(userId);
  if (!userRecord.email) return;

  const emailjsServiceId = functions.config().emailjs?.service_id;
  const emailjsNotificationTemplateId = functions.config().emailjs?.notification_template_id;
  const emailjsUserId = functions.config().emailjs?.user_id;
  const emailjsPrivateKey = functions.config().emailjs?.private_key;

  if (!emailjsServiceId || !emailjsNotificationTemplateId || !emailjsUserId || !emailjsPrivateKey) {
    console.log('EmailJS notification configuration missing');
    return;
  }

  const emailData = {
    service_id: emailjsServiceId,
    template_id: emailjsNotificationTemplateId,
    user_id: emailjsUserId,
    accessToken: emailjsPrivateKey,
    template_params: {
      to_email: userRecord.email,
      user_name: userRecord.displayName || 'User',
      test_name: getTestName(testId),
      results_url: `${functions.config().app?.base_url || 'https://localhost:3000'}/results`
    }
  };

  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });
  } catch (error) {
    console.error('Failed to send notification email:', error);
  }
}

function getTestName(testId: string): string {
  const testNames: { [key: string]: string } = {
    '360-feedback': '360° Feedback Assessment',
    'peer-review': 'Peer Review Assessment',
    'relationship-strengths': 'Relationship Strengths & Weaknesses',
    'communication-patterns': 'Communication Patterns Analysis',
    'shared-values': 'Shared Values & Goals Assessment'
  };
  
  return testNames[testId] || 'Personality Assessment';
}

function generateCompatibilityAnalysis(result1: any, result2: any) {
  // Basic compatibility algorithm - this would be expanded based on specific test types
  const payload1 = result1.resultPayload;
  const payload2 = result2.resultPayload;
  
  // Example compatibility metrics
  return {
    overallCompatibility: calculateOverallCompatibility(payload1, payload2),
    strengths: identifyRelationshipStrengths(payload1, payload2),
    challenges: identifyRelationshipChallenges(payload1, payload2),
    recommendations: generateRecommendations(payload1, payload2),
    generatedAt: new Date().toISOString()
  };
}

function calculateOverallCompatibility(payload1: any, payload2: any): number {
  // Simple algorithm - in reality this would be much more sophisticated
  // For now, return a random compatibility score between 60-95
  return Math.floor(Math.random() * 35) + 60;
}

function identifyRelationshipStrengths(payload1: any, payload2: any): string[] {
  return [
    'Strong communication foundation',
    'Shared core values',
    'Complementary personality traits',
    'Similar life goals'
  ];
}

function identifyRelationshipChallenges(payload1: any, payload2: any): string[] {
  return [
    'Different conflict resolution styles',
    'Varying social energy levels',
    'Different approaches to decision-making'
  ];
}

function generateRecommendations(payload1: any, payload2: any): string[] {
  return [
    'Focus on active listening during disagreements',
    'Establish regular check-ins about relationship goals',
    'Respect each other\'s different social needs',
    'Create shared experiences to strengthen your bond'
  ];
}
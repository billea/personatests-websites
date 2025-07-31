/**
 * Firebase Integration for Social Features
 * Ask My Friends & 360° Assessment
 * PersonaTests - January 2025
 */

// Firebase Social Features Database Service
class SocialFirebaseService {
    constructor() {
        this.isInitialized = false;
        this.db = null;
        this.auth = null;
        this.questionSetsRef = null;
        this.assessmentsRef = null;
        this.responsesRef = null;
        this.feedbackRef = null;
        
        // Initialize when Firebase is ready
        this.initializeWhenReady();
    }
    
    async initializeWhenReady() {
        console.log('🔄 SocialFirebaseService: Waiting for Firebase...');
        
        // Wait for Firebase to be available and initialized
        const maxAttempts = 50; // 5 seconds maximum wait
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
                try {
                    console.log('🔥 SocialFirebaseService: Firebase detected, initializing...');
                    
                    this.db = firebase.firestore();
                    this.auth = firebase.auth();
                    
                    // Initialize collections
                    this.questionSetsRef = this.db.collection('questionSets');
                    this.assessmentsRef = this.db.collection('assessments');
                    this.responsesRef = this.db.collection('responses');
                    this.feedbackRef = this.db.collection('feedback');
                    
                    this.isInitialized = true;
                    console.log('✅ SocialFirebaseService: Initialized successfully');
                    
                    // Test the connection
                    await this.testConnection();
                    return;
                    
                } catch (error) {
                    console.error('❌ SocialFirebaseService: Initialization error:', error);
                    // Continue trying
                }
            }
            
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.error('❌ SocialFirebaseService: Failed to initialize after', maxAttempts * 100, 'ms');
        throw new Error('Firebase initialization timeout');
    }
    
    async testConnection() {
        try {
            console.log('🧪 SocialFirebaseService: Testing connection...');
            // Try to access Firestore
            await this.db.collection('test').doc('connection').get();
            console.log('✅ SocialFirebaseService: Connection test passed');
        } catch (error) {
            console.warn('⚠️ SocialFirebaseService: Connection test failed:', error.message);
            // Don't throw here, as the user might be offline
        }
    }
    
    async ensureInitialized() {
        if (!this.isInitialized) {
            console.log('⏳ SocialFirebaseService: Waiting for initialization...');
            await this.initializeWhenReady();
        }
        
        if (!this.isInitialized) {
            throw new Error('SocialFirebaseService is not initialized');
        }
    }

    // ===== ASK MY FRIENDS FUNCTIONALITY =====

    /**
     * Create and save a new question set
     * @param {Object} questionSetData - The question set data
     * @returns {Promise<string>} - The generated question set ID
     */
    async createQuestionSet(questionSetData) {
        try {
            console.log('🔥 SocialFirebaseService: createQuestionSet called');
            console.log('📥 Input data:', JSON.stringify(questionSetData, null, 2));
            
            // Ensure service is initialized
            await this.ensureInitialized();
            console.log('✅ SocialFirebaseService: Initialization confirmed');
            
            const questionSet = {
                ...questionSetData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true,
                responseCount: 0,
                views: 0,
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            console.log('📦 Final question set data:', JSON.stringify(questionSet, null, 2));
            console.log('🔥 Adding to Firestore collection...');

            const docRef = await this.questionSetsRef.add(questionSet);
            console.log('✅ Question set created with ID:', docRef.id);
            
            // Verify the document was created
            const verifyDoc = await docRef.get();
            if (verifyDoc.exists) {
                console.log('✅ Document verified in Firestore');
                console.log('📄 Stored data:', verifyDoc.data());
            } else {
                console.warn('⚠️ Document creation verification failed');
            }
            
            return docRef.id;
        } catch (error) {
            console.error('❌ SocialFirebaseService: Error creating question set:', error);
            console.error('🔥 Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack,
                name: error.name
            });
            throw error;
        }
    }

    /**
     * Get a question set by ID
     * @param {string} questionSetId - The question set ID
     * @returns {Promise<Object>} - The question set data
     */
    async getQuestionSet(questionSetId) {
        try {
            const doc = await this.questionSetsRef.doc(questionSetId).get();
            if (doc.exists) {
                // Increment view count
                await this.questionSetsRef.doc(questionSetId).update({
                    views: firebase.firestore.FieldValue.increment(1),
                    lastActivity: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                return { id: doc.id, ...doc.data() };
            } else {
                throw new Error('Question set not found');
            }
        } catch (error) {
            console.error('Error getting question set:', error);
            throw error;
        }
    }

    /**
     * Save responses to a question set
     * @param {string} questionSetId - The question set ID
     * @param {Object} responseData - The response data
     * @returns {Promise<string>} - The response ID
     */
    async saveQuestionSetResponse(questionSetId, responseData) {
        try {
            const response = {
                questionSetId: questionSetId,
                ...responseData,
                submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
                ipHash: this.generateIPHash() // For spam prevention
            };

            const docRef = await this.responsesRef.add(response);
            
            // Update question set response count
            await this.questionSetsRef.doc(questionSetId).update({
                responseCount: firebase.firestore.FieldValue.increment(1),
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Response saved with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error saving response:', error);
            throw error;
        }
    }

    /**
     * Get all responses for a question set
     * @param {string} questionSetId - The question set ID
     * @returns {Promise<Array>} - Array of responses
     */
    async getQuestionSetResponses(questionSetId) {
        try {
            const snapshot = await this.responsesRef
                .where('questionSetId', '==', questionSetId)
                .orderBy('submittedAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting responses:', error);
            throw error;
        }
    }

    // ===== 360° ASSESSMENT FUNCTIONALITY =====

    /**
     * Create and save a new 360° assessment
     * @param {Object} assessmentData - The assessment data
     * @returns {Promise<string>} - The generated assessment ID
     */
    async createAssessment(assessmentData) {
        try {
            const assessment = {
                ...assessmentData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'collecting', // collecting, completed, expired
                feedbackCount: 0,
                lastActivity: firebase.firestore.FieldValue.serverTimestamp(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                isActive: true
            };

            const docRef = await this.assessmentsRef.add(assessment);
            console.log('360° Assessment created with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error creating assessment:', error);
            throw error;
        }
    }

    /**
     * Get a 360° assessment by ID
     * @param {string} assessmentId - The assessment ID
     * @returns {Promise<Object>} - The assessment data
     */
    async getAssessment(assessmentId) {
        try {
            const doc = await this.assessmentsRef.doc(assessmentId).get();
            if (doc.exists) {
                const data = doc.data();
                
                // Check if assessment has expired
                if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
                    throw new Error('This assessment has expired');
                }
                
                return { id: doc.id, ...data };
            } else {
                throw new Error('Assessment not found');
            }
        } catch (error) {
            console.error('Error getting assessment:', error);
            throw error;
        }
    }

    /**
     * Save feedback to a 360° assessment
     * @param {string} assessmentId - The assessment ID
     * @param {Object} feedbackData - The feedback data
     * @returns {Promise<string>} - The feedback ID
     */
    async saveAssessmentFeedback(assessmentId, feedbackData) {
        try {
            const feedback = {
                assessmentId: assessmentId,
                ...feedbackData,
                submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
                ipHash: this.generateIPHash() // For preventing duplicate submissions
            };

            const docRef = await this.feedbackRef.add(feedback);
            
            // Update assessment feedback count
            await this.assessmentsRef.doc(assessmentId).update({
                feedbackCount: firebase.firestore.FieldValue.increment(1),
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Feedback saved with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error saving feedback:', error);
            throw error;
        }
    }

    /**
     * Get all feedback for an assessment
     * @param {string} assessmentId - The assessment ID
     * @returns {Promise<Array>} - Array of feedback
     */
    async getAssessmentFeedback(assessmentId) {
        try {
            const snapshot = await this.feedbackRef
                .where('assessmentId', '==', assessmentId)
                .orderBy('submittedAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting feedback:', error);
            throw error;
        }
    }

    // ===== UTILITY FUNCTIONS =====

    /**
     * Generate a simple IP hash for spam prevention
     * @returns {string} - Hashed IP string
     */
    generateIPHash() {
        // Simple hash of timestamp + user agent for basic spam prevention
        const data = Date.now().toString() + navigator.userAgent;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Get user's question sets or assessments
     * @param {string} userEmail - User's email
     * @param {string} type - 'questionSets' or 'assessments'
     * @returns {Promise<Array>} - Array of user's items
     */
    async getUserItems(userEmail, type = 'questionSets') {
        try {
            const collection = type === 'questionSets' ? this.questionSetsRef : this.assessmentsRef;
            const snapshot = await collection
                .where('creatorEmail', '==', userEmail)
                .orderBy('createdAt', 'desc')
                .limit(50)
                .get();
            
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error getting user ${type}:`, error);
            throw error;
        }
    }

    /**
     * Update item status
     * @param {string} itemId - Item ID
     * @param {string} type - 'questionSets' or 'assessments'
     * @param {Object} updates - Updates to apply
     * @returns {Promise<void>}
     */
    async updateItem(itemId, type, updates) {
        try {
            const collection = type === 'questionSets' ? this.questionSetsRef : this.assessmentsRef;
            await collection.doc(itemId).update({
                ...updates,
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`${type} updated successfully`);
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
            throw error;
        }
    }

    /**
     * Delete item and associated data
     * @param {string} itemId - Item ID
     * @param {string} type - 'questionSets' or 'assessments'
     * @returns {Promise<void>}
     */
    async deleteItem(itemId, type) {
        try {
            const batch = this.db.batch();
            
            // Delete main item
            const collection = type === 'questionSets' ? this.questionSetsRef : this.assessmentsRef;
            batch.delete(collection.doc(itemId));
            
            // Delete associated responses/feedback
            const associatedCollection = type === 'questionSets' ? this.responsesRef : this.feedbackRef;
            const fieldName = type === 'questionSets' ? 'questionSetId' : 'assessmentId';
            
            const associatedSnapshot = await associatedCollection
                .where(fieldName, '==', itemId)
                .get();
            
            associatedSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            console.log(`${type} and associated data deleted successfully`);
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            throw error;
        }
    }

    /**
     * Check if user can access item (for privacy)
     * @param {string} itemId - Item ID
     * @param {string} userEmail - User's email
     * @param {string} type - 'questionSets' or 'assessments'
     * @returns {Promise<boolean>} - Whether user can access
     */
    async canUserAccess(itemId, userEmail, type) {
        try {
            const collection = type === 'questionSets' ? this.questionSetsRef : this.assessmentsRef;
            const doc = await collection.doc(itemId).get();
            
            if (!doc.exists) return false;
            
            const data = doc.data();
            // User can access if they created it or if it's active and public
            return data.creatorEmail === userEmail || (data.isActive && data.status !== 'private');
        } catch (error) {
            console.error('Error checking access:', error);
            return false;
        }
    }
}

// Initialize the service when DOM is ready
let socialFirebase = null;

// Function to initialize the service
function initializeSocialFirebase() {
    console.log('🚀 Initializing SocialFirebaseService...');
    try {
        socialFirebase = new SocialFirebaseService();
        console.log('✅ SocialFirebaseService instance created');
        
        // Make it globally available for debugging
        window.socialFirebase = socialFirebase;
        
        return socialFirebase;
    } catch (error) {
        console.error('❌ Failed to create SocialFirebaseService:', error);
        return null;
    }
}

// Simple initialization - just like other pages
console.log('🔄 SocialFirebase: Starting initialization...');

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSocialFirebase);
} else {
    // DOM is already loaded - initialize immediately
    console.log('📄 DOM already loaded, initializing now...');
    initializeSocialFirebase();
}

// Also initialize on window load as a fallback
window.addEventListener('load', () => {
    if (!socialFirebase) {
        console.log('🔄 Window load fallback: Initializing SocialFirebaseService');
        initializeSocialFirebase();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialFirebaseService;
}
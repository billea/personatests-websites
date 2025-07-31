/**
 * EmailJS Configuration for PersonaTests
 * Google Workspace Integration
 * January 2025
 */

// EmailJS Service Configuration
const EMAILJS_CONFIG = {
    // Service Configuration - Replace with your EmailJS service ID
    serviceId: 'service_dc4y1ov', // Update this with your actual EmailJS service ID
    publicKey: 'bqGKo-dBalpy6MeZE', // Update this with your actual EmailJS public key
    
    // Email Templates - Replace with your EmailJS template IDs
    templates: {
        testResults: 'template_results', // For sending test results to users
        assessmentInvite: 'template_360_invite', // For 360° assessment invitations
        questionSetShare: 'template_question_share', // For sharing "Ask My Friends" questions
        contactForm: 'template_contact', // For contact form submissions
        feedback: 'template_feedback', // For user feedback
        notification: 'template_notification', // For general notifications
        welcome: 'template_welcome' // For welcome emails
    },
    
    // Email Account Configuration
    senderEmails: {
        admin: 'admin@personatests.com',
        business: 'business@personatests.com', 
        privacy: 'privacy@personatests.com',
        support: 'support@personatests.com',
        noreply: 'no-reply@personatests.com'
    },
    
    // Email Settings
    settings: {
        timeout: 10000, // 10 seconds timeout
        retryAttempts: 3,
        enableLogging: true
    }
};

// EmailJS Service Class
class EmailService {
    constructor() {
        this.isInitialized = false;
        this.config = EMAILJS_CONFIG;
        this.init();
    }
    
    async init() {
        try {
            console.log('🔄 EmailService: Initializing...');
            
            // Load EmailJS library if not already loaded
            if (typeof emailjs === 'undefined') {
                await this.loadEmailJS();
            }
            
            // Initialize EmailJS with public key
            emailjs.init(this.config.publicKey);
            
            this.isInitialized = true;
            console.log('✅ EmailService: Initialized successfully');
            
            // Test connection
            await this.testConnection();
            
        } catch (error) {
            console.error('❌ EmailService: Initialization failed:', error);
            throw error;
        }
    }
    
    async loadEmailJS() {
        return new Promise((resolve, reject) => {
            // Check if EmailJS is already loaded
            if (typeof emailjs !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                console.log('✅ EmailJS library loaded');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Failed to load EmailJS library');
                reject(new Error('Failed to load EmailJS library'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    async testConnection() {
        try {
            console.log('🧪 EmailService: Testing connection...');
            // Note: EmailJS doesn't have a direct test method, 
            // so we just verify the service is configured
            if (this.isInitialized && typeof emailjs !== 'undefined') {
                console.log('✅ EmailService: Connection test passed');
                return true;
            }
            throw new Error('EmailJS not properly initialized');
        } catch (error) {
            console.warn('⚠️ EmailService: Connection test failed:', error.message);
            return false;
        }
    }
    
    async ensureInitialized() {
        if (!this.isInitialized) {
            console.log('⏳ EmailService: Waiting for initialization...');
            await this.init();
        }
        
        if (!this.isInitialized) {
            throw new Error('EmailService is not initialized');
        }
    }
    
    // Send Test Results Email
    async sendTestResults(userEmail, userName, testName, testResults, resultUrl) {
        try {
            await this.ensureInitialized();
            
            const templateParams = {
                to_email: userEmail,
                to_name: userName,
                from_email: this.config.senderEmails.noreply, // no-reply@personatests.com
                from_name: 'PersonaTests Team',
                reply_to_email: this.config.senderEmails.support, // support@personatests.com for replies about results
                subject: `Your ${testName} Results`,
                test_name: testName,
                user_name: userName,
                result_summary: testResults.summary || 'Your results are ready!',
                result_url: resultUrl,
                result_score: testResults.score || '',
                result_percentage: testResults.percentage || '',
                result_description: testResults.description || '',
                completion_date: new Date().toLocaleDateString(),
                website_url: 'https://personatests.com'
            };
            
            console.log('📧 Sending test results email to:', userEmail);
            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templates.testResults,
                templateParams
            );
            
            console.log('✅ Test results email sent successfully:', response);
            return response;
            
        } catch (error) {
            console.error('❌ Failed to send test results email:', error);
            throw error;
        }
    }
    
    // Send 360° Assessment Invitation
    async send360Invitation(recipientEmail, recipientName, senderName, assessmentUrl, message) {
        try {
            await this.ensureInitialized();
            
            const templateParams = {
                to_email: recipientEmail,
                to_name: recipientName,
                from_email: this.config.senderEmails.noreply, // no-reply@personatests.com
                from_name: 'PersonaTests Team',
                reply_to_email: this.config.senderEmails.noreply,
                subject: `${senderName} has invited you to provide feedback`,
                sender_name: senderName,
                recipient_name: recipientName,
                assessment_url: assessmentUrl,
                personal_message: message || `${senderName} would like your honest feedback through a 360° personality assessment.`,
                invitation_date: new Date().toLocaleDateString(),
                expires_in: '30 days',
                website_url: 'https://personatests.com'
            };
            
            console.log('📧 Sending 360° invitation to:', recipientEmail);
            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templates.assessmentInvite,
                templateParams
            );
            
            console.log('✅ 360° invitation sent successfully:', response);
            return response;
            
        } catch (error) {
            console.error('❌ Failed to send 360° invitation:', error);
            throw error;
        }
    }
    
    // Send Question Set Share
    async sendQuestionSetShare(recipientEmail, recipientName, senderName, questionSetUrl, questions) {
        try {
            await this.ensureInitialized();
            
            const templateParams = {
                to_email: recipientEmail,
                to_name: recipientName,
                from_email: this.config.senderEmails.noreply, // This will be no-reply@personatests.com
                from_name: 'PersonaTests Team',
                reply_to_email: this.config.senderEmails.noreply,
                subject: `${senderName} wants to know: How well do you know them?`,
                sender_name: senderName,
                recipient_name: recipientName,
                question_set_url: questionSetUrl,
                question_count: questions.length,
                sample_questions: questions.slice(0, 3).join(', '),
                share_date: new Date().toLocaleDateString(),
                website_url: 'https://personatests.com'
            };
            
            console.log('📧 Sending question set share to:', recipientEmail);
            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templates.questionSetShare,
                templateParams
            );
            
            console.log('✅ Question set share sent successfully:', response);
            return response;
            
        } catch (error) {
            console.error('❌ Failed to send question set share:', error);
            throw error;
        }
    }
    
    // Send Contact Form Submission
    async sendContactForm(name, email, subject, message, type = 'general') {
        try {
            await this.ensureInitialized();
            
            // Determine recipient based on type
            let toEmail = this.config.senderEmails.support;
            if (type === 'business') toEmail = this.config.senderEmails.business;
            if (type === 'privacy') toEmail = this.config.senderEmails.privacy;
            if (type === 'admin') toEmail = this.config.senderEmails.admin;
            
            const templateParams = {
                to_email: toEmail,
                from_email: email,
                from_name: name,
                reply_to_email: email,
                subject: subject,
                message: message,
                contact_type: type,
                submission_date: new Date().toLocaleDateString(),
                user_agent: navigator.userAgent,
                page_url: window.location.href
            };
            
            console.log('📧 Sending contact form to:', toEmail);
            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templates.contactForm,
                templateParams
            );
            
            console.log('✅ Contact form sent successfully:', response);
            return response;
            
        } catch (error) {
            console.error('❌ Failed to send contact form:', error);
            throw error;
        }
    }
    
    // Send Feedback/Response Notification
    async sendFeedbackNotification(recipientEmail, senderName, feedbackType, itemName) {
        try {
            await this.ensureInitialized();
            
            const templateParams = {
                to_email: recipientEmail,
                from_email: this.config.senderEmails.noreply,
                from_name: 'PersonaTests',
                subject: `New ${feedbackType} received for ${itemName}`,
                recipient_name: recipientEmail.split('@')[0],
                sender_name: senderName,
                feedback_type: feedbackType,
                item_name: itemName,
                notification_date: new Date().toLocaleDateString(),
                dashboard_url: 'https://personatests.com/results-dashboard.html',
                website_url: 'https://personatests.com'
            };
            
            console.log('📧 Sending feedback notification to:', recipientEmail);
            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templates.notification,
                templateParams
            );
            
            console.log('✅ Feedback notification sent successfully:', response);
            return response;
            
        } catch (error) {
            console.error('❌ Failed to send feedback notification:', error);
            throw error;
        }
    }
    
    // Send Welcome Email
    async sendWelcomeEmail(userEmail, userName) {
        try {
            await this.ensureInitialized();
            
            const templateParams = {
                to_email: userEmail,
                to_name: userName,
                from_email: this.config.senderEmails.noreply, // no-reply@personatests.com
                from_name: 'PersonaTests Team',
                reply_to_email: this.config.senderEmails.support, // support@personatests.com for replies
                subject: 'Welcome to PersonaTests! 🎉',
                user_name: userName,
                welcome_date: new Date().toLocaleDateString(),
                website_url: 'https://personatests.com',
                support_email: this.config.senderEmails.support
            };
            
            console.log('📧 Sending welcome email to:', userEmail);
            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templates.welcome,
                templateParams
            );
            
            console.log('✅ Welcome email sent successfully:', response);
            return response;
            
        } catch (error) {
            console.error('❌ Failed to send welcome email:', error);
            throw error;
        }
    }
    
    // Utility method to validate email address
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Bulk email sending with rate limiting
    async sendBulkEmails(emails, templateType, templateParams, delay = 1000) {
        const results = [];
        
        for (let i = 0; i < emails.length; i++) {
            try {
                const email = emails[i];
                console.log(`📧 Sending bulk email ${i + 1}/${emails.length} to:`, email);
                
                let result;
                switch (templateType) {
                    case '360_invite':
                        result = await this.send360Invitation(
                            email,
                            templateParams.recipientName || email.split('@')[0],
                            templateParams.senderName,
                            templateParams.assessmentUrl,
                            templateParams.message
                        );
                        break;
                    case 'question_share':
                        result = await this.sendQuestionSetShare(
                            email,
                            templateParams.recipientName || email.split('@')[0],
                            templateParams.senderName,
                            templateParams.questionSetUrl,
                            templateParams.questions
                        );
                        break;
                    default:
                        throw new Error(`Unsupported bulk template type: ${templateType}`);
                }
                
                results.push({ email, status: 'success', result });
                
                // Rate limiting - wait between sends
                if (i < emails.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                
            } catch (error) {
                console.error(`❌ Failed to send bulk email to ${emails[i]}:`, error);
                results.push({ email: emails[i], status: 'failed', error: error.message });
            }
        }
        
        console.log(`📊 Bulk email results: ${results.filter(r => r.status === 'success').length}/${results.length} successful`);
        return results;
    }
}

// Initialize EmailService when DOM is ready
let emailService = null;

function initializeEmailService() {
    console.log('🚀 Initializing EmailService...');
    try {
        emailService = new EmailService();
        console.log('✅ EmailService instance created');
        
        // Make it globally available
        window.emailService = emailService;
        
        return emailService;
    } catch (error) {
        console.error('❌ Failed to create EmailService:', error);
        return null;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEmailService);
} else {
    console.log('📄 DOM already loaded, initializing EmailService now...');
    initializeEmailService();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmailService, EMAILJS_CONFIG };
}
"use client";

import { useState } from 'react';
import { useTranslation } from "@/components/providers/translation-provider";

export default function EmailTestPage() {
    const { currentLanguage } = useTranslation();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const testBasicEmail = async () => {
        if (!email || !email.includes('@')) {
            setStatus('❌ Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setStatus('🔄 Sending test email...');

        try {
            console.log('🧪 BASIC EMAIL TEST STARTING...');
            
            // Import EmailJS
            const emailjs = (await import('@emailjs/browser')).default;
            console.log('✅ EmailJS imported');

            // Initialize with working credentials from legacy code
            const publicKey = 'bqGKo-dBalpy6MeZE';
            emailjs.init(publicKey);
            console.log('✅ EmailJS initialized');

            // Use the simplest possible parameters
            const emailParams = {
                to_email: email,
                message: 'This is a test email from Korean MBTI Platform couple compatibility test.',
                from_name: 'Korean MBTI Platform'
            };

            console.log('📧 Sending with parameters:', emailParams);

            // Use working service and template from legacy
            const result = await emailjs.send(
                'service_dc4y1ov',        // Working service
                'template_360_feedback_request', // Working template
                emailParams,
                publicKey
            );

            console.log('✅ EmailJS Response:', result);
            setStatus('✅ Test email sent successfully! Check your inbox (including spam folder).');

        } catch (error: any) {
            console.error('❌ Email test failed:', error);
            
            let errorMessage = 'Email sending failed: ';
            if (error.text) {
                errorMessage += error.text;
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Unknown error';
            }
            
            setStatus(`❌ ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testCoupleInvitation = async () => {
        if (!email || !email.includes('@')) {
            setStatus('❌ Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setStatus('🔄 Testing couple compatibility invitation...');

        try {
            console.log('💕 COUPLE COMPATIBILITY EMAIL TEST STARTING...');
            
            // Import the actual invitation function
            const { sendCoupleCompatibilityInvitation } = await import('@/lib/firestore');
            
            // Test with dummy data
            const result = await sendCoupleCompatibilityInvitation(
                'test_user_123', // userId
                'test_result_456', // testResultId
                email, // partnerEmail
                'Test User', // userName
                currentLanguage, // language
                email // ownerEmail (same for testing)
            );

            console.log('✅ Couple invitation result:', result);
            setStatus('✅ Couple compatibility invitation sent! Check your email.');

        } catch (error: any) {
            console.error('❌ Couple invitation failed:', error);
            setStatus(`❌ Couple invitation failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                        📧 Email Test Tool
                    </h1>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Test Email Address:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email to test"
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <button
                                onClick={testBasicEmail}
                                disabled={isLoading || !email}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? '⏳ Sending...' : '📧 Test Basic Email'}
                            </button>
                            
                            <button
                                onClick={testCoupleInvitation}
                                disabled={isLoading || !email}
                                className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? '⏳ Sending...' : '💕 Test Couple Invitation'}
                            </button>
                        </div>
                        
                        {status && (
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <p className="text-gray-800">{status}</p>
                            </div>
                        )}
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Instructions</h3>
                            <ul className="text-blue-700 space-y-1 text-sm">
                                <li>1. Enter your email address above</li>
                                <li>2. Click "Test Basic Email" to test simple EmailJS sending</li>
                                <li>3. Click "Test Couple Invitation" to test the full invitation system</li>
                                <li>4. Open browser console (F12) to see detailed logs</li>
                                <li>5. Check your email inbox AND spam folder</li>
                            </ul>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚙️ Configuration</h3>
                            <div className="text-yellow-700 font-mono text-sm space-y-1">
                                <div>Service ID: service_dc4y1ov</div>
                                <div>Template ID: template_360_feedback_request</div>
                                <div>Public Key: bqGKo-dBalpy6MeZE</div>
                                <div>Language: {currentLanguage}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
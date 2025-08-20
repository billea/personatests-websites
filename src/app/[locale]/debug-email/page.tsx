"use client";

import { useState } from 'react';
import { useTranslation } from "@/components/providers/translation-provider";

export default function DebugEmailPage() {
    const { currentLanguage } = useTranslation();
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('Test User');
    const [isLoading, setIsLoading] = useState(false);
    const [debugLog, setDebugLog] = useState<string[]>([]);
    const [status, setStatus] = useState('');

    const addLog = (message: string) => {
        console.log(message);
        setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testEmail = async () => {
        if (!email || !email.includes('@')) {
            setStatus('❌ Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setDebugLog([]);
        setStatus('🔄 Testing email delivery...');

        try {
            addLog('🧪 Starting email delivery test...');
            
            // Test 1: Check EmailJS import
            addLog('📦 Importing EmailJS...');
            const emailjs = (await import('@emailjs/browser')).default;
            addLog('✅ EmailJS imported successfully');

            // Test 2: Check EmailJS initialization  
            addLog('🔧 Initializing EmailJS...');
            const publicKey = 'bqGKo-dBalpy6MeZE';
            emailjs.init(publicKey);
            addLog(`✅ EmailJS initialized with key: ${publicKey.substring(0, 8)}...`);

            // Test 3: Prepare email parameters
            addLog('📝 Preparing email parameters...');
            const emailParams = {
                to_email: email,
                reviewer_name: email.split('@')[0],
                subject_name: userName,
                relationship: 'partner',
                feedback_url: `https://korean-mbti-platform.netlify.app/${currentLanguage}/tests/couple-compatibility/`,
                assessment_areas: 'Couple Compatibility Test',
                site_name: 'Korean MBTI Platform'
            };
            
            addLog('📋 Email parameters:');
            Object.entries(emailParams).forEach(([key, value]) => {
                addLog(`   ${key}: ${value}`);
            });

            // Test 4: Send email
            addLog('📧 Sending email via EmailJS...');
            const serviceId = 'service_dc4y1ov';
            const templateId = 'template_360_feedback_request';
            
            addLog(`   Service ID: ${serviceId}`);
            addLog(`   Template ID: ${templateId}`);
            addLog(`   Public Key: ${publicKey.substring(0, 8)}...`);

            const emailResponse = await emailjs.send(
                serviceId,
                templateId,
                emailParams,
                publicKey
            );

            addLog('✅ Email sent successfully!');
            addLog(`📊 EmailJS Response: ${JSON.stringify(emailResponse, null, 2)}`);
            setStatus('✅ Email sent successfully! Check your inbox.');

        } catch (error: any) {
            addLog(`❌ Error occurred: ${error.message}`);
            addLog(`📋 Error details: ${JSON.stringify(error, null, 2)}`);
            
            if (error.text) {
                addLog(`📧 EmailJS error text: ${error.text}`);
            }
            if (error.status) {
                addLog(`🔢 EmailJS status code: ${error.status}`);
            }
            
            setStatus(`❌ Email failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testEmailJSConnection = async () => {
        setDebugLog([]);
        addLog('🔍 Testing EmailJS service connection...');
        
        try {
            // Test basic EmailJS availability
            const emailjs = (await import('@emailjs/browser')).default;
            addLog('✅ EmailJS library loaded');
            
            // Test initialization
            emailjs.init('bqGKo-dBalpy6MeZE');
            addLog('✅ EmailJS initialized');
            
            addLog('📋 EmailJS version and methods available:');
            addLog(`   emailjs.send: ${typeof emailjs.send}`);
            addLog(`   emailjs.init: ${typeof emailjs.init}`);
            
            setStatus('✅ EmailJS connection test passed');
            
        } catch (error: any) {
            addLog(`❌ EmailJS connection failed: ${error.message}`);
            setStatus(`❌ EmailJS connection failed: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6 text-white text-center">
                        🧪 Email Debug Tool
                    </h1>
                    
                    <div className="space-y-6">
                        {/* Email Input */}
                        <div className="bg-white/10 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-white mb-4">📧 Test Email Delivery</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white font-medium mb-2">Your Name:</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-white font-medium mb-2">Test Email Address:</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter email to test delivery"
                                    />
                                </div>
                                
                                <div className="flex gap-4">
                                    <button
                                        onClick={testEmailJSConnection}
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        🔍 Test Connection
                                    </button>
                                    
                                    <button
                                        onClick={testEmail}
                                        disabled={isLoading || !email}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isLoading ? '⏳ Sending...' : '📧 Send Test Email'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Status */}
                        {status && (
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-white mb-2">📊 Status</h3>
                                <p className="text-white">{status}</p>
                            </div>
                        )}
                        
                        {/* Debug Log */}
                        {debugLog.length > 0 && (
                            <div className="bg-black/30 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-white mb-4">🐛 Debug Log</h3>
                                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                                    {debugLog.map((log, index) => (
                                        <div key={index} className="text-green-300 mb-1">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Instructions */}
                        <div className="bg-white/10 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">📋 Instructions</h3>
                            <ul className="text-white space-y-2">
                                <li>1. First click "Test Connection" to verify EmailJS is working</li>
                                <li>2. Enter your email address to test delivery</li>
                                <li>3. Click "Send Test Email" to test the actual email sending</li>
                                <li>4. Check the debug log for detailed information</li>
                                <li>5. Check your email inbox (including spam folder)</li>
                            </ul>
                        </div>
                        
                        {/* Current Configuration */}
                        <div className="bg-white/10 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">⚙️ Current Configuration</h3>
                            <div className="text-white font-mono text-sm space-y-1">
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
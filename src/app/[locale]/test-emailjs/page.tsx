"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { sendFeedbackInvitations } from "@/lib/firestore";

export default function EmailJSTestPage() {
    const params = useParams();
    const locale = params.locale as string;
    
    const [emails, setEmails] = useState<string[]>(['test@example.com']);
    const [userName, setUserName] = useState('테스트사용자');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAddEmail = () => {
        setEmails([...emails, '']);
    };

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    const handleTestEmailJS = async () => {
        console.log('=== TESTING EMAILJS WITHOUT AUTHENTICATION ===');
        
        setSending(true);
        setError(null);
        setResult(null);
        
        try {
            // Test data to simulate a completed test
            const testUserId = 'test-user-123';
            const testId = 'feedback-360';
            const testResultId = 'test-result-456';
            const validEmails = emails.filter(email => email.trim() && email.includes('@'));
            const feedbackCategory = 'general';
            
            console.log('Test parameters:', {
                testUserId,
                testId, 
                testResultId,
                validEmails,
                userName: userName.trim(),
                feedbackCategory,
                language: locale
            });
            
            // This will test the URL generation and EmailJS sending
            const invitationResult = await sendFeedbackInvitations(
                testUserId,
                testId,
                testResultId,
                validEmails,
                userName.trim(),
                feedbackCategory as 'work' | 'friends' | 'family' | 'academic' | 'general',
                locale || 'ko'
            );
            
            console.log('EmailJS test result:', invitationResult);
            setResult(invitationResult);
            
        } catch (err) {
            console.error('EmailJS test error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
            <div className="w-full max-w-2xl bg-white/20 backdrop-blur-sm rounded-xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    EmailJS 테스트 (인증 우회)
                </h1>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-white font-medium mb-2">
                            이름:
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="테스트할 사용자 이름"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-white font-medium mb-2">
                            이메일 주소들:
                        </label>
                        {emails.map((email, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleEmailChange(index, e.target.value)}
                                    className="flex-1 p-3 bg-white/10 border border-white/30 rounded text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    placeholder="이메일 주소 입력"
                                />
                                {emails.length > 1 && (
                                    <button
                                        onClick={() => setEmails(emails.filter((_, i) => i !== index))}
                                        className="px-3 py-2 bg-red-500/20 text-white rounded hover:bg-red-500/30"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={handleAddEmail}
                            className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 text-sm"
                        >
                            이메일 추가
                        </button>
                    </div>
                    
                    <button
                        onClick={handleTestEmailJS}
                        disabled={sending}
                        className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all"
                    >
                        {sending ? 'EmailJS 테스트 중...' : 'EmailJS 테스트 실행'}
                    </button>
                    
                    {error && (
                        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded text-white">
                            <h3 className="font-bold mb-2">오류:</h3>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {result && (
                        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded text-white">
                            <h3 className="font-bold mb-2">결과:</h3>
                            <p className="mb-2">성공: {result.success ? '✅' : '❌'}</p>
                            <p className="mb-2">초대장 전송: {result.invitationsSent}개</p>
                            {result.invitations && (
                                <div>
                                    <p className="font-medium mb-2">생성된 링크들:</p>
                                    {result.invitations.map((inv: any, index: number) => (
                                        <div key={index} className="mb-2 p-2 bg-black/20 rounded text-xs">
                                            <p className="text-yellow-300">→ {inv.email}</p>
                                            <a 
                                                href={inv.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-300 hover:text-blue-100 break-all"
                                            >
                                                {inv.link}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="text-center text-white/80 text-sm">
                        <p>🔍 브라우저 콘솔을 확인하여 EmailJS 디버그 로그를 확인하세요</p>
                        <p>이 테스트는 Firebase 인증을 우회하여 EmailJS 기능만 테스트합니다</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
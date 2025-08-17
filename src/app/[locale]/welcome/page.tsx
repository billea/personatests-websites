"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/components/providers/translation-provider";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomePage() {
    const { user, loading } = useAuth();
    const { t, currentLanguage } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const locale = params.locale as string;
    const returnUrl = searchParams.get('returnUrl');
    const context = searchParams.get('context');
    const userName = searchParams.get('userName');
    const [countdown, setCountdown] = useState(3);
    const [isRedirecting, setIsRedirecting] = useState(false);
    
    // Get user's display name or fallback
    const displayName = user?.displayName || userName || user?.email?.split('@')[0] || 'User';
    const firstName = displayName.split(' ')[0];
    
    const is360Feedback = context === 'feedback-360-test';
    
    // Auto-redirect after countdown
    useEffect(() => {
        if (!returnUrl || loading || !user) return;
        
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setIsRedirecting(true);
                    setTimeout(() => {
                        router.push(returnUrl);
                    }, 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [returnUrl, loading, router, user]);
    
    // Redirect if no user or missing parameters
    useEffect(() => {
        if (!loading && (!user || !returnUrl)) {
            router.push(`/${locale}`);
        }
    }, [user, loading, returnUrl, locale, router]);
    
    const handleContinue = () => {
        if (returnUrl) {
            setIsRedirecting(true);
            router.push(returnUrl);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-lg text-white">Loading...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg p-8 text-center">
                
                {/* Welcome Animation */}
                <div className="mb-8">
                    <div className="text-6xl mb-4 animate-bounce">👋</div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {currentLanguage === 'ko' ? 
                                `안녕하세요, ${firstName}님!` : 
                                `Welcome, ${firstName}!`
                            }
                        </h1>
                        <p className="text-lg text-gray-600">
                            {currentLanguage === 'ko' ? 
                                '로그인해 주셔서 감사합니다!' : 
                                'Thank you for signing in!'
                            }
                        </p>
                    </div>
                </div>
                
                {/* Context-specific message */}
                {is360Feedback ? (
                    <div className="mb-8 p-6 bg-blue-50 rounded-lg">
                        <div className="text-4xl mb-3">🎯</div>
                        <h2 className="text-xl font-semibold text-blue-800 mb-3">
                            {currentLanguage === 'ko' ? 
                                '360° 피드백 테스트' : 
                                '360° Feedback Test'
                            }
                        </h2>
                        <p className="text-blue-700 leading-relaxed">
                            {currentLanguage === 'ko' ? 
                                '이제 다면적 피드백 테스트를 시작할 준비가 되었습니다. 이 테스트를 통해 자신에 대한 새로운 통찰을 얻고, 다른 사람들이 당신을 어떻게 보는지 알아보세요.' : 
                                'You\'re now ready to begin your comprehensive 360° feedback assessment. This test will give you valuable insights into how others perceive you and help you understand yourself better.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="mb-8 p-6 bg-green-50 rounded-lg">
                        <div className="text-4xl mb-3">✨</div>
                        <h2 className="text-xl font-semibold text-green-800 mb-3">
                            {currentLanguage === 'ko' ? 
                                '개인화된 테스트 경험' : 
                                'Personalized Testing Experience'
                            }
                        </h2>
                        <p className="text-green-700 leading-relaxed">
                            {currentLanguage === 'ko' ? 
                                '이제 당신만의 맞춤형 테스트 경험을 시작할 수 있습니다. 결과가 안전하게 저장되며 언제든지 다시 확인할 수 있습니다.' : 
                                'You can now enjoy a personalized testing experience. Your results will be securely saved and you can access them anytime.'
                            }
                        </p>
                    </div>
                )}
                
                {/* Continue Button */}
                <div className="space-y-4">
                    <button
                        onClick={handleContinue}
                        disabled={isRedirecting}
                        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                            isRedirecting 
                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                    >
                        {isRedirecting ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>
                                    {currentLanguage === 'ko' ? '이동 중...' : 'Redirecting...'}
                                </span>
                            </div>
                        ) : (
                            currentLanguage === 'ko' ? '계속하기' : 'Continue'
                        )}
                    </button>
                    
                    {/* Auto-redirect countdown */}
                    {countdown > 0 && !isRedirecting && (
                        <p className="text-sm text-gray-500">
                            {currentLanguage === 'ko' ? 
                                `${countdown}초 후 자동으로 이동합니다` : 
                                `Auto-redirecting in ${countdown} seconds`
                            }
                        </p>
                    )}
                </div>
                
                {/* User Benefits Reminder */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-3">
                        {currentLanguage === 'ko' ? '계정의 이점:' : 'Your Account Benefits:'}
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {currentLanguage === 'ko' ? '결과가 안전하게 저장됩니다' : 'Results are securely saved'}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {currentLanguage === 'ko' ? '진행 상황을 추적할 수 있습니다' : 'Track your progress'}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {currentLanguage === 'ko' ? '언제든지 결과를 다시 확인할 수 있습니다' : 'Access results anytime'}
                        </li>
                        {is360Feedback && (
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                {currentLanguage === 'ko' ? '피드백 알림을 받습니다' : 'Get feedback notifications'}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
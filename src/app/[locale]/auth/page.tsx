"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/components/providers/translation-provider";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthPage() {
    const { user, loading } = useAuth();
    const { t, currentLanguage } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const locale = params.locale as string;
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    
    // Email authentication state
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailVerificationSent, setEmailVerificationSent] = useState(false);
    
    // Get context from URL params
    const returnUrl = searchParams.get('returnUrl');
    const context = searchParams.get('context');
    const is360Feedback = context === 'feedback-360-test';
    const isCoupleCompatibility = context === 'couple-compatibility-test';
    
    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            if (returnUrl) {
                console.log('User already logged in, redirecting to:', returnUrl);
                router.push(returnUrl);
            } else {
                router.push(`/${locale}`);
            }
        }
    }, [user, loading, returnUrl, locale, router]);

    const handleGoogleSignIn = async () => {
        setIsSigningIn(true);
        setAuthError(null);
        
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            console.log('Sign in successful:', result.user.email);
            
            // The AuthProvider will handle the redirect automatically
            // to the welcome page for feedback tests, or direct redirect for others
            if (returnUrl && (context === 'feedback-360-test' || context === 'couple-compatibility-test')) {
                // For 360 feedback and couple compatibility, the AuthProvider will handle the welcome page redirect
                console.log(`AuthProvider will handle ${context} welcome redirect`);
            } else if (returnUrl) {
                // For other cases, redirect directly
                console.log('Redirecting to saved return URL:', returnUrl);
                router.push(returnUrl);
            } else {
                router.push(`/${locale}`);
            }
        } catch (error: any) {
            console.error('Sign in error:', error);
            setAuthError(error.message || 'Sign in failed. Please try again.');
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSigningIn(true);
        setAuthError(null);
        
        try {
            let result;
            
            if (isSignUp) {
                // Create new account
                result = await createUserWithEmailAndPassword(auth, email, password);
                
                // Update display name if provided
                const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
                if (fullName) {
                    await updateProfile(result.user, {
                        displayName: fullName
                    });
                }
                
                // Send email verification
                await sendEmailVerification(result.user);
                setEmailVerificationSent(true);
                
                // Don't redirect immediately - show verification message
                return;
            } else {
                // Sign in existing user
                result = await signInWithEmailAndPassword(auth, email, password);
                
                // Check if email is verified
                if (!result.user.emailVerified) {
                    setAuthError(currentLanguage === 'ko' ? 
                        '이메일 확인이 필요합니다. 이메일 확인 링크를 클릭한 후 다시 로그인해주세요.' : 
                        'Please verify your email address by clicking the link in your email before signing in.'
                    );
                    return;
                }
            }
            
            console.log('Email auth successful:', result.user.email);
            
            // Same redirect logic as Google auth
            if (returnUrl && (context === 'feedback-360-test' || context === 'couple-compatibility-test')) {
                console.log(`AuthProvider will handle ${context} welcome redirect`);
            } else if (returnUrl) {
                console.log('Redirecting to saved return URL:', returnUrl);
                router.push(returnUrl);
            } else {
                router.push(`/${locale}`);
            }
        } catch (error: any) {
            console.error('Email auth error:', error);
            let errorMessage = 'Authentication failed. Please try again.';
            
            // Handle specific Firebase errors
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use. Try signing in instead.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Try signing up.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            }
            
            setAuthError(errorMessage);
        } finally {
            setIsSigningIn(false);
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
            <div className="max-w-md w-full bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg p-8">
                
                {/* Header based on context */}
                {is360Feedback ? (
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🎯</div>
                        <h1 className="text-2xl font-bold mb-2 text-gray-800">
                            {currentLanguage === 'ko' ? 
                                '360° 피드백 테스트' : 
                                '360° Feedback Test'
                            }
                        </h1>
                        <p className="text-gray-600">
                            {currentLanguage === 'ko' ? 
                                '계속하려면 로그인이 필요합니다' : 
                                'Please sign in to continue'
                            }
                        </p>
                    </div>
                ) : isCoupleCompatibility ? (
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">💕</div>
                        <h1 className="text-2xl font-bold mb-2 text-gray-800">
                            {currentLanguage === 'ko' ? 
                                '커플 궁합 테스트' : 
                                'Couple Compatibility Test'
                            }
                        </h1>
                        <p className="text-gray-600">
                            {currentLanguage === 'ko' ? 
                                '계속하려면 로그인이 필요합니다' : 
                                'Please sign in to continue'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">👋</div>
                        <h1 className="text-2xl font-bold mb-2 text-gray-800">
                            {currentLanguage === 'ko' ? 
                                '로그인 / 회원가입' : 
                                'Sign In / Sign Up'
                            }
                        </h1>
                        <p className="text-gray-600">
                            {currentLanguage === 'ko' ? 
                                '개인화된 테스트 경험을 위해 로그인하세요' : 
                                'Sign in for a personalized testing experience'
                            }
                        </p>
                    </div>
                )}

                {/* Email Verification Success Message */}
                {emailVerificationSent && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="text-2xl mr-3">📧</div>
                            <div>
                                <h3 className="font-semibold text-green-800 mb-1">
                                    {currentLanguage === 'ko' ? 
                                        '이메일 확인이 필요합니다' : 
                                        'Email Verification Required'
                                    }
                                </h3>
                                <p className="text-sm text-green-700">
                                    {currentLanguage === 'ko' ? 
                                        `${email}으로 확인 이메일을 보냈습니다. 이메일의 링크를 클릭하여 계정을 확인한 후 로그인해주세요.` : 
                                        `We sent a verification email to ${email}. Please click the link in the email to verify your account, then sign in.`
                                    }
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmailVerificationSent(false);
                                        setIsSignUp(false);
                                    }}
                                    className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium"
                                >
                                    {currentLanguage === 'ko' ? '로그인으로 돌아가기' : 'Back to Sign In'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Email Authentication Form */}
                {!emailVerificationSent && (
                <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                    {isSignUp && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder={currentLanguage === 'ko' ? '이름' : 'First Name'}
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder={currentLanguage === 'ko' ? '성' : 'Last Name'}
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <input
                            type="email"
                            placeholder={currentLanguage === 'ko' ? '이메일 주소' : 'Email address'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            placeholder={currentLanguage === 'ko' ? '비밀번호 (최소 6자)' : 'Password (min 6 characters)'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSigningIn}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                            isSigningIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isSigningIn ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>
                                    {currentLanguage === 'ko' ? '처리 중...' : 'Processing...'}
                                </span>
                            </div>
                        ) : (
                            isSignUp ? 
                                (currentLanguage === 'ko' ? '계정 만들기' : 'Create Account') :
                                (currentLanguage === 'ko' ? '로그인' : 'Sign In')
                        )}
                    </button>
                    
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            {isSignUp ? 
                                (currentLanguage === 'ko' ? '이미 계정이 있으신가요? 로그인' : 'Already have an account? Sign In') :
                                (currentLanguage === 'ko' ? '계정이 없으신가요? 가입하기' : 'Don\'t have an account? Sign Up')
                            }
                        </button>
                    </div>
                </form>
                )}

                {/* Divider */}
                {!emailVerificationSent && (
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            {currentLanguage === 'ko' ? '또는' : 'or'}
                        </span>
                    </div>
                </div>

                {/* Google Sign In Button */}
                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isSigningIn}
                        className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors ${
                            isSigningIn ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSigningIn ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        )}
                        <span className="font-medium">
                            {isSigningIn ? (
                                currentLanguage === 'ko' ? '로그인 중...' : 'Signing in...'
                            ) : (
                                currentLanguage === 'ko' ? 'Google로 로그인' : 'Sign in with Google'
                            )}
                        </span>
                    </button>

                    {authError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{authError}</p>
                        </div>
                    )}
                </div>
                )}

                {/* Benefits for 360 Feedback */}
                {is360Feedback && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">
                            {currentLanguage === 'ko' ? '계정의 이점:' : 'Benefits of your account:'}
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>✓ {currentLanguage === 'ko' ? '피드백 결과가 안전하게 저장됩니다' : 'Feedback results are securely saved'}</li>
                            <li>✓ {currentLanguage === 'ko' ? '새로운 피드백 알림을 받습니다' : 'Get notified when new feedback arrives'}</li>
                            <li>✓ {currentLanguage === 'ko' ? '진행 상황을 추적할 수 있습니다' : 'Track feedback progress and statistics'}</li>
                            <li>✓ {currentLanguage === 'ko' ? '종합적인 결과 대시보드를 이용합니다' : 'Access comprehensive results dashboard'}</li>
                        </ul>
                    </div>
                )}

                {/* Benefits for Couple Compatibility */}
                {isCoupleCompatibility && (
                    <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                        <h3 className="font-semibold text-pink-800 mb-2">
                            {currentLanguage === 'ko' ? '계정의 이점:' : 'Benefits of your account:'}
                        </h3>
                        <ul className="text-sm text-pink-700 space-y-1">
                            <li>✓ {currentLanguage === 'ko' ? '호환성 결과가 안전하게 저장됩니다' : 'Compatibility results are securely saved'}</li>
                            <li>✓ {currentLanguage === 'ko' ? '파트너 초대를 쉽게 보낼 수 있습니다' : 'Easily send partner invitations'}</li>
                            <li>✓ {currentLanguage === 'ko' ? '결과 공유 및 소셜 미디어 연동' : 'Share results and connect on social media'}</li>
                            <li>✓ {currentLanguage === 'ko' ? '언제든지 결과를 다시 확인할 수 있습니다' : 'Access your results anytime'}</li>
                        </ul>
                    </div>
                )}

                {/* Back button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            // Go back to tests listing page
                            router.push(`/${locale}/tests`);
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ← {currentLanguage === 'ko' ? '뒤로 가기' : 'Go back'}
                    </button>
                </div>

                {/* Privacy note */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        {currentLanguage === 'ko' ? 
                            '로그인 시 개인정보 처리방침과 서비스 약관에 동의하는 것으로 간주됩니다.' : 
                            'By signing in, you agree to our Privacy Policy and Terms of Service.'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
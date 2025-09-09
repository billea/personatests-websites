"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/components/providers/translation-provider";
import { getTestById, TestDefinition } from "@/lib/test-definitions";
import { sendFeedbackNotification } from "@/lib/firestore";


interface InvitationData {
    id: string;
    inviterName: string;
    testId: string;
    testResultId: string;
    participantEmail: string;
    status: string;
    invitationToken: string;
}

export default function FeedbackPage() {
    const { t, currentLanguage } = useTranslation();
    const params = useParams();
    const searchParams = useSearchParams();
    
    const invitationId = params.invitationId as string;
    const locale = params.locale as string;
    const token = searchParams.get('token') || '';
    
    // Debug: Log locale and translation test
    console.log('Feedback page locale:', locale);
    console.log('Translation test:', t('feedback360.ui.title'));
    console.log('Current language from translation provider:', currentLanguage);
    console.log('Page render timestamp:', new Date().toISOString());
    
    // Korean language detection - use both locale param and currentLanguage
    const isKorean = locale === 'ko' || currentLanguage === 'ko';
    
    // Korean translations with fallbacks
    const getLocalizedText = (key: string, fallback: string, koreanText: string) => {
        const translated = t(key);
        console.log('getLocalizedText: key="' + key + '", translated="' + translated + '", isKorean=' + isKorean);
        if (translated && translated !== key && translated.trim() !== '') {
            return translated;
        }
        return isKorean ? koreanText : fallback;
    };
    
    // Debug: Log that page is loading
    console.log('FeedbackPage loading with:', { invitationId, token, params, searchParams: searchParams.toString() });

    const [invitation, setInvitation] = useState<InvitationData | null>(null);
    const [testDefinition, setTestDefinition] = useState<TestDefinition | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        loadInvitation();
    }, [invitationId, token]);

    const loadInvitation = async () => {
        try {
            // Enhanced URL debugging
            console.log('=== FEEDBACK PAGE URL DEBUG ===');
            console.log('Full URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');
            console.log('Search params string:', typeof window !== 'undefined' ? window.location.search : 'SSR');
            console.log('Invitation ID from params:', invitationId);
            console.log('Token from URL params:', token);
            
            // Debug the raw searchParams object
            console.log('SearchParams object:', searchParams);
            console.log('SearchParams toString():', searchParams.toString());
            console.log('All searchParams entries:');
            for (const [key, value] of searchParams.entries()) {
                console.log('  "' + key + '" = "' + value + '"');
            }
            
            // Get invitation data from URL parameters with fallback
            let userName = searchParams.get('name');
            let testId = searchParams.get('testId');
            let testResultId = searchParams.get('testResultId');
            let participantEmail = searchParams.get('email');
            
            // Fallback: Try parsing from window.location if searchParams is empty
            if (typeof window !== 'undefined' && (!userName || !testId || !testResultId || !participantEmail)) {
                console.log('SearchParams missing values, trying window.location fallback...');
                const urlParams = new URLSearchParams(window.location.search);
                console.log('Window location search:', window.location.search);
                console.log('URLSearchParams from window:');
                for (const [key, value] of urlParams.entries()) {
                    console.log('  "' + key + '" = "' + value + '"');
                }
                
                userName = userName || urlParams.get('name');
                testId = testId || urlParams.get('testId');
                testResultId = testResultId || urlParams.get('testResultId');
                participantEmail = participantEmail || urlParams.get('email');
                
                console.log('After fallback:');
                console.log('  userName:', userName);
                console.log('  testId:', testId);
                console.log('  testResultId:', testResultId);
                console.log('  participantEmail:', participantEmail);
            }
            
            // Debug: Log all parameters with enhanced details
            console.log('Debug parameters:', {
                userName,
                testId,
                testResultId,
                participantEmail,
                token,
                allParams: searchParams.toString(),
                parameterCount: searchParams.toString().split('&').length
            });
            
            // Log each parameter individually for clarity
            console.log('Individual parameters:');
            console.log('  ✓ name:', userName ? '"' + userName + '"' : '❌ MISSING');
            console.log('  ✓ testId:', testId ? '"' + testId + '"' : '❌ MISSING');
            console.log('  ✓ testResultId:', testResultId ? '"' + testResultId + '"' : '❌ MISSING');
            console.log('  ✓ email:', participantEmail ? '"' + participantEmail + '"' : '❌ MISSING');
            console.log('  ✓ token:', token ? '"' + token + '"' : '❌ MISSING');
            console.log('=== END URL DEBUG ===');
            
            if (!userName || !testId || !testResultId || !participantEmail || !token) {
                const missingParams = [];
                if (!userName) missingParams.push('name');
                if (!testId) missingParams.push('testId');
                if (!testResultId) missingParams.push('testResultId');
                if (!participantEmail) missingParams.push('email');
                if (!token) missingParams.push('token');
                
                console.error('Missing parameters detected. Full URL analysis:');
                console.error('Current URL:', typeof window !== 'undefined' ? window.location.href : 'N/A');
                console.error('URL length:', typeof window !== 'undefined' ? window.location.href.length : 'N/A');
                console.error('Missing params:', missingParams);
                
                const errorMsg = 'Invalid invitation link - missing required parameters: ' + missingParams.join(', ') + 
                    '. URL may have been truncated. Please contact the person who sent you this link for a new invitation. ' +
                    'If you received this link via email, the email client may have broken the link. Try copying the entire link or asking for a new invitation.';
                setError(errorMsg);
                setLoading(false);
                return;
            }

            // Check if feedback already submitted for this invitation
            const submittedFeedback = JSON.parse(localStorage.getItem('submitted_feedback') || '[]');
            const alreadySubmitted = submittedFeedback.some((fb: any) => fb.invitationId === invitationId);
            
            if (alreadySubmitted) {
                setError('This feedback has already been submitted');
                setLoading(false);
                return;
            }
            
            const invitationData: InvitationData = {
                id: invitationId,
                inviterName: userName,
                testId: testId,
                testResultId: testResultId,
                participantEmail: participantEmail,
                status: 'pending',
                invitationToken: token
            };

            setInvitation(invitationData);

            // Load test definition
            const testDef: TestDefinition | undefined = getTestById(invitationData.testId);
            if (testDef) {
                setTestDefinition(testDef);
            } else {
                setError('Test not found');
            }
        } catch (err: unknown) {
            console.error('Error loading invitation:', err);
            setError('Failed to load invitation');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answer: any) => {
        if (!testDefinition) return;

        const currentQuestion = testDefinition.questions[currentQuestionIndex];
        const newAnswers = {
            ...answers,
            [currentQuestion.id]: answer
        };
        setAnswers(newAnswers);

        if (currentQuestionIndex < testDefinition.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Submit feedback
            handleSubmitFeedback(newAnswers);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitFeedback = async (finalAnswers: { [questionId: string]: any }) => {
        if (!invitation || !testDefinition) return;

        setSubmitting(true);
        try {
            // Process answers through the test's scoring function
            const result = testDefinition.scoring(finalAnswers);

            // For static deployment, store feedback in localStorage
            const feedbackData = {
                invitationId: invitationId,
                testId: invitation.testId,
                testResultId: invitation.testResultId,
                answers: finalAnswers,
                result: result,
                submittedAt: new Date().toISOString(),
                aboutPerson: invitation.inviterName,
                token: token
            };

            // Store the submitted feedback
            const existingFeedback = JSON.parse(localStorage.getItem('submitted_feedback') || '[]');
            existingFeedback.push(feedbackData);
            localStorage.setItem('submitted_feedback', JSON.stringify(existingFeedback));

            // Also store aggregated feedback for the test result
            const aggregatedKey = 'aggregated_feedback_' + invitation.testResultId;
            const existingAggregated = JSON.parse(localStorage.getItem(aggregatedKey) || '[]');
            existingAggregated.push({
                result: result,
                submittedAt: feedbackData.submittedAt,
                feedbackId: invitationId
            });
            localStorage.setItem(aggregatedKey, JSON.stringify(existingAggregated));

            console.log('Feedback submitted successfully:', feedbackData);
            
            // Send notification email to test owner
            try {
                console.log('Attempting to send feedback notification...');
                
                // Get owner email from localStorage where invitations are stored
                let ownerEmail = 'durha2000@gmail.com'; // Fallback for testing
                try {
                    const invitationsData = localStorage.getItem('feedback_invitations');
                    if (invitationsData) {
                        const invitations = JSON.parse(invitationsData);
                        const matchingInvitation = invitations.find((inv: any) => inv.id === invitationId);
                        if (matchingInvitation && matchingInvitation.ownerEmail) {
                            ownerEmail = matchingInvitation.ownerEmail;
                            console.log('Found owner email from invitation data:', ownerEmail);
                        }
                    }
                } catch (error) {
                    console.log('Could not find owner email in localStorage, using fallback');
                }
                
                const ownerName = invitation.inviterName;
                const reviewerEmail = invitation.participantEmail || 'anonymous@reviewer.com';
                const locale = currentLanguage || 'ko';
                
                const notificationResult = await sendFeedbackNotification(
                    ownerEmail,
                    ownerName,
                    reviewerEmail,
                    invitation.testId,
                    locale
                );
                
                if (notificationResult.success) {
                    console.log('✅ Notification email sent successfully');
                } else {
                    console.log('⚠️ Notification email failed:', notificationResult.message);
                }
            } catch (notificationError) {
                console.error('❌ Error sending notification:', notificationError);
                // Don't fail the feedback submission if notification fails
            }
            
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg">{t('feedback360.ui.loading') || '로딩 중...'}</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <p className="text-sm text-gray-500">
                        If you think this is a mistake, please contact the person who sent you this link.
                    </p>
                </div>
            </main>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-8 p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
                        <div className="text-green-400 text-6xl mb-6">✅</div>
                        <h1 className="text-4xl font-bold mb-4 text-white">
                            {(t('feedback360.ui.thank_you') !== 'feedback360.ui.thank_you' ? t('feedback360.ui.thank_you') : null) || 
                             (isKorean ? '감사합니다!' : 'Thank You!')}
                        </h1>
                        <p className="text-lg text-white/90 mb-6">
                            {isKorean 
                                ? (invitation?.inviterName || '') + '님을 위한 피드백이 성공적으로 제출되었습니다.'
                                : 'Your feedback for ' + (invitation?.inviterName || '') + ' has been successfully submitted.'
                            }
                        </p>
                        <p className="text-white/80 mb-8">
                            {isKorean 
                                ? (invitation?.inviterName || '') + '님은 귀하의 통찰력을 받게 되며, 귀하의 신원은 완전히 익명으로 유지됩니다.'
                                : (invitation?.inviterName || '') + ' will receive your insights, and your identity will remain completely anonymous.'
                            }
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gradient-to-br from-pink-500/30 to-purple-500/30 border border-pink-400/50 rounded-lg">
                            <h2 className="text-2xl font-bold text-white mb-4 text-center">
                                🎯 {isKorean ? '무료 성격 테스트 받기' : 'Get Your Free Personality Test'}
                            </h2>
                            <p className="text-white/90 mb-6 text-center">
                                {isKorean 
                                    ? '16가지 성격 유형, Big Five, 커플 호환성 등 다양한 무료 테스트를 체험해보세요!'
                                    : 'Experience 16 personality types, Big Five, couple compatibility and more free tests!'
                                }
                            </p>
                            <div className="text-center">
                                <a
                                    href={'/' + currentLanguage + '/tests'}
                                    className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    {isKorean ? '🚀 무료 테스트 시작하기' : '🚀 Start Free Tests'}
                                </a>
                                <p className="text-white/70 text-sm mt-3">
                                    {isKorean ? '회원가입 없이 바로 시작!' : 'No signup required!'}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-500/30 to-blue-500/30 border border-green-400/50 rounded-lg">
                            <h2 className="text-2xl font-bold text-white mb-4 text-center">
                                🔄 {isKorean ? '나도 360도 피드백 받기' : 'Get My Own 360° Feedback'}
                            </h2>
                            <p className="text-white/90 mb-6 text-center">
                                {isKorean 
                                    ? '동료, 친구, 가족으로부터 익명 피드백을 받아 나 자신을 더 깊이 이해해보세요!'
                                    : 'Get anonymous feedback from colleagues, friends, and family to understand yourself better!'
                                }
                            </p>
                            <div className="text-center">
                                <a
                                    href={'/' + currentLanguage + '/tests/feedback-360'}
                                    className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    {isKorean ? '🎯 내 피드백 받기' : '🎯 Get My Feedback'}
                                </a>
                                <p className="text-white/70 text-sm mt-3">
                                    {isKorean ? '다각도 관점으로 나를 발견하기' : 'Discover yourself from multiple perspectives'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <p className="text-white/80 text-lg mb-4">
                            {isKorean 
                                ? '✨ 더 많은 사람들이 이 경험을 할 수 있도록 공유해보세요!'
                                : '✨ Share this experience so more people can benefit from it!'
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => {
                                    const baseUrl = window.location.origin;
                                    const testsPath = currentLanguage + '/tests';
                                    const testsUrl = baseUrl + '/' + testsPath;
                                    
                                    const shareText = isKorean 
                                        ? '방금 360도 피드백을 제출했어요! 나도 무료 성격 테스트를 해보고 싶다면: ' + testsUrl
                                        : 'Just submitted 360° feedback! Want to try free personality tests too? ' + testsUrl;
                                    
                                    if (navigator.share) {
                                        navigator.share({
                                            title: isKorean ? 'Korean MBTI Platform' : 'Korean MBTI Platform',
                                            text: shareText
                                        });
                                    } else {
                                        navigator.clipboard.writeText(shareText);
                                        alert(isKorean ? '링크가 복사되었습니다!' : 'Link copied to clipboard!');
                                    }
                                }}
                                className="px-6 py-2 bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-lg transition-all duration-300"
                            >
                                📱 {isKorean ? '공유하기' : 'Share'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (submitting) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-lg">{t('feedback360.ui.submitting') || '피드백을 제출하는 중...'}</p>
                </div>
            </main>
        );
    }

    if (!testDefinition || !invitation) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </main>
        );
    }

    const currentQuestion = testDefinition.questions[currentQuestionIndex];

    console.log('Render debug:', { 
        locale, 
        currentLanguage, 
        isKorean, 
        titleText: getLocalizedText('feedback360.ui.title', 'Feedback Request', '피드백 요청')
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
            <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <div className="mb-6 p-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-lg">
                        <h1 className="text-2xl font-bold text-white mb-4 text-center">
                            🎯 {(t('feedback360.ui.title') !== 'feedback360.ui.title' ? t('feedback360.ui.title') : null) || 
                             (isKorean ? '피드백 요청' : 'Feedback Request')}
                        </h1>
                        <p className="text-white/90 mb-6 text-lg text-center">
                            {isKorean 
                                ? invitation.inviterName + '님이 피드백을 요청했습니다'
                                : invitation.inviterName + ' has asked for your feedback'
                            }
                        </p>
                        <p className="text-white/80 mb-6 text-center">
                            {(t('feedback360.ui.instructions') !== 'feedback360.ui.instructions' ? t('feedback360.ui.instructions') : null) || 
                             (isKorean ? '다음 질문들에 솔직하게 답변해 주세요. 귀하의 응답은 익명으로 처리됩니다.' : 'Please answer the following questions honestly. Your responses will be handled anonymously.')}
                        </p>
                    </div>
                    
                    <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 mb-2">
                        <div
                            className="bg-gradient-to-r from-yellow-300 to-orange-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: ((currentQuestionIndex + 1) / testDefinition.questions.length) * 100 + '%' }}
                        ></div>
                    </div>
                    <p className="text-white/80 text-sm">
                        Question {currentQuestionIndex + 1} of {testDefinition.questions.length}
                    </p>
                </div>

                <div className="p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
                        <h2 className="mb-6 text-xl font-semibold tracking-tight text-white" data-translate={currentQuestion.text_key}>
                            {t(currentQuestion.text_key) || currentQuestion.text_key}
                        </h2>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
                            <p className="text-sm text-white/90 font-medium">
                                {isKorean 
                                    ? '이 질문에 답할 때 ' + invitation.inviterName + '님을 생각해 주세요.'
                                    : 'Think about ' + invitation.inviterName + ' when answering this question.'
                                }
                            </p>
                        </div>

                        {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                            <div className="flex flex-col gap-3">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(option.value)}
                                        className="w-full p-4 text-left bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-white"
                                        data-translate={option.text_key}
                                    >
                                        {t(option.text_key) || option.text_key}
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === 'scale' && currentQuestion.scale && (
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-white/80">
                                    <span>
                                        {(t('feedback360.ui.scale_labels.not_at_all') !== 'feedback360.ui.scale_labels.not_at_all' ? t('feedback360.ui.scale_labels.not_at_all') : null) || 
                                         (isKorean ? '전혀 그렇지 않다' : 'Not at all')}
                                    </span>
                                    <span>
                                        {(t('feedback360.ui.scale_labels.always') !== 'feedback360.ui.scale_labels.always' ? t('feedback360.ui.scale_labels.always') : null) || 
                                         (isKorean ? '매우 그렇다' : 'Always')}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    {Array.from({ length: currentQuestion.scale!.max - currentQuestion.scale!.min + 1 }, (_, i) => {
                                        const value = currentQuestion.scale!.min + i;
                                        return (
                                            <button
                                                key={value}
                                                onClick={() => handleAnswer(value)}
                                                className="flex-1 py-3 text-center bg-white/20 backdrop-blur-sm border border-white/30 rounded hover:bg-white/30 hover:scale-105 transition-all duration-300 text-white font-semibold"
                                            >
                                                {value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex gap-3">
                            {currentQuestionIndex > 0 && (
                                <button
                                    onClick={handlePreviousQuestion}
                                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                                >
                                    ← {isKorean ? '이전' : 'Previous'}
                                </button>
                            )}
                        </div>
                        
                        <div className="text-white/80 text-sm">
                            Question {currentQuestionIndex + 1} of {testDefinition.questions.length}
                        </div>
                        
                        <div className="w-20"></div>
                    </div>

                    <div className="mt-8 text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/80 flex items-center justify-center mr-3">
                                <span className="text-white text-sm">🔒</span>
                            </div>
                            <p className="text-sm font-semibold text-white">
                                {isKorean ? '100% 익명 보장' : '100% Anonymous Guarantee'}
                            </p>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed max-w-2xl mx-auto">
                            {isKorean 
                                ? '이 피드백은 완전히 익명입니다. ' + invitation.inviterName + '님은 종합 결과만 볼 수 있으며 개별 응답이나 응답자가 누구인지는 알 수 없습니다.'
                                : 'This feedback is completely anonymous. ' + invitation.inviterName + ' will see aggregated results but not individual responses or who provided them.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
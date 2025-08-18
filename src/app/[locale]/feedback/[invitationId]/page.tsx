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
    
    // Korean language detection - use both locale param and currentLanguage
    const isKorean = locale === 'ko' || currentLanguage === 'ko';
    
    // Korean translations with fallbacks
    const getLocalizedText = (key: string, fallback: string, koreanText: string) => {
        const translated = t(key);
        console.log(`getLocalizedText: key="${key}", translated="${translated}", isKorean=${isKorean}`);
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
            
            // Get invitation data from URL parameters
            const userName = searchParams.get('name');
            const testId = searchParams.get('testId');
            const testResultId = searchParams.get('testResultId');
            const participantEmail = searchParams.get('email');
            
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
            console.log('  ✓ name:', userName ? `"${userName}"` : '❌ MISSING');
            console.log('  ✓ testId:', testId ? `"${testId}"` : '❌ MISSING');
            console.log('  ✓ testResultId:', testResultId ? `"${testResultId}"` : '❌ MISSING');
            console.log('  ✓ email:', participantEmail ? `"${participantEmail}"` : '❌ MISSING');
            console.log('  ✓ token:', token ? `"${token}"` : '❌ MISSING');
            console.log('=== END URL DEBUG ===');
            
            if (!userName || !testId || !testResultId || !participantEmail || !token) {
                const missingParams = [];
                if (!userName) missingParams.push('name');
                if (!testId) missingParams.push('testId');
                if (!testResultId) missingParams.push('testResultId');
                if (!participantEmail) missingParams.push('email');
                if (!token) missingParams.push('token');
                
                setError(`Invalid invitation link - missing required parameters: ${missingParams.join(', ')}`);
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
            const testDef = getTestById(invitationData.testId);
            if (testDef) {
                setTestDefinition(testDef);
            } else {
                setError('Test not found');
            }
        } catch (err) {
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
            const aggregatedKey = `aggregated_feedback_${invitation.testResultId}`;
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
            <main className="flex min-h-screen items-center justify-center p-8">
                <div className="text-center max-w-2xl">
                    <div className="text-green-500 text-6xl mb-4">✅</div>
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">
                        {t('feedback360.ui.thank_you') || '감사합니다!'}
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        {(t('feedback360.ui.submitted_message') || '{name}을 위한 피드백이 성공적으로 제출되었습니다.').replace('{name}', invitation?.inviterName || '')}
                    </p>
                    <p className="text-gray-500">
                        {(t('feedback360.ui.submitted_description') || '{name}은 귀하의 통찰력을 받게 되며, 귀하의 신원은 완전히 익명으로 유지됩니다.').replace('{name}', invitation?.inviterName || '')}
                    </p>
                </div>
            </main>
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

    // Debug: Log critical values
    console.log('Render debug:', { 
        locale, 
        currentLanguage, 
        isKorean, 
        titleText: getLocalizedText('feedback360.ui.title', 'Feedback Request', '피드백 요청')
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">
                        {t('feedback360.ui.title') || '피드백 요청'}
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        {isKorean 
                            ? `${invitation.inviterName}이 피드백을 요청했습니다`
                            : `${invitation.inviterName} has asked for your feedback`
                        }
                    </p>
                    <p className="text-gray-500 mb-6">
                        {t('feedback360.ui.instructions') || '다음 질문들에 솔직하게 답변해 주세요. 귀하의 응답은 익명으로 처리됩니다.'}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / testDefinition.questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {isKorean 
                            ? `질문 ${currentQuestionIndex + 1}/${testDefinition.questions.length}`
                            : `Question ${currentQuestionIndex + 1} of ${testDefinition.questions.length}`
                        }
                    </p>
                </div>

                <div className="p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900" data-translate={currentQuestion.text_key}>
                        {t(currentQuestion.text_key) || currentQuestion.text_key}
                    </h2>
                    
                    <p className="text-sm text-gray-500 mb-6">
                        {isKorean 
                            ? `이 질문에 답할 때 ${invitation.inviterName}을 생각해 주세요.`
                            : `Think about ${invitation.inviterName} when answering this question.`
                        }
                    </p>

                    {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                        <div className="flex flex-col gap-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option.value)}
                                    className="w-full p-4 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                    data-translate={option.text_key}
                                >
                                    {t(option.text_key) || option.text_key}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentQuestion.type === 'scale' && currentQuestion.scale && (
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>
                                    {t('feedback360.ui.scale_labels.not_at_all') || '전혀 그렇지 않다'}
                                </span>
                                <span>
                                    {t('feedback360.ui.scale_labels.always') || '매우 그렇다'}
                                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                                {Array.from({ length: currentQuestion.scale.max - currentQuestion.scale.min + 1 }, (_, i) => {
                                    const value = currentQuestion.scale!.min + i;
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => handleAnswer(value)}
                                            className="flex-1 py-3 text-center bg-gray-50 border border-gray-300 rounded hover:bg-blue-100 hover:border-blue-300 transition-colors"
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                            currentQuestionIndex === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        ← {isKorean ? '이전' : 'Previous'}
                    </button>
                    
                    <span className="text-sm text-gray-500">
                        {currentQuestionIndex + 1} / {testDefinition.questions.length}
                    </span>
                    
                    <div className="w-20"></div> {/* Spacer to center the progress */}
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">
                    <p>
                        {isKorean 
                            ? `이 피드백은 완전히 익명입니다. ${invitation.inviterName}은 종합 결과만 볼 수 있으며 개별 응답이나 응답자가 누구인지는 알 수 없습니다.`
                            : `This feedback is completely anonymous. ${invitation.inviterName} will see aggregated results but not individual responses or who provided them.`
                        }
                    </p>
                </div>
            </div>
        </main>
    );
}
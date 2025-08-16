"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/components/providers/translation-provider";
import { getTestById, TestDefinition } from "@/lib/test-definitions";


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
    const { t } = useTranslation();
    const params = useParams();
    const searchParams = useSearchParams();
    
    const invitationId = params.invitationId as string;
    const token = searchParams.get('token') || '';
    
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
            // Get invitation data from URL parameters
            const userName = searchParams.get('name');
            const testId = searchParams.get('testId');
            const testResultId = searchParams.get('testResultId');
            const participantEmail = searchParams.get('email');
            
            // Debug: Log all parameters
            console.log('Debug parameters:', {
                userName,
                testId,
                testResultId,
                participantEmail,
                token,
                allParams: searchParams.toString()
            });
            
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
                    <p className="mt-4 text-lg">{t('tests.feedback360.ui.loading')}</p>
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
                        Thank You!
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Your feedback about <strong>{invitation?.inviterName}</strong> has been submitted successfully.
                    </p>
                    <p className="text-gray-500">
                        {invitation?.inviterName} will be notified that you've provided feedback. 
                        Your responses will remain anonymous and help them gain valuable insights 
                        about their personality and behavior.
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
                    <p className="mt-4 text-lg">Submitting your feedback...</p>
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

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
            <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">
                        {t('tests.feedback360.ui.title')}
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        {t('tests.feedback360.ui.request_message', { name: invitation.inviterName })}
                    </p>
                    <p className="text-gray-500 mb-6">
                        {t('tests.feedback360.ui.instructions')}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / testDefinition.questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {t('tests.feedback360.ui.question_progress', { current: currentQuestionIndex + 1, total: testDefinition.questions.length })}
                    </p>
                </div>

                <div className="p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900" data-translate={currentQuestion.text_key}>
                        {t(currentQuestion.text_key) || currentQuestion.text_key}
                    </h2>
                    
                    <p className="text-sm text-gray-500 mb-6">
                        {t('tests.feedback360.ui.think_about', { name: invitation.inviterName })}
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
                                <span data-translate={currentQuestion.scale.minLabel_key}>
                                    {t(currentQuestion.scale.minLabel_key) || currentQuestion.scale.minLabel_key}
                                </span>
                                <span data-translate={currentQuestion.scale.maxLabel_key}>
                                    {t(currentQuestion.scale.maxLabel_key) || currentQuestion.scale.maxLabel_key}
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

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>
                        {t('tests.feedback360.ui.anonymous_notice', { name: invitation.inviterName })}
                    </p>
                </div>
            </div>
        </main>
    );
}
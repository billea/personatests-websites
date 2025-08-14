"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/components/providers/translation-provider";
import { getTestById, TestDefinition } from "@/lib/test-definitions";
import { submitFeedback } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";


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
    const router = useRouter();
    
    const invitationId = params.invitationId as string;
    const token = searchParams.get('token') || '';

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
            const invitationDoc = await getDoc(doc(firestore, "invitations", invitationId));
            
            if (!invitationDoc.exists()) {
                setError('Invitation not found');
                setLoading(false);
                return;
            }

            const invitationData = { id: invitationDoc.id, ...invitationDoc.data() } as InvitationData;
            
            if (invitationData.invitationToken !== token) {
                setError('Invalid invitation link');
                setLoading(false);
                return;
            }

            if (invitationData.status === 'completed') {
                setError('This feedback has already been submitted');
                setLoading(false);
                return;
            }

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

            await submitFeedback(
                invitationId,
                {
                    answers: finalAnswers,
                    result: result,
                    submittedAt: new Date().toISOString(),
                    aboutPerson: invitation.inviterName
                },
                token
            );

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
                    <p className="mt-4 text-lg">Loading feedback form...</p>
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
                        Feedback Request
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        <strong>{invitation.inviterName}</strong> has asked for your feedback
                    </p>
                    <p className="text-gray-500 mb-6">
                        Please answer the following questions about them honestly. Your responses will remain anonymous.
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / testDefinition.questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Question {currentQuestionIndex + 1} of {testDefinition.questions.length}
                    </p>
                </div>

                <div className="p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900" data-translate={currentQuestion.text_key}>
                        {t(currentQuestion.text_key) || currentQuestion.text_key}
                    </h2>
                    
                    <p className="text-sm text-gray-500 mb-6">
                        Think about <strong>{invitation.inviterName}</strong> when answering this question.
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
                        This feedback is completely anonymous. {invitation.inviterName} will see 
                        aggregated results but not individual responses or who provided them.
                    </p>
                </div>
            </div>
        </main>
    );
}
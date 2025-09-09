"use client";

import { useSearchParams } from "next/navigation";
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
    const { t, currentLanguage } = useTranslation();
    const searchParams = useSearchParams();
    
    const invitationId = searchParams.get('invitationId') || '';
    const token = searchParams.get('token') || '';
    
    const isKorean = currentLanguage === 'ko';
    
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
            let userName = searchParams.get('name');
            let testId = searchParams.get('testId');
            let testResultId = searchParams.get('testResultId');
            let participantEmail = searchParams.get('email');
            
            if (!userName || !testId || !testResultId || !participantEmail || !token || !invitationId) {
                setError('Invalid invitation link - missing parameters');
                setLoading(false);
                return;
            }

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

            const testDef: TestDefinition | undefined = getTestById(invitationData.testId);
            if (testDef) {
                setTestDefinition(testDef);
            } else {
                setError('Test not found');
            }
        } catch (err: unknown) {
            setError('Failed to load invitation');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answer: any) => {
        if (!testDefinition) return;
        const currentQuestion = testDefinition.questions[currentQuestionIndex];
        const newAnswers = { ...answers, [currentQuestion.id]: answer };
        setAnswers(newAnswers);

        if (currentQuestionIndex < testDefinition.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
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
            const result = testDefinition.scoring(finalAnswers);
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

            const existingFeedback = JSON.parse(localStorage.getItem('submitted_feedback') || '[]');
            existingFeedback.push(feedbackData);
            localStorage.setItem('submitted_feedback', JSON.stringify(existingFeedback));

            const aggregatedKey = 'aggregated_feedback_' + invitation.testResultId;
            const existingAggregated = JSON.parse(localStorage.getItem(aggregatedKey) || '[]');
            existingAggregated.push({
                result: result,
                submittedAt: feedbackData.submittedAt,
                feedbackId: invitationId
            });
            localStorage.setItem(aggregatedKey, JSON.stringify(existingAggregated));

            setSubmitted(true);
        } catch (error) {
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
                    <p className="mt-4 text-lg">Loading...</p>
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
                            {isKorean ? '감사합니다!' : 'Thank You!'}
                        </h1>
                        <p className="text-lg text-white/90 mb-6">
                            {isKorean 
                                ? (invitation?.inviterName || '') + '님을 위한 피드백이 성공적으로 제출되었습니다.'
                                : 'Your feedback for ' + (invitation?.inviterName || '') + ' has been successfully submitted.'
                            }
                        </p>
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
                    <p className="mt-4 text-lg">Submitting...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
            <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <div className="mb-6 p-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-lg">
                        <h1 className="text-2xl font-bold text-white mb-4 text-center">
                            🎯 {isKorean ? '피드백 요청' : 'Feedback Request'}
                        </h1>
                        <p className="text-white/90 mb-6 text-lg text-center">
                            {isKorean 
                                ? invitation.inviterName + '님이 피드백을 요청했습니다'
                                : invitation.inviterName + ' has asked for your feedback'
                            }
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
                    <h2 className="mb-6 text-xl font-semibold tracking-tight text-white">
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
                                >
                                    {t(option.text_key) || option.text_key}
                                </button>
                            ))}
                        </div>
                    )}

                    {currentQuestion.type === 'scale' && currentQuestion.scale && (
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-white/80">
                                <span>{isKorean ? '전혀 그렇지 않다' : 'Not at all'}</span>
                                <span>{isKorean ? '매우 그렇다' : 'Always'}</span>
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
    );
}
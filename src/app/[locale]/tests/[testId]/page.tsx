"use client";

import Link from "next/link";
import { useTranslation } from "@/components/providers/translation-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getTestById, TestQuestion, TestDefinition } from "@/lib/test-definitions";
import { saveTestResult, sendFeedbackInvitations } from "@/lib/firestore";
import EmailSignup from "@/components/EmailSignup";

export default function TestPage() {
    const { t, currentLanguage } = useTranslation();
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const testId = params.testId as string;

    const [testDefinition, setTestDefinition] = useState<TestDefinition | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
    const [testCompleted, setTestCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testResultId, setTestResultId] = useState<string | null>(null);
    const [feedbackEmails, setFeedbackEmails] = useState<string[]>(['']);
    const [completedTestResult, setCompletedTestResult] = useState<any>(null);

    // Load test definition
    useEffect(() => {
        const definition = getTestById(testId);
        if (definition) {
            setTestDefinition(definition);
            setLoading(false);
        } else {
            console.error(`Test ${testId} not found`);
            router.push(`/${currentLanguage}/tests`);
        }
    }, [testId, currentLanguage, router]);

    const handleAnswer = (answer: any) => {
        const currentQuestion = testDefinition?.questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const newAnswers = {
            ...answers,
            [currentQuestion.id]: answer
        };
        setAnswers(newAnswers);

        if (currentQuestionIndex < testDefinition.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // End of the test
            processTestCompletion(newAnswers);
        }
    };

    const processTestCompletion = async (finalAnswers: { [questionId: string]: any }) => {
        if (!testDefinition) {
            console.error("Test definition must be available");
            return;
        }

        setSaving(true);
        try {
            // Score the test
            const testResult = testDefinition.scoring(finalAnswers);
            
            // Store the result for display
            setCompletedTestResult(testResult);
            
            // Save to local storage for anonymous users
            const localResult = {
                testId,
                answers: finalAnswers,
                result: testResult,
                completedAt: new Date().toISOString()
            };
            
            let resultId = 'local_' + Date.now();
            
            // If user is logged in, save to Firestore
            if (user) {
                try {
                    resultId = await saveTestResult(
                        user.uid,
                        testId,
                        localResult,
                        false
                    );
                    console.log("Test saved to Firestore successfully!");
                } catch (error) {
                    console.error("Error saving to Firestore, keeping local result:", error);
                }
            } else {
                // Save to localStorage for anonymous users
                localStorage.setItem(`test_result_${resultId}`, JSON.stringify(localResult));
                console.log("Test saved locally successfully!");
            }

            setTestResultId(resultId);
            setTestCompleted(true);
            console.log("Test completed successfully!");
        } catch (error) {
            console.error("Error processing test completion:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleSendFeedbackInvitations = async () => {
        if (!testResultId || !testDefinition) return;

        const validEmails = feedbackEmails.filter(email => 
            email.trim() && email.includes('@')
        );

        if (validEmails.length === 0) {
            alert('Please enter at least one valid email address');
            return;
        }

        try {
            setSaving(true);
            await sendFeedbackInvitations(testId, testResultId, validEmails);
            alert(`Feedback invitations sent to ${validEmails.length} people!`);
            router.push(`/${currentLanguage}/results`);
        } catch (error) {
            console.error('Error sending invitations:', error);
            alert('Error sending invitations. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const addEmailField = () => {
        setFeedbackEmails([...feedbackEmails, '']);
    };

    const updateEmail = (index: number, email: string) => {
        const newEmails = [...feedbackEmails];
        newEmails[index] = email;
        setFeedbackEmails(newEmails);
    };

    const removeEmailField = (index: number) => {
        if (feedbackEmails.length > 1) {
            setFeedbackEmails(feedbackEmails.filter((_, i) => i !== index));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-lg text-white">Loading test...</p>
                </div>
            </div>
        );
    }

    if (!testDefinition) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center">
                <div className="text-center p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-4 text-white">Test Not Found</h1>
                    <button
                        onClick={() => router.push(`/${currentLanguage}/tests`)}
                        className="p-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all"
                    >
                        Back to Tests
                    </button>
                </div>
            </div>
        );
    }

    if (testCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
                <div className="text-center w-full max-w-2xl p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4 text-white" data-translate="test.completed_title">
                        {t('test.completed_title') || 'Test Completed!'}
                    </h1>
                    
                    {/* Show Results Immediately */}
                    {completedTestResult && (
                        <div className="mb-8 p-6 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4 text-white">Your Personality Type</h2>
                            {completedTestResult.type && (
                                <div className="text-3xl font-bold text-yellow-300 mb-4">
                                    {completedTestResult.type}
                                </div>
                            )}
                            
                            {completedTestResult.scores && (
                                <div className="grid grid-cols-2 gap-4 text-white">
                                    {Object.entries(completedTestResult.scores).map(([dimension, percentage]) => (
                                        <div key={dimension} className="bg-white/20 p-3 rounded">
                                            <div className="font-semibold">{dimension}</div>
                                            <div className="text-xl">{String(percentage)}%</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Optional Email Signup */}
                    <EmailSignup 
                        testType={testId} 
                        personalityType={completedTestResult?.type}
                    />

                    {testDefinition.requiresFeedback && (
                        <div className="mb-8 p-6 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                            <h2 className="text-xl font-bold mb-4" data-translate="test.invite_feedback_title">
                                {t('test.invite_feedback_title') || 'Invite Others for Feedback'}
                            </h2>
                            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400" data-translate="test.invite_feedback_description">
                                {t('test.invite_feedback_description') || 'Get a complete picture by inviting friends and colleagues to provide feedback about you.'}
                            </p>
                            
                            <div className="space-y-3 mb-4">
                                {feedbackEmails.map((email, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => updateEmail(index, e.target.value)}
                                            placeholder="Enter email address"
                                            className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                                        />
                                        {feedbackEmails.length > 1 && (
                                            <button
                                                onClick={() => removeEmailField(index)}
                                                className="p-2 text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex gap-2 justify-center mb-4">
                                <button
                                    onClick={addEmailField}
                                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Add Another Email
                                </button>
                                <button
                                    onClick={handleSendFeedbackInvitations}
                                    disabled={saving}
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {saving ? 'Sending...' : 'Send Invitations'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => router.push(`/${currentLanguage}/tests`)}
                            className="p-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all text-xl"
                            data-translate="test.take_another"
                        >
                            {t('test.take_another') || 'Take Another Test'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (saving) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-lg text-white">Saving your results...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = testDefinition.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
            <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-white" data-translate={testDefinition.title_key}>
                        {t(testDefinition.title_key) || testDefinition.title_key}
                    </h1>
                    <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 mb-2">
                        <div
                            className="bg-gradient-to-r from-yellow-300 to-orange-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${((currentQuestionIndex + 1) / testDefinition.questions.length) * 100}%` }}
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
            </div>
        </div>
    );
}
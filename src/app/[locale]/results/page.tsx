"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/components/providers/translation-provider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    getUserTestResults, 
    getPendingInvitations, 
    getFeedbackForResult,
    TestResult,
    TestInvitation,
    FeedbackSubmission 
} from "@/lib/firestore";
import { getTestById } from "@/lib/test-definitions";

export default function ResultsPage() {
    const { user, loading } = useAuth();
    const { t, currentLanguage } = useTranslation();
    const [results, setResults] = useState<TestResult[]>([]);
    const [invitations, setInvitations] = useState<TestInvitation[]>([]);
    const [feedback, setFeedback] = useState<{ [resultId: string]: FeedbackSubmission[] }>({});
    const [resultsLoading, setResultsLoading] = useState(true);
    const [selectedResultId, setSelectedResultId] = useState<string | null>(null);

    useEffect(() => {
        if (user && !loading) {
            loadData();
        } else if (!loading) {
            loadLocalResults();
        }
    }, [user, loading]);

    const loadData = async () => {
        if (!user) return;
        
        try {
            // Load all user data in parallel
            const [userResults, pendingInvitations] = await Promise.all([
                getUserTestResults(user.uid),
                getPendingInvitations(user.uid)
            ]);

            setResults(userResults);
            setInvitations(pendingInvitations);

            // Load feedback for each result
            const feedbackData: { [resultId: string]: FeedbackSubmission[] } = {};
            await Promise.all(
                userResults.map(async (result) => {
                    if (result.id) {
                        const resultFeedback = await getFeedbackForResult(result.id);
                        feedbackData[result.id] = resultFeedback;
                    }
                })
            );
            setFeedback(feedbackData);

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setResultsLoading(false);
        }
    };

    const loadLocalResults = () => {
        try {
            const localResults: TestResult[] = [];
            const localFeedback: { [resultId: string]: any[] } = {};
            
            // Check localStorage for test results
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('test_result_local_')) {
                    const resultData = localStorage.getItem(key);
                    if (resultData) {
                        const parsedResult = JSON.parse(resultData);
                        
                        // Convert to TestResult format
                        const testResult: TestResult = {
                            id: key.replace('test_result_', ''),
                            userId: 'anonymous',
                            testId: parsedResult.testId,
                            resultPayload: {
                                answers: parsedResult.answers,
                                result: parsedResult.result
                            },
                            createdAt: parsedResult.completedAt,
                            isPublic: false
                        };
                        
                        localResults.push(testResult);
                        
                        // Load aggregated feedback for this result
                        if (testResult.id) {
                            const aggregatedKey = `aggregated_feedback_${testResult.id}`;
                            const aggregatedData = localStorage.getItem(aggregatedKey);
                            if (aggregatedData) {
                                try {
                                    const feedbackArray = JSON.parse(aggregatedData);
                                    localFeedback[testResult.id] = feedbackArray;
                                    console.log(`Found ${feedbackArray.length} feedback entries for result ${testResult.id}`);
                                } catch (error) {
                                    console.error('Error parsing aggregated feedback:', error);
                                }
                            }
                        }
                    }
                }
            }
            
            // Sort by completion date (newest first)
            localResults.sort((a, b) => {
                const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt?.toDate?.() || new Date();
                const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt?.toDate?.() || new Date();
                return dateB.getTime() - dateA.getTime();
            });
            
            setResults(localResults);
            setFeedback(localFeedback);
        } catch (error) {
            console.error("Error loading local results:", error);
        } finally {
            setResultsLoading(false);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Unknown date";
        
        // Handle Firebase timestamp
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString(currentLanguage, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTestName = (testId: string) => {
        const testDef = getTestById(testId);
        return testDef ? (t(testDef.title_key) || testDef.title_key) : testId;
    };

    const renderTestResult = (result: TestResult) => {
        const testDef = getTestById(result.testId);
        const hasAnswers = result.resultPayload?.answers;
        const hasResult = result.resultPayload?.result;
        const resultFeedback = result.id ? (feedback[result.id] || []) : [];

        return (
            <div key={result.id} className="p-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-white">
                            {getTestName(result.testId)}
                        </h3>
                        <p className="text-white/80">
                            Completed on {formatDate(result.createdAt)}
                        </p>
                        <div className="flex gap-4 text-sm text-white/70 mt-1">
                            <span>Questions: {Object.keys(hasAnswers || {}).length}</span>
                            {resultFeedback.length > 0 && (
                                <span className="text-green-600">
                                    Feedback: {resultFeedback.length} responses
                                </span>
                            )}
                            {testDef?.requiresFeedback && (
                                <span className="text-blue-600">Feedback-enabled</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setSelectedResultId(
                                selectedResultId === result.id ? null : result.id!
                            )}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                        >
                            {selectedResultId === result.id ? 'Hide Details' : 'View Details'}
                        </button>
                    </div>
                </div>

                {selectedResultId === result.id && (
                    <div className="mt-4 space-y-4">
                        {/* Test Results */}
                        {hasResult && (
                            <div className="p-4 bg-green-50 rounded dark:bg-green-900/20">
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Your Results:</h4>
                                <div className="space-y-2">
                                    {hasResult.type && (
                                        <p className="text-lg font-medium text-green-700 dark:text-green-300">
                                            Type: {hasResult.type}
                                        </p>
                                    )}
                                    {hasResult.scores && (
                                        <div className="space-y-2">
                                            {/* Display MBTI percentages if available */}
                                            {hasResult.scores.percentages && (
                                                <div>
                                                    <h5 className="font-medium text-sm mb-1">Dimension Percentages:</h5>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {Object.entries(hasResult.scores.percentages).map(([key, value]) => (
                                                            <div key={key} className="text-sm">
                                                                <span className="font-medium">{key}:</span> {typeof value === 'number' ? `${value}%` : String(value)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Display raw scores if available */}
                                            {hasResult.scores && !hasResult.scores.percentages && (
                                                <div>
                                                    <h5 className="font-medium text-sm mb-1">Scores:</h5>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {Object.entries(hasResult.scores)
                                                            .filter(([key, value]) => typeof value === 'number' || typeof value === 'string')
                                                            .map(([key, value]) => (
                                                                <div key={key} className="text-sm">
                                                                    <span className="font-medium">{key}:</span> {String(value)}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {hasResult.traits && (
                                        <p className="text-sm">
                                            <span className="font-medium">Traits:</span> {hasResult.traits.join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Feedback Summary */}
                        {resultFeedback.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded dark:bg-blue-900/20">
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                    Feedback Summary ({resultFeedback.length} responses):
                                </h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {resultFeedback.map((fb, index) => (
                                        <div key={index} className="text-sm p-2 bg-white rounded dark:bg-gray-800">
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Submitted: {formatDate(fb.submittedAt)}
                                            </p>
                                            {/* Feedback content would be displayed based on the feedback structure */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Detailed Answers */}
                        {hasAnswers && (
                            <div className="p-4 bg-gray-50 rounded dark:bg-gray-700">
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Your Answers:</h4>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {Object.entries(hasAnswers).map(([questionId, answer]) => (
                                        <div key={questionId} className="text-sm">
                                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                                {questionId}: 
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400 ml-4">
                                                → {String(answer)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (loading || resultsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-lg text-white">Loading your results...</p>
                </div>
            </div>
        );
    }

    // Show signin message only if no local results exist
    if (!user && results.length === 0 && !resultsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
                <div className="text-center p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4 text-white" data-translate="results.signin_required_title">
                        {t('results.signin_required_title') || 'Sign In Required'}
                    </h1>
                    <p className="text-lg mb-8 text-white/90" data-translate="results.signin_required_message">
                        {t('results.signin_required_message') || 'You need to be signed in to view your test results.'}
                    </p>
                    <Link href={`/${currentLanguage}`}>
                        <button className="p-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all">
                            {t('results.go_to_homepage') || 'Go to Homepage'}
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600">
            <div className="w-full max-w-6xl">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-white" data-translate="results.page_title">
                        {t('results.page_title') || 'My Test Results'}
                    </h1>
                    <div className="flex gap-2">
                        <Link href={`/${currentLanguage}/tests`}>
                            <button className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded hover:bg-white/30 hover:scale-105 transition-all duration-300">
                                {t('results.take_test') || 'Take Another Test'}
                            </button>
                        </Link>
                        <Link href={`/${currentLanguage}`}>
                            <button className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded hover:bg-white/30 hover:scale-105 transition-all duration-300">
                                {t('results.back_home') || 'Back to Home'}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                    <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                        <h2 className="text-xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
                            {t('results.pending_invitations') || 'Pending Feedback Invitations'}
                        </h2>
                        <div className="space-y-2">
                            {invitations.map((invitation) => (
                                <div key={invitation.id} className="flex justify-between items-center p-3 bg-white rounded dark:bg-gray-800">
                                    <div>
                                        <p className="font-medium">{getTestName(invitation.testId)}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Sent to: {invitation.participantEmail}
                                        </p>
                                    </div>
                                    <span className="text-sm text-yellow-600 dark:text-yellow-400">
                                        {t('results.waiting_response') || 'Waiting for response'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg dark:bg-gray-800">
                        <h2 className="text-2xl font-semibold mb-4" data-translate="results.no_results_title">
                            {t('results.no_results_title') || 'No Test Results Yet'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6" data-translate="results.no_results_message">
                            {t('results.no_results_message') || 'You haven\'t completed any tests yet. Take your first personality test to see results here!'}
                        </p>
                        <Link href={`/${currentLanguage}/tests`}>
                            <button className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600" data-translate="results.take_first_test">
                                {t('results.take_first_test') || 'Take a Test'}
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t('results.total_completed') || 'Total tests completed'}: <span className="font-semibold">{results.length}</span>
                        </div>
                        
                        {results.map((result) => renderTestResult(result))}
                    </div>
                )}
            </div>
        </main>
    );
}
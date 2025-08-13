"use client";

import Link from "next/link";
import { useTranslation } from "@/components/providers/translation-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getTestById, TestQuestion, TestDefinition, personalizeQuestions } from "@/lib/test-definitions";
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
    const [userName, setUserName] = useState<string>('');
    const [nameInputValue, setNameInputValue] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [completedTestResult, setCompletedTestResult] = useState<any>(null);
    const [hasInProgressTest, setHasInProgressTest] = useState(false);
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const [showNameInput, setShowNameInput] = useState(false);

    // Generate unique progress key for this test session
    const getProgressKey = () => `test_progress_${testId}_${user?.uid || 'anonymous'}`;
    
    // Save test progress to localStorage
    const saveTestProgress = (questionIndex: number, currentAnswers: { [questionId: string]: any }) => {
        const progressData = {
            testId,
            questionIndex,
            answers: currentAnswers,
            timestamp: new Date().toISOString(),
            totalQuestions: testDefinition?.questions.length || 0
        };
        
        try {
            localStorage.setItem(getProgressKey(), JSON.stringify(progressData));
            console.log(`Progress saved: Question ${questionIndex + 1}/${testDefinition?.questions.length || 0}`);
        } catch (error) {
            console.error('Error saving test progress:', error);
        }
    };
    
    // Load saved test progress from localStorage
    const loadTestProgress = () => {
        try {
            const savedProgress = localStorage.getItem(getProgressKey());
            if (savedProgress) {
                const progressData = JSON.parse(savedProgress);
                
                // Validate the saved data
                if (progressData.testId === testId && progressData.answers) {
                    return {
                        questionIndex: progressData.questionIndex || 0,
                        answers: progressData.answers || {},
                        timestamp: progressData.timestamp,
                        totalQuestions: progressData.totalQuestions
                    };
                }
            }
        } catch (error) {
            console.error('Error loading test progress:', error);
        }
        return null;
    };
    
    // Format name based on cultural context
    const getFormattedName = (inputName: string) => {
        if (!inputName.trim()) return '';
        
        const name = inputName.trim();
        
        switch (currentLanguage) {
            case 'ko':
                // Korean: Add 님 honorific if not already present
                return name.endsWith('님') ? name : `${name}님`;
            case 'ja':
                // Japanese: Add さん honorific if not already present
                return name.endsWith('さん') || name.endsWith('様') || name.endsWith('君') || name.endsWith('ちゃん') ? 
                       name : `${name}さん`;
            case 'zh':
                // Chinese: Use name as-is (cultural context varies)
                return name;
            default:
                // Western: Use first name only if full name provided
                const nameParts = name.split(' ');
                return nameParts[0];
        }
    };

    // Format name from separate first/last name parts
    const getFormattedNameFromParts = (lastNamePart: string, firstNamePart: string) => {
        if (!lastNamePart.trim() && !firstNamePart.trim()) return '';
        
        const cleanLast = lastNamePart.trim();
        const cleanFirst = firstNamePart.trim();
        
        switch (currentLanguage) {
            case 'ko':
            case 'ja':
            case 'zh':
                // Asian names: Last name + First name
                const fullName = cleanLast + cleanFirst;
                return getFormattedName(fullName);
            default:
                // Western names: Use first name only
                return cleanFirst || cleanLast;
        }
    };

    // Clear saved test progress
    const clearTestProgress = () => {
        try {
            localStorage.removeItem(getProgressKey());
            console.log('Test progress cleared');
        } catch (error) {
            console.error('Error clearing test progress:', error);
        }
    };
    
    // Resume from saved progress
    const resumeFromProgress = () => {
        const savedProgress = loadTestProgress();
        if (savedProgress) {
            setCurrentQuestionIndex(savedProgress.questionIndex);
            setAnswers(savedProgress.answers);
            setHasInProgressTest(false);
            setShowResumePrompt(false);
            console.log(`Resumed from question ${savedProgress.questionIndex + 1}`);
        }
    };
    
    // Start fresh test
    const startFreshTest = () => {
        clearTestProgress();
        setCurrentQuestionIndex(0);
        setAnswers({});
        setHasInProgressTest(false);
        setShowResumePrompt(false);
        console.log('Started fresh test');
    };

    // Load test definition and check for saved progress
    useEffect(() => {
        const definition = getTestById(testId);
        if (definition) {
            setTestDefinition(definition);
            
            // Check for saved progress
            const savedProgress = loadTestProgress();
            if (savedProgress && Object.keys(savedProgress.answers).length > 0) {
                setHasInProgressTest(true);
                setShowResumePrompt(true);
                console.log(`Found saved progress: ${Object.keys(savedProgress.answers).length} answers, question ${savedProgress.questionIndex + 1}`);
            }
            
            // For 360-degree test, show name input first
            if (testId === 'feedback-360' && !userName && !hasInProgressTest) {
                console.log('Setting showNameInput to true for 360-degree test');
                setShowNameInput(true);
            } else {
                console.log('Name input conditions:', { testId, userName, hasInProgressTest });
            }
            
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
            const nextQuestionIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextQuestionIndex);
            
            // Save progress after each answer
            saveTestProgress(nextQuestionIndex, newAnswers);
        } else {
            // End of the test - clear progress as test is complete
            clearTestProgress();
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

        if (!userName.trim()) {
            alert('Please enter your name so friends know who they\'re giving feedback about');
            return;
        }

        if (validEmails.length === 0) {
            alert('Please enter at least one valid email address');
            return;
        }

        try {
            setSaving(true);
            await sendFeedbackInvitations(testId, testResultId, validEmails, userName.trim());
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

    // FORCE name input for 360-degree test - DEBUG VERSION
    if (testId === 'feedback-360' && !userName) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
                <div className="w-full max-w-2xl p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg text-center">
                    <h1 className="text-3xl font-bold mb-4 text-white">
                        🌟 360° Feedback Assessment
                    </h1>
                    <p className="text-lg text-white/90 mb-6">
                        {currentLanguage === 'ko' ? 
                            '이 평가는 다른 사람들이 당신을 어떻게 보는지 이해하는 데 도움이 됩니다. 가족, 친구, 동료들이 당신에 대해 개인적으로 질문에 답변합니다.' :
                         currentLanguage === 'ja' ? 
                            'この評価は、他の人があなたをどう見ているかを理解するのに役立ちます。家族、友人、同僚があなたについて個人的に質問に答えます。' :
                         currentLanguage === 'zh' ? 
                            '这项评估帮助您了解别人如何看待您。家人、朋友和同事将对您个人回答问题。' :
                            'This assessment helps you understand how others see you. Friends, family, and colleagues will answer questions about you personally.'
                        }
                    </p>
                    
                    <div className="mb-6">
                        <label className="block text-lg font-medium mb-3 text-white">
                            {currentLanguage === 'ko' ? '이름을 입력해 주세요' : 
                             currentLanguage === 'ja' ? 'お名前を入力してください' :
                             'What should we call you?'}
                        </label>
                        
                        {/* Cultural examples */}
                        <div className="mb-4 p-3 bg-white/10 rounded-lg text-sm text-white/70">
                            <p className="font-medium mb-2">
                                {currentLanguage === 'ko' ? '예시:' : 
                                 currentLanguage === 'ja' ? '例:' : 'Examples:'}
                            </p>
                            <div className="text-xs">
                                {currentLanguage === 'ko' ? (
                                    <div>• 성: 김, 이름: 철수</div>
                                ) : currentLanguage === 'ja' ? (
                                    <div>• 姓: 田中, 名: 太郎</div>
                                ) : currentLanguage === 'zh' ? (
                                    <div>• 姓: 王, 名: 小明</div>
                                ) : (
                                    <div>• First: Sarah, Last: Johnson</div>
                                )}
                            </div>
                        </div>

                        {/* Name Input Fields */}
                        <div className="space-y-3 mb-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-white/80">
                                        {currentLanguage === 'ko' ? '성 (姓)' : 
                                         currentLanguage === 'ja' ? '姓' :
                                         currentLanguage === 'zh' ? '姓' : 'Last Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder={
                                            currentLanguage === 'ko' ? '김' :
                                            currentLanguage === 'ja' ? '田中' :
                                            currentLanguage === 'zh' ? '王' :
                                            'Johnson'
                                        }
                                        className="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-white/80">
                                        {currentLanguage === 'ko' ? '이름 (名)' : 
                                         currentLanguage === 'ja' ? '名' :
                                         currentLanguage === 'zh' ? '名' : 'First Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder={
                                            currentLanguage === 'ko' ? '철수' :
                                            currentLanguage === 'ja' ? '太郎' :
                                            currentLanguage === 'zh' ? '小明' :
                                            'Sarah'
                                        }
                                        className="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-sm text-white/60 mt-2">
                            {currentLanguage === 'ko' ? 
                                `질문 예시: "${getFormattedNameFromParts(lastName, firstName) || '김철수님'}은(는) 사람들의 마음을 사로잡는 것을 잘하나요?"` :
                             currentLanguage === 'ja' ? 
                                `質問例: "${getFormattedNameFromParts(lastName, firstName) || '田中さん'}は人を説得するのが上手ですか？"` :
                                `Questions will be like: "Is ${getFormattedNameFromParts(lastName, firstName) || 'your name'} good at getting people excited about their ideas?"`
                            }
                        </p>
                    </div>
                    
                    <button
                        onClick={() => {
                            if (lastName.trim() || firstName.trim()) {
                                setUserName(getFormattedNameFromParts(lastName, firstName));
                                setShowNameInput(false);
                            } else {
                                alert(currentLanguage === 'ko' ? '이름을 입력해 주세요' : 
                                     currentLanguage === 'ja' ? '名前を入力してください' : 
                                     'Please enter your name to continue');
                            }
                        }}
                        disabled={!lastName.trim() && !firstName.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Assessment ✨
                    </button>
                    
                    <div className="mt-6">
                        <button
                            onClick={() => router.push(`/${currentLanguage}/tests`)}
                            className="text-white/60 hover:text-white/80 text-sm underline"
                        >
                            Back to Tests
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show resume prompt if saved progress exists
    if (showResumePrompt && hasInProgressTest) {
        const savedProgress = loadTestProgress();
        const progressPercentage = savedProgress ? Math.round((Object.keys(savedProgress.answers).length / (savedProgress.totalQuestions || 1)) * 100) : 0;
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center p-8">
                <div className="w-full max-w-2xl p-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg text-center">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-4 text-white">
                            🔄 Resume Your Test?
                        </h1>
                        <p className="text-lg text-white/90 mb-2">
                            You have a test in progress for <strong>{t(testDefinition.title_key) || testDefinition.title_key}</strong>
                        </p>
                        <p className="text-white/80 mb-6">
                            You've completed {Object.keys(savedProgress?.answers || {}).length} out of {testDefinition.questions.length} questions
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-white/20 rounded-full h-4 mb-6">
                            <div
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        
                        <p className="text-sm text-white/70 mb-8">
                            {savedProgress?.timestamp && 
                                `Last updated: ${new Date(savedProgress.timestamp).toLocaleString()}`
                            }
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={resumeFromProgress}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-lg"
                        >
                            🚀 Resume Test ({progressPercentage}% complete)
                        </button>
                        
                        <button
                            onClick={startFreshTest}
                            className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
                        >
                            🔄 Start Fresh
                        </button>
                    </div>
                    
                    <div className="mt-6">
                        <button
                            onClick={() => router.push(`/${currentLanguage}/tests`)}
                            className="text-white/60 hover:text-white/80 text-sm underline"
                        >
                            Back to Tests
                        </button>
                    </div>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                                    {Object.entries(completedTestResult.scores).map(([dimension, percentage]) => (
                                        <div key={dimension} className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="font-semibold text-lg">{dimension}</div>
                                                <div className="text-xl font-bold text-yellow-300">{String(percentage)}%</div>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                                                <div 
                                                    className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 h-3 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ 
                                                        width: `${Math.min(Number(percentage) || 0, 100)}%`,
                                                        animation: 'progressFill 1.5s ease-out'
                                                    }}
                                                ></div>
                                            </div>
                                            {/* Visual Indicator */}
                                            <div className="text-sm text-white/80">
                                                {Number(percentage) >= 75 ? '🔥 Strong preference' : 
                                                 Number(percentage) >= 60 ? '✨ Clear tendency' : 
                                                 Number(percentage) >= 40 ? '⚖️ Moderate lean' : 
                                                 '🤔 Balanced'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Detailed Insights */}
                    {completedTestResult && completedTestResult.traits && (
                            <div className="mb-8 p-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
                                <h3 className="text-xl font-bold mb-4 text-white">✨ Your Key Traits</h3>
                                <div className="flex flex-wrap gap-3">
                                    {completedTestResult.traits.map((trait: string, index: number) => (
                                        <span key={index} className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full text-sm font-medium">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {completedTestResult && completedTestResult.strengths && (
                            <div className="mb-8 p-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
                                <h3 className="text-xl font-bold mb-4 text-white">💪 Your Strengths</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {completedTestResult.strengths.map((strength: string, index: number) => (
                                        <div key={index} className="flex items-center text-white/90">
                                            <span className="text-green-400 mr-2">✓</span>
                                            {strength}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {completedTestResult && completedTestResult.recommendations && (
                            <div className="mb-8 p-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
                                <h3 className="text-xl font-bold mb-4 text-white">🎯 Growth Opportunities</h3>
                                <div className="space-y-3">
                                    {completedTestResult.recommendations.map((rec: string, index: number) => (
                                        <div key={index} className="flex items-start text-white/90">
                                            <span className="text-blue-400 mr-2 mt-1">💡</span>
                                            <span>{rec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Personality Description */}
                        {completedTestResult && completedTestResult.description_key && (
                            <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-white/30 rounded-lg">
                                <h3 className="text-xl font-bold mb-4 text-white">🧠 About Your Type</h3>
                                <p className="text-white/90 text-lg leading-relaxed">
                                    {completedTestResult.description_key}
                                </p>
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
                            
                            {/* Name Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white">
                                    What name should your friends use when giving feedback?
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Enter your first name (e.g., Sarah, Mike)"
                                    className="w-full p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <p className="text-xs text-white/60 mt-1">
                                    {userName ? 
                                        `Questions will be like: "Is ${userName} good at getting people excited about stuff they want to do?"` :
                                        'Questions will be like: "Is [your name] good at getting people excited about stuff they want to do?"'
                                    }
                                </p>
                            </div>
                            
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
    
    // For 360-degree test, personalize the question with user's name
    const displayQuestion = testId === 'feedback-360' && userName ? 
        { ...currentQuestion, text_key: currentQuestion.text_key.replace(/\[NAME\]/g, userName) } : 
        currentQuestion;
        
    // Debug: log the name formatting
    console.log('Debug name info:', { 
        currentLanguage, 
        userName, 
        testId,
        originalName: nameInputValue,
        formattedName: userName 
    });

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
                    <h2 className="mb-6 text-xl font-semibold tracking-tight text-white" data-translate={displayQuestion.text_key}>
                        {t(displayQuestion.text_key) || displayQuestion.text_key}
                    </h2>

                    {displayQuestion.type === 'multiple_choice' && displayQuestion.options && (
                        <div className="flex flex-col gap-3">
                            {displayQuestion.options.map((option, index) => (
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

                    {displayQuestion.type === 'scale' && displayQuestion.scale && (
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-white/80">
                                <span data-translate={displayQuestion.scale.minLabel_key}>
                                    {t(displayQuestion.scale.minLabel_key) || displayQuestion.scale.minLabel_key}
                                </span>
                                <span data-translate={displayQuestion.scale.maxLabel_key}>
                                    {t(displayQuestion.scale.maxLabel_key) || displayQuestion.scale.maxLabel_key}
                                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                                {Array.from({ length: displayQuestion.scale.max - displayQuestion.scale.min + 1 }, (_, i) => {
                                    const value = displayQuestion.scale!.min + i;
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
                    
                    {/* Test Controls */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex gap-3">
                            {/* Previous Button */}
                            {currentQuestionIndex > 0 && (
                                <button
                                    onClick={() => {
                                        const prevIndex = currentQuestionIndex - 1;
                                        setCurrentQuestionIndex(prevIndex);
                                        saveTestProgress(prevIndex, answers);
                                    }}
                                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                                >
                                    ← Previous
                                </button>
                            )}
                            
                            {/* Pause & Save Progress Button */}
                            <button
                                onClick={() => {
                                    saveTestProgress(currentQuestionIndex, answers);
                                    router.push(`/${currentLanguage}/tests`);
                                }}
                                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                            >
                                💾 Save & Exit
                            </button>
                        </div>
                        
                        <div className="text-white/70 text-sm text-center">
                            <p className="mb-1">Progress automatically saved</p>
                            <div className="flex items-center gap-2 justify-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Your answers are being saved</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
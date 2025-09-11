"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/components/providers/translation-provider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    getUserTestResults, 
    getPendingInvitations, 
    getFeedbackForResult,
    getCoupleCompatibilityResultsByEmail,
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
    const [coupleResults, setCoupleResults] = useState<any[]>([]);
    const [resultsLoading, setResultsLoading] = useState(true);
    const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
    const [showAllResults, setShowAllResults] = useState(false);

    useEffect(() => {
        if (user && !loading) {
            loadData();
        } else if (!loading) {
            // Anonymous users should not access results page
            setResultsLoading(false);
        }
    }, [user, loading]);

    const loadFeedbackData = async (userResults: TestResult[]) => {
        try {
            const feedbackData: { [resultId: string]: FeedbackSubmission[] } = {};
            await Promise.all(
                userResults.map(async (result) => {
                    if (result.id) {
                        try {
                            const resultFeedback = await getFeedbackForResult(result.id);
                            feedbackData[result.id] = resultFeedback;
                        } catch (error) {
                            // Failed to load feedback for result
                        }
                    }
                })
            );
            setFeedback(feedbackData);
        } catch (error) {
            // Error loading feedback data
        }
    };

    const loadData = async () => {
        if (!user) return;
        
        try {
            // Load data in parallel - focus on couple results first for faster rendering
            const [userResults, pendingInvitations, coupleCompatibilityResults] = await Promise.allSettled([
                getUserTestResults(user.uid),
                getPendingInvitations(user.uid),
                getCoupleCompatibilityResultsByEmail(user.email || '')
            ]);

            const finalUserResults = userResults.status === 'fulfilled' ? userResults.value : [];
            const finalInvitations = pendingInvitations.status === 'fulfilled' ? pendingInvitations.value : [];
            const finalCoupleResults = coupleCompatibilityResults.status === 'fulfilled' ? coupleCompatibilityResults.value : [];
            
            // Quick localStorage check for couple compatibility results (optimized)
            let localCoupleResults: any[] = [];
            
            try {
                // Only check the specific key for this user (no expensive scanning)
                const coupleResultKey = `couple_result_${user.email}`;
                const localCoupleData = localStorage.getItem(coupleResultKey);
                
                if (localCoupleData) {
                    const parsedData = JSON.parse(localCoupleData);
                    localCoupleResults.push(parsedData);
                }
            } catch (error) {
                // Error loading localStorage couple results
            }
            
            const allCoupleResults = [...finalCoupleResults, ...localCoupleResults];
            
            // Set results immediately for fastest possible rendering
            setResults(finalUserResults);
            setInvitations(finalInvitations);
            setCoupleResults(allCoupleResults);

            // Load feedback lazily in background (don't block initial render)
            setTimeout(() => {
                loadFeedbackData(finalUserResults);
            }, 100);

        } catch (error) {
            // Error handling without console overhead
        } finally {
            setResultsLoading(false);
        }
    };

    // Function removed - was causing performance issues with localStorage scanning

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

    const renderQuestionComparison = (answers: any, compatibilityData: any, result: TestResult) => {
        // Couple compatibility questions and their translations
        const coupleQuestions = [
            { id: 'couple_1', textKey: 'tests.couple.questions.q1', category: 'Lifestyle & Fun' },
            { id: 'couple_2', textKey: 'tests.couple.questions.q2', category: 'Lifestyle & Fun' },
            { id: 'couple_3', textKey: 'tests.couple.questions.q3', category: 'Lifestyle & Fun' },
            { id: 'couple_4', textKey: 'tests.couple.questions.q4', category: 'Lifestyle & Fun' },
            { id: 'couple_5', textKey: 'tests.couple.questions.q5', category: 'Lifestyle & Fun' },
            { id: 'couple_6', textKey: 'tests.couple.questions.q6', category: 'Values & Relationships' },
            { id: 'couple_7', textKey: 'tests.couple.questions.q7', category: 'Values & Relationships' },
            { id: 'couple_8', textKey: 'tests.couple.questions.q8', category: 'Values & Relationships' },
            { id: 'couple_9', textKey: 'tests.couple.questions.q9', category: 'Values & Relationships' },
            { id: 'couple_10', textKey: 'tests.couple.questions.q10', category: 'Values & Relationships' },
            { id: 'couple_11', textKey: 'tests.couple.questions.q11', category: 'Lifestyle Compatibility' },
            { id: 'couple_12', textKey: 'tests.couple.questions.q12', category: 'Lifestyle Compatibility' },
            { id: 'couple_13', textKey: 'tests.couple.questions.q13', category: 'Lifestyle Compatibility' },
            { id: 'couple_14', textKey: 'tests.couple.questions.q14', category: 'Lifestyle Compatibility' },
            { id: 'couple_15', textKey: 'tests.couple.questions.q15', category: 'Lifestyle Compatibility' }
        ];

        // Answer option translations mapping
        const answerTranslations: { [key: string]: string } = {
            // Q1 - Friday night
            'movie_chill': t('tests.couple.options.q1_a') || 'Movie & chill',
            'party_out': t('tests.couple.options.q1_b') || 'Party out', 
            'dinner_date': t('tests.couple.options.q1_c') || 'Dinner date',
            'gaming': t('tests.couple.options.q1_d') || 'Gaming',
            
            // Q2 - Vacation
            'beach': t('tests.couple.options.q2_a') || 'Beach',
            'mountains': t('tests.couple.options.q2_b') || 'Mountains',
            'city_tour': t('tests.couple.options.q2_c') || 'City tour',
            'staycation': t('tests.couple.options.q2_d') || 'Staycation',
            
            // Q3 - Weekend activities  
            'adventure': t('tests.couple.options.q3_a') || 'Outdoor adventure',
            'culture': t('tests.couple.options.q3_b') || 'Museums/culture',
            'relax_home': t('tests.couple.options.q3_c') || 'Relax at home',
            'social': t('tests.couple.options.q3_d') || 'Social events',
            
            // Q4 - Schedule
            'early_bird': t('tests.couple.options.q4_a') || 'Early bird',
            'night_owl': t('tests.couple.options.q4_b') || 'Night owl',
            'flexible': t('tests.couple.options.q4_c') || 'Flexible',
            
            // Q5 - Celebrations
            'big_party': t('tests.couple.options.q5_a') || 'Big party',
            'intimate': t('tests.couple.options.q5_b') || 'Intimate dinner',
            'adventure_trip': t('tests.couple.options.q5_c') || 'Adventure trip',
            'simple_home': t('tests.couple.options.q5_d') || 'Simple at home',
            
            // Q6 - Relationship priority
            'trust': t('tests.couple.options.q6_a') || 'Trust',
            'fun': t('tests.couple.options.q6_b') || 'Fun',
            'communication': t('tests.couple.options.q6_c') || 'Communication',
            'support': t('tests.couple.options.q6_d') || 'Support',
            
            // Q7 - Conflicts
            'talk_immediately': t('tests.couple.options.q7_a') || 'Talk immediately',
            'cool_down_first': t('tests.couple.options.q7_b') || 'Cool down first',
            'compromise': t('tests.couple.options.q7_c') || 'Find compromise',
            'avoid': t('tests.couple.options.q7_d') || 'Avoid conflict',
            
            // Q8 - Love language
            'words': t('tests.couple.options.q8_a') || 'Words of affirmation',
            'quality_time': t('tests.couple.options.q8_b') || 'Quality time',
            'physical_touch': t('tests.couple.options.q8_c') || 'Physical touch',
            'acts_service': t('tests.couple.options.q8_d') || 'Acts of service',
            'gifts': t('tests.couple.options.q8_e') || 'Gifts',
            
            // Q9 - Time together
            'lots_together': t('tests.couple.options.q9_a') || 'Lots of time together',
            'balanced': t('tests.couple.options.q9_b') || 'Balanced time',
            'independent': t('tests.couple.options.q9_c') || 'Need independence',
            
            // Add more as needed...
        };

        // Compatibility matrix for determining match type
        const compatibilityMatrix: { [key: string]: { [value: string]: string[] } } = {
            couple_1: { movie_chill: ['dinner_date'], party_out: [], dinner_date: ['movie_chill'], gaming: ['movie_chill'] },
            couple_2: { beach: ['staycation'], mountains: ['city_tour'], city_tour: ['mountains'], staycation: ['beach'] },
            couple_3: { adventure: ['social'], culture: ['relax_home'], relax_home: ['culture'], social: ['adventure'] },
            couple_4: { early_bird: [], night_owl: [], flexible: ['early_bird', 'night_owl'] },
            couple_5: { big_party: [], intimate: ['simple_home'], adventure_trip: [], simple_home: ['intimate'] },
            couple_6: { trust: ['communication'], fun: [], communication: ['trust', 'support'], support: ['communication'] },
            couple_7: { talk_immediately: ['compromise'], cool_down_first: ['compromise'], compromise: ['talk_immediately', 'cool_down_first'], avoid: [] },
            couple_8: { words: [], quality_time: ['physical_touch'], physical_touch: ['quality_time'], acts_service: [], gifts: [] },
            couple_9: { lots_together: ['balanced'], balanced: ['lots_together', 'independent'], independent: ['balanced'] }
        };

        const getMatchType = (questionId: string, userAnswer: string, partnerAnswer: string) => {
            if (userAnswer === partnerAnswer) {
                return { type: 'exact', label: 'Perfect Match', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: '✅' };
            } else if (compatibilityMatrix[questionId]?.[userAnswer]?.includes(partnerAnswer)) {
                return { type: 'partial', label: 'Compatible', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: '🟡' };
            } else {
                return { type: 'different', label: 'Different', color: 'text-gray-400', bgColor: 'bg-gray-500/20', icon: '◯' };
            }
        };

        // Extract partner answers from couple compatibility result data
        let partnerAnswers: { [key: string]: any } = {};
        let hasRealPartnerAnswers = false;
        
        // Check for new userPreferences-based structure first
        if (compatibilityData?.partner2?.userPreferences) {
            // Transform userPreferences to question IDs (new structure)
            const keyToQuestionId: { [key: string]: string } = {
                'friday_night': 'couple_1',
                'vacation_type': 'couple_2', 
                'weekend_style': 'couple_3',
                'schedule': 'couple_4',
                'celebrations': 'couple_5',
                'relationship_priority': 'couple_6',
                'conflict_style': 'couple_7',
                'love_language': 'couple_8', 
                'time_together': 'couple_9',
                'partner_values': 'couple_10',
                'money_philosophy': 'couple_11',
                'food_preferences': 'couple_12',
                'planning_style': 'couple_13',
                'social_preferences': 'couple_14',
                'communication_style': 'couple_15'
            };
            
            Object.keys(compatibilityData.partner2.userPreferences).forEach(category => {
                Object.keys(compatibilityData.partner2.userPreferences[category] || {}).forEach(key => {
                    const questionId = keyToQuestionId[key];
                    if (questionId) {
                        partnerAnswers[questionId] = compatibilityData.partner2.userPreferences[category][key];
                    }
                });
            });
            hasRealPartnerAnswers = true;
        }
        // Fallback to legacy structure
        else if (compatibilityData?.partner1?.answers && compatibilityData?.partner2?.answers) {
            partnerAnswers = compatibilityData.partner2.answers;
            hasRealPartnerAnswers = true;
        }
        
        let currentCategory = '';

        return coupleQuestions.map((question) => {
            const userAnswer = answers[question.id];
            const partnerAnswer = partnerAnswers[question.id];
            
            if (!userAnswer) {
                return null;
            }

            const match = getMatchType(question.id, userAnswer, partnerAnswer);
            const showCategoryHeader = currentCategory !== question.category;
            currentCategory = question.category;
            
            // Pre-compute display values for JSX (simplified to fix TypeScript scope issue)
            const partnerLabel = 'Your Partner';
            const showPreviewIcon = false;

            return (
                <div key={question.id}>
                    {/* Category Header */}
                    {showCategoryHeader && (
                        <div className="mb-3 mt-6 first:mt-0">
                            <h6 className="text-sm font-semibold text-white/90 border-l-4 border-purple-400 pl-3">
                                {question.category}
                            </h6>
                        </div>
                    )}
                    
                    {/* Question Comparison */}
                    <div className={`p-3 rounded-lg ${match.bgColor} border border-white/10`}>
                        {/* Question Text */}
                        <div className="mb-3">
                            <h6 className="text-sm font-medium text-white/90 mb-1">
                                {t(question.textKey) || question.textKey}
                            </h6>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${match.bgColor} ${match.color} font-medium`}>
                                    {match.icon} {match.label}
                                </span>
                            </div>
                        </div>

                        {/* Side-by-side Answers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Your Answer */}
                            <div className="bg-white/5 p-3 rounded">
                                <div className="text-xs text-white/60 mb-1">You</div>
                                <div className="text-sm text-white/90 font-medium">
                                    {answerTranslations[userAnswer] || userAnswer}
                                </div>
                            </div>
                            
                            {/* Partner Answer */}
                            <div className="bg-white/5 p-3 rounded">
                                <div className="text-xs text-white/60 mb-1">Your Partner</div>
                                <div className="text-sm text-white/90 font-medium">
                                    {answerTranslations[partnerAnswer] || partnerAnswer}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }).filter(Boolean);
    };

    const renderMockComparison = (answers: any) => {
        // Mock partner answers for demonstration
        const mockPartnerAnswers = {
            'couple_1': 'dinner_date',
            'couple_2': 'beach', 
            'couple_3': 'relax_home',
            'couple_4': 'flexible',
            'couple_5': 'intimate',
            'couple_6': 'trust',
            'couple_7': 'compromise',
            'couple_8': 'quality_time',
            'couple_9': 'balanced',
            'couple_10': 'growth',
            'couple_11': 'balanced',
            'couple_12': 'healthy_eating',
            'couple_13': 'flexible_plans',
            'couple_14': 'small_circle',
            'couple_15': 'gentle_supportive'
        };

        const coupleQuestions = [
            { id: 'couple_1', textKey: 'tests.couple.questions.q1', category: 'Lifestyle & Fun' },
            { id: 'couple_2', textKey: 'tests.couple.questions.q2', category: 'Lifestyle & Fun' },
            { id: 'couple_3', textKey: 'tests.couple.questions.q3', category: 'Lifestyle & Fun' },
            { id: 'couple_4', textKey: 'tests.couple.questions.q4', category: 'Lifestyle & Fun' },
            { id: 'couple_5', textKey: 'tests.couple.questions.q5', category: 'Lifestyle & Fun' },
            { id: 'couple_6', textKey: 'tests.couple.questions.q6', category: 'Values & Relationships' },
            { id: 'couple_7', textKey: 'tests.couple.questions.q7', category: 'Values & Relationships' },
            { id: 'couple_8', textKey: 'tests.couple.questions.q8', category: 'Values & Relationships' },
            { id: 'couple_9', textKey: 'tests.couple.questions.q9', category: 'Values & Relationships' },
            { id: 'couple_10', textKey: 'tests.couple.questions.q10', category: 'Values & Relationships' },
            { id: 'couple_11', textKey: 'tests.couple.questions.q11', category: 'Lifestyle Compatibility' },
            { id: 'couple_12', textKey: 'tests.couple.questions.q12', category: 'Lifestyle Compatibility' },
            { id: 'couple_13', textKey: 'tests.couple.questions.q13', category: 'Lifestyle Compatibility' },
            { id: 'couple_14', textKey: 'tests.couple.questions.q14', category: 'Lifestyle Compatibility' },
            { id: 'couple_15', textKey: 'tests.couple.questions.q15', category: 'Lifestyle Compatibility' }
        ];

        const answerTranslations: { [key: string]: string } = {
            'movie_chill': t('tests.couple.options.q1_a') || 'Movie & chill',
            'party_out': t('tests.couple.options.q1_b') || 'Party out', 
            'dinner_date': t('tests.couple.options.q1_c') || 'Dinner date',
            'gaming': t('tests.couple.options.q1_d') || 'Gaming',
            'beach': t('tests.couple.options.q2_a') || 'Beach',
            'mountains': t('tests.couple.options.q2_b') || 'Mountains',
            'city_tour': t('tests.couple.options.q2_c') || 'City tour',
            'staycation': t('tests.couple.options.q2_d') || 'Staycation',
            'adventure': t('tests.couple.options.q3_a') || 'Outdoor adventure',
            'culture': t('tests.couple.options.q3_b') || 'Museums/culture',
            'relax_home': t('tests.couple.options.q3_c') || 'Relax at home',
            'social': t('tests.couple.options.q3_d') || 'Social events',
            'early_bird': t('tests.couple.options.q4_a') || 'Early bird',
            'night_owl': t('tests.couple.options.q4_b') || 'Night owl',
            'flexible': t('tests.couple.options.q4_c') || 'Flexible',
            'big_party': t('tests.couple.options.q5_a') || 'Big party',
            'intimate': t('tests.couple.options.q5_b') || 'Intimate dinner',
            'adventure_trip': t('tests.couple.options.q5_c') || 'Adventure trip',
            'simple_home': t('tests.couple.options.q5_d') || 'Simple at home',
            'trust': t('tests.couple.options.q6_a') || 'Trust',
            'fun': t('tests.couple.options.q6_b') || 'Fun',
            'communication': t('tests.couple.options.q6_c') || 'Communication',
            'support': t('tests.couple.options.q6_d') || 'Support',
            'talk_immediately': t('tests.couple.options.q7_a') || 'Talk immediately',
            'cool_down_first': t('tests.couple.options.q7_b') || 'Cool down first',
            'compromise': t('tests.couple.options.q7_c') || 'Find compromise',
            'avoid': t('tests.couple.options.q7_d') || 'Avoid conflict',
            'words': t('tests.couple.options.q8_a') || 'Words of affirmation',
            'quality_time': t('tests.couple.options.q8_b') || 'Quality time',
            'physical_touch': t('tests.couple.options.q8_c') || 'Physical touch',
            'acts_service': t('tests.couple.options.q8_d') || 'Acts of service',
            'gifts': t('tests.couple.options.q8_e') || 'Gifts',
            'lots_together': t('tests.couple.options.q9_a') || 'Lots of time together',
            'balanced': t('tests.couple.options.q9_b') || 'Balanced time',
            'independent': t('tests.couple.options.q9_c') || 'Need independence',
            'growth': 'Personal growth',
            'healthy_eating': 'Healthy eating',
            'flexible_plans': 'Flexible planning', 
            'small_circle': 'Small circle',
            'gentle_supportive': 'Gentle & supportive'
        };

        const compatibilityMatrix: { [key: string]: { [value: string]: string[] } } = {
            couple_1: { movie_chill: ['dinner_date'], dinner_date: ['movie_chill'] },
            couple_2: { beach: ['staycation'], mountains: ['city_tour'] },
            couple_3: { adventure: ['social'], relax_home: ['culture'] },
            couple_4: { flexible: ['early_bird', 'night_owl'] },
            couple_5: { intimate: ['simple_home'] },
            couple_6: { trust: ['communication'] },
            couple_7: { compromise: ['talk_immediately', 'cool_down_first'] },
            couple_8: { quality_time: ['physical_touch'] },
            couple_9: { balanced: ['lots_together', 'independent'] }
        };

        const getMatchType = (questionId: string, userAnswer: string, partnerAnswer: string) => {
            if (userAnswer === partnerAnswer) {
                return { type: 'exact', label: 'Perfect Match', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: '✅' };
            } else if (compatibilityMatrix[questionId]?.[userAnswer]?.includes(partnerAnswer)) {
                return { type: 'partial', label: 'Compatible', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: '🟡' };
            } else {
                return { type: 'different', label: 'Different', color: 'text-gray-400', bgColor: 'bg-gray-500/20', icon: '◯' };
            }
        };

        let currentCategory = '';

        return coupleQuestions.map((question) => {
            const userAnswer = answers[question.id];
            const partnerAnswer = mockPartnerAnswers[question.id as keyof typeof mockPartnerAnswers];
            
            if (!userAnswer) return null;

            const match = getMatchType(question.id, userAnswer, partnerAnswer);
            const showCategoryHeader = currentCategory !== question.category;
            currentCategory = question.category;

            return (
                <div key={question.id}>
                    {/* Category Header */}
                    {showCategoryHeader && (
                        <div className="mb-3 mt-6 first:mt-0">
                            <h6 className="text-sm font-semibold text-white/90 border-l-4 border-purple-400 pl-3">
                                {question.category}
                            </h6>
                        </div>
                    )}
                    
                    {/* Question Comparison */}
                    <div className={`p-3 rounded-lg ${match.bgColor} border border-white/10`}>
                        {/* Question Text */}
                        <div className="mb-3">
                            <h6 className="text-sm font-medium text-white/90 mb-1">
                                {t(question.textKey) || question.textKey}
                            </h6>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${match.bgColor} ${match.color} font-medium`}>
                                    {match.icon} {match.label}
                                </span>
                            </div>
                        </div>

                        {/* Side-by-side Answers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Your Answer */}
                            <div className="bg-white/5 p-3 rounded">
                                <div className="text-xs text-white/60 mb-1">You</div>
                                <div className="text-sm text-white/90 font-medium">
                                    {answerTranslations[userAnswer] || userAnswer}
                                </div>
                            </div>
                            
                            {/* Partner Answer */}
                            <div className="bg-white/5 p-3 rounded relative">
                                <div className="text-xs text-white/60 mb-1">
                                    Your Partner
                                </div>
                                <div className="text-sm text-white/90 font-medium">
                                    {answerTranslations[partnerAnswer] || partnerAnswer}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }).filter(Boolean);
    };

    // Filter results to show only recent 5 per test type
    const getFilteredResults = () => {
        if (showAllResults) {
            return results.filter(r => r.testId !== 'couple-compatibility-results');
        }
        
        // Group results by test type and get 5 most recent for each
        const resultsByTestType: { [testId: string]: TestResult[] } = {};
        
        results
            .filter(r => r.testId !== 'couple-compatibility-results')
            .forEach(result => {
                if (!resultsByTestType[result.testId]) {
                    resultsByTestType[result.testId] = [];
                }
                resultsByTestType[result.testId].push(result);
            });
        
        // Sort each test type by date (most recent first) and take only 5
        Object.keys(resultsByTestType).forEach(testId => {
            resultsByTestType[testId] = resultsByTestType[testId]
                .sort((a, b) => {
                    const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt as any ? new Date(a.createdAt as any) : new Date(0));
                    const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt as any ? new Date(b.createdAt as any) : new Date(0));
                    return bDate.getTime() - aDate.getTime();
                })
                .slice(0, 5);
        });
        
        // Flatten back to array and sort by overall date
        const filteredResults = Object.values(resultsByTestType)
            .flat()
            .sort((a, b) => {
                const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt as any ? new Date(a.createdAt as any) : new Date(0));
                const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt as any ? new Date(b.createdAt as any) : new Date(0));
                return bDate.getTime() - aDate.getTime();
            });
            
        return filteredResults;
    };

    const renderTestResult = (result: TestResult) => {
        const testDef = getTestById(result.testId);
        const hasAnswers = result.resultPayload?.answers;
        const hasResult = result.resultPayload?.result;
        const resultFeedback = result.id ? (feedback[result.id] || []) : [];

        // Check if this is a couple compatibility test
        const isCoupleTest = result.testId === 'couple-compatibility';
        
        // Get compatibility data for couple tests
        const compatibilityData = hasResult?.compatibilityData;
        const compatibilityScore = hasResult?.scores?.compatibility || 0;
        
        // Get result tier based on compatibility score
        const getCompatibilityTier = (score: number) => {
            if (score >= 95) return { emoji: '💍', label: 'Soulmates', color: 'text-pink-400' };
            if (score >= 85) return { emoji: '⚡', label: 'Power Couple', color: 'text-yellow-400' };
            if (score >= 75) return { emoji: '🌍', label: 'Adventurous Duo', color: 'text-green-400' };
            if (score >= 65) return { emoji: '💕', label: 'Sweet Match', color: 'text-red-400' };
            if (score >= 50) return { emoji: '🔨', label: 'Work in Progress', color: 'text-blue-400' };
            if (score >= 35) return { emoji: '📚', label: 'Learning Together', color: 'text-purple-400' };
            return { emoji: '🤔', label: 'Opposites Attract', color: 'text-gray-400' };
        };

        if (isCoupleTest && hasResult) {
            const tier = getCompatibilityTier(compatibilityScore);
            
            return (
                <div key={result.id} className="p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">{tier.emoji}</div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                            💕 Couple Compatibility Results
                        </h3>
                        <p className="text-white text-lg">
                            Completed on {formatDate(result.createdAt)}
                        </p>
                    </div>

                    {/* Main Compatibility Score */}
                    <div className="text-center mb-8 p-6 bg-white/10 rounded-xl">
                        <div className="text-5xl font-bold text-white mb-2">
                            {compatibilityScore}%
                        </div>
                        <div className={`text-2xl font-semibold mb-4 ${tier.color}`}>
                            {tier.emoji} {tier.label}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-white/20 rounded-full h-4 mb-4">
                            <div 
                                className="bg-gradient-to-r from-pink-400 to-red-400 h-4 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${compatibilityScore}%` }}
                            ></div>
                        </div>
                        
                        <p className="text-white/90 text-lg">
                            {compatibilityScore >= 85 ? "You two are incredibly compatible! 🎉" :
                             compatibilityScore >= 65 ? "You have great potential together! 💫" :
                             compatibilityScore >= 50 ? "There's room to grow together! 🌱" :
                             "Every couple can learn and grow! 💪"}
                        </p>
                    </div>

                    {/* Personality Types */}
                    {hasResult.type && (
                        <div className="mb-8 p-6 bg-white/10 rounded-xl">
                            <h4 className="text-xl font-semibold text-white mb-4 text-center">
                                💫 Your Personality Type
                            </h4>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-300 mb-2">
                                    {t(hasResult.type) || hasResult.type}
                                </div>
                                {hasResult.traits && (
                                    <div className="flex justify-center flex-wrap gap-2 mt-4">
                                        {hasResult.traits.map((trait: string, index: number) => (
                                            <span 
                                                key={index}
                                                className="px-3 py-1 bg-purple-500/30 text-purple-100 rounded-full text-sm"
                                            >
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Compatibility Areas */}
                    {compatibilityData?.areaBreakdown && (
                        <div className="mb-8 p-6 bg-white/10 rounded-xl">
                            <h4 className="text-xl font-semibold text-white mb-6 text-center">
                                🎯 Compatibility Areas
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(compatibilityData.areaBreakdown).map(([area, scoreValue]) => {
                                    const score = typeof scoreValue === 'number' ? scoreValue : 0;
                                    const displayScore = typeof scoreValue === 'number' ? `${Math.round(scoreValue)}%` : String(scoreValue);
                                    
                                    return (
                                        <div key={area} className="bg-white/5 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-white font-medium capitalize">
                                                    {area.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </span>
                                                <span className="text-white/80 font-semibold">
                                                    {displayScore}
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <button 
                            onClick={() => {
                                const shareText = `We scored ${compatibilityScore}% compatibility! ${tier.emoji} ${tier.label} 💕`;
                                const shareUrl = `https://korean-mbti-platform.netlify.app/${currentLanguage}/tests/couple-compatibility/`;
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Couple Compatibility Results',
                                        text: shareText,
                                        url: shareUrl,
                                    });
                                } else {
                                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                                    alert('Results copied to clipboard!');
                                }
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                        >
                            💕 Share Results
                        </button>
                        
                        <Link href={`/${currentLanguage}/tests/couple-compatibility/`}>
                            <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300">
                                🔄 Test with Another Partner
                            </button>
                        </Link>
                        
                        <button 
                            onClick={() => setSelectedResultId(
                                selectedResultId === result.id ? null : result.id!
                            )}
                            className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all duration-300"
                        >
                            {selectedResultId === result.id ? 'Hide Details' : 'Show Details'}
                        </button>
                    </div>

                    {/* Detailed View (collapsed by default) */}
                    {selectedResultId === result.id && (
                        <div className="mt-8 pt-8 border-t border-white/20 space-y-6">
                            {/* Partner Information */}
                            {compatibilityData && (
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <h5 className="text-lg font-semibold text-white mb-4">👫 Partner Information</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="text-white/80">
                                            <p><span className="font-medium">Your Partner:</span> {compatibilityData.partnerName || 'Unknown'}</p>
                                            <p><span className="font-medium">Test Date:</span> {formatDate(result.createdAt)}</p>
                                        </div>
                                        <div className="text-white/80">
                                            <p><span className="font-medium">Questions Answered:</span> 15</p>
                                            <p><span className="font-medium">Analysis Depth:</span> Advanced</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Question by Question Comparison */}
                            {compatibilityData && (
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <h5 className="text-lg font-semibold text-white mb-4">🤝 Question by Question Comparison</h5>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {renderQuestionComparison(hasAnswers, compatibilityData, result)}
                                    </div>
                                </div>
                            )}
                            
                            {/* Mock Comparison for Incomplete Results */}
                            {hasAnswers && !compatibilityData && (
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <h5 className="text-lg font-semibold text-white mb-4">🤝 Question by Question Comparison Preview</h5>
                                    <div className="mb-4 p-3 bg-blue-500/10 rounded text-sm text-blue-200">
                                        <p>📋 <strong>Preview Mode:</strong> This shows how your comparison will look when your partner completes the test!</p>
                                        <p className="text-xs mt-1">Showing sample answers for demonstration purposes.</p>
                                    </div>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {renderMockComparison(hasAnswers)}
                                    </div>
                                </div>
                            )}

                            {/* Detailed Insights */}
                            {hasResult.insights && (
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <h5 className="text-lg font-semibold text-white mb-3">💡 Relationship Insights</h5>
                                    <div className="text-white/90 space-y-2">
                                        {hasResult.insights.map((insight: string, index: number) => (
                                            <p key={index} className="text-sm">• {insight}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        // Default rendering for other test types (MBTI, etc.)
        return (
            <div key={result.id} className="p-6 bg-white/30 backdrop-blur-md border border-white/40 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-white">
                            {getTestName(result.testId)}
                        </h3>
                        <p className="text-white">
                            Completed on {formatDate(result.createdAt)}
                        </p>
                        <div className="flex gap-4 text-sm text-white mt-1">
                            <span>Questions: {Object.keys(hasAnswers || {}).length}</span>
                            {resultFeedback.length > 0 && (
                                <span className="text-green-400">
                                    Feedback: {resultFeedback.length} responses
                                </span>
                            )}
                            {testDef?.requiresFeedback && (
                                <span className="text-blue-400">Feedback-enabled</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setSelectedResultId(
                                selectedResultId === result.id ? null : result.id!
                            )}
                            className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300"
                        >
                            {selectedResultId === result.id ? 'Hide Details' : 'View Details'}
                        </button>
                    </div>
                </div>

                {/* Enhanced MBTI Results Display */}
                {hasResult && !selectedResultId && (
                    <div className="mt-4 p-4 bg-white/10 rounded-lg">
                        {hasResult.type && (
                            <div className="text-center mb-4">
                                <div className="text-2xl font-bold text-white mb-2">
                                    {t(hasResult.type) || hasResult.type}
                                </div>
                                {hasResult.traits && (
                                    <div className="flex justify-center flex-wrap gap-2">
                                        {hasResult.traits.map((trait: string, index: number) => (
                                            <span 
                                                key={index}
                                                className="px-3 py-1 bg-blue-500/30 text-blue-100 rounded-full text-sm"
                                            >
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* MBTI Percentages */}
                        {hasResult.scores?.percentages && (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {Object.entries(hasResult.scores.percentages).map(([key, value]) => (
                                    <div key={key} className="bg-white/5 p-3 rounded">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-white/90 text-sm font-medium">
                                                {t(`results.bigfive.traits.${key.toLowerCase()}`) || 
                                                 t(`results.dimensions.${key}`) || 
                                                 key}
                                            </span>
                                            <span className="text-white font-semibold">
                                                {typeof value === 'number' ? `${value}%` : String(value)}
                                            </span>
                                        </div>
                                        {typeof value === 'number' && (
                                            <div className="w-full bg-white/20 rounded-full h-1.5">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full"
                                                    style={{ width: `${value}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {selectedResultId === result.id && (
                    <div className="mt-4 space-y-4">
                        {/* Full Results */}
                        {hasResult && (
                            <div className="p-4 bg-white/10 rounded-lg">
                                <h4 className="font-semibold mb-3 text-white">📊 Complete Results</h4>
                                <div className="space-y-3">
                                    {hasResult.type && (
                                        <div className="text-center p-4 bg-white/5 rounded">
                                            <div className="text-xl font-bold text-purple-300 mb-2">
                                                {t(hasResult.type) || hasResult.type}
                                            </div>
                                            {hasResult.traits && (
                                                <div className="flex justify-center flex-wrap gap-2">
                                                    {hasResult.traits.map((trait: string, index: number) => (
                                                        <span key={index} className="px-2 py-1 bg-purple-500/30 text-purple-100 rounded-full text-xs">
                                                            {trait}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Detailed Scores */}
                                    {hasResult.scores && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(hasResult.scores)
                                                .filter(([key, value]) => key !== 'percentages')
                                                .map(([key, value]) => (
                                                    <div key={key} className="bg-white/5 p-3 rounded">
                                                        <span className="text-white/90 font-medium capitalize">{key}: </span>
                                                        <span className="text-white">{String(value)}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Raw Answers (Technical Details) */}
                        {hasAnswers && (
                            <div className="p-4 bg-white/5 rounded-lg">
                                <h4 className="font-semibold mb-3 text-white/80">🔧 Technical Details</h4>
                                <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                                    {Object.entries(hasAnswers).map(([questionId, answer]) => (
                                        <div key={questionId} className="flex">
                                            <span className="text-white/60 font-mono w-24 flex-shrink-0">{questionId}:</span>
                                            <span className="text-white/80 ml-2">{String(answer)}</span>
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

    // Show signin message for anonymous users
    if (!user && !resultsLoading) {
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

                {results.length === 0 && coupleResults.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg dark:bg-gray-800">
                        <h2 className="text-2xl font-semibold mb-4" data-translate="results.no_results_title">
                            {t('results.no_results_title') || 'No Test Results Yet'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6" data-translate="results.no_results_message">
                            {t('results.no_results_message') || 'You haven\'t completed any personality tests yet. Start your journey of self-discovery today!'}
                        </p>
                        <Link href={`/${currentLanguage}/tests`}>
                            <button className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600" data-translate="results.take_first_test">
                                {t('results.take_first_test') || 'Take a Test'}
                            </button>
                        </Link>
                        
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Couple Compatibility Results Section */}
                        {coupleResults.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    💕 {currentLanguage === 'ko' ? '커플 호환성 결과' : 'Couple Compatibility Results'}
                                </h2>
                                <div className="space-y-4">
                                    {coupleResults.map((coupleResult, index) => (
                                        <div key={coupleResult.id || index} className="p-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg">
                                            <div className="text-center mb-4">
                                                <div className="text-3xl font-bold text-white mb-2">
                                                    {coupleResult.compatibilityResults?.compatibilityPercentage || 
                                                     coupleResult.compatibilityResults?.compatibilityData?.percentage}%
                                                </div>
                                                <div className="text-xl text-white/90">
                                                    {coupleResult.compatibilityResults?.description ||
                                                     coupleResult.compatibilityResults?.compatibilityData?.description ||
                                                     'Great compatibility!'}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-white">
                                                        {coupleResult.partnerNames?.partner1 || 'Partner 1'}
                                                    </div>
                                                    <div className="text-white/80">
                                                        {coupleResult.individualResults?.partner1?.type || 'The Devoted Partner 💕'}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold text-white">
                                                        {coupleResult.partnerNames?.partner2 || 'Partner 2'}
                                                    </div>
                                                    <div className="text-white/80">
                                                        {coupleResult.individualResults?.partner2?.type || 'The Devoted Partner 💕'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Compatibility Areas */}
                                            {coupleResult.compatibilityResults?.areaScores && (
                                                <div className="mt-4">
                                                    <h4 className="text-lg font-semibold text-white mb-2">
                                                        {currentLanguage === 'ko' ? '호환성 영역:' : 'Compatibility Areas:'}
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/90">
                                                        {Object.entries(coupleResult.compatibilityResults.areaScores).map(([area, score]: [string, any]) => (
                                                            <div key={area} className="flex justify-between">
                                                                <span>{area as string}:</span>
                                                                <span className="font-semibold">{score as number}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Question-by-Question Detailed Comparison */}
                                            {coupleResult.compatibilityResults?.detailedComparison && (
                                                <div className="mt-6">
                                                    <h4 className="text-lg font-semibold text-white mb-4">
                                                        {currentLanguage === 'ko' ? '문항별 상세 비교:' : 'Question-by-Question Comparison:'}
                                                    </h4>
                                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                                        {coupleResult.compatibilityResults.detailedComparison.map((comparison: any, qIndex: number) => (
                                                            <div key={qIndex} className="p-3 bg-white/5 rounded border border-white/20">
                                                                <div className="text-sm text-white/90 mb-2">
                                                                    <strong>Q{qIndex + 1}:</strong> {comparison.question || `Question ${qIndex + 1}`}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                                    <div className="text-white/80">
                                                                        <span className="font-medium">{coupleResult.partnerNames?.partner1}:</span> {comparison.partner1Answer}
                                                                    </div>
                                                                    <div className="text-white/80">
                                                                        <span className="font-medium">{coupleResult.partnerNames?.partner2}:</span> {comparison.partner2Answer}
                                                                    </div>
                                                                </div>
                                                                <div className="text-center mt-2">
                                                                    <span className={`inline-flex px-2 py-1 rounded text-xs ${
                                                                        comparison.match ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                                                                    }`}>
                                                                        {comparison.match ? '✓ Match' : '✗ Different'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show Details Button for Couple Results */}
                                            <div className="mt-4 text-center">
                                                <button 
                                                    onClick={() => setSelectedResultId(
                                                        selectedResultId === `couple-${index}` ? null : `couple-${index}`
                                                    )}
                                                    className="px-6 py-2 bg-purple-500/30 backdrop-blur-sm border border-purple-400/50 text-white rounded-lg hover:bg-purple-500/50 transition-all duration-300"
                                                >
                                                    {selectedResultId === `couple-${index}` ? 'Hide Details' : 'Show Details'}
                                                </button>
                                            </div>

                                            {/* Question-by-Question Comparison - Show when button clicked */}
                                            {selectedResultId === `couple-${index}` && (
                                                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                                                    <h4 className="text-lg font-semibold text-white mb-4">
                                                        Question-by-Question Comparison
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {(() => {
                                                            // Transform userPreferences to the expected answers format
                                                            const partner1UserPrefs = coupleResult.compatibilityResults?.partner1?.userPreferences || {};
                                                            const partner2UserPrefs = coupleResult.compatibilityResults?.partner2?.userPreferences || {};
                                                            
                                                            // Create mapping from descriptive keys to question IDs
                                                            const keyToQuestionId: { [key: string]: string } = {
                                                                'friday_night': 'couple_1',
                                                                'vacation_type': 'couple_2', 
                                                                'weekend_style': 'couple_3',
                                                                'schedule': 'couple_4',
                                                                'celebrations': 'couple_5',
                                                                'relationship_priority': 'couple_6',
                                                                'conflict_style': 'couple_7',
                                                                'love_language': 'couple_8', 
                                                                'time_together': 'couple_9',
                                                                'partner_values': 'couple_10',
                                                                'money_philosophy': 'couple_11',
                                                                'food_preferences': 'couple_12',
                                                                'planning_style': 'couple_13',
                                                                'social_preferences': 'couple_14',
                                                                'communication_style': 'couple_15'
                                                            };

                                                            // Flatten userPreferences and map to question IDs
                                                            const flattenAndMapUserPrefs = (userPrefs: any) => {
                                                                const flattened: any = {};
                                                                Object.keys(userPrefs).forEach(category => {
                                                                    Object.keys(userPrefs[category] || {}).forEach(key => {
                                                                        const questionId = keyToQuestionId[key];
                                                                        if (questionId) {
                                                                            flattened[questionId] = userPrefs[category][key];
                                                                        }
                                                                    });
                                                                });
                                                                return flattened;
                                                            };
                                                            
                                                            const partner1Answers = flattenAndMapUserPrefs(partner1UserPrefs);
                                                            console.log('🔍 DEBUG: Mapped partner1 answers:', partner1Answers);
                                                            console.log('🔍 DEBUG: Sample question IDs:', Object.keys(partner1Answers).slice(0, 5));
                                                            
                                                            // Also get partner2 answers
                                                            const partner2Answers = flattenAndMapUserPrefs(partner2UserPrefs);
                                                            console.log('🔍 DEBUG: Mapped partner2 answers:', partner2Answers);
                                                            
                                                            const result = renderQuestionComparison(
                                                                partner1Answers, 
                                                                coupleResult.compatibilityResults, 
                                                                null as any
                                                            );
                                                            console.log('🔍 DEBUG: renderQuestionComparison result length:', result?.length);
                                                            return result;
                                                        })()}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Alternative: Show detailed answers if structured differently */}
                                            {coupleResult.compatibilityResults?.questionComparisons && (
                                                <div className="mt-6">
                                                    <h4 className="text-lg font-semibold text-white mb-4">
                                                        {currentLanguage === 'ko' ? '문항별 상세 비교:' : 'Question-by-Question Comparison:'}
                                                    </h4>
                                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                                        {Object.entries(coupleResult.compatibilityResults.questionComparisons).map(([questionId, comparison]: [string, any], qIndex: number) => (
                                                            <div key={questionId} className="p-3 bg-white/5 rounded border border-white/20">
                                                                <div className="text-sm text-white/90 mb-2">
                                                                    <strong>Q{qIndex + 1}:</strong> {comparison.question || questionId}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                                    <div className="text-white/80">
                                                                        <span className="font-medium">{coupleResult.partnerNames?.partner1}:</span> {comparison.answer1}
                                                                    </div>
                                                                    <div className="text-white/80">
                                                                        <span className="font-medium">{coupleResult.partnerNames?.partner2}:</span> {comparison.answer2}
                                                                    </div>
                                                                </div>
                                                                <div className="text-center mt-2">
                                                                    <span className={`inline-flex px-2 py-1 rounded text-xs ${
                                                                        comparison.match ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                                                                    }`}>
                                                                        {comparison.match ? '✓ Match' : '✗ Different'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="mt-4 text-center">
                                                <div className="text-sm text-white/70">
                                                    {currentLanguage === 'ko' ? '완료 날짜:' : 'Completed:'} {new Date(coupleResult.completedAt || coupleResult.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Individual Test Results Section */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm text-white/70">
                                {t('results.total_completed') || 'Total tests completed'}: <span className="font-semibold">{results.filter(r => r.testId !== 'couple-compatibility-results').length}</span>
                                {!showAllResults && getFilteredResults().length < results.filter(r => r.testId !== 'couple-compatibility-results').length && (
                                    <span className="ml-2 text-white/50">
                                        ({t('results.showing_recent') || 'showing'} {getFilteredResults().length} {t('results.showing_recent') ? '' : 'recent results'})
                                    </span>
                                )}
                            </div>
                            
                            {results.filter(r => r.testId !== 'couple-compatibility-results').length > 0 && (
                                <button
                                    onClick={() => setShowAllResults(!showAllResults)}
                                    className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all duration-300 text-sm"
                                >
                                    {showAllResults 
                                        ? `📋 ${t('results.show_recent_only') || 'Show Recent Only'} (${Math.min(25, results.filter(r => r.testId !== 'couple-compatibility-results').length)})` 
                                        : `📊 ${t('results.show_all_results') || 'Show All Results'} (${results.filter(r => r.testId !== 'couple-compatibility-results').length})`
                                    }
                                </button>
                            )}
                        </div>
                        
                        {getFilteredResults().map((result) => renderTestResult(result))}
                    </div>
                )}
            </div>
        </main>
    );
}
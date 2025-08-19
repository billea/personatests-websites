"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/components/providers/translation-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserTestResults, TestResult } from "@/lib/firestore";
import { getTestById } from "@/lib/test-definitions";
import Link from "next/link";

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const { t, currentLanguage } = useTranslation();
    const router = useRouter();
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/${currentLanguage}/auth?returnUrl=/${currentLanguage}/profile`);
            return;
        }
        
        if (user) {
            loadUserData();
        }
    }, [user, authLoading, currentLanguage, router]);

    const loadUserData = async () => {
        if (!user) return;
        
        try {
            const results = await getUserTestResults(user.uid);
            setTestResults(results);
        } catch (error) {
            console.error("Error loading user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Unknown date";
        
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

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            {user.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {user.displayName || user.email?.split('@')[0] || 'User'}
                            </h1>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Member since {user.metadata.creationTime ? 
                                    new Date(user.metadata.creationTime).toLocaleDateString(currentLanguage, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Unknown'
                                }
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">
                                {testResults.length}
                            </div>
                            <div className="text-sm text-gray-500">
                                {currentLanguage === 'ko' ? '완료된 테스트' : 'Tests Completed'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link href={`/${currentLanguage}/tests`} 
                          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="text-3xl mb-3">🧠</div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {currentLanguage === 'ko' ? '새 테스트 시작' : 'Take New Test'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {currentLanguage === 'ko' ? '성격 테스트로 자신을 발견해보세요' : 'Discover yourself with personality tests'}
                            </p>
                        </div>
                    </Link>

                    <Link href={`/${currentLanguage}/results`} 
                          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="text-center">
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {currentLanguage === 'ko' ? '내 결과 보기' : 'View My Results'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {currentLanguage === 'ko' ? '지난 테스트 결과를 확인하세요' : 'Review your past test results'}
                            </p>
                        </div>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="text-center">
                            <div className="text-3xl mb-3">👥</div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {currentLanguage === 'ko' ? '360° 피드백' : '360° Feedback'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {currentLanguage === 'ko' ? '친구들로부터 피드백 받기' : 'Get feedback from friends'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Test Results */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {currentLanguage === 'ko' ? '최근 테스트 결과' : 'Recent Test Results'}
                        </h2>
                    </div>
                    
                    {testResults.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {currentLanguage === 'ko' ? '아직 완료한 테스트가 없습니다' : 'No tests completed yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {currentLanguage === 'ko' ? 
                                    '첫 번째 성격 테스트를 시작해서 자신에 대해 알아보세요!' : 
                                    'Start your first personality test to learn about yourself!'
                                }
                            </p>
                            <Link href={`/${currentLanguage}/tests`}
                                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                {currentLanguage === 'ko' ? '테스트 시작하기' : 'Start Testing'}
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {testResults.slice(0, 5).map((result) => (
                                <div key={result.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {getTestName(result.testId)}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Completed on {formatDate(result.createdAt)}
                                            </p>
                                        </div>
                                        <Link href={`/${currentLanguage}/results`}
                                              className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                            {currentLanguage === 'ko' ? '결과 보기' : 'View Result'}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            
                            {testResults.length > 5 && (
                                <div className="p-6 text-center">
                                    <Link href={`/${currentLanguage}/results`}
                                          className="text-purple-600 hover:text-purple-700 font-medium">
                                        {currentLanguage === 'ko' ? 
                                            `${testResults.length - 5}개 더 보기` : 
                                            `View ${testResults.length - 5} more`
                                        }
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
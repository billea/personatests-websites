"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useTranslation } from '@/components/providers/translation-provider';
import { useRouter } from 'next/navigation';
import { getUserTestResults } from '@/lib/firestore';
import { getTestById } from '@/lib/test-definitions';
import Link from 'next/link';

interface TestResult {
  id: string;
  testId: string;
  type?: string;
  completedAt: any;
  createdAt: any;
  scores: any;
  traits?: string[];
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { t, currentLanguage } = useTranslation();
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
            setLoadingResults(false);
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

    if (authLoading || loadingResults) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="mt-4 text-white/80">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    // Helper functions for personality insights
    const getPrimaryPersonalityType = () => {
        const mbtiResults = testResults.filter(r => r.testId === 'mbti');
        if (mbtiResults.length > 0) {
            const latest = mbtiResults[0];
            return latest.scores?.type || 'Unknown';
        }
        return null;
    };

    const getPersonalityTraits = () => {
        const bigFiveResults = testResults.filter(r => r.testId === 'big-five');
        if (bigFiveResults.length > 0) {
            return bigFiveResults[0].traits || [];
        }
        return [];
    };

    const getCompletionRate = () => {
        const totalTests = 8; // Total available tests
        return Math.round((testResults.length / totalTests) * 100);
    };

    const getRecentActivity = () => {
        return testResults
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 3);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Personality Overview */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">🧠</span>
                                {currentLanguage === 'ko' ? '성격 개요' : 'Personality Overview'}
                            </h3>

                            {getPrimaryPersonalityType() ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                        <h4 className="font-medium text-white/90 mb-2">
                                            {currentLanguage === 'ko' ? '주요 성격 유형' : 'Primary Type'}
                                        </h4>
                                        <p className="text-2xl font-bold text-purple-300">
                                            {getPrimaryPersonalityType()}
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                        <h4 className="font-medium text-white/90 mb-2">
                                            {currentLanguage === 'ko' ? '완료율' : 'Completion Rate'}
                                        </h4>
                                        <p className="text-2xl font-bold text-blue-300">
                                            {getCompletionRate()}%
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <p className="text-white/80 mb-4">
                                        {currentLanguage === 'ko' ?
                                            '아직 성격 테스트를 완료하지 않았습니다' :
                                            'No personality tests completed yet'}
                                    </p>
                                    <Link href={`/${currentLanguage}/tests`}
                                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                        {currentLanguage === 'ko' ? '첫 테스트 시작' : 'Take Your First Test'}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">📈</span>
                                {currentLanguage === 'ko' ? '최근 활동' : 'Recent Activity'}
                            </h3>

                            {getRecentActivity().length > 0 ? (
                                <div className="space-y-3">
                                    {getRecentActivity().map((result, index) => (
                                        <div key={result.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                                            <div>
                                                <p className="font-medium text-white">{getTestName(result.testId)}</p>
                                                <p className="text-sm text-white/60">{formatDate(result.createdAt)}</p>
                                            </div>
                                            <Link href={`/${currentLanguage}/results`}
                                                  className="text-purple-300 hover:text-purple-200 text-sm font-medium">
                                                {currentLanguage === 'ko' ? '보기' : 'View'}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/60 text-center py-4">
                                    {currentLanguage === 'ko' ? '활동 기록이 없습니다' : 'No recent activity'}
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'tests':
                return (
                    <div className="space-y-6">
                        {/* Test Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <div className="text-2xl font-bold text-green-300">{testResults.length}</div>
                                <div className="text-sm text-white/80">
                                    {currentLanguage === 'ko' ? '완료된 테스트' : 'Tests Completed'}
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <div className="text-2xl font-bold text-blue-300">{getCompletionRate()}%</div>
                                <div className="text-sm text-white/80">
                                    {currentLanguage === 'ko' ? '완료율' : 'Completion Rate'}
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <div className="text-2xl font-bold text-purple-300">
                                    {testResults.length > 0 ? Math.round(testResults.length / Math.max(1, Math.ceil((Date.now() - new Date(user.metadata.creationTime || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 30)))) : 0}
                                </div>
                                <div className="text-sm text-white/80">
                                    {currentLanguage === 'ko' ? '월간 평균' : 'Monthly Average'}
                                </div>
                            </div>
                        </div>

                        {/* Test History */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                {currentLanguage === 'ko' ? '테스트 기록' : 'Test History'}
                            </h3>

                            {testResults.length > 0 ? (
                                <div className="space-y-3">
                                    {testResults.map((result) => (
                                        <div key={result.id} className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white">{getTestName(result.testId)}</h4>
                                                <p className="text-sm text-white/60 mt-1">{formatDate(result.createdAt)}</p>
                                                {result.scores?.type && (
                                                    <span className="inline-block mt-2 px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded-full">
                                                        {result.scores.type}
                                                    </span>
                                                )}
                                            </div>
                                            <Link href={`/${currentLanguage}/results`}
                                                  className="text-purple-300 hover:text-purple-200 font-medium">
                                                {currentLanguage === 'ko' ? '결과 보기' : 'View Result'}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📝</div>
                                    <p className="text-white/60 mb-4">
                                        {currentLanguage === 'ko' ? '아직 완료한 테스트가 없습니다' : 'No tests completed yet'}
                                    </p>
                                    <Link href={`/${currentLanguage}/tests`}
                                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                        {currentLanguage === 'ko' ? '테스트 시작하기' : 'Start Testing'}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'insights':
                return (
                    <div className="space-y-6">
                        {/* Personality Insights */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">💡</span>
                                {currentLanguage === 'ko' ? '성격 통찰' : 'Personality Insights'}
                            </h3>

                            {getPrimaryPersonalityType() ? (
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4">
                                        <h4 className="font-semibold text-white mb-2">
                                            {currentLanguage === 'ko' ? '주요 성격 유형: ' : 'Primary Type: '}
                                            <span className="text-purple-300">{getPrimaryPersonalityType()}</span>
                                        </h4>
                                        <p className="text-white/80 text-sm">
                                            {currentLanguage === 'ko' ?
                                                'MBTI 테스트 결과를 기반으로 한 당신의 주요 성격 유형입니다.' :
                                                'Your primary personality type based on MBTI test results.'}
                                        </p>
                                    </div>

                                    {getPersonalityTraits().length > 0 && (
                                        <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg p-4">
                                            <h4 className="font-semibold text-white mb-2">
                                                {currentLanguage === 'ko' ? '성격 특성' : 'Personality Traits'}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {getPersonalityTraits().map((trait, index) => (
                                                    <span key={index} className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                                                        {trait}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🔮</div>
                                    <p className="text-white/60 mb-4">
                                        {currentLanguage === 'ko' ?
                                            '통찰을 얻으려면 더 많은 테스트를 완료하세요' :
                                            'Complete more tests to unlock personality insights'}
                                    </p>
                                    <Link href={`/${currentLanguage}/tests`}
                                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                        {currentLanguage === 'ko' ? '테스트 하러가기' : 'Take Tests'}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Growth Recommendations */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">🌱</span>
                                {currentLanguage === 'ko' ? '성장 제안' : 'Growth Recommendations'}
                            </h3>

                            <div className="space-y-3">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-2">
                                        {currentLanguage === 'ko' ? '더 많은 테스트 완료하기' : 'Complete More Tests'}
                                    </h4>
                                    <p className="text-white/70 text-sm">
                                        {currentLanguage === 'ko' ?
                                            '다양한 테스트를 통해 자신에 대한 더 깊은 이해를 얻으세요.' :
                                            'Gain deeper self-understanding through various personality assessments.'}
                                    </p>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-2">
                                        {currentLanguage === 'ko' ? '360° 피드백 받기' : 'Get 360° Feedback'}
                                    </h4>
                                    <p className="text-white/70 text-sm">
                                        {currentLanguage === 'ko' ?
                                            '친구들과 동료들로부터 피드백을 받아보세요.' :
                                            'Invite friends and colleagues to provide feedback about you.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6">
                        {/* Account Information */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">👤</span>
                                {currentLanguage === 'ko' ? '계정 정보' : 'Account Information'}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-white/10">
                                    <div>
                                        <p className="font-medium text-white">
                                            {currentLanguage === 'ko' ? '이메일' : 'Email'}
                                        </p>
                                        <p className="text-white/60 text-sm">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-white/10">
                                    <div>
                                        <p className="font-medium text-white">
                                            {currentLanguage === 'ko' ? '가입일' : 'Member Since'}
                                        </p>
                                        <p className="text-white/60 text-sm">
                                            {user.metadata.creationTime ?
                                                new Date(user.metadata.creationTime).toLocaleDateString(currentLanguage, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'Unknown'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data & Privacy */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">🔒</span>
                                {currentLanguage === 'ko' ? '데이터 및 개인정보' : 'Data & Privacy'}
                            </h3>

                            <div className="space-y-3">
                                <button className="w-full text-left bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors">
                                    <h4 className="font-medium text-white mb-1">
                                        {currentLanguage === 'ko' ? '데이터 내보내기' : 'Export My Data'}
                                    </h4>
                                    <p className="text-white/60 text-sm">
                                        {currentLanguage === 'ko' ?
                                            '테스트 결과와 개인 데이터를 다운로드하세요' :
                                            'Download your test results and personal data'}
                                    </p>
                                </button>

                                <button className="w-full text-left bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors">
                                    <h4 className="font-medium text-white mb-1">
                                        {currentLanguage === 'ko' ? '개인정보 설정' : 'Privacy Settings'}
                                    </h4>
                                    <p className="text-white/60 text-sm">
                                        {currentLanguage === 'ko' ?
                                            '프로필 공개 범위를 관리하세요' :
                                            'Manage your profile visibility and data sharing'}
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">⚡</span>
                                {currentLanguage === 'ko' ? '빠른 작업' : 'Quick Actions'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link href={`/${currentLanguage}/tests`}
                                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg p-4 transition-colors text-center">
                                    <div className="text-2xl mb-2">🧠</div>
                                    <p className="font-medium text-white">
                                        {currentLanguage === 'ko' ? '새 테스트 시작' : 'Take New Test'}
                                    </p>
                                </Link>

                                <Link href={`/${currentLanguage}/results`}
                                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg p-4 transition-colors text-center">
                                    <div className="text-2xl mb-2">📊</div>
                                    <p className="font-medium text-white">
                                        {currentLanguage === 'ko' ? '결과 보기' : 'View Results'}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Profile Header */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 mb-8">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <div className="relative">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white/30"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30">
                                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {user.displayName || user.email?.split('@')[0] || 'User'}
                            </h1>
                            <p className="text-white/80 text-lg mb-3">{user.email}</p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-white/60">
                                <span className="flex items-center gap-1">
                                    <span>📅</span>
                                    {currentLanguage === 'ko' ? '가입일: ' : 'Joined: '}
                                    {user.metadata.creationTime ?
                                        new Date(user.metadata.creationTime).toLocaleDateString(currentLanguage, {
                                            year: 'numeric',
                                            month: 'short'
                                        }) : 'Unknown'
                                    }
                                </span>
                                <span className="flex items-center gap-1">
                                    <span>🏆</span>
                                    {testResults.length} {currentLanguage === 'ko' ? '테스트 완료' : 'tests completed'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span>📈</span>
                                    {getCompletionRate()}% {currentLanguage === 'ko' ? '완료율' : 'completion'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link href={`/${currentLanguage}/tests`}
                                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                                {currentLanguage === 'ko' ? '새 테스트' : 'New Test'}
                            </Link>
                            <Link href={`/${currentLanguage}/results`}
                                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm">
                                {currentLanguage === 'ko' ? '결과 보기' : 'View Results'}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
                    <div className="flex flex-wrap">
                        {[
                            { id: 'overview', label: currentLanguage === 'ko' ? '개요' : 'Overview', icon: '🏠' },
                            { id: 'tests', label: currentLanguage === 'ko' ? '테스트' : 'Tests', icon: '📝' },
                            { id: 'insights', label: currentLanguage === 'ko' ? '통찰' : 'Insights', icon: '💡' },
                            { id: 'settings', label: currentLanguage === 'ko' ? '설정' : 'Settings', icon: '⚙️' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-white/20 text-white border-b-2 border-purple-400'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </div>
    );
}
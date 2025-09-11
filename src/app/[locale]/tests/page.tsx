"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/components/providers/translation-provider";
import { testDefinitions, getAllCategories } from "@/lib/test-definitions";

export default function TestsPage() {
    const pathname = usePathname();
    const { t, currentLanguage } = useTranslation();
    
    const categories = getAllCategories();
    
    
    const getCategoryTitle = (category: string) => {
        if (currentLanguage === 'ko') {
            switch(category) {
                case 'know-yourself': return '나를 알아가기';
                case 'how-others-see-me': return '남들이 나를 어떻게 보는지';
                case 'couple-compatibility': return '커플 궁합';
                default: return category;
            }
        }
        switch(category) {
            case 'know-yourself': return 'Know Yourself';
            case 'how-others-see-me': return 'How Others See Me';
            case 'couple-compatibility': return 'Couple Compatibility';
            default: return category;
        }
    };
    
    const getCategoryDescription = (category: string) => {
        if (currentLanguage === 'ko') {
            switch(category) {
                case 'know-yourself': return '당신의 성격 특성과 강점을 발견하세요';
                case 'how-others-see-me': return '친구와 동료들로부터 피드백을 받으세요';
                case 'couple-compatibility': return '파트너와의 관계 역학을 분석해보세요';
                default: return '';
            }
        }
        switch(category) {
            case 'know-yourself': return 'Discover your personality traits and strengths';
            case 'how-others-see-me': return 'Get feedback from friends and colleagues';
            case 'couple-compatibility': return 'Analyze relationship dynamics with your partner';
            default: return '';
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600">
            <main className="container mx-auto px-4 py-8">
                <div className="w-full max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-white">
                        {t('tests.page_title') !== 'tests.page_title' ? t('tests.page_title') : 'Personality Tests'} ✨
                    </h1>
                
                {categories.map(category => {
                    const testsInCategory = testDefinitions.filter(test => test.category === category);
                    
                    return (
                        <div key={category} className="mb-12">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2 text-white">
                                    {getCategoryTitle(category)}
                                </h2>
                                <p className="text-white/80">
                                    {getCategoryDescription(category)}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {testsInCategory.map(test => (
                                    <Link key={test.id} href={`${pathname}/${test.id}`}>
                                        <div className="block p-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg hover:bg-white/30 cursor-pointer transition-all duration-300 transform hover:scale-105 h-full">
                                            <h3 className="mb-3 text-xl font-bold tracking-tight text-white">
                                                {t(test.title_key)}
                                            </h3>
                                            <p className="text-white/90 text-sm mb-4">
                                                {t(test.description_key)}
                                            </p>
                                            
                                            {test.features && (
                                                <div className="mb-4 space-y-3 text-sm">
                                                    {/* Popularity */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/80 font-medium">Popularity</span>
                                                        <div className="flex items-center space-x-1">
                                                            {Array.from({length: 5}, (_, i) => (
                                                                <span key={i} className={`text-lg ${i < (test.features?.popularity || 0) ? 'text-yellow-400' : 'text-white/30'}`}>
                                                                    ⭐
                                                                </span>
                                                            ))}
                                                            {test.features?.popularityNote && (
                                                                <span className="text-white/60 text-xs ml-1">
                                                                    {test.features.popularityNote}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Scientific Validity */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/80 font-medium">Scientific Validity</span>
                                                        <div className="flex items-center space-x-1">
                                                            {Array.from({length: 5}, (_, i) => (
                                                                <span key={i} className={`text-lg ${i < (test.features?.scientificValidity || 0) ? 'text-yellow-400' : 'text-white/30'}`}>
                                                                    ⭐
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Results */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/80 font-medium">Results</span>
                                                        <span className="text-white text-xs">{test.features?.resultType}</span>
                                                    </div>
                                                    
                                                    {/* Test Length */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/80 font-medium">Test Length</span>
                                                        <span className="text-white text-xs">{test.features?.testLength}</span>
                                                    </div>
                                                    
                                                    {/* Engagement */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/80 font-medium">Engagement</span>
                                                        <span className="text-white text-xs">{test.features?.engagement}</span>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {test.requiresFeedback && (
                                                    <span className="px-3 py-1 text-xs bg-blue-500/80 text-white rounded-full backdrop-blur-sm">
                                                        {t('tests.requires_feedback') !== 'tests.requires_feedback' ? t('tests.requires_feedback') : 'Requires Feedback'}
                                                    </span>
                                                )}
                                                
                                                {test.isCompatibilityTest && (
                                                    <span className="px-3 py-1 text-xs bg-pink-500/80 text-white rounded-full backdrop-blur-sm">
                                                        {t('tests.compatibility_test') !== 'tests.compatibility_test' ? t('tests.compatibility_test') : 'Compatibility Test'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
                </div>
            </main>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 text-4xl animate-bounce opacity-50">✨</div>
            <div className="absolute top-40 left-10 text-6xl animate-pulse opacity-30">🌟</div>
            <div className="absolute bottom-20 right-20 text-3xl animate-bounce opacity-40 delay-1000">💫</div>
            <div className="absolute bottom-40 left-16 text-4xl animate-pulse opacity-30 delay-500">💡</div>
        </div>
    );
}

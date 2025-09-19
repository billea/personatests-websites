"use client";

import { useTranslation } from "@/components/providers/translation-provider";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";

export default function Home() {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 relative overflow-hidden">
      {/* Hero Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Particles */}
        <div className="absolute inset-0 bg-radial-gradient opacity-60 animate-pulse"></div>
        
        {/* Floating Icons */}
        <div className="floating-icon absolute top-20 left-20 text-4xl opacity-60 animate-float">🧠</div>
        <div className="floating-icon absolute top-32 right-32 text-3xl opacity-50 animate-float" style={{animationDelay: '2s'}}>💫</div>
        <div className="floating-icon absolute top-64 left-1/4 text-5xl opacity-40 animate-float" style={{animationDelay: '4s'}}>✨</div>
        <div className="floating-icon absolute top-80 right-20 text-4xl opacity-50 animate-float" style={{animationDelay: '1s'}}>🔮</div>
        <div className="floating-icon absolute bottom-40 left-16 text-3xl opacity-60 animate-float" style={{animationDelay: '3s'}}>🌟</div>
        <div className="floating-icon absolute bottom-20 right-1/4 text-4xl opacity-40 animate-float" style={{animationDelay: '5s'}}>💡</div>
      </div>



      {/* Hero Section */}
      <div className="relative z-10 flex items-center min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center bg-white/15 border border-white/20 backdrop-blur-xl rounded-full px-6 py-3 mb-8 shadow-xl animate-slideInDown">
              <span className="text-yellow-400 mr-2 animate-pulse text-xl">🔥</span>
              <span className="font-semibold text-lg" data-translate="hero.badge">{t('hero.badge') || 'Most Accurate Personality Tests'}</span>
            </div>

            {/* Main Title with Advanced Typography */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-none animate-slideInUp">
              <span className="block text-white drop-shadow-2xl mb-2" data-translate="hero.title">
                {t('hero.title') || 'Discover Your'}
              </span>
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500 bg-clip-text text-transparent font-black drop-shadow-2xl" data-translate="hero.title_accent">
                {t('hero.title_accent') || 'True Self'}
              </span>
              <span className="inline-block text-6xl animate-spin-slow ml-4">✨</span>
            </h1>

            {/* Enhanced Subtitle */}
            <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed animate-slideInUp opacity-90" data-translate="hero.subtitle" style={{animationDelay: '0.2s'}}>
              {t('hero.subtitle') || 'Discover your personality with scientifically-backed tests! MBTI, Big Five, and trending tests. Check your vibe today! 🔥'}
            </p>

            {/* Enhanced CTA Button - Single Primary Action */}
            <div className="flex justify-center mb-16 animate-slideInUp" style={{animationDelay: '0.4s'}}>
              <Link 
                href={`/${currentLanguage}/tests`}
                className="group relative inline-flex items-center bg-white text-purple-600 font-bold text-xl px-10 py-5 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative" data-translate="hero.startJourney">{t('hero.startJourney') || '여정을 시작하세요'}</span>
                <svg className="ml-3 w-6 h-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Enhanced Stats with Glassmorphism */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-slideInUp" style={{animationDelay: '0.6s'}}>
              <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-3xl md:text-4xl font-black text-white mb-2 bg-gradient-to-br from-yellow-300 to-orange-400 bg-clip-text text-transparent">Multiple</div>
                <div className="text-white/90 font-semibold" data-translate="hero.stats.tests">{t('hero.stats.tests') || 'Personality Tests'}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-3xl md:text-4xl font-black text-white mb-2 bg-gradient-to-br from-yellow-300 to-orange-400 bg-clip-text text-transparent">Global</div>
                <div className="text-white/90 font-semibold" data-translate="hero.stats.languages">{t('hero.stats.languages') || 'Languages'}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-3xl md:text-4xl font-black text-white mb-2 bg-gradient-to-br from-yellow-300 to-orange-400 bg-clip-text text-transparent">Free</div>
                <div className="text-white/90 font-semibold" data-translate="hero.stats.access">{t('hero.stats.access') || 'Always Free'}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-3xl md:text-4xl font-black text-white mb-2 bg-gradient-to-br from-yellow-300 to-orange-400 bg-clip-text text-transparent">100%</div>
                <div className="text-white/90 font-semibold" data-translate="hero.stats.private">{t('hero.stats.private') || 'Private'}</div>
              </div>
            </div>

            {/* Enhanced Feature Tags */}
            <div className="flex flex-wrap justify-center gap-3 animate-slideInUp" style={{animationDelay: '0.8s'}}>
              <div className="flex items-center bg-white/8 border border-white/15 backdrop-blur-xl rounded-full px-5 py-3 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="mr-2 text-xl">🔬</span>
                <span className="font-semibold" data-translate="hero.features.scientific">{t('hero.features.scientific') || 'Science-Based'}</span>
              </div>
              <div className="flex items-center bg-white/8 border border-white/15 backdrop-blur-xl rounded-full px-5 py-3 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="mr-2 text-xl">⚡</span>
                <span className="font-semibold" data-translate="hero.features.instant">{t('hero.features.instant') || 'Instant Results'}</span>
              </div>
              <div className="flex items-center bg-white/8 border border-white/15 backdrop-blur-xl rounded-full px-5 py-3 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="mr-2 text-xl">🎯</span>
                <span className="font-semibold" data-translate="hero.features.personalized">{t('hero.features.personalized') || '100% Personalized'}</span>
              </div>
              <div className="flex items-center bg-white/8 border border-white/15 backdrop-blur-xl rounded-full px-5 py-3 hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="mr-2 text-xl">🔒</span>
                <span className="font-semibold" data-translate="hero.features.private">{t('hero.features.private') || 'Completely Private'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/components/providers/translation-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { getEnabledLanguages, LanguageConfig, isUserAdmin } from "@/lib/firestore";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { t, currentLanguage } = useTranslation();
    const { user, loading: authLoading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [enabledLanguages, setEnabledLanguages] = useState<LanguageConfig[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    // Extract locale from pathname
    const locale = pathname.split('/')[1] || 'en';

    // Load enabled languages from admin settings
    useEffect(() => {
        const loadEnabledLanguages = async () => {
            try {
                const languages = await getEnabledLanguages();
                setEnabledLanguages(languages);
            } catch (error) {
                console.error('Error loading enabled languages:', error);
                // Fallback to English only
                setEnabledLanguages([{
                    code: 'en',
                    name: 'English',
                    flag: '🇺🇸',
                    isEnabled: true,
                    isDefault: true,
                    completionPercentage: 100,
                    lastUpdated: new Date() as any
                }]);
            }
        };

        loadEnabledLanguages();
    }, []);

    // Check admin role
    useEffect(() => {
        const checkAdminRole = async () => {
            if (user && !authLoading) {
                try {
                    const adminStatus = await isUserAdmin(user.uid);
                    setIsAdmin(adminStatus);
                } catch (error) {
                    console.error('Error checking admin role:', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };

        checkAdminRole();
    }, [user, authLoading]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log('User signed out successfully');
            router.push(`/${locale}`);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleLanguageSwitch = (newLang: string) => {
        router.push(`/${newLang}`);
        setIsLanguageDropdownOpen(false);
    };

    const currentLang = enabledLanguages.find(lang => lang.code === currentLanguage) ||
                      enabledLanguages.find(lang => lang.isDefault) ||
                      enabledLanguages[0] ||
                      { code: 'en', name: 'English', flag: '🇺🇸' };

    // Don't render header while auth is loading
    if (authLoading) {
        return null;
    }

    return (
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link 
                            href={`/${locale}`}
                            className="text-xl font-bold text-purple-600 hover:text-purple-700 transition-colors flex items-center"
                        >
                            <span className="mr-2">✨</span>
                            {currentLanguage === 'ko' ? '성격테스트' : 'PersonaTests'}
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            href={`/${locale}`}
                            className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                                pathname === `/${locale}` || pathname === '/' 
                                    ? 'text-purple-600 bg-purple-50' 
                                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                            }`}
                        >
                            {currentLanguage === 'ko' ? '홈' : 'Home'}
                        </Link>
                        
                        <Link 
                            href={`/${locale}/tests`}
                            className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                                pathname.includes('/tests') 
                                    ? 'text-purple-600 bg-purple-50' 
                                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                            }`}
                        >
                            {currentLanguage === 'ko' ? '테스트' : 'Tests'}
                        </Link>
                        
                        <Link
                            href={`/${locale}/results`}
                            className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                                pathname.includes('/results')
                                    ? 'text-purple-600 bg-purple-50'
                                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                            }`}
                        >
                            {currentLanguage === 'ko' ? '결과' : 'Results'}
                        </Link>

                        <Link
                            href={`/${locale}/contact`}
                            className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                                pathname.includes('/contact')
                                    ? 'text-purple-600 bg-purple-50'
                                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                            }`}
                        >
                            {currentLanguage === 'ko' ? '문의하기' : 'Contact'}
                        </Link>

                        {user && (
                            <Link
                                href={`/${locale}/profile`}
                                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                                    pathname.includes('/profile')
                                        ? 'text-purple-600 bg-purple-50'
                                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                }`}
                            >
                                {currentLanguage === 'ko' ? '프로필' : 'Profile'}
                            </Link>
                        )}

                        {user && isAdmin && (
                            <Link
                                href={`/${locale}/admin`}
                                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg border-2 border-orange-200 ${
                                    pathname.includes('/admin')
                                        ? 'text-orange-700 bg-orange-50 border-orange-300'
                                        : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 hover:border-orange-300'
                                }`}
                            >
                                ⚙️ {currentLanguage === 'ko' ? '관리' : 'Admin'}
                            </Link>
                        )}
                    </div>

                    {/* Right Section - Language Selector & User Menu */}
                    <div className="flex items-center space-x-4">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <span>{currentLang.flag}</span>
                                <span className="hidden sm:block">{currentLang.code.toUpperCase()}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Language Dropdown */}
                            {isLanguageDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    {enabledLanguages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageSwitch(lang.code)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 flex items-center space-x-3 ${
                                                currentLanguage === lang.code ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                                            }`}
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Section */}
                        {user ? (
                            /* Authenticated User */
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:block text-right">
                                    <div className="text-sm text-gray-500">
                                        {currentLanguage === 'ko' ? '안녕하세요!' : 'Hello!'}
                                    </div>
                                    <div className="text-sm font-semibold text-gray-800">
                                        {user.displayName || user.email?.split('@')[0] || 'User'}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-full transition-colors group"
                                    title={currentLanguage === 'ko' ? '로그아웃' : 'Sign out'}
                                >
                                    {user.photoURL ? (
                                        <img 
                                            src={user.photoURL} 
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                    <span className="hidden sm:block text-xs text-gray-500 group-hover:text-purple-600">
                                        {currentLanguage === 'ko' ? '로그아웃' : 'Sign out'}
                                    </span>
                                </button>
                            </div>
                        ) : (
                            /* Not Authenticated */
                            <Link
                                href={`/${locale}/auth`}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                {currentLanguage === 'ko' ? '로그인' : 'Sign In'}
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex flex-col space-y-2">
                            <Link 
                                href={`/${locale}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    pathname === `/${locale}` || pathname === '/' 
                                        ? 'text-purple-600 bg-purple-50' 
                                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                }`}
                            >
                                {currentLanguage === 'ko' ? '홈' : 'Home'}
                            </Link>
                            
                            <Link 
                                href={`/${locale}/tests`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    pathname.includes('/tests') 
                                        ? 'text-purple-600 bg-purple-50' 
                                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                }`}
                            >
                                {currentLanguage === 'ko' ? '테스트' : 'Tests'}
                            </Link>
                            
                            <Link
                                href={`/${locale}/results`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    pathname.includes('/results')
                                        ? 'text-purple-600 bg-purple-50'
                                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                }`}
                            >
                                {currentLanguage === 'ko' ? '결과' : 'Results'}
                            </Link>

                            <Link
                                href={`/${locale}/contact`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    pathname.includes('/contact')
                                        ? 'text-purple-600 bg-purple-50'
                                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                }`}
                            >
                                {currentLanguage === 'ko' ? '문의하기' : 'Contact'}
                            </Link>

                            {user && (
                                <Link
                                    href={`/${locale}/profile`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        pathname.includes('/profile')
                                            ? 'text-purple-600 bg-purple-50'
                                            : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {currentLanguage === 'ko' ? '프로필' : 'Profile'}
                                </Link>
                            )}

                            {user && isAdmin && (
                                <Link
                                    href={`/${locale}/admin`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border-2 border-orange-200 ${
                                        pathname.includes('/admin')
                                            ? 'text-orange-700 bg-orange-50 border-orange-300'
                                            : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 hover:border-orange-300'
                                    }`}
                                >
                                    ⚙️ {currentLanguage === 'ko' ? '관리' : 'Admin'}
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Close dropdown when clicking outside */}
            {isLanguageDropdownOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLanguageDropdownOpen(false)}
                />
            )}
        </header>
    );
}
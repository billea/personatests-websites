"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/components/providers/translation-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { t, currentLanguage } = useTranslation();
    const { user, loading: authLoading } = useAuth();

    // Extract locale from pathname
    const locale = pathname.split('/')[1] || 'en';

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log('User signed out successfully');
            router.push(`/${locale}`);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

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
                            className="text-xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
                        >
                            {currentLanguage === 'ko' ? '성격 테스트' : 'PersonaTests'}
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link 
                            href={`/${locale}/tests`}
                            className={`text-sm font-medium transition-colors ${
                                pathname.includes('/tests') 
                                    ? 'text-purple-600 border-b-2 border-purple-600' 
                                    : 'text-gray-600 hover:text-purple-600'
                            }`}
                        >
                            {currentLanguage === 'ko' ? '테스트' : 'Tests'}
                        </Link>
                        
                        <Link 
                            href={`/${locale}/results`}
                            className={`text-sm font-medium transition-colors ${
                                pathname.includes('/results') 
                                    ? 'text-purple-600 border-b-2 border-purple-600' 
                                    : 'text-gray-600 hover:text-purple-600'
                            }`}
                        >
                            {currentLanguage === 'ko' ? '결과' : 'Results'}
                        </Link>
                    </div>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            /* Authenticated User Greeting */
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">
                                        {currentLanguage === 'ko' ? '안녕하세요!' : 'Hello!'}
                                    </div>
                                    <div className="text-sm font-semibold text-gray-800">
                                        {user.displayName || user.email?.split('@')[0] || 'User'}
                                    </div>
                                </div>
                                
                                {/* User Avatar */}
                                <div className="relative">
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
                                        <span className="text-xs text-gray-500 group-hover:text-purple-600">
                                            {currentLanguage === 'ko' ? '로그아웃' : 'Sign out'}
                                        </span>
                                    </button>
                                </div>
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
                    </div>
                </div>
            </div>
        </header>
    );
}
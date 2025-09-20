"use client";

import { useTranslation } from '@/components/providers/translation-provider';
import { useAuth } from '@/components/providers/auth-provider';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllContactMessages, getContactMessagesByStatus, isUserAdmin, getLanguageConfigs, updateLanguageConfig, initializeLanguageConfigs, LanguageConfig } from '@/lib/firestore';

export default function AdminPage() {
  const { t, currentLanguage } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [messageStats, setMessageStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    resolved: 0
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [languageConfigs, setLanguageConfigs] = useState<LanguageConfig[]>([]);
  const [languageLoading, setLanguageLoading] = useState(true);

  const locale = currentLanguage;

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user && !authLoading) {
        try {
          const adminStatus = await isUserAdmin(user.uid);
          setIsAdmin(adminStatus);
          if (adminStatus) {
            loadMessageStats();
            loadLanguageConfigs();
          }
        } catch (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        }
      }
      setAdminLoading(false);
    };

    checkAdminRole();
  }, [user, authLoading]);

  const loadMessageStats = async () => {
    try {
      const [allMessages, newMessages, readMessages, resolvedMessages] = await Promise.allSettled([
        getAllContactMessages(),
        getContactMessagesByStatus('new'),
        getContactMessagesByStatus('read'),
        getContactMessagesByStatus('resolved')
      ]);

      setMessageStats({
        total: allMessages.status === 'fulfilled' ? allMessages.value.length : 0,
        new: newMessages.status === 'fulfilled' ? newMessages.value.length : 0,
        read: readMessages.status === 'fulfilled' ? readMessages.value.length : 0,
        resolved: resolvedMessages.status === 'fulfilled' ? resolvedMessages.value.length : 0
      });
    } catch (error) {
      console.error('Error loading message stats:', error);
    }
  };

  const loadLanguageConfigs = async () => {
    try {
      setLanguageLoading(true);
      let configs = await getLanguageConfigs();

      // Initialize language configs if empty
      if (configs.length === 0) {
        await initializeLanguageConfigs();
        configs = await getLanguageConfigs();
      }

      setLanguageConfigs(configs);
    } catch (error) {
      console.error('Error loading language configs:', error);
    } finally {
      setLanguageLoading(false);
    }
  };

  const handleLanguageToggle = async (configId: string, isEnabled: boolean) => {
    try {
      await updateLanguageConfig(configId, { isEnabled });
      await loadLanguageConfigs(); // Reload configs
    } catch (error) {
      console.error('Error updating language config:', error);
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('admin.access.required') || 'Admin Access Required'}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('admin.access.privileges') || 'You need admin privileges to access this page.'}
          </p>
          <Link
            href={`/${locale}/auth`}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {currentLanguage === 'ko' ? '로그인' : 'Sign In'}
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('admin.access.denied') || 'Access Denied'}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('admin.access.admin_only') || 'You need administrator privileges to access this page.'}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {currentLanguage === 'ko' ? '홈으로' : 'Go Home'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.dashboard.title') || 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600">
            {t('admin.dashboard.subtitle') || 'Manage your personality testing platform'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{messageStats.total}</div>
                <div className="text-sm text-gray-600">Total Messages</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{messageStats.new}</div>
                <div className="text-sm text-gray-600">New Messages</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{messageStats.read}</div>
                <div className="text-sm text-gray-600">Read Messages</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{messageStats.resolved}</div>
                <div className="text-sm text-gray-600">Resolved Messages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Messages */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('admin.dashboard.messages_title') || 'Contact Messages'}
                </h2>
                <p className="text-gray-600">
                  {t('admin.dashboard.messages_desc') || 'Manage user inquiries and feedback'}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Messages</span>
                <span className="font-medium">{messageStats.total}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-600">⭕ New</span>
                <span className="font-medium text-red-600">{messageStats.new}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-yellow-600">👁️ Read</span>
                <span className="font-medium text-yellow-600">{messageStats.read}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600">✅ Resolved</span>
                <span className="font-medium text-green-600">{messageStats.resolved}</span>
              </div>
            </div>

            <Link
              href={`/${locale}/admin/messages`}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center block"
            >
              {t('admin.dashboard.manage_messages') || 'Manage Messages'}
            </Link>
          </div>

          {/* Question Management */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('admin.dashboard.questions_title') || 'Question Management'}
                </h2>
                <p className="text-gray-600">
                  {t('admin.dashboard.questions_desc') || 'Manage test questions and content'}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm text-gray-600">
                {t('admin.dashboard.questions_features') || 'Features:'}
              </div>
              <ul className="text-sm space-y-1 text-gray-600 ml-4">
                <li>• Add new test questions</li>
                <li>• Edit existing questions</li>
                <li>• Manage question categories</li>
                <li>• Translation management</li>
              </ul>
            </div>

            <Link
              href={`/${locale}/admin/questions`}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-center block"
            >
              {t('admin.dashboard.manage_questions') || 'Manage Questions'}
            </Link>
          </div>
        </div>

        {/* Language Management Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('admin.dashboard.languages_title') || 'Language Management'}
              </h2>
              <p className="text-gray-600">
                {t('admin.dashboard.languages_desc') || 'Control which languages are available to users'}
              </p>
            </div>
          </div>

          {languageLoading ? (
            <div className="text-center py-4">
              <div className="text-gray-600">Loading language configurations...</div>
            </div>
          ) : (
            <div className="space-y-3">
              {languageConfigs.map((config) => (
                <div
                  key={config.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                    config.isEnabled
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{config.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {config.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {config.code.toUpperCase()} • {config.completionPercentage}% complete
                        {config.isDefault && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`text-sm font-medium ${
                      config.isEnabled ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {config.isEnabled ? 'Available' : 'Disabled'}
                    </div>

                    {!config.isDefault && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.isEnabled}
                          onChange={(e) => handleLanguageToggle(config.id!, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 mb-1">Language Launch Strategy</div>
                    <div className="text-blue-700">
                      Start with English only for initial launch. Enable other languages after thorough testing.
                      Completion percentages show translation readiness.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('admin.dashboard.quick_actions') || 'Quick Actions'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/${locale}/admin/messages?filter=new`}
              className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View New Messages ({messageStats.new})
            </Link>

            <Link
              href={`/${locale}/tests`}
              className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Tests
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
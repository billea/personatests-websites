"use client";

import { useTranslation } from "@/components/providers/translation-provider";
import { useParams } from "next/navigation";

export default function TestTranslationPage() {
    const { t, currentLanguage } = useTranslation();
    const params = useParams();
    const locale = params.locale as string;

    const testKeys = [
        'feedback360.ui.title',
        'feedback360.ui.instructions', 
        'feedback360.universal.q1',
        'feedback360.general.q11',
        'feedback360.ui.scale_labels.not_at_all',
        'feedback360.ui.scale_labels.always'
    ];

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Translation System Test</h1>
                
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">System Info</h2>
                    <div className="space-y-2">
                        <p><strong>URL Locale:</strong> {locale}</p>
                        <p><strong>Current Language:</strong> {currentLanguage}</p>
                        <p><strong>Is Korean:</strong> {locale === 'ko' || currentLanguage === 'ko' ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Translation Key Tests</h2>
                    <div className="space-y-4">
                        {testKeys.map(key => {
                            const translated = t(key);
                            const isWorking = translated && translated !== key;
                            
                            return (
                                <div key={key} className={`p-4 rounded border ${isWorking ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`w-3 h-3 rounded-full ${isWorking ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <strong>{key}</strong>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">Raw result: "{translated}"</p>
                                    <p className="text-sm">
                                        Status: {isWorking ? 
                                            <span className="text-green-600 font-medium">✅ Working</span> : 
                                            <span className="text-red-600 font-medium">❌ Showing key instead of translation</span>
                                        }
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow mt-6">
                    <h2 className="text-xl font-semibold mb-4">Direct Translation Test</h2>
                    <div className="space-y-2">
                        <p><strong>Title (should be "Feedback Request" or "피드백 요청"):</strong><br />
                        "{t('feedback360.ui.title') || 'NOT FOUND'}"</p>
                        
                        <p><strong>Question 1 (universal):</strong><br />
                        "{t('feedback360.universal.q1') || 'NOT FOUND'}"</p>
                        
                        <p><strong>Question 11 (general):</strong><br />
                        "{t('feedback360.general.q11') || 'NOT FOUND'}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
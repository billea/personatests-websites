// Enhanced translation engine with cache-busting and debugging
// Updated: 2025-10-01 for translation debugging - cache bust v5 FINAL FIX
export class TranslationEngine {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'en';
    }

    async init(defaultLang = 'en') {
        console.log('☢️ NUCLEAR BYPASS TranslationEngine v8-NUCLEAR-CACHE-BYPASS-2025-10-04 init called with defaultLang:', defaultLang);
        
        // 1. Always load English as the ultimate fallback.
        await this.loadLanguage('en');

        // 2. Determine the user's preferred language.
        // Prioritize the defaultLang parameter (from URL) over stored preferences
        const userLang = defaultLang || localStorage.getItem('selectedLanguage') || navigator.language.split('-')[0] || 'en';
        
        console.log('TranslationEngine using language:', userLang);
        
        // 3. Load the preferred language if it's not English.
        if (userLang !== 'en') {
            await this.loadLanguage(userLang);
        }
        this.currentLanguage = userLang;

        // 4. Apply translations to the entire document.
        this.applyAll();

        // 5. Watch for future changes to the DOM and apply translations automatically.
        this.observeDOMChanges();
    }

    async loadLanguage(lang) {
        // Force reload translations every time for development - remove this check
        // if (this.translations[lang]) {
        //     console.log(`Language ${lang} already loaded`);
        //     return; // Already loaded
        // }
        try {
            // NUCLEAR CACHE BYPASS - Force complete browser refresh with special URL
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            const sessionId = Math.random().toString(36).substring(2);
            const cacheBuster = `nuclear-${timestamp}-${random}-${sessionId}`;
            const url = `/translations/${lang}.json?nuclear=${cacheBuster}&bypass=${timestamp}&session=${sessionId}&force=reload&cache=false`;
            console.log(`🚨 EMERGENCY CACHE BYPASS Loading language ${lang} from:`, url);
            const response = await fetch(url, {
                cache: 'no-cache',  // Force no cache
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            if (!response.ok) throw new Error(`Failed to load ${lang}.json: ${response.status} ${response.statusText}`);
            const data = await response.json();
            this.translations[lang] = data;
            console.log(`Successfully loaded ${lang} with ${Object.keys(data).length} top-level keys`);

            // Debug compatibility keys specifically
            if (data.results && data.results.dimensions) {
                console.log(`🔍 COMPATIBILITY KEYS CHECK:`, {
                    compatibilityExists: !!data.results.dimensions.compatibility,
                    personalityExists: !!data.results.dimensions.personality,
                    compatibilityValue: data.results.dimensions.compatibility,
                    personalityValue: data.results.dimensions.personality
                });
            }

        } catch (error) {
            console.error(`Error loading language ${lang}:`, error);
            // If a language fails to load, we'll fall back to English, which is already loaded.
        }
    }

    async setLanguage(lang) {
        await this.loadLanguage(lang);
        this.currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        this.applyAll();
    }

    // The core translation function.
    t(key) {
        // Nuclear cache bypass debug marker
        if (key === 'results.strengths') {
            console.log('☢️ NUCLEAR BYPASS TRANSLATION ENGINE LOADED - v8-NUCLEAR-CACHE-BYPASS-2025-10-04');
        }

        // Ensure translations are loaded
        if (!this.translations[this.currentLanguage] && !this.translations['en']) {
            console.warn(`Translation files not loaded yet for key: ${key}`);
            return key;
        }


        // Get the value from the current language's dictionary.
        let value = key.split('.').reduce((obj, k) => obj?.[k], this.translations[this.currentLanguage]);

        // If not found, fall back to English.
        if (value === undefined) {
            value = key.split('.').reduce((obj, k) => obj?.[k], this.translations['en']);

            // Debug missing keys - enhanced debugging
            if (value === undefined) {
                console.log(`🔍 Translation missing for key: ${key} in language: ${this.currentLanguage}`);
                console.log(`🔍 Available languages:`, Object.keys(this.translations));
                console.log(`🔍 Translation objects:`, {
                    currentLangExists: !!this.translations[this.currentLanguage],
                    englishExists: !!this.translations['en'],
                    currentLangKeys: this.translations[this.currentLanguage] ? Object.keys(this.translations[this.currentLanguage]) : 'none',
                    englishKeys: this.translations['en'] ? Object.keys(this.translations['en']) : 'none'
                });
                console.log('🔍 FULL RESULTS OBJECT:', this.translations['en']?.results);
                console.log('🔍 STRENGTHS KEY:', this.translations['en']?.results?.strengths);
                console.log('🔍 STRENGTH PREFIX KEY:', this.translations['en']?.results?.strengthPrefix);

                if (key.includes('results.dimensions')) {
                    console.log(`🔍 DEBUG results.dimensions structure for key: ${key}:`, {
                        fullKey: key,
                        keyParts: key.split('.'),
                        lastPart: key.split('.').pop(),
                        currentLang: this.translations[this.currentLanguage]?.results,
                        english: this.translations['en']?.results,
                        dimensionsExist: !!this.translations['en']?.results?.dimensions,
                        dimensionsKeys: Object.keys(this.translations['en']?.results?.dimensions || {}),
                        specificKeyTest: this.translations['en']?.results?.dimensions?.[key.split('.').pop()],
                        fullLookupResult: key.split('.').reduce((obj, k) => obj?.[k], this.translations['en']),
                        fullTranslationObj: this.translations['en']
                    });

                    // Special check for couple compatibility keys
                    if (key === 'results.dimensions.compatibility' || key === 'results.dimensions.personality') {
                        console.log(`🚨 COUPLE COMPATIBILITY KEY DEBUG for ${key}:`, {
                            translationsLoaded: !!this.translations['en'],
                            resultsExist: !!this.translations['en']?.results,
                            dimensionsExist: !!this.translations['en']?.results?.dimensions,
                            compatibilityKey: this.translations['en']?.results?.dimensions?.compatibility,
                            personalityKey: this.translations['en']?.results?.dimensions?.personality,
                            allDimensionKeys: this.translations['en']?.results?.dimensions ? Object.keys(this.translations['en'].results.dimensions) : 'none',
                            firstFewDimensionEntries: this.translations['en']?.results?.dimensions ? Object.entries(this.translations['en'].results.dimensions).slice(0, 10) : 'none',
                            rawDimensionsObject: this.translations['en']?.results?.dimensions
                        });

                        // Test if the keys might be named differently
                        const dims = this.translations['en']?.results?.dimensions;
                        if (dims) {
                            console.log('🔍 SEARCHING FOR COMPATIBILITY KEYS:', {
                                hasCompatibility: 'compatibility' in dims,
                                hasPersonality: 'personality' in dims,
                                compatibilityVariants: [
                                    dims['compatibility'],
                                    dims['Compatibility'],
                                    dims['COMPATIBILITY'],
                                    dims['compatibility-readiness'],
                                    dims['compatibilityReadiness']
                                ],
                                personalityVariants: [
                                    dims['personality'],
                                    dims['Personality'],
                                    dims['PERSONALITY'],
                                    dims['personality-score'],
                                    dims['personalityScore']
                                ]
                            });
                        }
                    }
                }
            }
        }

        // If still not found, return the key itself as a fallback.
        return value || key;
    }

    // Expose the full translations object for the current language
    getTranslations() {
        return this.translations[this.currentLanguage] || this.translations['en'] || {};
    }

    // Apply translations to all `[data-translate]` elements in a given container.
    applyAll(container = document.body) {
        container.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = this.t(key);
        });
    }

    // This is the magic for handling dynamically added content.
    observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // When a new element is added, check if it or its children need translation.
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        this.applyAll(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// The engine is now initialized and managed by TranslationProvider.tsx

// EMERGENCY LANGUAGE SELECTOR FIX
// This will override any existing language functionality

console.log('🚨 EMERGENCY LANGUAGE FIX LOADING...');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageFix);
} else {
    initializeLanguageFix();
}

function initializeLanguageFix() {
    console.log('🔧 Initializing language fix...');
    
    // Override the global changeLanguage function
    window.changeLanguage = function(langCode) {
        console.log('🌍 Language change requested:', langCode);
        
        // Update current language
        window.currentLanguage = langCode;
        
        // Save to localStorage
        localStorage.setItem('preferredLanguage', langCode);
        console.log('💾 Language saved to localStorage');
        
        // Get translation object
        if (typeof translations === 'undefined') {
            console.error('❌ Translations object not found!');
            return;
        }
        
        const lang = translations[langCode];
        if (!lang) {
            console.error('❌ No translations found for:', langCode);
            return;
        }
        
        console.log('✅ Translation object found for:', langCode);
        
        // Update all elements with data-translate
        const elements = document.querySelectorAll('[data-translate]');
        console.log('🔍 Found', elements.length, 'elements to translate');
        
        let successCount = 0;
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = getNestedTranslation(lang, key);
            
            if (translation) {
                element.textContent = translation;
                successCount++;
            } else {
                console.warn('⚠️ No translation for key:', key);
            }
        });
        
        console.log('✅ Successfully translated', successCount, 'elements');
        
        // Update visual feedback
        updateFlagVisuals(langCode);
        
        // Force update other sections
        if (typeof updateHeroSection === 'function') updateHeroSection();
        if (typeof updateStatsSection === 'function') updateStatsSection();
        
        console.log('🎉 Language change completed for:', langCode);
    };
    
    // Helper function to get nested translation
    function getNestedTranslation(langObj, key) {
        const keys = key.split('.');
        let value = langObj;
        
        for (let k of keys) {
            value = value[k];
            if (!value) return null;
        }
        
        return value;
    }
    
    // Update flag visuals
    function updateFlagVisuals(selectedLang) {
        // Reset all flags
        document.querySelectorAll('.flag-wrapper').forEach(wrapper => {
            wrapper.style.opacity = '0.7';
            wrapper.style.transform = 'scale(1)';
        });
        
        // Highlight selected flag
        const selectedFlag = document.querySelector(`[onclick="changeLanguage('${selectedLang}')"]`);
        if (selectedFlag) {
            selectedFlag.style.opacity = '1';
            selectedFlag.style.transform = 'scale(1.1)';
            console.log('👁️ Visual feedback applied to flag:', selectedLang);
        }
    }
    
    // Initialize with saved language or default
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    if (translations && translations[savedLang]) {
        console.log('🚀 Initializing with language:', savedLang);
        setTimeout(() => {
            window.changeLanguage(savedLang);
        }, 100);
    }
    
    console.log('✅ Language fix initialization complete');
}
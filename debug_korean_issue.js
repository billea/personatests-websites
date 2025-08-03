const puppeteer = require('puppeteer');

async function debugKoreanIssue() {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    try {
        const page = await browser.newPage();
        console.log('🚀 Starting Korean Translation Debug...');

        // Navigate to the website
        await page.goto('file://' + __dirname + '/index.html', { waitUntil: 'networkidle0' });
        console.log('📄 Page loaded');

        // Wait for content to load
        await page.waitForSelector('.test-card', { timeout: 10000 });
        await page.waitForTimeout(2000); // Let everything initialize

        // Take initial screenshot
        await page.screenshot({ path: 'debug_1_initial.png', fullPage: true });
        console.log('📸 Initial screenshot taken');

        // Capture initial state
        console.log('\n1. Checking initial state...');
        const initialState = await page.evaluate(() => {
            return {
                currentLanguage: window.currentLanguage || 'not set',
                hasTranslations: !!window.translations,
                hasKoreanTranslations: !!(window.translations && window.translations.ko),
                translationFunctionExists: typeof window.changeLanguage === 'function',
                testCardTitles: Array.from(document.querySelectorAll('.test-card h3')).map((el, i) => ({
                    index: i,
                    text: el.textContent,
                    dataTranslate: el.getAttribute('data-translate'),
                    hasKorean: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(el.textContent)
                }))
            };
        });
        
        console.log('Initial Language:', initialState.currentLanguage);
        console.log('Has Translations Object:', initialState.hasTranslations);
        console.log('Has Korean Translations:', initialState.hasKoreanTranslations);
        console.log('Translation Function Exists:', initialState.translationFunctionExists);
        console.log('Test Cards:', initialState.testCardTitles.length);

        // Try to click Korean flag
        console.log('\n2. Attempting to switch to Korean...');
        const koreanFlagSelector = '[onclick*="changeLanguage(\'ko\')"]';
        
        try {
            await page.click(koreanFlagSelector);
            console.log('✅ Korean flag clicked');
        } catch (error) {
            console.log('❌ Failed to click Korean flag:', error.message);
            
            // Try alternative selector
            const alternatives = [
                '.flag-wrapper[onclick*="ko"]',
                '[data-lang="ko"]',
                'select option[value="ko"]'
            ];
            
            for (const selector of alternatives) {
                try {
                    const element = await page.$(selector);
                    if (element) {
                        await element.click();
                        console.log(`✅ Used alternative selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    console.log(`❌ Alternative ${selector} failed:`, e.message);
                }
            }
        }

        // Wait for potential language change
        await page.waitForTimeout(3000);
        
        // Take screenshot after Korean selection
        await page.screenshot({ path: 'debug_2_korean_attempt.png', fullPage: true });
        console.log('📸 Korean attempt screenshot taken');

        // Check state after Korean attempt
        console.log('\n3. Checking state after Korean attempt...');
        const afterKoreanState = await page.evaluate(() => {
            return {
                currentLanguage: window.currentLanguage || 'not set',
                testCardTitles: Array.from(document.querySelectorAll('.test-card h3')).map((el, i) => ({
                    index: i,
                    text: el.textContent,
                    dataTranslate: el.getAttribute('data-translate'),
                    hasKorean: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(el.textContent),
                    expectedKorean: el.getAttribute('data-translate') ? 
                        (window.translations && window.translations.ko ? 
                            window.getNestedTranslation(window.translations.ko, el.getAttribute('data-translate')) : 'NO KOREAN TRANSLATION') 
                        : 'NO DATA-TRANSLATE'
                }))
            };
        });

        console.log('Language after Korean attempt:', afterKoreanState.currentLanguage);
        
        afterKoreanState.testCardTitles.forEach((card, i) => {
            console.log(`Card ${i + 1}:`);
            console.log(`  Text: "${card.text}"`);
            console.log(`  Expected Korean: "${card.expectedKorean}"`);
            console.log(`  Has Korean: ${card.hasKorean}`);
            console.log(`  Status: ${card.hasKorean ? '✅ Korean' : (card.text === card.expectedKorean ? '❓ Same as expected' : '❌ Still English')}`);
        });

        // Check if translation function is working properly
        console.log('\n4. Testing translation function directly...');
        const translationTest = await page.evaluate(() => {
            if (typeof window.changeLanguage === 'function' && window.translations && window.translations.ko) {
                try {
                    // Force call changeLanguage again
                    window.changeLanguage('ko');
                    
                    // Check if forceUpdateAllTranslations exists and call it
                    if (typeof window.forceUpdateAllTranslations === 'function') {
                        window.forceUpdateAllTranslations(window.translations.ko);
                    }
                    
                    return {
                        success: true,
                        currentLang: window.currentLanguage,
                        koreanMbtiTitle: window.translations.ko.tests?.mbti?.title || 'NOT FOUND',
                        koreanBigFiveTitle: window.translations.ko.tests?.bigfive?.title || 'NOT FOUND'
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'Translation function or Korean translations not available'
                };
            }
        });

        console.log('Translation Test Result:', translationTest);

        // Wait and take final screenshot
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'debug_3_final.png', fullPage: true });
        console.log('📸 Final screenshot taken');

        // Final state check
        const finalState = await page.evaluate(() => {
            const testCards = Array.from(document.querySelectorAll('.test-card h3'));
            const koreanCount = testCards.filter(el => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(el.textContent)).length;
            
            return {
                currentLanguage: window.currentLanguage,
                totalCards: testCards.length,
                koreanCards: koreanCount,
                englishCards: testCards.length - koreanCount,
                success: koreanCount > 0
            };
        });

        console.log('\n5. Final Analysis:');
        console.log(`Current Language: ${finalState.currentLanguage}`);
        console.log(`Total Test Cards: ${finalState.totalCards}`);
        console.log(`Korean Cards: ${finalState.koreanCards}`);
        console.log(`English Cards: ${finalState.englishCards}`);
        console.log(`Status: ${finalState.success ? '✅ Korean translations working' : '❌ Korean translations not working'}`);

        // Generate report
        const report = {
            timestamp: new Date().toISOString(),
            initialState,
            afterKoreanState,
            translationTest,
            finalState,
            screenshots: ['debug_1_initial.png', 'debug_2_korean_attempt.png', 'debug_3_final.png']
        };

        require('fs').writeFileSync('korean_debug_report.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Debug report saved to korean_debug_report.json');

    } catch (error) {
        console.error('❌ Error during debugging:', error);
    } finally {
        await browser.close();
    }
}

debugKoreanIssue();
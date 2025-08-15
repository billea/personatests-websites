const { chromium } = require('playwright');

async function debugTestsPage() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Debugging Tests Page English content...');
        
        await page.goto('https://korean-mbti-platform.netlify.app/ko/tests');
        await page.waitForTimeout(3000);
        
        const content = await page.textContent('body');
        
        // Look for specific English phrases
        const englishPhrases = [
            'Personality Tests',
            'Take Test',
            'Start Test',
            'Discover',
            'Assessment',
            'Questions',
            'Free',
            'Results'
        ];
        
        console.log('\n=== FOUND ENGLISH PHRASES ===');
        englishPhrases.forEach(phrase => {
            if (content.includes(phrase)) {
                console.log(`❌ Found: "${phrase}"`);
                // Show context around the phrase
                const index = content.indexOf(phrase);
                const context = content.substring(Math.max(0, index - 50), index + phrase.length + 50);
                console.log(`   Context: ...${context}...`);
            }
        });
        
        // Look for test descriptions that might be in English
        const testTitles = await page.$$eval('h2, h3, .test-title', elements => 
            elements.map(el => el.textContent?.trim()).filter(Boolean)
        );
        
        console.log('\n=== TEST TITLES FOUND ===');
        testTitles.forEach(title => {
            console.log(`📋 "${title}"`);
        });
        
        // Look for buttons that might be in English
        const buttons = await page.$$eval('button, .btn, a[role="button"]', elements => 
            elements.map(el => el.textContent?.trim()).filter(Boolean)
        );
        
        console.log('\n=== BUTTONS/LINKS FOUND ===');
        buttons.forEach(button => {
            console.log(`🔘 "${button}"`);
        });
        
        // Take a screenshot for manual review
        await page.screenshot({ path: 'tests-page-debug.png', fullPage: true });
        console.log('\n📸 Screenshot saved: tests-page-debug.png');
        
    } catch (error) {
        console.error('❌ Error during debugging:', error.message);
    } finally {
        await browser.close();
    }
}

debugTestsPage().catch(console.error);
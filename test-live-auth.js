// Test actual authentication behavior with browser simulation
const puppeteer = require('puppeteer');

async function testAuthenticationFlow() {
    console.log('🌐 Testing couple compatibility authentication with browser simulation...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false, // Set to false to see what's happening
        defaultViewport: null,
        args: ['--no-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Navigate to couple compatibility test
        console.log('📱 Navigating to couple compatibility test...');
        await page.goto('https://korean-mbti-platform.netlify.app/en/tests/couple-compatibility', {
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        
        // Wait a moment for any redirects or authentication checks
        await page.waitForTimeout(3000);
        
        // Check current URL
        const currentUrl = page.url();
        console.log(`📍 Current URL: ${currentUrl}`);
        
        // Check page content
        const pageContent = await page.evaluate(() => {
            return {
                title: document.title,
                hasAuthForm: !!(document.querySelector('input[type="email"]') || 
                                document.querySelector('input[type="password"]') ||
                                document.querySelector('button[type="submit"]') ||
                                document.textContent.includes('login') ||
                                document.textContent.includes('로그인')),
                hasTestQuestions: !!(document.querySelector('button[class*="test"]') ||
                                    document.textContent.includes('What\'s your') ||
                                    document.textContent.includes('질문')),
                hasLoadingSpinner: !!(document.querySelector('[class*="spin"]') ||
                                     document.querySelector('[class*="loading"]')),
                hasCompatibilityContent: !!(document.textContent.includes('compatibility') ||
                                           document.textContent.includes('궁합') ||
                                           document.textContent.includes('couple')),
                bodyText: document.body.textContent.substring(0, 500) // First 500 chars
            };
        });
        
        // Check for any console logs or errors
        const consoleLogs = [];
        page.on('console', msg => {
            consoleLogs.push(`${msg.type()}: ${msg.text()}`);
        });
        
        console.log('📊 Page Analysis:');
        console.log(`   Title: ${pageContent.title}`);
        console.log(`   🔐 Has auth form: ${pageContent.hasAuthForm ? 'YES' : 'NO'}`);
        console.log(`   📝 Has test questions: ${pageContent.hasTestQuestions ? 'YES' : 'NO'}`);
        console.log(`   ⏳ Has loading spinner: ${pageContent.hasLoadingSpinner ? 'YES' : 'NO'}`);
        console.log(`   💕 Has compatibility content: ${pageContent.hasCompatibilityContent ? 'YES' : 'NO'}`);
        console.log(`   📄 Page content preview: ${pageContent.bodyText.slice(0, 200)}...`);
        
        // Check if we're on auth page
        const isOnAuthPage = currentUrl.includes('/auth');
        console.log(`   ✅ Authentication working: ${isOnAuthPage ? 'YES - Redirected to auth' : 'NO - Still on test page'}`);
        
        if (consoleLogs.length > 0) {
            console.log('\n📋 Console logs:');
            consoleLogs.forEach(log => console.log(`   ${log}`));
        }
        
    } catch (error) {
        console.error('❌ Error during test:', error.message);
    } finally {
        await browser.close();
    }
}

testAuthenticationFlow().catch(console.error);
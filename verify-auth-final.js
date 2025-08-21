// Final verification: Check if couple compatibility actually requires authentication
const puppeteer = require('puppeteer');

async function testCoupleCompatibilityAuth() {
    console.log('🔍 Testing couple compatibility authentication requirement...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1280, height: 720 });
        
        console.log('📱 Navigating to couple compatibility test...');
        await page.goto('https://korean-mbti-platform.netlify.app/en/tests/couple-compatibility/', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for page to fully load and JavaScript to execute
        await page.waitForTimeout(3000);
        
        // Check what's actually on the page
        const pageContent = await page.evaluate(() => {
            return {
                title: document.title,
                hasAuthForm: !!(
                    document.querySelector('input[type="email"]') ||
                    document.querySelector('input[type="password"]') ||
                    document.querySelector('button[type="submit"]') ||
                    document.body.textContent.includes('Sign in') ||
                    document.body.textContent.includes('로그인') ||
                    document.body.textContent.includes('Log in')
                ),
                hasTestQuestions: !!(
                    document.body.textContent.includes('What') ||
                    document.body.textContent.includes('question') ||
                    document.body.textContent.includes('질문') ||
                    document.querySelector('button[onClick*="handleAnswer"]')
                ),
                hasCompatibilityContent: !!(
                    document.body.textContent.includes('compatibility') ||
                    document.body.textContent.includes('궁합') ||
                    document.body.textContent.includes('Couple') ||
                    document.body.textContent.includes('Partner')
                ),
                bodyText: document.body.textContent.substring(0, 500) + '...'
            };
        });
        
        console.log('📊 Page Analysis:');
        console.log(`   Title: ${pageContent.title}`);
        console.log(`   Has Auth Form: ${pageContent.hasAuthForm ? '✅ YES' : '❌ NO'}`);
        console.log(`   Has Test Questions: ${pageContent.hasTestQuestions ? '❌ BAD' : '✅ GOOD'}`);
        console.log(`   Has Compatibility Content: ${pageContent.hasCompatibilityContent ? '✅ YES' : '❌ NO'}`);
        console.log(`   Page Content Preview: ${pageContent.bodyText}`);
        
        // Try to find authentication redirect elements
        const authElements = await page.evaluate(() => {
            const elements = [];
            
            // Look for common auth indicators
            if (document.querySelector('input[type="email"]')) {
                elements.push('Email input field');
            }
            if (document.querySelector('input[type="password"]')) {
                elements.push('Password input field');
            }
            if (document.querySelector('button[type="submit"]')) {
                elements.push('Submit button');
            }
            
            // Look for Google auth button
            const googleButton = document.querySelector('button:contains("Google")') || 
                               Array.from(document.querySelectorAll('button')).find(btn => 
                                   btn.textContent.includes('Google'));
            if (googleButton) {
                elements.push('Google auth button');
            }
            
            // Look for auth-related text
            const bodyText = document.body.textContent.toLowerCase();
            if (bodyText.includes('sign in') || bodyText.includes('log in') || bodyText.includes('로그인')) {
                elements.push('Auth-related text');
            }
            
            return elements;
        });
        
        console.log('\n🔐 Authentication Elements Found:');
        if (authElements.length > 0) {
            authElements.forEach(element => console.log(`   ✅ ${element}`));
        } else {
            console.log('   ❌ No authentication elements detected');
        }
        
        // Final assessment
        console.log('\n🎯 FINAL ASSESSMENT:');
        if (pageContent.hasAuthForm && !pageContent.hasTestQuestions) {
            console.log('   ✅ AUTHENTICATION WORKING: Auth form shown, no test questions');
            console.log('   🔒 Users must authenticate before taking the test');
        } else if (!pageContent.hasAuthForm && pageContent.hasTestQuestions) {
            console.log('   ❌ AUTHENTICATION BYPASSED: Test questions shown without auth');
            console.log('   🚨 SECURITY ISSUE: Users can take test without logging in');
        } else if (pageContent.hasAuthForm && pageContent.hasTestQuestions) {
            console.log('   ⚠️  MIXED STATE: Both auth and test content present');
            console.log('   🔍 May indicate loading state or implementation issue');
        } else {
            console.log('   ❓ UNCLEAR STATE: Neither auth nor test content clearly present');
            console.log('   🔍 May be loading or have other content');
        }
        
    } catch (error) {
        console.error('❌ Error during authentication test:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testCoupleCompatibilityAuth();
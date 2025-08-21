// Test authentication flow by following redirects
const https = require('https');
const http = require('http');
const { URL } = require('url');

async function followRedirects(url, maxRedirects = 5) {
    console.log(`🔗 Testing: ${url}`);
    
    for (let i = 0; i < maxRedirects; i++) {
        const result = await makeRequest(url);
        
        console.log(`   Step ${i + 1}: ${result.status} ${result.statusText || ''}`);
        
        if (result.status >= 200 && result.status < 300) {
            // Success - check content
            const hasAuthForm = result.data.includes('login') || result.data.includes('sign') || result.data.includes('로그인');
            const hasTestQuestions = result.data.includes('question') || result.data.includes('질문') || result.data.includes('What\'s your');
            const hasCompatibilityTest = result.data.includes('compatibility') || result.data.includes('궁합');
            
            console.log(`   ✅ Final destination: ${url}`);
            console.log(`   🔐 Has auth form: ${hasAuthForm ? 'YES' : 'NO'}`);
            console.log(`   📝 Has test questions: ${hasTestQuestions ? 'YES' : 'NO'}`);
            console.log(`   💕 Has compatibility content: ${hasCompatibilityTest ? 'YES' : 'NO'}`);
            
            return {
                finalUrl: url,
                status: result.status,
                hasAuth: hasAuthForm,
                hasTest: hasTestQuestions,
                hasCompatibility: hasCompatibilityTest,
                redirectCount: i
            };
        } else if (result.status >= 300 && result.status < 400 && result.location) {
            // Redirect - follow it
            const redirectUrl = new URL(result.location, url).href;
            console.log(`   ↳ Redirecting to: ${redirectUrl}`);
            url = redirectUrl;
        } else {
            // Error
            console.log(`   ❌ Error: ${result.status}`);
            return {
                finalUrl: url,
                status: result.status,
                error: true,
                redirectCount: i
            };
        }
    }
    
    console.log(`   ⚠️  Too many redirects (>${maxRedirects})`);
    return {
        finalUrl: url,
        status: 'TOO_MANY_REDIRECTS',
        redirectCount: maxRedirects
    };
}

async function makeRequest(url) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        
        const req = client.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    location: res.headers.location,
                    data: data
                });
            });
        });
        
        req.on('error', (err) => {
            resolve({ status: 'ERROR', error: err.message });
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            resolve({ status: 'TIMEOUT' });
        });
    });
}

async function testAllUrls() {
    console.log('🧪 Testing authentication flow with redirect following...\n');
    
    const testUrls = [
        'https://korean-mbti-platform.netlify.app/en/tests/couple-compatibility',
        'https://korean-mbti-platform.netlify.app/en/tests/feedback-360',
        'https://korean-mbti-platform.netlify.app/en/tests/mbti-classic'
    ];
    
    for (const url of testUrls) {
        console.log(`\n${'='.repeat(60)}`);
        const result = await followRedirects(url);
        
        console.log(`📊 SUMMARY for ${url}:`);
        console.log(`   Final Status: ${result.status}`);
        console.log(`   Redirects: ${result.redirectCount}`);
        console.log(`   Auth Required: ${result.hasAuth ? '✅ YES' : '❌ NO'}`);
        console.log(`   Test Content: ${result.hasTest ? '✅ YES' : '❌ NO'}`);
        if (url.includes('couple-compatibility')) {
            console.log(`   Authentication Working: ${result.hasAuth && !result.hasTest ? '✅ YES' : '❌ NO'}`);
        }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('🔍 OVERALL ASSESSMENT');
    console.log('If couple-compatibility shows test content without auth, there\'s a problem.');
    console.log('If it redirects to auth page or shows auth form, it\'s working correctly.');
}

testAllUrls().catch(console.error);
// Test authentication flow for couple compatibility test
const https = require('https');

async function testFullFlow() {
    console.log('🧪 Testing couple compatibility authentication flow...\n');
    
    // Test 1: Direct access to couple compatibility test
    console.log('📋 Test 1: Direct access to couple compatibility test');
    const response1 = await testUrl('https://korean-mbti-platform.netlify.app/en/tests/couple-compatibility');
    console.log(`Result: ${response1.status} - ${response1.status === 200 ? '❌ ALLOWED (should redirect)' : '✅ BLOCKED/REDIRECTED'}`);
    
    if (response1.headers && response1.headers.location) {
        console.log(`Redirect to: ${response1.headers.location}`);
    }
    
    console.log('');
    
    // Test 2: Check auth page
    console.log('📋 Test 2: Check auth page loads');
    const response2 = await testUrl('https://korean-mbti-platform.netlify.app/en/auth');
    console.log(`Result: ${response2.status} - ${response2.status === 200 ? '✅ LOADS' : '❌ ERROR'}`);
    console.log('');
    
    // Test 3: Check feedback-360 (known working auth)
    console.log('📋 Test 3: Check feedback-360 authentication');
    const response3 = await testUrl('https://korean-mbti-platform.netlify.app/en/tests/feedback-360');
    console.log(`Result: ${response3.status} - ${response3.status === 200 ? '❌ ALLOWED (should redirect)' : '✅ BLOCKED/REDIRECTED'}`);
    console.log('');
    
    // Test 4: Test regular MBTI (should work without auth)
    console.log('📋 Test 4: Test regular MBTI test (no auth required)');
    const response4 = await testUrl('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
    console.log(`Result: ${response4.status} - ${response4.status === 200 ? '✅ ALLOWED' : '❌ BLOCKED'}`);
    
    console.log('\n🔍 Summary:');
    console.log(`Couple Compatibility: ${response1.status} ${getStatusMessage(response1.status)}`);
    console.log(`Feedback 360: ${response3.status} ${getStatusMessage(response3.status)}`);
    console.log(`MBTI Classic: ${response4.status} ${getStatusMessage(response4.status)}`);
}

async function testUrl(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    url,
                    status: res.statusCode,
                    headers: res.headers,
                    dataLength: data.length,
                    hasAuth: data.includes('auth') || data.includes('login') || data.includes('로그인'),
                    hasTest: data.includes('question') || data.includes('질문')
                });
            });
        });
        
        req.on('error', (err) => {
            resolve({ url, error: err.message, status: 'ERROR' });
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            resolve({ url, error: 'Timeout', status: 'TIMEOUT' });
        });
    });
}

function getStatusMessage(status) {
    switch(status) {
        case 200: return '(OK - Page loads)';
        case 301: case 302: case 307: case 308: return '(Redirect - Good for auth)';
        case 404: return '(Not Found)';
        case 500: return '(Server Error)';
        default: return '(Unknown)';
    }
}

testFullFlow().catch(console.error);
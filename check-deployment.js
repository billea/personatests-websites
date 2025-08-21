// Check deployment status for couple compatibility test changes
const https = require('https');

const testUrls = [
    'https://korean-mbti-platform.netlify.app/en/',
    'https://korean-mbti-platform.netlify.app/en/tests/couple-compatibility',
    'https://korean-mbti-platform.netlify.app/ko/tests/couple-compatibility'
];

async function checkUrl(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const isRedirect = res.statusCode >= 300 && res.statusCode < 400;
                const hasAuth = data.includes('auth') || data.includes('login') || data.includes('로그인');
                const hasCouple = data.includes('couple') || data.includes('커플') || data.includes('compatibility');
                
                resolve({
                    url,
                    status: res.statusCode,
                    isRedirect,
                    hasAuth,
                    hasCouple,
                    size: data.length
                });
            });
        });
        
        req.on('error', (err) => {
            resolve({ url, error: err.message });
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            resolve({ url, error: 'Timeout' });
        });
    });
}

async function checkDeployment() {
    console.log('🚀 Checking deployment status...\n');
    
    for (const url of testUrls) {
        const result = await checkUrl(url);
        
        if (result.error) {
            console.log(`❌ ${url}: ERROR - ${result.error}`);
        } else {
            console.log(`📊 ${url}:`);
            console.log(`   Status: ${result.status}`);
            console.log(`   Redirect: ${result.isRedirect ? 'YES' : 'NO'}`);
            console.log(`   Has Auth: ${result.hasAuth ? 'YES' : 'NO'}`);
            console.log(`   Has Couple Test: ${result.hasCouple ? 'YES' : 'NO'}`);
            console.log(`   Content Size: ${result.size} bytes`);
            
            if (url.includes('couple-compatibility')) {
                if (result.hasAuth || result.isRedirect) {
                    console.log('   ✅ Authentication requirement detected!');
                } else {
                    console.log('   ⚠️  No authentication requirement found');
                }
            }
        }
        console.log('');
    }
    
    console.log('🔍 Deployment check complete');
}

checkDeployment().catch(console.error);
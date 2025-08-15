const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Debugging live site console logs...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable detailed console logging
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log('❌ PAGE ERROR:', error.message);
  });
  
  try {
    console.log('Navigating to feedback-360 test...');
    await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    console.log('Waiting 10 seconds to capture logs...');
    await page.waitForTimeout(10000);
    
    // Get the page content to see what's actually rendered
    const bodyText = await page.textContent('body');
    console.log('\n📄 PAGE CONTENT PREVIEW:');
    console.log(bodyText.substring(0, 500) + '...');
    
    // Check for specific elements
    const loadingIndicator = await page.locator('.animate-spin').count();
    const categoryButtons = await page.locator('button').count();
    const errorMessage = bodyText.includes('Test Not Found') || bodyText.includes('테스트를 찾을 수 없습니다');
    
    console.log('\n🔍 ELEMENT CHECK:');
    console.log('  Loading indicators:', loadingIndicator);
    console.log('  Total buttons:', categoryButtons);
    console.log('  Error message:', errorMessage);
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
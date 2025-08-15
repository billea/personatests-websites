const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing with fresh Next.js cache on port 3003...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3003/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    
    // Test for actual Korean category labels
    const workBtn = await page.locator('button').filter({ hasText: '직장 동료' });
    const generalBtn = await page.locator('button').filter({ hasText: '일반적 관계' });
    
    const workCount = await workBtn.count();
    const generalCount = await generalBtn.count();
    
    console.log('Category buttons found:');
    console.log('  직장 동료:', workCount);
    console.log('  일반적 관계:', generalCount);
    
    if (generalCount > 0) {
      console.log('✅ Category selection is working! Testing full flow...');
      await generalBtn.first().click();
      await page.waitForTimeout(2000);
      
      const nameInput = page.locator('input[type="text"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('김수');
        const startBtn = page.locator('button').filter({ hasText: /시작|계속/ }).first();
        if (await startBtn.isVisible()) {
          await startBtn.click();
          await page.waitForTimeout(3000);
          
          const pageText = await page.textContent('body');
          const qMatch = pageText.match(/Question (\d+) of (\d+)/);
          const totalQuestions = qMatch ? parseInt(qMatch[2]) : 0;
          const hasNimIssue = pageText.includes('님은(는)');
          const hasCorrectFormat = pageText.includes('이 사람은');
          
          console.log('\n🎯 RESULTS AFTER CACHE CLEAR:');
          console.log('  Questions:', totalQuestions);
          console.log('  Has (는) issue:', hasNimIssue);
          console.log('  Has correct format:', hasCorrectFormat);
          console.log('  STATUS:', totalQuestions === 20 && !hasNimIssue && hasCorrectFormat ? '🎉 FIXED!' : '❌ Still has issues');
          
          if (totalQuestions === 20 && !hasNimIssue && hasCorrectFormat) {
            console.log('\n🎉 SUCCESS! Korean (는) fix is working locally!');
            console.log('Ready to deploy to Netlify!');
          }
        }
      }
    } else {
      console.log('❌ Still no category buttons after cache clear');
      const pageSource = await page.textContent('body');
      console.log('Page content preview:', pageSource.substring(0, 200));
    }
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing infinite loop fix on live Netlify site...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging to catch errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ CONSOLE ERROR:', msg.text());
    } else if (msg.text().includes('useEffect running') || msg.text().includes('feedback-360')) {
      console.log('📝 LOG:', msg.text());
    }
  });
  
  try {
    console.log('Navigating to feedback-360 test on live site...');
    await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(5000);
    
    // Check for category selection
    const generalBtn = await page.locator('button').filter({ hasText: '일반적 관계' });
    const categoryCount = await generalBtn.count();
    
    console.log('Category buttons found:', categoryCount);
    
    if (categoryCount > 0) {
      console.log('✅ Category selection visible! No infinite loop detected.');
      
      // Click the general category button
      await generalBtn.first().click();
      await page.waitForTimeout(3000);
      
      // Check if we stayed on the same page
      const currentUrl = page.url();
      console.log('Current URL after click:', currentUrl);
      
      if (currentUrl.includes('feedback-360')) {
        console.log('✅ SUCCESS! Category selection works without redirects');
        
        // Check for name input
        const nameInput = page.locator('input[type="text"]').first();
        if (await nameInput.isVisible()) {
          console.log('✅ Name input appeared after category selection!');
          
          await nameInput.fill('김수');
          const startBtn = page.locator('button').filter({ hasText: /Start Assessment|시작/ }).first();
          if (await startBtn.isVisible()) {
            await startBtn.click();
            await page.waitForTimeout(3000);
            
            // Final check for questions
            const pageText = await page.textContent('body');
            const qMatch = pageText.match(/Question (\d+) of (\d+)/);
            const totalQuestions = qMatch ? parseInt(qMatch[2]) : 0;
            const hasNimIssue = pageText.includes('님은(는)');
            const hasCorrectFormat = pageText.includes('이 사람은');
            
            console.log('\n🎯 FINAL TEST RESULTS:');
            console.log('  Questions loaded:', totalQuestions);
            console.log('  Has (는) issue:', hasNimIssue);
            console.log('  Has correct format:', hasCorrectFormat);
            
            if (totalQuestions === 20 && !hasNimIssue && hasCorrectFormat) {
              console.log('\n🎉 PERFECT! Everything is working:');
              console.log('  ✅ No infinite loop');
              console.log('  ✅ No redirect bug');
              console.log('  ✅ 20 questions loaded');
              console.log('  ✅ Korean (는) issue fixed');
              console.log('  ✅ Ready for production!');
            } else {
              console.log('\n⚠️ Questions still need work');
            }
          }
        }
      } else {
        console.log('❌ ISSUE: Still redirecting to:', currentUrl);
      }
    } else {
      console.log('❌ No category buttons found - checking for errors');
      const bodyText = await page.textContent('body');
      if (bodyText.includes('Test Not Found')) {
        console.log('❌ Test Not Found error displayed');
      }
    }
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
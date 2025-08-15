const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing redirect fix for category selection...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to feedback-360 test...');
    await page.goto('http://localhost:3003/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Check for category selection
    const generalBtn = await page.locator('button').filter({ hasText: '일반적 관계' });
    const categoryCount = await generalBtn.count();
    
    console.log('Category buttons found:', categoryCount);
    
    if (categoryCount > 0) {
      console.log('✅ Category selection visible! Clicking general category...');
      
      // Click the general category button
      await generalBtn.first().click();
      await page.waitForTimeout(3000);
      
      // Check if we stayed on the same page or got redirected
      const currentUrl = page.url();
      console.log('Current URL after click:', currentUrl);
      
      if (currentUrl.includes('feedback-360')) {
        console.log('✅ SUCCESS! No redirect - stayed on feedback-360 page');
        
        // Check for name input
        const nameInput = page.locator('input[type="text"]').first();
        if (await nameInput.isVisible()) {
          console.log('✅ Name input appeared after category selection!');
          
          await nameInput.fill('김수');
          const startBtn = page.locator('button').filter({ hasText: /시작|계속/ }).first();
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
            console.log('  STATUS:', totalQuestions === 20 && !hasNimIssue && hasCorrectFormat ? '🎉 COMPLETE SUCCESS!' : '❌ Questions need work');
            
            if (totalQuestions === 20 && !hasNimIssue && hasCorrectFormat) {
              console.log('\n🎉 PERFECT! Everything is working:');
              console.log('  ✅ No redirect bug');
              console.log('  ✅ 20 questions loaded');
              console.log('  ✅ Korean (는) issue fixed');
              console.log('  ✅ Ready for deployment!');
            }
          }
        }
      } else {
        console.log('❌ ISSUE: Still redirecting to:', currentUrl);
      }
    } else {
      console.log('❌ No category buttons found');
    }
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
const { chromium } = require('playwright');

(async () => {
  console.log('⏳ Waiting for deployment to complete...');
  console.log('🔄 Testing Korean translations every 30 seconds until they appear...');
  
  const maxAttempts = 10; // Test for up to 5 minutes
  let attempt = 1;
  
  while (attempt <= maxAttempts) {
    console.log(`\n--- Attempt ${attempt}/${maxAttempts} ---`);
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      // Navigate with no cache
      await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/', { 
        waitUntil: 'networkidle' 
      });
      
      // Fill form and start test
      const inputs = await page.locator('input').all();
      if (inputs.length >= 2) {
        await inputs[0].fill('김');
        await inputs[1].fill('수');
      }
      
      await page.click('button:has-text("평가 시작하기")');
      await page.waitForTimeout(3000);
      
      const bodyText = await page.locator('body').textContent();
      
      // Check for the Korean scale labels we expect
      const koreanLabels = ['잘 막혀요', '문제 해결사'];
      const foundKoreanLabels = koreanLabels.filter(label => bodyText.includes(label));
      
      // Check for the Korean UI elements
      const koreanUI = ['이전', '저장 후 종료'];
      const foundKoreanUI = koreanUI.filter(ui => bodyText.includes(ui));
      
      console.log(`🇰🇷 Korean scale labels found: ${foundKoreanLabels.length}/${koreanLabels.length} (${foundKoreanLabels.join(', ')})`);
      console.log(`🔘 Korean UI elements found: ${foundKoreanUI.length}/${koreanUI.length} (${foundKoreanUI.join(', ')})`);
      
      // Success condition: find at least some Korean labels
      if (foundKoreanLabels.length > 0 && foundKoreanUI.length > 0) {
        console.log('\n🎉 SUCCESS: Korean translations are working!');
        
        // Final verification - check for any remaining English
        const englishLabels = ['Gets stuck easily', 'Problem solver!', 'Save & Exit', 'Previous'];
        const foundEnglishLabels = englishLabels.filter(label => bodyText.includes(label));
        
        if (foundEnglishLabels.length === 0) {
          console.log('✅ PERFECT: No English labels found - translation complete!');
        } else {
          console.log(`⚠️  Still has some English: ${foundEnglishLabels.join(', ')}`);
        }
        
        await page.screenshot({ path: 'korean-working.png', fullPage: true });
        console.log('📸 Screenshot saved as korean-working.png');
        
        await browser.close();
        break;
      }
      
      console.log('⏳ Translations not yet active, waiting...');
      
    } catch (error) {
      console.log('❌ Error during test:', error.message);
    }
    
    await browser.close();
    
    if (attempt < maxAttempts) {
      console.log('💤 Waiting 30 seconds before next attempt...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
    
    attempt++;
  }
  
  if (attempt > maxAttempts) {
    console.log('\n⚠️  Reached maximum attempts. Deployment may still be in progress.');
    console.log('💡 Try refreshing the page manually or wait a few more minutes.');
  }
})();
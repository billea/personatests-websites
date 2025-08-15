const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing English category buttons on live site...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('useEffect') || msg.text().includes('feedback-360') || msg.text().includes('category')) {
      console.log('📝 LOG:', msg.text());
    }
  });
  
  try {
    await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(5000);
    
    // Click the "General Relationships" button
    const generalBtn = await page.locator('button').filter({ hasText: 'General Relationships' });
    const buttonCount = await generalBtn.count();
    
    console.log('General Relationships button found:', buttonCount > 0);
    
    if (buttonCount > 0) {
      console.log('🎯 Clicking General Relationships button...');
      await generalBtn.first().click();
      await page.waitForTimeout(5000);
      
      const currentUrl = page.url();
      console.log('Current URL after click:', currentUrl);
      
      if (currentUrl.includes('feedback-360')) {
        console.log('✅ SUCCESS! No redirect - stayed on feedback-360 page');
        
        // Check for name input form
        const nameInputs = await page.locator('input[type="text"]').count();
        const startButtons = await page.locator('button').filter({ hasText: /Start Assessment|시작/ }).count();
        
        console.log('Name inputs found:', nameInputs);
        console.log('Start buttons found:', startButtons);
        
        if (nameInputs > 0) {
          console.log('✅ Name input form appeared!');
          
          // Fill in name and continue
          const lastNameInput = await page.locator('input[type="text"]').first();
          const firstNameInput = await page.locator('input[type="text"]').last();
          
          await lastNameInput.fill('김');
          await firstNameInput.fill('수');
          
          const startBtn = await page.locator('button').filter({ hasText: /Start Assessment|시작/ }).first();
          if (await startBtn.isVisible()) {
            console.log('🚀 Clicking Start Assessment...');
            await startBtn.click();
            await page.waitForTimeout(5000);
            
            // Check for questions
            const pageText = await page.textContent('body');
            const hasQuestions = pageText.includes('Question') && pageText.includes('of');
            const hasKoreanQuestions = pageText.includes('이 사람은');
            const hasOldFormat = pageText.includes('님은(는)');
            
            console.log('\n🎯 FINAL RESULTS:');
            console.log('  Has questions:', hasQuestions);
            console.log('  Has Korean format:', hasKoreanQuestions);
            console.log('  Has old (는) format:', hasOldFormat);
            
            if (hasQuestions && hasKoreanQuestions && !hasOldFormat) {
              console.log('\n🎉 COMPLETE SUCCESS!');
              console.log('  ✅ Infinite loop fixed');
              console.log('  ✅ Category selection works');
              console.log('  ✅ Questions load correctly');
              console.log('  ✅ Korean format is correct');
            }
          }
        }
      } else {
        console.log('❌ REDIRECT: Page went to', currentUrl);
      }
    }
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
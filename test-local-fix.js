const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing infinite loop fix on LOCAL server...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.text().includes('useEffect') || msg.text().includes('feedback-360') || msg.text().includes('category') || msg.text().includes('TestDefinition')) {
      console.log('📝 LOG:', msg.text());
    }
  });
  
  try {
    console.log('Navigating to LOCAL feedback-360 test...');
    await page.goto('http://localhost:3003/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(5000);
    
    // Check for category buttons
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons locally`);
    
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`  Button ${i + 1}: "${text}"`);
    }
    
    // Look for Korean category buttons
    const generalBtn = await page.locator('button').filter({ hasText: '일반적 관계' });
    const generalBtnEn = await page.locator('button').filter({ hasText: 'General Relationships' });
    
    console.log('Korean general button:', await generalBtn.count());
    console.log('English general button:', await generalBtnEn.count());
    
    // Try clicking whichever button is available
    let targetBtn = null;
    if (await generalBtn.count() > 0) {
      targetBtn = generalBtn.first();
      console.log('🎯 Using Korean button');
    } else if (await generalBtnEn.count() > 0) {
      targetBtn = generalBtnEn.first();
      console.log('🎯 Using English button');
    }
    
    if (targetBtn) {
      console.log('Clicking category button...');
      await targetBtn.click();
      await page.waitForTimeout(5000);
      
      const currentUrl = page.url();
      console.log('Current URL after click:', currentUrl);
      
      if (currentUrl.includes('feedback-360')) {
        console.log('✅ SUCCESS! No redirect - fix is working locally');
        
        // Check for subsequent elements
        const nameInputs = await page.locator('input[type="text"]').count();
        console.log('Name inputs found:', nameInputs);
        
        if (nameInputs > 0) {
          console.log('✅ Name input form appeared - local version is working perfectly!');
        }
      } else {
        console.log('❌ REDIRECT: Local version also has issues');
      }
    } else {
      console.log('❌ No category buttons found locally');
    }
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
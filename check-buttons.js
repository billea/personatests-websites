const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Checking button details on live site...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(5000);
    
    // Get all button texts
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons:`);
    
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`  Button ${i + 1}: "${text}"`);
    }
    
    // Look specifically for category buttons
    const workBtn = await page.locator('button').filter({ hasText: '직장 동료' });
    const friendsBtn = await page.locator('button').filter({ hasText: '친구' });
    const familyBtn = await page.locator('button').filter({ hasText: '가족' });
    const academicBtn = await page.locator('button').filter({ hasText: '학업 관계' });
    const generalBtn = await page.locator('button').filter({ hasText: '일반적 관계' });
    
    console.log('\nCategory button check:');
    console.log('  Work:', await workBtn.count());
    console.log('  Friends:', await friendsBtn.count());
    console.log('  Family:', await familyBtn.count());
    console.log('  Academic:', await academicBtn.count());
    console.log('  General:', await generalBtn.count());
    
    // Try clicking the first available category button
    if (await generalBtn.count() > 0) {
      console.log('\n🎯 Testing general category button...');
      await generalBtn.first().click();
      await page.waitForTimeout(3000);
      
      const newUrl = page.url();
      console.log('URL after click:', newUrl);
      
      if (newUrl.includes('feedback-360')) {
        console.log('✅ SUCCESS! No redirect occurred');
      } else {
        console.log('❌ REDIRECT: Page changed to', newUrl);
      }
    }
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
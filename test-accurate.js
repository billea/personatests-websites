const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Accurate test with correct Korean category labels...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3002/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    
    console.log('📄 Testing for correct category button labels...');
    
    // Test for actual Korean category labels
    const workBtn = await page.locator('button').filter({ hasText: '직장 동료' });
    const friendsBtn = await page.locator('button').filter({ hasText: '친구' });
    const familyBtn = await page.locator('button').filter({ hasText: '가족' });
    const academicBtn = await page.locator('button').filter({ hasText: '학업 파트너' });
    const generalBtn = await page.locator('button').filter({ hasText: '일반적 관계' });
    
    const workCount = await workBtn.count();
    const friendsCount = await friendsBtn.count();
    const familyCount = await familyBtn.count();
    const academicCount = await academicBtn.count();
    const generalCount = await generalBtn.count();
    
    console.log('Category button counts:');
    console.log('  직장 동료:', workCount);
    console.log('  친구:', friendsCount);
    console.log('  가족:', familyCount);
    console.log('  학업 파트너:', academicCount);
    console.log('  일반적 관계:', generalCount);
    
    const totalCategories = workCount + friendsCount + familyCount + academicCount + generalCount;
    console.log('  Total category buttons:', totalCategories);
    
    if (totalCategories === 5) {
      console.log('✅ All 5 category buttons found! Clicking general category...');
      await generalBtn.first().click();
      await page.waitForTimeout(2000);
      
      // Check name input
      const nameInput = page.locator('input[type="text"]').first();
      if (await nameInput.isVisible()) {
        console.log('✅ Name input found after category selection!');
        await nameInput.fill('김수');
        const startBtn = page.locator('button').filter({ hasText: /시작|계속/ }).first();
        if (await startBtn.isVisible()) {
          await startBtn.click();
          await page.waitForTimeout(3000);
          
          // Final check
          const pageText = await page.textContent('body');
          const qMatch = pageText.match(/Question (\d+) of (\d+)/);
          const totalQuestions = qMatch ? parseInt(qMatch[2]) : 0;
          const hasNimIssue = pageText.includes('님은(는)');
          const hasCorrectFormat = pageText.includes('이 사람은');
          
          console.log('\n🎯 FINAL TEST RESULTS:');
          console.log('  Questions loaded:', totalQuestions);
          console.log('  Has (는) issue:', hasNimIssue);
          console.log('  Has correct format:', hasCorrectFormat);
          console.log('  STATUS:', totalQuestions === 20 && !hasNimIssue && hasCorrectFormat ? '🎉 SUCCESS!' : '❌ Issues remain');
          
          if (totalQuestions === 20 && !hasNimIssue && hasCorrectFormat) {
            console.log('🎉 Korean (는) fix is WORKING in local development!');
          }
        }
      }
    } else {
      console.log('❌ Category buttons not found. Checking page source...');
      const bodyText = await page.textContent('body');
      console.log('Page contains:', bodyText.substring(0, 500));
    }
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
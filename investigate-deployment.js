const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Manual investigation of current deployment state...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    
    console.log('📄 Current page state:');
    
    // Check what's visible on the page
    const categoryButtons = await page.locator('button').filter({ hasText: /직장|친구|가족|학업|일반/ });
    const categoryCount = await categoryButtons.count();
    console.log('  Category buttons found:', categoryCount);
    
    if (categoryCount > 0) {
      console.log('  Category selection is visible!');
      // Try selecting general category
      const generalBtn = page.locator('button').filter({ hasText: '일반적 관계' }).first();
      if (await generalBtn.isVisible()) {
        console.log('  Clicking general category...');
        await generalBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Check name input
    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.isVisible()) {
      console.log('  Name input found, entering name...');
      await nameInput.fill('김수');
      const startBtn = page.locator('button').filter({ hasText: /시작|계속/ }).first();
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForTimeout(3000);
      }
    } else {
      console.log('  No name input found');
    }
    
    // Final check
    const pageText = await page.textContent('body');
    const qMatch = pageText.match(/Question (\d+) of (\d+)/);
    const totalQuestions = qMatch ? parseInt(qMatch[2]) : 0;
    const hasNimIssue = pageText.includes('님은(는)');
    const hasCorrectFormat = pageText.includes('이 사람은');
    
    console.log('\n📊 FINAL STATE:');
    console.log('  Total questions:', totalQuestions);
    console.log('  Has (는) issue:', hasNimIssue);
    console.log('  Has correct format:', hasCorrectFormat);
    console.log('  Status:', totalQuestions === 20 && !hasNimIssue && hasCorrectFormat ? '✅ SUCCESS!' : '❌ Still need work');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'deployment-investigation.png', fullPage: true });
    console.log('📸 Screenshot saved as deployment-investigation.png');
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  } finally {
    await browser.close();
  }
})();
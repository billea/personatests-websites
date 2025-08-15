const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing LOCAL development server...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3002/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    
    // Check category buttons
    const categoryButtons = await page.locator('button').filter({ hasText: /직장|친구|가족|학업|일반/ });
    const categoryCount = await categoryButtons.count();
    console.log('LOCAL - Category buttons found:', categoryCount);
    
    if (categoryCount > 0) {
      const generalBtn = page.locator('button').filter({ hasText: '일반적 관계' }).first();
      if (await generalBtn.isVisible()) {
        await generalBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Check name input and proceed
    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('김수');
      const startBtn = page.locator('button').filter({ hasText: /시작|계속/ }).first();
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForTimeout(3000);
      }
    }
    
    // Final check
    const pageText = await page.textContent('body');
    const qMatch = pageText.match(/Question (\d+) of (\d+)/);
    const totalQuestions = qMatch ? parseInt(qMatch[2]) : 0;
    const hasNimIssue = pageText.includes('님은(는)');
    const hasCorrectFormat = pageText.includes('이 사람은');
    
    console.log('\nLOCAL RESULTS:');
    console.log('  Total questions:', totalQuestions);
    console.log('  Has (는) issue:', hasNimIssue);
    console.log('  Has correct format:', hasCorrectFormat);
    console.log('  Status:', totalQuestions === 20 && !hasNimIssue && hasCorrectFormat ? '✅ LOCAL WORKS!' : '❌ Local also has issues');
    
  } catch(e) {
    console.error('❌ Error testing local:', e.message);
  } finally {
    await browser.close();
  }
})();
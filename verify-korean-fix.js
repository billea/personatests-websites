const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Verifying Korean Feedback Fix...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Check for category selection
    const categoryButton = await page.locator('button').filter({ hasText: '일반적 관계' }).first();
    if (await categoryButton.isVisible()) {
      console.log('✅ Category selection visible - selecting general category...');
      await categoryButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Enter name
    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('김수');
      const startButton = page.locator('button').filter({ hasText: /시작|계속/ }).first();
      if (await startButton.isVisible()) {
        await startButton.click();
        await page.waitForTimeout(3000);
      }
    }
    
    const bodyText = await page.textContent('body');
    
    // Check question count
    const questionMatch = bodyText.match(/Question (\d+) of (\d+)/);
    if (questionMatch) {
      const total = parseInt(questionMatch[2]);
      if (total === 20) {
        console.log('✅ SUCCESS: 20 questions detected!');
      } else {
        console.log(`❌ ISSUE: ${total} questions found (should be 20)`);
      }
    }
    
    // Check for (는) issue
    if (bodyText.includes('님은(는)')) {
      console.log('❌ ISSUE: (는) suffix still present');
    } else {
      console.log('✅ SUCCESS: No (는) suffix found!');
    }
    
    // Check for correct format
    if (bodyText.includes('이 사람은')) {
      console.log('✅ SUCCESS: Using "이 사람은" format!');
    } else {
      console.log('❌ ISSUE: "이 사람은" format not found');
    }
    
    console.log('\\n📸 Taking screenshot for verification...');
    await page.screenshot({ path: 'korean-fix-verification.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
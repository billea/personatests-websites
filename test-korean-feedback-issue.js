const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing Korean Feedback 360 Issue on Live Site...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the Korean feedback-360 page
    console.log('📍 Navigating to: https://korean-mbti-platform.netlify.app/ko/tests/feedback-360');
    await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if category selection appears first
    const categorySelection = await page.locator('button').filter({ hasText: '직장 동료' }).first();
    if (await categorySelection.isVisible()) {
      console.log('✅ Category selection is visible');
      console.log('🔧 Selecting "work" category...');
      await categorySelection.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Category selection not found, proceeding...');
    }
    
    // Check for name input
    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.isVisible()) {
      console.log('📝 Name input found, entering test name...');
      await nameInput.fill('김수');
      await page.waitForTimeout(1000);
      
      // Click continue/start button
      const continueButton = page.locator('button').filter({ hasText: /시작|계속|다음/ }).first();
      if (await continueButton.isVisible()) {
        await continueButton.click();
        await page.waitForTimeout(3000);
      }
    }
    
    // Get the page content to analyze
    const bodyText = await page.textContent('body');
    console.log('\\n📄 Page Analysis:');
    
    // Check for question count
    const questionMatch = bodyText.match(/Question (\d+) of (\d+)/);
    if (questionMatch) {
      console.log(`📊 Found: Question ${questionMatch[1]} of ${questionMatch[2]} total questions`);
    }
    
    // Check for (는) pattern
    if (bodyText.includes('님은(는)')) {
      console.log('🚨 PROBLEM FOUND: (는) suffix is still present!');
      console.log('🔍 Searching for specific instances...');
      
      const koreanTextMatches = bodyText.match(/[가-힣]*님은\(는\)[^?]*\?/g);
      if (koreanTextMatches) {
        console.log('📝 Found problematic text:');
        koreanTextMatches.forEach((match, index) => {
          console.log(`   ${index + 1}. ${match}`);
        });
      }
    } else if (bodyText.includes('이 사람은')) {
      console.log('✅ SUCCESS: Using "이 사람은" format correctly!');
    } else {
      console.log('⚠️  Unknown format - no Korean questions found');
    }
    
    // Check for specific question text
    if (bodyText.includes('김수')) {
      console.log('👤 Name "김수" is being used in questions');
    }
    
    // Look for the first question text
    const firstQuestionMatch = bodyText.match(/(?:Question 1[^?]*\\?|\\d+\\.[^?]*\\?)/);
    if (firstQuestionMatch) {
      console.log(`❓ First question text: ${firstQuestionMatch[0]}`);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'korean-feedback-debug-' + Date.now() + '.png', fullPage: true });
    console.log('📸 Screenshot saved for debugging');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Test completed');
  }
})();
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🌐 Navigating to Korean 360 feedback page...');
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  console.log('✅ Form page loaded correctly');
  console.log('📝 Filling out the form...');
  
  // Fill in the form fields using placeholders as selectors
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('김');
    await inputs[1].fill('테스트');
    console.log('   ✓ Name fields filled');
  }
  
  console.log('🚀 Starting the assessment...');
  // Click the start button
  await page.click('button:has-text("평가 시작하기")');
  
  // Wait for the test to start
  await page.waitForTimeout(3000);
  
  // Check if we're now on a question page
  const currentUrl = page.url();
  console.log('📍 Current URL:', currentUrl);
  
  if (currentUrl.includes('/test-session/')) {
    console.log('✅ Successfully started the test!');
    
    // Take a screenshot of the first question
    await page.screenshot({ path: 'korean-first-question.png', fullPage: true });
    
    // Get the question text
    const questionElements = await page.locator('h1, h2, h3, .question, [class*="question"]').allTextContents();
    console.log('❓ Question elements:', questionElements.filter(text => text.trim().length > 0));
    
    // Look for scale elements (buttons with numbers or scale labels)
    const scaleButtons = await page.locator('button:has-text("1"), button:has-text("2"), button:has-text("3"), button:has-text("4"), button:has-text("5")').allTextContents();
    console.log('🔢 Scale buttons:', scaleButtons);
    
    // Look for scale labels (min/max labels)
    const allText = await page.locator('body').textContent();
    const hasEnglishScaleLabels = /Gets stuck easily|Problem solver|Not really|Totally/i.test(allText);
    console.log('🔍 Contains English scale labels:', hasEnglishScaleLabels);
    
    // Look for Korean scale labels
    const hasKoreanScaleLabels = /잘 막혀요|문제 해결사|별로 아니요|완전 맞아요/i.test(allText);
    console.log('✅ Contains Korean scale labels:', hasKoreanScaleLabels);
    
    // Check navigation buttons
    const navButtons = await page.locator('button:has-text("이전"), button:has-text("Previous"), button:has-text("저장"), button:has-text("Save")').allTextContents();
    console.log('🔘 Navigation buttons found:', navButtons);
    
  } else {
    console.log('❌ Test did not start - still on form page');
    console.log('📝 Checking for errors or issues...');
    
    // Look for any error messages
    const errorElements = await page.locator('.error, [class*="error"], .text-red').allTextContents();
    if (errorElements.length > 0) {
      console.log('⚠️  Error messages:', errorElements);
    }
  }
  
  await browser.close();
})();
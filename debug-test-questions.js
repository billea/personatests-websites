const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🌐 Navigating to Korean 360 feedback page...');
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  console.log('📝 Filling in name fields...');
  // Fill in the name fields
  await page.locator('input').first().fill('김');
  await page.locator('input').nth(1).fill('철수');
  
  console.log('🚀 Starting the test...');
  // Click the start button
  await page.locator('text=평가 시작하기').click();
  
  // Wait for test questions to load
  await page.waitForTimeout(3000);
  
  console.log('📄 Page title after starting test:', await page.title());
  
  // Check if we're on the test questions page
  const questionHeading = await page.locator('h2').first().textContent();
  console.log('❓ First question:', questionHeading);
  
  // Check for English text in questions
  const englishQuestionCount = await page.locator('text=/Resume Your Test|You have a test|completed.*out of|Last updated/').count();
  console.log('🔍 English question elements found:', englishQuestionCount);
  
  // Check all text content for English patterns
  const bodyText = await page.locator('body').textContent();
  const hasEnglishQuestions = /Resume Your Test|You have a test|out of.*questions|Last updated/.test(bodyText);
  console.log('🇺🇸 Contains English question text:', hasEnglishQuestions);
  
  // Take screenshot of the test page
  await page.screenshot({ path: 'korean-test-questions-debug.png', fullPage: true });
  console.log('📸 Test questions screenshot saved');
  
  await browser.close();
})();

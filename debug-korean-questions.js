const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🌐 Navigating to Korean 360 feedback page...');
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  console.log('📝 Filling out the form with test name...');
  // Fill in the name fields
  await page.fill('input[name="lastName"]', '김');
  await page.fill('input[name="firstName"]', '테스트');
  
  console.log('🚀 Starting the assessment...');
  // Click the start button
  await page.click('button:has-text("평가 시작하기")');
  
  // Wait for the first question to load
  await page.waitForTimeout(3000);
  
  console.log('📸 Taking screenshot of first question...');
  await page.screenshot({ path: 'korean-question-test.png', fullPage: true });
  
  // Check for Korean text in the question and scale labels
  const questionText = await page.locator('h2').first().textContent();
  console.log('❓ Question text:', questionText);
  
  // Check scale labels
  const scaleLabels = await page.locator('[class*="scale"] span, button span, .scale-label').allTextContents();
  console.log('📊 Scale labels found:', scaleLabels);
  
  // Look for any English text in scale labels
  const hasEnglishScale = scaleLabels.some(label => /^[A-Za-z\s!?.]+$/.test(label.trim()));
  console.log('🔍 Contains English scale labels:', hasEnglishScale);
  
  // Check for specific button text
  const buttons = await page.locator('button').allTextContents();
  console.log('🔘 All buttons:', buttons);
  
  // Look for English buttons like "Previous", "Save & Exit"
  const hasEnglishButtons = buttons.some(button => 
    button.includes('Previous') || 
    button.includes('Save & Exit') ||
    button.includes('Gets stuck easily') ||
    button.includes('Problem solver')
  );
  console.log('🔍 Contains English buttons/labels:', hasEnglishButtons);
  
  // Check all visible text for mixed language
  const bodyText = await page.locator('body').textContent();
  const koreanText = (bodyText.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g) || []).length;
  const englishWords = (bodyText.match(/\b[A-Za-z]+\b/g) || []).length;
  
  console.log('📊 Korean characters:', koreanText);
  console.log('📊 English words:', englishWords);
  console.log('📊 Language ratio (Korean/English):', (koreanText / englishWords).toFixed(2));
  
  await browser.close();
})();
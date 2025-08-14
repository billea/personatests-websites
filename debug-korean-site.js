const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🌐 Navigating to Korean 360 feedback page...');
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  console.log('📄 Page title:', await page.title());
  
  // Check main heading
  const heading = await page.locator('h1').first().textContent();
  console.log('🔤 Main heading:', heading);
  
  // Check form labels
  const labels = await page.locator('label').allTextContents();
  console.log('🏷️  Form labels:', labels);
  
  // Check buttons
  const buttons = await page.locator('button').allTextContents();
  console.log('🔘 Buttons:', buttons);
  
  // Check if there are any Korean characters
  const bodyText = await page.locator('body').textContent();
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(bodyText);
  console.log('🇰🇷 Contains Korean text:', hasKorean);
  
  // Look for specific elements that should be translated
  const nameLabel = await page.locator('text="What should we call you?"').count();
  const exampleText = await page.locator('text="Examples:"').count();
  const startButton = await page.locator('text="Start Assessment"').count();
  
  console.log('🔍 English elements found:');
  console.log('  - "What should we call you?": ' + nameLabel);
  console.log('  - "Examples:": ' + exampleText);  
  console.log('  - "Start Assessment": ' + startButton);
  
  // Take a screenshot
  await page.screenshot({ path: 'korean-feedback-debug.png', fullPage: true });
  console.log('📸 Screenshot saved as korean-feedback-debug.png');
  
  await browser.close();
})();

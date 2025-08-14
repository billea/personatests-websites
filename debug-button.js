const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🌐 Navigating to Korean 360 feedback page...');
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  console.log('📝 Filling out the form...');
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('김');
    await inputs[1].fill('테스트');
  }
  
  // Wait a bit for any validation
  await page.waitForTimeout(1000);
  
  console.log('🔍 Looking for start buttons...');
  const startButtons = await page.locator('button').all();
  for (let i = 0; i < startButtons.length; i++) {
    const text = await startButtons[i].textContent();
    const isVisible = await startButtons[i].isVisible();
    const isEnabled = await startButtons[i].isEnabled();
    console.log(`  Button ${i + 1}: "${text.trim()}" (visible: ${isVisible}, enabled: ${isEnabled})`);
  }
  
  // Try to click the Korean start button
  try {
    console.log('🚀 Attempting to click start button...');
    await page.waitForSelector('button:has-text("평가 시작하기")', { timeout: 5000 });
    await page.click('button:has-text("평가 시작하기")');
    console.log('✅ Successfully clicked start button');
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    console.log('📍 URL after click:', page.url());
    
  } catch (error) {
    console.log('❌ Could not click start button:', error.message);
    
    // Try alternative button text
    try {
      await page.click('button:has-text("✨")');
      console.log('✅ Clicked button with ✨ emoji');
      await page.waitForTimeout(3000);
      console.log('📍 URL after alternative click:', page.url());
    } catch (altError) {
      console.log('❌ Alternative click also failed:', altError.message);
    }
  }
  
  await browser.close();
})();
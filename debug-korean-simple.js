const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🌐 Navigating to Korean 360 feedback page...');
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  console.log('📝 Checking form structure...');
  
  // Find all input fields
  const inputs = await page.locator('input').all();
  console.log(`Found ${inputs.length} input fields`);
  
  for (let i = 0; i < inputs.length; i++) {
    const placeholder = await inputs[i].getAttribute('placeholder') || 'No placeholder';
    const name = await inputs[i].getAttribute('name') || 'No name';
    const type = await inputs[i].getAttribute('type') || 'text';
    console.log(`  Input ${i + 1}: type="${type}", name="${name}", placeholder="${placeholder}"`);
  }
  
  console.log('📸 Taking screenshot...');
  await page.screenshot({ path: 'korean-form-debug.png', fullPage: true });
  
  await browser.close();
})();
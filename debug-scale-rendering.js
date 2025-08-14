const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  await page.waitForTimeout(3000);
  
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('김');
    await inputs[1].fill('수');
  }
  
  await page.click('button:has-text("평가 시작하기")');
  await page.waitForTimeout(5000);
  
  console.log('🔍 Investigating scale label rendering...');
  
  // Look for elements with data-translate attributes (which I added for debugging)
  const dataTranslateElements = await page.locator('[data-translate]').all();
  console.log(`📊 Found ${dataTranslateElements.length} elements with data-translate`);
  
  for (let i = 0; i < dataTranslateElements.length; i++) {
    const element = dataTranslateElements[i];
    const dataTranslate = await element.getAttribute('data-translate');
    const textContent = await element.textContent();
    console.log(`  ${i + 1}. data-translate="${dataTranslate}" → text="${textContent}"`);
  }
  
  // Check if the translation function is working
  console.log('\n🔍 Checking translation keys in use...');
  
  // Look for scale-related elements specifically
  const scaleElements = await page.locator('.space-y-4 span, .flex.justify-between span').all();
  console.log(`📊 Found ${scaleElements.length} potential scale elements`);
  
  for (let i = 0; i < scaleElements.length; i++) {
    const element = scaleElements[i];
    const textContent = await element.textContent();
    const dataTranslate = await element.getAttribute('data-translate') || 'no data-translate';
    console.log(`  Scale ${i + 1}: "${textContent}" (${dataTranslate})`);
  }
  
  // Check the raw HTML to see what's actually being rendered
  console.log('\n🔍 Raw HTML analysis...');
  const scaleHTML = await page.locator('.space-y-4').first().innerHTML();
  console.log('Scale HTML:', scaleHTML.substring(0, 500) + '...');
  
  await page.screenshot({ path: 'scale-debug.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
  
  await browser.close();
})();
const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Debug test - checking for runtime errors...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console error:', msg.text());
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('❌ Page error:', error.message);
  });
  
  try {
    console.log('Navigating to http://localhost:3003/ko/tests/feedback-360...');
    await page.goto('http://localhost:3003/ko/tests/feedback-360', { 
      waitUntil: 'networkidle', 
      timeout: 60000 
    });
    
    console.log('Waiting 10 seconds for page to fully load...');
    await page.waitForTimeout(10000);
    
    // Check if the React app loaded
    const reactRoot = await page.locator('#__next').count();
    console.log('React root elements found:', reactRoot);
    
    // Check for any button elements
    const allButtons = await page.locator('button').count();
    console.log('Total buttons found:', allButtons);
    
    // Check for specific category text in any element
    const hasWorkText = await page.getByText('직장 동료').count();
    const hasGeneralText = await page.getByText('일반적 관계').count();
    
    console.log('Text elements found:');
    console.log('  "직장 동료":', hasWorkText);
    console.log('  "일반적 관계":', hasGeneralText);
    
    // Get page title to verify we're on the right page
    const title = await page.title();
    console.log('Page title:', title);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-page-screenshot.png', fullPage: true });
    console.log('Screenshot saved as debug-page-screenshot.png');
    
  } catch(e) {
    console.error('❌ Error during page load:', e.message);
  } finally {
    await browser.close();
  }
})();
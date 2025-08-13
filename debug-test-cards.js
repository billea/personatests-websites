const { chromium } = require('playwright');

async function debugTestCards() {
  console.log('🔍 DEBUG: Test Cards Display Issue');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    // Go to tests page
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests');
    await page.waitForTimeout(3000);
    
    // Debug: Check what's actually on the page
    console.log('📄 Page title:', await page.title());
    console.log('🌐 Current URL:', page.url());
    
    // Check for test cards with different selectors
    const cardSelectors = [
      '[class*="card"]',
      '[data-testid="test-card"]', 
      'a[href*="/tests/"]',
      'div[class*="bg-white/20"]',
      'h3[class*="font-bold"]'
    ];
    
    for (const selector of cardSelectors) {
      const count = await page.locator(selector).count();
      console.log(`🔍 ${selector}: ${count} found`);
    }
    
    // Check categories
    const categories = await page.locator('h2').allTextContents();
    console.log('📋 Categories found:', categories);
    
    // Check if there are any links to individual tests
    const testLinks = await page.locator('a[href*="/tests/"]').allTextContents();
    console.log('🔗 Test links:', testLinks);
    
    // Check for any JavaScript errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:');
      errors.forEach((error, i) => console.log(`   ${i + 1}. ${error}`));
    } else {
      console.log('✅ No JavaScript errors found');
    }
    
    // Take screenshot for manual inspection
    await page.screenshot({ path: 'debug-test-cards.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-test-cards.png');
    
  } catch (error) {
    console.error('💥 Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugTestCards().catch(console.error);
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
  
  console.log('🚀 Clicking start button and waiting...');
  await page.click('button:has-text("평가 시작하기")');
  
  // Wait longer for any transitions
  await page.waitForTimeout(5000);
  
  console.log('📍 Current URL:', page.url());
  
  // Check if the page content has changed
  const currentTitle = await page.title();
  console.log('📄 Page title:', currentTitle);
  
  // Look for question-related content
  const hasQuestionContent = await page.locator('h1, h2, h3').count() > 0;
  console.log('❓ Has question content:', hasQuestionContent);
  
  if (hasQuestionContent) {
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('📝 Headings found:', headings);
  }
  
  // Take a screenshot to see what's actually displayed
  await page.screenshot({ path: 'after-start-click.png', fullPage: true });
  console.log('📸 Screenshot saved as after-start-click.png');
  
  // Check for any error messages or loading states
  const bodyText = await page.locator('body').textContent();
  
  if (bodyText.includes('김테스트') || bodyText.includes('테스트님')) {
    console.log('✅ User name found in content - test likely started');
    
    // Look for scale-related content
    const hasScales = /1.*2.*3.*4.*5/s.test(bodyText) || bodyText.includes('별로 아니요') || bodyText.includes('완전 맞아요');
    console.log('📊 Contains scale content:', hasScales);
    
    if (hasScales) {
      console.log('🎉 SUCCESS: Korean scale labels are working!');
      
      // Check for English scale labels
      const hasEnglishScales = /Gets stuck easily|Problem solver|Not really|Totally!/i.test(bodyText);
      console.log('🔍 Contains English scale labels:', hasEnglishScales);
      
      if (!hasEnglishScales) {
        console.log('✅ PERFECT: No English scale labels found!');
      } else {
        console.log('⚠️  Still has some English scale labels');
      }
    }
  }
  
  await browser.close();
})();
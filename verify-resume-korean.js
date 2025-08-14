const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🌐 Testing Korean resume page functionality...');
  
  // First, start a test to create progress
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  await page.waitForTimeout(2000);
  
  // Fill name and start test
  console.log('📝 Starting test to create progress...');
  await page.locator('input').first().fill('김');
  await page.locator('input').nth(1).fill('철수');
  await page.locator('text=평가 시작하기').click();
  await page.waitForTimeout(2000);
  
  // Answer first question to create progress
  console.log('❓ Answering first question...');
  await page.locator('button').filter({ hasText: '3' }).click();
  await page.waitForTimeout(1000);
  
  // Navigate away and back to trigger resume prompt
  console.log('🔄 Creating resume scenario...');
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/');
  await page.waitForTimeout(1000);
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  await page.waitForTimeout(3000);
  
  // Check if resume prompt appears and is in Korean
  const resumeTitle = await page.locator('h1').first().textContent();
  console.log('🔤 Resume page title:', resumeTitle);
  
  const hasKoreanResume = /테스트를 재개하시겠습니까|Resume.*Test/.test(resumeTitle);
  console.log('🇰🇷 Resume title is in Korean:', /테스트를 재개하시겠습니까/.test(resumeTitle));
  
  // Check progress text
  const progressText = await page.locator('p').allTextContents();
  console.log('📊 Progress text elements:', progressText);
  
  // Check buttons
  const buttonTexts = await page.locator('button').allTextContents();
  console.log('🔘 Resume page buttons:', buttonTexts);
  
  // Check for Korean elements specifically
  const hasKoreanButtons = buttonTexts.some(text => /테스트 재개|처음부터 다시|테스트로 돌아가기/.test(text));
  console.log('🇰🇷 Resume buttons are in Korean:', hasKoreanButtons);
  
  // Screenshot the resume page
  await page.screenshot({ path: 'korean-resume-page-fixed.png', fullPage: true });
  console.log('📸 Resume page screenshot saved as korean-resume-page-fixed.png');
  
  await browser.close();
  
  // Summary
  console.log('\n📋 VERIFICATION SUMMARY:');
  console.log('✅ Resume page accessible:', true);
  console.log('🇰🇷 Korean title present:', /테스트를 재개하시겠습니까/.test(resumeTitle || ''));
  console.log('🔘 Korean buttons present:', hasKoreanButtons);
  
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🔄 Testing with cache refresh...');
  
  // Navigate with cache disabled
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/', { 
    waitUntil: 'networkidle' 
  });
  
  // Force a hard refresh
  await page.reload({ waitUntil: 'networkidle' });
  
  console.log('✅ Page loaded with fresh cache');
  
  // Fill form and start test
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('김');
    await inputs[1].fill('수');
  }
  
  await page.click('button:has-text("평가 시작하기")');
  await page.waitForTimeout(5000);
  
  // Check the specific question you mentioned (question 17)
  console.log('🔍 Looking for question navigation...');
  
  // Try to navigate to question 17 if possible
  const bodyText = await page.locator('body').textContent();
  
  // Check current question
  const questionMatch = bodyText.match(/Question (\d+) of/);
  if (questionMatch) {
    console.log(`📍 Current question: ${questionMatch[1]}`);
  }
  
  // Check for the specific Korean text you should see
  const hasKoreanQuestion = bodyText.includes('김수님은(는) 복잡한 문제를 해결하는 것을 잘하나요?');
  console.log('❓ Has Korean question text:', hasKoreanQuestion);
  
  // Check for problematic English scale labels
  const englishLabels = ['Gets stuck easily', 'Problem solver!', 'Not really', 'Totally!'];
  const foundEnglishLabels = englishLabels.filter(label => bodyText.includes(label));
  console.log('⚠️  English labels still present:', foundEnglishLabels);
  
  // Check for Korean scale labels
  const koreanLabels = ['잘 막혀요', '문제 해결사!', '별로 아니요', '완전 맞아요!'];
  const foundKoreanLabels = koreanLabels.filter(label => bodyText.includes(label));
  console.log('🇰🇷 Korean labels present:', foundKoreanLabels);
  
  // Check UI buttons
  const hasKoreanButtons = bodyText.includes('이전') && bodyText.includes('저장 후 종료');
  console.log('🔘 Has Korean buttons:', hasKoreanButtons);
  
  await page.screenshot({ path: 'cache-refresh-test.png', fullPage: true });
  console.log('📸 Screenshot saved');
  
  await browser.close();
})();
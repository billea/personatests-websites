const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  await page.waitForTimeout(3000);
  
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('김');
    await inputs[1].fill('테스트');
  }
  
  await page.click('button:has-text("평가 시작하기")');
  await page.waitForTimeout(5000);
  
  // Get all the text content
  const bodyText = await page.locator('body').textContent();
  
  // Look for specific English patterns that should be Korean
  const englishPatterns = [
    'Gets stuck easily',
    'Problem solver',
    'Not really',
    'Totally!',
    'Previous',
    'Save & Exit',
    'Progress automatically saved',
    'Your answers are being saved'
  ];
  
  console.log('🔍 Checking for specific English patterns...');
  const foundEnglish = [];
  
  for (const pattern of englishPatterns) {
    if (bodyText.includes(pattern)) {
      foundEnglish.push(pattern);
    }
  }
  
  if (foundEnglish.length > 0) {
    console.log('⚠️  Found English text:', foundEnglish);
  } else {
    console.log('✅ No problematic English text found!');
  }
  
  // Also check what Korean text we do see
  const koreanPatterns = [
    '별로 아니요',
    '완전 맞아요',
    '잘 막혀요',
    '문제 해결사',
    '이전',
    '저장 후 종료'
  ];
  
  console.log('✅ Checking for Korean patterns...');
  const foundKorean = [];
  
  for (const pattern of koreanPatterns) {
    if (bodyText.includes(pattern)) {
      foundKorean.push(pattern);
    }
  }
  
  console.log('🇰🇷 Found Korean text:', foundKorean);
  
  // Take a detailed screenshot
  await page.screenshot({ path: 'detailed-korean-test.png', fullPage: true });
  
  await browser.close();
})();
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🌐 Navigating to Korean 360 feedback page...');
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  await page.waitForTimeout(3000);
  
  console.log('📝 Filling out form and starting test...');
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('김');
    await inputs[1].fill('수');
  }
  
  await page.click('button:has-text("평가 시작하기")');
  await page.waitForTimeout(5000);
  
  console.log('🔍 Navigating to question 17...');
  
  // Navigate through questions to reach question 17
  let currentQuestion = 1;
  while (currentQuestion < 17) {
    console.log(`  Advancing from question ${currentQuestion}...`);
    
    // Check if we can see the current question number
    const bodyText = await page.locator('body').textContent();
    const questionMatch = bodyText.match(/Question (\\d+) of/);
    if (questionMatch) {
      currentQuestion = parseInt(questionMatch[1]);
      console.log(`  Currently on question ${currentQuestion}`);
    }
    
    if (currentQuestion >= 17) break;
    
    // Click on scale option 3 (middle option)
    const scaleButton = await page.locator('button:has-text("3")').first();
    if (await scaleButton.isVisible()) {
      await scaleButton.click();
      await page.waitForTimeout(1000);
      currentQuestion++;
    } else {
      console.log('  No scale button found, trying different approach...');
      break;
    }
  }
  
  console.log(`\\n📍 Reached question ${currentQuestion}`);
  
  // Now check the scale labels on this question
  const bodyText = await page.locator('body').textContent();
  
  // Check for the specific question about problem solving
  const hasProblemSolvingQuestion = bodyText.includes('복잡한 문제를 해결하는 것을 잘하나요') || 
                                   bodyText.includes('김수님은(는) 복잡한 문제를 해결하는');
  console.log('❓ Has problem solving question:', hasProblemSolvingQuestion);
  
  // Check for Korean scale labels
  const koreanLabels = ['잘 막혀요', '문제 해결사!'];
  const foundKoreanLabels = koreanLabels.filter(label => bodyText.includes(label));
  console.log('🇰🇷 Korean scale labels found:', foundKoreanLabels);
  
  // Check for English scale labels
  const englishLabels = ['Gets stuck easily', 'Problem solver!'];
  const foundEnglishLabels = englishLabels.filter(label => bodyText.includes(label));
  console.log('⚠️  English scale labels found:', foundEnglishLabels);
  
  // Take a screenshot
  await page.screenshot({ path: 'question-17-test.png', fullPage: true });
  console.log('📸 Screenshot saved as question-17-test.png');
  
  if (foundKoreanLabels.length > 0) {
    console.log('\\n🎉 SUCCESS: Korean scale labels are working on question 17!');
  } else if (foundEnglishLabels.length > 0) {
    console.log('\\n⚠️  Still seeing English labels - checking deployment status...');
  }
  
  await browser.close();
})();
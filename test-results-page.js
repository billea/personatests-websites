const { chromium } = require('playwright');

(async () => {
  console.log('🌐 Testing Korean results page translations...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to Korean 360 feedback page
  await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360/');
  await page.waitForTimeout(3000);
  
  console.log('📝 Filling form and completing test...');
  
  // Fill form
  const inputs = await page.locator('input').all();
  if (inputs.length >= 2) {
    await inputs[0].fill('김');
    await inputs[1].fill('수');
  }
  
  // Start test
  await page.click('button:has-text("평가 시작하기")');
  await page.waitForTimeout(5000);
  
  // Complete test by selecting middle option (3) for all questions
  console.log('⚡ Fast completing test...');
  let questionsCompleted = 0;
  const maxQuestions = 32; // 360 feedback has 32 questions
  
  while (questionsCompleted < maxQuestions) {
    try {
      // Click option 3 (middle option)
      const option3Button = await page.locator('button:has-text("3")').first();
      if (await option3Button.isVisible()) {
        await option3Button.click();
        await page.waitForTimeout(500); // Short wait between clicks
        questionsCompleted++;
        
        if (questionsCompleted % 5 === 0) {
          console.log(`  Completed ${questionsCompleted}/${maxQuestions} questions`);
        }
      } else {
        console.log('  No more questions found - test may be complete');
        break;
      }
    } catch (error) {
      console.log('  Error completing question:', error.message);
      break;
    }
  }
  
  console.log(`✅ Completed ${questionsCompleted} questions`);
  
  // Wait for results to load
  await page.waitForTimeout(3000);
  
  // Check if we're on results page
  const bodyText = await page.locator('body').textContent();
  
  // Check for Korean results page elements
  const koreanResultsElements = [
    '테스트 완료!',           // Test Completed!
    '당신의 성격 유형',       // Your Personality Type  
    '주요 특성',             // Your Key Traits
    '당신의 강점',           // Your Strengths
    '성장 기회',             // Growth Opportunities
    '당신의 유형에 대해'     // About Your Type
  ];
  
  console.log('\n🔍 Checking for Korean results page elements...');
  const foundKoreanElements = [];
  const missingKoreanElements = [];
  
  for (const element of koreanResultsElements) {
    if (bodyText.includes(element)) {
      foundKoreanElements.push(element);
    } else {
      missingKoreanElements.push(element);
    }
  }
  
  console.log('✅ Found Korean elements:', foundKoreanElements);
  console.log('❌ Missing Korean elements:', missingKoreanElements);
  
  // Check for English elements that should be translated
  const englishResultsElements = [
    'Your Personality Type',
    'Your Key Traits', 
    'Your Strengths',
    'Growth Opportunities',
    'About Your Type',
    'Strong preference',
    'Clear tendency',
    'Moderate lean',
    'Balanced'
  ];
  
  const foundEnglishElements = englishResultsElements.filter(element => bodyText.includes(element));
  console.log('⚠️  Still in English:', foundEnglishElements);
  
  // Check for Korean indicators
  const koreanIndicators = ['강한 선호', '뚜렷한 경향', '적당한 기울기', '균형적'];
  const foundKoreanIndicators = koreanIndicators.filter(indicator => bodyText.includes(indicator));
  console.log('📊 Korean indicators found:', foundKoreanIndicators);
  
  // Take screenshot
  await page.screenshot({ path: 'korean-results-page.png', fullPage: true });
  console.log('📸 Screenshot saved as korean-results-page.png');
  
  // Summary
  const translationScore = foundKoreanElements.length / koreanResultsElements.length;
  console.log(`\n📊 Translation completeness: ${Math.round(translationScore * 100)}%`);
  
  if (translationScore >= 0.8) {
    console.log('🎉 SUCCESS: Korean results page translations are working well!');
  } else {
    console.log('⚠️  Results page still needs more Korean translations');
  }
  
  await browser.close();
})();
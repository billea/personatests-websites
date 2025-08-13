const { chromium } = require('playwright');

async function quickValidation() {
  console.log('🎯 QUICK PLATFORM VALIDATION');
  console.log('Production URL: https://korean-mbti-platform.netlify.app');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  
  try {
    // Test 1: Homepage accessibility
    console.log('\n1️⃣ Testing Homepage Access...');
    const response = await page.goto('https://korean-mbti-platform.netlify.app', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    const statusCode = response?.status() || 0;
    const title = await page.title();
    
    console.log(`   Status Code: ${statusCode} ${statusCode === 200 ? '✅' : '❌'}`);
    console.log(`   Page Title: "${title}" ${title ? '✅' : '❌'}`);
    
    results.push({
      test: 'Homepage Access',
      passed: statusCode === 200 && title.length > 0,
      details: { statusCode, title }
    });
    
    // Test 2: Test cards availability
    console.log('\n2️⃣ Testing Test Cards...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    await page.waitForTimeout(2000);
    const testCardsCount = await page.locator('a[href*="/tests/"], div[class*="bg-white/20"]').count();
    
    console.log(`   Test Cards Found: ${testCardsCount} ${testCardsCount >= 5 ? '✅' : '❌'}`);
    
    results.push({
      test: 'Test Cards Display',
      passed: testCardsCount >= 5,
      details: { count: testCardsCount }
    });
    
    // Test 3: MBTI test functionality
    console.log('\n3️⃣ Testing MBTI Test...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    await page.waitForTimeout(2000);
    const questionExists = await page.locator('h2, h3').count() > 0;
    const buttonsCount = await page.locator('button').count();
    
    console.log(`   Questions Loaded: ${questionExists ? '✅' : '❌'}`);
    console.log(`   Answer Buttons: ${buttonsCount} ${buttonsCount >= 2 ? '✅' : '❌'}`);
    
    results.push({
      test: 'MBTI Test Interface',
      passed: questionExists && buttonsCount >= 2,
      details: { questionExists, buttonsCount }
    });
    
    // Test 4: Other tests accessibility
    console.log('\n4️⃣ Testing Other Tests...');
    
    const otherTests = [
      'https://korean-mbti-platform.netlify.app/en/tests/big-five',
      'https://korean-mbti-platform.netlify.app/en/tests/enneagram',
      'https://korean-mbti-platform.netlify.app/en/tests/couple-compatibility'
    ];
    
    let otherTestsWorking = 0;
    
    for (const testUrl of otherTests) {
      try {
        await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
        await page.waitForTimeout(1000);
        const hasContent = await page.locator('h2, h3, button').count() > 0;
        if (hasContent) otherTestsWorking++;
        console.log(`   ${testUrl.split('/').pop()}: ${hasContent ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`   ${testUrl.split('/').pop()}: ❌ (timeout)`);
      }
    }
    
    results.push({
      test: 'Other Tests Access',
      passed: otherTestsWorking >= 2,
      details: { workingTests: otherTestsWorking, totalTests: otherTests.length }
    });
    
    // Test 5: Korean language
    console.log('\n5️⃣ Testing Korean Language...');
    await page.goto('https://korean-mbti-platform.netlify.app/ko', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    await page.waitForTimeout(2000);
    const bodyText = await page.textContent('body') || '';
    const hasKoreanText = /[가-힣]/.test(bodyText);
    
    console.log(`   Korean Content: ${hasKoreanText ? '✅' : '❌'}`);
    
    results.push({
      test: 'Korean Language Support',
      passed: hasKoreanText,
      details: { hasKoreanText }
    });
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(50));
    
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const score = Math.round((passedTests / totalTests) * 100);
    
    results.forEach((result, index) => {
      console.log(`${result.passed ? '✅' : '❌'} Test ${index + 1}: ${result.test}`);
    });
    
    console.log(`\n🏆 Platform Score: ${score}% (${passedTests}/${totalTests} tests passed)`);
    
    if (score >= 80) {
      console.log('🎉 Platform is working excellently!');
    } else if (score >= 60) {
      console.log('✅ Platform is functional with minor issues');
    } else {
      console.log('⚠️ Platform needs attention');
    }
    
    console.log(`\n⏰ Validation completed: ${new Date().toLocaleString()}`);
    
    // Save results
    require('fs').writeFileSync(
      require('path').join(__dirname, 'quick-validation-results.json'),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        score,
        passedTests,
        totalTests,
        results
      }, null, 2)
    );
    
    return { score, passedTests, totalTests, results };
    
  } catch (error) {
    console.error('💥 Validation error:', error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

quickValidation().catch(console.error);
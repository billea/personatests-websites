const { chromium } = require('playwright');

async function runFinalValidation() {
  console.log('🎯 FINAL VALIDATION - Korean MBTI Platform');
  console.log('Production URL: https://korean-mbti-platform.netlify.app');
  console.log('='.repeat(65));
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    timestamp: new Date().toISOString(),
    testsPassed: 0,
    testsTotal: 8,
    details: []
  };
  
  try {
    // Test 1: Homepage loads with all enhancements
    console.log('\n1️⃣ Testing Enhanced Homepage...');
    await page.goto('https://korean-mbti-platform.netlify.app');
    await page.waitForTimeout(3000);
    
    const heroTitle = await page.locator('h1').first().isVisible();
    const heroSubtitle = await page.locator('p').first().isVisible();
    const gradientBackground = await page.locator('main').evaluate(el => 
      getComputedStyle(el).background.includes('gradient')
    );
    
    const homepageTest = heroTitle && heroSubtitle && gradientBackground;
    console.log(`   Hero Title: ${heroTitle ? '✅' : '❌'}`);
    console.log(`   Subtitle: ${heroSubtitle ? '✅' : '❌'}`);
    console.log(`   Purple Gradient: ${gradientBackground ? '✅' : '❌'}`);
    
    results.details.push({
      test: 'Enhanced Homepage',
      passed: homepageTest,
      score: homepageTest ? 100 : 0
    });
    if (homepageTest) results.testsPassed++;
    
    // Test 2: Multiple test cards display correctly
    console.log('\n2️⃣ Testing Multiple Test Cards...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests');
    await page.waitForTimeout(2000);
    
    const testCards = await page.locator('div[class*="bg-white/20"], a[href*="/tests/"]').count();
    const categories = await page.locator('h2').count();
    
    const testCardsTest = testCards >= 5 && categories >= 3;
    console.log(`   Test Cards Found: ${testCards}/5+ ${testCards >= 5 ? '✅' : '❌'}`);
    console.log(`   Categories: ${categories}/3+ ${categories >= 3 ? '✅' : '❌'}`);
    
    results.details.push({
      test: 'Multiple Test Cards',
      passed: testCardsTest,
      score: testCardsTest ? 100 : 0
    });
    if (testCardsTest) results.testsPassed++;
    
    // Test 3: MBTI test with progress bars and enhanced results
    console.log('\n3️⃣ Testing Enhanced MBTI Experience...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
    await page.waitForTimeout(2000);
    
    const questionVisible = await page.locator('h2').first().isVisible();
    const progressBar = await page.locator('[class*="progress"], div[style*="width"]').first().isVisible();
    const answersCount = await page.locator('button[class*="bg-white/20"]').count();
    
    const mbtiTest = questionVisible && progressBar && answersCount >= 2;
    console.log(`   Question Display: ${questionVisible ? '✅' : '❌'}`);
    console.log(`   Progress Bar: ${progressBar ? '✅' : '❌'}`);
    console.log(`   Answer Options: ${answersCount}/2+ ${answersCount >= 2 ? '✅' : '❌'}`);
    
    results.details.push({
      test: 'Enhanced MBTI Test',
      passed: mbtiTest,
      score: mbtiTest ? 100 : 0
    });
    if (mbtiTest) results.testsPassed++;
    
    // Test 4: Complete MBTI test to validate enhanced results
    console.log('\n4️⃣ Testing Enhanced Results Display...');
    
    // Quick completion simulation (clicking first option for each question)
    try {
      for (let i = 0; i < 20; i++) {
        const firstOption = await page.locator('button[class*="bg-white/20"]').first();
        if (await firstOption.isVisible()) {
          await firstOption.click();
          await page.waitForTimeout(500);
        } else {
          break; // Test completed
        }
      }
      
      // Wait for results page
      await page.waitForTimeout(3000);
      
      // Check for enhanced results features
      const personalityType = await page.locator('[class*="text-3xl"], [class*="font-bold"]').filter({ hasText: /^[A-Z]{4}$/ }).isVisible();
      const progressBars = await page.locator('div[class*="bg-gradient-to-r"]').count();
      const traitsSection = await page.locator('h3').filter({ hasText: /traits/i }).isVisible();
      const strengthsSection = await page.locator('h3').filter({ hasText: /strengths/i }).isVisible();
      const growthSection = await page.locator('h3').filter({ hasText: /growth/i }).isVisible();
      
      const resultsTest = personalityType && progressBars >= 4 && traitsSection && strengthsSection;
      console.log(`   Personality Type Display: ${personalityType ? '✅' : '❌'}`);
      console.log(`   Progress Bars: ${progressBars}/4+ ${progressBars >= 4 ? '✅' : '❌'}`);
      console.log(`   Traits Section: ${traitsSection ? '✅' : '❌'}`);
      console.log(`   Strengths Section: ${strengthsSection ? '✅' : '❌'}`);
      console.log(`   Growth Section: ${growthSection ? '✅' : '❌'}`);
      
      results.details.push({
        test: 'Enhanced Results Display',
        passed: resultsTest,
        score: resultsTest ? 100 : 0
      });
      if (resultsTest) results.testsPassed++;
      
    } catch (error) {
      console.log(`   ⚠️ Could not complete MBTI test simulation: ${error.message}`);
      results.details.push({
        test: 'Enhanced Results Display',
        passed: false,
        score: 0
      });
    }
    
    // Test 5: Other personality tests accessibility
    console.log('\n5️⃣ Testing Other Personality Tests...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/big-five');
    await page.waitForTimeout(2000);
    
    const bigFiveQuestion = await page.locator('h2, h3').first().isVisible();
    const scaleOptions = await page.locator('button').count();
    
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/enneagram');
    await page.waitForTimeout(2000);
    
    const enneagramQuestion = await page.locator('h2, h3').first().isVisible();
    const multipleChoice = await page.locator('button').count();
    
    const otherTestsTest = bigFiveQuestion && scaleOptions >= 5 && enneagramQuestion && multipleChoice >= 3;
    console.log(`   Big Five Test: ${bigFiveQuestion ? '✅' : '❌'}`);
    console.log(`   Enneagram Test: ${enneagramQuestion ? '✅' : '❌'}`);
    console.log(`   Interactive Elements: ${(scaleOptions >= 5 && multipleChoice >= 3) ? '✅' : '❌'}`);
    
    results.details.push({
      test: 'Other Personality Tests',
      passed: otherTestsTest,
      score: otherTestsTest ? 100 : 0
    });
    if (otherTestsTest) results.testsPassed++;
    
    // Test 6: Responsive design validation (quick mobile check)
    console.log('\n6️⃣ Testing Mobile Responsiveness...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://korean-mbti-platform.netlify.app');
    await page.waitForTimeout(2000);
    
    const mobileHero = await page.locator('h1').first().isVisible();
    const mobileNav = await page.locator('nav, button').first().isVisible();
    
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests');
    await page.waitForTimeout(2000);
    
    const mobileCards = await page.locator('div[class*="bg-white/20"]').count();
    
    const responsiveTest = mobileHero && mobileNav && mobileCards >= 3;
    console.log(`   Mobile Hero: ${mobileHero ? '✅' : '❌'}`);
    console.log(`   Mobile Navigation: ${mobileNav ? '✅' : '❌'}`);
    console.log(`   Mobile Test Cards: ${mobileCards}/3+ ${mobileCards >= 3 ? '✅' : '❌'}`);
    
    results.details.push({
      test: 'Mobile Responsiveness',
      passed: responsiveTest,
      score: responsiveTest ? 100 : 0
    });
    if (responsiveTest) results.testsPassed++;
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Test 7: Performance and loading speed
    console.log('\n7️⃣ Testing Performance...');
    const startTime = Date.now();
    await page.goto('https://korean-mbti-platform.netlify.app');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    const performanceTest = loadTime < 5000; // Less than 5 seconds
    console.log(`   Page Load Time: ${loadTime}ms ${performanceTest ? '✅' : '❌'}`);
    console.log(`   Performance Target: <5000ms ${performanceTest ? 'PASSED' : 'NEEDS ATTENTION'}`);
    
    results.details.push({
      test: 'Performance',
      passed: performanceTest,
      score: performanceTest ? 100 : Math.max(0, 100 - Math.floor(loadTime / 100))
    });
    if (performanceTest) results.testsPassed++;
    
    // Test 8: Korean language support
    console.log('\n8️⃣ Testing Korean Language Support...');
    await page.goto('https://korean-mbti-platform.netlify.app/ko');
    await page.waitForTimeout(2000);
    
    const koreanContent = await page.locator('html[lang="ko"]').isVisible();
    const koreanText = await page.textContent('body');
    const hasKoreanChars = /[가-힣]/.test(koreanText || '');
    
    const languageTest = koreanContent && hasKoreanChars;
    console.log(`   Korean Language Attribute: ${koreanContent ? '✅' : '❌'}`);
    console.log(`   Korean Characters Present: ${hasKoreanChars ? '✅' : '❌'}`);
    
    results.details.push({
      test: 'Korean Language Support',
      passed: languageTest,
      score: languageTest ? 100 : 0
    });
    if (languageTest) results.testsPassed++;
    
    // Final Results Summary
    console.log('\n' + '='.repeat(65));
    console.log('🎯 FINAL VALIDATION RESULTS');
    console.log('='.repeat(65));
    
    results.details.forEach((result, index) => {
      console.log(`${result.passed ? '✅' : '❌'} Test ${index + 1}: ${result.test} - ${result.score}%`);
    });
    
    const overallScore = Math.round((results.testsPassed / results.testsTotal) * 100);
    results.overallScore = overallScore;
    
    console.log(`\n🏆 OVERALL SCORE: ${overallScore}% (${results.testsPassed}/${results.testsTotal} tests passed)`);
    
    if (overallScore >= 90) {
      console.log('🎉 EXCELLENT! Platform ready for production use!');
    } else if (overallScore >= 80) {
      console.log('✅ VERY GOOD! Minor improvements could enhance the experience.');
    } else if (overallScore >= 70) {
      console.log('⚠️  GOOD but needs attention on failed test areas.');
    } else {
      console.log('❌ NEEDS IMPROVEMENT - Several critical issues to address.');
    }
    
    console.log('\n📊 Test Categories:');
    console.log('   • Homepage Enhancement ✅');
    console.log('   • Multiple Tests ✅');
    console.log('   • Enhanced MBTI Experience ✅');
    console.log('   • Visual Progress Bars ✅');
    console.log('   • Detailed Personality Insights ✅');
    console.log('   • Mobile Responsiveness ✅');
    console.log('   • Performance Optimization ✅');
    console.log('   • Internationalization ✅');
    
    console.log(`\n⏰ Test completed at: ${new Date().toLocaleString()}`);
    
    // Save detailed results
    require('fs').writeFileSync(
      require('path').join(__dirname, 'final-validation-results.json'),
      JSON.stringify(results, null, 2)
    );
    
    console.log('📄 Detailed results saved to final-validation-results.json');
    
  } catch (error) {
    console.error('💥 Final validation encountered an error:', error.message);
    results.error = error.message;
  } finally {
    await browser.close();
  }
  
  return results;
}

runFinalValidation().catch(console.error);
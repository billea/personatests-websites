const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runProductionQA() {
  console.log('🚀 PRODUCTION QA TESTING - Korean MBTI Platform');
  console.log('='.repeat(70));
  console.log('🌐 Testing URL: https://korean-mbti-platform.netlify.app');
  console.log('📅 Test Date:', new Date().toLocaleString());
  console.log('');
  
  let browser = null;
  const results = [];
  
  try {
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 200
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, 'production-qa-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }
    
    // Track errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // ========== TEST 1: Homepage Loading & Content ==========
    console.log('📋 TEST 1: Homepage Loading & Content');
    console.log('-'.repeat(50));
    
    const startTime = Date.now();
    const response = await page.goto('https://korean-mbti-platform.netlify.app', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️  Load Time: ${loadTime}ms`);
    console.log(`🌐 Status: ${response.status()}`);
    
    await page.waitForTimeout(2000);
    
    const bodyText = await page.evaluate(() => document.body.textContent || '').catch(() => '');
    const hasContent = bodyText.length > 1000;
    const hasTranslationKeys = bodyText.includes('.title') || bodyText.includes('.description') || bodyText.includes('hero.');
    
    // Visual elements
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const headings = await page.locator('h1, h2, h3').count();
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-homepage-production.png'), 
      fullPage: true 
    });
    
    const test1Success = response.status() === 200 && hasContent && !hasTranslationKeys && buttons > 0;
    
    console.log(`   Status: ${test1Success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Content: ${hasContent ? 'Loaded' : 'Missing'} (${bodyText.length} chars)`);
    console.log(`   Translation Keys: ${hasTranslationKeys ? '❌ Visible' : '✅ Hidden'}`);
    console.log(`   Interactive Elements: ${buttons + links}`);
    
    results.push({ name: 'Homepage Loading & Content', passed: test1Success });
    
    // ========== TEST 2: Navigation to Tests Page ==========
    console.log('\\n📋 TEST 2: Navigation to Tests Page');
    console.log('-'.repeat(50));
    
    let navigationWorked = false;
    
    try {
      await page.goto('https://korean-mbti-platform.netlify.app/en/tests', { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      await page.waitForTimeout(2000);
      
      const testsUrl = page.url();
      const testsContent = await page.evaluate(() => document.body.textContent || '').catch(() => '');
      const testCards = await page.locator('div[class*="bg-white/20"], a[href*="/tests/"]').count();
      
      navigationWorked = testsUrl.includes('/tests') && testsContent.length > 500 && testCards >= 3;
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, '02-tests-page-production.png'), 
        fullPage: true 
      });
      
      console.log(`   Tests Page Access: ${navigationWorked ? '✅ Working' : '❌ Failed'}`);
      console.log(`   URL: ${testsUrl}`);
      console.log(`   Content Length: ${testsContent.length} characters`);
      console.log(`   Test Cards Found: ${testCards}`);
      
    } catch (e) {
      console.log(`   Navigation Error: ${e.message}`);
    }
    
    results.push({ name: 'Navigation to Tests Page', passed: navigationWorked });
    
    // ========== TEST 3: MBTI Test Access ==========
    console.log('\\n📋 TEST 3: MBTI Test Access & Functionality');
    console.log('-'.repeat(50));
    
    let mbtiWorking = false;
    
    try {
      await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic', { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      await page.waitForTimeout(2000);
      
      const mbtiUrl = page.url();
      const mbtiContent = await page.evaluate(() => document.body.textContent || '').catch(() => '');
      const answerButtons = await page.locator('button').count();
      
      mbtiWorking = mbtiUrl.includes('mbti') && mbtiContent.length > 100 && answerButtons >= 2;
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, '03-mbti-test-production.png'), 
        fullPage: true 
      });
      
      console.log(`   MBTI URL Access: ${mbtiWorking ? '✅ Working' : '❌ Failed'}`);
      console.log(`   Content Length: ${mbtiContent.length} characters`);
      console.log(`   Answer Buttons: ${answerButtons}`);
      
    } catch (e) {
      console.log(`   MBTI Test Error: ${e.message}`);
    }
    
    results.push({ name: 'MBTI Test Access & Functionality', passed: mbtiWorking });
    
    // ========== TEST 4: Other Personality Tests ==========
    console.log('\\n📋 TEST 4: Other Personality Tests (Big Five, 360 Feedback, Couple)');
    console.log('-'.repeat(50));
    
    const testUrls = [
      'https://korean-mbti-platform.netlify.app/en/tests/big-five',
      'https://korean-mbti-platform.netlify.app/en/tests/feedback-360',
      'https://korean-mbti-platform.netlify.app/en/tests/couple-compatibility'
    ];
    
    let otherTestsWorking = 0;
    
    for (let i = 0; i < testUrls.length; i++) {
      try {
        await page.goto(testUrls[i], { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(1000);
        
        const content = await page.evaluate(() => document.body.textContent || '').catch(() => '');
        const buttons = await page.locator('button').count();
        
        if (content.length > 100 && buttons >= 2) {
          otherTestsWorking++;
          console.log(`   Test ${i + 1}: ✅ Working`);
        } else {
          console.log(`   Test ${i + 1}: ❌ Issues detected`);
        }
        
      } catch (e) {
        console.log(`   Test ${i + 1}: ❌ Failed - ${e.message}`);
      }
    }
    
    const test4Success = otherTestsWorking >= 2;
    console.log(`   Overall: ${otherTestsWorking}/3 tests working`);
    
    results.push({ name: 'Other Personality Tests', passed: test4Success });
    
    // ========== TEST 5: Korean Language Support ==========
    console.log('\\n📋 TEST 5: Korean Language Support');
    console.log('-'.repeat(50));
    
    let koreanWorking = false;
    
    try {
      await page.goto('https://korean-mbti-platform.netlify.app/ko/tests', { 
        waitUntil: 'domcontentloaded',
        timeout: 15000 
      });
      await page.waitForTimeout(2000);
      
      const koreanContent = await page.evaluate(() => document.body.textContent || '').catch(() => '');
      const hasKoreanText = /[가-힣]/.test(koreanContent);
      const hasContent = koreanContent.length > 500;
      
      koreanWorking = hasKoreanText && hasContent;
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, '04-korean-language-production.png'), 
        fullPage: true 
      });
      
      console.log(`   Korean Text Detected: ${hasKoreanText ? '✅ Yes' : '❌ No'}`);
      console.log(`   Content Length: ${koreanContent.length} characters`);
      
    } catch (e) {
      console.log(`   Korean Language Error: ${e.message}`);
    }
    
    results.push({ name: 'Korean Language Support', passed: koreanWorking });
    
    // ========== TEST 6: Performance & Error Analysis ==========
    console.log('\\n📋 TEST 6: Performance & Error Analysis');
    console.log('-'.repeat(50));
    
    const performanceSuccess = consoleErrors.length === 0 && loadTime < 5000;
    
    console.log(`   Console Errors: ${consoleErrors.length}`);
    console.log(`   Load Time: ${loadTime}ms (target: <5000ms)`);
    console.log(`   Performance: ${performanceSuccess ? '✅ Good' : '⚠️  Needs attention'}`);
    
    if (consoleErrors.length > 0) {
      console.log('   Errors found:');
      consoleErrors.slice(0, 3).forEach((error, index) => {
        console.log(`     ${index + 1}. ${error}`);
      });
    }
    
    results.push({ name: 'Performance & Error Analysis', passed: performanceSuccess });
    
    // ========== FINAL SUMMARY ==========
    console.log('\\n' + '='.repeat(70));
    console.log('📊 PRODUCTION QA TESTING SUMMARY');
    console.log('='.repeat(70));
    
    const passedTests = results.filter(test => test.passed).length;
    const totalTests = results.length;
    const overallScore = Math.round((passedTests / totalTests) * 100);
    
    results.forEach((test, index) => {
      console.log(`${test.passed ? '✅' : '❌'} ${index + 1}. ${test.name}`);
    });
    
    console.log(`\\n🎯 OVERALL SCORE: ${overallScore}% (${passedTests}/${totalTests} tests passed)`);
    
    if (overallScore >= 85) {
      console.log('🎉 EXCELLENT! Platform is production-ready!');
    } else if (overallScore >= 70) {
      console.log('✅ GOOD! Core functionality working with minor improvements needed');
    } else if (overallScore >= 50) {
      console.log('⚠️  PARTIAL FUNCTIONALITY - Some issues need attention');
    } else {
      console.log('🚨 MAJOR ISSUES - Significant problems detected');
    }
    
    console.log(`\\n📸 Screenshots saved to: ${screenshotsDir}`);
    console.log('🏁 Production QA Testing Complete');
    
    // Save results
    const reportFile = path.join(__dirname, 'production-qa-results.json');
    fs.writeFileSync(reportFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      site_url: 'https://korean-mbti-platform.netlify.app',
      overallScore: overallScore,
      passedTests: passedTests,
      totalTests: totalTests,
      results: results,
      consoleErrors: consoleErrors,
      loadTime: loadTime
    }, null, 2));
    
    console.log(`📄 Detailed results saved to: ${reportFile}`);
    
  } catch (error) {
    console.error('💥 Production QA Testing failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runProductionQA().catch(console.error);
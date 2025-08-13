const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testResponsiveDesign() {
  console.log('📱 RESPONSIVE DESIGN TESTING - Korean MBTI Platform');
  console.log('='.repeat(60));
  
  const devices = [
    { name: 'iPhone 13', width: 390, height: 844 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    { name: 'iPad Air', width: 820, height: 1180 },
    { name: 'Desktop', width: 1280, height: 720 }
  ];
  
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const results = [];
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'responsive-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  try {
    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      console.log(`\\n📱 Testing ${device.name} (${device.width}x${device.height})`);
      console.log('-'.repeat(40));
      
      const context = await browser.newContext({
        viewport: { width: device.width, height: device.height }
      });
      
      const page = await context.newPage();
      
      const testResults = {
        device: device.name,
        viewport: `${device.width}x${device.height}`,
        tests: {}
      };
      
      // Test 1: Homepage Responsive Layout
      console.log('🏠 Testing Homepage Layout...');
      await page.goto('https://korean-mbti-platform.netlify.app');
      await page.waitForTimeout(2000);
      
      // Check key elements visibility and layout
      const heroVisible = await page.locator('h1').first().isVisible();
      const ctaButtonVisible = await page.locator('button, a[class*="bg-"]').first().isVisible();
      const statsVisible = await page.locator('[class*="stats"], [class*="grid"]').first().isVisible();
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, `homepage-${device.name.toLowerCase().replace(' ', '-')}.png`),
        fullPage: true 
      });
      
      testResults.tests.homepage = {
        heroVisible,
        ctaButtonVisible,
        statsVisible,
        passed: heroVisible && ctaButtonVisible
      };
      
      console.log(`   Hero Section: ${heroVisible ? '✅' : '❌'}`);
      console.log(`   CTA Button: ${ctaButtonVisible ? '✅' : '❌'}`);
      console.log(`   Stats Section: ${statsVisible ? '✅' : '❌'}`);
      
      // Test 2: Tests Page Grid Layout
      console.log('🧪 Testing Tests Page Grid...');
      await page.goto('https://korean-mbti-platform.netlify.app/en/tests');
      await page.waitForTimeout(2000);
      
      const testCards = await page.locator('div[class*="bg-white/20"]').count();
      const categoriesVisible = await page.locator('h2').count();
      const navigationVisible = await page.locator('nav').isVisible();
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, `tests-page-${device.name.toLowerCase().replace(' ', '-')}.png`),
        fullPage: true 
      });
      
      testResults.tests.testsPage = {
        testCards,
        categoriesVisible,
        navigationVisible,
        passed: testCards >= 5 && categoriesVisible >= 3 && navigationVisible
      };
      
      console.log(`   Test Cards: ${testCards}/5 ${testCards >= 5 ? '✅' : '❌'}`);
      console.log(`   Categories: ${categoriesVisible}/3 ${categoriesVisible >= 3 ? '✅' : '❌'}`);
      console.log(`   Navigation: ${navigationVisible ? '✅' : '❌'}`);
      
      // Test 3: MBTI Test Interface
      console.log('🧠 Testing MBTI Test Interface...');
      await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
      await page.waitForTimeout(2000);
      
      const questionVisible = await page.locator('h2, h3, [class*="question"]').first().isVisible();
      const answersVisible = await page.locator('button').count();
      const progressVisible = await page.locator('[class*="progress"], [class*="Question"]').isVisible();
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, `mbti-test-${device.name.toLowerCase().replace(' ', '-')}.png`),
        fullPage: true 
      });
      
      testResults.tests.mbtiTest = {
        questionVisible,
        answersVisible,
        progressVisible,
        passed: questionVisible && answersVisible >= 2
      };
      
      console.log(`   Question Display: ${questionVisible ? '✅' : '❌'}`);
      console.log(`   Answer Options: ${answersVisible} ${answersVisible >= 2 ? '✅' : '❌'}`);
      console.log(`   Progress Indicator: ${progressVisible ? '✅' : '❌'}`);
      
      // Calculate device score
      const deviceTests = Object.values(testResults.tests);
      const passedTests = deviceTests.filter(test => test.passed).length;
      const deviceScore = Math.round((passedTests / deviceTests.length) * 100);
      
      testResults.score = deviceScore;
      console.log(`\\n📊 ${device.name} Score: ${deviceScore}% (${passedTests}/${deviceTests.length} tests passed)`);
      
      results.push(testResults);
      
      await context.close();
    }
    
    // Overall Summary
    console.log('\\n' + '='.repeat(60));
    console.log('📊 RESPONSIVE DESIGN SUMMARY');
    console.log('='.repeat(60));
    
    results.forEach(result => {
      console.log(`${result.score >= 80 ? '✅' : result.score >= 60 ? '⚠️' : '❌'} ${result.device} (${result.viewport}): ${result.score}%`);
    });
    
    const averageScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
    console.log(`\\n🎯 Overall Responsive Score: ${averageScore}%`);
    
    if (averageScore >= 85) {
      console.log('🎉 EXCELLENT responsive design across all devices!');
    } else if (averageScore >= 70) {
      console.log('✅ GOOD responsive design with minor improvements needed');
    } else {
      console.log('⚠️  Responsive design needs attention on some devices');
    }
    
    console.log(`\\n📸 Screenshots saved to: ${screenshotsDir}`);
    
    // Save detailed results
    fs.writeFileSync(path.join(__dirname, 'responsive-test-results.json'), JSON.stringify({
      timestamp: new Date().toISOString(),
      averageScore,
      results
    }, null, 2));
    
    console.log('📄 Detailed results saved to responsive-test-results.json');
    
  } catch (error) {
    console.error('💥 Responsive testing failed:', error.message);
  } finally {
    await browser.close();
  }
}

testResponsiveDesign().catch(console.error);
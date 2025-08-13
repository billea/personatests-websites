const { chromium } = require('playwright');

async function checkDeployedSource() {
  console.log('🔍 CHECKING DEPLOYED SOURCE CODE');
  console.log('Analyzing what version is actually deployed');
  console.log('='.repeat(45));
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('\n1️⃣ Loading test page...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
    await page.waitForTimeout(3000);
    
    console.log('\n2️⃣ Checking page source for our new code...');
    
    const pageSource = await page.content();
    
    // Look for specific strings from our implementation
    const searchTerms = [
      'Save & Exit',
      '💾',
      'saveTestProgress',
      'resumeFromProgress',
      'hasInProgressTest',
      'showResumePrompt',
      'Previous',
      'automatically saved',
      'animate-pulse'
    ];
    
    console.log('   Searching for implementation markers:');
    
    searchTerms.forEach(term => {
      const found = pageSource.includes(term);
      console.log(`      "${term}": ${found ? '✅ FOUND' : '❌ NOT FOUND'}`);
    });
    
    console.log('\n3️⃣ Checking React component structure...');
    
    // Look for React component patterns
    const hasReactComponents = pageSource.includes('__NEXT_DATA__');
    const hasOurComponent = pageSource.includes('TestPage') || pageSource.includes('test-page');
    
    console.log(`   React app structure: ${hasReactComponents ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Test page component: ${hasOurComponent ? '✅ Present' : '❌ Missing'}`);
    
    console.log('\n4️⃣ Analyzing JavaScript bundles...');
    
    // Get all script tags
    const scripts = await page.evaluate(() => {
      const scriptTags = Array.from(document.querySelectorAll('script[src]'));
      return scriptTags.map(script => script.src);
    });
    
    console.log(`   Found ${scripts.length} script files`);
    scripts.slice(0, 3).forEach((src, index) => {
      console.log(`      ${index + 1}. ${src.split('/').pop()}`);
    });
    
    console.log('\n5️⃣ Checking Network tab for build info...');
    
    // Check network requests for any build-related info
    const requests = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method()
      });
    });
    
    // Navigate to trigger requests
    await page.reload();
    await page.waitForTimeout(2000);
    
    const jsRequests = requests.filter(req => req.url.includes('.js') && !req.url.includes('chrome-extension'));
    console.log(`   JavaScript requests: ${jsRequests.length}`);
    
    console.log('\n6️⃣ Manual source inspection...');
    
    // Look for specific HTML patterns that should exist
    const hasTestControls = await page.locator('div').count();
    const questionCount = await page.locator('h2').count();
    const buttonCount = await page.locator('button').count();
    
    console.log(`   Total div elements: ${hasTestControls}`);
    console.log(`   Question headings: ${questionCount}`);
    console.log(`   Total buttons: ${buttonCount}`);
    
    // Try to find the exact section where our controls should be
    const testControlSection = await page.locator('div.mt-8.flex.flex-col.sm\\:flex-row.justify-between').count();
    console.log(`   Test controls section: ${testControlSection > 0 ? '✅ Found' : '❌ Not found'}`);
    
    console.log('\n7️⃣ Source code excerpt analysis...');
    
    // Get the main content area HTML
    const mainContent = await page.locator('main, div[class*="min-h-screen"]').first().innerHTML();
    
    // Look for key patterns
    const hasProgressSaving = mainContent.includes('progress') || mainContent.includes('save');
    const hasControls = mainContent.includes('Controls') || mainContent.includes('Previous');
    
    console.log(`   Progress/save references: ${hasProgressSaving ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Control references: ${hasControls ? '✅ Found' : '❌ Not found'}`);
    
    // Show a sample of the main content
    const contentSample = mainContent.substring(0, 500);
    console.log(`\n   Content sample (first 500 chars):`);
    console.log(`      "${contentSample.replace(/\s+/g, ' ')}..."`);
    
    console.log('\n' + '='.repeat(45));
    console.log('📊 DEPLOYMENT ANALYSIS');
    console.log('='.repeat(45));
    
    const foundMarkers = searchTerms.filter(term => pageSource.includes(term)).length;
    const totalMarkers = searchTerms.length;
    
    if (foundMarkers === 0) {
      console.log('❌ CONCLUSION: Old version still deployed');
      console.log('\n🔧 NEXT STEPS:');
      console.log('   1. Check Netlify dashboard for build failures');
      console.log('   2. Look for build logs with errors');
      console.log('   3. Manually trigger a new build');
      console.log('   4. Check if build command is correct');
      console.log('   5. Verify all files are in the repository');
    } else if (foundMarkers < totalMarkers) {
      console.log(`⚠️ CONCLUSION: Partial deployment (${foundMarkers}/${totalMarkers} markers found)`);
      console.log('\n🔧 NEXT STEPS:');
      console.log('   1. Build may have partially failed');
      console.log('   2. Check for TypeScript compilation errors');
      console.log('   3. Verify all imports are correct');
    } else {
      console.log('✅ CONCLUSION: New version should be deployed');
      console.log('\n🔧 ISSUE: Component rendering problem');
      console.log('   1. Check component conditional logic');
      console.log('   2. Verify state management');
      console.log('   3. Test in different browsers');
    }
    
  } catch (error) {
    console.error('💥 Source check failed:', error.message);
  } finally {
    console.log(`\n⏰ Check completed: ${new Date().toLocaleString()}`);
    await browser.close();
  }
}

checkDeployedSource().catch(console.error);
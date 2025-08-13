const { chromium } = require('playwright');

async function debugDeployment() {
  console.log('🔧 DEBUGGING DEPLOYMENT ISSUE');
  console.log('Checking why Save & Exit button is not visible');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('\n1️⃣ Loading test page and checking deployment...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Get page info
    const pageTitle = await page.title();
    const currentUrl = page.url();
    console.log(`   Page title: "${pageTitle}"`);
    console.log(`   Current URL: ${currentUrl}`);
    
    // Check for test interface
    const hasQuestions = await page.locator('h2').count() > 0;
    const hasAnswers = await page.locator('button[class*="bg-white/20"]').count() >= 2;
    console.log(`   Has questions: ${hasQuestions}`);
    console.log(`   Has answer buttons: ${hasAnswers}`);
    
    if (!hasQuestions || !hasAnswers) {
      console.log('❌ Basic test interface not loaded properly');
      return;
    }
    
    console.log('\n2️⃣ Answering first question to trigger controls...');
    
    // Answer first question
    const firstOption = await page.locator('button[class*="bg-white/20"]').first();
    await firstOption.click();
    await page.waitForTimeout(2000);
    
    console.log('\n3️⃣ Analyzing page content for new features...');
    
    // Get all page HTML to analyze
    const pageHTML = await page.content();
    
    // Check if our new code exists in the HTML
    const hasSaveExitText = pageHTML.includes('Save & Exit') || pageHTML.includes('💾');
    const hasPreviousButton = pageHTML.includes('Previous') || pageHTML.includes('←');
    const hasAutoSaveText = pageHTML.includes('automatically saved') || pageHTML.includes('being saved');
    const hasPulseAnimation = pageHTML.includes('animate-pulse');
    
    console.log(`   Save & Exit in HTML: ${hasSaveExitText ? 'YES' : 'NO'}`);
    console.log(`   Previous button in HTML: ${hasPreviousButton ? 'YES' : 'NO'}`);
    console.log(`   Auto-save text in HTML: ${hasAutoSaveText ? 'YES' : 'NO'}`);
    console.log(`   Pulse animation in HTML: ${hasPulseAnimation ? 'YES' : 'NO'}`);
    
    // Check all buttons on page
    const allButtons = await page.locator('button').all();
    const buttonTexts = [];
    
    for (const button of allButtons) {
      try {
        const text = await button.textContent();
        if (text && text.trim()) {
          buttonTexts.push(text.trim());
        }
      } catch (error) {
        // Skip buttons that can't be read
      }
    }
    
    console.log('\n4️⃣ All buttons found on page:');
    buttonTexts.forEach((text, index) => {
      console.log(`   ${index + 1}. "${text}"`);
    });
    
    // Look for specific patterns
    const saveButton = buttonTexts.find(text => 
      text.includes('Save') || text.includes('Exit') || text.includes('💾')
    );
    const prevButton = buttonTexts.find(text => 
      text.includes('Previous') || text.includes('←')
    );
    
    console.log(`\n   Save/Exit button found: ${saveButton ? `"${saveButton}"` : 'NO'}`);
    console.log(`   Previous button found: ${prevButton ? `"${prevButton}"` : 'NO'}`);
    
    console.log('\n5️⃣ Checking JavaScript console for errors...');
    
    // Collect console messages
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text()
      });
    });
    
    // Wait for any async operations
    await page.waitForTimeout(2000);
    
    const errors = consoleLogs.filter(log => log.type === 'error');
    if (errors.length > 0) {
      console.log('   JavaScript errors found:');
      errors.forEach(error => {
        console.log(`      ❌ ${error.text}`);
      });
    } else {
      console.log('   No JavaScript errors found ✅');
    }
    
    console.log('\n6️⃣ Checking build timestamp...');
    
    // Look for any build info in the page
    const lastModified = await page.evaluate(() => {
      return document.lastModified;
    });
    console.log(`   Page last modified: ${lastModified}`);
    
    // Check meta tags for build info
    const metaTags = await page.evaluate(() => {
      const metas = Array.from(document.querySelectorAll('meta'));
      return metas.map(meta => ({
        name: meta.name || meta.property,
        content: meta.content
      })).filter(meta => meta.name);
    });
    
    console.log('\n   Meta tags:');
    metaTags.slice(0, 5).forEach(meta => {
      console.log(`      ${meta.name}: ${meta.content}`);
    });
    
    console.log('\n7️⃣ Testing hard refresh...');
    
    // Force hard refresh
    await page.keyboard.press('F5');
    await page.waitForTimeout(3000);
    
    // Check again after refresh
    const refreshedButtons = await page.locator('button').all();
    const refreshedTexts = [];
    
    for (const button of refreshedButtons) {
      try {
        const text = await button.textContent();
        if (text && text.trim()) {
          refreshedTexts.push(text.trim());
        }
      } catch (error) {
        // Skip buttons that can't be read
      }
    }
    
    const refreshedSave = refreshedTexts.find(text => 
      text.includes('Save') || text.includes('Exit') || text.includes('💾')
    );
    
    console.log(`   After refresh - Save button: ${refreshedSave ? `"${refreshedSave}"` : 'NOT FOUND'}`);
    
    // Final assessment
    console.log('\n' + '='.repeat(50));
    console.log('🔍 DEPLOYMENT DIAGNOSIS');
    console.log('='.repeat(50));
    
    if (!hasSaveExitText && !hasPreviousButton) {
      console.log('❌ ISSUE: New features NOT deployed');
      console.log('\n💡 LIKELY CAUSES:');
      console.log('   1. Netlify build failed or still in progress');
      console.log('   2. Build cache issues preventing updates');
      console.log('   3. CDN propagation delay');
      console.log('   4. Source code not properly committed');
      
      console.log('\n🔧 RECOMMENDED ACTIONS:');
      console.log('   1. Check Netlify dashboard for build status');
      console.log('   2. Trigger manual build if needed');
      console.log('   3. Clear browser cache completely');
      console.log('   4. Wait 5-10 minutes for CDN propagation');
    } else {
      console.log('⚠️ PARTIAL DEPLOYMENT: Some features found in HTML but not rendering');
      console.log('\n🔧 RECOMMENDED ACTIONS:');
      console.log('   1. Check CSS/JavaScript for rendering issues');
      console.log('   2. Verify component conditional logic');
      console.log('   3. Test with different browsers');
    }
    
  } catch (error) {
    console.error('💥 Debug failed:', error.message);
  } finally {
    console.log(`\n⏰ Debug completed: ${new Date().toLocaleString()}`);
    await browser.close();
  }
}

debugDeployment().catch(console.error);
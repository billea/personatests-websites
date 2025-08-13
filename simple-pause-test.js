const { chromium } = require('playwright');

async function simplePauseTest() {
  console.log('🔍 SIMPLE PAUSE/RESUME VERIFICATION');
  console.log('Checking if new features are deployed');
  console.log('='.repeat(45));
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('\n📍 Loading MBTI test page...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
    await page.waitForTimeout(3000);
    
    console.log('🔍 Checking page content...');
    
    // Check if we're on the test page
    const pageTitle = await page.title();
    const currentUrl = page.url();
    console.log(`   Page title: "${pageTitle}"`);
    console.log(`   Current URL: ${currentUrl}`);
    
    // Look for test elements
    const hasQuestions = await page.locator('h2').count() > 0;
    const hasOptions = await page.locator('button[class*="bg-white/20"]').count() >= 2;
    console.log(`   Has questions: ${hasQuestions}`);
    console.log(`   Has answer options: ${hasOptions}`);
    
    if (hasQuestions && hasOptions) {
      console.log('\n✅ Basic test interface loaded');
      
      // Answer one question to get to the next
      console.log('📝 Answering first question...');
      const firstOption = await page.locator('button[class*="bg-white/20"]').first();
      await firstOption.click();
      await page.waitForTimeout(2000);
      
      console.log('🔍 Looking for new pause/resume features...');
      
      // Check for save button
      const saveButtons = await page.locator('button').all();
      const saveButtonTexts = await Promise.all(saveButtons.map(btn => btn.textContent()));
      
      console.log('   Found buttons with text:');
      saveButtonTexts.forEach((text, i) => {
        if (text && text.trim()) {
          console.log(`      ${i + 1}. "${text.trim()}"`);
        }
      });
      
      // Look for specific save/exit button
      const saveExitButton = saveButtonTexts.some(text => 
        text && (text.includes('Save') || text.includes('Exit') || text.includes('💾'))
      );
      
      console.log(`   Save & Exit button found: ${saveExitButton ? 'YES' : 'NO'}`);
      
      // Check for previous button
      const prevButton = saveButtonTexts.some(text => 
        text && (text.includes('Previous') || text.includes('←'))
      );
      
      console.log(`   Previous button found: ${prevButton ? 'YES' : 'NO'}`);
      
      // Check for auto-save indicators
      const autoSaveText = await page.textContent('body');
      const hasAutoSaveIndicator = autoSaveText.includes('automatically saved') || 
                                  autoSaveText.includes('being saved');
      
      console.log(`   Auto-save indicator found: ${hasAutoSaveIndicator ? 'YES' : 'NO'}`);
      
      // Check for pulse animation
      const pulseAnimation = await page.locator('[class*="animate-pulse"]').count() > 0;
      console.log(`   Pulse animation found: ${pulseAnimation ? 'YES' : 'NO'}`);
      
      // Summary
      console.log('\n📊 DEPLOYMENT STATUS:');
      if (saveExitButton && prevButton && hasAutoSaveIndicator) {
        console.log('🎉 SUCCESS: All new features deployed!');
      } else if (saveExitButton || prevButton) {
        console.log('⚠️ PARTIAL: Some features deployed');
      } else {
        console.log('❌ NOT DEPLOYED: Features not found');
        console.log('   This might be a deployment delay or caching issue');
      }
      
    } else {
      console.log('❌ Test interface not properly loaded');
    }
    
    // Check browser cache
    console.log('\n🧹 Checking for cache issues...');
    await page.evaluate(() => {
      // Force refresh without cache
      location.reload(true);
    });
    
    await page.waitForTimeout(3000);
    
    console.log('📄 Page refreshed, checking again...');
    
    const refreshedButtons = await page.locator('button').all();
    const refreshedTexts = await Promise.all(refreshedButtons.map(btn => btn.textContent()));
    
    const refreshedSaveButton = refreshedTexts.some(text => 
      text && (text.includes('Save') || text.includes('Exit') || text.includes('💾'))
    );
    
    console.log(`   After refresh - Save button: ${refreshedSaveButton ? 'FOUND' : 'NOT FOUND'}`);
    
    if (!refreshedSaveButton) {
      console.log('\n💡 TROUBLESHOOTING SUGGESTIONS:');
      console.log('1. Netlify deployment may still be processing');
      console.log('2. Browser cache might need clearing');
      console.log('3. CDN propagation might take a few minutes');
      console.log('4. Try hard refresh (Ctrl+F5) in browser');
      
      console.log('\n⏰ Recommendation: Wait 2-3 minutes and test again');
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  } finally {
    console.log(`\n⏰ Test completed: ${new Date().toLocaleString()}`);
    await browser.close();
  }
}

simplePauseTest().catch(console.error);
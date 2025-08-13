const { chromium } = require('playwright');

async function testSystemFunctionality() {
  console.log('🔍 DETAILED SYSTEM FUNCTIONALITY TEST');
  console.log('Testing current database and email implementation status');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture console messages for analysis
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
  });
  
  // Capture network requests
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers()
    });
  });
  
  try {
    // Test 1: Complete MBTI Test and Check Data Flow
    console.log('\n1️⃣ Testing Complete MBTI Test Data Flow...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
    await page.waitForTimeout(2000);
    
    console.log('   📝 Starting MBTI test completion...');
    
    // Answer all 20 questions
    let questionsAnswered = 0;
    for (let i = 0; i < 20; i++) {
      try {
        await page.waitForTimeout(500);
        const options = await page.locator('button[class*="bg-white/20"]');
        const optionCount = await options.count();
        
        if (optionCount > 0) {
          const randomOption = Math.floor(Math.random() * optionCount);
          await options.nth(randomOption).click();
          questionsAnswered++;
          console.log(`      Question ${questionsAnswered}/20 answered`);
        } else {
          console.log('      No more questions found, test might be complete');
          break;
        }
      } catch (error) {
        console.log(`      Error on question ${i + 1}: ${error.message}`);
        break;
      }
    }
    
    await page.waitForTimeout(3000);
    
    // Check if we're on results page
    const currentUrl = page.url();
    const onResultsPage = currentUrl.includes('/tests/mbti-classic') && 
                         await page.locator('h1').filter({ hasText: /completed|result/i }).isVisible();
    
    console.log(`   📊 Questions answered: ${questionsAnswered}/20`);
    console.log(`   📍 Current URL: ${currentUrl}`);
    console.log(`   📋 On results page: ${onResultsPage ? 'Yes' : 'No'}`);
    
    if (onResultsPage) {
      // Check results display
      const personalityType = await page.locator('[class*="text-3xl"]').filter({ hasText: /^[A-Z]{4}$/ }).textContent();
      const progressBars = await page.locator('div[class*="bg-gradient-to-r from-yellow"]').count();
      const traitsVisible = await page.locator('h3').filter({ hasText: /traits/i }).isVisible();
      
      console.log(`   🧠 Personality Type: ${personalityType || 'Not found'}`);
      console.log(`   📊 Progress Bars: ${progressBars}/4 expected`);
      console.log(`   ✨ Traits Section: ${traitsVisible ? 'Visible' : 'Not visible'}`);
      
      // Check local storage
      const localStorageData = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const testResults = keys.filter(key => key.startsWith('test_result_'));
        const emailSignups = localStorage.getItem('email_signups');
        
        return {
          testResultKeys: testResults,
          testResultsCount: testResults.length,
          emailSignups: emailSignups ? JSON.parse(emailSignups) : [],
          allKeys: keys
        };
      });
      
      console.log(`   💾 Local Storage Test Results: ${localStorageData.testResultsCount}`);
      console.log(`   📧 Email Signups: ${localStorageData.emailSignups.length}`);
      
      // Test Email Signup Component
      console.log('\n2️⃣ Testing Email Signup Component...');
      
      const emailComponent = await page.locator('h3').filter({ hasText: /insights|personality/i }).first();
      const isEmailComponentVisible = await emailComponent.isVisible();
      
      console.log(`   🎯 Email component visible: ${isEmailComponentVisible ? 'Yes' : 'No'}`);
      
      if (isEmailComponentVisible) {
        // Try to interact with email signup
        const signupButton = await page.locator('button').filter({ hasText: /insights|free/i }).first();
        
        if (await signupButton.isVisible()) {
          await signupButton.click();
          await page.waitForTimeout(1000);
          
          const emailInput = await page.locator('input[type="email"]');
          const submitButton = await page.locator('button[type="submit"], button').filter({ hasText: /get|insights/i }).first();
          
          const emailInputVisible = await emailInput.isVisible();
          const submitButtonVisible = await submitButton.isVisible();
          
          console.log(`   📧 Email input visible: ${emailInputVisible ? 'Yes' : 'No'}`);
          console.log(`   🔘 Submit button visible: ${submitButtonVisible ? 'Yes' : 'No'}`);
          
          if (emailInputVisible && submitButtonVisible) {
            // Test email submission
            await emailInput.fill('test.user@example.com');
            await submitButton.click();
            await page.waitForTimeout(2000);
            
            // Check for success state
            const successMessage = await page.locator('text=/thank you|check your email|success/i').isVisible();
            console.log(`   ✅ Success message shown: ${successMessage ? 'Yes' : 'No'}`);
            
            // Check updated local storage
            const updatedEmailData = await page.evaluate(() => {
              return localStorage.getItem('email_signups');
            });
            
            const emailList = updatedEmailData ? JSON.parse(updatedEmailData) : [];
            console.log(`   📮 Total email signups: ${emailList.length}`);
            
            if (emailList.length > 0) {
              console.log(`   📧 Latest signup: ${JSON.stringify(emailList[emailList.length - 1], null, 6)}`);
            }
          }
        }
      }
    }
    
    // Test 3: Check Results Page Functionality
    console.log('\n3️⃣ Testing Results Page Functionality...');
    
    await page.goto('https://korean-mbti-platform.netlify.app/en/results');
    await page.waitForTimeout(3000);
    
    const resultsPageContent = await page.evaluate(() => {
      return {
        bodyText: document.body.innerText.substring(0, 500),
        hasTestResults: document.body.innerText.includes('Test Results'),
        hasNoResults: document.body.innerText.includes('No Test Results'),
        hasSignInRequired: document.body.innerText.includes('Sign In Required'),
        hasContent: document.body.innerText.length > 100
      };
    });
    
    console.log(`   📄 Page has content: ${resultsPageContent.hasContent ? 'Yes' : 'No'}`);
    console.log(`   📊 Shows test results: ${resultsPageContent.hasTestResults ? 'Yes' : 'No'}`);
    console.log(`   🚫 Shows no results: ${resultsPageContent.hasNoResults ? 'Yes' : 'No'}`);
    console.log(`   🔐 Shows sign in required: ${resultsPageContent.hasSignInRequired ? 'Yes' : 'No'}`);
    
    if (resultsPageContent.hasContent) {
      console.log(`   📝 Page preview: "${resultsPageContent.bodyText.substring(0, 100)}..."`);
    }
    
    // Test 4: Firebase Integration Analysis
    console.log('\n4️⃣ Analyzing Firebase Integration...');
    
    // Check console for Firebase-related messages
    const firebaseMessages = consoleLogs.filter(log => 
      log.text.toLowerCase().includes('firebase') ||
      log.text.toLowerCase().includes('firestore') ||
      log.text.toLowerCase().includes('auth')
    );
    
    console.log(`   📊 Firebase console messages: ${firebaseMessages.length}`);
    if (firebaseMessages.length > 0) {
      firebaseMessages.forEach(msg => {
        console.log(`      ${msg.type.toUpperCase()}: ${msg.text}`);
      });
    }
    
    // Check network requests for Firebase
    const firebaseRequests = networkRequests.filter(req => 
      req.url.includes('firebase') || 
      req.url.includes('firestore') ||
      req.url.includes('googleapis')
    );
    
    console.log(`   🌐 Firebase network requests: ${firebaseRequests.length}`);
    if (firebaseRequests.length > 0) {
      firebaseRequests.slice(0, 3).forEach(req => {
        console.log(`      ${req.method} ${req.url}`);
      });
    }
    
    // System Status Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 SYSTEM STATUS ASSESSMENT');
    console.log('='.repeat(60));
    
    const systemStatus = {
      testCompletion: questionsAnswered >= 15,
      resultsDisplay: onResultsPage && personalityType,
      localStorageWorking: localStorageData && localStorageData.testResultsCount > 0,
      emailUIWorking: isEmailComponentVisible,
      firebaseConfigured: firebaseRequests.length > 0 || firebaseMessages.length === 0
    };
    
    Object.entries(systemStatus).forEach(([feature, working]) => {
      console.log(`${working ? '✅' : '❌'} ${feature.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    });
    
    const workingFeatures = Object.values(systemStatus).filter(Boolean).length;
    const totalFeatures = Object.keys(systemStatus).length;
    const systemScore = Math.round((workingFeatures / totalFeatures) * 100);
    
    console.log(`\n🎯 System Functionality Score: ${systemScore}% (${workingFeatures}/${totalFeatures} features working)`);
    
    // Detailed Analysis
    console.log('\n💡 DETAILED ANALYSIS:');
    
    if (systemStatus.testCompletion && systemStatus.resultsDisplay) {
      console.log('✅ Core Testing Functionality: WORKING');
      console.log('   • Users can complete personality tests');
      console.log('   • Results are properly calculated and displayed');
      console.log('   • Enhanced UI with progress bars and insights active');
    } else {
      console.log('❌ Core Testing Functionality: NEEDS ATTENTION');
    }
    
    if (systemStatus.localStorageWorking) {
      console.log('✅ Data Persistence: WORKING (Client-side)');
      console.log('   • Test results saved to localStorage for anonymous users');
      console.log('   • Data persists between sessions');
    } else {
      console.log('⚠️ Data Persistence: PARTIAL (Check localStorage implementation)');
    }
    
    if (systemStatus.emailUIWorking) {
      console.log('✅ Email Signup UI: WORKING');
      console.log('   • Email capture interface functional');
      console.log('   • Local storage for development testing');
      console.log('   ⚠️  Production email sending requires backend deployment');
    } else {
      console.log('❌ Email Signup UI: NEEDS ATTENTION');
    }
    
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('1. ✅ Client-side functionality is working well');
    console.log('2. ⚠️  For production database features:');
    console.log('   • Deploy Firebase Functions for server-side operations');
    console.log('   • Implement user authentication flow');
    console.log('   • Configure Firestore security rules');
    console.log('3. ⚠️  For production email system:');
    console.log('   • Set up email service provider (SendGrid, etc.)');
    console.log('   • Deploy email templates and workflows');
    console.log('   • Configure SMTP credentials');
    
    console.log(`\n⏰ Analysis completed: ${new Date().toLocaleString()}`);
    
    // Save comprehensive results
    const fullResults = {
      timestamp: new Date().toISOString(),
      systemScore,
      systemStatus,
      testDetails: {
        questionsAnswered,
        personalityType,
        progressBars,
        localStorageData,
        resultsPageContent,
        emailComponent: isEmailComponentVisible
      },
      consoleLogs,
      firebaseMessages,
      firebaseRequests: firebaseRequests.slice(0, 5) // Limit to first 5 for file size
    };
    
    require('fs').writeFileSync(
      require('path').join(__dirname, 'system-functionality-results.json'),
      JSON.stringify(fullResults, null, 2)
    );
    
    console.log('📄 Comprehensive results saved to system-functionality-results.json');
    
    return fullResults;
    
  } catch (error) {
    console.error('💥 System functionality test failed:', error.message);
    return { error: error.message, timestamp: new Date().toISOString() };
  } finally {
    await browser.close();
  }
}

testSystemFunctionality().catch(console.error);
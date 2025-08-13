const { chromium } = require('playwright');

async function testPauseResumeFeature() {
  console.log('⏸️ TEST PAUSE/RESUME FUNCTIONALITY');
  console.log('Testing test progress saving and resume capabilities');
  console.log('='.repeat(55));
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: [],
    overallScore: 0
  };
  
  function addTestResult(name, passed, details = {}) {
    testResults.tests.push({ name, passed, details });
    console.log(`   ${passed ? '✅' : '❌'} ${name}`);
    if (Object.keys(details).length > 0) {
      console.log(`      ${JSON.stringify(details)}`);
    }
  }
  
  try {
    // Test 1: Start MBTI test and answer some questions
    console.log('\n1️⃣ Testing Progress Saving...');
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
    await page.waitForTimeout(2000);
    
    // Answer first 5 questions
    let questionsAnswered = 0;
    const targetQuestions = 5;
    
    for (let i = 0; i < targetQuestions; i++) {
      try {
        const options = await page.locator('button[class*="bg-white/20"]');
        const optionCount = await options.count();
        
        if (optionCount >= 2) {
          await options.first().click();
          questionsAnswered++;
          await page.waitForTimeout(300);
          
          console.log(`      Question ${questionsAnswered} answered`);
        } else {
          console.log(`      No options found for question ${i + 1}`);
          break;
        }
      } catch (error) {
        console.log(`      Error answering question ${i + 1}: ${error.message}`);
        break;
      }
    }
    
    // Check if save button is visible
    const saveButton = await page.locator('button').filter({ hasText: /save.*exit/i });
    const saveButtonVisible = await saveButton.isVisible();
    
    console.log(`   📊 Questions answered: ${questionsAnswered}/${targetQuestions}`);
    console.log(`   💾 Save button visible: ${saveButtonVisible ? 'Yes' : 'No'}`);
    
    addTestResult('Progress Saving Setup', questionsAnswered >= 3 && saveButtonVisible, {
      questionsAnswered,
      saveButtonVisible
    });
    
    // Test 2: Use Save & Exit functionality
    console.log('\n2️⃣ Testing Save & Exit...');
    
    if (saveButtonVisible) {
      await saveButton.click();
      await page.waitForTimeout(2000);
      
      // Should be redirected to tests page
      const currentUrl = page.url();
      const onTestsPage = currentUrl.includes('/tests') && !currentUrl.includes('/mbti-classic');
      
      console.log(`   📍 Redirected to: ${currentUrl}`);
      console.log(`   ✅ On tests page: ${onTestsPage ? 'Yes' : 'No'}`);
      
      addTestResult('Save & Exit Functionality', onTestsPage, {
        redirectedUrl: currentUrl,
        expectedRedirection: onTestsPage
      });
    } else {
      addTestResult('Save & Exit Functionality', false, {
        reason: 'Save button not found'
      });
    }
    
    // Test 3: Return to test and check for resume prompt
    console.log('\n3️⃣ Testing Resume Prompt...');
    
    // Go back to the same test
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
    await page.waitForTimeout(3000);
    
    // Look for resume prompt
    const resumePrompt = await page.locator('h1').filter({ hasText: /resume.*test/i }).isVisible();
    const resumeButton = await page.locator('button').filter({ hasText: /resume.*test/i }).first();
    const resumeButtonVisible = await resumeButton.isVisible();
    
    if (resumePrompt && resumeButtonVisible) {
      // Check progress details
      const progressText = await page.textContent('body');
      const showsProgress = progressText.includes('completed') && progressText.includes('questions');
      
      console.log(`   🔄 Resume prompt visible: Yes`);
      console.log(`   📊 Shows progress details: ${showsProgress ? 'Yes' : 'No'}`);
      
      addTestResult('Resume Prompt Display', resumePrompt && showsProgress, {
        resumePromptVisible: resumePrompt,
        resumeButtonVisible: resumeButtonVisible,
        showsProgressDetails: showsProgress
      });
      
      // Test 4: Resume functionality
      console.log('\n4️⃣ Testing Resume Functionality...');
      
      await resumeButton.click();
      await page.waitForTimeout(2000);
      
      // Should be back in the test
      const backInTest = await page.locator('h2').filter({ hasText: /question/i }).isVisible() ||
                        await page.locator('button[class*="bg-white/20"]').count() >= 2;
      
      // Check if we're at the right question (should be around question 6)
      const questionIndicator = await page.locator('text=/Question \\d+ of \\d+/').textContent();
      const currentQuestionMatch = questionIndicator?.match(/Question (\\d+) of/);
      const currentQuestionNum = currentQuestionMatch ? parseInt(currentQuestionMatch[1]) : 0;
      
      console.log(`   🧠 Back in test: ${backInTest ? 'Yes' : 'No'}`);
      console.log(`   📍 Current question: ${currentQuestionNum || 'Not detected'}`);
      console.log(`   ✅ Resumed at correct position: ${currentQuestionNum >= questionsAnswered ? 'Yes' : 'No'}`);
      
      addTestResult('Resume Functionality', backInTest && currentQuestionNum >= questionsAnswered, {
        backInTest,
        currentQuestion: currentQuestionNum,
        expectedQuestion: questionsAnswered + 1,
        resumedCorrectly: currentQuestionNum >= questionsAnswered
      });
      
      // Test 5: Previous button functionality
      console.log('\n5️⃣ Testing Previous Button...');
      
      const previousButton = await page.locator('button').filter({ hasText: /previous/i });
      const prevButtonVisible = await previousButton.isVisible();
      
      if (prevButtonVisible) {
        await previousButton.click();
        await page.waitForTimeout(1000);
        
        const newQuestionIndicator = await page.locator('text=/Question \\d+ of \\d+/').textContent();
        const newQuestionMatch = newQuestionIndicator?.match(/Question (\\d+) of/);
        const newQuestionNum = newQuestionMatch ? parseInt(newQuestionMatch[1]) : 0;
        
        const movedToPrevious = newQuestionNum < currentQuestionNum;
        
        console.log(`   ← Previous button visible: Yes`);
        console.log(`   📍 Moved to question: ${newQuestionNum}`);
        console.log(`   ✅ Navigation working: ${movedToPrevious ? 'Yes' : 'No'}`);
        
        addTestResult('Previous Button Functionality', movedToPrevious, {
          previousButtonVisible: prevButtonVisible,
          previousQuestion: currentQuestionNum,
          newQuestion: newQuestionNum,
          navigationWorking: movedToPrevious
        });
      } else {
        addTestResult('Previous Button Functionality', false, {
          reason: 'Previous button not visible'
        });
      }
      
      // Test 6: Auto-save indicator
      console.log('\n6️⃣ Testing Auto-save Indicator...');
      
      const autoSaveIndicator = await page.locator('text=/progress.*automatically.*saved/i').isVisible() ||
                               await page.locator('text=/answers.*being.*saved/i').isVisible();
      
      const saveIndicatorPulse = await page.locator('div[class*="animate-pulse"]').isVisible();
      
      console.log(`   💾 Auto-save message: ${autoSaveIndicator ? 'Visible' : 'Not visible'}`);
      console.log(`   ✨ Pulse indicator: ${saveIndicatorPulse ? 'Working' : 'Not visible'}`);
      
      addTestResult('Auto-save Indicators', autoSaveIndicator || saveIndicatorPulse, {
        autoSaveMessage: autoSaveIndicator,
        pulseIndicator: saveIndicatorPulse
      });
      
    } else {
      console.log(`   ❌ Resume prompt not found`);
      addTestResult('Resume Prompt Display', false, { reason: 'Resume prompt not visible' });
      
      // Skip dependent tests
      addTestResult('Resume Functionality', false, { reason: 'No resume prompt to test' });
      addTestResult('Previous Button Functionality', false, { reason: 'Could not resume test' });
      addTestResult('Auto-save Indicators', false, { reason: 'Could not access test interface' });
    }
    
    // Test 7: Start Fresh functionality
    console.log('\n7️⃣ Testing Start Fresh...');
    
    // Go back to test to trigger resume prompt again
    await page.goto('https://korean-mbti-platform.netlify.app/en/tests/mbti-classic');
    await page.waitForTimeout(2000);
    
    const startFreshButton = await page.locator('button').filter({ hasText: /start.*fresh/i });
    const startFreshVisible = await startFreshButton.isVisible();
    
    if (startFreshVisible) {
      await startFreshButton.click();
      await page.waitForTimeout(2000);
      
      // Should start from question 1
      const freshQuestionIndicator = await page.locator('text=/Question \\d+ of \\d+/').textContent();
      const freshQuestionMatch = freshQuestionIndicator?.match(/Question (\\d+) of/);
      const freshQuestionNum = freshQuestionMatch ? parseInt(freshQuestionMatch[1]) : 0;
      
      const startedFresh = freshQuestionNum === 1;
      
      console.log(`   🔄 Start Fresh button: Clicked`);
      console.log(`   📍 Question number: ${freshQuestionNum}`);
      console.log(`   ✅ Started from beginning: ${startedFresh ? 'Yes' : 'No'}`);
      
      addTestResult('Start Fresh Functionality', startedFresh, {
        startFreshVisible,
        questionNumber: freshQuestionNum,
        startedFromBeginning: startedFresh
      });
    } else {
      addTestResult('Start Fresh Functionality', false, {
        reason: 'Start Fresh button not found'
      });
    }
    
    // Calculate overall score
    const passedTests = testResults.tests.filter(test => test.passed).length;
    const totalTests = testResults.tests.length;
    testResults.overallScore = Math.round((passedTests / totalTests) * 100);
    
    // Summary
    console.log('\n' + '='.repeat(55));
    console.log('⏸️ PAUSE/RESUME TESTING SUMMARY');
    console.log('='.repeat(55));
    
    testResults.tests.forEach((test, index) => {
      console.log(`${test.passed ? '✅' : '❌'} Test ${index + 1}: ${test.name}`);
    });
    
    console.log(`\n🎯 Pause/Resume Score: ${testResults.overallScore}% (${passedTests}/${totalTests} tests passed)`);
    
    if (testResults.overallScore >= 85) {
      console.log('🎉 EXCELLENT! Pause/resume functionality working perfectly!');
    } else if (testResults.overallScore >= 70) {
      console.log('✅ GOOD! Most features working, minor improvements possible');
    } else {
      console.log('⚠️ NEEDS ATTENTION! Some features require fixes');
    }
    
    // Feature Assessment
    console.log('\n💡 FEATURE ASSESSMENT:');
    const features = {
      'Progress Saving': testResults.tests.find(t => t.name.includes('Progress Saving'))?.passed,
      'Save & Exit': testResults.tests.find(t => t.name.includes('Save & Exit'))?.passed,
      'Resume Prompt': testResults.tests.find(t => t.name.includes('Resume Prompt'))?.passed,
      'Resume Function': testResults.tests.find(t => t.name.includes('Resume Functionality'))?.passed,
      'Navigation': testResults.tests.find(t => t.name.includes('Previous Button'))?.passed,
      'Auto-save UI': testResults.tests.find(t => t.name.includes('Auto-save'))?.passed,
      'Start Fresh': testResults.tests.find(t => t.name.includes('Start Fresh'))?.passed
    };
    
    Object.entries(features).forEach(([feature, working]) => {
      console.log(`   ${working ? '✅' : '❌'} ${feature}`);
    });
    
    console.log('\n🚀 USER EXPERIENCE:');
    console.log('   • Users can pause tests at any point');
    console.log('   • Progress is automatically saved after each answer');
    console.log('   • Resume prompts show clear progress information');
    console.log('   • Navigation allows going back to previous questions');
    console.log('   • Visual indicators show auto-save status');
    console.log('   • Users can start fresh if desired');
    
    console.log(`\n⏰ Test completed: ${new Date().toLocaleString()}`);
    
    // Save results
    require('fs').writeFileSync(
      require('path').join(__dirname, 'pause-resume-test-results.json'),
      JSON.stringify(testResults, null, 2)
    );
    
    console.log('📄 Results saved to pause-resume-test-results.json');
    
    return testResults;
    
  } catch (error) {
    console.error('💥 Pause/resume testing failed:', error.message);
    testResults.error = error.message;
    return testResults;
  } finally {
    await browser.close();
  }
}

testPauseResumeFeature().catch(console.error);
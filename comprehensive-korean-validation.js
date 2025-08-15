const { chromium } = require('playwright');

async function comprehensiveKoreanValidation() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    const issues = [];
    
    try {
        console.log('🔍 Starting comprehensive Korean validation...');
        
        // Test 1: Homepage Korean translation
        console.log('\n=== Testing Homepage ===');
        await page.goto('https://korean-mbti-platform.netlify.app/ko');
        await page.waitForTimeout(3000);
        
        const homeContent = await page.textContent('body');
        if (homeContent.includes('Discover Your') || homeContent.includes('Start Your Journey')) {
            issues.push('Homepage: Found English text that should be Korean');
        } else {
            console.log('✅ Homepage appears fully Korean');
        }
        
        // Test 2: Tests page
        console.log('\n=== Testing Tests Page ===');
        await page.goto('https://korean-mbti-platform.netlify.app/ko/tests');
        await page.waitForTimeout(3000);
        
        const testsContent = await page.textContent('body');
        if (testsContent.includes('Personality Tests') || testsContent.includes('Take Test')) {
            issues.push('Tests page: Found English text that should be Korean');
        } else {
            console.log('✅ Tests page appears fully Korean');
        }
        
        // Test 3: 360 Feedback test page
        console.log('\n=== Testing 360 Feedback Test Page ===');
        await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360');
        await page.waitForTimeout(3000);
        
        const feedback360Content = await page.textContent('body');
        
        // Check for common English phrases that shouldn't be there
        const englishPhrases = [
            '360° Feedback Assessment',
            'Start Assessment',
            'Back to Tests',
            'Previous',
            'Save & Exit'
        ];
        
        const foundEnglish = englishPhrases.filter(phrase => feedback360Content.includes(phrase));
        if (foundEnglish.length > 0) {
            issues.push(`360 Feedback: Found English phrases: ${foundEnglish.join(', ')}`);
        }
        
        // Test 4: Complete a test and check results/feedback sections
        console.log('\n=== Testing Complete Test Flow ===');
        
        // Set up test completion
        await page.evaluate(() => {
            const testResult = {
                testId: 'feedback-360',
                completedAt: new Date().toISOString(),
                scores: { 
                    leadership: 4, 
                    communication: 3, 
                    teamwork: 4,
                    emotional: 3,
                    problemSolving: 4,
                    adaptability: 3,
                    social: 4,
                    organization: 3 
                },
                type: 'Collaborative Leader',
                strengths: ['Leadership & Initiative', 'Communication & Social Skills'],
                recommendations: ['Emotional Intelligence & Empathy']
            };
            
            localStorage.setItem('test_feedback-360_progress', JSON.stringify({
                currentQuestion: 30,
                totalQuestions: 30,
                answers: Array(30).fill().map((_, i) => ({ questionIndex: i, value: 3 })),
                completed: true,
                completedAt: new Date().toISOString()
            }));
            
            localStorage.setItem('test_feedback-360_result', JSON.stringify(testResult));
        });
        
        await page.reload();
        await page.waitForTimeout(5000);
        
        // Check results section
        const resultsContent = await page.textContent('body');
        
        // Look for English in results
        const resultsEnglish = [
            'Test Completed!',
            'Your Personality Type',
            'Your Strengths',
            'Growth Opportunities',
            'About Your Type',
            'Strong in',
            'Focus on developing'
        ];
        
        const foundResultsEnglish = resultsEnglish.filter(phrase => resultsContent.includes(phrase));
        if (foundResultsEnglish.length > 0) {
            issues.push(`Results section: Found English phrases: ${foundResultsEnglish.join(', ')}`);
        }
        
        // Check email signup section
        if (resultsContent.includes('Want More Insights') || resultsContent.includes('Get Free Personality Insights')) {
            issues.push('Email signup: Still contains English text');
        }
        
        // Check feedback invitation section
        if (resultsContent.includes('Invite Others for Feedback') || resultsContent.includes('Questions will be like:')) {
            issues.push('Feedback invitation: Still contains English text');
        }
        
        // Test the fixed 님 suffix issue
        const nameTestScript = `
            document.querySelector('input[type="text"]')?.setAttribute('value', '김수님');
            document.querySelector('input[type="text"]')?.dispatchEvent(new Event('input', {bubbles: true}));
        `;
        
        try {
            await page.evaluate(nameTestScript);
            await page.waitForTimeout(2000);
            
            const updatedContent = await page.textContent('body');
            if (updatedContent.includes('김수님님')) {
                issues.push('님 suffix: Duplicate 님님 still appears');
            } else if (updatedContent.includes('김수님은') || updatedContent.includes('김수님이')) {
                console.log('✅ 님 suffix issue appears to be fixed');
            }
        } catch (error) {
            console.log('⚠️ Could not test 님 suffix (input field not found)');
        }
        
        // Test 5: MBTI test for comparison
        console.log('\n=== Testing MBTI Test ===');
        await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/mbti-classic');
        await page.waitForTimeout(3000);
        
        const mbtiContent = await page.textContent('body');
        if (mbtiContent.includes('16 Personalities') || mbtiContent.includes('Myers-Briggs')) {
            issues.push('MBTI test: Found English text that should be Korean');
        }
        
        // Final screenshot
        await page.screenshot({ path: 'korean-validation-final.png', fullPage: true });
        console.log('📸 Final validation screenshot saved');
        
    } catch (error) {
        console.error('❌ Error during validation:', error.message);
        issues.push(`System error: ${error.message}`);
    } finally {
        await browser.close();
    }
    
    // Report results
    console.log('\n=== VALIDATION RESULTS ===');
    if (issues.length === 0) {
        console.log('🎉 SUCCESS: No Korean localization issues found!');
        console.log('✅ All major sections appear properly translated');
        return true;
    } else {
        console.log(`❌ FOUND ${issues.length} ISSUES:`);
        issues.forEach((issue, index) => {
            console.log(`${index + 1}. ${issue}`);
        });
        return false;
    }
}

// Run the validation
comprehensiveKoreanValidation().then(success => {
    if (success) {
        console.log('\n🎉 Korean localization validation PASSED!');
        process.exit(0);
    } else {
        console.log('\n💥 Korean localization validation FAILED - issues need attention');
        process.exit(1);
    }
}).catch(error => {
    console.error('💥 Validation execution failed:', error);
    process.exit(1);
});
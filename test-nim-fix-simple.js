const { chromium } = require('playwright');

async function testNimFixDirect() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Testing duplicate 님 suffix fix (direct approach)...');
        
        // Go directly to the test page with localStorage data to simulate completed test
        await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360');
        await page.waitForTimeout(2000);
        
        // Set up localStorage with a completed test result to access feedback section
        await page.evaluate(() => {
            const testResult = {
                testId: 'feedback-360',
                completedAt: new Date().toISOString(),
                scores: { leadership: 4, communication: 3, teamwork: 4 },
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
        
        // Reload to show completed test and feedback section
        await page.reload();
        await page.waitForTimeout(3000);
        
        console.log('📋 Page reloaded with completed test data...');
        
        // Look for feedback invitation section  
        const feedbackSection = page.locator('text=다른 사람들에게 피드백 요청하기');
        
        if (await feedbackSection.count() > 0) {
            console.log('✅ Found feedback invitation section');
            
            // Scroll to the feedback section
            await feedbackSection.scrollIntoViewIfNeeded();
            await page.waitForTimeout(1000);
            
            // Find the name input field
            const nameInput = page.locator('input[type="text"]').filter({ hasText: '' });
            
            if (await nameInput.count() > 0) {
                // Enter test name with 님
                await nameInput.first().fill('김수님');
                await page.waitForTimeout(1000);
                
                console.log('✅ Entered name: 김수님');
                
                // Take screenshot for debugging
                await page.screenshot({ path: 'feedback-section-test.png' });
                console.log('📸 Screenshot saved: feedback-section-test.png');
                
                // Check the example text
                const allText = await page.textContent('body');
                console.log('🔍 Searching for example text...');
                
                // Look for the pattern in the page text
                if (allText.includes('김수님님')) {
                    console.log('❌ ISSUE STILL EXISTS: Found duplicate 님님');
                    const match = allText.match(/김수님님[^"]*?"/);
                    if (match) {
                        console.log('Full problematic text:', match[0]);
                    }
                    return false;
                } else if (allText.includes('김수님은')) {
                    console.log('✅ SUCCESS: Fixed duplicate 님 suffix - correctly shows 김수님은');
                    const match = allText.match(/김수님은[^"]*?"/);
                    if (match) {
                        console.log('Correct example text:', match[0]);
                    }
                    return true;
                } else {
                    console.log('⚠️  Could not find expected example patterns. Full text sample:');
                    console.log(allText.substring(allText.indexOf('김수님') - 50, allText.indexOf('김수님') + 100));
                    return false;
                }
            } else {
                console.log('❌ Could not find name input field');
                return false;
            }
        } else {
            console.log('❌ Could not find feedback invitation section');
            console.log('Page content includes:');
            const bodyText = await page.textContent('body');
            console.log(bodyText.substring(0, 500) + '...');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error during testing:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

// Run the test
testNimFixDirect().then(success => {
    if (success) {
        console.log('🎉 Test PASSED: Duplicate 님 suffix has been fixed!');
        process.exit(0);
    } else {
        console.log('💥 Test FAILED: Issue still exists or unable to verify');
        process.exit(1);
    }
}).catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
});
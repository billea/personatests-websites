const { chromium } = require('playwright');

async function testDuplicateNimFix() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Testing duplicate 님 suffix fix...');
        
        // Navigate to Korean 360 feedback test
        await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360');
        await page.waitForTimeout(3000);
        
        console.log('✅ Navigated to Korean 360 feedback test page');
        
        // Complete the test quickly by clicking random options
        console.log('🎯 Completing test questions...');
        
        // Answer questions with middle values (3 out of 5)
        for (let i = 1; i <= 30; i++) {
            try {
                const middleOption = page.locator(`input[name="q${i}"][value="3"]`);
                if (await middleOption.count() > 0) {
                    await middleOption.click();
                    console.log(`Answered question ${i}`);
                    await page.waitForTimeout(500);
                }
            } catch (error) {
                console.log(`Skipping question ${i}: ${error.message}`);
            }
        }
        
        // Submit the test
        const submitButton = page.locator('button:has-text("Submit")').or(page.locator('button:has-text("제출")'));
        if (await submitButton.count() > 0) {
            await submitButton.click();
            await page.waitForTimeout(3000);
        }
        
        console.log('📋 Test submitted, looking for feedback invitation section...');
        
        // Look for feedback invitation section
        const feedbackSection = page.locator('text=다른 사람들에게 피드백 요청하기').or(page.locator('text=Invite Others for Feedback'));
        
        if (await feedbackSection.count() > 0) {
            console.log('✅ Found feedback invitation section');
            
            // Enter test name with 님
            const nameInput = page.locator('input[placeholder*="Enter your first name"], input[type="text"]').first();
            await nameInput.fill('김수님');
            await page.waitForTimeout(1000);
            
            // Check the example text
            const exampleText = await page.locator('p:has-text("질문 예시:"), p:has-text("Questions will be like:")').textContent();
            console.log('📝 Example text found:', exampleText);
            
            // Check if it contains the duplicate 님님 issue
            if (exampleText && exampleText.includes('김수님님')) {
                console.log('❌ ISSUE STILL EXISTS: Found duplicate 님님 in example');
                console.log('Full text:', exampleText);
                return false;
            } else if (exampleText && exampleText.includes('김수님은')) {
                console.log('✅ SUCCESS: Fixed duplicate 님 suffix - correctly shows 김수님은');
                console.log('Full text:', exampleText);
                return true;
            } else {
                console.log('⚠️  Example text format might be different:', exampleText);
                return false;
            }
        } else {
            console.log('❌ Could not find feedback invitation section');
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
testDuplicateNimFix().then(success => {
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
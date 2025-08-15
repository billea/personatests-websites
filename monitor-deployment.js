const { chromium } = require('playwright');

async function checkDeployment() {
  console.log('🔍 Monitoring Netlify deployment status...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let attempts = 0;
  const maxAttempts = 15; // 15 attempts, 30 seconds apart = ~7.5 minutes max
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\n🔄 Attempt ${attempts}/${maxAttempts} - Checking deployment...`);
    
    try {
      await page.goto('https://korean-mbti-platform.netlify.app/ko/tests/feedback-360', { 
        waitUntil: 'networkidle', 
        timeout: 30000 
      });
      
      await page.waitForTimeout(2000);
      
      // Try to select general category if available
      try {
        const generalBtn = page.locator('button').filter({ hasText: '일반적 관계' }).first();
        if (await generalBtn.isVisible()) {
          await generalBtn.click();
          await page.waitForTimeout(1000);
        }
      } catch(e) {}
      
      // Enter name and start
      try {
        const nameInput = page.locator('input[type="text"]').first();
        if (await nameInput.isVisible()) {
          await nameInput.fill('김수');
          const startBtn = page.locator('button').filter({ hasText: /시작|계속/ }).first();
          if (await startBtn.isVisible()) {
            await startBtn.click();
            await page.waitForTimeout(2000);
          }
        }
      } catch(e) {}
      
      const pageText = await page.textContent('body');
      
      // Check question count
      const qMatch = pageText.match(/Question (\d+) of (\d+)/);
      const totalQuestions = qMatch ? parseInt(qMatch[2]) : 0;
      
      // Check for (는) issue
      const hasNimIssue = pageText.includes('님은(는)');
      
      // Check for correct format
      const hasCorrectFormat = pageText.includes('이 사람은');
      
      console.log(`📊 Questions: ${totalQuestions}`);
      console.log(`❌ Has (는) issue: ${hasNimIssue}`);
      console.log(`✅ Has correct format: ${hasCorrectFormat}`);
      
      if (totalQuestions === 20 && !hasNimIssue && hasCorrectFormat) {
        console.log('\n🎉 SUCCESS! Deployment is fixed!');
        console.log('✅ 20 questions found');
        console.log('✅ No (는) suffix');
        console.log('✅ Using "이 사람은" format');
        break;
      } else if (totalQuestions === 32 && hasNimIssue) {
        console.log('⏳ Still showing old version. Waiting for deployment...');
      } else {
        console.log('⚠️ Unexpected state detected');
      }
      
    } catch (error) {
      console.log(`❌ Error on attempt ${attempts}:`, error.message);
    }
    
    if (attempts < maxAttempts) {
      console.log('⏳ Waiting 30 seconds before next check...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  await browser.close();
  
  if (attempts >= maxAttempts) {
    console.log('\n⏰ Max attempts reached. Manual verification needed.');
  }
}

checkDeployment();
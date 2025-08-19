import { test, expect } from '@playwright/test';

test.describe('360 Feedback Workflow', () => {
  
  test('Feedback invitation URL parsing works correctly', async ({ page }) => {
    // Test URL with proper parameters
    const testUrl = '/en/feedback/invite_test_123?token=test123&name=TestUser&testId=feedback-360&testResultId=result123&email=test%40example.com';
    
    await page.goto(testUrl);
    
    // Should not show missing parameters error
    await expect(page.locator('body')).not.toContainText('Missing required parameters');
    
    // Should show feedback form or redirect to auth
    await expect(page).toHaveURL(/.*\/(feedback|auth)/);
    
    if (page.url().includes('/auth')) {
      // Check that auth page recognizes this as 360 feedback
      await expect(page.locator('body')).toContainText(/360.*Feedback|피드백/);
    }
  });

  test('Korean character handling in URLs', async ({ page }) => {
    // Test with Korean name parameter
    const koreanName = '수';
    const encodedName = encodeURIComponent(koreanName);
    const testUrl = `/ko/feedback/invite_test_456?token=test456&name=${encodedName}&testId=feedback-360&testResultId=result456&email=test%40example.com`;
    
    await page.goto(testUrl);
    
    // Should handle Korean characters properly
    await expect(page.locator('body')).not.toContainText('Missing required parameters');
    
    // Should display Korean interface
    if (!page.url().includes('/auth')) {
      // Check for Korean feedback text
      await expect(page.locator('body')).toContainText(/피드백|생각/);
    }
  });

  test('Feedback form question display', async ({ page }) => {
    // Create a test feedback URL with all required parameters
    const testUrl = '/en/feedback/invite_test_789?token=test789&name=TestUser&testId=feedback-360&testResultId=result789&email=test%40example.com&category=general';
    
    await page.goto(testUrl);
    
    // If redirected to auth, that's expected for unauthenticated users
    if (page.url().includes('/auth')) {
      await expect(page.locator('h1')).toContainText(/360.*Feedback|Sign In/);
      return;
    }
    
    // If we're on the feedback page, check the question display
    if (page.url().includes('/feedback/')) {
      // Should show question text, not translation keys
      const questionText = page.locator('[data-testid="question-text"]').or(page.locator('body'));
      const content = await questionText.textContent();
      
      // Should not show translation key patterns
      expect(content).not.toMatch(/feedback360\.[a-z]+\.q[0-9]+/);
      expect(content).not.toMatch(/tests\.feedback360\./);
    }
  });

  test('Feedback form rating interaction', async ({ page }) => {
    const testUrl = '/en/feedback/invite_test_101?token=test101&name=TestUser&testId=feedback-360&testResultId=result101&email=test%40example.com';
    
    await page.goto(testUrl);
    
    // Skip if redirected to auth (expected for unauthenticated users)
    if (page.url().includes('/auth')) {
      return;
    }
    
    // If on feedback page, test rating interaction
    if (page.url().includes('/feedback/')) {
      // Look for rating buttons/inputs
      const ratingInputs = page.locator('input[type="radio"]').or(page.locator('button[data-rating]'));
      
      if (await ratingInputs.count() > 0) {
        // Click on a rating
        await ratingInputs.first().click();
        
        // Check if next/submit button becomes enabled
        const nextButton = page.locator('button').filter({ hasText: /Next|Submit|다음|제출/ });
        if (await nextButton.isVisible()) {
          await expect(nextButton).not.toBeDisabled();
        }
      }
    }
  });

  test('Feedback URL parameter validation', async ({ page }) => {
    // Test with missing parameters
    await page.goto('/en/feedback/invite_missing_params');
    
    // Should handle missing parameters gracefully
    await expect(page.locator('body')).toContainText(/Missing|required|parameters|오류|필수/);
    
    // Test with malformed token
    await page.goto('/en/feedback/invite_test_bad?token=&name=Test&testId=feedback-360');
    
    // Should handle invalid token gracefully
    await page.waitForLoadState('networkidle');
    // Should either show error or redirect
    expect(page.url()).toMatch(/feedback|auth|error/);
  });

  test('Anonymous feedback submission flow', async ({ page }) => {
    const testUrl = '/en/feedback/invite_anon_123?token=anon123&name=Anonymous&testId=feedback-360&testResultId=resultAnon123&email=feedback%40example.com';
    
    await page.goto(testUrl);
    
    // Anonymous users should be able to access feedback without authentication
    if (page.url().includes('/feedback/')) {
      // Check that anonymous feedback is supported
      await expect(page.locator('body')).toContainText(/feedback|question|rating|anonymous/i);
      
      // Should not require login
      await expect(page.locator('body')).not.toContainText(/sign in|login|로그인/);
    }
  });

  test('Feedback progress tracking', async ({ page }) => {
    const testUrl = '/en/feedback/invite_progress_123?token=prog123&name=TestUser&testId=feedback-360&testResultId=resultProg123&email=test%40example.com';
    
    await page.goto(testUrl);
    
    if (page.url().includes('/feedback/')) {
      // Look for progress indicators
      const progressElement = page.locator('[data-testid="progress"]').or(page.locator('*')).filter({ hasText: /[0-9]+.*of.*[0-9]+|Question.*[0-9]+/ });
      
      if (await progressElement.isVisible()) {
        const progressText = await progressElement.textContent();
        expect(progressText).toMatch(/[0-9]+/); // Should contain numbers indicating progress
      }
    }
  });

  test('Feedback completion and thank you page', async ({ page }) => {
    // This test would need a way to simulate completing all questions
    // For now, we'll test the thank you page directly if it exists
    await page.goto('/en/feedback/thank-you');
    
    // Should handle thank you page gracefully
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Multi-language feedback support', async ({ page }) => {
    // Test English feedback
    const enUrl = '/en/feedback/invite_lang_en?token=lang123&name=TestUser&testId=feedback-360&testResultId=resultLang123&email=test%40example.com';
    await page.goto(enUrl);
    
    if (!page.url().includes('/auth')) {
      // Should be in English
      const content = await page.locator('body').textContent();
      expect(content).toMatch(/feedback|question|think about/i);
    }
    
    // Test Korean feedback
    const koUrl = '/ko/feedback/invite_lang_ko?token=lang456&name=%EC%88%98&testId=feedback-360&testResultId=resultLang456&email=test%40example.com';
    await page.goto(koUrl);
    
    if (!page.url().includes('/auth')) {
      // Should be in Korean
      const content = await page.locator('body').textContent();
      expect(content).toMatch(/피드백|질문|생각/);
    }
  });
});
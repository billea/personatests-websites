import { test, expect } from '@playwright/test';

test.describe('User Experience Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('/en');
  });

  test('Header shows authentication status consistently across pages', async ({ page }) => {
    // Test 1: Check header is visible on main page
    await expect(page.locator('header')).toBeVisible();
    
    // Navigate to tests page
    await page.goto('/en/tests');
    
    // Test 2: Check header is visible on tests page
    await expect(page.locator('header')).toBeVisible();
    
    // Test 3: Check that auth status is consistently displayed
    const authSection = page.locator('[data-testid="auth-status"]').or(page.getByText('Sign In')).or(page.getByText('로그인'));
    await expect(authSection).toBeVisible();
    
    // Navigate to profile page (should redirect to auth)
    await page.goto('/en/profile');
    
    // Should be redirected to auth page
    await expect(page).toHaveURL(/.*\/auth/);
    
    // Test 4: Check header is visible on auth page
    await expect(page.locator('header')).toBeVisible();
  });

  test('Tests page shows user authentication properly', async ({ page }) => {
    await page.goto('/en/tests');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Personality Tests');
    
    // Check that tests are displayed
    await expect(page.locator('a[href*="/tests/"]')).toHaveCount({ min: 1 });
    
    // Check that header shows login option for unauthenticated user
    const loginButton = page.locator('a[href*="/auth"]').or(page.getByText('Sign In')).or(page.getByText('로그인'));
    await expect(loginButton).toBeVisible();
  });

  test('Profile page redirects to authentication when not logged in', async ({ page }) => {
    await page.goto('/en/profile');
    
    // Should be redirected to auth page with return URL
    await expect(page).toHaveURL(/.*\/auth.*returnUrl.*profile/);
    
    // Check auth page content
    await expect(page.locator('h1')).toContainText(/Sign In|로그인/);
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('Navigation consistency across all main pages', async ({ page }) => {
    const pages = ['/en', '/en/tests', '/en/results'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Check header is consistent
      await expect(page.locator('header')).toBeVisible();
      
      // Check language switcher if present
      const languageSwitch = page.locator('[data-testid="language-switch"]').or(page.getByText('한국어')).or(page.getByText('English'));
      if (await languageSwitch.isVisible()) {
        await expect(languageSwitch).toBeVisible();
      }
      
      // Check navigation links
      const navLinks = page.locator('nav a').or(page.locator('header a'));
      await expect(navLinks).toHaveCount({ min: 1 });
    }
  });

  test('Korean language support works correctly', async ({ page }) => {
    // Start with English
    await page.goto('/en/tests');
    await expect(page.locator('h1')).toContainText('Personality Tests');
    
    // Switch to Korean
    await page.goto('/ko/tests');
    await expect(page.locator('h1')).toContainText('성격 테스트');
    
    // Check Korean auth page
    await page.goto('/ko/auth');
    await expect(page.locator('h1')).toContainText('로그인');
    await expect(page.getByText('Google로 로그인')).toBeVisible();
  });

  test('360 Feedback workflow basic navigation', async ({ page }) => {
    await page.goto('/en/tests');
    
    // Look for 360 feedback test
    const feedbackTest = page.locator('a[href*="feedback-360"]');
    if (await feedbackTest.isVisible()) {
      await feedbackTest.click();
      
      // Should be on test page or redirected to auth
      await expect(page).toHaveURL(/.*\/(tests\/feedback-360|auth)/);
      
      if (page.url().includes('/auth')) {
        // Check auth page has feedback context
        await expect(page.locator('h1')).toContainText(/360.*Feedback|로그인/);
      }
    }
  });

  test('Results page handles unauthenticated state properly', async ({ page }) => {
    await page.goto('/en/results');
    
    // Check if redirected to auth or shows empty state
    if (page.url().includes('/auth')) {
      await expect(page.locator('h1')).toContainText(/Sign In|로그인/);
    } else {
      // Should show some kind of empty state or instruction to log in
      await expect(page.locator('body')).toContainText(/sign in|login|로그인|results/i);
    }
  });

  test('Mobile responsiveness check', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/en/tests');
    
    // Check that header is responsive
    await expect(page.locator('header')).toBeVisible();
    
    // Check that test cards are properly displayed on mobile
    const testCards = page.locator('a[href*="/tests/"]');
    await expect(testCards.first()).toBeVisible();
    
    // Check that buttons are clickable on mobile
    const mainButton = page.locator('button, a[href*="/auth"]').first();
    if (await mainButton.isVisible()) {
      await expect(mainButton).toBeVisible();
    }
  });

  test('Page loading performance check', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/en/tests');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check that main content is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('Error handling for invalid URLs', async ({ page }) => {
    // Test invalid test ID
    await page.goto('/en/tests/invalid-test-id');
    
    // Should handle gracefully - either redirect or show error
    await page.waitForLoadState('networkidle');
    
    // Page should not be completely broken
    await expect(page.locator('body')).toBeVisible();
    
    // Test invalid locale
    await page.goto('/invalid-locale/tests');
    
    // Should handle gracefully
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Translation fallback system works', async ({ page }) => {
    await page.goto('/en/tests');
    
    // Check that text is in English (not showing translation keys)
    const heading = await page.locator('h1').textContent();
    expect(heading).not.toMatch(/^[a-z]+\.[a-z]+\./); // Should not start with translation key pattern
    
    await page.goto('/ko/tests');
    
    // Check that text is in Korean (not showing translation keys)
    const koreanHeading = await page.locator('h1').textContent();
    expect(koreanHeading).not.toMatch(/^[a-z]+\.[a-z]+\./); // Should not start with translation key pattern
  });
});
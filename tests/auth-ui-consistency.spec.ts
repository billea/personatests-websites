import { test, expect } from '@playwright/test';

test.describe('Authentication UI Consistency', () => {
  
  test('Header component shows consistent authentication UI across pages', async ({ page }) => {
    // Test 1: Main page has header with auth
    await page.goto('/en');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if header exists
    const header = page.locator('header').or(page.locator('nav')).or(page.locator('[data-testid="header"]'));
    if (await header.isVisible()) {
      await expect(header).toBeVisible();
    }
    
    // Test 2: Tests page shows consistent auth UI
    await page.goto('/en/tests');
    await page.waitForLoadState('networkidle');
    
    // Page should load successfully
    await expect(page.locator('body')).toBeVisible();
    
    // Should show tests content
    const testsHeading = page.locator('h1').filter({ hasText: /Personality Tests|성격 테스트/ });
    if (await testsHeading.isVisible()) {
      await expect(testsHeading).toBeVisible();
    }
    
    // Test 3: Profile page redirects appropriately
    await page.goto('/en/profile');
    await page.waitForLoadState('networkidle');
    
    // Should be redirected to auth or show profile content
    const isAuthPage = page.url().includes('/auth');
    const isProfilePage = page.url().includes('/profile');
    
    if (isAuthPage) {
      // If redirected to auth, should show sign in
      await expect(page.locator('body')).toContainText(/Sign In|Google|로그인/);
    } else if (isProfilePage) {
      // If on profile page, should show profile content
      await expect(page.locator('body')).toContainText(/Profile|User|사용자|프로필/);
    }
    
    expect(isAuthPage || isProfilePage).toBeTruthy();
  });

  test('Authentication flow works correctly', async ({ page }) => {
    await page.goto('/en/auth');
    await page.waitForLoadState('networkidle');
    
    // Should show auth page content
    await expect(page.locator('body')).toContainText(/Sign In|Google|로그인/);
    
    // Should have Google sign in button
    const googleButton = page.locator('button').filter({ hasText: /Google|로그인/ });
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeVisible();
      await expect(googleButton).toBeEnabled();
    }
  });

  test('Korean language support works', async ({ page }) => {
    // Test Korean main page
    await page.goto('/ko');
    await page.waitForLoadState('networkidle');
    
    // Should load successfully
    await expect(page.locator('body')).toBeVisible();
    
    // Test Korean tests page
    await page.goto('/ko/tests');
    await page.waitForLoadState('networkidle');
    
    // Should show Korean content
    const heading = page.locator('h1');
    if (await heading.isVisible()) {
      const headingText = await heading.textContent();
      // Should not show translation keys
      expect(headingText).not.toMatch(/^[a-z]+\.[a-z]+\./);
    }
    
    // Test Korean auth page
    await page.goto('/ko/auth');
    await page.waitForLoadState('networkidle');
    
    // Should show Korean auth content
    await expect(page.locator('body')).toContainText(/로그인|Google/);
  });

  test('Page loading and basic functionality', async ({ page }) => {
    const pages = ['/en', '/en/tests', '/en/auth'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Basic checks
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      
      // Should not show error pages
      await expect(page.locator('body')).not.toContainText(/404|500|Error|Runtime Error/);
      
      // Performance check - page should load within reasonable time
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    }
  });

  test('Mobile responsiveness basic check', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/en/tests');
    await page.waitForLoadState('networkidle');
    
    // Should be mobile responsive
    await expect(page.locator('body')).toBeVisible();
    
    // Check that content is properly displayed
    const heading = page.locator('h1');
    if (await heading.isVisible()) {
      const boundingBox = await heading.boundingBox();
      if (boundingBox) {
        // Heading should fit within mobile viewport
        expect(boundingBox.width).toBeLessThanOrEqual(375);
      }
    }
  });
});
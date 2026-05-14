// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

const BASE_URL = 'https://www.saucedemo.com/';
const SCREENSHOTS_DIR = 'C:/MyQAProject/screenshots';

test.describe('SauceDemo Login Scenarios', () => {

  // ─────────────────────────────────────────────
  // TC01: Valid Login (Positive Case)
  // ─────────────────────────────────────────────
  test('TC01 - Valid Login (Positive Case)', async ({ page }) => {

    // Step 1: Navigate to target URL
    await page.goto(BASE_URL);
    await expect(page.locator('#user-name'), 'Username field should be visible').toBeVisible();
    await expect(page.locator('#password'), 'Password field should be visible').toBeVisible();
    await expect(page.locator('#login-button'), 'Login button should be visible').toBeVisible();

    // Step 2: Enter username
    await page.fill('#user-name', 'standard_user');
    await expect(page.locator('#user-name')).toHaveValue('standard_user');

    // Step 3: Enter password
    await page.fill('#password', 'secret_sauce');
    await expect(page.locator('#password')).toHaveValue('secret_sauce');

    // Step 4: Screenshot before login
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tc01_before_login.png') });

    // Step 5: Click Login and verify navigation to Inventory page
    await page.click('#login-button');
    await expect(page, 'Should navigate to inventory page').toHaveURL(/.*inventory/);
    await expect(
      page.locator('.title, [data-test="title"]'),
      '"Products" heading should be visible'
    ).toContainText('Products');

    // Step 6: Screenshot after successful login
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tc01_login_success.png') });
  });

  // ─────────────────────────────────────────────
  // TC02: Invalid Password (Negative Case)
  // ─────────────────────────────────────────────
  test('TC02 - Invalid Password (Negative Case)', async ({ page }) => {

    // Step 1: Navigate to target URL
    await page.goto(BASE_URL);
    await expect(page.locator('#user-name'), 'Page should be ready for input').toBeVisible();

    // Step 2: Enter username
    await page.fill('#user-name', 'standard_user');
    await expect(page.locator('#user-name')).toHaveValue('standard_user');

    // Step 3: Enter wrong password
    await page.fill('#password', 'wrong_password_123');
    await expect(page.locator('#password')).toHaveValue('wrong_password_123');

    // Step 4: Screenshot before login attempt
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tc02_before_login.png') });

    // Step 5: Click Login — expect to stay on login page with error
    await page.click('#login-button');
    await expect(page, 'Should NOT navigate away from login page').toHaveURL(BASE_URL);

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg, 'Error message container should be visible').toBeVisible();
    await expect(errorMsg, 'Error text should match expected message').toContainText(
      'Epic sadface: Username and password do not match any user in this service'
    );

    // Step 6: Screenshot showing error message
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'tc02_login_error.png') });
  });

});

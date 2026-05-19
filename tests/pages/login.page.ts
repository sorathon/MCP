import { type Page, type Locator, expect } from '@playwright/test';

/**
 * LoginPage — Page Object Model
 * URL: /login
 * App: Document Approval System
 */
export class LoginPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggleIcon: Locator;
  readonly signInButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle      = page.getByRole('heading', { name: 'Document Approval System' });
    this.pageSubtitle   = page.locator('p', { hasText: 'Sign in to your account' });
    this.usernameInput  = page.getByTestId('input-username');
    this.passwordInput  = page.getByTestId('input-password');
    this.passwordToggleIcon = page.locator('input[placeholder="Enter password"] ~ img, [data-testid="input-password"] ~ img').first();
    this.signInButton   = page.getByTestId('btn-login-submit');
    this.registerLink   = page.getByRole('link', { name: 'Register' });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate directly to the login page */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /** Fill in credentials and submit the login form */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /** Toggle the password visibility icon */
  async togglePasswordVisibility(): Promise<void> {
    await this.passwordToggleIcon.click();
  }

  /** Click the Register link */
  async clickRegister(): Promise<void> {
    await this.registerLink.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** Assert that the login page is fully visible */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageSubtitle).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  /** Assert that login was successful (redirects away from /login) */
  async assertLoginSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login/);
  }

  /** Assert that the page title text is correct */
  async assertTitle(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Document Approval System');
  }
}

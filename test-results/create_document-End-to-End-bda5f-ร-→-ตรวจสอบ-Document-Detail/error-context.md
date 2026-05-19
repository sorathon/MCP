# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: create_document.spec.ts >> End-to-End Create Document Flow >> TC-CD-001 : ล็อกอิน → สร้างเอกสาร → ตรวจสอบ Document Detail
- Location: create_document.spec.ts:50:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/login", waiting until "load"

```

# Test source

```ts
  1  | import { type Page, type Locator, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * LoginPage — Page Object Model
  5  |  * URL: /login
  6  |  * App: Document Approval System
  7  |  */
  8  | export class LoginPage {
  9  |   readonly page: Page;
  10 | 
  11 |   // ── Locators ──────────────────────────────────────────────────────────────
  12 |   readonly pageTitle: Locator;
  13 |   readonly pageSubtitle: Locator;
  14 |   readonly usernameInput: Locator;
  15 |   readonly passwordInput: Locator;
  16 |   readonly passwordToggleIcon: Locator;
  17 |   readonly signInButton: Locator;
  18 |   readonly registerLink: Locator;
  19 | 
  20 |   constructor(page: Page) {
  21 |     this.page = page;
  22 | 
  23 |     this.pageTitle      = page.getByRole('heading', { name: 'Document Approval System' });
  24 |     this.pageSubtitle   = page.locator('p', { hasText: 'Sign in to your account' });
  25 |     this.usernameInput  = page.getByTestId('input-username');
  26 |     this.passwordInput  = page.getByTestId('input-password');
  27 |     this.passwordToggleIcon = page.locator('input[placeholder="Enter password"] ~ img, [data-testid="input-password"] ~ img').first();
  28 |     this.signInButton   = page.getByTestId('btn-login-submit');
  29 |     this.registerLink   = page.getByRole('link', { name: 'Register' });
  30 |   }
  31 | 
  32 |   // ── Actions ───────────────────────────────────────────────────────────────
  33 | 
  34 |   /** Navigate directly to the login page */
  35 |   async goto(): Promise<void> {
> 36 |     await this.page.goto('/login');
     |                     ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  37 |   }
  38 | 
  39 |   /** Fill in credentials and submit the login form */
  40 |   async login(username: string, password: string): Promise<void> {
  41 |     await this.usernameInput.fill(username);
  42 |     await this.passwordInput.fill(password);
  43 |     await this.signInButton.click();
  44 |   }
  45 | 
  46 |   /** Toggle the password visibility icon */
  47 |   async togglePasswordVisibility(): Promise<void> {
  48 |     await this.passwordToggleIcon.click();
  49 |   }
  50 | 
  51 |   /** Click the Register link */
  52 |   async clickRegister(): Promise<void> {
  53 |     await this.registerLink.click();
  54 |   }
  55 | 
  56 |   // ── Assertions ────────────────────────────────────────────────────────────
  57 | 
  58 |   /** Assert that the login page is fully visible */
  59 |   async assertPageLoaded(): Promise<void> {
  60 |     await expect(this.page).toHaveURL(/\/login/);
  61 |     await expect(this.pageTitle).toBeVisible();
  62 |     await expect(this.pageSubtitle).toBeVisible();
  63 |     await expect(this.usernameInput).toBeVisible();
  64 |     await expect(this.passwordInput).toBeVisible();
  65 |     await expect(this.signInButton).toBeVisible();
  66 |   }
  67 | 
  68 |   /** Assert that login was successful (redirects away from /login) */
  69 |   async assertLoginSuccess(): Promise<void> {
  70 |     await expect(this.page).not.toHaveURL(/\/login/);
  71 |   }
  72 | 
  73 |   /** Assert that the page title text is correct */
  74 |   async assertTitle(): Promise<void> {
  75 |     await expect(this.pageTitle).toHaveText('Document Approval System');
  76 |   }
  77 | }
  78 | 
```
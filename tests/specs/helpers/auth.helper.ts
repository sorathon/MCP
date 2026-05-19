import { type Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

/**
 * Auth Helper
 * Centralises login/logout logic and credential sets.
 * Import this into any spec that needs an authenticated session.
 */

export interface UserCredentials {
  username: string;
  password: string;
  displayName?: string;
  role?: string;
}

/** Pre-defined test users */
export const TEST_USERS: Record<string, UserCredentials> = {
  maker1: {
    username: 'maker1',
    password: 'password',
    displayName: 'John Maker',
    role: 'MAKER',
  },
};

/**
 * Log in via the UI and wait until the dashboard is reachable.
 * Uses the LoginPage POM — no raw selectors here.
 */
export async function loginAs(page: Page, credentials: UserCredentials): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);
  // Wait for redirect away from /login
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10_000 });
}

/**
 * Convenience wrapper: log in as the default maker1 user.
 */
export async function loginAsMaker1(page: Page): Promise<void> {
  await loginAs(page, TEST_USERS.maker1);
}

/**
 * Log out via the user dropdown and confirm redirect to /login.
 */
export async function logout(page: Page): Promise<void> {
  // Open the user dropdown (data-testid used by the app)
  await page.getByTestId('user-dropdown').click();
  await page.getByRole('listitem').filter({ hasText: 'Sign Out' }).click();
  await page.waitForURL('**/login', { timeout: 10_000 });
}

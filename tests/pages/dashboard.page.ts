import { type Page, type Locator, expect } from '@playwright/test';

/**
 * DashboardPage — Page Object Model
 * URL: /dashboard
 */
export class DashboardPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly welcomeHeading: Locator;

  // Stats cards
  readonly statTotal: Locator;
  readonly statDraft: Locator;
  readonly statPendingApproval: Locator;
  readonly statApproved: Locator;
  readonly statRejected: Locator;

  // Actions
  readonly createDocumentButton: Locator;

  // Recent documents table
  readonly recentDocumentsSection: Locator;
  readonly viewAllLink: Locator;
  readonly recentDocumentsTable: Locator;
  readonly recentDocumentsRows: Locator;

  constructor(page: Page) {
    this.page = page;

    this.welcomeHeading       = page.getByRole('heading', { level: 2 });
    this.statTotal            = page.locator('text=Total').locator('..').locator('..');
    this.statDraft            = page.locator('text=Draft').locator('..').locator('..');
    this.statPendingApproval  = page.locator('text=Pending Approval').locator('..').locator('..');
    this.statApproved         = page.locator('text=Approved').locator('..').locator('..');
    this.statRejected         = page.locator('text=Rejected').locator('..').locator('..');
    this.createDocumentButton = page.getByRole('button', { name: 'Create Document' });
    this.recentDocumentsSection = page.locator('text=Recent Documents').locator('..').locator('..');
    this.viewAllLink          = page.getByRole('link', { name: 'View All' });
    this.recentDocumentsTable = page.locator('table').first();
    this.recentDocumentsRows  = page.locator('table tbody tr');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async clickCreateDocument(): Promise<void> {
    await this.createDocumentButton.click();
    await this.page.waitForURL('**/documents/create');
  }

  async clickViewAll(): Promise<void> {
    await this.viewAllLink.click();
    await this.page.waitForURL('**/documents');
  }

  async clickDocumentLink(docNumber: string): Promise<void> {
    await this.page.getByRole('link', { name: docNumber }).click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.createDocumentButton).toBeVisible();
    await expect(this.recentDocumentsTable).toBeVisible();
  }

  async assertWelcomeMessage(name: string): Promise<void> {
    await expect(this.welcomeHeading).toContainText(`Welcome, ${name}!`);
  }

  async assertStatCardValue(stat: 'total' | 'draft' | 'pending' | 'approved' | 'rejected', value: string): Promise<void> {
    const map: Record<string, Locator> = {
      total:    this.statTotal,
      draft:    this.statDraft,
      pending:  this.statPendingApproval,
      approved: this.statApproved,
      rejected: this.statRejected,
    };
    await expect(map[stat]).toContainText(value);
  }

  async assertRecentDocumentsTableVisible(): Promise<void> {
    await expect(this.recentDocumentsTable).toBeVisible();
    // Verify headers
    await expect(this.page.getByRole('columnheader', { name: 'Doc Number' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Title' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Category' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Created' })).toBeVisible();
  }
}

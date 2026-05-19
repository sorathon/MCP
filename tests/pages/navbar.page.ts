import { type Page, type Locator, expect } from '@playwright/test';

/**
 * NavbarPage — Shared Navigation & Header Component
 * Present on all authenticated pages (sidebar + top header)
 *
 * ── Changelog ────────────────────────────────────────────────────────────────
 * [ADDED] navApproveDocuments — menu item for /approve (Approve_document spec)
 */
export class NavbarPage {
  readonly page: Page;

  // ── Sidebar navigation ────────────────────────────────────────────────────
  readonly brandLogo: Locator;
  readonly navDashboard: Locator;
  readonly navMyDocuments: Locator;
  readonly navCreateDocument: Locator;
  readonly navApproveDocuments: Locator;  // [ADDED] menu-approve-documents

  // ── Top header ────────────────────────────────────────────────────────────
  readonly roleBadge: Locator;
  readonly userDropdownToggle: Locator;
  readonly userDropdownProfile: Locator;
  readonly userDropdownSignOut: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar
    this.brandLogo             = page.locator('text=DocApproval').first();
    this.navDashboard          = page.getByTestId('menu-dashboard');
    this.navMyDocuments        = page.getByTestId('menu-my-documents');
    this.navCreateDocument     = page.getByTestId('menu-create-document');
    // Approve Documents — ลอง testid ก่อน fallback ด้วย text/role
    this.navApproveDocuments   = page.getByTestId('menu-approve-documents')
      .or(page.getByRole('menuitem', { name: /Approve Documents/i }))
      .or(page.locator('a, li, span').filter({ hasText: /^Approve Documents$/i }).first());

    // Header
    this.roleBadge             = page.locator('text=MAKER').first();
    this.userDropdownToggle    = page.getByTestId('user-dropdown');
    this.userDropdownProfile   = page.getByRole('listitem').filter({ hasText: 'Profile' });
    this.userDropdownSignOut   = page.getByRole('listitem').filter({ hasText: 'Sign Out' });
  }

  // ── Navigation actions ────────────────────────────────────────────────────

  async goToDashboard(): Promise<void> {
    await this.navDashboard.click();
    await this.page.waitForURL('**/dashboard');
  }

  async goToMyDocuments(): Promise<void> {
    await this.navMyDocuments.click();
    await this.page.waitForURL('**/documents');
  }

  async goToCreateDocument(): Promise<void> {
    await this.navCreateDocument.click();
    await this.page.waitForURL('**/documents/create');
  }

  /** [ADDED] Navigate to Approve Documents page */
  async goToApproveDocuments(): Promise<void> {
    await this.navApproveDocuments.click();
    await this.page.waitForURL('**/approve');
  }

  /** Open the user dropdown, then click Sign Out */
  async signOut(): Promise<void> {
    await this.userDropdownToggle.click();
    await this.userDropdownSignOut.click();
    await this.page.waitForURL('**/login');
  }

  /** Open the user dropdown, then click Profile */
  async goToProfile(): Promise<void> {
    await this.userDropdownToggle.click();
    await this.userDropdownProfile.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertNavbarVisible(): Promise<void> {
    await expect(this.brandLogo).toBeVisible();
    await expect(this.navDashboard).toBeVisible();
    await expect(this.navMyDocuments).toBeVisible();
    await expect(this.navCreateDocument).toBeVisible();
  }

  async assertActiveNav(item: 'dashboard' | 'my-documents' | 'create-document' | 'approve-documents'): Promise<void> {
    const map = {
      'dashboard':          this.navDashboard,
      'my-documents':       this.navMyDocuments,
      'create-document':    this.navCreateDocument,
      'approve-documents':  this.navApproveDocuments,
    };
    await expect(map[item]).toHaveAttribute('class', /active/);
  }

  async assertUserName(name: string): Promise<void> {
    await expect(this.userDropdownToggle).toContainText(name);
  }
}

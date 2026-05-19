import { type Page, type Locator, expect } from '@playwright/test';

/**
 * DocumentsListPage — Page Object Model
 * URL: /documents
 */
export class DocumentsListPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly pageHeading: Locator;
  readonly createDocumentButton: Locator;

  // Filter controls
  readonly statusFilterDropdown: Locator;
  readonly statusFilterInput: Locator;
  readonly refreshButton: Locator;

  // Table
  readonly documentsTable: Locator;
  readonly tableRows: Locator;
  readonly colDocNumber: Locator;
  readonly colTitle: Locator;
  readonly colCategory: Locator;
  readonly colStatus: Locator;
  readonly colCreatedAt: Locator;
  readonly colActions: Locator;

  // Pagination
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly paginationList: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageHeading         = page.getByRole('heading', { name: 'My Documents' });
    this.createDocumentButton = page.getByRole('button', { name: 'Create Document' });
    this.statusFilterDropdown = page.locator('[placeholder=""], input').filter({ hasText: '' }).first();
    this.statusFilterInput    = page.locator('input[type="text"]').first();
    this.refreshButton        = page.getByRole('button', { name: 'Refresh' });
    this.documentsTable       = page.locator('table');
    this.tableRows            = page.locator('table tbody tr');
    this.colDocNumber         = page.getByRole('columnheader', { name: 'Doc Number' });
    this.colTitle             = page.getByRole('columnheader', { name: 'Title' });
    this.colCategory          = page.getByRole('columnheader', { name: 'Category' });
    this.colStatus            = page.getByRole('columnheader', { name: 'Status' });
    this.colCreatedAt         = page.getByRole('columnheader', { name: 'Created At' });
    this.colActions           = page.getByRole('columnheader', { name: 'Actions' });
    this.prevPageButton       = page.getByRole('button', { name: 'Previous Page' });
    this.nextPageButton       = page.getByRole('button', { name: 'Next Page' });
    this.paginationList       = page.locator('ul').last();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto('/documents');
  }

  async clickCreateDocument(): Promise<void> {
    await this.createDocumentButton.click();
    await this.page.waitForURL('**/documents/create');
  }

  async clickRefresh(): Promise<void> {
    await this.refreshButton.click();
  }

  async clickViewForRow(index: number = 0): Promise<void> {
    const rows = this.page.locator('table tbody tr');
    await rows.nth(index).getByRole('button', { name: 'View' }).click();
  }

  async clickDocumentLink(docNumber: string): Promise<void> {
    await this.page.getByRole('link', { name: docNumber }).click();
  }

  async clickNextPage(): Promise<void> {
    await this.nextPageButton.click();
  }

  async clickPrevPage(): Promise<void> {
    await this.prevPageButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/documents$/);
    await expect(this.pageHeading).toBeVisible();
    await expect(this.documentsTable).toBeVisible();
  }

  async assertTableHeaders(): Promise<void> {
    await expect(this.colDocNumber).toBeVisible();
    await expect(this.colTitle).toBeVisible();
    await expect(this.colCategory).toBeVisible();
    await expect(this.colStatus).toBeVisible();
    await expect(this.colCreatedAt).toBeVisible();
    await expect(this.colActions).toBeVisible();
  }

  async assertRowCount(count: number): Promise<void> {
    await expect(this.tableRows).toHaveCount(count);
  }

  async assertDocumentInTable(docNumber: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: docNumber })).toBeVisible();
  }

  async assertPrevPageDisabled(): Promise<void> {
    await expect(this.prevPageButton).toBeDisabled();
  }

  async assertNextPageDisabled(): Promise<void> {
    await expect(this.nextPageButton).toBeDisabled();
  }
}

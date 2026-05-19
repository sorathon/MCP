import { type Page, type Locator, expect } from '@playwright/test';

/**
 * DocumentDetailPage — Page Object Model
 * URL: /documents/:id
 *
 * ── DOM Structure (verified by live crawl) ───────────────────────────────────
 * data-testid="detail-loading"        — nz-spin wrapper (outermost)
 * data-testid="doc-status-card"       — nz-card: stepper (Draft→Pending→Approved)
 * data-testid="doc-progress-steps"    — nz-steps inside status card
 *   data-testid="step-draft"          — nz-step Draft
 *   data-testid="step-pending"        — nz-step Pending Approval
 *   data-testid="step-final"          — nz-step Approved/Rejected
 * id="approval-history-card"          — nz-card: Approval History
 * data-testid="approval-history-card" — same card (both id and testid present)
 *   card body contains: "SUBMIT by John Maker (maker)  19/05/2026 14:36"
 * Document info is inside nz-descriptions table (not a native <table>)
 */
export class DocumentDetailPage {
  readonly page: Page;

  // ── Breadcrumbs ───────────────────────────────────────────────────────────
  readonly breadcrumbHome: Locator;
  readonly breadcrumbDocuments: Locator;

  // ── Status stepper ────────────────────────────────────────────────────────
  readonly statusCard: Locator;
  readonly stepDraft: Locator;
  readonly stepPendingApproval: Locator;
  readonly stepApproved: Locator;

  // ── Document info (nz-descriptions — not a native <table>) ───────────────
  readonly documentInfoTable: Locator;

  // ── Approval history ──────────────────────────────────────────────────────
  // data-testid="approval-history-card" — full nz-card including body content
  readonly approvalHistorySection: Locator;
  readonly approvalHistoryItems: Locator;

  constructor(page: Page) {
    this.page = page;

    // Breadcrumbs
    this.breadcrumbHome      = page.getByRole('link', { name: 'Home' });
    this.breadcrumbDocuments = page.getByRole('link', { name: 'Documents' });

    // Stepper — use data-testid confirmed from DOM
    this.statusCard          = page.getByTestId('doc-status-card');
    this.stepDraft           = page.getByTestId('step-draft');
    this.stepPendingApproval = page.getByTestId('step-pending');
    this.stepApproved        = page.getByTestId('step-final');

    // Document info card — nz-descriptions renders as a table-like div, not <table>
    // Use the spin container which holds all detail content
    this.documentInfoTable   = page.getByTestId('detail-loading');

    // Approval History — data-testid="approval-history-card" is the FULL nz-card
    // (head + body) so toContainText("SUBMIT") will find content in the body
    this.approvalHistorySection = page.getByTestId('approval-history-card');
    this.approvalHistoryItems   = page.getByTestId('approval-history-card').locator('li');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(id: number | string): Promise<void> {
    await this.page.goto(`/documents/${id}`);
  }

  async clickBreadcrumbHome(): Promise<void> {
    await this.breadcrumbHome.click();
    await this.page.waitForURL('**/dashboard');
  }

  async clickBreadcrumbDocuments(): Promise<void> {
    await this.breadcrumbDocuments.click();
    await this.page.waitForURL('**/documents');
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertPageLoaded(id: number | string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/documents/${id}`));
    await expect(this.documentInfoTable).toBeVisible();
    await expect(this.approvalHistorySection).toBeVisible();
  }

  async assertDocumentNumber(docNumber: string): Promise<void> {
    await expect(this.documentInfoTable).toContainText(docNumber);
  }

  async assertStatus(status: string): Promise<void> {
    await expect(this.documentInfoTable).toContainText(status);
  }

  async assertTitle(title: string): Promise<void> {
    await expect(this.documentInfoTable).toContainText(title);
  }

  async assertCategory(category: string): Promise<void> {
    await expect(this.documentInfoTable).toContainText(category);
  }

  async assertCreatedBy(name: string): Promise<void> {
    await expect(this.documentInfoTable).toContainText(name);
  }

  async assertStepperVisible(): Promise<void> {
    await expect(this.stepDraft).toBeVisible();
    await expect(this.stepPendingApproval).toBeVisible();
    await expect(this.stepApproved).toBeVisible();
  }

  /** ตรวจสอบว่า Approval History card มีข้อความที่ต้องการ เช่น "SUBMIT" */
  async assertApprovalHistoryContains(text: string): Promise<void> {
    // approval-history-card = full nz-card (head + body) — body มี history items
    await expect(this.approvalHistorySection).toContainText(text, { timeout: 8_000 });
  }
}

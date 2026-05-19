import { type Page, type Locator, expect } from '@playwright/test';

/**
 * CreateDocumentPage — Page Object Model
 * URL: /documents/create
 *
 * ── Dropdown Implementation (NG-ZORRO / Ant Design nz-select) ────────────────
 * Category field เป็น custom dropdown ของ NG-ZORRO
 * - Trigger  : data-testid="select-category"
 * - Options  : render เป็น overlay portal นอก form tree
 *              class ของ option text node = "ant-select-item-option-content"
 * - ชื่อ options จริงใน DOM:
 *     "Finance (FIN)"
 *     "Human Resources (HR)"
 *     "Information Technology (IT)"
 *     "Legal (LEGAL)"
 *     "Operations (OPS)"
 */
export class CreateDocumentPage {
  readonly page: Page;

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  readonly breadcrumbHome: Locator;
  readonly breadcrumbDocuments: Locator;
  readonly breadcrumbCurrent: Locator;

  // ── Form fields ───────────────────────────────────────────────────────────
  readonly formHeading: Locator;
  readonly titleInput: Locator;
  readonly categoryDropdown: Locator;   // trigger wrapper (data-testid="select-category")
  readonly categoryInput: Locator;      // textbox inside trigger
  readonly descriptionInput: Locator;

  // ── Action buttons ────────────────────────────────────────────────────────
  readonly saveAsDraftButton: Locator;
  readonly submitForApprovalButton: Locator;
  readonly cancelButton: Locator;

  // ── Category label constants (ตรงกับ .ant-select-item-option-content จริง) ─
  static readonly CATEGORIES = {
    FINANCE:    'Finance (FIN)',
    HR:         'Human Resources (HR)',
    IT:         'Information Technology (IT)',
    LEGAL:      'Legal (LEGAL)',
    OPERATIONS: 'Operations (OPS)',
  } as const;

  constructor(page: Page) {
    this.page = page;

    // Breadcrumbs
    this.breadcrumbHome      = page.getByRole('link', { name: 'Home' });
    this.breadcrumbDocuments = page.getByRole('link', { name: 'Documents' });
    this.breadcrumbCurrent   = page.locator('text=Create Document').last();

    // Form
    this.formHeading      = page.locator('text=Create Document').first();
    this.titleInput       = page.getByPlaceholder('Enter document title');
    this.categoryDropdown = page.getByTestId('select-category');
    this.categoryInput    = page.getByTestId('select-category').locator('input');
    this.descriptionInput = page.getByPlaceholder('Enter document description (optional)');

    // Buttons
    this.saveAsDraftButton       = page.getByRole('button', { name: 'Save as Draft' });
    this.submitForApprovalButton = page.getByRole('button', { name: 'Submit for Approval' });
    this.cancelButton            = page.getByRole('button', { name: 'Cancel' });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto('/documents/create');
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  /**
   * เลือก Category จาก NG-ZORRO nz-select dropdown
   *
   * Options render เป็น overlay portal นอก form tree
   * selector ที่ถูกต้อง: `.ant-select-item-option-content` + hasText
   *
   * @param category  partial text ก็ได้ เช่น "Human Resources" จะ match "Human Resources (HR)"
   *                  หรือใช้ CreateDocumentPage.CATEGORIES.HR สำหรับ exact match
   */
  async selectCategory(category: string): Promise<void> {
    // 1. คลิก trigger เพื่อเปิด overlay
    await this.categoryDropdown.click();

    // 2. รอ option ปรากฏใน overlay portal
    await this.page
      .locator('.ant-select-item-option-content')
      .first()
      .waitFor({ state: 'visible', timeout: 8_000 });

    // 3. คลิก option ที่ตรงกับ text (hasText รองรับ partial match)
    await this.page
      .locator('.ant-select-item-option-content')
      .filter({ hasText: category })
      .click({ timeout: 8_000 });
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async fillForm(opts: { title: string; category: string; description?: string }): Promise<void> {
    await this.fillTitle(opts.title);
    await this.selectCategory(opts.category);
    if (opts.description) {
      await this.fillDescription(opts.description);
    }
  }

  async saveAsDraft(): Promise<void> {
    await this.saveAsDraftButton.click();
  }

  async submitForApproval(): Promise<void> {
    await this.submitForApprovalButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
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

  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/documents\/create/);
    await expect(this.titleInput).toBeVisible();
    await expect(this.categoryDropdown).toBeVisible();
    await expect(this.saveAsDraftButton).toBeVisible();
    await expect(this.submitForApprovalButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  async assertBreadcrumb(): Promise<void> {
    await expect(this.breadcrumbHome).toBeVisible();
    await expect(this.breadcrumbDocuments).toBeVisible();
  }

  /** ตรวจสอบว่า Category ที่เลือกแสดงบน trigger ถูกต้อง */
  async assertCategorySelected(label: string): Promise<void> {
    await expect(this.categoryDropdown).toContainText(label);
  }
}

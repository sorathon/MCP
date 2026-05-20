import { type Page, type Locator, expect } from '@playwright/test';

/**
 * ApprovePage — Page Object Model
 * URL: /approve
 *
 * ── Responsibilities ─────────────────────────────────────────────────────────
 * 1. Approve Documents list table — แสดงรายการเอกสารที่รอ Approve
 * 2. Approve popup/modal — แสดงรายละเอียดเอกสารและปุ่ม Approve / Cancel
 * 3. Success notification — แจ้งเตือนเมื่อ Approve สำเร็จ
 *
 * ── Selector Strategy ────────────────────────────────────────────────────────
 * - ใช้ data-testid เป็นหลัก (NG-ZORRO / Angular pattern ที่สอดคล้องกับโปรเจกต์นี้)
 * - Fallback ด้วย role/text สำหรับ element ที่ไม่มี testid
 * - Modal/Popup ของ NG-ZORRO render เป็น nz-modal ที่มี .ant-modal-content
 */
export class ApprovePage {
  readonly page: Page;

  // ── Page heading ──────────────────────────────────────────────────────────
  readonly pageHeading: Locator;

  // ── Approve Documents table ───────────────────────────────────────────────
  readonly documentsTable: Locator;
  readonly tableRows: Locator;
  readonly colDocNumber: Locator;
  readonly colCategory: Locator;
  readonly colStatus: Locator;

  // ── Approve modal (nz-modal) ──────────────────────────────────────────────
  // .ant-modal-content ครอบ header + body + footer ทั้งหมด
  readonly approveModal: Locator;
  readonly approveModalTitle: Locator;   // [FIXED] .ant-modal-title

  // ── Modal — Document detail fields ───────────────────────────────────────
  // NG-ZORRO nz-descriptions render เป็น div-based table ไม่ใช่ <table>
  // ใช้ modal body เป็น container แล้ว toContainText()
  readonly approveModalBody: Locator;
  // [ADDED] paragraph "Approving: <docNumber> - <title>" ใน modal body
  readonly approveModalDocInfo: Locator;

  // ── Modal — action buttons ────────────────────────────────────────────────
  readonly modalApproveButton: Locator;   // ปุ่ม "Approve" ใน modal footer
  readonly modalCancelButton: Locator;   // ปุ่ม "Cancel" ใน modal footer

  // ── Success notification (nz-notification หรือ nz-message) ───────────────
  // NG-ZORRO notification/message render ที่ .ant-notification-notice หรือ .ant-message-notice
  readonly successNotification: Locator;

  constructor(page: Page) {
    this.page = page;

    // Heading
    // [FIXED] live DOM shows "Pending Approvals" not "Approve Documents"
    this.pageHeading = page.getByRole('heading', { name: /Pending Approvals/i }).first();

    // Table
    this.documentsTable = page.locator('table');
    this.tableRows      = page.locator('table tbody tr');
    this.colDocNumber   = page.getByRole('columnheader', { name: /Doc Number/i });
    this.colCategory    = page.getByRole('columnheader', { name: /Category/i });
    this.colStatus      = page.getByRole('columnheader', { name: /Status/i });

    // Modal container — .ant-modal-content ครอบทุกอย่างใน modal
    this.approveModal      = page.locator('.ant-modal-content');
    // [FIXED] ใช้ .ant-modal-title (verified by live DOM crawl 2025-05-20)
    this.approveModalTitle = page.locator('.ant-modal-title');
    this.approveModalBody  = page.locator('.ant-modal-body');
    // [ADDED] paragraph ใน modal body แสดง "Approving: <docNumber> - <title>"
    this.approveModalDocInfo = page.locator('.ant-modal-body p').first();

    // Modal buttons — อยู่ใน .ant-modal-footer
    // ใช้ role + name เพื่อ distinguish จากปุ่มบนหน้าหลัก
    this.modalApproveButton = page
      .locator('.ant-modal-footer')
      .getByRole('button', { name: /^Approve$/i });
    this.modalCancelButton = page
      .locator('.ant-modal-footer')
      .getByRole('button', { name: /Cancel/i });

    // Success notification — NG-ZORRO renders ที่ portal นอก component tree
    this.successNotification = page
      .locator('.ant-notification-notice, .ant-message-notice')
      .first();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto('/approve');
  }

  // ── Table Actions ─────────────────────────────────────────────────────────

  /**
   * กดปุ่ม "Approve" ที่ row ซึ่ง Doc Number ตรงกับ docNumber
   * หาก row ไม่พบใน current page ให้ throw error ชัดเจน
   */
  async clickApproveForDocument(docNumber: string): Promise<void> {
    // หา row ที่มี docNumber แล้วกดปุ่ม Approve ใน row นั้น
    const targetRow = this.page
      .locator('table tbody tr')
      .filter({ hasText: docNumber });

    await expect(targetRow).toBeVisible({ timeout: 10_000 });
    await targetRow.getByRole('button', { name: /^Approve$/i }).click();
  }

  // ── Modal Actions ─────────────────────────────────────────────────────────

  /** รอจนกว่า modal จะปรากฏ */
  async waitForModalVisible(): Promise<void> {
    await expect(this.approveModal).toBeVisible({ timeout: 10_000 });
  }

  /** กดปุ่ม Approve ภายใน modal */
  async confirmApprove(): Promise<void> {
    await this.modalApproveButton.click();
  }

  /** กดปุ่ม Cancel ภายใน modal */
  async cancelApprove(): Promise<void> {
    await this.modalCancelButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** ตรวจสอบว่าอยู่หน้า /approve แล้ว และ table แสดงผล */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/approve/);
    await expect(this.pageHeading).toBeVisible();
    await expect(this.documentsTable).toBeVisible();
  }

  /** ตรวจสอบว่า modal เปิดขึ้นมาและหัว modal ถูกต้อง */
  async assertModalVisible(): Promise<void> {
    await expect(this.approveModal).toBeVisible({ timeout: 10_000 });
    await expect(this.approveModalTitle).toBeVisible();
  }

  /** ตรวจสอบว่า modal body มี Doc Number ที่ถูกต้อง */
  async assertModalDocNumber(docNumber: string): Promise<void> {
    await expect(this.approveModalBody).toContainText(docNumber, { timeout: 8_000 });
  }

  /** ตรวจสอบว่า modal body มี Category ที่ถูกต้อง */
  async assertModalCategory(category: string): Promise<void> {
    await expect(this.approveModalBody).toContainText(category, { timeout: 8_000 });
  }

  /** ตรวจสอบ modal body ครอบคลุมทั้ง docNumber และ category ในครั้งเดียว */
  async assertModalDocumentData(docNumber: string, category: string): Promise<void> {
    await this.assertModalDocNumber(docNumber);
    await this.assertModalCategory(category);
  }

  /** ตรวจสอบว่าปุ่ม Approve และ Cancel ใน modal พร้อมใช้งาน */
  async assertModalButtonsVisible(): Promise<void> {
    await expect(this.modalApproveButton).toBeVisible();
    await expect(this.modalCancelButton).toBeVisible();
  }

  /**
   * ตรวจสอบ success notification หลัง Approve
   * รองรับทั้ง nz-notification และ nz-message
   */
  async assertSuccessNotification(docNumber?: string): Promise<void> {
    await expect(this.successNotification).toBeVisible({ timeout: 15_000 });
    if (docNumber) {
      await expect(this.successNotification).toContainText(docNumber, { timeout: 10_000 });
    }
  }
}

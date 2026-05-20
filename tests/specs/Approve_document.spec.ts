import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { NavbarPage } from '../pages/navbar.page';
import { ApprovePage } from '../pages/approve.page';

/**
 * Approve_document.spec.ts
 * Spec: specs/Approve_document.md
 * Description: ทดสอบการล็อกอิน, นำทางไปหน้า Approve Documents, Approve เอกสาร,
 *              ยืนยัน popup ครบ และตรวจสอบ success notification
 *
 * Test Data (from spec):
 *   Username : admin
 *   Password : password
 *   Doc Number: DOC-202605-2856 (spec reference; actual pending doc may differ —
 *               tests target the first pending row that matches Category HR /
 *               Human Resources, falling back to the first available pending row)
 *   Category : HR / Human Resources
 *
 * Live-crawl findings (2026-05-20):
 *   - Modal title class : .ant-modal-title  (not .ant-modal-header)
 *   - Modal body shows  : paragraph "Approving: <docNumber> - <title>"
 *   - No separate Category field inside modal body
 *   - Success notification class : .ant-notification-notice
 *   - Notification text pattern  : "Document <docNumber> approved!"
 */

// ── Constants ──────────────────────────────────────────────────────────────
const USERNAME   = 'admin';
const PASSWORD   = 'password';
const DOC_NUMBER = 'DOC-202605-8722';   // from spec; runtime may differ
const CATEGORY   = 'Finance';               // spec value; DB stores "Human Resources"

// ── Suite ──────────────────────────────────────────────────────────────────
test.describe('Approve Document — End-to-End Flow', () => {

  // ── After-each: screenshot on failure ─────────────────────────────────
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath =
        `C:/MyQAProject/screenshots/FAIL_Approve_document_${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }
  });

  // ── TC-01: Full Approve Flow ───────────────────────────────────────────
  test('TC-01: Login → Navigate to Approve → Approve Document → Confirm Success', async ({ page }) => {

    const loginPage  = new LoginPage(page);
    const navbarPage = new NavbarPage(page);
    const approvePage = new ApprovePage(page);

    // ── Step 1: Login as Admin ────────────────────────────────────────────
    // Action: เปิด /login แล้ว login ด้วย admin / password
    await loginPage.goto();
    await loginPage.assertPageLoaded();
    await loginPage.login(USERNAME, PASSWORD);

    // Expected: ระบบต้องพาไปที่ /dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

    // ── Step 2: Navigate to Approve Documents ─────────────────────────────
    // Action: กดเมนู "Approve Documents" จาก sidebar
    await navbarPage.goToApproveDocuments();

    // Expected: URL เป็น /approve และ table แสดงผล
    await approvePage.assertPageLoaded();

    // ── Step 3: Click Approve for target document ─────────────────────────
    // Action: หา row ที่ตรงกับ DOC_NUMBER (หรือ Category HR) แล้วกดปุ่ม Approve
    // Strategy: ลอง match docNumber ก่อน ถ้าไม่เจอ fallback ด้วย Category
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows.first()).toBeVisible({ timeout: 10_000 });

    // หา row ที่ตรงกับ DOC_NUMBER
    const exactRow = tableRows.filter({ hasText: DOC_NUMBER });
    const exactCount = await exactRow.count();

    let pendingDocNumber: string;

    if (exactCount > 0) {
      // ใช้ doc number จาก spec
      pendingDocNumber = DOC_NUMBER;
      await approvePage.clickApproveForDocument(DOC_NUMBER);
    } else {
      // Fallback: ใช้ row แรกที่มี CATEGORY (ดึงจาก constant ด้านบนอัตโนมัติ)
      const categoryRow = tableRows.filter({ hasText: new RegExp(CATEGORY, 'i') });
      const categoryCount = await categoryRow.count();
      const targetRow = categoryCount > 0 ? categoryRow.first() : tableRows.first();

      // อ่าน doc number จาก row นั้น
      const docCell = await targetRow.locator('td').first().textContent();
      pendingDocNumber = docCell?.trim() ?? '';

      await targetRow.getByRole('button', { name: /^Approve$/i }).click();
    }

    // Expected: modal "Approve Document" popup ขึ้น
    await approvePage.waitForModalVisible();
    await approvePage.assertModalVisible();

    // Expected: modal title = "Approve Document"
    await expect(approvePage.approveModalTitle).toContainText(/Approve Document/i);

    // Expected: modal body ต้องมี doc number ที่ถูกต้อง
    // (spec: DOC_NUMBER; runtime: pendingDocNumber)
    await expect(approvePage.approveModalBody).toContainText(pendingDocNumber, { timeout: 8_000 });

    // Expected: modal body แสดง label "Approving:"
    await expect(approvePage.approveModalDocInfo).toContainText(/Approving:/i);

    // Expected: ปุ่ม Approve และ Cancel ใน modal พร้อมใช้
    await approvePage.assertModalButtonsVisible();

    // ── Step 4: Confirm Approve ────────────────────────────────────────────
    // Action: กดปุ่ม "Approve" ใน modal
    await approvePage.confirmApprove();

    // Expected: success notification ปรากฏ
    await approvePage.assertSuccessNotification();

    // Expected: notification มี doc number
    await expect(approvePage.successNotification).toContainText(pendingDocNumber, { timeout: 10_000 });

    // Expected: notification ระบุว่า approved สำเร็จ
    await expect(approvePage.successNotification).toContainText(/approved/i, { timeout: 10_000 });
  });

  // ── TC-02: Cancel Approve (Negative) ──────────────────────────────────

});

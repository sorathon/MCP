import { test, expect } from '@playwright/test';
import { LoginPage }          from '../pages/login.page';
import { DashboardPage }      from '../pages/dashboard.page';
import { NavbarPage }         from '../pages/navbar.page';
import { ApprovePage }        from '../pages/approve.page';
import { DocumentDetailPage } from '../pages/document-detail.page';

// ── Test Data ──────────────────────────────────────────────────────────────
const USER = {
  username: 'admin',
  password: 'password',
} as const;

const DOC = {
  number:   'DOC-202605-2856',
  category: 'HR',
} as const;

// ── Test Suite ─────────────────────────────────────────────────────────────
test.describe('End-to-End Approve Document Flow', () => {

  // ── afterEach: screenshot on failure ──────────────────────────────────────
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotName = `FAIL_${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const screenshotPath = `C:/MyQAProject/screenshots/${screenshotName}`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      testInfo.attachments.push({
        name:      screenshotName,
        path:      screenshotPath,
        contentType: 'image/png',
      });
    }
  });

  // ── TC-01: Login as Admin ────────────────────────────────────────────────
  test('TC-01 Step 1: Login as Admin and redirect to /dashboard', async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Action: เปิดหน้า /login และ login ด้วย Test Data
    await loginPage.goto();
    await loginPage.assertPageLoaded();
    await loginPage.login(USER.username, USER.password);

    // Expected: ระบบต้องพาไปที่หน้า Dashboard (/dashboard)
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await dashboardPage.assertPageLoaded();
  });

  // ── TC-02: Navigate to Approve Documents ────────────────────────────────
  test('TC-02 Step 2: Navigate to Approve Documents page via sidebar menu', async ({ page }) => {
    const loginPage  = new LoginPage(page);
    const navbarPage = new NavbarPage(page);
    const approvePage = new ApprovePage(page);

    // Pre-condition: Login ก่อน
    await loginPage.goto();
    await loginPage.login(USER.username, USER.password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

    // Action: กดเมนู "Approve Documents" จาก sidebar
    await navbarPage.goToApproveDocuments();

    // Expected: ระบบพาเข้าสู่หน้า /approve
    await expect(page).toHaveURL(/\/approve/, { timeout: 15_000 });
    await approvePage.assertPageLoaded();
  });

  // ── TC-03: Open Approve popup and verify document data ──────────────────
  test('TC-03 Step 3: Click Approve button opens popup with correct Document Data', async ({ page }) => {
    const loginPage   = new LoginPage(page);
    const navbarPage  = new NavbarPage(page);
    const approvePage = new ApprovePage(page);

    // Pre-condition: Login → Navigate to /approve
    await loginPage.goto();
    await loginPage.login(USER.username, USER.password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await navbarPage.goToApproveDocuments();
    await expect(page).toHaveURL(/\/approve/, { timeout: 15_000 });

    // Action: กดปุ่ม "Approve" ที่ row ซึ่งตรงกับ DOC.number
    await approvePage.clickApproveForDocument(DOC.number);

    // Expected: popup "Approve Document" ต้องขึ้นมา
    await approvePage.assertModalVisible();

    // Expected: รายละเอียดใน popup ต้องตรงกับ Document Data
    // - Doc Number = DOC-202605-2856
    await approvePage.assertModalDocNumber(DOC.number);
    // - Category = HR
    await approvePage.assertModalCategory(DOC.category);
    // - ปุ่ม Approve และ Cancel ใน modal ต้องพร้อมใช้งาน
    await approvePage.assertModalButtonsVisible();
  });

  // ── TC-04: Confirm Approve and verify success notification ──────────────
  test('TC-04 Step 4: Confirm Approve in popup shows success notification with Doc Number', async ({ page }) => {
    const loginPage          = new LoginPage(page);
    const navbarPage         = new NavbarPage(page);
    const approvePage        = new ApprovePage(page);
    const documentDetailPage = new DocumentDetailPage(page);

    // Pre-condition: Login → Navigate to /approve → Open modal
    await loginPage.goto();
    await loginPage.login(USER.username, USER.password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await navbarPage.goToApproveDocuments();
    await expect(page).toHaveURL(/\/approve/, { timeout: 15_000 });
    await approvePage.clickApproveForDocument(DOC.number);
    await approvePage.waitForModalVisible();

    // Action: กดปุ่ม "Approve" ใน popup
    await approvePage.confirmApprove();

    // Expected: แจ้งเตือน Approve สำเร็จขึ้น และมี Doc Number ใน notification
    await approvePage.assertSuccessNotification(DOC.number);

    // Expected: navigate ไปที่ /documents/:id และข้อมูลตรงตาม Doc Number
    await expect(page).toHaveURL(/\/documents\/\w+/, { timeout: 15_000 });
    await documentDetailPage.assertDocumentNumber(DOC.number);

    // ตรวจสอบ Approval History ว่ามี "APPROVE" action ถูกบันทึก
    await documentDetailPage.assertApprovalHistoryContains('APPROVE');
  });

  // ── Full E2E: ทุก Step ต่อเนื่องในเทสเดียว ───────────────────────────────
  test('E2E: Full Approve Document flow — Login → Navigate → Popup verify → Confirm', async ({ page }) => {
    const loginPage          = new LoginPage(page);
    const dashboardPage      = new DashboardPage(page);
    const navbarPage         = new NavbarPage(page);
    const approvePage        = new ApprovePage(page);
    const documentDetailPage = new DocumentDetailPage(page);

    // ── Step 1: Login ──────────────────────────────────────────────────────
    await loginPage.goto();
    await loginPage.assertPageLoaded();
    await loginPage.login(USER.username, USER.password);

    // Expected Step 1: อยู่หน้า /dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await dashboardPage.assertPageLoaded();

    // ── Step 2: Navigate to Approve ────────────────────────────────────────
    await navbarPage.goToApproveDocuments();

    // Expected Step 2: อยู่หน้า /approve
    await expect(page).toHaveURL(/\/approve/, { timeout: 15_000 });
    await approvePage.assertPageLoaded();

    // ── Step 3: คลิก Approve → popup ──────────────────────────────────────
    await approvePage.clickApproveForDocument(DOC.number);

    // Expected Step 3: popup "Approve Document" ขึ้นและข้อมูลตรงกับ Document Data
    await approvePage.assertModalVisible();
    await approvePage.assertModalDocNumber(DOC.number);
    await approvePage.assertModalCategory(DOC.category);
    await approvePage.assertModalButtonsVisible();

    // ── Step 4: Confirm Approve ────────────────────────────────────────────
    await approvePage.confirmApprove();

    // Expected Step 4: success notification มี Doc Number
    await approvePage.assertSuccessNotification(DOC.number);

    // Expected Step 4: redirect → /documents/:id และข้อมูลตรงตาม Doc Number
    await expect(page).toHaveURL(/\/documents\/\w+/, { timeout: 15_000 });
    await documentDetailPage.assertDocumentNumber(DOC.number);
    await documentDetailPage.assertApprovalHistoryContains('APPROVE');
  });
});

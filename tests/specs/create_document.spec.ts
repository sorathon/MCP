/**
 * Test Suite : End-to-End Create Document Flow
 * Spec File  : specs/create_document_flow.md
 *
 * Pre-conditions:
 *  - App running at http://localhost:4200
 *  - Credentials : maker1 / password
 *  - Document    : Title = "รายงานประจำเดือน"
 *                  Category = "Human Resources (HR)"  ← label จริงใน NG-ZORRO dropdown
 *
 * ⚠️  Spec Notes:
 *  1. Category ใน spec ระบุว่า "HR" → label จริงใน UI คือ "Human Resources (HR)"
 *  2. Status ใน Step 5 มี typo "PEDING" → assert ด้วย "PENDING" ค่าจริงจาก app
 *  3. หลัง Submit for Approval → app redirect ไป /documents (list) ไม่ใช่ /documents/:id
 *     เอกสารใหม่อยู่ row แรกของตาราง (sort ล่าสุดก่อน) → Step 5 คลิก link เข้า detail เอง
 */

import { test, expect } from '@playwright/test';

// ── Page Object imports ──────────────────────────────────────────────────────
import { LoginPage }          from '../pages/login.page';
import { NavbarPage }         from '../pages/navbar.page';
import { DocumentsListPage }  from '../pages/documents-list.page';
import { CreateDocumentPage } from '../pages/create-document.page';
import { DocumentDetailPage } from '../pages/document-detail.page';

// ── Helper imports ───────────────────────────────────────────────────────────
import { TEST_USERS }     from './helpers/auth.helper';
import { takeScreenshot } from './helpers/screenshot.helper';

// ── Test Data ────────────────────────────────────────────────────────────────
const USER         = TEST_USERS.maker1;
const DOC_TITLE    = 'รายงานประจำเดือน';
const DOC_CATEGORY = CreateDocumentPage.CATEGORIES.HR;  // 'Human Resources (HR)'

// ─────────────────────────────────────────────────────────────────────────────
test.describe('End-to-End Create Document Flow', () => {

  // ── afterEach: screenshot on failure ─────────────────────────────────────
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const safeName = testInfo.title.replace(/\W+/g, '_');
      await takeScreenshot(page, `FAILED_${safeName}`);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  test(
    'TC-CD-001 : ล็อกอิน → สร้างเอกสาร → ตรวจสอบ Document Detail',
    async ({ page }) => {

      const loginPage         = new LoginPage(page);
      const navbar            = new NavbarPage(page);
      const documentsListPage = new DocumentsListPage(page);
      const createDocPage     = new CreateDocumentPage(page);
      const detailPage        = new DocumentDetailPage(page);

      // ════════════════════════════════════════════════════════════════════
      // STEP 1 : Login
      // Expected: redirect ไป /dashboard
      // ════════════════════════════════════════════════════════════════════
      await test.step('Step 1 — Login with maker1', async () => {
        await loginPage.goto();
        await loginPage.assertPageLoaded();
        await loginPage.login(USER.username, USER.password);

        // ✅ URL เปลี่ยนไป /dashboard หลัง login สำเร็จ
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
        // ✅ ออกจาก /login แล้ว
        await expect(page).not.toHaveURL(/\/login/);

        await takeScreenshot(page, 'step1_login_success');
      });

      // ════════════════════════════════════════════════════════════════════
      // STEP 2 : Navigate to My Documents
      // Expected: URL = /documents, ตาราง + headers ปรากฏ
      // ════════════════════════════════════════════════════════════════════
      await test.step('Step 2 — Navigate to My Documents via Sidebar', async () => {
        await navbar.goToMyDocuments();

        // ✅ URL เปลี่ยนไป /documents
        await expect(page).toHaveURL(/\/documents$/, { timeout: 8_000 });
        // ✅ Heading "My Documents" ปรากฏ
        await expect(documentsListPage.pageHeading).toBeVisible();
        // ✅ ตาราง Documents ปรากฏ
        await expect(documentsListPage.documentsTable).toBeVisible();
        // ✅ Column headers ครบ
        await documentsListPage.assertTableHeaders();

        await takeScreenshot(page, 'step2_documents_list');
      });

      // ════════════════════════════════════════════════════════════════════
      // STEP 3 : Click Create Document
      // Expected: URL = /documents/create, form โหลดสำเร็จ
      // ════════════════════════════════════════════════════════════════════
      await test.step('Step 3 — Click Create Document button', async () => {
        await documentsListPage.clickCreateDocument();

        // ✅ URL เปลี่ยนไป /documents/create
        await expect(page).toHaveURL(/\/documents\/create/, { timeout: 8_000 });
        // ✅ Form fields ครบ (Title, Buttons)
        await createDocPage.assertPageLoaded();
        // ✅ Breadcrumb Home → Documents ปรากฏ
        await createDocPage.assertBreadcrumb();
        // ✅ ปุ่ม Submit for Approval ปรากฏและ enabled
        await expect(createDocPage.submitForApprovalButton).toBeVisible();
        await expect(createDocPage.submitForApprovalButton).toBeEnabled();

        await takeScreenshot(page, 'step3_create_document_form');
      });

      // ════════════════════════════════════════════════════════════════════
      // STEP 4 : Fill Form and Submit for Approval
      // Actual behavior (ยืนยันจาก live crawl):
      //   หลัง Submit → app redirect ไป /documents (list) ไม่ใช่ /documents/:id
      //   เอกสารใหม่จะอยู่ที่ row แรกสุดของตาราง (sort ล่าสุดก่อน)
      // ════════════════════════════════════════════════════════════════════
      await test.step('Step 4 — Fill form and Submit for Approval', async () => {
        // กรอก Title
        await createDocPage.fillTitle(DOC_TITLE);
        // ✅ Title input มีค่าที่กรอก
        await expect(createDocPage.titleInput).toHaveValue(DOC_TITLE);

        // เลือก Category จาก NG-ZORRO nz-select (.ant-select-item-option-content)
        await createDocPage.selectCategory(DOC_CATEGORY);
        // ✅ Dropdown trigger แสดง "Human Resources" หลังเลือก
        await createDocPage.assertCategorySelected('Human Resources');

        await takeScreenshot(page, 'step4_form_filled');

        // กด Submit for Approval
        await createDocPage.submitForApproval();

        // ✅ ออกจากหน้า /create แล้ว
        await expect(page).not.toHaveURL(/\/documents\/create/, { timeout: 10_000 });

        // ✅ app redirect ไป /documents (list) — verified actual behavior
        await expect(page).toHaveURL(/\/documents$/, { timeout: 10_000 });

        // ✅ ตาราง Documents list โหลดสำเร็จ
        await expect(documentsListPage.documentsTable).toBeVisible();

        // ✅ row แรกคือเอกสารที่เพิ่งสร้าง (Title + Status + Category ตรง)
        const firstRow = page.locator('table tbody tr').first();
        await expect(firstRow).toContainText(DOC_TITLE);
        await expect(firstRow).toContainText('PENDING');
        await expect(firstRow).toContainText('Human Resources');

        await takeScreenshot(page, 'step4_after_submit');
      });

      // ════════════════════════════════════════════════════════════════════
      // STEP 5 : Navigate to Document Detail and verify
      // Action  : คลิก Doc Number link ของ row แรก (เอกสารที่เพิ่งสร้าง)
      // Expected: Title = "รายงานประจำเดือน", Status = "PENDING"
      //           (⚠️ spec เขียน "PEDING" → typo → ใช้ "PENDING")
      // ════════════════════════════════════════════════════════════════════
      await test.step('Step 5 — Open Document Detail and verify', async () => {
        // คลิก Doc Number link ของ row แรก → เข้า /documents/:id
        const firstRowDocLink = page.locator('table tbody tr').first().getByRole('link');
        await firstRowDocLink.click();

        // ✅ URL เปลี่ยนไป /documents/<numeric id>
        await expect(page).toHaveURL(/\/documents\/\d+/, { timeout: 8_000 });

        // ✅ Info table ปรากฏ
        await expect(detailPage.documentInfoTable).toBeVisible({ timeout: 8_000 });
        // ✅ Approval History section ปรากฏ
        await expect(detailPage.approvalHistorySection).toBeVisible();
        // ✅ Stepper (Draft → Pending Approval → Approved) ปรากฏ
        await detailPage.assertStepperVisible();
        // ✅ Title = "รายงานประจำเดือน"
        await detailPage.assertTitle(DOC_TITLE);
        // ✅ Status = "PENDING" (spec typo: "PEDING")
        await detailPage.assertStatus('PENDING');
        // ✅ Category แสดง "Human Resources"
        await detailPage.assertCategory('Human Resources');
        // ✅ Created By = "John Maker"
        await detailPage.assertCreatedBy(USER.displayName!);
        // ✅ Approval History มี SUBMIT action
        await detailPage.assertApprovalHistoryContains('SUBMIT');

        await takeScreenshot(page, 'step5_document_detail_verified');
      });
    },
  );

});

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Approve_document.spec.ts >> Approve Document — End-to-End Flow >> TC-02: Login → Navigate to Approve → Open Modal → Cancel (modal closes)
- Location: tests\specs\Approve_document.spec.ts:130:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('table')

```

```yaml
- text: DocApproval
- list:
  - listitem: Dashboard
  - listitem: Approve Documents
  - listitem: Document Tracking
  - listitem:
    - text: Master Data
    - list:
      - listitem: Categories
- text: ADMIN System Admin
- heading "Pending Approvals" [level=2]
- button "Refresh"
- img
- paragraph: No documents pending approval
```

# Test source

```ts
  32  |   readonly approveModal: Locator;
  33  |   readonly approveModalTitle: Locator;   // [FIXED] .ant-modal-title
  34  | 
  35  |   // ── Modal — Document detail fields ───────────────────────────────────────
  36  |   // NG-ZORRO nz-descriptions render เป็น div-based table ไม่ใช่ <table>
  37  |   // ใช้ modal body เป็น container แล้ว toContainText()
  38  |   readonly approveModalBody: Locator;
  39  |   // [ADDED] paragraph "Approving: <docNumber> - <title>" ใน modal body
  40  |   readonly approveModalDocInfo: Locator;
  41  | 
  42  |   // ── Modal — action buttons ────────────────────────────────────────────────
  43  |   readonly modalApproveButton: Locator;   // ปุ่ม "Approve" ใน modal footer
  44  |   readonly modalCancelButton: Locator;   // ปุ่ม "Cancel" ใน modal footer
  45  | 
  46  |   // ── Success notification (nz-notification หรือ nz-message) ───────────────
  47  |   // NG-ZORRO notification/message render ที่ .ant-notification-notice หรือ .ant-message-notice
  48  |   readonly successNotification: Locator;
  49  | 
  50  |   constructor(page: Page) {
  51  |     this.page = page;
  52  | 
  53  |     // Heading
  54  |     // [FIXED] live DOM shows "Pending Approvals" not "Approve Documents"
  55  |     this.pageHeading = page.getByRole('heading', { name: /Pending Approvals/i }).first();
  56  | 
  57  |     // Table
  58  |     this.documentsTable = page.locator('table');
  59  |     this.tableRows      = page.locator('table tbody tr');
  60  |     this.colDocNumber   = page.getByRole('columnheader', { name: /Doc Number/i });
  61  |     this.colCategory    = page.getByRole('columnheader', { name: /Category/i });
  62  |     this.colStatus      = page.getByRole('columnheader', { name: /Status/i });
  63  | 
  64  |     // Modal container — .ant-modal-content ครอบทุกอย่างใน modal
  65  |     this.approveModal      = page.locator('.ant-modal-content');
  66  |     // [FIXED] ใช้ .ant-modal-title (verified by live DOM crawl 2025-05-20)
  67  |     this.approveModalTitle = page.locator('.ant-modal-title');
  68  |     this.approveModalBody  = page.locator('.ant-modal-body');
  69  |     // [ADDED] paragraph ใน modal body แสดง "Approving: <docNumber> - <title>"
  70  |     this.approveModalDocInfo = page.locator('.ant-modal-body p').first();
  71  | 
  72  |     // Modal buttons — อยู่ใน .ant-modal-footer
  73  |     // ใช้ role + name เพื่อ distinguish จากปุ่มบนหน้าหลัก
  74  |     this.modalApproveButton = page
  75  |       .locator('.ant-modal-footer')
  76  |       .getByRole('button', { name: /^Approve$/i });
  77  |     this.modalCancelButton = page
  78  |       .locator('.ant-modal-footer')
  79  |       .getByRole('button', { name: /Cancel/i });
  80  | 
  81  |     // Success notification — NG-ZORRO renders ที่ portal นอก component tree
  82  |     this.successNotification = page
  83  |       .locator('.ant-notification-notice, .ant-message-notice')
  84  |       .first();
  85  |   }
  86  | 
  87  |   // ── Navigation ────────────────────────────────────────────────────────────
  88  | 
  89  |   async goto(): Promise<void> {
  90  |     await this.page.goto('/approve');
  91  |   }
  92  | 
  93  |   // ── Table Actions ─────────────────────────────────────────────────────────
  94  | 
  95  |   /**
  96  |    * กดปุ่ม "Approve" ที่ row ซึ่ง Doc Number ตรงกับ docNumber
  97  |    * หาก row ไม่พบใน current page ให้ throw error ชัดเจน
  98  |    */
  99  |   async clickApproveForDocument(docNumber: string): Promise<void> {
  100 |     // หา row ที่มี docNumber แล้วกดปุ่ม Approve ใน row นั้น
  101 |     const targetRow = this.page
  102 |       .locator('table tbody tr')
  103 |       .filter({ hasText: docNumber });
  104 | 
  105 |     await expect(targetRow).toBeVisible({ timeout: 10_000 });
  106 |     await targetRow.getByRole('button', { name: /^Approve$/i }).click();
  107 |   }
  108 | 
  109 |   // ── Modal Actions ─────────────────────────────────────────────────────────
  110 | 
  111 |   /** รอจนกว่า modal จะปรากฏ */
  112 |   async waitForModalVisible(): Promise<void> {
  113 |     await expect(this.approveModal).toBeVisible({ timeout: 10_000 });
  114 |   }
  115 | 
  116 |   /** กดปุ่ม Approve ภายใน modal */
  117 |   async confirmApprove(): Promise<void> {
  118 |     await this.modalApproveButton.click();
  119 |   }
  120 | 
  121 |   /** กดปุ่ม Cancel ภายใน modal */
  122 |   async cancelApprove(): Promise<void> {
  123 |     await this.modalCancelButton.click();
  124 |   }
  125 | 
  126 |   // ── Assertions ────────────────────────────────────────────────────────────
  127 | 
  128 |   /** ตรวจสอบว่าอยู่หน้า /approve แล้ว และ table แสดงผล */
  129 |   async assertPageLoaded(): Promise<void> {
  130 |     await expect(this.page).toHaveURL(/\/approve/);
  131 |     await expect(this.pageHeading).toBeVisible();
> 132 |     await expect(this.documentsTable).toBeVisible();
      |                                       ^ Error: expect(locator).toBeVisible() failed
  133 |   }
  134 | 
  135 |   /** ตรวจสอบว่า modal เปิดขึ้นมาและหัว modal ถูกต้อง */
  136 |   async assertModalVisible(): Promise<void> {
  137 |     await expect(this.approveModal).toBeVisible({ timeout: 10_000 });
  138 |     await expect(this.approveModalTitle).toBeVisible();
  139 |   }
  140 | 
  141 |   /** ตรวจสอบว่า modal body มี Doc Number ที่ถูกต้อง */
  142 |   async assertModalDocNumber(docNumber: string): Promise<void> {
  143 |     await expect(this.approveModalBody).toContainText(docNumber, { timeout: 8_000 });
  144 |   }
  145 | 
  146 |   /** ตรวจสอบว่า modal body มี Category ที่ถูกต้อง */
  147 |   async assertModalCategory(category: string): Promise<void> {
  148 |     await expect(this.approveModalBody).toContainText(category, { timeout: 8_000 });
  149 |   }
  150 | 
  151 |   /** ตรวจสอบ modal body ครอบคลุมทั้ง docNumber และ category ในครั้งเดียว */
  152 |   async assertModalDocumentData(docNumber: string, category: string): Promise<void> {
  153 |     await this.assertModalDocNumber(docNumber);
  154 |     await this.assertModalCategory(category);
  155 |   }
  156 | 
  157 |   /** ตรวจสอบว่าปุ่ม Approve และ Cancel ใน modal พร้อมใช้งาน */
  158 |   async assertModalButtonsVisible(): Promise<void> {
  159 |     await expect(this.modalApproveButton).toBeVisible();
  160 |     await expect(this.modalCancelButton).toBeVisible();
  161 |   }
  162 | 
  163 |   /**
  164 |    * ตรวจสอบ success notification หลัง Approve
  165 |    * รองรับทั้ง nz-notification และ nz-message
  166 |    */
  167 |   async assertSuccessNotification(docNumber?: string): Promise<void> {
  168 |     await expect(this.successNotification).toBeVisible({ timeout: 15_000 });
  169 |     if (docNumber) {
  170 |       await expect(this.successNotification).toContainText(docNumber, { timeout: 10_000 });
  171 |     }
  172 |   }
  173 | }
  174 | 
```
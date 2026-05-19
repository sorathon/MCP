# Test Name: End-to-End Create Document Flow
**Description:** ทดสอบการล็อกอิน, นำทางไปหน้าเอกสาร, สร้างเอกสารใหม่ และตรวจสอบผลลัพธ์

## Pre-conditions
- ใช้ไฟล์หน้าเว็บ (POM) จากโฟลเดอร์ `tests/pages/` ที่มีอยู่แล้วเท่านั้น
- ข้อมูล Test Data: Username = `maker1`, Password = `password`
- ข้อมูล Document Data: Document Title = `รายงานประจำเดือน`, Category = `HR`

## Test Steps & Expected Results

**Step 1: Login**
- Action: เปิดหน้าเว็บ ไปที่ `/login` และทำการล็อกอินด้วย Test Data
- POM: `LoginPage`
- Expected: ระบบต้องพาไปที่หน้า Dashboard (`/dashboard`)

**Step 2: Navigate to Documents**
- Action: กดเมนู "My Documents" จากแถบเมนูด้านข้าง/ด้านบน
- Expected: ระบบพาเข้าสู่หน้า Documents List (`/documents`)

**Step 3: Click Create New**
- Action: กดปุ่ม "Create Document" 
- Expected: ระบบพาเข้าสู่หน้าฟอร์มสร้างเอกสาร (`/documents/create`)

**Step 4: Fill and Submit Form**
- Action: กรอก Document Title และเลือก Category ตาม Test Data จากนั้นกดปุ่ม "Submit for Approval"
- Expected: ฟอร์มถูกส่งสำเร็จ และระบบพาไปที่หน้า Document Detail ของเอกสารที่เพิ่งสร้าง (`/documents/:id`)

**Step 5: Verify Document Details**
- Action: ตรวจสอบข้อมูลในหน้ารายละเอียดเอกสาร
- POM: `DocumentDetailPage`
- Expected: หน้าเว็บต้องแสดง  Title ว่า `รายงานประจำเดือน` ได้อย่างถูกต้อง เเละขึ้น Status เป็น "PEDING"
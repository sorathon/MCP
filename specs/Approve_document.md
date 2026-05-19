# Test Name: End-to-End Create Document Flow
**Description:** ทดสอบการล็อกอิน, นำทางไปหน้าเอกสาร, สร้างเอกสารใหม่ และตรวจสอบผลลัพธ์

## Pre-conditions
- ใช้ไฟล์หน้าเว็บ (POM) จากโฟลเดอร์ `tests/pages/` ที่มีอยู่แล้วเท่านั้น
- ข้อมูล Test Data: Username = `admin`, Password = `password`
- ข้อมูล Document Data: Doc Number = `DOC-202605-2856`, Category = `HR`

## Test Steps & Expected Results

**Step 1: Login as Admin**
- Action: เปิดหน้าเว็บ ไปที่ `/login` และทำการล็อกอินด้วย Test Data
- Expected: ระบบต้องพาไปที่หน้า Dashboard (`/dashboard`)

**Step 2: Navigate to Approve**
- Action: กดเมนู "Approve Documents" จากแถบเมนูด้านข้าง/ด้านบน
- Expected: ระบบพาเข้าสู่หน้า approve (`/approve`)

**Step 3: Approve Document frist**
- Action: ดูรายละเอีดตาม Document Data เเล้วกดปุ่ม "Approve" ตามข้อมูลที่ตรงกับ Document Data 
- Expected: -ขึ้น pop-up Approve Document เเล้วรายละเอียดข้อมูลต้องตรงกับ Document Data

**Step 4: Comfrim Document Approve**
- Action: กดปุ่ม "Approve" ในหน้า pop-ud "Approve Document"
- Expected: ขึ้นเเจ้งเตอนว่า Approve สำเร็จ ข้อมูลตรงตาม Doc number(`/documents/:id`)


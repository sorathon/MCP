# Test Spec: Employee Creation & Search Flow (OrangeHRM)
**URL:** http://localhost:5173/

---

## Case 01: Test conceptsMCP
**Description:** ทดสอบ

* **Step 1:** กรอก USERNAME : `sorathon` เเล้วกดปุ่ม login
    * *Expected:* ขึ้นข้อความเเจ้งเตือนว่า `เข้าระบบสำเร็จ`
* **Step 2:** จองรถ เลือกประเภทรถ "SUV" เเล้วกดปุ่ม "ยืนยันการจอง" 
    * *Expected:* ขึ้น รหัสการจอง (เช่น CAR-2308)
* **Step 3:** คัดลอง รหัสการจองที่ได้ ไปใส่ช่อง "กรอกรหัสจองเพื่อค้นหา"
    * *Expected:* มีข้อความขึ้นบนหน้าจอว่า "พบข้อมูล: สถานะรอยืนยัน"

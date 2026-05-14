# Test Spec: Employee Creation & Search Flow (OrangeHRM)
**URL:** https://opensource-demo.orangehrmlive.com/

---

## Case 01: Create and Verify New Employee
**Description:** สร้างพนักงานใหม่ จำชื่อไว้ และนำไปค้นหาในระบบเพื่อยืนยันข้อมูล

* **Step 1:** เข้าสู่ระบบด้วย Admin / admin123
    * *Expected:* เข้าสู่หน้า Dashboard สำเร็จ
* **Step 2:** ไปที่เมนู "PIM" และคลิกปุ่ม "Add Employee"
    * *Expected:* ปรากฏฟอร์มให้กรอกชื่อพนักงาน
* **Step 3:** กรอก First Name: `Automationsss`, Last Name: `Testersss` (และจดจำชื่อนี้ไว้)
    * *Expected:* ข้อมูลถูกกรอกครบถ้วน
* **Step 4:** คลิก "Save" และ **รอจนกว่าระบบจะบันทึกสำเร็จ**
    * *Expected:* ระบบนำไปที่หน้า Personal Details ของพนักงานที่เพิ่งสร้าง
* **Step 5:** ถ่ายรูปหน้าจอ (tc01_employee_created.png)
* **Step 6:** คลิกเมนู "Employee List" เพื่อกลับไปหน้าตารางรวม
* **Step 7:** ในช่อง "Employee Name" ให้พิมพ์ชื่อ `Automation Tester` ที่สร้างไว้เมื่อครู่
* **Step 8:** คลิกปุ่ม "Search"
    * *Expected:* ในตารางต้องปรากฏชื่อ "Automation Tester" เพียงแถวเดียว
* **Step 9:** ถ่ายรูปหน้าจอผลการค้นหา (tc01_search_result.png)
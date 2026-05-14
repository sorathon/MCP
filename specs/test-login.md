# Test Spec: SauceDemo Login Scenarios (Positive & Negative)
**Target URL:** https://www.saucedemo.com/

---

## Test Case 01: Valid Login (Positive Case)
**Description:** ตรวจสอบว่าผู้ใช้ที่กรอกข้อมูลถูกต้องสามารถเข้าสู่ระบบได้

* **Step 1:** นำทางไปยัง Target URL
    * *Expected Result:* หน้าเว็บโหลดสำเร็จ และปรากฏช่องกรอก Username, Password และปุ่ม Login
* **Step 2:** พิมพ์ Username ว่า `standard_user`
    * *Expected Result:* ช่อง Username แสดงข้อความ `standard_user`
* **Step 3:** พิมพ์ Password ว่า `secret_sauce`
    * *Expected Result:* ช่อง Password แสดงการกรอกข้อมูล (เป็นจุดบังรหัสผ่าน)
* **Step 4:** ถ่ายภาพหน้าจอ (Screenshot) ก่อนกดเข้าสู่ระบบ
    * *Expected Result:* บันทึกไฟล์ภาพ `tc01_before_login.png` ลงในโฟลเดอร์ screenshots
* **Step 5:** คลิกที่ปุ่ม "Login"
    * *Expected Result:* ระบบนำทางไปยังหน้า Inventory โลโก้หรือข้อความคำว่า "Products" ปรากฏขึ้นบนหน้าจอ
* **Step 6:** ถ่ายภาพหน้าจอ (Screenshot) ผลลัพธ์หลังเข้าสู่ระบบสำเร็จ
    * *Expected Result:* บันทึกไฟล์ภาพ `tc01_login_success.png` ลงในโฟลเดอร์ screenshots

---

## Test Case 02: Invalid Password (Negative Case)
**Description:** ตรวจสอบระบบป้องกันเมื่อผู้ใช้กรอกรหัสผ่านผิด ระบบต้องแสดงข้อความ Error อย่างถูกต้อง

* **Step 1:** นำทางไปยัง Target URL อีกครั้ง (หรือ Refresh หน้าเว็บใหม่)
    * *Expected Result:* หน้าเว็บโหลดสมบูรณ์พร้อมสำหรับกรอกข้อมูลใหม่
* **Step 2:** พิมพ์ Username ว่า `standard_user`
    * *Expected Result:* ช่อง Username แสดงข้อความ `standard_user`
* **Step 3:** พิมพ์ Password ว่า `wrong_password_123` (ตั้งใจใส่ผิด)
    * *Expected Result:* ช่อง Password แสดงการกรอกข้อมูล
* **Step 4:** ถ่ายภาพหน้าจอ (Screenshot) ก่อนกดเข้าสู่ระบบ
    * *Expected Result:* บันทึกไฟล์ภาพ `tc02_before_login.png` ลงในโฟลเดอร์ screenshots
* **Step 5:** คลิกที่ปุ่ม "Login"
    * *Expected Result:* ระบบต้อง **ไม่** นำทางไปยังหน้าอื่น และต้องมีกล่องข้อความ Error สีแดงปรากฏขึ้น โดยมีข้อความระบุว่า "Epic sadface: Username and password do not match any user in this service"
* **Step 6:** ถ่ายภาพหน้าจอ (Screenshot) ขณะที่แสดง Error Message
    * *Expected Result:* บันทึกไฟล์ภาพ `tc02_login_error.png` ลงในโฟลเดอร์ screenshots

---

## 📌 เงื่อนไขการทำ Report (สำหรับ AI)
เมื่อรันครบทั้ง 2 Test Cases แล้ว ให้เขียนสรุปผล Status (Pass/Fail) ของแต่ละ Test Case โดยอ้างอิงจาก Expected Result ว่าตรงตามที่คาดหวังหรือไม่
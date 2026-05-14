# QA Automation Test Report
**Spec File:** `C:\MyQAProject\specs\test-login.md`  
**Target URL:** https://www.saucedemo.com/  
**Run Date:** 2026-05-14  
**Overall Result:** ✅ PASS

---

## Summary

| Step | Description | Result |
|------|-------------|--------|
| 1 | เปิดหน้าเว็บ https://www.saucedemo.com/ | ✅ PASS |
| 2 | รอหน้าเว็บโหลด — ตรวจพบช่อง Username และ Password | ✅ PASS |
| 3 | แคปหน้าจอก่อนกรอกข้อมูล (Login page empty) | ✅ PASS |
| 4 | กรอก Username: `standard_user` | ✅ PASS |
| 5 | กรอก Password: `secret_sauce` | ✅ PASS |
| 6 | กดปุ่ม Login | ✅ PASS |
| 7 | ตรวจสอบหน้าผลลัพธ์ — พบคำว่า "Products" | ✅ PASS |
| 8 | แคปหน้าจอหลัง Login สำเร็จ | ✅ PASS |

---

## Screenshots

### Step 3 — หน้า Login ก่อนกรอกข้อมูล
![Step 3 - Login Page Empty](../screenshots/step3_login_page_empty.png)

### Step 8 — หน้าผลลัพธ์หลัง Login สำเร็จ
![Step 8 - Login Success](../screenshots/step8_login_success.png)

---

## Notes
- URL หลัง Login เปลี่ยนเป็น `https://www.saucedemo.com/inventory.html` ✅
- พบคำว่า `Products` บนหน้า Inventory ✅
- ทุก Step ผ่านโดยไม่มีข้อผิดพลาด

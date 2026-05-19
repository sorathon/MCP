# Test Spec: E2E Product Checkout Flow
**Target URL:** https://www.saucedemo.com/

---

## Scenario 01: Standard User can complete a purchase
**Goal:** ทดสอบระบบ E-commerce ตั้งแต่การ Login, การหยิบสินค้าลงตะกร้า, และการ Checkout จนเสร็จสมบูรณ์

* **Step 1: เข้าสู่ระบบ (Login)**
    * Action: กรอก Username `standard_user` และ Password `secret_sauce`
    * Action: คลิกปุ่ม "Login"
    * **Expected Result:** เข้าสู่หน้า Inventory สำเร็จ (สังเกตจากมีข้อความ "Products" หรือ "Swag Labs" ที่หัวเว็บ)

* **Step 2: หยิบสินค้าใส่ตะกร้า (Add to Cart)**
    * Action: ค้นหาสินค้าชื่อ "Sauce Labs Backpack" และคลิกปุ่ม "Add to cart" ของสินค้านั้น
    * **Expected Result:** ไอคอนตะกร้าสินค้ามุมขวาบน ต้องแสดงตัวเลข "1" (Badge updated)

* **Step 3: ตรวจสอบตะกร้าสินค้า (Verify Cart)**
    * Action: คลิกที่ไอคอนตะกร้าสินค้ามุมขวาบน
    * **Expected Result:** ต้องพบสินค้า "Sauce Labs Backpack" อยู่ในหน้านี้
    * Action: ถ่ายรูปหน้าจอ (tc01_cart_verified.png)

* **Step 4: ดำเนินการชำระเงิน (Checkout - Step 1)**
    * Action: คลิกปุ่ม "Checkout"
    * Action: กรอกข้อมูล First Name: `AI`, Last Name: `Tester`, Zip/Postal Code: `10110`
    * Action: คลิกปุ่ม "Continue"
    * **Expected Result:** เข้าสู่หน้า Checkout: Overview

* **Step 5: ยืนยันคำสั่งซื้อ (Checkout - Step 2)**
    * Action: เลื่อนลงมาและคลิกปุ่ม "Finish"
    * **Expected Result:** ต้องปรากฏข้อความ "Thank you for your order!"
    * Action: ถ่ายรูปหน้าจอ (tc01_checkout_success.png)

* **Step 6: ออกจากระบบ (Logout)**
    * Action: คลิกปุ่มเมนู 3 ขีด (Hamburger menu) มุมซ้ายบน
    * Action: คลิกเมนู "Logout"
    * **Expected Result:** กลับสู่หน้า Login หลัก
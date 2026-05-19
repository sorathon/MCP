# Test Report: Employee Creation & Search Flow (OrangeHRM)
**Spec File:** `test-concept.md`
**URL:** http://localhost:5173/
**Date:** 2026-05-15
**Status:** ✅ ALL PASSED

---

## Case 01: Test conceptsMCP

| Step | Description | Expected Result | Actual Result | Status | Screenshot |
|------|-------------|-----------------|---------------|--------|------------|
| 1 | กรอก USERNAME: `sorathon` แล้วกดปุ่ม LOGIN | ขึ้นข้อความแจ้งเตือนว่า `เข้าสู่ระบบสำเร็จ` | พบข้อความ `เข้าสู่ระบบสำเร็จ!` บนหน้าจอ | ✅ PASS | `TC01_Step1_Login_Success.png` |
| 2 | จองรถ เลือกประเภทรถ "SUV" แล้วกดปุ่ม "ยืนยันการจอง" | ขึ้น รหัสการจอง (เช่น CAR-2308) | พบรหัสการจอง `CAR-7118` | ✅ PASS | `TC01_Step2_Booking_SUV.png` |
| 3 | คัดลอกรหัสการจอง `CAR-7118` ไปใส่ช่อง "กรอกรหัสจองเพื่อค้นหา" | มีข้อความขึ้นบนหน้าจอว่า "พบข้อมูล: สถานะรอยืนยัน" | พบข้อความ `✅ พบข้อมูล: สถานะรอยืนยัน` | ✅ PASS | `TC01_Step3_Search_Found.png` |

---

## Summary

| Total | Passed | Failed |
|-------|--------|--------|
| 3     | 3      | 0      |

---

## Screenshots
- `C:\MyQAProject\screenshots\TC01_Step1_Login_Success.png`
- `C:\MyQAProject\screenshots\TC01_Step2_Booking_SUV.png`
- `C:\MyQAProject\screenshots\TC01_Step3_Search_Found.png`

# Test Report: test-concept.md
**Date:** 2026-05-14  
**URL:** http://localhost:5173/  
**Executed by:** Playwright MCP Automation  

---

## Case 01: Test conceptsMCP

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | กรอก USERNAME: `sorathon` แล้วกด LOGIN | ขึ้นข้อความแจ้งเตือนว่า "เข้าระบบสำเร็จ" | พบข้อความ "เข้าสู่ระบบสำเร็จ!" บนหน้าจอ | ✅ PASS |
| 2 | เลือกประเภทรถ "SUV" แล้วกดปุ่ม "ยืนยันการจอง" | ขึ้นรหัสการจอง (เช่น CAR-2308) | พบรหัสการจอง "CAR-6788" บนหน้าจอ | ✅ PASS |
| 3 | คัดลอกรหัสจอง `CAR-6788` ใส่ช่อง "กรอกรหัสจองเพื่อค้นหา" แล้วกดค้นหา | ขึ้นหน้าจอว่าการจองสำเร็จ | พบข้อความ "✅ พบข้อมูล: สถานะรอยืนยัน" | ⚠️ PARTIAL PASS |

---

## Summary

| Total | PASS | PARTIAL / MISMATCH | FAIL |
|-------|------|--------------------|------|
| 3     | 2    | 1                  | 0    |

---

## Notes

### Step 3 — ⚠️ Expected vs Actual Mismatch
- **Expected (spec):** ขึ้นหน้าจอว่า **"การจองสำเร็จ"**
- **Actual (UI):** แสดงข้อความ **"✅ พบข้อมูล: สถานะรอยืนยัน"**
- **สาเหตุที่เป็นไปได้:**
  1. Spec ยังไม่ได้ถูก update ให้ตรงกับ UI จริง
  2. เป็น Bug: ระบบควรแสดง "การจองสำเร็จ" แต่แสดงสถานะที่ยังไม่ยืนยัน
- **คำแนะนำ:** ให้ทีม dev/BA ตรวจสอบว่าเป็น expected behavior หรือ bug

---

## Screenshots

| Step | File |
|------|------|
| Step 1 — Login Success | `C:\MyQAProject\screenshots\TC01_step1_login_success.png` |
| Step 2 — Booking Code | `C:\MyQAProject\screenshots\TC01_step2_booking_code.png` |
| Step 3 — Search Result | `C:\MyQAProject\screenshots\TC01_step3_search_result.png` |

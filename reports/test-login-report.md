# Test Report: SauceDemo Login Scenarios
**Date:** 2026-05-14  
**Target URL:** https://www.saucedemo.com/  
**Spec File:** test-login.md  
**Overall Result:** ✅ ALL PASS

---

## Test Case 01: Valid Login (Positive Case)

| Step | Description | Expected Result | Actual Result | Status |
|------|-------------|-----------------|---------------|--------|
| 1 | Navigate to Target URL | Page loads; Username, Password, Login button visible | Page loaded at `https://www.saucedemo.com/`; all 3 elements confirmed via snapshot | ✅ PASS |
| 2 | Type Username: `standard_user` | Username field shows `standard_user` | Field filled via `[data-test="username"]` | ✅ PASS |
| 3 | Type Password: `secret_sauce` | Password field shows masked input | Field filled via `[data-test="password"]` | ✅ PASS |
| 4 | Screenshot before login | Save `tc01_before_login.png` | Saved to `C:\MyQAProject\screenshots\tc01_before_login.png` | ✅ PASS |
| 5 | Click Login button | Navigates to Inventory page; "Products" text appears | URL changed to `/inventory.html`; `.title` returned `"Products"` | ✅ PASS |
| 6 | Screenshot after login | Save `tc01_login_success.png` | Saved to `C:\MyQAProject\screenshots\tc01_login_success.png` | ✅ PASS |

---

## Test Case 02: Invalid Password (Negative Case)

| Step | Description | Expected Result | Actual Result | Status |
|------|-------------|-----------------|---------------|--------|
| 1 | Navigate to Target URL (refresh) | Page loads clean, ready for input | Page reloaded at `https://www.saucedemo.com/` | ✅ PASS |
| 2 | Type Username: `standard_user` | Username field shows `standard_user` | Field filled via `[data-test="username"]` | ✅ PASS |
| 3 | Type Password: `wrong_password_123` | Password field shows masked input | Field filled via `[data-test="password"]` | ✅ PASS |
| 4 | Screenshot before login | Save `tc02_before_login.png` | Saved to `C:\MyQAProject\screenshots\tc02_before_login.png` | ✅ PASS |
| 5 | Click Login button | Page does NOT navigate; red error box appears with text "Epic sadface: Username and password do not match any user in this service" | URL remained `https://www.saucedemo.com/`; `[data-test="error"]` visible = `true`; text = `"Epic sadface: Username and password do not match any user in this service"` | ✅ PASS |
| 6 | Screenshot with error message | Save `tc02_login_error.png` | Saved to `C:\MyQAProject\screenshots\tc02_login_error.png` | ✅ PASS |

---

## Screenshots Summary

| Filename | Test Case | Step |
|----------|-----------|------|
| `tc01_before_login.png` | TC01 | Step 4 — Before clicking Login |
| `tc01_login_success.png` | TC01 | Step 6 — Inventory page after successful login |
| `tc02_before_login.png` | TC02 | Step 4 — Before clicking Login (wrong password) |
| `tc02_login_error.png` | TC02 | Step 6 — Error message displayed |

---

## Summary

| Test Case | Description | Result |
|-----------|-------------|--------|
| TC01 | Valid Login (Positive) | ✅ PASS |
| TC02 | Invalid Password (Negative) | ✅ PASS |

**Total: 2/2 PASS — 0 FAILURES**

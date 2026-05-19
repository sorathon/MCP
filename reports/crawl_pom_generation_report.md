# Crawl & POM Generation Report
**Date:** 2026-05-19  
**Mode:** Mode B — URL to Code (Crawl & Explore)  
**Base URL:** http://localhost:4200/  
**Credentials:** maker1 / password  
**App Title:** Document Approval System

---

## Summary

| Item | Detail |
|---|---|
| Pages Discovered | 5 |
| POM Files Generated | 5 |
| Helper Files Generated | 3 |
| Screenshots Saved | 5 |
| Status | ✅ Complete |

---

## Pages Discovered

### 1. Login Page — `/login`

**Screenshot:** `screenshots/crawl_login_page.png`

| Element | Selector / TestId | Notes |
|---|---|---|
| Page Heading | `role=heading` "Document Approval System" | h2 |
| Subtitle | `p` "Sign in to your account" | |
| Username Input | `data-testid="input-username"` | placeholder: "Enter username or email" |
| Password Input | `data-testid="input-password"` | placeholder: "Enter password" |
| Password Toggle | `img` inside password wrapper | Eye icon |
| Sign In Button | `data-testid="btn-login-submit"` | Submits form |
| Register Link | `role=link` "Register" | → /register |

**Behaviour:** Unauthenticated users are redirected here from any protected route. Successful login redirects to `/dashboard`.

---

### 2. Dashboard — `/dashboard`

**Screenshot:** `screenshots/crawl_dashboard_page.png`

| Element | Selector | Notes |
|---|---|---|
| Welcome Heading | `role=heading` level 2 | "Welcome, John Maker! Maker" |
| Stat: Total | text "Total" parent | Count badge |
| Stat: Draft | text "Draft" parent | Count badge |
| Stat: Pending Approval | text "Pending Approval" parent | Count badge |
| Stat: Approved | text "Approved" parent | Count badge |
| Stat: Rejected | text "Rejected" parent | Count badge |
| Create Document Button | `role=button` "Create Document" | → /documents/create |
| Recent Documents Table | `table` | Columns: Doc Number, Title, Category, Status, Created |
| View All Link | `role=link` "View All" | → /documents |
| Doc Number Links | `role=link` in table rows | → /documents/:id |

---

### 3. My Documents — `/documents`

**Screenshot:** `screenshots/crawl_documents_list_page.png`

| Element | Selector / TestId | Notes |
|---|---|---|
| Page Heading | `role=heading` "My Documents" | h2 |
| Create Document Button | `role=button` "Create Document" | → /documents/create |
| Status Filter Dropdown | combobox "All Status" | Filter by status |
| Refresh Button | `role=button` "Refresh" | Reloads list |
| Table | `table` | See columns below |
| Column: Doc Number | `role=columnheader` "Doc Number" | Link → detail |
| Column: Title | `role=columnheader` "Title" | |
| Column: Category | `role=columnheader` "Category" | Badge |
| Column: Status | `role=columnheader` "Status" | Badge |
| Column: Created At | `role=columnheader` "Created At" | |
| Column: Actions | `role=columnheader` "Actions" | "View" button per row |
| Prev Page Button | `role=button` "Previous Page" | Disabled if on page 1 |
| Next Page Button | `role=button` "Next Page" | Disabled if last page |

---

### 4. Create Document — `/documents/create`

**Screenshot:** `screenshots/crawl_create_document_page.png`

| Element | Selector | Notes |
|---|---|---|
| Breadcrumb: Home | `role=link` "Home" | → /dashboard |
| Breadcrumb: Documents | `role=link` "Documents" | → /documents |
| Title Input | `placeholder="Enter document title"` | Required (`*`) |
| Category Dropdown | combobox "Select category" | Required (`*`) |
| Description Input | `placeholder="Enter document description (optional)"` | Optional |
| Save as Draft Button | `role=button` "Save as Draft" | Saves DRAFT status |
| Submit for Approval Button | `role=button` "Submit for Approval" | Saves PENDING status |
| Cancel Button | `role=button` "Cancel" | Navigates back |

---

### 5. Document Detail — `/documents/:id`

**Screenshot:** `screenshots/crawl_document_detail_page.png`

| Element | Selector | Notes |
|---|---|---|
| Breadcrumb: Home | `role=link` "Home" | → /dashboard |
| Breadcrumb: Documents | `role=link` "Documents" | → /documents |
| Status Stepper | text "Draft" / "Pending Approval" / "Approved" | Visual progress |
| Info Table | `table` | Doc Number, Status, Title, Category, Created By, Dates, Description |
| Approval History Section | text "Approval History" parent | Timeline list |
| History Items | `ul li` | Shows action + user + timestamp |

---

### 6. Shared: Sidebar Navigation + Header

Present on all authenticated pages.

| Element | TestId | Notes |
|---|---|---|
| Brand Logo | text "DocApproval" | |
| Dashboard Nav | `data-testid="menu-dashboard"` | Active state via `[active]` |
| My Documents Nav | `data-testid="menu-my-documents"` | |
| Create Document Nav | `data-testid="menu-create-document"` | |
| Role Badge | text "MAKER" | Shows current user role |
| User Dropdown | `data-testid="user-dropdown"` | Shows name + arrow |
| Profile Item | listitem "Profile" | In dropdown |
| Sign Out Item | listitem "Sign Out" | In dropdown → /login |

---

## Files Generated

### Page Object Models (`tests/pages/`)

| File | Class | URL |
|---|---|---|
| `login.page.ts` | `LoginPage` | `/login` |
| `navbar.page.ts` | `NavbarPage` | Shared (all auth pages) |
| `dashboard.page.ts` | `DashboardPage` | `/dashboard` |
| `documents-list.page.ts` | `DocumentsListPage` | `/documents` |
| `create-document.page.ts` | `CreateDocumentPage` | `/documents/create` |
| `document-detail.page.ts` | `DocumentDetailPage` | `/documents/:id` |

### Helpers (`tests/specs/helpers/`)

| File | Purpose |
|---|---|
| `auth.helper.ts` | `loginAs()`, `loginAsMaker1()`, `logout()` — UI login/logout flows |
| `test-data.helper.ts` | APP constants, ROUTES, DOCUMENT_CATEGORIES, sample document payloads |
| `screenshot.helper.ts` | `takeScreenshot()`, `takeElementScreenshot()` — save to screenshots/ |

### Config

| File | Purpose |
|---|---|
| `playwright.config.ts` | Base URL, reporters (list/html/json), chromium project, screenshot on failure |

---

## Recommended Next Steps

1. **Generate Spec Files** — e.g. `login.spec.ts`, `dashboard.spec.ts`, `documents.spec.ts`
2. **Add auth state caching** — save `storageState` after login once and reuse across tests for speed
3. **Explore Register page** — `/register` link found on login page, not yet crawled
4. **Identify Checker/Approver roles** — current session is MAKER only; other roles may reveal more pages

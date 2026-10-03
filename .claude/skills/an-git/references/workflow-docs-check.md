# Docs-Check Workflow

## Mục đích

Sau khi merge vào main, phát hiện Controller nào thay đổi và đề xuất cập nhật `docs/api/api-*.md` tương ứng.

**Chỉ chạy khi có Controller thay đổi** — không output nếu không có gì thay đổi.

---

## Thu tự bước

### Step 1: Git Diff

```bash
rtk git fetch origin
rtk git diff origin/{TO_BRANCH}...HEAD -- src/ApiHost/Controllers/
```

Chỉ lấy output lines chứa `.cs` — chỉ những file trong Controllers/.

### Step 2: Controller Filtering + Mapping

Script `scripts/detect_changed_controllers.py` thực hiện:

1. **Parse controller paths** từ git diff output
   - Input: list controller file paths (stdin)
   - Output: JSON với mappings

2. **Mapping algorithm:**
   - Folder name = Controller folder (VD: `Investors`)
   - Lowercase = base slug (VD: `investors`)
   - Xác định singular form:
     - `Staffs` → `staff`
     - `Projects` → `projects` (không đổi)
     - `Customers` → `customer`
     - `Investors` → `investor`
   - Doc path = `docs/api/api-{singular}.md`

3. **Kiểm tra doc tồn tại:**
   - Nếu `docs/api/api-{name}.md` tồn tại → include trong output
   - Nếu không tồn tại → warning, vẫn include vì có thể cần tạo mới

4. **Output JSON:**
   ```json
   {
     "changed_controllers": [
       {
         "controller_path": "src/ApiHost/Controllers/Investors/InvestorController.cs",
         "doc_path": "docs/api/api-investor.md",
         "doc_exists": true,
         "feature_name": "investor"
       }
     ],
     "total": 1
   }
   ```

### Step 3: Display + Action Prompt

Hiển thị kết quả:

```
Changed Controllers (2):
  Investors/InvestorController.cs
    → docs/api/api-investor.md [exists]
  Projects/ProjectsController.cs
    → docs/api/api-projects.md [exists]

Update API docs?
  [A] All (2) — gọi api-docs cho tất cả
  [S] Selective — chọn từng file
  [K] Skip — không làm gì
```

### Step 4: Execute

- **All**: Gọi `/api-docs {feature}` cho từng controller theo thứ tự
- **Selective**: Hiển thị list, user chọn từng file
- **Skip**: Kết thúc

---

## Error Handling

| Error | Action |
|-------|--------|
| Không có Controller nào thay đổi | Thoát im lặng, không output |
| `origin/{branch}` không tồn tại | `rtk git fetch origin` trước, retry |
| Doc file không tồn tại | Warning nhưng vẫn gọi api-docs để tạo mới |
| api-docs fail | Log lỗi, hỏi có tiếp tục với file khác không |

---

## Example Flow

```bash
# Merge xong, đang ở main
$ an-git docs-check

# (No output if no controller changes)

# Với controller changes:
$ an-git docs-check

Changed Controllers (2):
  Investors/InvestorController.cs
    → docs/api/api-investor.md [exists]
  Projects/ProjectsController.cs
    → docs/api/api-projects.md [exists]

Update API docs?
  [A] All (2)
  [S] Selective
  [K] Skip

→ User chọn A
→ /api-docs investor
→ /api-docs projects
```

---

## Mapping Reference

| Controller Folder | Doc File | Feature Name |
|-------------------|----------|--------------|
| `Investors/` | `api-investor.md` | investor |
| `Projects/` | `api-projects.md` | projects |
| `Auth/` | `api-auth.md` | auth |
| `Staffs/` | `api-staff.md` | staff |
| `Customers/` | `api-customer.md` | customer |
| `Sales/` | `api-sales.md` | sales |
| `Notifications/` | `api-notifications.md` | notifications |
| `Properties/` | `api-property.md` | property |
| `Fin/` | `api-receipts.md` | receipts |
| `Document/` | `api-doc-dicts.md` | doc-dicts |
| `Audit/` | `api-audit-log.md` | audit-log |
| `BankAccounts/` | `api-bank-accounts.md` | bank-accounts |
| `AccountingAccounts/` | `api-accounting-accounts.md` | accounting-accounts |
| `System/` | `api-system.md` | system |
| `Common/` | `api-public.md` | public |
| `Dev/` | — | (skip, dev only) |

**Lưu ý:** System folder có nhiều Controller con → map theo class name cụ thể.

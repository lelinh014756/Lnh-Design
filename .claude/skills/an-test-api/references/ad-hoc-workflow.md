# Ad-hoc Workflow (mode `test`)

Cách AI gửi HTTP thật, đọc `ApiResponse<T>` envelope, đánh giá pass/fail — thay thế Postman.

> Source of truth: `src/Shared/Contracts/Common/ApiRespone.cs` (envelope), `src/ApiHost/Properties/launchSettings.json` (port). Auth flow: [ad-hoc-auth.md](./ad-hoc-auth.md).

## 1. Quy trình 6 bước

```
User: "test POST /api/v1/payments với body {amount: 5000, projectId: 1}"
   ↓
[1] Lấy token    → Get-Token.ps1 / get-token.sh  (cache/refresh/login)
[2] Scout (nếu cần) → Controller/DTO để verify route + required fields
[3] Gửi request  → rtk curl -k -s ... | jq
[4] Parse envelope → success / data / message / errors[0].code
[5] Đánh giá     → so success + status với mong đợi
[6] Báo + cleanup awareness (nếu tạo data)
```

## 2. Lấy token

```bash
# Bash (Git Bash / WSL)
TOKEN=$(bash .claude/skills/an-test-api/scripts/get-token.sh)

# PowerShell
$token = pwsh -File .claude/skills/an-test-api/scripts/Get-Token.ps1
```

Token string ra stdout. Lần đầu: login (cache `.auth/adhoc-token.json`). Lần sau: cache hit (<10ms). Nếu `AUTH_TOKEN` env đã set → script return luôn, skip login.

## 3. Curl command template

```bash
rtk curl -k -s -X <METHOD> https://localhost:5005<PATH> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '<JSON body>' | jq
```

| Flag | Ý nghĩa |
|------|---------|
| `-k` | Bỏ qua HTTPS dev cert verify (self-signed localhost). Skip nếu đã `dotnet dev-certs https --trust` |
| `-s` | Silent (no progress bar) |
| `-X` | HTTP method (GET/POST/PUT/PATCH/DELETE) |
| `-H "Authorization: Bearer ..."` | Auth. Shell expand `$TOKEN` trước exec → không hiện trong argv |
| `-d` | JSON body. Single-quote Bash, here-string PS |

> **PowerShell thay curl:** `Invoke-RestMethod -SkipCertificateCheck -Headers @{Authorization="Bearer $token"}` — PS-native, không cần curl.exe. Khi dùng, nhớ `ConvertFrom-Json` kết quả.

## 4. Parse `ApiResponse<T>` envelope

Tất cả response qua envelope chuẩn (`ApiRespone.cs:11-95`), **camelCase** (ASP.NET Core default):

```jsonc
{
  "success": true,           // bool — kết quả nghiệp vụ
  "data": { "id": 42, ... }, // payload (null nếu fail)
  "message": "...",          // đã localized (vi/en theo Accept-Language)
  "errors": [],              // mảng ErrorResponse: [{code, message, target}]
  "statusCode": 200,         // HTTP code (mirror)
  "timestamp": "..."
}
```

### `jq` filters hay dùng

```bash
# Tổng quan: success + status + message
... | jq '{success, statusCode, message}'

# Trích ID/code từ data (POST create)
... | jq '{success, id: .data.id, code: .data.code}'

# Đếm items (list/search)
... | jq '{success, count: (.data.items // .data | length)}'

# Lấy error code khi fail
... | jq '{success: .success, code: .errors[0].code, msg: .errors[0].message}'
```

## 5. Đánh giá pass/fail

| User expect | PASS khi | FAIL khi |
|-------------|----------|----------|
| "tạo thành công" | `success:true` + status 201 | `success:false` → đọc `errors[0].code` |
| "tìm thấy" | `success:true` + status 200 + data≠null | 404 hoặc `success:false` |
| "validation fail" | status 400 + `success:false` + error code hợp lý | 201 (lỡ tạo) hoặc 500 |
| "không có quyền" | status 401/403 | 200 (lỡ cho phép) |

**Báo cáo ngắn gọn** — không dump full JSON. Trích 3-5 trường quan trọng + trạng thái:

```
✅ 201 Created — project id=42, code=ADHOC-001
❌ 400 — validation failed: code=DUPLICATE_CODE, "Mã đã tồn tại"
```

## 6. Status code reference (Landsoft convention)

| Code | Ý nghĩa | Thường gặp khi |
|------|---------|----------------|
| 200 | OK | GET, PUT, PATCH success |
| 201 | Created | POST create success |
| 400 | Bad Request | Validation fail, business rule (`Result.Failure`) |
| 401 | Unauthorized | Token thiếu/hết hạn → refresh |
| 403 | Forbidden | Token OK nhưng thiếu permission (role) |
| 404 | Not Found | ID không tồn tại |
| 409 | Conflict | Duplicate, version mismatch |

> **Quan trọng:** 400 = business error qua `Result.Failure(AppError.X)`, KHÔNG throw exception. Luôn có envelope `{success:false, errors:[{code}]}`. 500 = unhandled exception (không có envelope).

## 7. Multi-step pattern (flow phức tạp)

Khi test cần nhiều bước (create → verify → update → cleanup), lưu ID giữa các curl:

```bash
# Create
ID=$(rtk curl -k -s -X POST .../projects -H "..." -d '{...}' | jq -r '.data.id')

# Verify với ID vừa tạo
rtk curl -k -s .../projects/$ID -H "..." | jq '{success, name: .data.name}'

# Update
rtk curl -k -s -X PUT .../projects/$ID -H "..." -d '{...}' | jq '.success'

# Cleanup (nếu có DELETE endpoint)
rtk curl -k -s -X DELETE .../projects/$ID -H "..." | jq '.success'
```

## 8. Cleanup awareness (QUAN TRỌNG)

Ad-hoc `POST/PUT/PATCH/DELETE` tạo/đổi **data thật** trong DB dev (không có test isolation như InProcess+Respawn của regression suite).

**Khi test tạo row mới:**
- Báo user: "Đã tạo project id=42 (ADHOC-001) trong DB dev — cleanup manual hoặc gọi DELETE."
- Dùng prefix `ADHOC-` cho `code`/`name` để dễ nhận biết dữ liệu test.
- Không tự động xóa (CLAUDE.md: AI không tự chạy data-mutation ngoài scope user yêu cầu).

**Khi test với endpoint có side-effect** (payment, status transition): cảnh báo trước khi gọi, xác nhận nếu ảnh hưởng data quan trọng.

## 9. Body construction từ DTO

Khi user không cho đủ body → scout DTO (`src/Shared/Contracts/{Domain}/{Domain}Request.cs` qua Serena `find_symbol`) để biết required fields. Trích `[Required]`, `[StringLength(max)]`, `[Range]` → xây body tối thiểu thỏa validation. **Không đoán field name** — luôn verify từ DTO thật; sai field = 400 khó debug.

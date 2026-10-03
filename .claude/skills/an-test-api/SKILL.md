---
name: an-test-api
description: "Postman do AI lái: gọi HTTP thật tới API Landsoft, đọc response, báo pass/fail ngay (ad-hoc mode). Cũng sinh/chạy YAML scenario suite cho regression. Dùng khi: test thử endpoint với body cụ thể, verify API sau khi implement, chạy bộ scenario test có sẵn, sinh test cho domain mới. KHÔNG dùng cho: edge-case analysis (→ an-scenario), chạy unit test generic (→ an-test), sinh OpenAPI docs (→ api-docs)."
argument-hint: "[test|generate|run|report] [args]"
version: 2.0.0
---

# an-test-api — Postman do AI lái + YAML Scenario Suite

Skill repo-tuned cho Landsoft-One-BE. Hai use case chính:

1. **Ad-hoc (default)** — AI gửi HTTP thật tới API đang chạy, đọc `ApiResponse<T>` envelope, đánh giá pass/fail ngay. Thay thế test thủ công qua Postman.
2. **Regression suite** — sinh/chạy/báo cáo YAML scenario test cho 1 domain qua `tests/ApiHost.ScenarioTests/`.

## When to Use

- **"test thử POST /payments với body X"** / **"gọi API X xem trả về gì"** / **"verify endpoint này chạy được chưa"** → `test` (ad-hoc, default)
- **"viết scenario test cho domain X"** / **"sinh test cho Payment"** → `generate <domain>`
- **"chạy scenario test"** / **"run API tests"** → `run [filter]`
- **"báo cáo test"** / **"xem kết quả test"** → `report [path]`

> Không chỉ định mode → mặc định `test`. VD: `/an-test-api GET /api/v1/projects/lookup`.

## When NOT to Use

| Mục đích | Dùng skill nào |
|----------|----------------|
| Edge-case / negative-case analysis trước khi code | `an-scenario` (analysis-only) |
| Chạy unit/integration test generic xUnit/NUnit | `an-test` |
| Sinh OpenAPI / API reference markdown docs | `api-docs` |

## Mode 1 — Ad-hoc (default): `test`

AI đóng vai QA gọi API như Postman: lấy token → gửi `rtk curl` → đọc envelope → báo kết quả.

### Flow

1. **Lấy token**: chạy `scripts/Get-Token.ps1` (Windows) hoặc `scripts/get-token.sh` (Bash). Script resolve base URL (CLI arg > `BASE_URL` env > `.auth/config.json` > default) → đọc credentials → POST `/api/v1/auth/login` → cache token tại `.auth/adhoc-token.json` (gitignored). Fallback: `AUTH_TOKEN` env hoặc user paste token. Xem [references/ad-hoc-auth.md](./references/ad-hoc-auth.md).
2. **Gửi request**: `rtk curl -k -s -X <METHOD> https://localhost:5005<path> -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '<body>'`. Flag `-k` cho dev cert HTTPS.
3. **Đọc envelope**: parse `ApiResponse<T>` = `{success, data, message, errors:[{code,message,target}], statusCode}`. Pipe qua `jq` để rút gọn.
4. **Đánh giá**: so `statusCode` + `success` với mong đợi. Nếu `success:false` → đọc `errors[0].code`. Báo `✅`/`❌` + thông tin hữu ích (id tạo, message).
5. **Refresh-on-401**: nếu nhận 401 → token hết hạn → chạy lại script login → retry 1 lần.
6. **Cleanup awareness**: `POST/PUT/PATCH/DELETE` tạo/đổi data thật trong DB dev. Báo user nếu test tạo row mới; gợi ý xóa hoặc note ID để dọn sau.

### Ví dụ

```bash
# Lấy token (cache nếu còn hạn)
TOKEN=$(pwsh -File .claude/skills/an-test-api/scripts/Get-Token.ps1)

# Test GET lookup
rtk curl -k -s https://localhost:5005/api/v1/projects/lookup \
  -H "Authorization: Bearer $TOKEN" | jq '{success, count: (.data | length)}'

# Test POST create
rtk curl -k -s -X POST https://localhost:5005/api/v1/projects \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"code":"ADHOC-001","name":"Test ad-hoc","projectTypeId":1,"phaseId":1}' | jq '{success, id: .data.id, code: .data.code}'
```

Chi tiết: [references/ad-hoc-workflow.md](./references/ad-hoc-workflow.md)

## Mode 2-4 — Regression Suite (secondary)

| Mode | Lệnh | Output |
|------|------|--------|
| `generate <domain>` | `/an-test-api generate payment` | `{domain}.scenarios.yaml` + `.seed.sql` + `{Domain}ScenarioTests.cs` |
| `run [filter]` | `/an-test-api run --filter "FullyQualifiedName~Payment"` | Test pass/fail + markdown report |
| `report [path]` | `/an-test-api report` | Báo cáo tổng hợp từ `test-results/*.md` |

Regression suite chạy qua `dotnet test` với framework `ApiHost.ScenarioTests` (InProcess mint SYS_ADMIN token + Respawn, hoặc Remote auto-login). Bám pattern từ `Scenarios/projects.scenarios.yaml`.

Xem: [generation-workflow.md](./references/generation-workflow.md) · [execution-modes.md](./references/execution-modes.md) · [report-format.md](./references/report-format.md)

## Dependencies

| Dependency | Path / Value |
|------------|--------------|
| API base (Dev) | `https://localhost:5005` (`src/ApiHost/Properties/launchSettings.json`, HTTPS + dev cert → curl `-k`). Đổi server: sửa `.auth/config.json` |
| Ad-hoc auth | `scripts/Get-Token.ps1` / `scripts/get-token.sh` + user-secrets hoặc `AUTH_TOKEN` env |
| Ad-hoc config | `.auth/config.json` (`baseUrl`) + `.auth/credentials.json` + `.auth/adhoc-token.json` (repo root, gitignored) |
| Suite framework | `tests/ApiHost.ScenarioTests/` |
| Suite InProcess env | `TEST_DB_CONNECTION` (SQL Server) |
| Suite Remote env | `BASE_URL` + user-secrets (`TestCredentials:AdminUsername`, `TestCredentials:Password`) |

> Cần `rtk curl` (hoặc `curl`) + `jq`. Cả hai có sẵn trên Git Bash Windows. Setup credentials: [test-credentials-setup.md](./references/test-credentials-setup.md).

## References

| File | Nội dung |
|------|----------|
| [ad-hoc-auth.md](./references/ad-hoc-auth.md) | Auth resolution order + cache schema + login/refresh contract + cert (mode `test`) |
| [ad-hoc-workflow.md](./references/ad-hoc-workflow.md) | Curl recipes + envelope eval + pass/fail + cleanup (mode `test`) |
| [scenario-yaml-schema.md](./references/scenario-yaml-schema.md) | Scenario/Step/Expect fields + Scriban variables (suite) |
| [seed-sql-pattern.md](./references/seed-sql-pattern.md) | Idempotent seed SQL (suite) |
| [generation-workflow.md](./references/generation-workflow.md) | Controller→Service→DTO → 10 scenario templates (suite) |
| [execution-modes.md](./references/execution-modes.md) | InProcess vs Remote vs Skip matrix (suite) |
| [report-format.md](./references/report-format.md) | Console table + markdown report (suite) |
| [test-credentials-setup.md](./references/test-credentials-setup.md) | user-secrets + cache flow (cả ad-hoc + suite) |

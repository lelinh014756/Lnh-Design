# Report Format

Console text-art table + markdown report — output layer của `ScenarioReporter`. Đọc `IReadOnlyList<StepResult>` render dễ đọc.

> Source of truth: `Runner/ScenarioReporter.cs`, `Runner/Models/StepResult.cs:6-17`. Verify paths trước khi dùng.

## 1. Report goals

| Goal | Đáp ứng bằng |
|------|-------------|
| **Readability** | Console text-art table — 1 dòng per step, cột aligned |
| **Portability** | Markdown file — share, diff, archive |
| **Debuggability** | Failure detail — full request/response body, expected vs actual |

## 2. Console output format

Box-drawing characters Unicode (`─│┌┐└┘├┤┬┴┼`). Render qua injected `Action<string>` sink (production: `ITestOutputHelper.WriteLine`).

```
┌─────────────────────────────────────────────────────────────────┐
│ SCENARIO: happy-crud                                  [RUNNING] │
├───────┬──────────────────────┬────────┬────────┬─────────────────┤
│ Step  │ Request              │ Status │ Result │ Note            │
├───────┼──────────────────────┼────────┼────────┼─────────────────┤
│ creat │ POST /projects       │ 201    │ ✅     │                 │
│ get_a │ GET /projects/42     │ 200    │ ✅     │                 │
│ updat │ PUT /projects/42     │ 200    │ ✅     │                 │
│ patch │ PATCH /projects/42/… │ 200    │ ✅     │                 │
└───────┴──────────────────────┴────────┴────────┴─────────────────┘
  → [PASS] happy-crud (1.24s)
```

Failure scenario:
```
┌─────────────────────────────────────────────────────────────────┐
│ SCENARIO: business-duplicate-code                     [RUNNING] │
├───────┬──────────────────────┬────────┬────────┬─────────────────┤
│ Step  │ Request              │ Status │ Result │ Note            │
├───────┼──────────────────────┼────────┼────────┼─────────────────┤
│creat_d│ POST /projects       │ 400    │ ❌     │ expected 400 got│
└───────┴──────────────────────┴────────┴────────┴─────────────────┘
  → [FAIL] business-duplicate-code (0.34s)
  → Error: [business-duplicate-code / step:create_dup] expected status 400...
  → Scenario: business-duplicate-code, Step: create_dup
```

### Column widths

| Cột | Width | Source |
|------|-------|--------|
| Step | 5 chars (truncated) | `StepResult.Step.Id` |
| Request | 18 chars (truncated) | `RequestMethod` + ` ` + `RequestUrl` |
| Status | 6 chars | `(int)Status` |
| Result | 6 chars | ✅/❌ |
| Note | 17 chars (truncated, single-line) | `FailureMessage` (newlines → space) |

## 3. Markdown output template

`tests/ApiHost.ScenarioTests/test-results/{yyyyMMdd-HHmmss}.md` (gitignored):

```markdown
# Scenario Test Report — 2026-08-08 15:30

**Total:** 10 scenarios | **9 passed** | **1 failed**

## Summary

| Scenario | Status | Duration | Notes |
|----------|--------|----------|-------|
| happy-crud | PASS | 1.24s | — |
| lookup-returns-seeded | PASS | 0.42s | — |
| search-default-page | PASS | 0.38s | — |
| validation-missing-code | PASS | 0.31s | — |
| business-duplicate-code | **FAIL** | 0.34s | expected status 400, got 200 |
| not-found-by-id | PASS | 0.29s | — |
| unauthorized-no-token | PASS | 0.27s | — |
| patch-status-not-found | PASS | 0.31s | — |
| update-not-found | PASS | 0.30s | — |
| domain-specific | PASS | 0.45s | — |

## Failures Detail

### business-duplicate-code
- **Error:** [business-duplicate-code / step:create_dup] expected status 400...
- **Step:** create_dup
  - **Request:** POST /api/v1/projects
  - **Status:** 200
  - **Failure:** expected status 400, got 200
  - **Request body:**
```json
{"code":"DUP_TEST_001","name":"Dupe Attempt 482910"}
```
  - **Response body:**
```json
{"success":true,"data":{"id":9005,...}}
```
```

### Sections

1. **Header** — timestamp, total/passed/failed counts
2. **Summary table** — 1 row per scenario (name, status, duration, notes)
3. **Failures Detail** — chỉ khi có fail. Mỗi fail: error message + từng failed step (request, status, failure, request/response body)

## 4. StepResult → report mapping

`StepResult.cs:6-17` — 9 fields. Mapping:

| StepResult field | Console cột | Markdown section |
|-----------------|-------------|------------------|
| `Step.Id` | "Step" | Step header |
| `RequestMethod` | "Request" (method part) | Request |
| `RequestUrl` | "Request" (url part) | Request |
| `Status` (HttpStatusCode) | "Status" (int cast) | Status |
| `Success` | "Result" (✅/❌) | (implicit in status row) |
| `FailureMessage` | "Note" (truncated 17, single-line) | Failure |
| `RequestBody` | (collapsed, not in console) | Request body (json block) |
| `ResponseBody` | (collapsed, not in console) | Response body (json block, truncated 1000) |
| `ResponseJson` | (not rendered — JsonNode, redundant with ResponseBody) | — |

> **Truncation:** Console Note = 17 chars. Markdown response body = 1000 chars. Tránh bloat khi 100+ scenarios.

## 5. Output paths

| Output | Path | Ghi chú |
|--------|------|---------|
| Console | `ITestOutputHelper.WriteLine` (xUnit) | Hiển thị với `--logger "console;verbosity=detailed"` |
| Markdown | `tests/ApiHost.ScenarioTests/test-results/{yyyyMMdd-HHmmss}.md` | Gitignored (local only) |

### Markdown path generation

```csharp
var timestamp = DateTime.Now.ToString("yyyyMMdd-HHmmss");
var mdPath = Path.Combine(
    AppContext.BaseDirectory, "test-results", $"{timestamp}.md");
```

`AppContext.BaseDirectory` = `bin/Debug/net9.0/` (output folder). `ScenarioReporter.Finalize()` create directory + write file atomic.

> **`.gitignore`:** `tests/ApiHost.ScenarioTests/test-results/` — reports chứa request/response body có thể có PII. Không commit.

## Security considerations

- **Console output:** Không log credentials. Login endpoint body (nếu scenario test login) KHÔNG nên chứa real password — dùng placeholder.
- **Markdown PII:** Response body có thể chứa user email, phone. Gitignore bắt buộc. Truncate 1000 chars giới hạn exposure.
- **Failure detail:** Có thể leak DB connection string nếu error message chứa config. Truncate mitigates.

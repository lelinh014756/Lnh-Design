# Scenario YAML Schema

Contract cho file `.scenarios.yaml` — mỗi top-level item là 1 xUnit theory row = 1 business flow độc lập. Parsed bởi `ScenarioLoader.LoadFile` (`tests/ApiHost.ScenarioTests/Runner/ScenarioLoader.cs:24`) dùng YamlDotNet với **CamelCase naming convention** → YAML key `statusId` maps C# property `StatusId`.

> Source of truth: `Runner/Models/Scenario.cs`, `Runner/Models/Step.cs`, `Runner/Models/Expect.cs`. Verify paths trước khi dùng (framework có thể thay đổi).

## 1. Top-level Scenario fields

Map 1:1 với `Scenario.cs:8-42`:

| YAML key | C# property | Type | Default | Mô tả |
|----------|-------------|------|---------|-------|
| `name` | `Name` | string (required) | — | ID ngắn, kebab-case. Dùng trong xUnit test name. |
| `description` | `Description` | string | `""` | Mô tả hiển thị khi fail. |
| `auth` | `Auth` | string | `"sys_admin"` | `sys_admin` (mint admin token) / `none` (no auth → 401 test) / `static` (AUTH_TOKEN env). |
| `seed` | `Seed` | string? | `null` | Tên file `.sql` (relative `Scenarios/`) chạy sau Respawn. |
| `requiresSqlServer` | `RequiresSqlServer` | bool | `false` | Skip trên InProcess nếu true (dành cho Dapper-only features). |
| `steps` | `Steps` | list (required) | `[]` | Danh sách HTTP steps. Biến save ở step trước available cho step sau. |

## 2. Step fields

Map 1:1 với `Step.cs:7-36`:

| YAML key | C# property | Type | Mô tả |
|----------|-------------|------|-------|
| `id` | `Id` | string (required) | Stable id cho variable namespace + failure messages. |
| `method` | `Method` | string | `GET`/`POST`/`PUT`/`PATCH`/`DELETE`. Case-insensitive (auto-uppercase). |
| `path` | `Path` | string (required) | Path appended BASE_URL. Có chứa `{{var}}`. **KHÔNG** include BASE_URL. |
| `body` | `Body` | object? | JSON body. Render qua Scriban trước khi gửi. |
| `query` | `Query` | dict? | Query string params. Render qua Scriban. |
| `save` | `Save` | dict? | Map `json_pointer → variable_name`. |
| `expect` | `Expect` | object | Expectations (xem §3). |
| `auth` | `Auth` | string? | Per-step override (null = scenario-level). |

## 3. Expect fields

Map 1:1 với `Expect.cs:3-22`:

| YAML key | C# property | Type | Mô tả |
|----------|-------------|------|-------|
| `status` | `Status` | int? | Expected HTTP status code. Assertion phổ biến nhất. |
| `schema` | `Schema` | string? | JsonSchema.Net id (đăng ký `Checkers.SchemaRegistry`) validate `data` field. |
| `semantic` | `Semantic` | string? | Natural-language expectation. Chỉ active khi `AI_CHECKER=enabled` (SemanticChecker). |
| `success` | `Success` | bool? | Expected `success` flag trong ApiResponse envelope. null = don't check. |
| `errorCode` | `ErrorCode` | string? | Substring phải xuất hiện trong `errors[0].code` khi `success=false`. |

> **Lưu ý envelope:** ApiResponse có `errors` (mảng), không phải `error`. Check `errors[0].code`.

## 4. Template variables (Scriban)

`TemplateEngine.cs:31-44` render mọi string leaf qua Scriban. Hai loại:

### User-defined

`{{var_name}}` — lookup trực tiếp từ VariableStore. Biến được set qua `save` ở step trước.

```yaml
path: /api/v1/projects/{{project_id}}
```

### Built-in helpers (`TemplateEngine.cs:40-44`)

| Helper | Output | Ví dụ |
|--------|--------|-------|
| `{{random_n:8}}` | N-digit random number | `48291037` |
| `{{guid}}` | GUID (N format, no dashes) | `a1b2c3d4e5f6...` |
| `{{now}}` | ISO 8601 timestamp | `2026-08-08T15:30:00.0000000+00:00` |
| `{{iso_date}}` | Date yyyy-MM-dd | `2026-08-08` |
| `{{var "name"}}` | Explicit variable lookup | `PRJ-48291037` |

> Scriban syntax đầy đủ available (loops, conditionals). Nhưng YAGNI — chỉ dùng helpers trên cho test data.

## 5. Save — dotted JSON pointer

`save` map `json_pointer → variable_name`. Runner walks response JSON theo pointer (`ScenarioRunner.cs` PointerGet). Cú pháp **dotted**, không phải RFC 6901 slash:

```yaml
save:
  data.id: project_id              # object access: response.data.id → var "project_id"
  data.items.0.code: first_code    # array index: response.data.items[0].code
  request.body.code: created_code  # special: echo back rendered request body field
```

**`request.body.*`** là special case — không đọc response mà echo lại field từ rendered request body. Hữu ích để compare input vs output.

## 6. Reserved auth tokens

`Scenario.ResolveTokenProvider` (`Scenario.cs:35-41`):

| Auth value | Token provider | Khi nào dùng |
|------------|----------------|--------------|
| `sys_admin` (default) | MintedTokenProvider (InProcess) hoặc LoginTokenProvider fallback (Remote) | Happy path, full-access scenarios |
| `none` | NoAuthTokenProvider (null token) | 401 unauthorized tests |
| `static` | StaticTokenProvider (AUTH_TOKEN env) | Legacy Remote với paste token |

> **Remote mode fallback:** khi `MintedToken` null (Remote), `ResolveTokenProvider` fallback sang `StaticToken` slot — nơi LoginTokenProvider được wire. Do đó `sys_admin` works trong cả 2 mode.

Reserved tương lai: `role:<RoleCode>` cho multi-role tokens.

## 7. Common pitfalls

| Pitfall | Fix |
|---------|-----|
| Indentation YAML sai | 2-space, snake_case keys (CamelCase convention map cả 2) |
| Method lowercase | Hoạt động (auto-uppercase) nhưng viết hoa dễ đọc hơn |
| Path chứa BASE_URL | Bỏ — fixture auto-append |
| `save` dùng slash (`data/id`) | Sai — dùng dot (`data.id`) |
| Quên `success: true` khi expect success | ApiResponse envelope check — thêm nếu cần verify |
| `errorCode` sai field name | Envelope dùng `errors[0].code`, không phải `error.code` |

## 8. Full minimal example

```yaml
# payment.scenarios.yaml
# Variables: {{var_name}} (from save), {{random_n:8}}, {{guid}}, {{now}}, {{iso_date}}

# --- 1. Happy path ---
- name: happy-crud
  description: Payment CRUD happy path end-to-end
  auth: sys_admin
  seed: payment.seed.sql
  steps:
    - id: create
      method: POST
      path: /api/v1/payments
      body:
        code: "PAY-{{random_n:8}}"
        amount: 1000000
      save:
        data.id: payment_id
        request.body.code: created_code
      expect:
        status: 201
        success: true

    - id: get_after_create
      method: GET
      path: /api/v1/payments/{{payment_id}}
      expect:
        status: 200
        success: true
        semantic: "Payment trả về phải khớp id và code vừa tạo"

# --- 2. Unauthorized ---
- name: unauthorized-no-token
  description: GET without Bearer returns 401
  auth: none
  steps:
    - id: lookup_unauth
      method: GET
      path: /api/v1/payments/lookup
      expect:
        status: 401
```

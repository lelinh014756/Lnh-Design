# Generation Workflow

Workflow sinh test mới từ domain code: Controller → Service → DTO → 10 scenario templates → 3 output files.

> Source of truth: `Scenarios/projects.scenarios.yaml`, `Tests/ProjectsScenarioTests.cs`. Verify patterns trước khi generate.

## 1. Workflow overview

```
User: "/an-test-api generate payment"
    ↓
[1] Scout: tìm PaymentController + IPaymentService + Payment DTOs
    ↓
[2] Extract: routes, request/response schemas, validation rules, business errors
    ↓
[3] Map: 10 templates × extracted endpoints → scenarios
    ↓
[4] Generate: payment.scenarios.yaml + payment.seed.sql + PaymentsScenarioTests.cs
    ↓
[5] Verify: dotnet build, dotnet test --filter "FullyQualifiedName~Payment"
```

## 2. Step 1: Scout paths

Glob patterns để tìm domain code:

```bash
# Controller
Glob: src/ApiHost/Controllers/**/{Domain}Controller.cs

# Service interface
Glob: src/Application/Services/{Domain}/I{Domain}Service.cs

# Request/Response DTOs
Glob: src/Shared/Contracts/{Domain}/*.cs

# Entity (cho seed SQL column list)
Glob: src/Domain/Entities/{Domain}.cs
```

Expected output (ví dụ Payment):
- `src/ApiHost/Controllers/Payment/PaymentController.cs` — route `api/v{version:apiVersion}/payments`
- `src/Application/Services/Payment/IPaymentService.cs` — methods (Create, Get, Update, Search, Lookup, PatchStatus, PatchActive...)
- `src/Shared/Contracts/Payment/Payment*.cs` — `PaymentRequest`, `PaymentResponse`, `PaymentSearchRequest`, ...

Nếu KHÔNG tìm thấy → domain chưa ready, abort, báo user.

## 3. Step 2: Extract contract

Đọc Controller, ghi ra cho mỗi endpoint:

| Field | Cách extract | Ví dụ |
|-------|--------------|-------|
| HTTP method + path | `[HttpPost]`/`[HttpGet]` + route attribute | `POST /api/v1/payments` |
| Request body shape | DTO fields + `[Required]` + `[StringLength]` | `code: string (required, max 100)` |
| Response shape | `ApiResponse<T>` return type + `[ProducesResponseType]` | `ApiResponse<PaymentResponse>` |
| Auth requirement | `[AllowAnonymous]` vs `[Authorize]` | `[Authorize]` → needs Bearer |
| Business errors | Service `Result.Failure(AppError.X)` | `DUPLICATE_CODE`, `INVALID_STATUS` |

Quan trọng: note **required fields** (cho validation-missing-X templates) và **business error codes** (cho business-error template).

## 4. Step 3: 10 scenario templates

Map extracted endpoints vào 10 templates. Mỗi template = 1 business flow độc lập = 1 xUnit theory row:

| # | Template | Trigger | Expect | Notes |
|---|----------|---------|--------|-------|
| 1 | `happy-crud` | POST create → GET → PUT update → PATCH status → PATCH active | 201/200, `success: true` | Save `id` cho steps sau |
| 2 | `lookup-returns-seeded` | GET `/lookup` | 200, semantic check | Cần seed EXISTING row |
| 3 | `search-default-page` | POST `/search` body `{}` | 200, paged envelope | Body rỗng = default paging |
| 4 | `validation-missing-{field}` | POST thiếu 1 required field | 400 | Chọn required field quan trọng nhất (thường là `code`) |
| 5 | `validation-missing-{field2}` | POST thiếu required field khác | 400 | Thường là `name`. Có thể skip nếu chỉ 1 required |
| 6 | `business-{errorCode}` | POST trigger rule nghiệp vụ | 400 | Cần seed DUP_TEST row. Duplicate code phổ biến nhất |
| 7 | `not-found-by-id` | GET `/999999` | 404 | ID lớn không tồn tại |
| 8 | `unauthorized-no-token` | GET `/lookup` không Bearer | 401 | `auth: none` |
| 9 | `patch-status-not-found` | PATCH `/999999/status` | 404 | Nếu endpoint có |
| 10 | `update-not-found` | PUT `/999999` | 404 | Luôn có nếu có PUT |

**Template #10 alt — domain-specific:** Nếu domain có business rule đặc thù (status transitions, FK constraints), dùng template #10 cho rule đó thay vì update-404.

### Điều chỉnh theo domain thực tế

- Nếu Controller **không có** PATCH status/active → bỏ template #9 (chỉ 9 scenarios)
- Nếu Controller **không có** lookup endpoint → bỏ template #2
- Nếu domain có **thêm** endpoint đặc thù (approve, reject, calculate...) → thêm scenario

> **Quan trọng:** Không cố generate scenario cho endpoint không tồn tại. Scout §2 verify trước.

## 5. Step 4: Write files

### YAML pattern

```yaml
# {domain}.scenarios.yaml
# Each top-level item = 1 xUnit theory row = 1 independent business flow.
# Variables: {{var_name}} (from earlier save), {{random_n:8}}, {{guid}}, {{now}}.

# --- 1. Happy path ---
- name: happy-crud
  description: {Domain} CRUD happy path end-to-end
  auth: sys_admin
  seed: {domain}.seed.sql
  steps:
    - id: create
      method: POST
      path: /api/v1/{domain}s
      body:
        code: "{PREFIX}-{{random_n:8}}"
        # ... required fields từ DTO
      save:
        data.id: {domain}_id
        request.body.code: created_code
      expect:
        status: 201
        success: true
    # ... get, update, patch steps
```

- Top-level comment block (variables, notes)
- Mỗi scenario: kebab-case `name` + `description` + `auth` + optional `seed` + `steps`
- Comment `# --- N. ... ---` phân tách scenarios
- `save` cho `id` + `code` để steps sau reference

### Test class skeleton

Copy từ `Tests/ProjectsScenarioTests.cs`, đổi tên file + YAML file name:

```csharp
using Landsoft.ApiHost.ScenarioTests.Fixtures;
using Landsoft.ApiHost.ScenarioTests.Runner;
using Landsoft.ApiHost.ScenarioTests.Runner.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Landsoft.ApiHost.ScenarioTests.Tests;

public sealed class {Domain}ScenarioTests : IClassFixture<ScenarioFixture>
{
    private readonly ScenarioFixture _fixture;
    private readonly ITestOutputHelper _output;

    public {Domain}ScenarioTests(ScenarioFixture fixture, ITestOutputHelper output)
    {
        _fixture = fixture;
        _output = output;
    }

    public static IEnumerable<object[]> Scenarios =>
        new[]
        {
            new object[] { ScenarioLoader.LoadFile(
                ScenarioLoader.ResolveScenarioPath("{domain}.scenarios.yaml")) },
        };

    [Theory]
    [MemberData(nameof(Scenarios))]
    public async Task Run(IReadOnlyList<Scenario> scenarios)
    {
        if (_fixture.SkipAll) return;

        var runner = _fixture.CreateRunner();
        var timestamp = DateTime.Now.ToString("yyyyMMdd-HHmmss");
        var mdPath = Path.Combine(
            AppContext.BaseDirectory, "test-results", $"{timestamp}.md");
        var reporter = new ScenarioReporter(_output.WriteLine, mdPath);
        var failures = new List<string>();

        foreach (var scenario in scenarios)
        {
            using var scope = reporter.BeginScenario(scenario);
            try
            {
                await _fixture.ResetAndSeedAsync(scenario.Seed);
                var results = await runner.RunAsync(scenario, _fixture.Mode);
                foreach (var r in results)
                    reporter.RecordStepResult(r);
            }
            catch (SkipScenarioException ex)
            {
                failures.Add($"[SKIP] {scenario.Name}: {ex.Message}");
            }
            catch (ScenarioException ex)
            {
                reporter.FinalizeScenario(scenario, failed: true, ex);
                failures.Add(ex.Message);
                continue;
            }
        }

        reporter.Finalize();
        if (failures.Count > 0)
            Assert.Fail($"{failures.Count} scenario(s) failed:\n\n" + string.Join("\n\n---\n\n", failures));
    }
}
```

> **Note `using var scope`:** `BeginScenario` returns `IDisposable` — `Dispose()` tự gọi `FinalizeScenario(failed:false)` cho happy path. Cho failure path, gọi `FinalizeScenario(failed:true, ex)` explicit rồi `continue` (skip `Dispose` double-finalize).

## 6. Step 5: Verify

```bash
# Scoped build (P1 token efficiency — syntax check RIÊNG, no full solution)
dotnet build tests/ApiHost.ScenarioTests/ApiHost.ScenarioTests.csproj --no-dependencies

# Run với filter
export TEST_DB_CONNECTION="Server=localhost;Database=LandsoftOneTest;Integrated Security=true;TrustServerCertificate=true"
dotnet test tests/ApiHost.ScenarioTests/ApiHost.ScenarioTests.csproj \
    --filter "FullyQualifiedName~{Domain}ScenarioTests" \
    --logger "console;verbosity=detailed"
```

Expected: tất cả scenarios pass (hoặc known-skip với lý do rõ). Nếu fail → đọc console table + `test-results/*.md` → identify root cause → revise.

## Common issues khi generate

| Issue | Nguyên nhân | Fix |
|-------|-------------|-----|
| YAML parse error | Indentation sai / unmatched property | Verify CamelCase naming, 2-space indent |
| Seed SQL FK violation | Thiếu row cha (Organization, User...) | Defensive insert idn.Users + idn.Organizations |
| 400 thay vì 201 | Required field thiếu / sai type | Verify DTO `[Required]` attributes |
| 404 thay vì 200 | Route sai / ID format | Verify Controller route attribute |
| 401 thay vì 200 | `auth: sys_admin` nhưng MintedToken null (Remote) | Fallback đã wire; verify BASE_URL + user-secrets |

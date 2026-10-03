# Execution Modes

Matrix InProcess vs Remote vs Skip — env vars, token source, DB access, khi nào dùng.

> Source of truth: `Fixtures/ScenarioFixture.cs:27-73`, `Auth/MintedTokenProvider.cs`, `Auth/LoginTokenProvider.cs`. Verify paths trước khi dùng.

## 1. Mode decision matrix

| Mode | Env vars | Token source | DB access | CI-friendly | Khi nào dùng |
|------|----------|--------------|-----------|-------------|--------------|
| **InProcess** | `TEST_DB_CONNECTION` | MintedTokenProvider (in-process JWT) | Real SQL Server qua WAF | ✅ Deterministic | Default. Local dev + CI |
| **Remote** | `BASE_URL` + user-secrets | LoginTokenProvider (auto-login + cache) | Remote server DB | ⚠️ Smoke test | Test staging/dev instance |
| **Skip** | (none) | — | — | ✅ No-op | Local không có DB |

## 2. InProcess mode

`ScenarioFixture.cs:55-73` — default khi không có `BASE_URL` + có `TEST_DB_CONNECTION`.

```
ScenarioFixture constructor
  → no BASE_URL + has TEST_DB_CONNECTION
  → ApiFactory(testDb, jwtSecret) boots ApiHost via WebApplicationFactory
  → DbReset(testDb) — Respawn reset between scenarios
  → Runtime = ScenarioRuntime(MintedToken: new MintedTokenProvider(services), StaticToken: null)
```

### Token: MintedTokenProvider

`Auth/MintedTokenProvider.cs:17-35` — signs real JWT in-process qua `IJwtTokenService`. SYS_ADMIN bypasses all permission checks (`PermissionAuthorizationHandler.cs:32`). Claims match production admin:
- UserId=1, StaffId=6, OrgId=1, RoleId=1, RoleCode=SYS_ADMIN

Không cần login round-trip. Lazy-initialized (1 token per fixture instance).

### Flow

1. `InitializeAsync` → `EnsureStaticDataInitializedAsync` (mimics Program.cs runtime init)
2. Per scenario: `ResetAndSeedAsync(seed)` → Respawn wipe + apply `.sql`
3. `runner.RunAsync(scenario, "InProcess")` → mints token, sends HTTP via WAF in-memory

> **Skip trong InProcess:** Scenario có `requires_sqlserver: true` → `ScenarioRunner.cs:33-35` throw `SkipScenarioException`.

## 3. Remote mode

`ScenarioFixture.cs:36-47` — khi `BASE_URL` set (AUTH_TOKEN không cần nếu có user-secrets + LoginTokenProvider).

```
ScenarioFixture constructor
  → BASE_URL set
  → HttpClient { BaseAddress = baseUrl }
  → Runtime = ScenarioRuntime(MintedToken: null, StaticToken: new LoginTokenProvider(config, httpForAuth))
```

### Token: LoginTokenProvider

`Auth/LoginTokenProvider.cs` — auto-login lần đầu, cache `.auth/token-cache.json`, refresh-on-401. Credentials từ user-secrets (`TestCredentials:AdminUsername`, `TestCredentials:Password`). Xem [test-credentials-setup.md](./test-credentials-setup.md).

> **Fallback resolve:** `Scenario.ResolveTokenProvider` (`Scenario.cs:35-41`) — khi `MintedToken` null (Remote), `sys_admin` auth fallback sang `StaticToken` slot (LoginTokenProvider). Do đó scenarios `auth: sys_admin` works trong Remote.

### Legacy: StaticTokenProvider (AUTH_TOKEN env)

Nếu set cả `BASE_URL` + `AUTH_TOKEN` → dùng paste token thay vì auto-login. `Auth/StaticTokenProvider.cs:12` đọc `AUTH_TOKEN`. Hữu ích khi muốn test với token cụ thể (không phải admin).

## 4. Skip mode

`ScenarioFixture.cs:55-63` — khi không có `TEST_DB_CONNECTION` và không có `BASE_URL`.

```
ScenarioFixture constructor
  → no TEST_DB_CONNECTION, no BASE_URL
  → SkipAll = true
  → Runtime = ScenarioRuntime(null, null)
```

Test method (`ProjectsScenarioTests.cs:27-30`):
```csharp
if (_fixture.SkipAll) return; // no-op pass — không block suite khi không có DB
```

> **Mục đích:** Cho phép build + run test suite local mà không cần DB. Tests pass (no-op) thay vì fail. CI/setup riêng set `TEST_DB_CONNECTION` để chạy thật.

## 5. Token refresh on 401

Chỉ áp dụng Remote mode + LoginTokenProvider.

```
Step sends HTTP with cached token
  → Response 401 Unauthorized
  → (future wire) ScenarioRunner detects 401, calls LoginTokenProvider.RefreshTokenAsync()
  → POST /api/v1/auth/refresh-token {Token: refreshToken}
  → RefreshTokenResponse {Token, ExpiresIn}
  → update cache, retry step
```

> **Current state:** Refresh method có sẵn trong LoginTokenProvider. Wire tự động retry-on-401 trong ScenarioRunner là deferred (future). Hiện: token expire giữa scenario → fail rõ ràng, user delete cache → re-login.

## 6. CLI usage

```bash
# InProcess (default) — cần TEST_DB_CONNECTION
export TEST_DB_CONNECTION="Server=localhost;Database=LandsoftOneTest;Integrated Security=true;TrustServerCertificate=true"
dotnet test tests/ApiHost.ScenarioTests/ApiHost.ScenarioTests.csproj \
    --filter "FullyQualifiedName~ProjectsScenarioTests" \
    --logger "console;verbosity=detailed"

# Remote — cần BASE_URL + user-secrets
cd tests/ApiHost.ScenarioTests
dotnet user-secrets set TestCredentials:AdminUsername "admin@staging.landsoft.vn"
dotnet user-secrets set TestCredentials:Password "<password>"
export BASE_URL="https://staging.landsoft.vn"
dotnet test --filter "FullyQualifiedName~ProjectsScenarioTests" \
    --logger "console;verbosity=detailed"

# Skip (local, no DB) — all scenarios no-op pass
dotnet test tests/ApiHost.ScenarioTests/ApiHost.ScenarioTests.csproj \
    --filter "FullyQualifiedName~ProjectsScenarioTests"
```

> **Filter syntax:** `FullyQualifiedName~{Domain}ScenarioTests` — `~` = contains. Chạy 1 domain thay vì toàn bộ suite.

### Verbose output

`--logger "console;verbosity=detailed"` — hiển thị `ITestOutputHelper.WriteLine` output (console table từ ScenarioReporter). Không có flag này → chỉ thấy pass/fail summary, không thấy step details.

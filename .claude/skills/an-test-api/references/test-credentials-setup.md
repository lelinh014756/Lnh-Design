# Test Credentials Setup

Setup credentials cho cả 2 use case: **ad-hoc mode** (mặc định, shell) và **regression suite** (Remote mode, .NET).

> Source of truth: `Auth/LoginTokenProvider.cs`, `Fixtures/ScenarioFixture.cs:32` (AddUserSecrets), `tests/ApiHost.ScenarioTests/ApiHost.ScenarioTests.csproj:14` (UserSecretsId), auth endpoints `src/ApiHost/Controllers/Auth/AuthController.cs`. Verify paths trước khi dùng.

## 0. Setup dùng chung (1 lần, cho cả ad-hoc + regression)

Cả ad-hoc (shell) và regression Remote (.NET) dùng **cùng user-secrets ID** `landsoft-apihost-scenariotests` (csproj line 14). Setup 1 lần, dùng cho cả 2:

```bash
# Chạy từ bất kỳ cwd nhờ --id
dotnet user-secrets set TestCredentials:AdminUsername "admin@landsoft.vn" --id landsoft-apihost-scenariotests
dotnet user-secrets set TestCredentials:Password "<plain-password>"      --id landsoft-apihost-scenariotests
```

Verify:
```bash
dotnet user-secrets list --id landsoft-apihost-scenariotests
# TestCredentials:AdminUsername = admin@landsoft.vn
# TestCredentials:Password = ********
```

> **Ad-hoc mode** đọc user-secrets qua CLI (`scripts/get-token.sh`/`Get-Token.ps1`), cache credentials ra `.auth/credentials.json` (gitignored) để skip CLI chậm ở các lần sau. Không cần `cd tests/...`.
>
> **Regression Remote mode** đọc user-secrets qua `AddUserSecrets<ScenarioFixture>()` trong process .NET. Cần chạy `dotnet user-secrets` từ trong `tests/ApiHost.ScenarioTests/` (hoặc dùng `--id`).
>
> **Fallback nhanh:** nếu không muốn setup user-secrets, set `$env:AUTH_TOKEN` (ad-hoc) hoặc `$env:AUTH_TOKEN` + `$env:BASE_URL` (regression) với token paste — skip login hẳn.

> **Đổi server (ad-hoc):** sửa `.auth/config.json` → `{ "baseUrl": "https://staging.landsoft.vn" }`. Script resolve theo order: CLI arg > `BASE_URL` env > `.auth/config.json` > default `https://localhost:5005`. Cache token check `baseUrl` match → đổi server tự re-login.

## 1. Auth flow tổng quan (regression Remote mode)

```
Remote mode (BASE_URL set, no AUTH_TOKEN)
  → LoginTokenProvider.GetToken()
      ├── 1. Cache hit + còn hạn (expiresAt > now + 30s) → return token
      └── 2. Cache miss/expired
            → POST /api/v1/auth/login {Username, Password, RememberMe:true, DeviceName}
            → LoginResponse {Token, RefreshToken, ExpiresIn (phút)}
            → save cache (expiresAt = now + ExpiresIn min - 5min safety)

Runtime 401 (caller detects, future wire):
  → RefreshTokenAsync(refreshToken)
      → POST /api/v1/auth/refresh-token {Token: refreshToken}
      → RefreshTokenResponse {Token, RefreshToken, ExpiresIn}
      → update cache
```

## 2. Setup credentials qua user-secrets

`ScenarioFixture.cs:31-32` đã wire `AddUserSecrets<ScenarioFixture>(optional: true)`. User-secrets nằm tại `%APPDATA%/Microsoft/UserSecrets/<id>/secrets.json` (Windows), không commit.

```bash
cd tests/ApiHost.ScenarioTests
dotnet user-secrets set TestCredentials:AdminUsername "admin@landsoft.vn"
dotnet user-secrets set TestCredentials:Password "<plain-password>"
```

Verify:
```bash
dotnet user-secrets list
# Expected:
# TestCredentials:AdminUsername = admin@landsoft.vn
# TestCredentials:Password = ********
```

## 3. LoginTokenProvider contract

`Auth/LoginTokenProvider.cs` — implements `ITokenProvider` (`Auth/ITokenProvider.cs:10-14`, method `string? GetToken()`).

### Cache file

- Path: `tests/ApiHost.ScenarioTests/.auth/token-cache.json`
- Gitignored qua `.gitignore` entry (`tests/ApiHost.ScenarioTests/.auth/`)
- Atomic write: temp file + `File.Move(overwrite:true)` (tránh corruption khi crash mid-write)

### Cache schema

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "abc123def456...",
  "expiresAt": "2026-08-08T15:30:00Z",
  "baseUrl": "https://staging.landsoft.vn"
}
```

### 4-step flow

| Step | Action | Detail |
|------|--------|--------|
| 1 | Đọc cache | `ReadCache()` → nếu `expiresAt > UtcNow + 30s buffer` AND `baseUrl` match → return token |
| 2 | Login (cache miss/expired) | `POST /api/v1/auth/login` với credentials từ user-secrets. RememberMe=true đảm bảo có refresh token. |
| 3 | Save cache | `expiresAt = now + ExpiresIn minutes - 5min safety margin`. Atomic write. |
| 4 | Refresh-on-401 | `POST /api/v1/auth/refresh-token` body `{Token: refreshToken}`. Update cache (chỉ token + expiresAt). |

### Auth endpoints (verified)

| Endpoint | Method | Body | Response | Source |
|----------|--------|------|----------|--------|
| `/api/v1/auth/login` | POST | `LoginRequest` | `ApiResponse<LoginResponse>` | `AuthController.cs:51` |
| `/api/v1/auth/refresh-token` | POST | `RefreshTokenRequest` | `ApiResponse<RefreshTokenResponse>` | `AuthController.cs:194` |

`LoginResponse`: `Token`, `RefreshToken?`, `ExpiresIn` (int — **phút**), `UserId`, `StaffId?`, `Username`, `Email`, `RoleName`, `RoleCode`, `IssuedAt`.

`RefreshTokenResponse`: `Token`, `RefreshToken`, `ExpiresIn` (phút), `UserId`, `Username`, `Email`, `RoleName`, `IssuedAt`.

> **Lưu ý envelope:** ApiResponse dùng `Success` + `Data`. Error info trong `Errors[0].Code` (mảng), không phải `Error.Code`.

### Thread-safety

xUnit test runner chạy parallel. `LoginTokenProvider` dùng `SemaphoreSlim(1,1)` cho cache read/write — chỉ 1 login/refresh trong progress cùng lúc. Concurrent first calls → 1 login, rest wait.

## 4. Cache folder .gitignore

`.gitignore` (root) có entry:
```gitignore
# Scenario test auth cache (real JWT tokens — never commit)
tests/ApiHost.ScenarioTests/.auth/
```

Verify:
```bash
git check-ignore tests/ApiHost.ScenarioTests/.auth/token-cache.json
# Expected: tests/ApiHost.ScenarioTests/.auth/token-cache.json
```

## 5. Troubleshooting

| Triệu chứng | Nguyên nhân | Fix |
|-------------|-------------|-----|
| `InvalidOperationException: Missing TestCredentials:AdminUsername` | User-secrets chưa set | `dotnet user-secrets set TestCredentials:AdminUsername <u>` |
| 401 Unauthorized ngay first call | Sai password / user không tồn tại trên remote | Verify credentials, check remote DB có user |
| Cache invalid sau manual edit | JSON corrupt | `rm tests/ApiHost.ScenarioTests/.auth/token-cache.json`, chạy lại |
| Refresh token expired | TTL hết hạn | Delete cache → login lại tạo refresh token mới |
| 2 login requests chạy song song | Race condition | SemaphoreSlim — nếu vẫn xảy ra, verify `_lock` trong LoginTokenProvider |
| Login fail 403 | Account bị lockout (5 fails) | Unlock account trên remote DB, hoặc dùng account khác |

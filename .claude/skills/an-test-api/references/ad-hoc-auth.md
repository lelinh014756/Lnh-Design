# Ad-hoc Auth Flow

Auth resolution cho mode `test`: lấy Bearer token để gọi API.

> Source of truth: `src/ApiHost/Controllers/Auth/AuthController.cs:51` (login), `:194` (refresh), `tests/ApiHost.ScenarioTests/Auth/LoginTokenProvider.cs` (.NET mirror), `src/Shared/Contracts/Auth/LoginRequest.cs`. Scripts: `scripts/get-token.sh`, `scripts/Get-Token.ps1`.

## 1. Resolution order (mỗi call)

**Token:**
```
GetToken():
  1. $AUTH_TOKEN env set?        → return luôn (user paste, hoặc CI)
  2. Cache hit (.auth/adhoc-token.json, expiresAt > now+30s, baseUrl match)?
                                → return cache.token
  3. Cache hết hạn + refreshToken?
     → POST /api/v1/auth/refresh-token {token: refreshToken}
     → success? update cache, return
     → fail?   invalidate cache, goto 4
  4. Full login:
     → resolve credentials (.auth/credentials.json cache, hoặc user-secrets CLI)
     → POST /api/v1/auth/login {username, password, rememberMe:true, deviceName:"AdhocTest"}
     → cache token+refreshToken+expiresAt (=now+expiresIn-5min)
     → return token
  5. All fail → báo user paste token
```

**Base URL:**
```
GetBaseUrl():
  1. CLI arg (get-token.sh <url> / Get-Token.ps1 -BaseUrl <url>)  → override 1 lần
  2. $BASE_URL env                                                 → session-wide
  3. .auth/config.json { baseUrl }                                 → persistent, do user sở hữu
  4. default https://localhost:5005
```
> Muốn đổi server cố định (vd staging): sửa `.auth/config.json`. Cache token cũng check `baseUrl` match — đổi server → cache miss → re-login tự động.

## 2. Cache / config files

Tất cả tại repo root `.auth/` (gitignored):

### `.auth/config.json` — server endpoint (do user sở hữu)
```json
{ "baseUrl": "https://localhost:5005" }
```
- Đổi server (localhost → staging → prod): sửa `baseUrl` đây. Script resolve theo order: CLI arg > `BASE_URL` env > file này > default `https://localhost:5005`.
- Tách riêng khỏi credentials.json để rõ concern: endpoint ≠ login creds.

### `.auth/adhoc-token.json`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "abc123def456...",
  "expiresAt": "2026-08-08T15:30:00Z",
  "baseUrl": "https://localhost:5005",
  "issuedAt": "2026-08-08T14:30:00Z"
}
```
- Atomic write: temp + move (mirror `LoginTokenProvider.cs:178-185`).
- `expiresAt` = `now + expiresIn(min) - 5min safety` (mirror `:96`).
- `expiresIn` từ `LoginResponse` là **phút** (int), không phải giây.

### `.auth/credentials.json`
```json
{ "username": "admin@landsoft.vn", "password": "..." }
```
- Cache user-secrets để skip `dotnet user-secrets` CLI (chậm 1-2s) sau lần đầu.
- Xóa file này khi đổi password → script tự re-read user-secrets lần tới.

## 3. Login endpoint (verified)

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/v1/auth/login` | POST | `{username, password, rememberMe:true, deviceName}` | `ApiResponse<LoginResponse>` |

`LoginResponse` (`LoginResponse.cs`): `token`, `refreshToken?`, `expiresIn` (int — **phút**), `userId`, `staffId?`, `username`, `email`, `roleName`, `roleCode`, `issuedAt`.

> `rememberMe:true` bắt buộc để server cấp refresh token.

## 4. Refresh endpoint (verified)

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/v1/auth/refresh-token` | POST | `{token: <refreshToken>}` | `ApiResponse<RefreshTokenResponse>` |

`RefreshTokenResponse`: `token`, `refreshToken`, `expiresIn` (phút), `userId`, `username`, `email`, `roleName`, `issuedAt`.

## 5. Setup credentials (1 lần)

User-secrets dùng chung với regression suite (cùng `UserSecretsId`):

```bash
dotnet user-secrets set TestCredentials:AdminUsername "admin@landsoft.vn" --id landsoft-apihost-scenariotests
dotnet user-secrets set TestCredentials:Password "<plain-password>"      --id landsoft-apihost-scenariotests
```

`--id` cho phép chạy từ bất kỳ cwd (không cần `cd tests/...`). Chi tiết: [test-credentials-setup.md](./test-credentials-setup.md).

## 6. HTTPS dev cert

API Dev chạy `https://localhost:5005` với self-signed cert. curl/PS mặc định reject:

| Cách | Khi nào |
|------|---------|
| `curl -k` (default script) | Ad-hoc localhost — đơn giản nhất |
| `dotnet dev-certs https --trust` (1 lần) | Khi muốn browser + curl đều OK không cần `-k` |
| PS `HttpClientHandler.DangerousAcceptAnyServerCertificate` | Get-Token.ps1 dùng sẵn — không cần config thêm |

> Scripts `get-token.sh`/`.ps1` đã xử lý cert (curl `-k`, PS handler) — caller không cần lo.

## 7. Troubleshooting

| Triệu chứng | Nguyên nhân | Fix |
|-------------|-------------|-----|
| 401 ngay first call | Token hết hạn giữa session | Script auto-refresh; nếu vẫn fail → xóa `.auth/adhoc-token.json` → re-login |
| 403 Forbidden | Token OK nhưng role thiếu permission | Dùng account có role SYS_ADMIN, hoặc test endpoint phù hợp role |
| Login fail 403 (lockout) | 5 fail liên tiếp → lock 30 phút | Unlock account trong DB, hoặc đợi 30 phút |
| `Missing TestCredentials` | User-secrets chưa set | Chạy `dotnet user-secrets set ...` (§5) |
| `HTTP transport error` | API không chạy | `dotnet run --project src/ApiHost`, verify `https://localhost:5005` |
| Refresh fail liên tục | Refresh token revoked/expired | Script tự invalidate → full login lại |

## 8. Security notes

- **Token không trong argv:** shell expand `$TOKEN` trước exec → `-H "Authorization: Bearer $TOKEN"` không hiện trong process list trên Linux. Trên Windows, env var có thể thấy qua Process Explorer — chấp nhận được cho dev localhost.
- **KHÔNG echo token** trong output cho user trừ khi user yêu cầu xem.
- Cache `.auth/*.json` chứa **real JWT + plaintext password** — đã gitignored, KHÔNG commit.
- Khi switch account → xóa cả 2 cache để tránh leak token giữa người dùng.

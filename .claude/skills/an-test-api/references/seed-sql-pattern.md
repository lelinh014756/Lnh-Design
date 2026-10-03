# Seed SQL Pattern

Contract cho file `{domain}.seed.sql` — SQL idempotent chạy sau Respawn reset, trước scenario steps.

> Source of truth: `Data/DbReset.cs`, `Scenarios/projects.seed.sql`. Verify paths trước khi dùng.

## 1. Vì sao cần seed

`DbReset.ResetAsync` (`DbReset.cs:49-54`) gọi Respawn — wipe tất cả data **ngoại trừ** `TablesToIgnore` (`DbReset.cs:29-47`). Sau wipe, các row mà scenario phụ thuộc (identity baseline, domain fixtures cho duplicate-code test) bị mất. Seed SQL restore chúng.

Respawn preserve (KHÔNG cần re-seed):
- `idn.Users`, `idn.Organizations`, `idn.Roles`, `idn.Permissions`, `idn.RolePermissions`
- `idn.SystemCategories`, `idn.SystemModules`, `idn.Resources`, `idn.DataScopes`
- `com.Banks`, `com.Countries`, `com.Provinces`, `com.Wards`
- `prj.Categories`, `prj.CategoryDetails`, `prj.PropDicts`, `prj.CustomerDicts`
- HangFire tables, `__EFMigrationsHistory`

## 2. Idempotency contract

Mọi INSERT phải có `WHERE NOT EXISTS` guard hoặc `IF NOT EXISTS`. Respawn reset giữa mỗi scenario, nhưng seed có thể chạy lại nếu test runner retry hoặc defensive insert. Không guard → duplicate key error.

```sql
-- ✅ Đúng: idempotent
INSERT INTO prj.Projects (Id, Code, ...)
SELECT 9001, 'DUP_TEST_001', ...
WHERE NOT EXISTS (SELECT 1 FROM prj.Projects WHERE Code = 'DUP_TEST_001');

-- ❌ Sai: fail khi chạy lần 2
INSERT INTO prj.Projects (Id, Code, ...) VALUES (9001, 'DUP_TEST_001', ...);
```

## 3. Naming convention

- File: `{domain}.seed.sql` (e.g. `projects.seed.sql`, `payment.seed.sql`)
- Vị trí: `tests/ApiHost.ScenarioTests/Scenarios/`
- Copy to output: csproj `<CopyToOutputDirectory>` (đã wire cho Scenarios folder)
- Reference trong YAML: `seed: payment.seed.sql` (relative `Scenarios/`)

## 4. Template

```sql
-- {domain}.seed.sql
-- Self-contained seed for {Domain} scenarios. After Respawn wipes all test data, this
-- script restores the minimum identity + reference rows that {Domain} scenarios depend on.
-- Idempotent: uses NOT EXISTS guards so re-runs after Respawn don't fail on duplicate keys.

-- === Identity baseline (defensive — Respawn preserves idn.Users but be safe) ===
SET IDENTITY_INSERT idn.Users ON;
SET IDENTITY_INSERT idn.Organizations ON;

IF NOT EXISTS (SELECT 1 FROM idn.Organizations WHERE Id = 1)
    INSERT INTO idn.Organizations (Id, Code, Name, IsActive, CreatedAt)
    VALUES (1, N'ORG_001', N'Landsoft Test Org', 1, SYSUTCDATETIME());

IF NOT EXISTS (SELECT 1 FROM idn.Users WHERE Id = 1)
    INSERT INTO idn.Users
        (Id, OrganizationId, RoleId, Username, NormalizedUsername, Email, NormalizedEmail,
         PasswordHash, PasswordAlgo, Status, Type, IsAdmin, IsActive,
         FailedAccessCount, LockoutEndUtc, CreatedAt, TwoFactorEnabled,
         DisplayName, ConcurrencyStamp, SecurityStamp, EmailConfirmed, IsDeleted)
    VALUES
        (1, 1, NULL, N'admin', N'ADMIN', N'admin@landsoft.vn', N'ADMIN@LANDSOFT.VN',
         N'[placeholder-hash]', N'BCrypt', 1, N'admin', 1, 1,
         0, NULL, SYSUTCDATETIME(), 0,
         N'Admin', NEWID(), NEWID(), 1, 0);

SET IDENTITY_INSERT idn.Users OFF;
SET IDENTITY_INSERT idn.Organizations OFF;
GO

-- === Cleanup prior test artifacts (idempotent) ===
DELETE FROM {schema}.{DomainTable} WHERE Code IN ('DUP_TEST_001', 'EXISTING_001');

-- === Domain fixtures for duplicate-code + search scenarios ===
SET IDENTITY_INSERT {schema}.{DomainTable} ON;

INSERT INTO {schema}.{DomainTable}
    (Id, Code, Name, /* required columns */, CreatedAt, CreatedBy)
SELECT
    9001, 'DUP_TEST_001', N'Existing For Dup Test', /* values */, SYSUTCDATETIME(), 1
WHERE NOT EXISTS (SELECT 1 FROM {schema}.{DomainTable} WHERE Code = 'DUP_TEST_001');

INSERT INTO {schema}.{DomainTable}
    (Id, Code, Name, /* required columns */, CreatedAt, CreatedBy)
SELECT
    9002, 'EXISTING_001', N'Existing For Search', /* values */, SYSUTCDATETIME(), 1
WHERE NOT EXISTS (SELECT 1 FROM {schema}.{DomainTable} WHERE Code = 'EXISTING_001');

SET IDENTITY_INSERT {schema}.{DomainTable} OFF;
GO
```

### Required columns

Verify column list từ **entity** (`src/Domain/Entities/{Domain}.cs`) hoặc **DB schema live** (`INFORMATION_SCHEMA.COLUMNS`). Not-null columns phải có giá trị. Cast type rõ ràng: `CAST(1 AS tinyint)`, `CAST(1 AS bit)`.

## 5. GO batch separator

`DbReset.ApplySeedAsync` (`DbReset.cs:62-73`) split trên regex `^\s*GO\s*$` (case-insensitive, line-anchored). Mỗi batch = 1 `SqlCommand.ExecuteNonQuery`.

- `SET IDENTITY_INSERT ... ON` và `OFF` phải cùng batch với INSERT của nó
- Mỗi block logic (identity baseline, domain fixtures) kết thúc bằng `GO`
- `GO` phải ở dòng riêng, không có text khác

## 6. What NOT to seed

Tables trong `TablesToIgnore` (`DbReset.cs:29-47`) đã được Respawn preserve. **Không re-insert** trừ khi defensive (seed có NOT EXISTS guard → safe anyway):

- ❌ `idn.Roles`, `idn.Permissions` — đã preserve
- ❌ `idn.SystemCategories`, `idn.Resources` — đã preserve
- ❌ HangFire tables — đã preserve
- ✅ `idn.Users` (Id=1), `idn.Organizations` (Id=1) — defensive insert (Respawn có thể wipe nếu config thay)

## 7. Anti-patterns

| Anti-pattern | Tại sao sai | Fix |
|--------------|-------------|-----|
| INSERT không có guard | Chạy 2 lần → duplicate key | `WHERE NOT EXISTS` hoặc `IF NOT EXISTS` |
| Dùng `TRUNCATE` cleanup | Respawn đã wipe | Dùng `DELETE WHERE Code IN (...)` cho test artifacts |
| Quên `GO` | Cả block thành 1 batch → `SET IDENTITY_INSERT` conflict | End mỗi block bằng `GO` |
| `SET IDENTITY_INSERT` không wrap | Syntax error ở INSERT | `ON` trước, `OFF` sau, cùng batch |
| Hardcode password hash thật | Security risk | Dùng `N'[placeholder-hash]'` (InProcess mint token, không login thật) |
| Thiếu NOT NULL column | INSERT fail | Verify column list từ entity/DB trước |

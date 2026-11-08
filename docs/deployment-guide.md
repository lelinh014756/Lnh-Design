---
report_type: deployment-guide
generated_at: "2026-10-22T07:52:00+07:00"
period: ""
status: current
source: "/Users/lehonglinh/Documents/DIP/Source/Lnh-design"
generated_by: "docs-manager"
triggered_by: "docs:update"
---

# Deployment Guide: Lnh-design

Lnh-design deploy lên Vercel. Site vừa là showcase vừa là registry CDN — `/r/*.json` được phục vụ từ `public/r/`, còn `/r/internal/*.json` đi qua route handler có Bearer token.

## 1. Pre-deploy Checklist

Chạy tất cả trước khi merge:

| Lệnh | Bắt được lỗi gì |
|---|---|
| `pnpm typecheck` | Type sai, demo source không build được |
| `pnpm lint` | Vi phạm ESLint (kể cả `no-restricted-imports` cho icon) |
| `pnpm i18n:check` | Dictionary VI/EN lệch khoá |
| `pnpm registry:build` | Registry item vi phạm `FORBIDDEN_IMPORTS`, thiếu import trong closure |
| `pnpm build` | Build production đầy đủ |

Nếu có sửa registry item, catalog hoặc manifest thì `registry:build` là bắt buộc — không được bỏ.

## 2. Deploy Order

1. Build và kiểm tra tại local theo mục 1.
2. Mở PR. CI (`.github/workflows/pr-check.yml`) chạy `lint`, `typecheck`, `build`.
3. Merge vào `main`.
4. Vercel tự build lại từ `main`.
5. Smoke test theo mục 4.
6. **Thông báo registry consumer** khi namespace registry, URL, hoặc tên biến môi trường đổi — người dùng copy lệnh cài vào repo họ, đổi tên im lặt sẽ làm lệch cài đặt.

Không deploy giữa chừng một đợt đổi namespace + runtime key: registry output và biến môi trường phải lên cùng lúc.

## 3. Database Migrations

Không áp dụng — dự án không có database.

## 4. Post-deploy Verification

| Kiểm tra | Kỳ vọng |
|---|---|
| `GET /` | 200 |
| `GET /docs` | 200 |
| `GET /r/<public-slug>.json` | 200, JSON hợp lệ |
| `GET /r/internal/<slug>.json` không token | 401 |
| `GET /r/internal/<slug>.json` với `Authorization: Bearer $LNHDESIGN_TOKEN` | 200 |
| `GET /login` | 200 |

Lưu ý khi deploy: `LNHDESIGN_HOMEPAGE` phải trỏ đúng domain đang chạy, nếu không `registry.json` sẽ mang `homepage` sai và lệnh cài của người dùng trỏ sai chỗ.

## 5. Rollback

Vercel có rollback tức thì qua dashboard: Deployments → chọn deployment tốt → **Promote to Production**. Thời gian phục hồi tính bằng phút.

Rollback chỉ đưa **code** về bản cũ. Nếu lần deploy đổi cả tên biến môi trường hoặc namespace registry, phải cập nhật lại `.env` trên Vercel cho khớp, nếu không route handler sẽ trả 401 hàng loạt.

## 6. Incident Escalation

| Vai trò | Người nhận |
|---|---|
| Owner deploy | chưa xác định |
| On-call | chưa xác định |

## 7. Environment Variables

Tên biến sau khi đổi thương hiệu; app đọc qua `src/config/env.ts`.

| Variable | Purpose |
|----------|---------|
| `LNHDESIGN_SESSION_SECRET` | Ký cookie phiên, bắt buộc ≥32 ký tự. Sinh: `openssl rand -base64 48` |
| `LNHDESIGN_USERS` | Tài khoản nội bộ `email:pbkdf2.<iterations>.<salt>.<hash>`, nhiều tài khoản ngăn bằng dấu phẩy |
| `LNHDESIGN_TOKEN` | Auth cho `/r/internal/*.json`, sinh: `openssl rand -hex 32` |
| `LNHDESIGN_HOMEPAGE` | Domain ghi vào `homepage` của `registry.json` lúc build |

Biến này **không** cần set khi build — chúng đọc theo request, không đọc lúc build time, nên `next build` chạy được không có secret. Thiếu `LNHDESIGN_TOKEN` thì `/r/internal/*` từ chối tất cả (đúng, không mở cửa im lặng).

File này chỉ nêu **tên** biến, không ghi giá trị. Mẫu: `.env.example`.

## 8. Known Issues

- **Hash tài khoản phải phân cách bằng dấu chấm**, không phải `$`: trình nạp `.env` của Next expand `$xxx` thành chuỗi rỗng, làm hash bị cắt cụt và mọi lần đăng nhập trả 401 mà không có dấu hiệu gì khác. Định dạng đúng: `pbkdf2.210000.<salt>.<hash>`.
- **File sinh tự động không sửa tay**: `registry.json`, `registry.internal.json`, `public/r/*`, `src/modules/showcase/demos/generated/sources.json`. Đều bị gitignore và được `pnpm demos:build` / `pnpm registry:build` dựng lại.
- **`pnpm build` phải qua `registry:build`** trước `next build` — script `build` đã gọi sẵn theo thứ tự này.
- Đổi tên namespace registry hoặc biến môi trường là **breaking change** với người dùng đã cài; cần ghi vào release note.

## 9. Local dev workflow

```bash
cp .env.example .env.local   # điền các biến bên dưới
pnpm dev                      # http://localhost:3100
```

`pnpm dev` tự chạy `demos:build` trước (script `predev`).

Nếu `pnpm dev` báo `MODULE_TYPELESS_PACKAGE_JSON`, mở dev server cũ đang chạy từ trước khi thêm `"type": "module"` — restart là hết.

## 10. Vercel Project Settings

| Setting | Giá trị |
|---|---|
| Build command | chưa xác định — kiểm tra Vercel dashboard (mặc định nên là `pnpm build`) |
| Node version | chưa xác định — kiểm tra Vercel dashboard (`24`, theo `.nvmrc`) |
| Install command | chưa xác định — kiểm tra Vercel dashboard (`pnpm install --frozen-lockfile`) |

## Change Log

- 2026-10-22: Tạo mới cho Lnh-design; bỏ toàn bộ phần hạ tầng self-hosted và database, giá trị lấy từ `package.json` scripts, `.env.example` và `docs/system-architecture.md`.
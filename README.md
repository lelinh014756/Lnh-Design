# Lnh-design

Registry UI dùng chung cho các dự án React, theo mô hình shadcn. Kèm một site showcase để duyệt, xem demo, đọc mã nguồn và lấy lệnh cài.

Dev ở dự án React bất kỳ chạy một lệnh là có mã nguồn chuẩn nằm ngay trong repo của mình:

```bash
pnpm dlx shadcn@latest add @aurecook/data-table
```

> Namespace registry hiện vẫn là `@aurecook/*` (xem [Trạng thái hiện tại](#trạng-thái-hiện-tại)).

## Bài toán

Mỗi dự án React tự viết lại nút, bảng, form, dialog… dẫn tới giao diện lệch nhau và sửa một lỗi phải sửa ở N repo. Thư viện npm truyền thống giải quyết được "dùng chung" nhưng không cho đội tự sửa; copy tay thì không có nguồn cập nhật.

Mô hình shadcn nằm giữa hai thứ đó: **mã nguồn được copy vào repo người dùng** (sửa tự do), nhưng **nguồn chuẩn nằm một chỗ** (cài lại để lấy bản mới).

## Dành cho ai

| Vai trò | Dùng để làm gì |
|---|---|
| Dev dự án React | Duyệt component/block, xem demo ở nhiều trạng thái, copy lệnh cài hoặc mã nguồn |
| Dev duy trì registry | Thêm/sửa item, viết demo, kiểm tra dependency của từng item |
| Agent AI | Nút "Chép prompt cho AI" sinh sẵn lệnh cài + URL registry item để agent tự cài |

## Hệ thống cung cấp gì

Ba loại item, mỗi loại là một đơn vị cài độc lập:

| Loại | Là gì | Ví dụ |
|---|---|---|
| **Component** | Thành phần cấp app, dựng trên primitive shadcn đã chỉnh theo style `radix-mira` | `app-button`, `actions-button`, `statistics-card`, `app-card` |
| **Block** | Cụm nhiều component ghép thành một mảng giao diện chạy được | `data-table`, `table-core`, `nav-tree`, `auth-login` |
| **Template** | Sản phẩm nhiều trang | `dev-portal` |

Phân nhóm theo Ant Design (7 nhóm): `general`, `layout`, `navigation`, `data-entry`, `data-display`, `feedback`, `other`. Block có thêm facet riêng: `application`, `data-grid`, `solutions`.

**Primitive shadcn không hiện trên giao diện.** Chúng vẫn nằm trong registry (47 item) vì component cấp app phụ thuộc vào chúng — cài `app-button` thì CLI tự kéo `button`. Người dùng cài thứ họ cần, primitive đi theo như dependency.

## Public và nội bộ

| Kênh | Namespace | Truy cập |
|---|---|---|
| Public | `@aurecook/*` | File tĩnh trong `public/r/`, ai cũng cài được |
| Nội bộ | `@aurecook-x/*` | Sau cổng token (`Authorization: Bearer`), CLI nhận 401 nếu thiếu |

Item công khai **không được** phụ thuộc item nội bộ — cài item công khai sẽ kéo item nội bộ theo, rò rỉ qua cây dependency.

### Khai registry ở dự án dùng

Thêm vào `components.json` của dự án React:

```json
{
  "registries": {
    "@aurecook": "https://aurecook.vercel.app/r/{name}.json",
    "@aurecook-x": {
      "url": "https://aurecook.vercel.app/r/internal/{name}.json",
      "headers": { "Authorization": "Bearer ${AURECOOK_TOKEN}" }
    }
  }
}
```

## Site showcase

| Route | Nội dung |
|---|---|
| `/components` | Tổng quan 35 component theo nhóm. Trang từng component (`/components/[slug]`) có nhiều demo, mã nguồn, lệnh cài, dependency |
| `/blocks` | Tab theo loại (`?kind=`) + thẻ nhóm. Mỗi block: Xem trước / Mã nguồn, đổi theme, viewport, phóng to, chọn package manager, chép prompt AI |
| `/templates` | Template nhiều trang |
| `/docs` | Cài đặt, quy ước |
| `/icons` | Icon đã đăng ký trong `AppIcon` (vẽ qua provider đang active), đổi size/stroke, bấm chép tên |
| `/tokens` | Bảng token đọc trực tiếp từ `globals.css` |
| `/internal` | Khu vực nội bộ, cần đăng nhập |

Song ngữ VI/EN. `Cmd/Ctrl + K` tìm xuyên toàn catalog.

Component render demo trực tiếp trong trang. Block render trong iframe vì cần layout, breakpoint riêng và đổi viewport thật.

## Quyết định thiết kế đáng biết

| Quyết định | Lý do |
|---|---|
| Registry item trỏ thẳng vào `src/`, không có bản chép thứ hai | Demo chính là nội dung phát hành — item hỏng thì demo hỏng theo, không có bản thứ hai để lệch |
| Icon đi qua `AppIcon` + provider (hiện lucide), primitive `ui/` giữ lucide | Đổi thư viện bằng một dòng import trong `app-icon.tsx`; ESLint chặn import thẳng thư viện icon ở chỗ khác |
| Dependency suy tự động từ `import`, không khai tay | Khai tay thì mỗi lần thêm import là một cơ hội quên, lỗi chỉ lộ ra ở máy người cài |
| Catalog là data thuần, không chứa JSX | Script Node đọc thẳng được mà không cần bundler |
| Mã nguồn demo trích nguyên văn từ file, không cắt theo marker | Một demo một file nên source không thể lệch với chính nó |

## Cấu trúc

```
src/
├── app/                  Route (components, blocks, templates, docs, icons, tokens, internal, preview, r/internal)
├── components/
│   ├── ui/               Primitive shadcn (ẩn khỏi UI, vẫn trong registry)
│   └── general|layout|navigation|data-entry|data-display|feedback|…   Component cấp app, theo 7 nhóm
├── config/catalog/       Nguồn sự thật: types, components, blocks, templates, index
├── layouts/showcase/     Shell, header, sidebar, tìm kiếm
├── modules/showcase/
│   ├── components/       Card demo, card block, trình duyệt block…
│   ├── demos/            Demo component: {nhóm}/{slug}/{demo-id}.tsx + registry.ts
│   └── previews/         Demo block (iframe)
├── lib/i18n/             Từ điển VI/EN
└── proxy.ts              Cổng chặn /internal/**

scripts/
├── registry-builder/     Sinh registry từ src/ (xem "Bộ build registry")
├── build-demo-sources.mjs  Trích mã nguồn demo cho tab "Mã nguồn"
└── hash-password.mjs     Sinh hash mật khẩu cho tài khoản nội bộ
```

## Chạy local

Cần Node 22 LTS và pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # điền các biến bên dưới
pnpm dev                      # http://localhost:3100
```

| Lệnh | Việc |
|---|---|
| `pnpm dev` | Chạy dev ở cổng 3100 (tự chạy `demos:build` trước) |
| `pnpm build` | `demos:build` → `registry:build` → `next build` |
| `pnpm typecheck` | `demos:build` → `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm i18n:check` | Kiểm VI/EN có cùng cấu trúc khoá |
| `pnpm registry:build` | Sinh `public/r/*.json`, `registry.json`, `registry.internal.json` |
| `pnpm demos:build` | Sinh `src/modules/showcase/demos/generated/sources.json` |

Các file do hai lệnh `*:build` sinh ra đều nằm trong `.gitignore` — chúng suy được hoàn toàn từ `src/`, commit vào chỉ tạo diff trùng lặp.

### Bộ build registry

CLI shadcn không đọc được repo này; nó chỉ tải một JSON cho mỗi item. `scripts/registry-builder` sinh các JSON đó từ code thật:

1. Đọc catalog (`src/config/catalog/*`) và `registry.manifest.json` để biết item nào gồm file nào. Primitive tự suy theo `src/components/ui/{slug}.tsx`, chỉ item nhiều file mới cần khai trong manifest.
2. Nhúng nội dung file vào JSON.
3. Suy phụ thuộc từ `import`: `@/…` trỏ vào file của item khác → `registryDependencies`; gói ngoài → `dependencies` kèm version từ `package.json`.
4. **Fail build** khi: import bị cấm (`@/lib/i18n` — item phải tự mang chuỗi hiển thị), item public phụ thuộc item nội bộ, một file bị hai item cùng nhận, hoặc cây phụ thuộc không khép kín (cài về sẽ thiếu file).
5. Ghi `public/r/*.json` (public, file tĩnh), `registry.json` (danh mục cho UI, không kèm nội dung), `registry.internal.json` (nội bộ, sau cổng token).

**Sửa bất kỳ file nào thuộc một item thì phải chạy lại `registry:build`** — nếu không, người cài nhận bản cũ. `pnpm build` đã gồm bước này.

### Biến môi trường

| Biến | Dùng cho |
|---|---|
| `AURECOOK_SESSION_SECRET` | Ký cookie phiên, ≥ 32 ký tự (`openssl rand -base64 48`) |
| `AURECOOK_USERS` | Tài khoản nội bộ dạng `email:hash`, ngăn bằng dấu phẩy |
| `AURECOOK_TOKEN` | Token cho registry nội bộ (`openssl rand -hex 32`) |
| `AURECOOK_HOMEPAGE` | Domain ghi vào `homepage` của `registry.json` |

Tạo hash mật khẩu:

```bash
node scripts/hash-password.mjs <email> <password>
```

Hash phân cách bằng **dấu chấm** (`pbkdf2.210000.<salt>.<hash>`), không phải `$`: trình nạp `.env` của Next expand `$xxx` thành chuỗi rỗng, hash bị cắt cụt và mọi lần đăng nhập đều trả 401 mà không có dấu hiệu gì.

## Thêm một component mới

1. Viết file đúng nhóm: `src/components/data-entry/currency-input.tsx`
2. Export trong `index.ts` của nhóm. Không có barrel gốc — import theo nhóm hoặc theo file.
3. Khai vào `src/config/catalog/components.ts` (slug, tên, nhóm, mô tả VI/EN).
4. Viết demo, mỗi ví dụ một file:
   - `src/modules/showcase/demos/data-entry/currency-input/basic.tsx`
   - `src/modules/showcase/demos/data-entry/currency-input/index.ts` (metadata + thứ tự)
   - khai slug vào `src/modules/showcase/demos/registry.ts`

Luật viết demo: chỉ import từ `@/components/*` và gói có trong `package.json` (source đi thẳng cho người dùng copy); không tự mount `TooltipProvider`/`Toaster`; overlay mở bằng nút, không `defaultOpen`.

## Trạng thái hiện tại

Source này vừa được tách khỏi monorepo. Những điểm chưa khớp:

| Vấn đề | Hệ quả | Cần làm |
|---|---|---|
| Namespace `@aurecook/*`, biến môi trường `AURECOOK_*`, domain `aurecook.vercel.app` còn nguyên | Tên thương hiệu cũ lọt vào lệnh cài mà người dùng sẽ copy | Chốt tên mới rồi đổi đồng loạt: `REGISTRY_NAME` + `FORBIDDEN_IMPORTS` trong `scripts/registry-builder/config.mjs`, `registryItemName()` trong catalog, env, homepage, `site.ts`, rồi chạy lại `registry:build` |
| Chỉ 8/35 component cấp app và 3/8 block có demo (thiếu: `table-core`, `table-chrome`, `data-table-url`, `nav-tree`, `auth-login`) | Trang hiện "Chưa có bản demo" | Viết dần theo nhóm |
| Gói npm token/tailwind preset/eslint config thuộc monorepo cũ | Chưa có kênh khoá version cho token | Quyết định có tách lại không |

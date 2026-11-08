# Reuse Catalog — Lnh-design

Danh bạ component, hook và quy ước dùng chung của Lnh-design (registry UI theo mô hình shadcn, style `radix-mira`). Người lập plan và người viết code tra ở đây **trước khi tạo thứ mới**.

**Quy tắc dùng**
- Đường dẫn tính từ thư mục gốc repo. Trước khi đưa một dòng vào plan, kiểm tra file còn tồn tại (`Glob`/`ls`); nếu không còn, báo trong plan, đừng dùng.
- **Nguồn sự thật của danh mục là `src/config/catalog/components.ts`** (component), `blocks.ts` (block) và `registry.manifest.json` (file của từng item). Bảng dưới sinh từ đó ngày 2026-10-18; khi lệch, tin các file nguồn và sửa bảng.
- Cần mà không có dòng nào khớp → ghi vào mục "Catalog gaps" của plan, đừng tự tạo component trùng chức năng.
- Thêm hoặc đổi component dùng chung thì cập nhật dòng tương ứng trong cùng thay đổi.

## Ràng buộc cứng của repo

| Ràng buộc | Chi tiết | Nơi kiểm |
|-----------|----------|----------|
| Icon | Chỉ dùng `<AppIcon icon="tên" />` (`src/components/general/app-icon.tsx`). **Cấm** import thẳng `lucide-react` hoặc `@hugeicons/*` ngoài `src/components/general/icon-providers/**` và `src/components/ui/**` | ESLint `no-restricted-imports` (error) |
| Chuỗi trong component của registry | **Không** import `@/lib/i18n` trong file thuộc một registry item; component tự mang chuỗi qua prop hoặc hằng. Chuỗi của site showcase đi qua dictionary `src/lib/i18n/dictionaries/{vi,en}/*.json` | `FORBIDDEN_IMPORTS` trong `scripts/registry-builder/config.mjs` |
| Import | Từ `@/components/*` theo nhóm hoặc theo file; không có barrel gốc. Cấm alias `@lnhdesign/*` | registry-builder |
| Tên | File kebab-case, component PascalCase trùng tên file | `docs/code-standards.md` |
| Slug | Một `slug` dùng ở 3 chỗ: thư mục demo, tên registry item, tham số `/preview/[name]` | `src/config/catalog/types.ts` |
| Dependency | Cây dependency của item phải khép kín; item public không kéo theo item internal | `scripts/registry-builder/verify-closure.mjs` |
| Kiểu | TypeScript `strict`; `no-explicit-any` ở mức cảnh báo | `tsconfig.json`, `eslint.config.mjs` |
| Style | Tailwind v4 + CVA; token màu trong `src/app/globals.css`; không inline style cho logic | `docs/code-standards.md` |
| File sinh tự động | **Không sửa tay** `src/modules/showcase/demos/generated/sources.json`, `registry.json`, `public/r/*` | do `pnpm demos:build` và `pnpm registry:build` sinh |

## Component cấp app (35)

| Slug | Tên | Nhóm | Mô tả | File chính |
|------|-----|------|-------|-----------|
| `app-button` | `AppButton` | general | Họ nút hệ thống: loading, xác nhận trước khi chạy, màu theo intent, làm mới có khoá. | `src/components/general/app-button.tsx` |
| `actions-button` | `ActionsButton` | general | Cụm hành động trên dòng bảng, tự gộp vào menu khi chật. | `src/components/general/actions-button.tsx` (+1 file khác: `src/config/actions-button.ts`) |
| `mode-toggle-button` | `ModeToggleButton` | general | Nút đổi sáng/tối, tránh nháy khi hydrate. | `src/components/general/mode-toggle-button.tsx` |
| `app-heading` | `AppHeading` | general | Tiêu đề mục có cỡ chữ và khoảng cách chuẩn. | `src/components/general/app-heading.tsx` |
| `app-title` | `AppTitle` | general | Tiêu đề trang kèm mô tả phụ. | `src/components/general/app-title.tsx` |
| `app-icon` | `AppIcon` | general | Tra icon theo tên qua provider (hugeicons/lucide); đổi thư viện bằng một dòng import. | `src/components/general/app-icon.tsx` (+ `icon-providers/`) |
| `app-content-shell` | `AppContentShell` | layout | Khung nội dung trang: bề rộng, padding, khoảng cách dọc. | `src/components/layout/app-content-shell.tsx` |
| `app-card` | `AppCard` | layout | Thẻ nội dung cấp app, viền thay vì đổ bóng. | `src/components/layout/app-card.tsx` |
| `app-toolbar` | `AppToolbar` | layout | Thanh công cụ trên bảng/danh sách. | `src/components/layout/app-toolbar.tsx` |
| `statistics-card` | `StatisticsCard` | layout | Thẻ chỉ số kèm delta và sparkline. | `src/components/layout/statistics-card.tsx` |
| `statistics-card-grid` | `StatisticsCardGrid` | layout | Lưới thẻ chỉ số, tự xuống dòng theo breakpoint. | `src/components/layout/statistics-card-grid.tsx` |
| `chart-card` | `ChartCard` | layout | Thẻ biểu đồ có tiêu đề, trạng thái rỗng và lỗi. | `src/components/layout/chart-card.tsx` |
| `page-background` | `PageBackground` | layout | Lớp nền trang theo token, dùng cho landing. | `src/components/layout/page-background.tsx` (+1 file khác) |
| `home-section-header` | `HomeSectionHeader` | layout | Đầu mục section landing kèm link xem thêm. | `src/components/layout/home-section-header.tsx` |
| `nav-item-recursive` | `NavItemRecursive` | navigation | Render nav lồng nhiều cấp, tự bung nhánh đang active. | `src/components/navigation/nav-item-recursive.tsx` |
| `app-input` | `AppInput` | data-entry | Ô nhập cấp app: icon, nút xoá, hiện/ẩn mật khẩu. | `src/components/data-entry/app-input.tsx` |
| `app-field` | `AppField` | data-entry | Ghép label, mô tả, lỗi quanh một control bất kỳ. | `src/components/data-entry/app-field.tsx` |
| `floating-input` | `FloatingInput` | data-entry | Ô nhập có nhãn nổi lên khi focus. | `src/components/data-entry/floating-input.tsx` |
| `search-input` | `SearchInput` | data-entry | Ô tìm kiếm có debounce và nút xoá. | `src/components/data-entry/search-input.tsx` |
| `status-switch` | `StatusSwitch` | data-entry | Công tắc trạng thái có xác nhận và pending. | `src/components/data-entry/status-switch.tsx` |
| `toggle-group-theme` | `ToggleGroupTheme` | data-entry | Chọn sáng/tối/theo hệ thống bằng toggle group. | `src/components/data-entry/toggle-group-theme.tsx` |
| `appearance-picker` | `AppearancePicker` | data-entry | Đổi kiểu nền sidebar bằng ô xem trước. | `src/components/data-entry/appearance-picker.tsx` (+2 file khác) |
| `app-avatar` | `AppAvatar` | data-display | Avatar tự sinh chữ cái và màu từ tên. | `src/components/data-display/app-avatar.tsx` |
| `app-stepper` | `AppStepper` | data-display | Wizard nhiều bước: guard async, chế độ tuần tự, 6 bố cục. | thư mục `src/components/data-display/app-stepper/` |
| `app-tooltip` | `AppTooltip` | data-display | Tooltip rút gọn cho trường hợp chỉ có text. | `src/components/data-display/app-tooltip.tsx` |
| `badge-status` | `BadgeStatus` | data-display | Badge trạng thái nghiệp vụ, map sẵn màu và icon. | `src/components/data-display/badge-status.tsx` |
| `marquee` | `Marquee` | data-display | Dải chạy vô tận, dừng khi hover. | `src/components/data-display/marquee.tsx` |
| `resize-image` | `ResizeImage` | data-display | Ảnh giữ tỉ lệ kèm skeleton lúc tải. | `src/components/data-display/resize-image.tsx` |
| `app-dialog` | `AppDialog` | feedback | Dialog cấp app: footer chuẩn, khoá lúc submit. | `src/components/feedback/app-dialog.tsx` |
| `app-sheet` | `AppSheet` | feedback | Sheet cấp app cho form phụ, chặn đóng khi bẩn. | `src/components/feedback/app-sheet.tsx` |
| `alert-dialog-status` | `AlertDialogStatus` | feedback | Hộp xác nhận theo trạng thái: info, cảnh báo, nguy hiểm. | `src/components/feedback/alert-dialog-status.tsx` |
| `note-confirm-dialog` | `NoteConfirmDialog` | feedback | Xác nhận kèm ô ghi chú bắt buộc. | `src/components/feedback/note-confirm-dialog.tsx` |
| `ping-indicator` | `PingIndicator` | feedback | Chấm trạng thái có hiệu ứng lan. | `src/components/feedback/ping-indicator.tsx` |
| `fallback-shell` | `FallbackShell` | feedback | Khung rỗng/lỗi/đang tải dùng chung cho mọi trang. | `src/components/feedback/fallback-shell.tsx` |
| `illustrations` | `Illustrations` | feedback | Bộ hình minh hoạ trạng thái rỗng, lỗi, đang tải. | thư mục `src/components/illustrations/` |

Ngoài bảng: `CopyButton` (`src/components/general/copy-button.tsx`) có trong thư viện nhưng chưa có mục trong `components.ts`; kiểm tra trước khi coi là một registry item.

## Primitive shadcn (48)

Nằm ở `src/components/ui/{slug}.tsx`, giữ nguyên theo shadcn để `shadcn add` không phải sửa tay: accordion, action-bar, alert, alert-dialog, aspect-ratio, avatar, badge, button, calendar, card, carousel, chart, checkbox, collapsible, command, dialog, direction, drawer, dropdown-menu, faceted, field, input, input-group, item, kbd, label, motion-toggle-group, navigation-menu, popover, scroller, select, separator, sheet, sidebar, skeleton, slider, sonner, sortable, spinner, stepper, switch, table, tabs, textarea, theme-provider, toggle, toggle-group, tooltip.

## Block (8)

Khai trong `src/config/catalog/blocks.ts`: `table-core`, `table-chrome`, `data-table`, `data-table-url`, `stats-overview`, `nav-tree`, `empty-states`, `auth-login`.

| Cần | Dùng | Nơi |
|-----|------|-----|
| Bảng dữ liệu đầy đủ | block `data-table` (port từ tablecn) | `src/components/data-table/`, hook ở `src/hooks/table/` |
| Khung bảng, thanh công cụ bảng | block `table-core`, `table-chrome` | `src/hooks/table/`, `src/components/table/` |
| Điều hướng nhiều cấp | block `nav-tree` | `src/config/nav/` |

## Hook và lib dùng chung

| Cần | Dùng | Đường dẫn |
|-----|------|-----------|
| Breakpoint, media query | `use-breakpoint`, `use-media-query`, `use-mobile` | `src/hooks/` |
| Debounce, ref, hiệu ứng an toàn SSR | `use-debounced-callback`, `use-callback-ref`, `use-as-ref`, `use-lazy-ref`, `use-isomorphic-layout-effect`, `use-mounted` | `src/hooks/` |
| Kích thước cửa sổ, badge tràn | `use-window-size`, `use-badge-overflow` | `src/hooks/` |
| Gộp class | `cn` | `src/lib/utils.ts` |
| Gộp ref, id, định dạng | `compose-refs`, `id`, `format` | `src/lib/` |
| Mã hoá chuỗi hiển thị của **site** (không dùng trong registry item) | `@/lib/i18n` | `src/lib/i18n/` |

## Công thức thêm một component vào registry

1. **Mã nguồn:** `src/components/{nhóm}/{slug}.tsx`, nhóm là một trong `general`, `layout`, `navigation`, `data-entry`, `data-display`, `feedback`, `other`; thêm export vào `src/components/{nhóm}/index.ts`.
2. **Catalog:** thêm `app("{slug}", "Tên", ["{nhóm}"], "mô tả vi", "mô tả en", { isNew: true })` vào `src/config/catalog/components.ts`.
3. **Manifest:** thêm `"{slug}": { "files": [...] }` vào `registry.manifest.json`, liệt kê file nguồn và mọi file hook, lib, config mà component import (cây phải khép kín).
4. **Preview:** thêm `{slug}: () => <JSX />` vào map của nhóm trong `src/modules/showcase/previews/{nhóm}.tsx` (kiểu `PreviewMap`). Hiện có file cho `general`, `layout`, `navigation`, `data-entry`, `data-display`, `feedback` và `data-table`; nhóm `other` chưa có file preview, nên component thuộc nhóm đó phải tạo file và gộp vào `previews/index.ts`.
5. **Demo:** `src/modules/showcase/demos/{nhóm}/{slug}/{demo-id}.tsx` cùng `index.ts` xuất `demos: ComponentDemo[]`, rồi khai trong `src/modules/showcase/demos/registry.ts` (`demoModules`).
6. **Chuỗi và icon:** component tự mang chuỗi, icon qua `AppIcon`; chuỗi của site vào dictionary vi và en, kiểm bằng `pnpm i18n:check`.
7. **Kiểm tra:** `pnpm typecheck`, `pnpm lint`, và `pnpm registry:build` khi thay đổi registry hoặc manifest.

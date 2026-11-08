---
report_type: design-guidelines
generated_at: "2026-10-22T07:50:00+07:00"
period: ""
status: current
source: "/Users/lehonglinh/Documents/DIP/Source/Lnh-design"
generated_by: "docs-manager"
triggered_by: "docs:update"
---

# Design Guidelines: Lnh-design

## 1. Design Principles

- **Registry trước, trang sau.** Đây là repo component registry + showcase, không phải product app. Một component chỉ "xong" khi nó có source trong `src/components/<group>/`, entry trong catalog, entry trong manifest, và demo dùng được.
- **Không phụ thuộc nặng.** Source được copy thẳng vào repo người dùng, nên component không được kéo dependency ngoài `package.json`.
- **Nhất quán trước khi đẹp.** Ưu tiên khớp token sẵn có hơn là tạo giá trị mới.
- **Không AI-look.** Áp dụng `.claude/rules/anti-ai-look.md` — đọc mục đó trước khi thêm UI mới.

## 2. Foundations

### 2.1 Colors

Toàn bộ màu khai báo bằng CSS variable trong `src/app/globals.css`, định dạng `oklch()`. Không hardcode mã màu trong component.

| Token | Light | Dark |
|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.508 0.258 265.14)` | `oklch(0.62 0.22 265.14)` |
| `--brand-secondary` | `oklch(0.537 0.248 291.51)` | `oklch(0.62 0.2 291.51)` |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |

- `--brand-accent-2` gán thẳng bằng `--brand-secondary`: dự án chỉ có **một** brand, không có khối `[data-brand="..."]`.
- Với màu phái sinh (soft, hover, ring) lấy giá trị từ token gần nhất rồi hạ lightness — không chọn màu mới.
- Đổi màu để thử trực tiếp tại trang `/tokens`.

### 2.2 Typography

- Font chính: **Inter** (`--font-sans`), font mono: **Geist Mono** (`--font-mono`), nạp qua `next/font/google` trong `src/app/layout.tsx`.
- `--font-heading` trỏ về `--font-sans` — heading không dùng font riêng.
- Heading thêm `tracking-tight`; `line-height` đổi theo cỡ chữ (`leading-5`/`leading-6`), không dùng `leading-7` cho mọi thứ.
- Không phải mọi text đều `font-medium` — phân bố `font-normal`/`font-medium`/`font-semibold` theo vai trò.

### 2.3 Spacing & Layout

- Base radius `--radius: 0.625rem` (~10px). Thang radius suy ra từ nó: `--radius-sm` = ×0.6, `--radius-md` = ×0.8, `--radius-lg` = ×1, `--radius-xl` = ×1.4, `--radius-2xl` = ×1.8, `--radius-4xl` = ×2.6.
- **Input** dùng `rounded-md` hoặc `rounded-sm`, không dùng `rounded-lg` mặc định.
- `rounded-4xl` chỉ dành cho badge/pill; avatar dùng `rounded-full`.
- Gap xen kẽ `gap-3`/`gap-4`/`gap-5`; padding vary `p-3`/`p-4`/`p-5`. Tránh một giá trị lặp lại máy móc.
- Card ở khu admin dựng bằng **border, không shadow**. Shadow chỉ khi thật sự cần phân cấp độ sâu.
- Motion: `duration-150`/`200`/`300` trộn nhau; `ease-out` cho exit, `ease-in-out` cho đổi trạng thái.

## 3. Components

Danh sách đầy đủ và trạng thái demo nằm ở `src/config/catalog/components.ts`. Repo có **hai layer component** — đừng nhầm chúng với nhau:

- **Primitive `src/components/ui/`** (`button`, `input`, `card`…) — bản gốc shadcn, style `radix-mira`.
- **App component `src/components/<group>/app-*`** — bọc primitive, có style riêng; **đây mới là thứ showcase render và thứ consumer nên dùng**.

| Nhóm | Component | Ghi chú |
|---|---|---|
| general | `button`, `app-icon` | Variant/size khai báo bằng CVA trong từng file |
| data-entry | `input`, `checkbox`, `select`, `calendar`, `form` (`field`) | Input luôn `rounded-md`, không `rounded-lg` |
| data-display | `card`, `badge`, `avatar`, `table`, `chart`, `carousel`, `collapsible` | Card border-based |
| feedback | `alert`, `dialog`, `alert-dialog`, `sheet`, `toast` (`sonner`), `spinner` | Dialog/sheet `rounded-xl` |
| navigation | `command`, `dropdown-menu`, `navigation-menu`, `stepper` | – |
| layout | `sidebar`, `scroller`, `separator`, `aspect-ratio`, `drawer` | Sidebar có `data-sidebar-style` độc lập brand |
| other | `direction`, `skeleton` | – |

### App layer (`src/components/<group>/app-*`)

| Nhóm | Component |
|---|---|
| general | `app-button`, `app-icon`, `app-avatar`, `app-heading`, `app-title` |
| data-entry | `app-input`, `app-field` |
| data-display | `app-card` |
| feedback | `app-dialog`, `app-sheet`, `app-tooltip` |
| layout | `app-toolbar`, `app-content-shell` |
| other | `app-stepper` |

Sửa `button.tsx` trong `ui/` **không** đổi được UI showcase — phải sửa `app-button.tsx`. Trước khi thêm component mới, kiểm tra cả hai layer: `docs/design-patterns/reuse-catalog.md`.

Chi tiết variant/size: đọc CVA trong file tương ứng — không suy đoán.

### Data table

`src/components/data-table/` là bảng dữ liệu đầy đủ, chia thư mục theo lớp: `body/`, `head/`, `footer/`, `toolbar/`, `menus/`, `inputs/`, `hooks/`, `lib/`, `url/`, `table/`. Trạng thái bảng (sort, filter, page) giữ trong URL qua `nuqs` — xem `src/components/data-table/url/`.

## 4. Patterns

- **Empty / Error / Loading**: dùng `skeleton` cho loading; empty state dùng copy hội thoại, không phải "No data"; lỗi hiển thị message người đọc được, không phải mã lỗi.
- **Confirm**: `alert-dialog` cho hành động không hoàn tác được; không dùng `window.confirm`.
- **Sheet + Form**: overlay `sheet`/`dialog` chứa form, submit trong overlay, đóng sau khi thành công.
- **URL state**: bộ lọc/sort của bảng lưu vào query string (`nuqs`) để link chia sẻ giữ được ngữ cảnh.
- **Icon**: luôn qua `<AppIcon icon="..." />` từ `@/components/general/app-icon`. Thư viện icon chỉ được import trong `src/components/general/icon-providers/` và `src/components/ui/` — ngoài ra ESLint chặn.

## 5. Accessibility

- Điều khiển tương tác phải là phần tử có nghĩa: `<button>` cho hành động, `<a>`/`Link` cho điều hướng.
- Mọi input có `<label>` liên kết; placeholder không thay thế label.
- Icon-only button cần `aria-label`.
- Focus phải nhìn thấy — không `outline: none` trừ khi thay bằng ring tương đương.
- Overlay dùng focus trap và đóng bằng `Esc` (`dialog`, `sheet`, `command`, `dropdown-menu` đã có sẵn).
- Tương phản chữ/nền đủ WCAG AA; kiểm tra cả light và dark vì token đổi theo theme.

## 6. Responsive Behavior

- Bố cục co giãn theo breakpoint Tailwind, không set width cứng.
- Bảng dữ liệu trên viewport hẹp chuyển sang dạng danh sách card, hoặc cuộn ngang có cảnh báo.
- Sidebar (`src/components/ui/sidebar.tsx`) tự thu gọn theo viewport; không dựa vào JS để ẩn/hiện layout chính.
- Touch target tối thiểu 44×44px trên mobile.

## 7. References

- `src/app/globals.css` — token màu, radius, font.
- `src/config/catalog/components.ts` — danh mục component và layer.
- `docs/design-patterns/reuse-catalog.md` — bản đồ tái sử dụng, đọc trước khi tạo component mới.
- `.claude/rules/anti-ai-look.md` — rule chống AI-look (bắt buộc).
- `src/app/tokens/` — trang xem token trực tiếp.
- `src/app/globals.css` phần cuối — ghi chú cơ chế `data-sidebar-style`.

## Change Log

- 2026-10-22: Tạo từ `docs/design-guidelines.md` của Eco-Farm-web, điền lại toàn bộ giá trị từ source Lnh (`globals.css`, `layout.tsx`, catalog components), bỏ nội dung Eco-specific.
# Mẫu phase dành cho CLI thực thi — Lnh-design

Mẫu cho mỗi file `phase-XX-*.md` khi plan sẽ được giao cho một CLI (model có thể yếu hơn) thực thi từng phase một. Mục tiêu: người chạy **không phải đoán**.

Mẫu **giữ đúng các tiêu đề phase của `.claude/rules/project-context.md`** (Overview, Requirements, Architecture, Implementation Steps, Todo List, Risk & Security) và thêm các mục dành cho CLI; không thay thế chúng.

## Quy tắc khi viết phase

1. **Ngôn ngữ:** viết phase bằng tiếng Anh vì người đọc là CLI thực thi; `plan.md` có thêm một dòng tóm tắt tiếng Việt ở đầu cho người đọc.
2. **Kích thước:** mỗi phase tối đa 3 file và khoảng 150 dòng; lớn hơn thì tách phase. Thêm một component vào registry thường chạm 5 nơi (nguồn, catalog, manifest, preview, demo), nên tách thành nhiều phase theo thứ tự trong "Công thức" của catalog.
3. **Tái sử dụng trước:** mọi thứ cần dùng phải tra `docs/design-patterns/reuse-catalog.md` và `src/config/catalog/components.ts`, kiểm tra đường dẫn còn tồn tại, rồi đưa vào bảng Reuse. Thứ không có thì ghi vào "Catalog gaps".
4. **Code vừa đủ:** viết code đầy đủ cho phần mới, nhỏ, dễ sai (type, props, mục catalog, mục manifest, mục preview). Component lớn thì ghi "mirror `đường-dẫn`" kèm chữ ký, không chép lại cả file.
5. **Nói làm gì, kèm lý do:** mỗi ràng buộc có một vế vì sao; không chỉ ghi "đừng".
6. **Không bịa:** chỗ plan chưa biết thì ghi vào Stop conditions, không điền đoán.
7. **Không nhắc plan trong code:** comment và tên file không chứa tên phase, mã finding hay nhãn audit (theo `.claude/rules/review-audit-self-decision.md`).
8. **Ràng buộc của repo phải lặp lại trong phase có liên quan:** icon chỉ qua `AppIcon`; không import `@/lib/i18n` trong file của registry item; không sửa tay file sinh tự động (`demos/generated/sources.json`, `registry.json`, `public/r/*`); `slug` giống nhau ở thư mục demo, tên registry item và route preview.
9. **Một phase = một lần chạy:** phase sau chỉ bắt đầu khi phase trước qua Verify.

## Khung file

````markdown
# Phase XX — <verb + object>

## Overview
<1-3 sentences: what this phase delivers and why it matters.>

## Requirements
- <Checkable requirement.>

## Architecture
### Reuse (verified against the catalog)
| Need | Use | Path | Mirror file |
|------|-----|------|-------------|
| <need> | <component/hook> | <path> | <file to imitate> |

### Catalog gaps
- <Needed thing not found in the catalog, or "none".>

## Implementation Steps
### Files
| Action | Path | What changes |
|--------|------|--------------|
| create / modify / delete | <full path> | <one line> |

Only these files may be changed in this phase. Report anything else instead of editing it.

### Signatures and types
```ts
<type / props signatures>
```

### Code (new pieces only)
```tsx
<complete code for the small new pieces: component props, catalog entry, manifest entry, preview entry>
```

### Mirror
- <Large component: "follow `path`", with the exact parts to copy and the parts to change.>

### Edge cases
- <Case>: <what to do and why>.

## Todo List
- [ ] <Ordered, checkable step.>

## Verify
Run in order, fix failures caused by this phase before stopping:
1. `pnpm typecheck` (runs the demo source step, then `tsc --noEmit`)
2. `pnpm lint`
3. `pnpm i18n:check` — only if a dictionary file changed
4. `pnpm registry:build` — only if a registry item, `components.ts`, `blocks.ts` or `registry.manifest.json` changed; if a hook blocks the command, stop and report instead of working around it
Expected: no new errors. List pre-existing errors separately.

## Stop conditions
Stop and report instead of guessing if:
- <Missing information, e.g. the category a new component belongs to is not stated.>
- <A needed component is not in the catalog and no mirror file fits.>
- <A change would require editing a generated file or importing `@/lib/i18n` into a registry item.>

## Risk & Security
- <Risk and the mitigation.>
````

## plan.md

Giữ định dạng của `an-plan` (frontmatter, danh sách phase, phụ thuộc, blocker). Thêm đầu file:
- Một dòng tóm tắt tiếng Việt.
- Thứ tự chạy các phase và phase nào cần dừng chờ người dùng.
- Danh sách "Catalog gaps" tổng hợp của mọi phase.

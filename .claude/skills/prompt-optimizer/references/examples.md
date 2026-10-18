# Ví dụ trước/sau

Đường dẫn trong ví dụ chỉ để minh hoạ. Khi chạy thật, skill xác thực bằng `Glob`/`ls` rồi mới dùng (bước 4 của `SKILL.md`). Ví dụ dựa trên cấu trúc của Lnh-design (registry UI theo mô hình shadcn).

## Ví dụ 1 — Full (thêm một component vào registry)

### Prompt thô

```
thêm component AppTag vào thư viện, nhãn nhỏ có nút xoá, nhóm data-display. nhớ khai vào catalog
với registry, làm preview với demo luôn, icon dùng AppIcon. xong chạy typecheck với lint
```

### Đã chỉnh gì

- Tách việc thành 3 khối: viết component, đăng ký vào registry (catalog, manifest, preview), làm demo.
- Thêm bước đối chiếu với catalog để không tạo trùng chức năng với `BadgeStatus`.
- Ghi sẵn ràng buộc của repo: icon chỉ qua `AppIcon`, không import `@/lib/i18n` trong file của registry item, không sửa tay file sinh tự động.
- Chốt báo cáo cuối 6 mục, tiếng Việt, đọc dưới 2 phút.

### Bản tiếng Việt (để đọc)

````markdown
# Thêm component AppTag (nhãn có nút xoá) vào registry

## Vai trò
Bạn là senior engineer React/TypeScript, làm việc trong registry UI theo mô hình shadcn (Lnh-design), giỏi thiết kế component tái sử dụng và đăng ký chúng vào registry.

## 1. Mục tiêu
Thêm component `AppTag` (nhãn nhỏ có nút xoá) vào nhóm `data-display`, đăng ký vào catalog, manifest và preview, và làm demo. Điều này quan trọng vì mọi component trong thư viện phải có đủ năm mảnh (nguồn, catalog, manifest, preview, demo) thì mới xuất hiện đúng trên showcase và phát hành được.
Kết quả được đọc bởi developer đã giao việc; báo cáo phải đọc xong dưới 2 phút.

## 2. Phạm vi
**Đọc:** `docs/design-patterns/reuse-catalog.md`; `src/config/catalog/components.ts`; `registry.manifest.json`; `src/components/data-display/badge-status.tsx` (mẫu); `src/modules/showcase/previews/data-display.tsx`; `src/modules/showcase/demos/registry.ts`.
**Chỉ được sửa:** `src/components/data-display/app-tag.tsx` (tạo mới) và `index.ts` cùng thư mục; `src/config/catalog/components.ts`; `registry.manifest.json`; `src/modules/showcase/previews/data-display.tsx`; thư mục demo mới `src/modules/showcase/demos/data-display/app-tag/` và `src/modules/showcase/demos/registry.ts`.
**Ghi vào báo cáo thay vì sửa:** mọi file khác, kể cả các file sinh tự động.

## 3. Phân tích trước khi sửa code
1. Đọc catalog và `badge-status.tsx`, xác nhận chưa có component cùng chức năng với `AppTag`.
2. Ghi lại cấu trúc một mục catalog, một mục manifest, một mục preview và một demo của component có sẵn gần nhất.

## 4. Yêu cầu triển khai
### 4.1 Component
- Tạo `app-tag.tsx` theo phong cách `badge-status.tsx`; icon của nút xoá dùng `<AppIcon />`, không import thẳng thư viện icon, vì ESLint chặn việc đó.
- Component tự mang chuỗi qua prop hoặc hằng, không import `@/lib/i18n`, vì registry-builder từ chối import này.
### 4.2 Đăng ký
- Thêm mục `app("app-tag", "AppTag", ["data-display"], ...)` vào `components.ts` với mô tả vi và en.
- Thêm mục `"app-tag"` vào `registry.manifest.json` liệt kê file nguồn và mọi file mà component import.
- Thêm preview vào `previews/data-display.tsx`.
### 4.3 Demo
- Tạo `demos/data-display/app-tag/{demo-id}.tsx` và `index.ts` xuất `demos: ComponentDemo[]`, rồi khai trong `demos/registry.ts`.
- `slug` là `app-tag` ở cả thư mục demo, mục catalog và mục manifest.

## 5. Quy trình
1. Đọc các file ở mục 2.
2. Làm theo thứ tự 4.1 → 4.2 → 4.3.
3. Chạy `pnpm typecheck`, `pnpm lint` và `pnpm registry:build`; sửa lỗi do thay đổi của bạn gây ra.

## 6. Tiêu chí nghiệm thu
Chỉ xem là xong khi đủ các điều kiện:
- `AppTag` có đủ nguồn, mục catalog, mục manifest, preview và demo, cùng một `slug`.
- Không có import thư viện icon trực tiếp và không có import `@/lib/i18n` trong file của component.
- `pnpm typecheck`, `pnpm lint`, `pnpm registry:build` đều qua, báo cáo trung thực.
- Không sửa tay file sinh tự động; không có thay đổi ngoài phạm vi.

## 7. Báo cáo
Viết báo cáo cuối bằng tiếng Việt có dấu, trong một màn hình, theo thứ tự:
1. Kết quả đối chiếu catalog (có trùng chức năng không).
2. File đã tạo hoặc sửa và thay đổi chính.
3. Props đã chọn cho `AppTag` và lý do.
4. Kết quả typecheck, lint, registry build; nêu lệnh nào không chạy được.
5. Điểm chưa xác định.

## Xử lý thông tin còn thiếu
Nếu prompt hoặc code không nêu rõ một điều gì (props của `AppTag`, kích cỡ, biến thể), ghi "chưa xác định", chọn tập props nhỏ nhất đủ cho yêu cầu, nêu trong báo cáo, và tiếp tục. Không tự thêm tính năng ngoài yêu cầu.
````

### Bản tiếng Anh (để chạy)

````markdown
# Add the AppTag component (a small removable tag) to the registry

## Role
You are a senior React/TypeScript engineer working in a shadcn-style UI registry (Lnh-design), skilled at designing reusable components and registering them in the registry.

## 1. Goal
Add the `AppTag` component (a small tag with a remove button) to the `data-display` group, register it in the catalog, the manifest and the previews, and build a demo. This matters because every component in the library needs all five pieces (source, catalog, manifest, preview, demo) to show up correctly on the showcase and to be publishable.
The result is read by the developer who assigned the work; the report must be readable in under 2 minutes.

## 2. Scope
**Read:** `docs/design-patterns/reuse-catalog.md`; `src/config/catalog/components.ts`; `registry.manifest.json`; `src/components/data-display/badge-status.tsx` (mirror); `src/modules/showcase/previews/data-display.tsx`; `src/modules/showcase/demos/registry.ts`.
**Modify only:** `src/components/data-display/app-tag.tsx` (new) and the `index.ts` in the same folder; `src/config/catalog/components.ts`; `registry.manifest.json`; `src/modules/showcase/previews/data-display.tsx`; the new demo folder `src/modules/showcase/demos/data-display/app-tag/` and `src/modules/showcase/demos/registry.ts`.
**Report instead of changing:** every other file, including the generated ones.

## 3. Analysis before changing code
1. Read the catalog and `badge-status.tsx`, and confirm no component already has the same function as `AppTag`.
2. Record the shape of one catalog entry, one manifest entry, one preview entry and one demo of the nearest existing component.

## 4. Implementation requirements
### 4.1 Component
- Create `app-tag.tsx` in the style of `badge-status.tsx`; use `<AppIcon />` for the remove button's icon and never import an icon library directly, because ESLint blocks that.
- The component carries its own strings through props or constants and does not import `@/lib/i18n`, because the registry builder rejects that import.
### 4.2 Registration
- Add the entry `app("app-tag", "AppTag", ["data-display"], ...)` to `components.ts` with vi and en descriptions.
- Add the `"app-tag"` entry to `registry.manifest.json`, listing the source file and every file the component imports.
- Add a preview to `previews/data-display.tsx`.
### 4.3 Demo
- Create `demos/data-display/app-tag/{demo-id}.tsx` and an `index.ts` exporting `demos: ComponentDemo[]`, then register it in `demos/registry.ts`.
- The `slug` is `app-tag` in the demo folder, the catalog entry and the manifest entry.

## 5. Process
1. Read the files in section 2.
2. Work in the order 4.1 → 4.2 → 4.3.
3. Run `pnpm typecheck`, `pnpm lint` and `pnpm registry:build`; fix failures caused by your change.

## 6. Acceptance criteria
Done only when all hold:
- `AppTag` has the source, the catalog entry, the manifest entry, the preview and the demo, all with the same `slug`.
- No direct icon-library import and no `@/lib/i18n` import in the component's files.
- `pnpm typecheck`, `pnpm lint` and `pnpm registry:build` pass, with results reported honestly.
- No hand edits to generated files; no changes outside the scope.

## 7. Report
Write the final report in Vietnamese with full diacritics, within one screen, as:
1. Result of the catalog check (whether anything had the same function).
2. Files created or changed and the main change in each.
3. The props chosen for `AppTag` and why.
4. Typecheck, lint and registry build results; name any command that could not run.
5. Items not determined.

## Handling missing information
If the prompt or the code do not state something (the props of `AppTag`, sizes, variants), write "not determined", choose the smallest set of props that covers the request, state it in the report, and continue. Do not add features beyond the request.
````

### Cần xác nhận

- Props, kích cỡ và biến thể của `AppTag` bạn chưa nêu; bản chạy để Claude chọn tập nhỏ nhất và báo cáo.
- "Chạy typecheck với lint" được mở rộng thành thêm `pnpm registry:build`, vì task đụng tới registry. Bỏ lệnh này nếu bạn không muốn chạy bước phát hành.

## Ví dụ 2 — Lite (sửa một dòng dữ liệu)

### Prompt thô

```
sửa mô tả tiếng anh của app-tooltip trong catalog, nghe lạ quá
```

### Đã chỉnh gì

- Giới hạn phạm vi vào đúng một mục catalog, giữ nguyên bản tiếng Việt.
- Thêm điều kiện xong có lệnh kiểm tra và yêu cầu nêu trước/sau trong báo cáo.

### Bản tiếng Việt (để đọc)

````markdown
# Viết lại mô tả tiếng Anh của app-tooltip trong catalog

**Việc cần làm:** Viết lại mô tả `en` của mục `app-tooltip` sao cho tự nhiên. Lý do: mô tả hiện lên trên thẻ component ở showcase.
**Bối cảnh:** `src/config/catalog/components.ts`, mục `app("app-tooltip", ...)`.
**Phạm vi:** Chỉ sửa chuỗi `en` của mục đó. Điều khác ghi vào báo cáo.
**Xong khi:** bản tiếng Việt và mọi mục khác không đổi; `pnpm typecheck` qua.
**Báo cáo:** Tối đa 3 dòng, bằng tiếng Việt: câu cũ, câu mới, kết quả typecheck. Điều nguồn không nêu thì ghi "chưa xác định".
````

### Bản tiếng Anh (để chạy)

````markdown
# Rewrite the English description of app-tooltip in the catalog

**Task:** Rewrite the `en` description of the `app-tooltip` entry so it reads naturally. Reason: the description appears on the component card in the showcase.
**Context:** `src/config/catalog/components.ts`, the entry `app("app-tooltip", ...)`.
**Scope:** Modify only the `en` string of that entry. Mention anything else in the report.
**Done when:** the Vietnamese text and every other entry are unchanged; `pnpm typecheck` passes.
**Report:** At most 3 lines, in Vietnamese: the old sentence, the new sentence, the typecheck result. Write "not determined" for anything the sources do not state.
````

### Cần xác nhận

- Câu tiếng Anh mới bạn chưa nêu nên do Claude chọn; báo cáo nêu trước/sau để bạn duyệt.

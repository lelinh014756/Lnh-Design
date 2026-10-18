# Prompt Template

Khung dùng ở bước 5 của `SKILL.md`. Viết khung **một lần**, render hai ngôn ngữ với cùng số mục.

## Ánh xạ nguyên tắc → mục

| Nguyên tắc | Nằm ở mục |
|-----------|-----------|
| Rõ ràng & cụ thể (người đọc, thời gian đọc) | Goal, Report |
| Giải thích lý do | Goal, Implementation (vế "because") |
| Gán vai trò | Role |
| Định dạng mong muốn | Report |
| Nói làm gì, không nói đừng làm gì | Scope, Implementation |
| Giảm bịa đặt | Handling missing information |

## Khung Full

### English (bản chạy)

````markdown
# <Verb + object: what the task delivers>

## Role
You are a <specific role> working in <repo/domain context>. <One clause on why this expertise matters for the task.>

## 1. Goal
<Outcome in 1–3 sentences.> This matters because <reason>.
The result is read by <who>, who has <time/length budget>.

## 2. Scope
**Read:** <files/docs to read, with paths>
**Modify only:** <files/areas allowed to change>
**Report instead of changing:** anything else you find that needs a change.

## 3. Analysis before changing code
1. <Compare/inspect step with concrete inputs.>
2. <Classify findings into named groups.>
3. <Record gaps between source of truth and current code.>

## 4. Implementation requirements
### 4.1 <Area>
- <Imperative instruction>, because <reason>.
### 4.2 <Area>
- <Imperative instruction>.

## 5. Process
1. <Read/analyse step.>
2. <Change step.>
3. Run <verification commands>; fix failures caused by your change.

## 6. Acceptance criteria
Done only when all hold:
- <Checkable condition.>
- <Checkable condition.>

## 7. Report
Write the final report in <language>, <length budget>, as:
1. <Item>
2. <Item>

## Handling missing information
If the source documents or code do not state something (a field, deadline, owner, behaviour), write "not determined" for it, list it in the report, and continue with the parts that are clear. Do not infer or invent endpoints, fields, paths or business rules.
````

### Tiếng Việt (bản đọc)

````markdown
# <Động từ + đối tượng: task giao ra cái gì>

## Vai trò
Bạn là <vai trò cụ thể> đang làm việc trong <repo/miền>. <Một vế nêu vì sao chuyên môn này quan trọng với task.>

## 1. Mục tiêu
<Kết quả trong 1–3 câu.> Điều này quan trọng vì <lý do>.
Kết quả được đọc bởi <ai>, người này có <giới hạn thời gian/độ dài>.

## 2. Phạm vi
**Đọc:** <file/tài liệu cần đọc, kèm đường dẫn>
**Chỉ được sửa:** <file/khu vực được phép thay đổi>
**Ghi vào báo cáo thay vì sửa:** mọi thứ khác bạn thấy cần thay đổi.

## 3. Phân tích trước khi sửa code
1. <Bước đối chiếu/kiểm tra với đầu vào cụ thể.>
2. <Phân loại kết quả vào các nhóm có tên.>
3. <Ghi lại chênh lệch giữa nguồn chuẩn và code hiện tại.>

## 4. Yêu cầu triển khai
### 4.1 <Khu vực>
- <Chỉ thị dạng mệnh lệnh>, vì <lý do>.
### 4.2 <Khu vực>
- <Chỉ thị dạng mệnh lệnh>.

## 5. Quy trình
1. <Bước đọc/phân tích.>
2. <Bước thay đổi.>
3. Chạy <lệnh kiểm tra>; sửa lỗi do thay đổi của bạn gây ra.

## 6. Tiêu chí nghiệm thu
Chỉ xem là xong khi đủ các điều kiện:
- <Điều kiện kiểm được.>
- <Điều kiện kiểm được.>

## 7. Báo cáo
Viết báo cáo cuối bằng <ngôn ngữ>, <giới hạn độ dài>, theo thứ tự:
1. <Mục>
2. <Mục>

## Xử lý thông tin còn thiếu
Nếu tài liệu nguồn hoặc code không nêu rõ một điều gì (field, deadline, người phụ trách, hành vi), ghi "chưa xác định" cho điều đó, liệt kê trong báo cáo, và tiếp tục với phần đã rõ. Không suy đoán hay tự thêm endpoint, field, đường dẫn, quy tắc nghiệp vụ.
````

Mục 3 bỏ khi task không cần phân tích trước. Khi bỏ, **bỏ ở cả hai bản** và đánh số lại giống nhau.

## Khung Lite

### English

````markdown
# <Verb + object>

**Task:** <One sentence, imperative.> Reason: <why, one clause>.
**Context:** <Files/paths involved; the single most relevant constraint.>
**Scope:** Modify only <files>. Mention anything else in the report.
**Done when:** <1–3 checkable conditions, including the verification command>.
**Report:** <Format and length, in Vietnamese>. Write "not determined" for anything the sources do not state.
````

### Tiếng Việt

````markdown
# <Động từ + đối tượng>

**Việc cần làm:** <Một câu mệnh lệnh.> Lý do: <vì sao, một vế>.
**Bối cảnh:** <File/đường dẫn liên quan; ràng buộc quan trọng nhất.>
**Phạm vi:** Chỉ sửa <file>. Điều khác ghi vào báo cáo.
**Xong khi:** <1–3 điều kiện kiểm được, gồm lệnh kiểm tra>.
**Báo cáo:** <Định dạng và độ dài, bằng tiếng Việt>. Điều nguồn không nêu thì ghi "chưa xác định".
````

## Mặc định (dùng khi user không nói, luôn khai báo ở "Cần xác nhận")

| Thứ thiếu | Mặc định |
|-----------|----------|
| Ngôn ngữ báo cáo | Tiếng Việt có dấu; identifier, đường dẫn, lệnh giữ nguyên |
| Độ dài báo cáo | Gọn trong một màn hình; Full: ≤ 7 mục đánh số |
| Người đọc | Chính user (dev đang điều phối Claude) |
| Vai trò | Senior engineer đúng stack của task |
| Lệnh kiểm tra | Xem Repo defaults; ngoài repo này → lệnh typecheck/lint/test mà `package.json` có |
| Hành vi khi gặp lỗi ngoài phạm vi | Ghi vào báo cáo, không sửa |

## Chuyển câu "đừng" thành câu "hãy"

| Thô | Chỉnh |
|-----|-------|
| Đừng sửa file khác | Chỉ sửa `A.tsx` và type nó import; việc khác ghi vào báo cáo. |
| Đừng bịa field | Chỉ dùng field có trong tài liệu API; field thiếu ghi "chưa xác định". |
| Đừng dùng `any` | Dùng type chính xác suy ra từ API contract. |
| Bỏ qua góp ý chưa chốt | Chỉ giữ thông tin ảnh hưởng trực tiếp tới tiến độ <X>. |
| Đừng chạy server | Kiểm tra bằng typecheck và lint; dev server do user quản lý. |
| Cấm xoá dữ liệu (phá huỷ — giữ cấm) | Không xoá dữ liệu; cần dọn thì liệt kê mục cần xoá trong báo cáo để user quyết. |

## Repo defaults (Lnh-design)

Chỉ thêm dòng liên quan tới task; mỗi dòng đã xác thực với `AGENTS.md`, `docs/code-standards.md`, `docs/design-patterns/reuse-catalog.md` và `.claude/rules/*`.

| Khi task… | Thêm vào prompt (EN) |
|-----------|----------------------|
| Mọi task đổi code | `Follow CLAUDE.md, AGENTS.md and .claude/rules/*. This Next.js version has breaking changes: read the relevant guide in node_modules/next/dist/docs/ before touching Next.js APIs.` |
| Cần xác nhận kiểu | `Run pnpm typecheck and pnpm lint; run pnpm i18n:check when a dictionary changed and pnpm registry:build when a registry item, components.ts, blocks.ts or registry.manifest.json changed; report the results honestly, including commands that could not run.` |
| Có icon | `Use <AppIcon icon="name" /> only; never import lucide-react or @hugeicons/* outside src/components/general/icon-providers and src/components/ui.` |
| Component thuộc registry | `Do not import @/lib/i18n inside the files of a registry item; pass strings through props or constants. Site strings go through the src/lib/i18n dictionaries (vi and en, checked by pnpm i18n:check).` |
| Thêm component mới | `Follow the "recipe for adding a component" in docs/design-patterns/reuse-catalog.md: source file, catalog entry, manifest entry, preview and demo; the slug must be the same in the demo folder, the registry item and the preview route.` |
| Tái sử dụng | `Check docs/design-patterns/reuse-catalog.md and src/config/catalog/components.ts before creating a component; create a new one only when none fits.` |
| Chạm file sinh tự động | `Do not hand-edit src/modules/showcase/demos/generated/sources.json, registry.json or public/r/*; they are generated by pnpm demos:build and pnpm registry:build.` |
| Thêm hoặc sửa demo | `One demo per file in src/modules/showcase/demos/{group}/{slug}/, exported from its index.ts and registered in demos/registry.ts; import only from @/components/* and packages in package.json; open overlays from a button, not defaultOpen.` |
| Style | `Use Tailwind v4 with CVA; take colours from the tokens in src/app/globals.css; no inline styles for component logic.` |

Task ở repo khác → bỏ bảng này, dùng convention user nêu trong prompt.

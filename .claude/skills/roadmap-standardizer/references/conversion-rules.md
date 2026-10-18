# Quy tắc chuyển đổi roadmap nguồn → định dạng chuẩn

Bổ sung cho `docs/public-roadmap-format.md` (đặc tả đích). Tài liệu này trả lời câu hỏi "nguồn viết kiểu X thì ghi thành gì". Nguyên tắc gốc: **sự thật (trạng thái, ngày, việc đã xong) chỉ lấy từ nguồn; thiếu thì để trống; mơ hồ thì để trống và báo cáo. Lời văn thì viết lại cho người không chuyên đọc hiểu** (mục 4).

Hai chế độ:

| Chế độ | Khi nào | Lời văn |
|---|---|---|
| Công khai (mặc định) | File cho trang `/roadmap` | Tiếng Việt phổ thông, gom đầu việc thành tính năng (mục 4) |
| `--verbatim` | Bản nội bộ cho đội kỹ thuật | Giữ nguyên văn nguồn (mục 4b) |

## 1. Nhận diện cấu trúc nguồn

| Nguồn trông như | Hiểu là | Ghi thành |
|---|---|---|
| Bảng tóm tắt (Phase / Name / Status / Progress) + các section chi tiết | Hai lớp cho cùng một nội dung | Dựng từ section chi tiết; bảng chỉ để lấy `Status`, `Progress`, ngày khi section chi tiết không nêu |
| `## Phase N` → `### P N.M` → `#### con` → checklist | 3–4 cấp | Công khai: mỗi phase = H2, các P N.M + checklist gom thành task-tính năng dưới H2. `--verbatim`: H2 → H3 → H4 → task |
| `## Phase N` → checklist | 2 cấp | H2 + task trực tiếp dưới H2 |
| Cột/nhóm `Now / Next / Later`, quý, năm | Nhóm theo thời gian | Mỗi nhóm = một H2; tên nhóm giữ nguyên |
| Danh sách phẳng, không nhóm | Không có phase | Nhóm theo trạng thái nguồn đã nêu (đã xong / đang làm / chưa rõ) thành các H2, mỗi mục = task; không nêu gì thì một H2 duy nhất |
| Bảng "Known Issues / Bugs / Risks", "References", "Changelog" | Không phải roadmap | Bỏ (mục 6) |
| Bảng "Upcoming Features" lặp lại mục đã có trong section chi tiết | Trùng | Bỏ, không nhân đôi |

Nhiều file nguồn: chuẩn hoá từng file riêng; không tự gộp. Hỏi chủ sở hữu nếu cần gộp.

## 2. Trạng thái

Dịch theo **chữ** của nguồn, không theo cảm giác:

| Nguồn ghi | Ghi thành |
|---|---|
| Done, Complete(d), Shipped, Released, Live, ✅ | `completed` |
| In progress, Doing, WIP, Active, Ongoing, 🔄, 🚧 | `in-progress` |
| Planned, Planning, Todo, Backlog, Upcoming, Not started, 📋, 🔜, ⏳ | `planned` |
| On hold, Paused, Blocked, Deferred (cả phase/item) | `on-hold` |
| Cancelled, Dropped, Won't do | **Không có giá trị chuẩn.** Bỏ mục khỏi file công khai, ghi vào "Omitted" của báo cáo để chủ sở hữu quyết định |

Ngữ cảnh:

- Emoji đứng một mình mơ hồ (🔜 vừa là "planning" vừa là "task còn lại"). Chỉ dùng emoji để suy ra trạng thái khi nó đi kèm chữ, hoặc nguồn có chú giải. Còn lại → không ghi `Status`, báo cáo.
- Nhóm mang nghĩa trạng thái trong chính tên (`Now`, `Next`, `Later`, `Shipped`, `Backlog`): `Now`/`In flight` → `in-progress`; `Next`/`Later`/`Backlog` → `planned`; `Shipped`/`Done` → `completed`. Mọi ánh xạ kiểu này phải nằm trong mục "Mapped" của báo cáo.
- Trạng thái của cha **không** tự suy ra cho con. Con thiếu trạng thái thì để trống, trừ khi cha là `planned` và con chỉ là danh sách việc (xem mục 5).
- Phase `completed` nhưng nguồn còn task chưa tick: giữ nguyên cả hai, validator sẽ cảnh báo, báo cáo ghi mục "Source inconsistencies". Không đổi trạng thái, không tick hộ.

## 3. Ngày, thời gian, tiến độ

| Nguồn ghi | Ghi thành |
|---|---|
| `2026-09-29`, `29/09/2026`, `Sep 29, 2026` | ISO `2026-09-29` (đổi định dạng, không đổi giá trị). Ngày/tháng mơ hồ (`03/04/2026`) → hỏi hoặc để trong mô tả |
| `March 2026` | `2026-03` |
| "Production 2026-09-29", "Complete 2026-09-30", "shipped …" trên mục đã hoàn thành | `Completed:` của heading đó. Công khai: hạng mục bị gom thành dòng tính năng → ghi cuối dòng "(hoàn tất 30/09/2026)" theo mục 4 |
| "Start …", "from …" | `Start:` |
| "Due/Deadline/Goal/ETA …" hoặc ngày trần trên mục chưa xong mà nguồn nói rõ đó là mục tiêu | `Target:` |
| Ngày xuất hiện trong ghi chú không rõ là mốc nào | Giữ trong mô tả, không đưa vào trường |
| `Q3 2026`, `H1 2027` | `Timeline:` nguyên văn. **Không** đổi thành ngày |
| `W4–W11`, `Sprint 12` (mốc tương đối) | `--verbatim`: `Timeline:` nguyên văn. Công khai: bỏ (người ngoài không biết mốc bắt đầu), ghi "Omitted" |
| `Last updated: …` ở đầu file | `Updated:` ở H1 |
| `100%`, `0%`, `40%` ghi rõ trong nguồn | `Progress:`. Công khai: bỏ khi trùng nghĩa `Status` (100 + completed, 0 + planned) |

Không tự tính `Progress` từ checklist, không tự suy `Target` từ `Timeline`, không lấy "hôm nay" làm `Updated` nếu nguồn không ghi.

## 4. Viết cho mọi người (chế độ công khai)

Người đọc là hợp tác xã, nông hộ, đối tác. Viết tiếng Việt phổ thông, câu ngắn, không thuật ngữ.

**Giai đoạn (H2)**
- Tên: `Giai đoạn N · <điều giai đoạn mang lại>` — giữ số giai đoạn của nguồn để đội nội bộ vẫn đối chiếu được. Giai đoạn chuẩn bị (Phase 0, Setup) đặt tên không số, ví dụ "Chuẩn bị nền tảng".
- Mô tả: đúng một câu, nói người dùng được gì. Không nêu tiến độ/ngày trong câu này.

**Tính năng (task dưới H2)**
- 3–7 dòng mỗi giai đoạn. Mỗi dòng = một việc người dùng nhìn thấy/làm được, bắt đầu bằng danh từ hoặc động từ quen thuộc: "Khai báo thu hoạch theo từng lô…", "Quản lý vườn, thửa đất…".
- Gom các đầu việc kỹ thuật cùng phục vụ một tính năng vào một dòng (entity + repository + API + state machine của Harvest → một dòng "Khai báo thu hoạch…").
- Tick `[x]` chỉ khi **mọi** đầu việc nguồn gộp vào đều đã tick. Có một đầu việc chưa xong → tách nó ra dòng riêng `[ ]`, hoặc để cả dòng `[ ]` — không tick hộ.
- Đầu việc được nguồn ghi là hoãn ("deferred to Phase 2+") → giữ `[ ]` ở giai đoạn cũ kèm "(chuyển sang các giai đoạn sau)". Không tự xếp nó vào giai đoạn nào.
- Ngày cụ thể của một hạng mục ("Production 2026-09-29") → cuối dòng tính năng tương ứng, viết dạng người đọc: "(dùng chính thức từ 29/09/2026)", "(hoàn tất 30/09/2026)".
- Mô tả cơ chế bằng lợi ích, không bằng công nghệ: "hash chain audit log" → "Nhật ký thao tác có chống chỉnh sửa". Chỉ dùng cụm từ mà nguồn hoặc tài liệu dự án đã xác nhận (ví dụ CLAUDE.md nói audit log append-only); không thổi phồng ("tự động", "tức thì", "100%") nếu nguồn không nói.
- Giữ tên riêng/chuẩn người dùng biết: Nghị định 38/2026, GACC, QR, AI. Giải thích ngắn nếu cần ("GACC của Trung Quốc").

**Bỏ khỏi bản công khai** (ghi vào "Omitted" của báo cáo)
- Mã nội bộ trong tiêu đề/tính năng: `P1.1`, `T-41`, `GAP-002`, `ADR-012`, số migration.
- Tuần tương đối `W4–W11`, `Sprint 12`: người ngoài không biết mốc bắt đầu. Không đổi thành ngày.
- `Progress` trùng nghĩa với `Status` (100 với completed, 0 với planned). Giữ nếu là số giữa chừng (ví dụ 40 với in-progress).
- Đầu việc thuần nội bộ không tạo tính năng: dựng khung, chọn CSDL, migration, unit/integration test, QA pass, changelog, tài liệu API, demo + retrospective. Gom vào một dòng chung ("Dựng khung kỹ thuật cho toàn hệ thống") nếu cả giai đoạn chỉ có loại việc này; còn lại bỏ.
- Ghi chú "breaking change" về mô hình dữ liệu: chỉ giữ nếu người dùng cuối cảm nhận được, viết lại bằng lời thường.

**Intro (đoạn dưới H1)**: một câu trung tính giới thiệu trang ("ECO Farm được xây dựng theo từng giai đoạn…"). Không nêu tiến độ, ngày, cam kết.

**H1**: tên sản phẩm dễ hiểu ("Lộ trình phát triển ECO Farm"), không dùng tên repo.

## 4b. Giữ nguyên văn (`--verbatim`)

- Giữ ngôn ngữ, chữ hoa/thường, mã nội bộ, từng dòng task đúng thứ tự.
- Bỏ emoji trạng thái và hậu tố trạng thái khỏi tiêu đề (`### P1.1: Farm Module ✅ Done (100%)` → `### P1.1: Farm Module`); bóc `(W4–W11)` sang `Timeline`.
- Bảng tóm tắt và section chi tiết đặt tên khác nhau → dùng tên ở section chi tiết, báo cáo tên còn lại.
- `- [x]`/`- ✅ việc` → `[x]`; `- [ ]`/`- ⬜ việc`/`- 🔜 việc` → `[ ]`. Gạch đầu dòng không dấu hiệu hoàn thành để trong mô tả, trừ khi cha là `planned` (thành `[ ]`).
- Mục 6 (không công khai) vẫn áp dụng nếu file sẽ lên trang `/roadmap`.

## 5. Thông tin thiếu và cấu trúc lệch

| Tình huống | Xử lý |
|---|---|
| Thiếu `Status` | Không ghi. Validator cảnh báo; báo cáo ghi "Missing" |
| Thiếu ngày/tiến độ | Không ghi |
| Không có phase nào | Một H2 đặt theo H1 nguồn (ví dụ 02-flat-list) |
| Mục không có việc con | H3 chỉ gồm tiêu đề + metadata |
| Heading sâu hơn H4 | Công khai: gom vào tính năng của giai đoạn. `--verbatim`: hạ về H4 hoặc chuyển thành mô tả; ghi báo cáo |
| Hai mục trùng tên | Giữ cả hai theo thứ tự nguồn; báo cáo |
| Nguồn mâu thuẫn nội bộ (bảng nói 100% nhưng còn task chưa tick) | Giữ cả hai; báo cáo "Source inconsistencies". **Không sửa cho khớp** |
| Số liệu/ngày không xác minh được | Để trống, hỏi chủ sở hữu |

## 6. Không đưa lên trang công khai

Trang `/roadmap` hiển thị cho người chưa đăng nhập. Mặc định bỏ và liệt kê ở "Omitted":

- Known Issues / bug list / risk register / severity / SLA nội bộ — nhất là mục mô tả lỗ hổng phân quyền hay bảo mật.
- SHA commit, đường dẫn file nội bộ (`tasks/015-…md`), link tới tracker hay doc nội bộ, tên người/nhóm phụ trách (`owner: payments team`) — người đọc công khai không cần.
- Phần "References" trỏ vào docs nội bộ.
- Bất cứ thứ gì trông như bí mật (khoá, URL staging, thông tin khách hàng).

Nếu người dùng nói rõ muốn giữ một mục trong số này, giữ và ghi vào báo cáo rằng đó là quyết định của họ.

## 7. Báo cáo chuyển đổi (bắt buộc)

Sau mỗi lần chuyển đổi, trả báo cáo theo khung dưới đây. Ví dụ đầy đủ: `examples/01-table-and-details.report.md`.

```markdown
# Conversion report — <tên nguồn>
- Source → Output; validator: N errors, M warnings

## Trace                   ← bảng: tính năng output ← các dòng nguồn (số dòng) + trạng thái tick
## Mapped                  ← mọi ánh xạ chữ/emoji → trường chuẩn
## Omitted                 ← mục bị bỏ + lý do (mục 6, trùng lặp, cancelled)
## Name conflicts          ← tên bảng ≠ tên heading, đổi tên H1
## Source inconsistencies  ← mâu thuẫn trong nguồn, giữ nguyên
## Missing in source       ← trường để trống vì nguồn không nói
## Questions               ← cần chủ sở hữu quyết định (nếu có)
```

Mục nào trống thì ghi "—", không bỏ dòng, để người đọc biết đã kiểm.

## 8. Kiểm tra độ trung thực trước khi báo xong

1. Validator: `node .claude/skills/roadmap-standardizer/scripts/validate-roadmap.mjs <output>` — 0 lỗi.
2. Bảng Trace phủ hết nguồn: mọi dòng task nguồn nằm trong đúng một tính năng hoặc trong "Omitted". Đếm: số dòng nguồn = số dòng đã gom + số dòng đã bỏ.
3. Mỗi tính năng `[x]` → mọi dòng nguồn của nó đều `[x]`. Mỗi `Status`, ngày trong output truy được về một dòng nguồn (hoặc một ánh xạ ở "Mapped").
4. Đọc lại output như một người không làm phần mềm: còn thuật ngữ, mã, tên tiếng Anh không cần thiết thì viết lại.
5. `--verbatim`: thay bước 2–4 bằng `diff` từng dòng task nguồn ↔ output — phải giống hệt chữ và thứ tự.
6. Thanh tiến độ trên trang (nếu đã chạy dev) khớp số validator in ra.

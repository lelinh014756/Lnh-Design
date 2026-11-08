---
name: be-request-report
description: "Tạo báo cáo gửi BE trong plans/reports/ từ nội dung user nêu: bổ sung field/param API, điều chỉnh API, thêm API mới, báo lỗi API. Dùng khi: 'báo cáo BE', 'yêu cầu BE', 'bug report BE', 'BE thêm field/endpoint'."
version: 1.0.0
argument-hint: "[supplement|adjust|new|bug] <Report Content>"
---

# BE Request Report

Biến **Report Content** ngắn của user thành một file Markdown gọn gửi BE team. Writing Requirements và Save Location đã cài sẵn bên dưới — user chỉ cần đưa Report Content, không phải nhập lại quy tắc.

## Vai trò

Bạn là senior FE engineer của Eco-Farm Web, viết yêu cầu cho BE team. BE đọc báo cáo để biết **cần gì** và **ở đâu**, rồi tự chọn cách làm — nên báo cáo phải đúng từng tên API/field nhưng không chỉ cách triển khai.

## Người đọc & độ dài

BE dev, đọc dưới 1 phút: tối đa **40 dòng**, mỗi bảng tối đa 10 dòng. Dài hơn → gom dòng cùng loại vào một bảng hoặc tách báo cáo theo resource.

## Chọn loại báo cáo

| Loại         | User muốn…                                                    | Template                        |
| ------------ | ------------------------------------------------------------- | ------------------------------- |
| `supplement` | Thêm field vào response / param vào request của API **đã có** | `references/type-supplement.md` |
| `adjust`     | Đổi tên, kiểu, hành vi, ràng buộc của API **đã có**           | `references/type-adjust.md`     |
| `new`        | Thêm API **chưa tồn tại**                                     | `references/type-new-api.md`    |
| `bug`        | API chạy sai / lỗi so với tài liệu hoặc mong đợi              | `references/type-bug.md`        |

- Args bắt đầu bằng `supplement|adjust|new|bug` → dùng loại đó. Không có → tự phân loại theo dấu hiệu: _bug_ (lỗi, 500, sai, rỗng, không trả, TraceId), _new_ (chưa có endpoint, API mới), _supplement_ (thêm/bổ sung field, param), _adjust_ (đổi, sửa, đổi tên, bỏ, gộp).
- Một yêu cầu trộn nhiều loại → một file cho mỗi loại, vì BE theo dõi bug và thay đổi tính năng riêng.
- Không chắc giữa hai loại → hỏi 1 câu, vì sai loại làm sai cả template.

## Quy trình

1. **Trích xuất** từ Report Content: API/resource, field/param, hành vi mong muốn, dữ liệu kèm (ID, TraceId, JSON), quyết định user đã chốt. Danh sách này phải còn đủ, đúng chữ, trong báo cáo.
2. **Đọc đúng một template** theo loại. Template ghi rõ mục bắt buộc và mục tuỳ chọn.
3. **Xác thực với tài liệu API (1 lượt).** Đọc `../BE/ECO-FARM-BE/docs/api/api-{resource}.md` (tính từ gốc repo FE); không có thì `docs/api/api-{resource}.md`; chưa biết resource thì xem `docs/api-reference-index.md`. Dùng `Grep` tìm heading `### ` rồi `Read` đoạn cần.
   - **Name** = tên trong heading `### {Name} — {mô tả}`; **Mô tả** = phần sau dấu `—`. Heading không có dấu `—` (vd `### GetRoles`) → lấy dòng `**Description:**`. Mô tả dài → giữ mệnh đề đầu, vì cột bảng cần ngắn.
   - **Endpoint** = `METHOD /api/v1/...` từ bảng _Endpoints Summary_.
   - Field/param user muốn thêm **đã có** trong tài liệu → không đưa vào báo cáo, báo user ở bước 7 (BE sẽ coi là yêu cầu trùng).
   - Tên user nêu mà tài liệu không có → giữ nguyên chữ của user, báo user ở bước 7.
4. **Viết báo cáo** theo template. Tiếng Việt có dấu; identifier trong backtick, nguyên văn.
5. **Lưu file** theo _Save Location_.
6. **Tự kiểm** theo checklist cuối file; sửa trước khi báo user.
7. **Báo user** theo _Báo cáo cho user_.

## Writing Requirements (cài sẵn)

| Quy tắc                                                                                             | Vì                                                   |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Ngắn, đơn giản, tập trung; văn xuôi ≤ 2 câu mỗi mục, còn lại dùng bảng                              | BE đọc nhanh, tìm thông tin theo cột                 |
| Chỉ ghi yêu cầu user đưa; thông tin thiếu thì bỏ mục tuỳ chọn tương ứng                             | Thông tin tự thêm dễ bị BE làm theo như yêu cầu thật |
| Mô tả **cần gì**; để BE chọn cách làm (logic, truy vấn, cấu trúc dữ liệu, migration)                | BE sở hữu giải pháp và biết ràng buộc nội bộ         |
| Giữ nguyên tên API, endpoint, field, giá trị enum, ID trong backtick                                | BE tìm bằng grep; đổi hoa/thường là tìm không ra     |
| Ưu tiên, deadline, mức độ nghiêm trọng, câu hỏi cho BE: chỉ ghi khi user nêu                        | Đây là quyết định của user, không phải của FE tự suy |
| Cột **Mô tả** của field/param: lấy từ tài liệu API, hoặc diễn giải thẳng từ tên theo bảng thuật ngữ | Mô tả ngắn, nhất quán, không thêm nghĩa mới          |
| Markdown, tiêu đề `#` một lần, mục `##`                                                             | Render đồng nhất trong repo và công cụ review        |

**Thuật ngữ:** Farm → vườn · Farmer → Nông hộ · Team → Tổ · Cooperative → HTX · Harvest → phiếu thu hoạch · User → người dùng.

## Save Location (cài sẵn)

- Thư mục: `plans/reports/` của project hiện tại. Thiếu thì tạo (`mkdir -p plans/reports`).
- Tên file: `be-{loại}-{YYMMDD}-{HHMM}-{slug}.md`, `loại` ∈ `supplement|adjust|new|bug`, `slug` là kebab-case ASCII nêu resource và việc (vd `harvests-add-response-fields`). Lấy ngày giờ từ khối `## Naming` của hook đầu phiên; không có thì chạy `date +%y%m%d-%H%M`. Theo `project-context.md` → Storage Contract.
- File trùng tên → thêm hậu tố `-2`, vì báo cáo cũ có thể BE đang đọc.
- Chỉ tạo file báo cáo. Tài liệu API do BE sở hữu và `plans/` không commit, nên không sửa file nào khác, không commit.

## Thông tin còn thiếu

- **Mục bắt buộc** (ghi trong từng template) thiếu → hỏi user một lượt, gom tất cả câu hỏi, rồi viết.
- **Mục tuỳ chọn** thiếu → bỏ mục. Không điền "chưa xác định" hay `—` vào file, vì file này được gửi đi nguyên trạng.
- Hiện trạng user nêu mâu thuẫn tài liệu API → hỏi user "tài liệu ghi X, bạn nêu Y — dùng cái nào?", vì có thể tài liệu đã lỗi thời hoặc user nhầm.

## Checklist tự kiểm

- [ ] Mọi mục ở bước 1 có mặt trong báo cáo, đúng chữ.
- [ ] Mỗi tên API/field/endpoint khớp tài liệu API hoặc nguyên văn user; không tên nào do mình nghĩ ra.
- [ ] Không có đề xuất triển khai, ưu tiên, deadline, câu hỏi tự thêm.
- [ ] ≤ 40 dòng; không mục rỗng; không placeholder.
- [ ] Mục bắt buộc của loại đã đủ; cột bảng đúng template.
- [ ] Tên file đúng mẫu, nằm trong `plans/reports/`, chỉ một file mới (mỗi loại).

## Báo cáo cho user

Tối đa ~6 dòng, không dán lại nội dung báo cáo:

1. Đường dẫn file dạng link Markdown.
2. Loại đã chọn (kèm lý do 1 câu nếu tự phân loại).
3. Chỉ khi có: field/param đã tồn tại nên bị bỏ; tên không thấy trong tài liệu API; mục tuỳ chọn bỏ vì thiếu thông tin.

## Tham chiếu

- `references/type-supplement.md`, `type-adjust.md`, `type-new-api.md`, `type-bug.md` — template và mục bắt buộc của từng loại.
- `references/examples.md` — Report Content → báo cáo, cho cả 4 loại.

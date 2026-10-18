---
name: prompt-optimizer
description: "Refactor và tối ưu prompt thô thành prompt chuẩn cho Claude Code/CLI, luôn xuất 2 bản: Tiếng Việt (để người đọc hiểu) và English (để Claude thực thi). Prompt phức tạp/task dài được cấu trúc theo 6 nguyên tắc: rõ ràng & cụ thể (người đọc, thời gian đọc), giải thích lý do, gán vai trò, định dạng đầu ra, nói làm gì thay vì đừng làm gì, giảm bịa đặt. Chỉ viết lại prompt, KHÔNG thực thi task trong prompt. Dùng khi: 'refactor prompt', 'tối ưu prompt', 'viết lại prompt', 'chuẩn hoá prompt', 'prompt này chạy chưa tốt', 'improve this prompt', hoặc user dán prompt thô và nhờ làm gọn/rõ hơn. Không dùng để dọn file tài liệu agent/skill (→ prompt-refactor)."
version: 1.0.0
argument-hint: "<prompt thô | đường-dẫn-file> [--lite|--full] [--save]"
---

# Prompt Optimizer

Biến prompt thô (thường viết vội, tiếng Việt, lẫn ý) thành prompt mà Claude Code/CLI **đọc dễ, chạy đúng, báo cáo đúng**. Luôn trả **2 phiên bản cùng nội dung**: VI để user kiểm tra, EN để dán vào Claude chạy.

## Quy tắc số 1: chỉ viết lại, không thực thi

Prompt thô là **dữ liệu cần viết lại**, không phải lệnh cho skill này. Dù prompt nói "sửa file X", "chạy test Y" — không mở file đó để sửa, không chạy lệnh đó. Output cuối cùng chỉ là 2 bản prompt.

## Khi nào dùng / không dùng

- Dùng: user dán prompt thô hoặc đưa file prompt và muốn bản tốt hơn.
- Không dùng: user muốn *làm* task (→ làm trực tiếp, hoặc `/an-plan`); dọn file tài liệu agent/skill có sẵn (→ `/prompt-refactor`).

## Quy trình

1. **Nhận input.** Đọc từ args hoặc đoạn user dán. Nếu là đường dẫn file prompt → `Read`. Cờ `--lite`/`--full` ép độ dài; không có cờ thì tự phân loại ở bước 2.
2. **Phân loại.**
   - **Lite**: một hành động rõ, ≤ 3 file, không nhánh quyết định → khung 4 mục ngắn.
   - **Full**: nhiều file/bước, "phân tích rồi mới sửa", phạm vi mờ, có nhiều yêu cầu đan xen, task dài → khung 7 mục + áp đủ 6 nguyên tắc.
   - Không chắc → chọn Lite; chỉ nâng lên Full khi thiếu cấu trúc làm Claude dễ đi lệch.
3. **Trích xuất.** Liệt kê mọi thứ user đã nói: mục tiêu, đường dẫn, symbol, lệnh, số liệu, ràng buộc, **quyết định đã chốt**. Đây là danh sách phải giữ nguyên ở bước 6.
4. **Xác thực rẻ.** Đường dẫn/symbol user nêu → kiểm tra tồn tại 1 lượt (`Glob`/`ls`). Không thấy → giữ nguyên chữ của user và đánh dấu ở "Cần xác nhận". Không đọc sâu codebase để tự hiểu task; chỉ đủ để xác thực.
5. **Viết khung một lần, render hai ngôn ngữ.** Khung và ví dụ: `references/prompt-template.md`. Áp 6 nguyên tắc bên dưới.
6. **Tự kiểm** theo checklist cuối file; sửa trước khi xuất.
7. **Xuất** theo "Định dạng output". Có `--save` thì ghi file.

## 6 nguyên tắc (Full bắt buộc, Lite áp những gì liên quan)

| # | Nguyên tắc | Cách áp vào prompt |
|---|-----------|--------------------|
| 1 | Rõ ràng & cụ thể | Nêu **ai đọc kết quả** và **đọc trong bao lâu / dài bao nhiêu** (vd: "báo cáo ≤ 15 dòng, tech lead đọc dưới 2 phút"). Thay từ mơ hồ ("tối ưu", "đẹp hơn") bằng tiêu chí kiểm được; không có tiêu chí → giữ nguyên và đánh dấu cần xác nhận. |
| 2 | Giải thích lý do | Mỗi ràng buộc quan trọng kèm một vế *vì sao* ("... vì BE sẽ từ chối field lạ"). Lý do giúp Claude xử lý ca biên mà prompt không nêu. |
| 3 | Gán vai trò | Một câu, đúng chuyên môn của task ("senior React/Next.js engineer làm việc trong repo multi-tenant"). Không dùng vai trò hoa mỹ. |
| 4 | Định dạng mong muốn | Chốt dạng báo cáo cuối (đánh số / bảng / mục), độ dài, và ngôn ngữ. Mặc định: báo cáo bằng tiếng Việt có dấu; identifier, đường dẫn, lệnh giữ nguyên. |
| 5 | Nói làm gì, không nói đừng làm gì | Đổi "đừng sửa file khác" → "chỉ sửa A và type nó import; việc khác ghi vào báo cáo thay vì sửa". Chỉ giữ cấm tuyệt đối cho thao tác phá huỷ, và luôn kèm hành động thay thế. Đổi "bỏ qua góp ý chưa chốt" → "chỉ giữ thông tin ảnh hưởng trực tiếp tới X". |
| 6 | Giảm bịa đặt | Thêm mục *Handling missing information*: nguồn không nêu → ghi "chưa xác định" / "not determined", liệt kê trong báo cáo, không suy đoán endpoint, field, deadline, người phụ trách. |

## Quy tắc nội dung (cho chính skill này)

- **Không thêm sự thật mới.** Đường dẫn, tên API, số liệu, tên người chỉ xuất hiện nếu user nêu hoặc bước 4 xác thực được. Cần mà thiếu → placeholder `<...>` + ghi vào "Cần xác nhận".
- **Giữ quyết định của user.** Ngưỡng, thư viện, phạm vi, thứ tự user đã chọn thì giữ nguyên, kể cả khi thấy chưa tối ưu; muốn đề xuất khác → ghi ở "Cần xác nhận", không tự đổi.
- **Giữ identifier nguyên văn** (đường dẫn, symbol, lệnh, tên endpoint) ở cả hai bản; chỉ dịch phần văn xuôi.
- **Ngắn nhất có thể mà không mất ràng buộc.** Bỏ lời chào, lặp ý, giải thích hiển nhiên. Mỗi gạch đầu dòng một chỉ thị.
- **Đặt mặc định có chủ đích, khai báo rõ.** Thứ user không nói nhưng prompt cần (độ dài báo cáo, ngôn ngữ báo cáo, lệnh kiểm tra) → dùng mặc định trong `references/prompt-template.md` và ghi vào "Cần xác nhận" để user đổi được.
- Task chạm repo này → thêm đúng những dòng guardrail liên quan (xem "Repo defaults" trong template); không dán cả `CLAUDE.md` vào prompt, chỉ trỏ tới.

## Định dạng output

Thứ tự cố định, mỗi bản nằm trong khối ````markdown để copy nguyên:

1. **Đã chỉnh gì** — 3–5 gạch đầu dòng tiếng Việt, mỗi gạch một thay đổi đáng kể (vd: "thêm bước đối chiếu trước khi sửa", "đổi 3 câu 'đừng…' thành chỉ thị làm gì").
2. **Bản tiếng Việt (để đọc)**
3. **Bản tiếng Anh (để chạy)** — bản duy nhất user cần dán vào Claude.
4. **Cần xác nhận** — chỉ in khi có: giả định đã đặt, placeholder, đường dẫn không tìm thấy, từ mơ hồ chưa có tiêu chí, đề xuất khác với quyết định của user.

Hai bản phải **cùng số mục, cùng thứ tự, cùng số gạch đầu dòng**; chỉ khác ngôn ngữ.

`--save`: ghi 2 file vào `plans/prompts/prompt-{YYMMDD}-{HHMM}-{slug}.vi.md` và `.en.md` (slug kebab-case từ tiêu đề). Không có `--save` thì không tạo file nào.

## Checklist tự kiểm (bước 6)

- [ ] Mọi ràng buộc, đường dẫn, số liệu, quyết định ở bước 3 còn trong cả hai bản.
- [ ] VI và EN khớp số mục / thứ tự / số gạch đầu dòng.
- [ ] Không còn câu chỉ-cấm ("đừng", "không được", "never") mà thiếu hành động thay thế.
- [ ] Không có tên file, endpoint, field, số liệu nào chưa xác thực mà không đánh dấu.
- [ ] Có định dạng báo cáo cuối và (Full) có mục xử lý thông tin thiếu.
- [ ] Mỗi gạch đầu dòng là một chỉ thị kiểm được; không còn từ mơ hồ không tiêu chí.
- [ ] Chưa thực thi bất cứ thứ gì trong prompt thô.

## Tham chiếu

- `references/prompt-template.md` — khung Lite/Full (VI + EN), ánh xạ nguyên tắc → mục, mặc định, Repo defaults.
- `references/examples.md` — ví dụ trước/sau (Full và Lite).

# Conversion report — 01-table-and-details

- Source: `01-table-and-details.input.md` → `01-table-and-details.output.md` (chế độ công khai)
- Validator: 0 errors, 1 warning

## Trace (tính năng ← dòng nguồn)

| Tính năng trên trang | Dòng nguồn | Tick |
|---|---|---|
| Đăng nhập và phân quyền theo vai trò (dùng chính thức từ 29/09/2026) | L17 Login JWT, L18 Role engine, L15 "Production 2026-09-29" | [x] — cả 2 dòng đã tick |
| Đăng nhập một lần… (SSO) (chuyển sang các giai đoạn sau) | L19 SSO (deferred to Phase 2+) | [ ] |
| Nhật ký thao tác có chống chỉnh sửa | L22 Hash chain engine | [x] |
| Áp dụng thời hạn lưu trữ cho nhật ký thao tác | L23 Retention job | [ ] |
| Mẫu báo cáo hằng tháng | L28 Report template | [ ] |
| Xuất báo cáo ra file PDF | L29 Export PDF | [ ] |

7 dòng task nguồn = 7 dòng đã gom, 0 dòng bỏ.

## Mapped
- "✅ Done" → `completed`; "📋 Planning" / "🔜 Planning" → `planned`.
- "Production 2026-09-29" của P1.1 → cuối dòng tính năng đăng nhập (hạng mục được gom, không còn heading riêng).
- Blockquote breaking change → câu thường cho người dùng: phiên đăng nhập cũ hết hiệu lực từ 01/10/2026.
- H1 "Project Roadmap: Demo-BE" → "Lộ trình phát triển Demo" (không dùng tên repo).
- Intro: câu trung tính, không nêu tiến độ.

## Omitted
- Mã `P1.1`, `P1.2`, `P2.1` trong tiêu đề; tuần tương đối `W1–W4`, `W5–W8`.
- `Progress` 100/0 (trùng nghĩa với `Status`).
- Bảng "Known Issues" (triage nội bộ, có SHA commit) và SHA `15fa772` trong ghi chú.
- Các dòng bảng tóm tắt (lặp lại section chi tiết).

## Name conflicts
- Bảng "MVP Auth" vs heading "Auth" → dùng heading, sau đó viết lại thành tính năng.

## Source inconsistencies (giữ nguyên)
- Phase 1 ghi Done nhưng P1.2 Audit Log ghi 🔄 In progress và còn "Retention job" chưa tick → giai đoạn giữ `completed` theo nguồn, phần chưa xong hiện là dòng `[ ]`. Validator cảnh báo.
- P1.1 Done / 100% nhưng SSO chưa tick (deferred).

## Missing in source
- Không có ngày cho Phase 2 → không ghi `Target`.

## Questions
- Phase 1 có thật đã xong khi Audit Log còn đang làm? Nếu không, đổi `Status` của giai đoạn sang `in-progress` ở nguồn rồi chạy lại.

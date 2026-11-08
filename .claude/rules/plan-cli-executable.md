# Plan Cho CLI Thực Thi

Áp dụng khi tạo bộ plan trong `plans/` cho một việc sẽ giao cho CLI thực thi (kể cả khi chạy bằng `/an-plan` hay lập tay).

## Khi nào

- Có plan: việc chạm từ 4 file trở lên, hoặc có quyết định thiết kế, hoặc dùng API/thư viện mới.
- Bỏ qua plan: việc nhỏ (≤ 3 file, một hành động rõ). Đưa thẳng prompt cho CLI.

## Làm gì

1. Đọc `docs/design-patterns/reuse-catalog.md` **trước** khi chọn component, hook, layout. Kiểm tra đường dẫn còn tồn tại; không tạo component mới nếu catalog đã có thứ cùng chức năng.
2. Thứ cần mà catalog không có → ghi vào "Catalog gaps" của phase và `plan.md`; không tự tạo trùng chức năng.
3. Viết mỗi `phase-XX-*.md` theo `docs/design-patterns/cli-phase-template.md`: danh sách file được sửa, bảng Reuse, chữ ký, code của phần mới, file mẫu để bắt chước, lệnh Verify, Stop conditions.
4. Giữ các tiêu đề phase của `project-context.md`; mẫu CLI chỉ bổ sung, không thay thế.

## Không làm

- Không sửa skill lập plan (`.claude/skills/an-plan/`) để áp dụng quy tắc này; quy tắc nằm ở đây và ở hai file `docs/design-patterns/` trên.
- Không chép lại toàn bộ catalog hay mẫu vào plan; chỉ trỏ tới và lấy các dòng liên quan.

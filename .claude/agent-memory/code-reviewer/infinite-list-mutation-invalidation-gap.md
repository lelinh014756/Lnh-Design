---
name: infinite-list-mutation-invalidation-gap
description: Khi module có cả queryKey `lists()` (useQuery cũ) và `infiniteLists()` (useInfiniteQuery mới), mutations phải invalidate CẢ HAI — bug lặp lại ở nhiều module trong đợt migrate sang data-table/useTableCore.
metadata:
  type: project
---

Pattern migrate `AdminDataGrid`/MRT → `data-table` (useTableCore, xem [[admin-table-mode-standardization]] nếu có) hay thêm namespace `infiniteLists()`/`infiniteList()` TÁCH RIÊNG khỏi `lists()`/`list()` cũ (đúng — tránh lẫn shape cache `PaginatedResult` phẳng vs `InfiniteData<PaginatedResult>`).

**Vấn đề phát hiện (2026-09-04, review `organizations` module):** các mutation hook (`useCreateX`/`useUpdateX`/`useDeleteX`/`useChangeXActive`) chỉ gọi `invalidateQueries({queryKey: xKeys.lists()})` + `xKeys.detail(id)` — KHÔNG invalidate `xKeys.infiniteLists()`. Vì TanStack Query `invalidateQueries` match theo PREFIX, `["x","list"]` không phải prefix của `["x","infiniteList",...]` → hai namespace này không bao giờ giao nhau.

Hệ quả thực tế: sau Create/Update/Delete/Đổi trạng thái, bảng cuộn-vô-hạn (nguồn dữ liệu chính của screen) KHÔNG tự refresh — item mới không hiện, item đã xoá/đổi trạng thái vẫn lơ lửng — trong khi detail panel bên phải (dùng `useXDetail`, key CÓ được invalidate) lại refresh đúng. Chỉ thoát được bằng bấm nút Refresh thủ công hoặc đổi filter (tạo queryKey mới).

**Đã xác nhận tồn tại ở:** `use-employees-query.ts` (employees — module reference, chưa sửa) VÀ `use-organizations-query.ts` (organizations — bị migrate lặp lại y hệt gap này). Rất có khả năng cùng pattern tồn tại ở `investors`/`departments` (đang/đã migrate cùng đợt — xem git log "Refactor departments and investors tables").

**Why:** đây không phải lỗi riêng của 1 file — là gap kiến trúc khi tách namespace queryKey mà quên đồng bộ invalidation. Vì mirror đúng "khuôn tham chiếu" (employees) nên bug tự nhân bản sang module mới thay vì được sửa.

**How to apply:** Khi review bất kỳ module nào có cả `lists()` và `infiniteLists()` trong cùng file `use-*-query.ts`, PHẢI grep tất cả mutation `onSuccess`/`invalidateQueries` trong file đó và kiểm tra có invalidate `infiniteLists()` không — nếu screen thực tế đọc qua `useXInfiniteList`. Nếu thiếu, đây là finding High priority (không phải nitpick) — list không tự refresh sau CRUD là bug production thật, dễ bị QA/UAT bắt ngay ở smoke test đầu tiên. Đề xuất fix: mỗi mutation invalidate thêm `xKeys.infiniteLists()` (hoặc gộp `xKeys.all` cho gọn nếu chấp nhận over-invalidate).

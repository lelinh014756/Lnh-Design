# Báo Cáo Module: {Module Name}

**Ngày đánh giá:** {DD/MM/YYYY}
**Phạm vi:** {Mô tả nghiệp vụ}
**Trạng thái:** {🟢/🟠/🟡/⚫} {Tên trạng thái}
**Tiến độ tổng thể:** {X}%
**Ngày hoàn thành:** _{Điền ngày dự kiến nếu chưa đạt 100%}_

---

## Tóm Tắt Điều Hành

| Tiêu chí | Trạng thái |
|-----------|------------|
| Giao diện người dùng | {✅/⚠️/❌} |
| Tính năng chính | {✅/⚠️/❌} |
| Kết nối hệ thống | {✅/⚠️/❌} |

---

## 1. Tiến Độ Chức Năng

### 1.1 Giao Diện Người Dùng

| Tính năng | Mô tả | Trạng thái |
|------------|-------|------------|
| {Tính năng 1} | {Mô tả ngắn} | {✅/⚠️/❌} |
| {Tính năng 2} | {Mô tả ngắn} | {✅/⚠️/❌} |

### 1.2 Logic & Tích Hợp API

| Tính năng | Mô tả | Trạng thái |
|------------|-------|------------|
| {API/Tính năng 1} | {Mô tả ngắn} | {✅/⚠️/❌} |
| {API/Tính năng 2} | {Mô tả ngắn} | {✅/⚠️/❌} |

---

## 2. Công Việc Đang Thực Hiện

| Hạng mục | Tiến độ | Ghi chú |
|----------|---------|---------|
| {Hạng mục 1} | {X%} | {Mô tả} |
| {Hạng mục 2} | {X%} | {Mô tả} |

---

## 3. Phụ Thuộc Bên Ngoài

| Hạng mục | Bên phụ trách | Trạng thái | Ghi chú |
|----------|---------------|------------|---------|
| {Hạng mục 1} | {Tên đội/nhóm} | {⏳/✅} | {Mô tả} |
| {Hạng mục 2} | {Tên đội/nhóm} | {⏳/✅} | {Mô tả} |

---

## 4. Kết Luận

Module **{name}** **{đã sẵn sàng/đang phát triển}** với tiến độ **{X}%**.

**Các điều kiện cần thiết để hoàn thành 100%:**
- {Điều kiện 1}
- {Điều kiện 2}

---

## Quy Tắc Lập Báo Cáo

### Cấu trúc bắt buộc

Báo cáo **CHỈ** bao gồm 4 phần chính theo thứ tự:

1. **Tóm Tắt Điều Hành** — bảng 3 tiêu chí với icon trạng thái
2. **1. Tiến Độ Chức Năng** — gồm 1.1 (UI) và 1.2 (Logic/API)
3. **2. Công Việc Đang Thực Hiện** — bảng các hạng mục **đang triển khai** (không liệt kê đã hoàn thành)
4. **3. Phụ Thuộc Bên Ngoài** — bảng phụ thuộc với bên phụ trách
5. **4. Kết Luận** — tóm tắt + điều kiện hoàn thành

**TUYỆT ĐỐI KHÔNG** thêm các phần sau vào báo cáo:
- Cấu trúc module / file tree
- Phân tích chi tiết theo khía cạnh kỹ thuật
- Bảng điểm mạnh / điểm cần cải thiện
- Kỹ thuật / tech stack
- Bất kỳ section nào không có trong template

### Ngôn ngữ và văn phong

| Nên dùng | Tránh dùng |
|-----------|------------|
| "Danh sách quyền hạn" | "Render bảng MRT với data" |
| "Tạo mới / Sửa / Xóa" | "CRUD operations" |
| "Kết nối API" | "Integration layer" |
| "Đang chờ bên BE" | "Pending from backend team" |
| "Tính năng đã hoàn thành" | "Feature is done" |
| "Điều kiện cần thiết" | "Pre-requisites" |
| "Phụ thuộc bên ngoài" | "External dependencies" |

### Trạng thái tính năng

| Icon | Ý nghĩa |
|------|----------|
| ✅ | Hoàn thành, sẵn sàng sử dụng |
| ⚠️ | Cơ bản có, cần bổ sung hoặc có vấn đề cần lưu ý |
| ❌ | Chưa có hoặc chưa triển khai |

### Tiến độ %

| Ngưỡng | Trạng thái |
|--------|------------|
| 0-20% | Giai đoạn đầu |
| 21-50% | Đang phát triển |
| 51-80% | Gần hoàn thành |
| 81-99% | Hoàn thiện cuối |
| 100% | Hoàn thành |

### Quy tắc tính tiến độ tổng thể

**Công thức:**

```
Tiến độ = (Số hạng mục ✅ trong 1.1 + 1.2 + Tổng % từ mục 2) / Tổng số hạng mục × 100%
```

**Bước tính:**

1. **Mục 1:** Đếm số hạng mục ✅ trong 1.1 + 1.2
2. **Mục 2:** Cộng tổng % tiến độ của các hạng mục đang triển khai
3. **Tổng hợp:** Chia cho tổng số hạng mục (1.1 + 1.2 + số hạng mục trong 2)

**Ví dụ:**
- 1.1: 7 hạng mục (7 ✅)
- 1.2: 8 hạng mục (8 ✅)
- 2: 2 hạng mục (0% + 0%)
- Tổng: (7 + 8 + 0) / (7 + 8 + 2) = 15/17 ≈ **88%**

**Lưu ý:**
- ⚠️ không tính là hoàn thành. Nếu hạng mục có vấn đề cần lưu ý nhưng vẫn hoạt động được, có thể cho điểm 50-80% tùy mức độ.
- Mục 2 chỉ chứa hạng mục **chưa có trong 1.1 và 1.2** (tính năng mở rộng)

### Mục 2 - Công Việc Đang Thực Hiện

**QUY TẮC:**
- Chỉ liệt kê **hạng mục đang trong quá trình triển khai** (không trùng với 1.1 và 1.2)
- **KHÔNG** liệt kê hạng mục đã hoàn thành (đã nằm trong 1. Tiến Độ)
- Cột "Trạng thái" → đổi thành **"Tiến độ"** với giá trị **tỷ lệ %**
- Nếu không có hạng mục nào đang triển khai → ghi "Tất cả hạng mục đã hoàn thành"

### Mô tả tính năng

- Mỗi dòng trong bảng Tiến Độ: **mô tả ngắn gọn 1 tính năng**
- Không cần liệt kê file hay component
- Tập trung vào **giá trị nghiệp vụ** cho người dùng

### Mục 4 - Kết Luận

- Viết **1-2 câu** tóm tắt tổng thể, ghi rõ tiến độ và số hạng mục
- Liệt kê **tối đa 3 điều kiện** cần thiết để đạt 100%
- Mỗi điều kiện là **hành động cụ thể**, không mơ hồ
